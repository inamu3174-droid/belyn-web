// Verifies a Razorpay payment, then emails the order to Belyn.
//
// Checks, in order:
//  1. HMAC signature over order_id|payment_id (proves Razorpay issued this payment)
//  2. The Razorpay order is really "paid", its receipt matches our order ref, and its amount
//     equals the total the SERVER computes from the submitted cart (stops "pay for a small
//     cart, submit a big one")
//  3. The order was not already confirmed (stops a replayed verify from emailing/shipping twice)
import crypto from 'crypto';
import send from './_send.js';
import { priceOrder } from '../shared/pricing.js';
import { validateCustomer, cleanRef, buildOrderText } from './_order.js';
import { createDelhiveryShipment, delhiveryConfigured } from './_delhivery.js';

const rzp = async (method, path, body) => {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  const r = await fetch('https://api.razorpay.com/v1' + path, {
    method,
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  if (!KEY_SECRET || !process.env.RAZORPAY_KEY_ID) {
    return res.status(501).json({ message: 'Razorpay is not configured.' });
  }

  const b = req.body || {};
  const orderId = String(b.razorpay_order_id || '');
  const paymentId = String(b.razorpay_payment_id || '');
  const signature = String(b.razorpay_signature || '');
  const order = b.order || {};

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ message: 'Missing payment details.' });
  }

  // 1. signature (constant-time compare)
  const expected = crypto.createHmac('sha256', KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  const a = Buffer.from(expected);
  const s = Buffer.from(signature);
  if (a.length !== s.length || !crypto.timingSafeEqual(a, s)) {
    return res.status(400).json({ message: 'Payment verification failed.' });
  }

  const ref = cleanRef(order.ref);
  const v = validateCustomer(order);
  if (!ref || !v.ok) {
    return res.status(400).json({ message: v.ok ? 'Invalid order reference.' : v.message });
  }
  const priced = priceOrder(order.items, v.shipping.pin, v.shipping.state);
  if (!priced.ok) return res.status(400).json({ message: priced.message });

  // 2. the Razorpay order must match this cart
  const rz = await rzp('GET', `/orders/${encodeURIComponent(orderId)}`);
  if (!rz.ok) {
    return res.status(502).json({ message: 'Could not confirm your payment right now. Please contact us with your payment ID: ' + paymentId });
  }
  const ro = rz.data;
  if (ro.status !== 'paid') {
    return res.status(402).json({ message: 'Payment is not completed yet.' });
  }
  if (ro.receipt !== ref || Number(ro.amount) !== Math.round(priced.total * 100)) {
    return res.status(409).json({
      message: 'Payment does not match this order. Please contact us with your payment ID: ' + paymentId,
    });
  }

  // 3. already confirmed? (idempotent: no second email / shipment)
  if (ro.notes && ro.notes.belyn_confirmed === '1') {
    return res.status(200).json({ ok: true, ref, duplicate: true, total: priced.total });
  }
  // Mark confirmed first to keep the double-delivery window small. If this fails we continue;
  // the email below also carries a Resend idempotency key.
  await rzp('PATCH', `/orders/${encodeURIComponent(orderId)}`, {
    notes: { ...(ro.notes || {}), belyn_confirmed: '1' },
  }).catch(() => null);

  let delhiveryLine = 'Delhivery: not configured';
  let waybill = '';
  let trackingUrl = '';
  if (delhiveryConfigured()) {
    const d = await createDelhiveryShipment({
      ref,
      paymentMethod: 'razorpay',
      customer: v.customer,
      shipping: v.shipping,
      items: priced.lines,
      subtotal: priced.subtotal,
      total: priced.total,
    });
    if (d.ok && d.waybill) {
      waybill = d.waybill;
      trackingUrl = d.trackingUrl || '';
      delhiveryLine = `Delhivery AWB: ${waybill}${trackingUrl ? '\nTrack: ' + trackingUrl : ''}`;
    } else {
      delhiveryLine = `Delhivery: failed - ${d.error || 'unknown error'}`;
    }
  }

  const text = buildOrderText({
    ref,
    payment: 'RAZORPAY (paid)',
    extra: `Razorpay order: ${orderId}\nPayment id: ${paymentId}`,
    priced,
    customer: v.customer,
    shipping: v.shipping,
    notes: v.notes,
    delhiveryLine,
  });

  const r = await send(`New Belyn order ${ref} (PAID)`, text, v.customer.email, `order-${ref}`);
  return res.status(200).json({
    ok: true,
    ref,
    emailSent: !!(r.configured && r.ok),
    total: priced.total,
    waybill: waybill || undefined,
    trackingUrl: trackingUrl || undefined,
  });
}

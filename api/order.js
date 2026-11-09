// Cash on Delivery / manual UPI orders. Online payments go through razorpay-order + razorpay-verify.
// The server prices the cart itself from shared/catalog.json; client prices and totals are ignored.
import send from './_send.js';
import { priceOrder } from '../shared/pricing.js';
import { validateCustomer, cleanRef, buildOrderText } from './_order.js';
import { createDelhiveryShipment, delhiveryConfigured } from './_delhivery.js';

export default async function order(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot

  const ref = cleanRef(b.ref);
  if (!ref) return res.status(400).json({ message: 'Invalid order reference.' });

  // Paid orders must go through Razorpay verification, never through this endpoint.
  const method = String(b.paymentMethod || '').toLowerCase();
  if (method !== 'cod' && method !== 'upi') {
    return res.status(400).json({ message: 'Unsupported payment method for this endpoint.' });
  }

  const v = validateCustomer(b);
  if (!v.ok) return res.status(400).json({ message: v.message });

  const priced = priceOrder(b.items, v.shipping.pin, v.shipping.state);
  if (!priced.ok) return res.status(400).json({ message: priced.message });

  // The cart on screen was priced from an older catalog: ask the customer to refresh.
  if (b.subtotal !== undefined && Number(b.subtotal) !== priced.subtotal) {
    return res.status(409).json({ message: 'Prices have been updated. Please refresh the page and review your cart.' });
  }

  let delhiveryLine = 'Delhivery: not configured';
  let waybill = '';
  let trackingUrl = '';
  if (delhiveryConfigured()) {
    const d = await createDelhiveryShipment({
      ref,
      paymentMethod: method,
      customer: v.customer,
      shipping: v.shipping,
      items: priced.lines,
      subtotal: priced.subtotal,
      total: priced.total,
    });
    if (d.ok && d.waybill) {
      waybill = d.waybill;
      trackingUrl = d.trackingUrl || '';
      delhiveryLine = 'Delhivery AWB: ' + waybill + (trackingUrl ? '\nTrack: ' + trackingUrl : '');
    } else {
      delhiveryLine = 'Delhivery: failed - ' + (d.error || 'unknown error');
    }
  }

  const text = buildOrderText({
    ref,
    payment: method.toUpperCase() + (method === 'upi' ? ' (manual confirmation)' : ' (pay on delivery)'),
    priced,
    customer: v.customer,
    shipping: v.shipping,
    notes: v.notes,
    delhiveryLine,
  });

  // Resend de-duplicates on this key, so a double submit does not email the same order twice.
  const r = await send(`New Belyn order ${ref} (${method.toUpperCase()})`, text, v.customer.email, `order-${ref}`);
  if (!r.configured) {
    return res.status(501).json({ message: 'Orders are not configured. Set RESEND_API_KEY and MAIL_FROM in Vercel.' });
  }
  if (!r.ok) {
    return res.status(502).json({
      message: r.error ? 'Email failed: ' + r.error : 'Could not place your order. Please try again.',
    });
  }
  return res.status(200).json({
    ok: true,
    ref,
    subtotal: priced.subtotal,
    shipping: priced.ship.amount,
    total: priced.total,
    waybill: waybill || undefined,
    trackingUrl: trackingUrl || undefined,
  });
}

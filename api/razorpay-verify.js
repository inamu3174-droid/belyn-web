// Verifies Razorpay payment signature, then emails the order to Belyn via Resend.
import crypto from 'crypto';
import send from './_send.js';
import { calculateShipping, orderTotal } from './_shipping.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  if (!KEY_SECRET) {
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

  const expected = crypto.createHmac('sha256', KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');

  if (expected !== signature) {
    return res.status(400).json({ message: 'Payment verification failed.' });
  }

  if (order.customer && order.shipping && Array.isArray(order.items) && order.items.length) {
    const subtotal = Math.max(0, Number(order.subtotal) || 0);
    const ship = calculateShipping(subtotal, order.shipping.pin, order.shipping.state);
    const total = orderTotal(subtotal, ship.amount);

    const lines = order.items
      .map(
        (i) =>
          `- ${String(i.name).slice(0, 80)} (${String(i.variant).slice(0, 20)}) x ${Number(i.qty) | 0} @ INR ${Number(i.unitPrice) | 0}`,
      )
      .join('\n');
    const text = `Order ${String(order.ref).slice(0, 30)}
Payment: RAZORPAY (paid)
Razorpay order: ${orderId}
Payment id: ${paymentId}

${lines}

Subtotal: INR ${subtotal}
Shipping: ${ship.free ? 'FREE' : 'INR ' + ship.amount} (${ship.zone === 'jk' ? 'Jammu & Kashmir' : 'Pan-India'})
Total: INR ${total}

Customer: ${order.customer.name} | ${order.customer.email} | ${order.customer.phone}
Ship to: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.pin}
Notes: ${String(order.notes || '').slice(0, 1000)}`;

    const r = await send(`New Belyn order ${order.ref} (PAID)`, text, order.customer.email);
    if (!r.configured) {
      return res.status(200).json({ ok: true, ref: order.ref, emailSent: false, total });
    }
    return res.status(200).json({ ok: true, ref: order.ref, emailSent: !!r.ok, total });
  }

  return res.status(200).json({ ok: true, ref: order.ref || orderId });
}

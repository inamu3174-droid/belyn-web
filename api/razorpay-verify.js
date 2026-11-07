// Verifies Razorpay payment signature, then emails the order to Belyn via Resend.
import crypto from 'crypto';
import send from './_send.js';

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

  const expected = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  if (expected !== signature) {
    return res.status(400).json({ message: 'Payment verification failed.' });
  }

  // Payment is authentic — notify Belyn
  if (order.customer && order.shipping && Array.isArray(order.items) && order.items.length) {
    const lines = order.items
      .map((i) => `- ${String(i.name).slice(0, 80)} (${String(i.variant).slice(0, 20)}) x ${Number(i.qty) | 0} @ INR ${Number(i.unitPrice) | 0}`)
      .join('\n');
    const text = `Order ${String(order.ref).slice(0, 30)}
Payment: RAZORPAY (paid)
Razorpay order: ${orderId}
Payment id: ${paymentId}

${lines}

Subtotal: INR ${Number(order.subtotal) | 0}

Customer: ${order.customer.name} | ${order.customer.email} | ${order.customer.phone}
Ship to: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.pin}
Notes: ${String(order.notes || '').slice(0, 1000)}`;

    const r = await send(`New Belyn order ${order.ref} (PAID)`, text, order.customer.email);
    // Even if email is not configured, payment succeeded — still return ok
    if (!r.configured) {
      return res.status(200).json({ ok: true, ref: order.ref, emailSent: false });
    }
    return res.status(200).json({ ok: true, ref: order.ref, emailSent: !!r.ok });
  }

  return res.status(200).json({ ok: true, ref: order.ref || orderId });
}

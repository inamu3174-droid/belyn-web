// Receives an order request and emails it to Belyn.
import send from './_send.js';
export default async function order(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });
  if (!b.customer || !b.shipping || !Array.isArray(b.items) || !b.items.length || b.items.length > 50) {
    return res.status(400).json({ message: 'Invalid order.' });
  }
  const method = ['cod', 'upi', 'razorpay'].includes(b.paymentMethod) ? b.paymentMethod.toUpperCase() : 'COD';
  const lines = b.items
    .map((i) => `- ${String(i.name).slice(0, 80)} (${String(i.variant).slice(0, 20)}) x ${Number(i.qty) | 0} @ INR ${Number(i.unitPrice) | 0}`)
    .join('\n');
  const text = `Order ${String(b.ref).slice(0, 30)}
Payment: ${method}

${lines}

Subtotal: INR ${Number(b.subtotal) | 0}

Customer: ${b.customer.name} | ${b.customer.email} | ${b.customer.phone}
Ship to: ${b.shipping.address}, ${b.shipping.city}, ${b.shipping.state} ${b.shipping.pin}
Notes: ${String(b.notes || '').slice(0, 1000)}`;
  const r = await send(`New Belyn order ${b.ref} (${method})`, text, b.customer.email);
  if (!r.configured) {
    return res.status(501).json({ message: 'Orders are not configured. Set RESEND_API_KEY and MAIL_FROM in Vercel.' });
  }
  if (!r.ok) {
    return res.status(502).json({
      message: r.error ? `Email failed: ${r.error}` : 'Could not place your order. Please try again.',
    });
  }
  return res.status(200).json({ ok: true, ref: b.ref });
}

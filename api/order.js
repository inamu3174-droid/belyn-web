// Receives an ORDER REQUEST (no payment). Emails it to Belyn. Connect a payment gateway before taking money.
// NOTE: prices come from the browser; re-price from your catalog server-side before charging anyone.
const send = require('./_send');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });
  if (!b.customer || !b.shipping || !Array.isArray(b.items) || !b.items.length || b.items.length > 50) return res.status(400).json({ message: 'Invalid order.' });
  const lines = b.items.map((i) => `- ${String(i.name).slice(0, 80)} (${String(i.variant).slice(0, 20)}) x ${Number(i.qty) | 0} @ INR ${Number(i.unitPrice) | 0}`).join('\n');
  const text = `Order ${String(b.ref).slice(0, 30)}\n\n${lines}\n\nSubtotal: INR ${Number(b.subtotal) | 0}\n\nCustomer: ${b.customer.name} | ${b.customer.email} | ${b.customer.phone}\nShip to: ${b.shipping.address}, ${b.shipping.city}, ${b.shipping.state} ${b.shipping.pin}\nNotes: ${String(b.notes || '').slice(0, 1000)}`;
  const r = await send(`New Belyn order ${b.ref}`, text, b.customer.email);
  if (!r.configured) return res.status(501).json({ message: 'Orders are not configured.' });
  return r.ok ? res.status(200).json({ ok: true, ref: b.ref }) : res.status(502).json({ message: 'Could not place your order. Please try again.' });
};

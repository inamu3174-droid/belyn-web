import send from './_send.js';
export default async function contact(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true });
  const name = String(b.name || '').slice(0, 120);
  const email = String(b.email || '').slice(0, 200);
  const phone = String(b.phone || '').slice(0, 30);
  const subject = String(b.subject || '').slice(0, 150);
  const message = String(b.message || '').slice(0, 4000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return res.status(400).json({ message: 'Please check your details.' });
  }
  const r = await send(`Belyn contact: ${subject || name}`, `From: ${name} <${email}>${phone ? `\nPhone: ${phone}` : ''}${subject ? `\nSubject: ${subject}` : ''}\n\n${message}`, email);
  if (!r.configured) return res.status(501).json({ message: 'Email is not configured.' });
  if (!r.ok) {
    return res.status(502).json({
      message: r.error ? `Email failed: ${r.error}` : 'Could not send your message. Please try again.',
    });
  }
  return res.status(200).json({ ok: true });
}

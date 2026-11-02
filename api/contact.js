const send = require('./_send');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot
  const name = String(b.name || '').slice(0, 120), email = String(b.email || '').slice(0, 200), message = String(b.message || '').slice(0, 4000);
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) return res.status(400).json({ message: 'Please check your details.' });
  const r = await send(`Belyn contact: ${name}`, `From: ${name} <${email}>\n\n${message}`, email);
  if (!r.configured) return res.status(501).json({ message: 'Email is not configured.' });
  return r.ok ? res.status(200).json({ ok: true }) : res.status(502).json({ message: 'Could not send your message. Please try again.' });
};

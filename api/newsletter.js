// Newsletter signup. Emails the address to BELYN (MAIL_TO) through Resend; it does not store a list.
import send from './_send.js';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 120;

export default async function newsletter(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // honeypot
  const email = String(b.email || '').trim().toLowerCase();
  if (!emailOk(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });

  const r = await send('New BELYN newsletter signup', `Please add to the newsletter list:\n\n${email}`, email, `nl-${email}`);
  if (!r.configured) return res.status(501).json({ message: 'Newsletter is not configured yet. Please try again later.' });
  if (!r.ok) return res.status(502).json({ message: 'Could not subscribe right now. Please try again.' });
  return res.status(200).json({ ok: true });
}

// Sends an email through Resend (https://resend.com). Needs env vars on Vercel:
//   RESEND_API_KEY, MAIL_FROM (verified sender), MAIL_TO (where Belyn receives orders/messages)
module.exports = async function send(subject, text, replyTo) {
  const { RESEND_API_KEY, MAIL_FROM, MAIL_TO } = process.env;
  if (!RESEND_API_KEY || !MAIL_FROM || !MAIL_TO) return { configured: false };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: MAIL_FROM, to: [MAIL_TO], subject, text, reply_to: replyTo }),
  });
  return { configured: true, ok: r.ok };
};

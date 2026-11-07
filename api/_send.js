// Sends an email through Resend (https://resend.com). Needs env vars on Vercel:
//   RESEND_API_KEY, MAIL_FROM (verified sender), MAIL_TO (where Belyn receives orders/messages)
export default async function send(subject, text, replyTo) {
  const { RESEND_API_KEY, MAIL_FROM } = process.env;
  const MAIL_TO = process.env.MAIL_TO || 'hello@belyn.in';
  if (!RESEND_API_KEY || !MAIL_FROM) return { configured: false };

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [MAIL_TO],
        subject,
        text,
        reply_to: replyTo || undefined,
      }),
    });
    if (r.ok) return { configured: true, ok: true };

    const body = await r.json().catch(() => ({}));
    const detail =
      body?.message ||
      body?.error?.message ||
      (Array.isArray(body?.errors) ? body.errors.map((e) => e.message).join('; ') : null) ||
      `Resend HTTP ${r.status}`;
    return { configured: true, ok: false, error: detail };
  } catch (err) {
    return { configured: true, ok: false, error: err?.message || 'Network error calling Resend' };
  }
}

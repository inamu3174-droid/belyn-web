// Sends an email through Resend (https://resend.com). Needs env vars on Vercel:
//   RESEND_API_KEY, MAIL_FROM (verified sender), MAIL_TO (where Belyn receives orders/messages)
export default async function send(subject, text, replyTo, idempotencyKey) {
  const RESEND_API_KEY = (process.env.RESEND_API_KEY || '').trim();
  let MAIL_FROM = (process.env.MAIL_FROM || '').trim();
  const MAIL_TO = (process.env.MAIL_TO || 'hello@belyn.in').trim();

  // Strip accidental wrapping quotes from env UI / mobile paste
  if (
    (MAIL_FROM.startsWith('"') && MAIL_FROM.endsWith('"')) ||
    (MAIL_FROM.startsWith("'") && MAIL_FROM.endsWith("'"))
  ) {
    MAIL_FROM = MAIL_FROM.slice(1, -1).trim();
  }

  if (!RESEND_API_KEY || !MAIL_FROM) return { configured: false };

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        // Resend ignores a repeat of the same key, so a double submit sends one email.
        ...(idempotencyKey ? { 'Idempotency-Key': String(idempotencyKey).slice(0, 256) } : {}),
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
    return { configured: true, ok: false, error: detail, fromUsed: MAIL_FROM };
  } catch (err) {
    return { configured: true, ok: false, error: err?.message || 'Network error calling Resend' };
  }
}

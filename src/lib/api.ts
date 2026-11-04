const DEMO = (typeof __ENV__ !== 'undefined' ? (__ENV__ as any).VITE_DEMO_MODE : undefined) === 'true';

export async function submitContact(data: {
  name: string;
  email: string;
  message: string;
  website?: string;
}): Promise<{ ok: boolean; demo?: boolean; message?: string }> {
  try {
    const r = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (r.status === 501) return { ok: false, message: 'Email is not configured yet. Please contact us on WhatsApp.' };
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return { ok: false, message: j.message || 'Could not send your message.' };
    }
    return { ok: true };
  } catch {
    return DEMO ? { ok: true, demo: true } : { ok: false, message: 'Network error. Please try again.' };
  }
}

export async function submitOrder(payload: any): Promise<{ ok: boolean; demo?: boolean; ref?: string; message?: string }> {
  try {
    const r = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (r.status === 501) return { ok: false, message: 'Order email is not configured yet. Please contact Belyn on WhatsApp.' };
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return { ok: false, message: j.message || 'Could not place your order.' };
    }
    const j = await r.json().catch(() => ({}));
    return { ok: true, ref: j.ref || payload.ref };
  } catch {
    return DEMO ? { ok: true, demo: true, ref: payload.ref } : { ok: false, message: 'Network error. Please try again.' };
  }
}

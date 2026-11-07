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

export async function createRazorpayOrder(amount: number, receipt: string): Promise<
  { ok: true; id: string; amount: number; currency: string; keyId: string } | { ok: false; message: string }
> {
  try {
    const r = await fetch('/api/razorpay-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, receipt }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.status === 501) return { ok: false, message: j.message || 'Razorpay is not configured yet.' };
    if (!r.ok) return { ok: false, message: j.message || 'Could not start payment.' };
    return { ok: true, id: j.id, amount: j.amount, currency: j.currency || 'INR', keyId: j.keyId };
  } catch {
    return { ok: false, message: 'Network error. Please try again.' };
  }
}

export async function verifyRazorpayPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order: any;
}): Promise<{ ok: boolean; ref?: string; message?: string }> {
  try {
    const r = await fetch('/api/razorpay-verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, message: j.message || 'Payment verification failed.' };
    return { ok: true, ref: j.ref };
  } catch {
    return { ok: false, message: 'Network error while verifying payment.' };
  }
}

/** Load Razorpay checkout.js once */
export function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof (window as any).Razorpay === 'function') {
      resolve(true);
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

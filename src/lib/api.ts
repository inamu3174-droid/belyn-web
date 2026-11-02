import { site } from '../data/site';

export type SubmitResult = { ok: true; demo?: boolean; ref?: string } | { ok: false; message: string };

async function post(url: string, body: unknown): Promise<SubmitResult> {
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: true, ref: data.ref };
    }
    // 404/501 = the serverless function / email provider is not configured yet.
    if (res.status === 404 || res.status === 501) {
      if (site.demoMode) return { ok: true, demo: true };
      return { ok: false, message: 'This form is not connected yet. Please contact us directly.' };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: false, message: data.message || 'Something went wrong. Please try again.' };
  } catch {
    return { ok: false, message: 'Network error. Please check your connection and try again.' };
  }
}

export const submitOrder = (payload: unknown) => post(site.orderEndpoint, payload);
export const submitContact = (payload: unknown) => post(site.contactEndpoint, payload);

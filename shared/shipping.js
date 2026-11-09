// BELYN shipping rules: the ONLY place they are defined.
// Used by the storefront (src/lib/shipping.ts) and the server (api/*).
//
//   Jammu & Kashmir : Rs 100 below Rs 600, FREE at Rs 600 or more
//   Rest of India   : Rs 100 flat

export const JK_FREE_THRESHOLD = 600;
export const FLAT_SHIPPING = 100;

/** Jammu & Kashmir / Ladakh PIN prefixes: 180 to 194 */
export function isJammuKashmirPin(pin) {
  const p = String(pin || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(p)) return false;
  const prefix = parseInt(p.slice(0, 3), 10);
  return prefix >= 180 && prefix <= 194;
}

export function isJammuKashmirState(state) {
  const s = String(state || '').trim().toLowerCase();
  if (!s) return false;
  if (s === 'jk' || s === 'j&k' || s === 'j and k') return true;
  return /jammu|kashmir|ladakh/.test(s);
}

/** PIN wins when it is a full 6-digit PIN; the state is only used when the PIN is missing/invalid. */
export function isJammuKashmir(pin, state) {
  if (isJammuKashmirPin(pin)) return true;
  const digits = String(pin || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(digits)) return isJammuKashmirState(state);
  return false;
}

/** Core shipping charge. Returns { amount, free, zone: 'jk' | 'pan' }. */
export function shippingCharge(subtotal, pin, state) {
  const sub = Math.max(0, Number(subtotal) || 0);
  if (isJammuKashmir(pin, state)) {
    if (sub >= JK_FREE_THRESHOLD) return { amount: 0, free: true, zone: 'jk' };
    return { amount: FLAT_SHIPPING, free: false, zone: 'jk' };
  }
  return { amount: FLAT_SHIPPING, free: false, zone: 'pan' };
}

/** Shipping is charged once, here: goods subtotal + shipping. */
export function orderTotal(subtotal, shippingAmount) {
  return Math.max(0, Number(subtotal) || 0) + Math.max(0, Number(shippingAmount) || 0);
}

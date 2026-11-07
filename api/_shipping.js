// Belyn shipping rules — keep in sync with src/lib/shipping.ts
const JK_FREE_THRESHOLD = 600;
const FLAT_SHIPPING = 100;

function isJammuKashmirPin(pin) {
  const p = String(pin || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(p)) return false;
  const prefix = parseInt(p.slice(0, 3), 10);
  return prefix >= 180 && prefix <= 194;
}

function isJammuKashmirState(state) {
  const s = String(state || '').trim().toLowerCase();
  if (!s) return false;
  if (s === 'jk' || s === 'j&k' || s === 'j and k') return true;
  return /jammu|kashmir|ladakh/.test(s);
}

export function isJammuKashmir(pin, state) {
  if (isJammuKashmirPin(pin)) return true;
  const digits = String(pin || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(digits)) return isJammuKashmirState(state);
  return false;
}

/**
 * Server calculates shipping. Never trust client-sent shipping amount.
 * Incomplete PIN defaults to pan-India ₹100 once order is being placed
 * (checkout requires 6-digit PIN).
 */
export function calculateShipping(subtotal, pin, state) {
  const sub = Math.max(0, Number(subtotal) || 0);
  const jk = isJammuKashmir(pin, state);
  if (jk) {
    if (sub >= JK_FREE_THRESHOLD) {
      return { amount: 0, free: true, zone: 'jk', label: 'FREE' };
    }
    return { amount: FLAT_SHIPPING, free: false, zone: 'jk', label: 'INR 100' };
  }
  return { amount: FLAT_SHIPPING, free: false, zone: 'pan', label: 'INR 100' };
}

export function orderTotal(subtotal, shippingAmount) {
  return Math.max(0, Number(subtotal) || 0) + Math.max(0, Number(shippingAmount) || 0);
}

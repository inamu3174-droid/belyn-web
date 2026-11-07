/** Belyn shipping rules — keep in sync with api/_shipping.js */

export const JK_FREE_THRESHOLD = 600;
export const FLAT_SHIPPING = 100;

/** Jammu & Kashmir PIN prefixes: 180–194 */
export function isJammuKashmirPin(pin: string): boolean {
  const p = String(pin || '').replace(/\D/g, '');
  if (!/^\d{6}$/.test(p)) return false;
  const prefix = parseInt(p.slice(0, 3), 10);
  return prefix >= 180 && prefix <= 194;
}

export function isJammuKashmirState(state: string): boolean {
  const s = String(state || '').trim().toLowerCase();
  if (!s) return false;
  if (s === 'jk' || s === 'j&k' || s === 'j and k') return true;
  return /jammu|kashmir|ladakh/.test(s);
}

export function isJammuKashmir(pin: string, state?: string): boolean {
  if (isJammuKashmirPin(pin)) return true;
  // Only trust state when PIN is missing/invalid
  if (!/^\d{6}$/.test(String(pin || '').replace(/\D/g, ''))) {
    return isJammuKashmirState(state || '');
  }
  return false;
}

export type ShippingResult = {
  amount: number;
  free: boolean;
  zone: 'jk' | 'pan' | 'pending';
  label: string;
  note: string;
};

/**
 * Automatic shipping:
 * - J&K: free at ₹600+, else ₹100
 * - Pan-India: always ₹100
 * - Incomplete PIN: pending (UI can show “enter PIN”)
 */
export function calculateShipping(subtotal: number, pin: string, state = ''): ShippingResult {
  const sub = Math.max(0, Number(subtotal) || 0);
  const digits = String(pin || '').replace(/\D/g, '');

  if (digits.length > 0 && digits.length < 6) {
    return {
      amount: 0,
      free: false,
      zone: 'pending',
      label: 'Enter PIN',
      note: 'Shipping is calculated from your PIN code.',
    };
  }

  const jk = isJammuKashmir(digits, state);

  if (jk) {
    if (sub >= JK_FREE_THRESHOLD) {
      return {
        amount: 0,
        free: true,
        zone: 'jk',
        label: 'FREE',
        note: 'Free shipping within Jammu & Kashmir on orders of ₹600 or more.',
      };
    }
    return {
      amount: FLAT_SHIPPING,
      free: false,
      zone: 'jk',
      label: `₹${FLAT_SHIPPING}`,
      note: `Add ₹${JK_FREE_THRESHOLD - sub} more for free shipping in Jammu & Kashmir.`,
    };
  }

  // No PIN yet — do not invent a charge in the cart; checkout will set it
  if (digits.length === 0 && !isJammuKashmirState(state)) {
    return {
      amount: 0,
      free: false,
      zone: 'pending',
      label: 'At checkout',
      note: 'J&K: free above ₹600. Elsewhere: ₹100 flat.',
    };
  }

  return {
    amount: FLAT_SHIPPING,
    free: false,
    zone: 'pan',
    label: `₹${FLAT_SHIPPING}`,
    note: 'Flat ₹100 shipping across India outside Jammu & Kashmir.',
  };
}

export function orderTotal(subtotal: number, shippingAmount: number): number {
  return Math.max(0, Number(subtotal) || 0) + Math.max(0, Number(shippingAmount) || 0);
}

/**
 * Storefront shipping display. The rules themselves live in shared/shipping.js
 * (the single source used by the server too). This file only adds UI labels.
 */
import {
  JK_FREE_THRESHOLD,
  JK_SHIPPING,
  INDIA_SHIPPING,
  isJammuKashmirState,
  shippingCharge,
  orderTotal,
} from '../../shared/shipping.js';

export { JK_FREE_THRESHOLD, JK_SHIPPING, INDIA_SHIPPING, orderTotal };
export { isJammuKashmirPin, isJammuKashmirState, isJammuKashmir } from '../../shared/shipping.js';

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
 * - Across India: flat ₹150
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

  // No PIN yet: do not invent a charge in the cart; checkout will set it
  if (digits.length === 0 && !isJammuKashmirState(state)) {
    return {
      amount: 0,
      free: false,
      zone: 'pending',
      label: 'At checkout',
      note: `J&K: free from ₹${JK_FREE_THRESHOLD}. Across India: flat ₹${INDIA_SHIPPING}.`,
    };
  }

  const c = shippingCharge(sub, digits, state);

  if (c.zone === 'jk') {
    if (c.free) {
      return {
        amount: 0,
        free: true,
        zone: 'jk',
        label: 'FREE',
        note: 'Free shipping within Jammu & Kashmir on orders of ₹600 or more.',
      };
    }
    return {
      amount: c.amount,
      free: false,
      zone: 'jk',
      label: `₹${c.amount}`,
      note: `Add ₹${JK_FREE_THRESHOLD - sub} more for free shipping in Jammu & Kashmir.`,
    };
  }

  return {
    amount: c.amount,
    free: false,
    zone: 'pan',
    label: `₹${c.amount}`,
    note: `Flat ₹${INDIA_SHIPPING} shipping across India outside Jammu & Kashmir.`,
  };
}

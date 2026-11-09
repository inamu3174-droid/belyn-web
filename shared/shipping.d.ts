export const JK_FREE_THRESHOLD: number;
export const FLAT_SHIPPING: number;
export function isJammuKashmirPin(pin: string): boolean;
export function isJammuKashmirState(state: string): boolean;
export function isJammuKashmir(pin: string, state?: string): boolean;
export function shippingCharge(
  subtotal: number,
  pin: string,
  state?: string,
): { amount: number; free: boolean; zone: 'jk' | 'pan' };
export function orderTotal(subtotal: number, shippingAmount: number): number;

// Server-side order pricing. Prices come ONLY from shared/catalog.json.
// Anything the browser sends about prices, names or totals is ignored.
import catalog from './catalog.json' with { type: 'json' };
import { shippingCharge, orderTotal } from './shipping.js';

export const MAX_QTY = 20;
export const MAX_LINES = 50;

/**
 * Price a cart.
 * items: [{ slug, variantId, qty }]  (a variant label like "50 g" is accepted as a fallback for variantId)
 * Returns { ok: true, lines, subtotal, ship, total } or { ok: false, message }.
 */
export function priceOrder(items, pin, state) {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_LINES) {
    return { ok: false, message: 'Your cart is empty or invalid.' };
  }

  const merged = new Map();
  for (const raw of items) {
    const slug = String(raw?.slug || '');
    const product = catalog.products[slug];
    if (!product) return { ok: false, message: 'A product in your cart is no longer available.' };

    let variantId = String(raw?.variantId || '');
    if (!product.variants[variantId]) {
      const label = String(raw?.variant || '').trim();
      variantId = Object.keys(product.variants).find((id) => product.variants[id].label === label) || '';
    }
    const variant = product.variants[variantId];
    if (!variant) return { ok: false, message: `A size for ${product.name} is no longer available.` };

    const qty = Number(raw?.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      return { ok: false, message: `Invalid quantity for ${product.name}.` };
    }

    const key = slug + '|' + variantId;
    const prev = merged.get(key);
    const nextQty = (prev ? prev.qty : 0) + qty;
    if (nextQty > MAX_QTY) return { ok: false, message: `Maximum ${MAX_QTY} per item.` };
    merged.set(key, {
      slug,
      variantId,
      name: product.name,
      variant: variant.label,
      qty: nextQty,
      unitPrice: variant.price,
    });
  }

  const lines = [...merged.values()].map((l) => ({ ...l, lineTotal: l.unitPrice * l.qty }));
  const subtotal = lines.reduce((n, l) => n + l.lineTotal, 0);
  const ship = shippingCharge(subtotal, pin, state);
  return { ok: true, lines, subtotal, ship, total: orderTotal(subtotal, ship.amount) };
}

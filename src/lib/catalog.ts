import { products, type Product } from '../data/products';

/** Lowest in-stock variant (falls back to the lowest of all variants when sold out). */
export function startingVariant(p: Product) {
  const inStock = p.variants.filter((v) => v.inStock);
  const pool = inStock.length ? inStock : p.variants;
  return pool.reduce((a, b) => (b.price < a.price ? b : a));
}

export const startingPrice = (p: Product) => startingVariant(p).price;
export const isSoldOut = (p: Product) => p.variants.every((v) => !v.inStock);

/** Discount % for a variant, only when a real compareAt price is set in the catalog. */
export function discountPercent(v: { price: number; compareAt?: number }): number {
  if (!v.compareAt || v.compareAt <= v.price) return 0;
  return Math.round(((v.compareAt - v.price) / v.compareAt) * 100);
}

export const hasBestsellers = () => products.some((p) => p.bestseller);

export type SortKey = 'featured' | 'bestselling' | 'newest' | 'price-asc' | 'price-desc';

export interface Filters {
  sort: SortKey;
  /** inclusive "from" price bounds; empty = no bound */
  min: number | null;
  max: number | null;
  inStock: boolean;
  soldOut: boolean;
}

export const defaultFilters: Filters = { sort: 'featured', min: null, max: null, inStock: false, soldOut: false };

export function applyFilters(list: Product[], f: Filters): Product[] {
  let out = list.filter((p) => {
    const price = startingPrice(p);
    if (f.min !== null && price < f.min) return false;
    if (f.max !== null && price > f.max) return false;
    // both ticked or none ticked = show everything
    if (f.inStock !== f.soldOut) {
      const sold = isSoldOut(p);
      if (f.inStock && sold) return false;
      if (f.soldOut && !sold) return false;
    }
    return true;
  });
  const idx = new Map(products.map((p, i) => [p.slug, i]));
  const byIndex = (a: Product, b: Product) => (idx.get(a.slug) ?? 0) - (idx.get(b.slug) ?? 0);
  switch (f.sort) {
    case 'price-asc':
      out = [...out].sort((a, b) => startingPrice(a) - startingPrice(b) || byIndex(a, b));
      break;
    case 'price-desc':
      out = [...out].sort((a, b) => startingPrice(b) - startingPrice(a) || byIndex(a, b));
      break;
    case 'bestselling':
      out = [...out].sort((a, b) => Number(b.bestseller) - Number(a.bestseller) || byIndex(a, b));
      break;
    case 'newest':
      // no publish dates in the catalog: later entries are the newer ones
      out = [...out].sort((a, b) => byIndex(b, a));
      break;
    default:
      out = [...out].sort(byIndex);
  }
  return out;
}

/** Product search over name, subtitle, category, keywords and description. Best matches first. */
export function searchProducts(query: string, limit = 8): Product[] {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (!terms.length) return [];
  const scored: { p: Product; score: number }[] = [];
  for (const p of products) {
    const name = p.name.toLowerCase();
    const kw = p.keywords.map((k) => k.toLowerCase());
    const sub = (p.subtitle || '').toLowerCase();
    const rest = [p.short, p.description, p.category, p.slug.replace(/-/g, ' ')].join(' ').toLowerCase();
    let score = 0;
    let all = true;
    for (const t of terms) {
      let s = 0;
      if (name.includes(t)) s += 10;
      if (kw.some((k) => k === t)) s += 8;
      else if (kw.some((k) => k.includes(t))) s += 5;
      if (sub.includes(t)) s += 4;
      if (rest.includes(t)) s += 1;
      if (s === 0) all = false;
      score += s;
    }
    if (all) scored.push({ p, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((x) => x.p);
}

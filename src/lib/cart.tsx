import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProduct } from '../data/products';

export interface CartLine {
  slug: string;
  variantId: string;
  qty: number;
}
const KEY = 'belyn.cart.v1';
const MAX_QTY = 20;

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (slug: string, variantId: string, qty?: number) => void;
  setQty: (slug: string, variantId: string, qty: number) => void;
  remove: (slug: string, variantId: string) => void;
  clear: () => void;
}
const Ctx = createContext<CartCtx | null>(null);

const load = (): CartLine[] => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    // drop anything that no longer exists in the catalog
    return raw.filter((l: CartLine) => getProduct(l.slug)?.variants.some((v) => v.id === l.variantId) && l.qty > 0);
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable: cart still works for this visit */
    }
  }, [lines]);

  const add = useCallback((slug: string, variantId: string, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.slug === slug && l.variantId === variantId);
      if (i >= 0) return prev.map((l, j) => (j === i ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
      return [...prev, { slug, variantId, qty: Math.min(MAX_QTY, qty) }];
    });
    setOpen(true);
  }, []);
  const setQty = useCallback((slug: string, variantId: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.slug === slug && l.variantId === variantId ? { ...l, qty: Math.min(MAX_QTY, qty) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);
  const remove = useCallback((slug: string, variantId: string) => {
    setLines((prev) => prev.filter((l) => !(l.slug === slug && l.variantId === variantId)));
  }, []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    let subtotal = 0;
    let count = 0;
    for (const l of lines) {
      const v = getProduct(l.slug)?.variants.find((x) => x.id === l.variantId);
      if (v) subtotal += v.price * l.qty;
      count += l.qty;
    }
    return { lines, count, subtotal, open, setOpen, add, setQty, remove, clear };
  }, [lines, open, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside CartProvider');
  return c;
};

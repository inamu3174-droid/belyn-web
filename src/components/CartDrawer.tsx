import { useEffect } from 'react';
import { Link } from '../lib/router';
import { useCart } from '../lib/cart';
import { formatPrice, getProduct } from '../data/products';
import { JK_FREE_THRESHOLD, FLAT_SHIPPING } from '../lib/shipping';
import { ProductVisual } from './Art';

export default function CartDrawer() {
  const { lines, count, subtotal, open, setOpen, setQty, remove } = useCart();

  // Escape closes the drawer; page scroll is locked while it is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  return (
    <>
      <div className={`scrim ${open ? 'is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden={!open} />
      <aside className={`drawer ${open ? 'is-open' : ''}`} aria-label="Shopping cart" aria-hidden={!open}>
        <div className="drawer__head">
          <h2>Cart ({count})</h2>
          <button className="icon-btn" aria-label="Close cart" onClick={() => setOpen(false)}>
            ×
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p>Your cart is empty.</p>
            <Link to="/shop" className="btn btn--lime" onClick={() => setOpen(false)}>
              Shop Now <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer__lines">
              {lines.map((l) => {
                const p = getProduct(l.slug);
                if (!p) return null;
                const variant = p.variants.find((v) => v.id === l.variantId);
                if (!variant) return null;
                return (
                  <div key={l.slug + l.variantId} className="cline">
                    <div className="cline__img" style={{ background: p.bg }}>
                      <ProductVisual product={p} />
                    </div>
                    <div>
                      <Link to={`/product/${p.slug}`} className="cline__name" onClick={() => setOpen(false)}>
                        {p.name}
                      </Link>
                      <p className="cline__var">{variant.label}</p>
                      <div className="qty qty--sm">
                        <button aria-label="Decrease quantity" onClick={() => setQty(l.slug, l.variantId, l.qty - 1)}>
                          −
                        </button>
                        <span>{l.qty}</span>
                        <button aria-label="Increase quantity" onClick={() => setQty(l.slug, l.variantId, l.qty + 1)}>
                          +
                        </button>
                      </div>
                    </div>
                    <div className="cline__side">
                      <span>{formatPrice(variant.price * l.qty)}</span>
                      <button className="link-btn" onClick={() => remove(l.slug, l.variantId)}>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="drawer__foot">
              <div className="drawer__sub">
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="drawer__sub" style={{ fontSize: 13, paddingTop: 0 }}>
                <span>Shipping</span>
                <span>At checkout</span>
              </div>
              <p className="note" style={{ margin: '0 0 8px' }}>
                J&K: free on orders of {formatPrice(JK_FREE_THRESHOLD)}+. Elsewhere: flat {formatPrice(FLAT_SHIPPING)}.
              </p>
              <Link to="/checkout" className="btn btn--dark btn--block" onClick={() => setOpen(false)}>
                Checkout · {formatPrice(subtotal)}
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

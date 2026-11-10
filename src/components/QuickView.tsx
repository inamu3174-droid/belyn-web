import { useEffect, useRef, useState } from 'react';
import { Link } from '../lib/router';
import { useCart } from '../lib/cart';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, type Product } from '../data/products';
import { ProductVisual } from './Art';
import { PriceLine, Rating, VariantChips } from './ProductBits';

export default function QuickView({
  product,
  initialVariantId,
  onClose,
}: {
  product: Product;
  initialVariantId?: string;
  onClose: () => void;
}) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState(initialVariantId || product.variants[0].id);
  const [qty, setQty] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const v = product.variants.find((x) => x.id === variantId) || product.variants[0];

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    document.body.classList.add('no-scroll');
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
      prevFocus?.focus?.();
    };
  }, [onClose]);

  function addToCart() {
    if (!v.inStock) return;
    add(product.slug, v.id, qty);
    onClose();
  }

  return (
    <div className="qv" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`} onClick={onClose}>
      <div className="qv__panel" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="qv__close" aria-label="Close quick view" onClick={onClose}>
          ×
        </button>
        <div className="qv__media" style={{ background: product.bg }}>
          <ProductVisual product={product} />
        </div>
        <div className="qv__body">
          <h2 className="qv__title">{product.name}</h2>
          {product.rating && <Rating value={product.rating.value} count={product.rating.count} />}
          <PriceLine price={v.price} compareAt={v.compareAt} placeholder={PRICES_ARE_PLACEHOLDERS} />
          <p className="qv__desc">{product.description}</p>
          <VariantChips variants={product.variants} value={variantId} onChange={setVariantId} label={product.name} />
          <div className="qv__buy">
            <div className="qty qty--sm" aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>
                +
              </button>
            </div>
            <button type="button" className="shop-btn shop-btn--primary" onClick={addToCart} disabled={!v.inStock}>
              {v.inStock ? `Add to cart · ${formatPrice(v.price * qty)}` : 'Sold out'}
            </button>
          </div>
          <Link to={`/product/${product.slug}`} className="qv__more" onClick={onClose}>
            View full details
          </Link>
        </div>
      </div>
    </div>
  );
}

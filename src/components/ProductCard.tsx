import { useState } from 'react';
import { Link } from '../lib/router';
import { useCart } from '../lib/cart';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, type Product } from '../data/products';
import { discountPercent, isSoldOut, startingVariant } from '../lib/catalog';
import { ProductVisual } from './Art';
import { Rating, PriceLine, VariantChips } from './ProductBits';
import QuickView from './QuickView';
import WishlistButton from './WishlistButton';

/**
 * Product card.
 * - default: compact card used on the home page showcase (unchanged layout)
 * - detailed: collection/search/wishlist grids, with variants, rating, quick view
 */
export default function ProductCard({ product, detailed = false }: { product: Product; detailed?: boolean }) {
  const { add } = useCart();
  const soldOut = isSoldOut(product);
  const first = startingVariant(product);
  const [variantId, setVariantId] = useState(first.id);
  const [justAdded, setJustAdded] = useState(false);
  const [quick, setQuick] = useState(false);

  const v = (detailed && product.variants.find((x) => x.id === variantId)) || first;
  const vSold = !v.inStock;

  function onAdd(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    if (vSold) return;
    add(product.slug, v.id, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  const off = discountPercent(v);

  return (
    <article className={`pcard${detailed ? ' pcard--detailed' : ''}`}>
      <div className="pcard__media" style={{ ['--card' as string]: product.bg }}>
        <Link
          to={`/product/${product.slug}`}
          className="pcard__link"
          aria-label={`${product.name}${soldOut ? ', sold out' : `, from ${formatPrice(first.price)}`}`}
        >
          <ProductVisual product={product} className="pcard__img" />
        </Link>
        {soldOut && <span className="pcard__badge pcard__badge--sold">Sold out</span>}
        {!soldOut && off > 0 && <span className="pcard__badge">{off}% off</span>}
        {detailed && <WishlistButton slug={product.slug} name={product.name} className="pcard__wish" />}
        <div className="pcard__hover">
          <span className="pcard__tag">{product.short}</span>
          <span className="pcard__hname">{product.name}</span>
          <span className="pcard__price">
            From {formatPrice(first.price)}
            {PRICES_ARE_PLACEHOLDERS && <em> placeholder price</em>}
          </span>
          <button type="button" className="pcard__quick" onClick={onAdd} disabled={soldOut}>
            {soldOut ? 'Sold out' : justAdded ? 'Added ✓' : 'Add to cart +'}
          </button>
        </div>
      </div>

      <div className="pcard__meta">
        <div>
          <h3 className="pcard__name">
            <Link to={`/product/${product.slug}`} className="pcard__namelink">
              {product.name}
            </Link>
          </h3>
          {detailed && product.rating && <Rating value={product.rating.value} count={product.rating.count} />}
          {detailed ? (
            <PriceLine price={v.price} compareAt={v.compareAt} placeholder={PRICES_ARE_PLACEHOLDERS} />
          ) : (
            <p className="pcard__from">
              {soldOut ? 'Sold out' : <>From {formatPrice(first.price)}</>}
              {PRICES_ARE_PLACEHOLDERS && <em className="ph-tag">Placeholder price</em>}
            </p>
          )}
        </div>
        {!detailed && (
          <button
            type="button"
            className="pcard__add"
            aria-label={soldOut ? `${product.name} is sold out` : `Add ${product.name} ${v.label} to cart`}
            onClick={onAdd}
            disabled={soldOut}
          >
            {justAdded ? '✓' : '+'}
          </button>
        )}
      </div>

      {detailed && (
        <div className="pcard__extra">
          <VariantChips variants={product.variants} value={variantId} onChange={setVariantId} label={product.name} />
          <div className="pcard__actions">
            <button type="button" className="shop-btn shop-btn--primary" onClick={onAdd} disabled={vSold}>
              {vSold ? 'Sold out' : justAdded ? 'Added ✓' : 'Add to cart'}
            </button>
            <button type="button" className="shop-btn shop-btn--ghost" onClick={() => setQuick(true)}>
              Quick view
            </button>
          </div>
        </div>
      )}

      {quick && <QuickView product={product} initialVariantId={variantId} onClose={() => setQuick(false)} />}
    </article>
  );
}

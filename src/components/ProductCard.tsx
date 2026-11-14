import { useState } from 'react';
import { Link } from '../lib/router';
import { useCart } from '../lib/cart';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, type Product } from '../data/products';
import { discountPercent, isSoldOut, startingVariant } from '../lib/catalog';
import { ProductVisual } from './Art';
import { Rating, PriceLine, VariantChips } from './ProductBits';
import QuickView from './QuickView';
import AddButton from './AddButton';
import WishlistButton from './WishlistButton';

/**
 * One product card, two layouts:
 *  - compact (default): image, ADD button on the image, name, rating, price. Used on the home page.
 *  - detailed: adds size chips, Add to cart and Quick view. Used on collection, search and wishlist grids.
 *
 * On a compact card, ADD adds straight to the cart when the product has one size;
 * with several sizes it opens quick view so the customer picks the size first.
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
  const multi = product.variants.length > 1;

  function flash() {
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  }

  function onAdd(e?: React.MouseEvent) {
    e?.preventDefault();
    e?.stopPropagation();
    if (vSold) return;
    if (!detailed && multi) {
      setQuick(true);
      return;
    }
    add(product.slug, v.id, 1);
    flash();
  }

  const off = discountPercent(v);
  const href = `/product/${product.slug}`;

  return (
    <article className={`pcard ${detailed ? 'pcard--detailed' : 'pcard--compact'}`}>
      <div className="pcard__media" style={{ ['--card' as string]: product.bg }}>
        <Link
          to={href}
          className="pcard__link"
          aria-label={`${product.name}${soldOut ? ', sold out' : `, from ${formatPrice(first.price)}`}`}
        >
          <ProductVisual product={product} className="pcard__img" />
        </Link>
        {soldOut && <span className="pcard__badge pcard__badge--sold">Sold out</span>}
        {!soldOut && off > 0 && <span className="pcard__badge">{off}% off</span>}
        <WishlistButton slug={product.slug} name={product.name} className="pcard__wish" />
      </div>

      <div className="pcard__meta">
        <div className="pcard__info">
          <h3 className="pcard__name">
            <Link to={href} className="pcard__namelink">
              {product.name}
            </Link>
          </h3>
          {product.rating && <Rating value={product.rating.value} count={product.rating.count} />}
          {detailed ? (
            <PriceLine price={v.price} compareAt={v.compareAt} placeholder={PRICES_ARE_PLACEHOLDERS} />
          ) : soldOut ? (
            <p className="pcard__from">Sold out</p>
          ) : (
            <PriceLine
              price={first.price}
              compareAt={first.compareAt}
              placeholder={PRICES_ARE_PLACEHOLDERS}
              from={multi}
            />
          )}
        </div>
      </div>

      {!detailed && (
        <div className="pcard__buy">
          <AddButton
            onClick={onAdd}
            disabled={soldOut}
            state={soldOut ? 'sold' : justAdded ? 'added' : 'idle'}
            label={soldOut ? `${product.name} is sold out` : multi ? `Choose a size for ${product.name}` : `Add ${product.name} to cart`}
          />
        </div>
      )}

      {detailed && (
        <div className="pcard__extra">
          <VariantChips variants={product.variants} value={variantId} onChange={setVariantId} label={product.name} />
          <div className="pcard__actions">
            <AddButton onClick={onAdd} disabled={vSold} state={vSold ? 'sold' : justAdded ? 'added' : 'idle'} label={vSold ? `${product.name} is sold out` : `Add ${product.name} to cart`} />
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

import { Link } from '../lib/router';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, type Product } from '../data/products';
import { isSoldOut, startingVariant } from '../lib/catalog';
import { ProductVisual } from './Art';

/** Product card used on Shop All and Featured: image, name, flavour, sizes, price, View Product. */
export default function ExploreCard({ product }: { product: Product }) {
  const from = startingVariant(product);
  const sold = isSoldOut(product);
  return (
    <article className="xcard">
      <Link to={`/product/${product.slug}`} className="xcard__media" style={{ background: product.bg }} aria-label={product.name}>
        <ProductVisual product={product} className="xcard__img" />
      </Link>
      <div className="xcard__body">
        <h3 className="xcard__name">{product.name}</h3>
        {product.subtitle && <p className="xcard__sub">{product.subtitle}</p>}
        <p className="xcard__label">Available sizes</p>
        <ul className="xcard__sizes">
          {product.variants.map((v) => (
            <li key={v.id} className={v.inStock ? undefined : 'is-out'}>
              {v.label.replace(' ', '')}
            </li>
          ))}
        </ul>
        <div className="xcard__price">
          {!sold && from.compareAt && from.compareAt > from.price && (
            <p>
              MRP <s>{formatPrice(from.compareAt)}</s>
            </p>
          )}
          <p className="xcard__sell">
            {sold ? 'Sold out' : <>Selling price from <strong>{formatPrice(from.price)}</strong></>}
          </p>
          {PRICES_ARE_PLACEHOLDERS && !sold && <em className="ph-tag">Placeholder price</em>}
        </div>
        <Link to={`/product/${product.slug}`} className="shop-btn shop-btn--primary xcard__btn">
          View product
        </Link>
      </div>
    </article>
  );
}

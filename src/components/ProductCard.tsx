import { Link } from '../lib/router';
import { useCart } from '../lib/cart';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, type Product } from '../data/products';
import { ProductVisual } from './Art';

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const v = product.variants[0];
  return (
    <article className="pcard">
      <div className="pcard__media" style={{ ['--card' as string]: product.bg }}>
        <Link to={`/product/${product.slug}`} className="pcard__link" aria-label={`${product.name}, from ${formatPrice(v.price)}`}>
          <ProductVisual product={product} className="pcard__img" />
        </Link>
        <div className="pcard__hover">
          <span className="pcard__tag">{product.short}</span>
          <span className="pcard__hname">{product.name}</span>
          <span className="pcard__price">
            From {formatPrice(v.price)}
            {PRICES_ARE_PLACEHOLDERS && <em> placeholder price</em>}
          </span>
          <button className="pcard__quick" onClick={() => add(product.slug, v.id)}>
            Add to cart +
          </button>
        </div>
      </div>
      <div className="pcard__meta">
        <div>
          <h3 className="pcard__name">{product.name}</h3>
          <p className="pcard__from">
            From {formatPrice(v.price)}
            {PRICES_ARE_PLACEHOLDERS && <em className="ph-tag">Placeholder price</em>}
          </p>
        </div>
        <button className="pcard__add" aria-label={`Add ${product.name} ${v.label} to cart`} onClick={() => add(product.slug, v.id)}>
          +
        </button>
      </div>
    </article>
  );
}

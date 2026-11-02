import { useEffect, useMemo, useState } from 'react';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, getProduct, products } from '../data/products';
import { ProductVisual } from '../components/Art';
import ProductCard from '../components/ProductCard';
import { useCart } from '../lib/cart';
import { Link } from '../lib/router';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';

export default function Product({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { add } = useCart();
  const [variantId, setVariantId] = useState(product?.variants[0].id ?? '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setVariantId(product?.variants[0].id ?? '');
    setQty(1);
    setAdded(false);
  }, [slug, product]);

  const variant = product?.variants.find((v) => v.id === variantId);

  // Product structured data only when prices are real (never publish placeholder prices to search engines).
  const jsonLd = useMemo(
    () =>
      product && variant && !PRICES_ARE_PLACEHOLDERS
        ? {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            brand: { '@type': 'Brand', name: 'BELYN' },
            offers: { '@type': 'Offer', priceCurrency: 'INR', price: variant.price, url: `${location.origin}/product/${product.slug}` },
          }
        : undefined,
    [product, variant],
  );

  useSeo({
    title: product ? product.name : 'Product not found',
    description: product ? product.description : 'This product could not be found.',
    path: `/product/${slug}`,
    noindex: !product,
    jsonLd,
  });

  if (!product || !variant) return <NotFound />;

  return (
    <main className="page pdp">
      <div className="pdp__media" style={{ background: product.bg }}>
        <ProductVisual product={product} />
      </div>
      <div className="pdp__info">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/shop">Shop</Link> / <span>{product.name}</span>
        </nav>
        <h1 className="h-pdp">{product.name.toUpperCase()}</h1>
        <p className="pdp__price">
          {formatPrice(variant.price)}
          {PRICES_ARE_PLACEHOLDERS && <em className="ph-tag">Placeholder price</em>}
        </p>
        <p className="pdp__desc">{product.description}</p>

        <fieldset className="variants">
          <legend>Size</legend>
          {product.variants.map((v) => (
            <label key={v.id} className={`pill ${v.id === variantId ? 'is-on' : ''}`}>
              <input type="radio" name="variant" value={v.id} checked={v.id === variantId} onChange={() => setVariantId(v.id)} />
              {v.label}
            </label>
          ))}
        </fieldset>

        <div className="pdp__buy">
          <div className="qty">
            <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              &minus;
            </button>
            <span aria-live="polite">{qty}</span>
            <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>
              +
            </button>
          </div>
          <button
            className="btn btn--dark btn--grow"
            onClick={() => {
              add(product.slug, variant.id, qty);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1800);
            }}
          >
            {added ? 'Added ✓' : `Add to cart · ${formatPrice(variant.price * qty)}`}
          </button>
        </div>

        <details className="acc">
          <summary>Shipping</summary>
          <p>
            Delivery details are on the <Link to="/policies/shipping">Shipping Policy</Link> page.
          </p>
        </details>
      </div>

      <section className="related" aria-labelledby="rel">
        <h2 id="rel" className="h-section">
          MORE FROM KASHMIR
        </h2>
        <div className="grid">
          {products
            .filter((p) => p.slug !== product.slug)
            .slice(0, 3)
            .map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}

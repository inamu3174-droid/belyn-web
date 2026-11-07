import { useEffect, useMemo, useState } from 'react';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, getProduct, products } from '../data/products';
import { ProductVisual } from '../components/Art';
import ProductCard from '../components/ProductCard';
import { useCart } from '../lib/cart';
import { Link, useRouter } from '../lib/router';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';

export default function Product({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { add } = useCart();
  const { navigate } = useRouter();
  const [variantId, setVariantId] = useState(product?.variants[0].id ?? '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

  // Only real image URLs — never invent or duplicate placeholders
  const gallery = useMemo(() => {
    if (!product) return [] as string[];
    const list: string[] = [];
    if (product.images?.length) {
      for (const src of product.images) if (src && !list.includes(src)) list.push(src);
    } else if (product.image) {
      list.push(product.image);
    }
    return list;
  }, [product]);

  useEffect(() => {
    setVariantId(product?.variants[0].id ?? '');
    setQty(1);
    setAdded(false);
    setImgIndex(0);
    setZoom(false);
  }, [slug, product]);

  const variant = product?.variants.find((v) => v.id === variantId);

  const jsonLd = useMemo(
    () =>
      product && variant && !PRICES_ARE_PLACEHOLDERS
        ? {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            brand: { '@type': 'Brand', name: 'BELYN' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: variant.price,
              url: `${location.origin}/product/${product.slug}`,
            },
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

  function addToCart() {
    add(product!.slug, variant!.id, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function buyNow() {
    add(product!.slug, variant!.id, qty);
    navigate('/checkout');
  }

  const hasGallery = gallery.length > 0;
  const mainSrc = hasGallery ? gallery[Math.min(imgIndex, gallery.length - 1)] : null;

  return (
    <main className="page pdp">
      <div className="pdp__media" style={{ background: product.bg }}>
        {mainSrc ? (
          <div className="pdp-gallery">
            <div className="pdp-gallery__main">
              <button
                type="button"
                className="pdp-gallery__zoom"
                aria-label="Zoom image"
                onClick={() => setZoom(true)}
              >
                <img src={mainSrc} alt={product.name} />
              </button>
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    className="pdp-gallery__nav pdp-gallery__nav--prev"
                    aria-label="Previous image"
                    onClick={() => setImgIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="pdp-gallery__nav pdp-gallery__nav--next"
                    aria-label="Next image"
                    onClick={() => setImgIndex((i) => (i + 1) % gallery.length)}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="pdp-gallery__thumbs" role="list">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    role="listitem"
                    className={`pdp-gallery__thumb${i === imgIndex ? ' is-on' : ''}`}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === imgIndex}
                    onClick={() => setImgIndex(i)}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <ProductVisual product={product} />
        )}
      </div>

      {zoom && mainSrc && (
        <div className="pdp-zoom" role="dialog" aria-label="Zoomed product image" onClick={() => setZoom(false)}>
          <button type="button" className="pdp-zoom__close" aria-label="Close zoom" onClick={() => setZoom(false)}>
            ×
          </button>
          <img src={mainSrc} alt={product.name} onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="pdp__info">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/shop">Shop</Link> / <span>{product.name}</span>
        </nav>
        <h1 className="h-pdp">{product.name.toUpperCase()}</h1>
        {product.subtitle && <p className="pdp__subtitle">{product.subtitle}</p>}
        {product.badge && <p className="pdp__badge">{product.badge}</p>}
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
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              &minus;
            </button>
            <span aria-live="polite">{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>
              +
            </button>
          </div>
          <button type="button" className="btn btn--dark btn--grow" onClick={addToCart}>
            {added ? 'Added ✓' : `Add to cart · ${formatPrice(variant.price * qty)}`}
          </button>
        </div>
        <button type="button" className="btn btn--lime btn--block pdp__buynow" onClick={buyNow}>
          Buy now · {formatPrice(variant.price * qty)}
        </button>

        {product.quality && (
          <details className="acc">
            <summary>Quality & Sourcing</summary>
            <p>{product.quality}</p>
          </details>
        )}

        {product.purity && (
          <details className="acc">
            <summary>Purity</summary>
            <p>{product.purity}</p>
          </details>
        )}

        {product.ingredients && (
          <details className="acc">
            <summary>Ingredients</summary>
            <p>{product.ingredients}</p>
            {product.allergen && <p>{product.allergen}</p>}
          </details>
        )}

        {product.naturalCharacter && (
          <details className="acc">
            <summary>Natural Character</summary>
            <p>{product.naturalCharacter}</p>
          </details>
        )}

        {product.promise && product.promise.length > 0 && (
          <details className="acc">
            <summary>The Belyn Promise</summary>
            <ul>
              {product.promise.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        )}

        {product.brewing && product.brewing.length > 0 && (
          <details className="acc">
            <summary>Brewing Instructions</summary>
            <ol>
              {product.brewing.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </details>
        )}

        {product.nutrition && product.nutrition.length > 0 && (
          <details className="acc">
            <summary>Nutritional Information</summary>
            <p className="pdp__nutrition-note">Per 100g</p>
            <table className="pdp__nutrition">
              <tbody>
                {product.nutrition.map((row) => (
                  <tr key={row.nutrient}>
                    <td>{row.nutrient}</td>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        )}

        {product.care && (
          <details className="acc">
            <summary>Care & Storage</summary>
            <p>{product.care}</p>
            {product.shelfLife && (
              <p>
                <strong>Shelf life:</strong> {product.shelfLife}
              </p>
            )}
          </details>
        )}

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

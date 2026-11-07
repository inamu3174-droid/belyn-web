import { useEffect, useMemo, useState } from 'react';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, getProduct, products } from '../data/products';
import { ProductVisual } from '../components/Art';
import ProductCard from '../components/ProductCard';
import { useCart } from '../lib/cart';
import { Link, useRouter } from '../lib/router';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';
import '../product-page.css';

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`pdpx-acc${open ? ' is-open' : ''}`}>
      <button type="button" className="pdpx-acc__btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <span className="pdpx-acc__icon" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && <div className="pdpx-acc__body">{children}</div>}
    </div>
  );
}

export default function Product({ slug }: { slug: string }) {
  const product = getProduct(slug);
  const { add } = useCart();
  const { navigate } = useRouter();
  const [variantId, setVariantId] = useState(product?.variants[0].id ?? '');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [zoom, setZoom] = useState(false);

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
  const lineTotal = variant.price * qty;

  return (
    <main className="page pdpx">
      <div className="pdpx-hero">
        <div className="pdpx-gallery" style={{ background: product.bg }}>
          {mainSrc ? (
            <>
              <div className="pdpx-gallery__stage">
                <button type="button" className="pdpx-gallery__zoom" aria-label="Zoom image" onClick={() => setZoom(true)}>
                  <img src={mainSrc} alt={product.name} />
                </button>
                {gallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="pdpx-gallery__nav pdpx-gallery__nav--prev"
                      aria-label="Previous image"
                      onClick={() => setImgIndex((i) => (i - 1 + gallery.length) % gallery.length)}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="pdpx-gallery__nav pdpx-gallery__nav--next"
                      aria-label="Next image"
                      onClick={() => setImgIndex((i) => (i + 1) % gallery.length)}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="pdpx-gallery__thumbs" role="list">
                  {gallery.map((src, i) => (
                    <button
                      key={src + i}
                      type="button"
                      role="listitem"
                      className={`pdpx-gallery__thumb${i === imgIndex ? ' is-on' : ''}`}
                      aria-label={`View image ${i + 1}`}
                      aria-current={i === imgIndex}
                      onClick={() => setImgIndex(i)}
                    >
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="pdpx-gallery__art">
              <ProductVisual product={product} />
            </div>
          )}
        </div>

        <div className="pdpx-info">
          <nav className="pdpx-crumbs" aria-label="Breadcrumb">
            <Link to="/shop">Shop</Link>
            <span aria-hidden="true">/</span>
            <span>{product.name}</span>
          </nav>

          <p className="pdpx-kicker">B E L Y N</p>
          <h1 className="pdpx-title">{product.name}</h1>
          {product.subtitle && <p className="pdpx-subtitle">{product.subtitle}</p>}
          {product.badge && <p className="pdpx-badge">{product.badge}</p>}

          <p className="pdpx-price">
            <span>{formatPrice(variant.price)}</span>
            {PRICES_ARE_PLACEHOLDERS && <em className="ph-tag">Placeholder price</em>}
          </p>

          <p className="pdpx-desc">{product.description}</p>

          <div className="pdpx-variants">
            <p className="pdpx-label">Size</p>
            <div className="pdpx-size-grid" role="radiogroup" aria-label="Size">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={v.id === variantId}
                  className={`pdpx-size${v.id === variantId ? ' is-on' : ''}`}
                  onClick={() => setVariantId(v.id)}
                >
                  <span className="pdpx-size__label">{v.label}</span>
                  <span className="pdpx-size__price">{formatPrice(v.price)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pdpx-actions">
            <div className="pdpx-qty" aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}>
                +
              </button>
            </div>
            <button type="button" className="pdpx-btn pdpx-btn--primary" onClick={addToCart}>
              {added ? 'Added to cart' : `Add to cart · ${formatPrice(lineTotal)}`}
            </button>
          </div>

          <button type="button" className="pdpx-btn pdpx-btn--gold" onClick={buyNow}>
            Buy now · {formatPrice(lineTotal)}
          </button>

          <p className="pdpx-ship-note">Shipping calculated at checkout · Free in J&K on orders of ₹600+</p>

          <div className="pdpx-acc-list">
            {product.quality && (
              <Accordion title="Quality & Sourcing">
                <p>{product.quality}</p>
              </Accordion>
            )}
            {product.purity && (
              <Accordion title="Purity">
                <p>{product.purity}</p>
              </Accordion>
            )}
            {product.ingredients && (
              <Accordion title="Ingredients">
                <p>{product.ingredients}</p>
                {product.allergen && <p>{product.allergen}</p>}
              </Accordion>
            )}
            {product.naturalCharacter && (
              <Accordion title="Natural Character">
                <p>{product.naturalCharacter}</p>
              </Accordion>
            )}
            {product.promise && product.promise.length > 0 && (
              <Accordion title="The Belyn Promise">
                <ul>
                  {product.promise.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </Accordion>
            )}
            {product.brewing && product.brewing.length > 0 && (
              <Accordion title="Brewing Instructions">
                <ol>
                  {product.brewing.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </Accordion>
            )}
            {product.nutrition && product.nutrition.length > 0 && (
              <Accordion title="Nutritional Information">
                <p className="pdpx-nutrition-note">Per 100g</p>
                <table className="pdpx-nutrition">
                  <tbody>
                    {product.nutrition.map((row) => (
                      <tr key={row.nutrient}>
                        <td>{row.nutrient}</td>
                        <td>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Accordion>
            )}
            {product.care && (
              <Accordion title="Care & Storage">
                <p>{product.care}</p>
                {product.shelfLife && (
                  <p>
                    <strong>Shelf life:</strong> {product.shelfLife}
                  </p>
                )}
              </Accordion>
            )}
            <Accordion title="Shipping">
              <p>
                Delivery details are on the <Link to="/policies/shipping">Shipping Policy</Link> page. J&K orders of
                ₹600 or more ship free; other destinations have a flat ₹100 fee.
              </p>
            </Accordion>
          </div>
        </div>
      </div>

      {zoom && mainSrc && (
        <div className="pdpx-zoom" role="dialog" aria-label="Zoomed product image" onClick={() => setZoom(false)}>
          <button type="button" className="pdpx-zoom__close" aria-label="Close zoom" onClick={() => setZoom(false)}>
            ×
          </button>
          <img src={mainSrc} alt={product.name} onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <section className="pdpx-related" aria-labelledby="pdpx-rel">
        <div className="pdpx-related__head">
          <h2 id="pdpx-rel">More from Kashmir</h2>
          <Link to="/shop" className="pdpx-related__all">
            View all
          </Link>
        </div>
        <div className="pdpx-related__grid">
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

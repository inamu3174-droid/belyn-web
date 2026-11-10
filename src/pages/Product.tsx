import { useEffect, useMemo, useRef, useState } from 'react';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, getProduct, products, type Product as ProductT } from '../data/products';
import { getCollection } from '../data/collections';
import { discountPercent } from '../lib/catalog';
import { recordViewed, useRecentlyViewed } from '../lib/saved';
import { PriceLine, Rating } from '../components/ProductBits';
import WishlistButton from '../components/WishlistButton';
import { ProductVisual } from '../components/Art';
import ProductCard from '../components/ProductCard';
import { useCart } from '../lib/cart';
import { Link, useRouter } from '../lib/router';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';
import '../product-page.css';
import '../shop.css';

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
  const touchX = useRef<number | null>(null);
  const recent = useRecentlyViewed();

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

  useEffect(() => {
    if (product) recordViewed(product.slug);
  }, [product]);

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
    if (!variant!.inStock) return;
    add(product!.slug, variant!.id, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function buyNow() {
    if (!variant!.inStock) return;
    add(product!.slug, variant!.id, qty);
    navigate('/checkout');
  }

  const hasGallery = gallery.length > 0;
  const mainSrc = hasGallery ? gallery[Math.min(imgIndex, gallery.length - 1)] : null;
  const lineTotal = variant.price * qty;
  const soldOut = !variant.inStock;
  const collection = getCollection(product.category);
  const related = [
    ...products.filter((p) => p.slug !== product.slug && p.category === product.category),
    ...products.filter((p) => p.slug !== product.slug && p.category !== product.category),
  ].slice(0, 4);
  const recentItems = recent
    .filter((sl) => sl !== product.slug)
    .map((sl) => getProduct(sl))
    .filter((p): p is ProductT => !!p)
    .slice(0, 4);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null || gallery.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    setImgIndex((i) => (dx < 0 ? (i + 1) % gallery.length : (i - 1 + gallery.length) % gallery.length));
  };

  return (
    <main className="page pdpx">
      <div className="pdpx-hero">
        <div className="pdpx-gallery" style={{ background: product.bg }}>
          {mainSrc ? (
            <>
              <div className="pdpx-gallery__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
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
            {collection && (
              <>
                <Link to={`/collections/${collection.slug}`}>{collection.title}</Link>
                <span aria-hidden="true">/</span>
              </>
            )}
            <span>{product.name}</span>
          </nav>

          <p className="pdpx-kicker">B E L Y N</p>
          <h1 className="pdpx-title">{product.name}</h1>
          {product.subtitle && <p className="pdpx-subtitle">{product.subtitle}</p>}
          {product.badge && <p className="pdpx-badge">{product.badge}</p>}

          {product.rating && <Rating value={product.rating.value} count={product.rating.count} />}
          <PriceLine price={variant.price} compareAt={variant.compareAt} placeholder={PRICES_ARE_PLACEHOLDERS} />
          <p className={`pdpx-stock${soldOut ? ' is-out' : ''}`} role="status">
            {soldOut ? 'Sold out' : 'In stock'}
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
                  <span className="pdpx-size__price">{v.inStock ? formatPrice(v.price) : 'Sold out'}</span>
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
            <button type="button" className="pdpx-btn pdpx-btn--primary" onClick={addToCart} disabled={soldOut}>
              {soldOut ? 'Sold out' : added ? 'Added to cart' : `Add to cart · ${formatPrice(lineTotal)}`}
            </button>
          </div>

          <button type="button" className="pdpx-btn pdpx-btn--gold" onClick={buyNow} disabled={soldOut}>
            {soldOut ? 'Currently unavailable' : `Buy now · ${formatPrice(lineTotal)}`}
          </button>
          <div className="pdpx-wish">
            <WishlistButton slug={product.slug} name={product.name} withLabel />
          </div>

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
            <Accordion title="Frequently asked questions">
              <h3 className="pdpx-faq-title">Where is this from?</h3>
              <p>BELYN products come from Kashmir, India.</p>
              <h3 className="pdpx-faq-title">How much is shipping?</h3>
              <p>
                Orders within Jammu &amp; Kashmir ship free from ₹600 and cost ₹100 below that. Everywhere else in India
                is a flat ₹150.
              </p>
              {product.care && (
                <>
                  <h3 className="pdpx-faq-title">How should I store it?</h3>
                  <p>{product.care}</p>
                </>
              )}
              {product.shelfLife && (
                <>
                  <h3 className="pdpx-faq-title">What is the shelf life?</h3>
                  <p>{product.shelfLife}</p>
                </>
              )}
              <h3 className="pdpx-faq-title">Still have a question?</h3>
              <p>
                <Link to="/contact">Contact us</Link> and we will help.
              </p>
            </Accordion>
            <Accordion title="Shipping">
              <p>
                Delivery details are on the <Link to="/policies/shipping">Shipping Policy</Link> page. J&K orders of
                ₹600 or more ship free; other destinations have a flat ₹150 fee.
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
          <h2 id="pdpx-rel">You may also like</h2>
          <Link to={collection ? `/collections/${collection.slug}` : '/shop'} className="pdpx-related__all">
            View all
          </Link>
        </div>
        <div className="pdpx-related__grid">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} detailed />
          ))}
        </div>
      </section>

      {recentItems.length > 0 && (
        <section className="pdpx-related pdpx-recent" aria-labelledby="pdpx-recent">
          <div className="pdpx-related__head">
            <h2 id="pdpx-recent">Recently viewed</h2>
          </div>
          <div className="pdpx-related__grid">
            {recentItems.map((p) => (
              <ProductCard key={p.slug} product={p} detailed />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

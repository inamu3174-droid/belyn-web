import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from '../../lib/router';
import { useCart } from '../../lib/cart';
import { PRICES_ARE_PLACEHOLDERS, products, type Product } from '../../data/products';
import { isSoldOut, startingVariant } from '../../lib/catalog';
import { ProductVisual } from '../Art';
import { PriceLine } from '../ProductBits';
import QuickView from '../QuickView';
import AddButton from '../AddButton';

/** Category shortcuts + featured product cards. The five shortcuts map one-to-one to the five cards. */
const picks: { slug: string; label: string; icon: ReactNode }[] = [
  {
    slug: 'kashmiri-white-honey',
    label: 'White Honey',
    icon: (
      <>
        <rect x="14" y="6" width="20" height="6" rx="2" />
        <path d="M12 12h24v3c3 2 4 5 4 9v12c0 4-3 7-7 7H15c-4 0-7-3-7-7V24c0-4 1-7 4-9v-3Z" />
        <path d="M17 24c2 2 4 2 7 0s5-2 7 0" />
        <path d="M36 40c0 2 1.5 3 1.5 4.5a1.8 1.8 0 0 1-3.6 0C34 43 36 42 36 40Z" />
      </>
    ),
  },
  {
    slug: 'raw-mongra-saffron',
    label: 'Raw Mongra Saffron',
    icon: (
      <>
        <path d="M24 42V24" />
        <path d="M24 26C14 26 8 20 6 11c9 0 16 4 18 15Z" />
        <path d="M24 26c10 0 16-6 18-15-9 0-16 4-18 15Z" />
        <path d="M24 24c-5-3-6-9 0-17 6 8 5 14 0 17Z" />
      </>
    ),
  },
  {
    slug: 'kashmiri-saffron-kahwa',
    label: 'Saffron Kahwa',
    icon: (
      <>
        <path d="M6 22h30v8c0 7-6 12-15 12S6 37 6 30v-8Z" />
        <path d="M36 25h3a5 5 0 0 1 0 10h-4" />
        <path d="M13 44h16" />
        <path d="M15 9c-2 3 2 4 0 8M23 9c-2 3 2 4 0 8M31 9c-2 3 2 4 0 8" />
      </>
    ),
  },
  {
    slug: 'kashmiri-mamra-almonds',
    label: 'Mamra Almonds',
    icon: (
      <>
        <path d="M5 29C5 17 14 8 25 8c3 9-1 25-14 28-3 .5-6-2-6-7Z" />
        <path d="M17 33c5-6 9-12 11-19" />
        <path d="M27 18c8-1 16 5 16 14 0 4-3 7-8 7-9 0-13-9-8-21Z" />
      </>
    ),
  },
  {
    slug: 'kashmiri-walnut-kernels',
    label: 'Walnut Kernels',
    icon: (
      <>
        <circle cx="24" cy="24" r="19" />
        <path d="M24 5v38" />
        <path d="M24 13c-6-2-11 2-11 8 0 3 1 5 3 6-2 2-2 6 1 8 2 2 5 2 7 1" />
        <path d="M24 13c6-2 11 2 11 8 0 3-1 5-3 6 2 2 2 6-1 8-2 2-5 2-7 1" />
      </>
    ),
  },
];

function Card({ product }: { product: Product }) {
  const { add } = useCart();
  const first = startingVariant(product);
  const multi = product.variants.length > 1;
  const sold = isSoldOut(product);
  const [added, setAdded] = useState(false);
  const [quick, setQuick] = useState(false);
  const sizes = product.variants.map((v) => v.label.replace(/\s+/g, '')).join(' · ');

  function onAdd() {
    if (sold) return;
    if (multi) {
      setQuick(true);
      return;
    }
    add(product.slug, first.id, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <article className="ff-card">
      <Link to={`/product/${product.slug}`} className="ff-card__media" style={{ ['--card' as string]: product.bg }} aria-label={product.name}>
        <ProductVisual product={product} className="ff-card__img" />
      </Link>
      <div className="ff-card__body">
        <h3 className="ff-card__name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="ff-card__detail">{sizes}</p>
        <div className="ff-card__buy">
          <div className="ff-card__price">
            {sold ? <span>Sold out</span> : <PriceLine price={first.price} compareAt={first.compareAt} placeholder={PRICES_ARE_PLACEHOLDERS} from={multi} />}
          </div>
          <AddButton
            onClick={onAdd}
            disabled={sold}
            state={sold ? 'sold' : added ? 'added' : 'idle'}
            label={sold ? `${product.name} is sold out` : multi ? `Choose a size for ${product.name}` : `Add ${product.name} to cart`}
          />
        </div>
      </div>
      {quick && <QuickView product={product} initialVariantId={first.id} onClose={() => setQuick(false)} />}
    </article>
  );
}

export default function FeaturedFocus() {
  const items = picks.map((p) => ({ ...p, product: products.find((x) => x.slug === p.slug) })).filter((p): p is typeof p & { product: Product } => !!p.product);
  const track = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);
  const lock = useRef(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (Date.now() < lock.current) return;
        const kids = Array.from(el.children) as HTMLElement[];
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) return setOn(kids.length - 1);
        let best = 0;
        let dist = Infinity;
        kids.forEach((k, n) => {
          const d = Math.abs(k.offsetLeft - el.scrollLeft);
          if (d < dist) {
            dist = d;
            best = n;
          }
        });
        setOn(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function go(n: number) {
    const el = track.current;
    const kid = el?.children[n] as HTMLElement | undefined;
    if (el && kid) {
      setOn(n);
      lock.current = Date.now() + 900;
      el.scrollTo({ left: kid.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    }
  }

  return (
    <section className="ff" aria-labelledby="ff-title">
      <h2 id="ff-title" className="ff__title">
        Products in Focus:
        <span>A Few Favourites from BELYN</span>
      </h2>
      <div className="ff__tabs" role="group" aria-label="Jump to a product">
        {items.map((p, n) => (
          <button key={p.slug} type="button" className={`ff__tab${n === on ? ' is-on' : ''}`} aria-current={n === on} onClick={() => go(n)}>
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {p.icon}
            </svg>
            <span>{p.label}</span>
          </button>
        ))}
      </div>
      <div className="ff__track" ref={track} tabIndex={-1}>
        {items.map((p) => (
          <div key={p.slug} className="ff__slide">
            <Card product={p.product} />
          </div>
        ))}
      </div>
    </section>
  );
}

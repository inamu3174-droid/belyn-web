import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { Scene } from '../components/Art';
import { allCollection, collections, getCollection, productsIn } from '../data/collections';
import { applyFilters, defaultFilters, hasBestsellers, type Filters, type SortKey } from '../lib/catalog';
import { Link } from '../lib/router';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';
import '../shop.css';

const PAGE_SIZE = 12;

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'bestselling', label: 'Bestselling' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price: low to high' },
  { key: 'price-desc', label: 'Price: high to low' },
];

const toNum = (s: string): number | null => {
  if (s.trim() === '') return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export default function Collection({ slug }: { slug: string }) {
  const collection = getCollection(slug);
  const base = useMemo(() => (collection ? productsIn(collection) : []), [collection]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [minText, setMinText] = useState('');
  const [maxText, setMaxText] = useState('');
  const [shown, setShown] = useState(PAGE_SIZE);
  const [panel, setPanel] = useState(false);

  // fresh filters whenever the collection changes
  useEffect(() => {
    setFilters(defaultFilters);
    setMinText('');
    setMaxText('');
    setShown(PAGE_SIZE);
    setPanel(false);
  }, [slug]);

  // new filters/sort start again from the first page
  useEffect(() => setShown(PAGE_SIZE), [filters]);

  useSeo({
    title: collection ? `${collection.title} | BELYN` : 'Collection not found',
    description: collection ? `${collection.intro} Purely from Kashmir.` : 'This collection could not be found.',
    path: slug === 'all' ? '/shop' : `/collections/${slug}`,
    noindex: !collection,
  });

  if (!collection) return <NotFound />;

  const list = applyFilters(base, filters);
  const visible = list.slice(0, shown);
  const active =
    filters.min !== null || filters.max !== null || filters.inStock || filters.soldOut || filters.sort !== 'featured';
  const sorts = hasBestsellers() ? SORTS : SORTS.filter((s) => s.key !== 'bestselling');

  const reset = () => {
    setFilters(defaultFilters);
    setMinText('');
    setMaxText('');
  };

  return (
    <main className="page coll">
      <header className="coll__banner" data-reveal>
        <div className="coll__text">
          <p className="eyebrow">BELYN</p>
          <h1 className="h-page coll__title">{collection.title}</h1>
          <p className="lede">{collection.intro}</p>
          <p className="coll__count">
            {base.length} {base.length === 1 ? 'product' : 'products'}
          </p>
        </div>
        <div className="coll__art" aria-hidden="true">
          <Scene kind={collection.kind} />
        </div>
      </header>

      <nav className="coll__tabs" aria-label="Collections">
        {[allCollection, ...collections].map((c) => (
          <Link
            key={c.slug}
            to={c.slug === 'all' ? '/shop' : `/collections/${c.slug}`}
            className={`coll__tab${c.slug === collection.slug ? ' is-on' : ''}`}
            aria-current={c.slug === collection.slug ? 'page' : undefined}
          >
            {c.title}
          </Link>
        ))}
      </nav>

      {base.length === 0 ? (
        <section className="coll__empty" role="status">
          <h2>Coming soon</h2>
          <p>We&rsquo;re preparing this collection. For gifting enquiries, get in touch and we&rsquo;ll help you directly.</p>
          <div className="coll__empty-actions">
            <Link to="/contact" className="shop-btn shop-btn--primary">
              Contact us
            </Link>
            <Link to="/shop" className="shop-btn shop-btn--ghost">
              Shop all
            </Link>
          </div>
        </section>
      ) : (
        <>
          <div className="coll__bar">
            <button
              type="button"
              className="shop-btn shop-btn--ghost coll__filter-toggle"
              aria-expanded={panel}
              aria-controls="coll-filters"
              onClick={() => setPanel((v) => !v)}
            >
              Filters{active ? ' •' : ''}
            </button>
            <p className="coll__results" role="status" aria-live="polite">
              {list.length} of {base.length} {base.length === 1 ? 'product' : 'products'}
            </p>
            <label className="coll__sort">
              <span>Sort by</span>
              <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value as SortKey })}>
                {sorts.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div id="coll-filters" className={`coll__filters${panel ? ' is-open' : ''}`}>
            <fieldset className="coll__fieldset">
              <legend>Price (₹, starting price)</legend>
              <div className="coll__range">
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="Min"
                  aria-label="Minimum price"
                  value={minText}
                  onChange={(e) => {
                    setMinText(e.target.value);
                    setFilters({ ...filters, min: toNum(e.target.value) });
                  }}
                />
                <span aria-hidden="true">–</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  placeholder="Max"
                  aria-label="Maximum price"
                  value={maxText}
                  onChange={(e) => {
                    setMaxText(e.target.value);
                    setFilters({ ...filters, max: toNum(e.target.value) });
                  }}
                />
              </div>
            </fieldset>
            <fieldset className="coll__fieldset">
              <legend>Availability</legend>
              <label className="coll__check">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                />
                In stock
              </label>
              <label className="coll__check">
                <input
                  type="checkbox"
                  checked={filters.soldOut}
                  onChange={(e) => setFilters({ ...filters, soldOut: e.target.checked })}
                />
                Sold out
              </label>
            </fieldset>
            {active && (
              <button type="button" className="link-btn coll__clear" onClick={reset}>
                Clear all filters
              </button>
            )}
          </div>

          {list.length === 0 ? (
            <section className="coll__empty" role="status">
              <h2>No products match</h2>
              <p>Try widening the price range or clearing the filters.</p>
              <button type="button" className="shop-btn shop-btn--primary" onClick={reset}>
                Clear filters
              </button>
            </section>
          ) : (
            <>
              <div className="grid coll__grid">
                {visible.map((p) => (
                  <ProductCard key={p.slug} product={p} detailed />
                ))}
              </div>
              {visible.length < list.length && (
                <div className="coll__more">
                  <p className="note">
                    Showing {visible.length} of {list.length}
                  </p>
                  <button type="button" className="shop-btn shop-btn--ghost" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}

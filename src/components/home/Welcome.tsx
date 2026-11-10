import { useMemo, useRef, useState } from 'react';
import { Link } from '../../lib/router';
import { products } from '../../data/products';
import { productsIn } from '../../data/collections';
import { liveCollections } from '../../data/home';
import { Scene } from '../Art';
import ProductCard from '../ProductCard';

const MAX = 8;

/** "Welcome to BELYN": round category tabs filter the product grid underneath. */
export default function Welcome() {
  const cols = useMemo(liveCollections, []);
  const [tab, setTab] = useState('all');
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const tabs = [{ slug: 'all', title: 'All', kind: 'honey' as const }, ...cols.map((c) => ({ slug: c.slug, title: c.title, kind: c.kind }))];
  const active = cols.find((c) => c.slug === tab);
  const list = (active ? productsIn(active) : products).slice(0, MAX);
  const viewAll = active ? `/collections/${active.slug}` : '/shop';

  function onKey(e: React.KeyboardEvent, idx: number) {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = tabs[(idx + d + tabs.length) % tabs.length];
    setTab(next.slug);
    refs.current[next.slug]?.focus();
  }

  return (
    <section className="wel" aria-labelledby="welcome-title">
      <header className="wel__head">
        <h2 id="welcome-title" className="h-sec">
          Welcome to BELYN
        </h2>
        <p className="wel__sub">Purely from Kashmir.</p>
      </header>

      <div className="ctabs" role="tablist" aria-label="Shop by category">
        {tabs.map((t, idx) => (
          <button
            key={t.slug}
            ref={(el) => {
              refs.current[t.slug] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.slug}`}
            aria-selected={tab === t.slug}
            aria-controls="welcome-panel"
            tabIndex={tab === t.slug ? 0 : -1}
            className={`ctab${tab === t.slug ? ' is-on' : ''}`}
            onClick={() => setTab(t.slug)}
            onKeyDown={(e) => onKey(e, idx)}
          >
            <span className="ctab__disc">
              {t.slug === 'all' ? <span className="ctab__all">B</span> : <Scene kind={t.kind} />}
            </span>
            <span className="ctab__label">{t.title}</span>
          </button>
        ))}
      </div>

      <div id="welcome-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="pgrid">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="wel__more">
        <Link to={viewAll} className="shop-btn shop-btn--ghost">
          View all{active ? ` ${active.title.toLowerCase()}` : ''}
        </Link>
      </div>
    </section>
  );
}


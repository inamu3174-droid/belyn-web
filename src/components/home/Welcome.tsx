import { useMemo, useRef, useState } from 'react';
import { Link } from '../../lib/router';
import { products } from '../../data/products';
import { giftingTabs } from '../../data/home';
import ProductCard from '../ProductCard';

const MAX = 8;

const icons: Record<string, JSX.Element> = {
  all: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" />
    </>
  ),
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="11" rx="1.5" />
      <path d="M3.5 13h17M12 9v11M12 9c-1.5-4.5-5.5-4-5.5-1.8C6.5 8.4 8 9 12 9Zm0 0c1.5-4.5 5.5-4 5.5-1.8C17.5 8.4 16 9 12 9Z" />
    </>
  ),
  office: (
    <>
      <path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4h7A1.5 1.5 0 0 1 15 5.5V20M15 10h3.5A1.5 1.5 0 0 1 20 11.5V20M3 20h18" />
      <path d="M8.5 8h3M8.5 11.5h3M8.5 15h3" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" />
    </>
  ),
  bag: (
    <>
      <path d="M5.5 8h13l-1 12h-11l-1-12Z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </>
  ),
};

const tabs = [{ id: 'all', label: 'All Products', icon: 'all' }, ...giftingTabs.map((g) => ({ id: g.id, label: g.label, icon: g.icon }))];

/**
 * "Welcome to BELYN": heading, tagline and five tabs. "All Products" shows the product grid;
 * each gifting tab shows a short note and opens the contact form pre-filled for that enquiry.
 */
export default function Welcome() {
  const [tab, setTab] = useState('all');
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const list = useMemo(() => products.slice(0, MAX), []);
  const gift = giftingTabs.find((g) => g.id === tab);

  function onKey(e: React.KeyboardEvent, idx: number) {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = tabs[(idx + d + tabs.length) % tabs.length];
    setTab(next.id);
    refs.current[next.id]?.focus();
  }

  return (
    <section className="wel" id="featured" aria-labelledby="welcome-title">
      <header className="wel__head">
        <h2 id="welcome-title" className="wel__title">
          <span className="wel__rule" aria-hidden="true" />
          Welcome to BELYN
          <span className="wel__rule" aria-hidden="true" />
        </h2>
        <p className="wel__tag">From our home to yours, bringing you nature just as it should be.</p>
      </header>

      <div className="wtabs" role="tablist" aria-label="Browse BELYN">
        {tabs.map((t, idx) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[t.id] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls="welcome-panel"
            tabIndex={tab === t.id ? 0 : -1}
            className={`wtab${tab === t.id ? ' is-on' : ''}`}
            onClick={() => setTab(t.id)}
            onKeyDown={(e) => onKey(e, idx)}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icons[t.icon]}
            </svg>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div id="welcome-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {gift ? (
          <div className="wel__gift">
            <h3>{gift.title}</h3>
            <p>{gift.text}</p>
            <Link to={`/contact?topic=${gift.id}`} className="shop-btn shop-btn--primary">
              Enquire now
            </Link>
          </div>
        ) : (
          <>
            <div className="pgrid">
              {list.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
            <div className="wel__more">
              <Link to="/shop" className="shop-btn shop-btn--ghost">
                View all products
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

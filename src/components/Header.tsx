import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { useCart } from '../lib/cart';
import { products } from '../data/products';

const Bag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8a3 3 0 0 1 6 0" />
  </svg>
);
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export default function Header() {
  const { path, navigate } = useRouter();
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return products
      .filter((p) => {
        const hay = [p.name, p.subtitle, p.short, p.description, p.slug].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    setMenu(false);
    setSearchOpen(false);
    setQuery('');
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menu || searchOpen);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu, searchOpen]);

  useEffect(() => {
    if (searchOpen) requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [searchOpen]);

  return (
    <header className="header header--ref">
      <div className="header__inner">
        <div className="header__left">
          <button
            className="burger burger--3"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <Link to="/" className="logo" aria-label="Belyn home">
          <img src="/images/logo.svg" alt="Belyn" width="120" height="38" />
        </Link>

        <div className="header__right">
          <button className="icon-btn hdr-icon" aria-label="Search products" onClick={() => setSearchOpen(true)}>
            <SearchIcon />
          </button>
          <button
            className="cart-btn"
            aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}
            onClick={() => setOpen(true)}
          >
            <Bag />
            <span className="cart-btn__count">{count}</span>
          </button>
        </div>
      </div>

      <div className="announce" role="region" aria-label="Brand promise">
        <p>
          <span>100% PURE &amp; RAW</span>
          <span className="announce__sep" aria-hidden="true">|</span>
          <span>DIRECT FROM KASHMIR</span>
          <span className="announce__sep" aria-hidden="true">|</span>
          <span>LAB TESTED FOR PURITY</span>
          <span className="announce__sep" aria-hidden="true">|</span>
          <span>NATURE, LEFT UNALTERED</span>
        </p>
      </div>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-label="Search products">
          <div className="search-overlay__bar">
            <SearchIcon />
            <input
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search honey, saffron, almonds…"
              aria-label="Search products"
            />
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setSearchOpen(false);
                setQuery('');
              }}
            >
              Close
            </button>
          </div>
          <div className="search-overlay__results">
            {query.trim() && results.length === 0 && <p className="note">No products match “{query.trim()}”.</p>}
            {results.map((p) => (
              <button
                key={p.slug}
                type="button"
                className="search-result"
                onClick={() => {
                  setSearchOpen(false);
                  setQuery('');
                  navigate(`/product/${p.slug}`);
                }}
              >
                <span className="search-result__name">{p.name}</span>
                {p.subtitle && <span className="search-result__sub">{p.subtitle}</span>}
              </button>
            ))}
            {!query.trim() && <p className="note">Try “honey”, “saffron”, “almonds” or “kahwa”.</p>}
          </div>
        </div>
      )}

      <div id="mobile-menu" className={`mobile-menu ${menu ? 'is-open' : ''}`} aria-hidden={!menu}>
        <Link to="/shop" tabIndex={menu ? 0 : -1}>
          Shop
        </Link>
        <Link to="/story" tabIndex={menu ? 0 : -1}>
          Our Story
        </Link>
        <Link to="/contact" tabIndex={menu ? 0 : -1}>
          Contact
        </Link>
        <p>Born in Kashmir. Crafted with Purity.</p>
      </div>
    </header>
  );
}

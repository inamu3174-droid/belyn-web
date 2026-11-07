import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { useCart } from '../lib/cart';
import { products } from '../data/products';

const Bag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 7h12l1.2 13H4.8L6 7Zm3-1a3 3 0 0 1 6 0h-2a1 1 0 0 0-2 0H9Z" />
  </svg>
);
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);
const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
  </svg>
);

export default function Header() {
  const { path, navigate } = useRouter();
  const { count, setOpen } = useCart();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const shopRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isHome = path === '/';

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    return products.filter((p) => {
      const hay = [p.name, p.subtitle, p.short, p.description, p.slug].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    }).slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (!isHome) return setSolid(true);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSolid(window.scrollY > window.innerHeight * 0.38));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isHome]);

  useEffect(() => {
    setMenu(false);
    setShopOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
    setQuery('');
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menu || searchOpen);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false);
        setShopOpen(false);
        setSearchOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu, searchOpen]);

  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [searchOpen]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) setShopOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <header className={`header ${isHome && !solid ? 'on-lime' : 'on-sheet'}`}>
      <div className="header__inner">
        <nav className="header__left" aria-label="Primary">
          <button className="burger" aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu} aria-controls="mobile-menu" onClick={() => setMenu((v) => !v)}>
            <span />
            <span />
          </button>
          <div className="nav-shop" ref={shopRef}>
            <button className="nav-link" aria-expanded={shopOpen} aria-haspopup="true" onClick={() => setShopOpen((v) => !v)}>
              Shop
              <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
                <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            {shopOpen && (
              <div className="dropdown">
                <Link to="/shop">All products</Link>
                {products.map((p) => (
                  <Link key={p.slug} to={`/product/${p.slug}`}>
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <Link to="/" className="logo" aria-label="Belyn home">
          <img src="/images/logo.svg" alt="Belyn" width="120" height="38" />
        </Link>

        <div className="header__right">
          <Link className="nav-link hide-sm" to="/story">
            Our Story
          </Link>
          <Link className="nav-link hide-sm" to="/contact">
            Contact
          </Link>
          <button className="icon-btn hdr-icon" aria-label="Search products" onClick={() => { setSearchOpen(true); setProfileOpen(false); }}>
            <SearchIcon />
          </button>
          <button className="icon-btn hdr-icon" aria-label="Account" aria-expanded={profileOpen} onClick={() => setProfileOpen((v) => !v)}>
            <ProfileIcon />
          </button>
          <button className="cart-btn" aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`} onClick={() => setOpen(true)}>
            <Bag />
            {count > 0 && <span className="cart-btn__count">{count}</span>}
          </button>
        </div>
      </div>

      {profileOpen && (
        <div className="hdr-panel" role="dialog" aria-label="Account">
          <p className="hdr-panel__title">Your account</p>
          <p className="hdr-panel__text">For order help or account questions, reach us anytime.</p>
          <Link to="/contact" className="btn btn--dark" onClick={() => setProfileOpen(false)}>Contact Belyn</Link>
          <a className="hdr-panel__link" href="mailto:hello@belyn.in">hello@belyn.in</a>
        </div>
      )}

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
            <button type="button" className="link-btn" onClick={() => { setSearchOpen(false); setQuery(''); }}>
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
        <Link to="/shop" tabIndex={menu ? 0 : -1}>Shop</Link>
        <Link to="/story" tabIndex={menu ? 0 : -1}>Our Story</Link>
        <Link to="/contact" tabIndex={menu ? 0 : -1}>Contact</Link>
        <p>Born in Kashmir. Crafted with Purity.</p>
      </div>
    </header>
  );
}

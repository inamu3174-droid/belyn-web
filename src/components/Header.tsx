import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { useCart } from '../lib/cart';
import { formatPrice } from '../data/products';
import { collections } from '../data/collections';
import { searchProducts, startingPrice } from '../lib/catalog';
import { useWishlist } from '../lib/saved';
import { ProductVisual } from './Art';
import { announcements } from '../data/home';
import { site } from '../data/site';
import '../shop.css';

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

const menuSections = [
  {
    title: 'SHOP',
    links: [
      { label: 'Shop All', to: '/shop' },
      ...collections.map((c) => ({ label: c.title, to: `/collections/${c.slug}` })),
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
  {
    title: 'OUR BRAND',
    links: [{ label: 'Our Story', to: '/story' }],
  },
  {
    title: 'SUPPORT',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Shipping Policy', to: '/policies/shipping' },
      { label: 'Privacy Policy', to: '/policies/privacy' },
      { label: 'Terms & Conditions', to: '/policies/terms' },
    ],
  },
];

const heart = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
    <path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9Z" />
  </svg>
);

function DesktopNav() {
  const dropdown = (title: string, to: string, items: { label: string; to: string; blurb?: string }[]) => (
    <div className="dnav__item" key={title}>
      <Link to={to} className="dnav__link" aria-haspopup="true">
        {title}
      </Link>
      <div className="dnav__panel">
        {items.map((i) => (
          <Link key={i.label} to={i.to}>
            {i.label}
            {i.blurb && <small>{i.blurb}</small>}
          </Link>
        ))}
        <Link to={to} className="dnav__all">
          View all {title.toLowerCase()}
        </Link>
      </div>
    </div>
  );
  const dry = collections.find((c) => c.slug === 'dry-fruits')!;
  return (
    <nav className="dnav" aria-label="Primary">
      <div className="dnav__item">
        <Link to="/shop" className="dnav__link">
          Shop All
        </Link>
      </div>
      {dropdown('Honey', '/collections/honey', searchProducts('honey', 6).map((p) => ({ label: p.name, to: `/product/${p.slug}` })))}
      {dropdown('Dry Fruits', `/collections/${dry.slug}`, searchProducts('dry fruit', 6).map((p) => ({ label: p.name, to: `/product/${p.slug}` })))}
      <div className="dnav__item">
        <Link to="/collections/saffron" className="dnav__link">
          Saffron
        </Link>
      </div>
      <div className="dnav__item">
        <Link to="/collections/kahwa" className="dnav__link">
          Kahwa
        </Link>
      </div>
      <div className="dnav__item">
        <Link to="/collections/gift-boxes" className="dnav__link">
          Gift Boxes
        </Link>
      </div>
      <div className="dnav__item">
        <Link to="/story" className="dnav__link">
          Our Story
        </Link>
      </div>
    </nav>
  );
}

export default function Header() {
  const { path, navigate } = useRouter();
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchProducts(query, 8), [query]);
  const wishCount = useWishlist().length;

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

        <DesktopNav />

        <div className="header__right">
          <Link to="/wishlist" className="icon-btn hdr-icon hdr-wish" aria-label={`Wishlist, ${wishCount} saved`}>
            {heart}
          </Link>
          <Link to="/account" className="icon-btn hdr-icon" aria-label="Your account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1-4.2 4-6 8-6s7 1.8 8 6" />
            </svg>
          </Link>
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
        <div className="announce__track">
          {[false, true].map((dup) => (
            <p key={String(dup)} className="announce__group" aria-hidden={dup || undefined}>
              {announcements.map((t, i) => (
                <span key={t} className="announce__piece">
                  {i > 0 && <span className="announce__sep" aria-hidden="true">|</span>}
                  <span>{t}</span>
                </span>
              ))}
            </p>
          ))}
        </div>
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
            {query && (
              <button type="button" className="search-overlay__clear" aria-label="Clear search" onClick={() => { setQuery(''); searchInputRef.current?.focus(); }}>
                ×
              </button>
            )}
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
          <div className="search-overlay__results" role="status" aria-live="polite">
            {query.trim() && results.length === 0 && (
              <div className="search-empty">
                <p className="note">No products match &ldquo;{query.trim()}&rdquo;.</p>
                <div className="search-empty__links">
                  {collections.map((c) => (
                    <Link key={c.slug} to={`/collections/${c.slug}`} className="coll__tab">
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.length > 0 && <p className="search-overlay__label">{results.length} result{results.length === 1 ? '' : 's'}</p>}
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
                <span className="search-result__thumb" style={{ background: p.bg }}>
                  <ProductVisual product={p} />
                </span>
                <span>
                  <span className="search-result__name">{p.name}</span>
                  {p.subtitle && <span className="search-result__sub">{p.subtitle}</span>}
                </span>
                <span className="search-result__price">From {formatPrice(startingPrice(p))}</span>
              </button>
            ))}
            {!query.trim() && <p className="note">Try &ldquo;honey&rdquo;, &ldquo;saffron&rdquo;, &ldquo;almonds&rdquo; or &ldquo;kahwa&rdquo;.</p>}
          </div>
        </div>
      )}

      <div
        className={`menu-scrim ${menu ? 'is-open' : ''}`}
        onClick={() => setMenu(false)}
        aria-hidden="true"
      />

      <div id="mobile-menu" className={`mobile-menu menu-panels ${menu ? 'is-open' : ''}`} aria-hidden={!menu}>
        <div className="menu-panels__inner">
          <div className="menu-top">
            <Link to="/" className="menu-top__logo" tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)} aria-label="Belyn home">
              <img src="/images/logo.svg" alt="Belyn" width="96" height="30" />
            </Link>
            <button type="button" className="menu-top__close" tabIndex={menu ? 0 : -1} aria-label="Close menu" onClick={() => setMenu(false)}>
              ×
            </button>
          </div>
          <div className="menu-greet">
            <p>Hey there <span aria-hidden="true">👋</span></p>
            <Link to="/account" className="shop-btn shop-btn--primary" tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>
              Profile
            </Link>
          </div>
          {menuSections.map((section) => (
            <section key={section.title} className="menu-panel">
              <h3 className="menu-panel__title">{section.title}</h3>
              <ul className="menu-panel__list">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <div className="menu-foot">
            {site.email && <a href={`mailto:${site.email}`} tabIndex={menu ? 0 : -1}>{site.email}</a>}
            {site.phone && <a href={`tel:${site.phone.replace(/\s/g, '')}`} tabIndex={menu ? 0 : -1}>{site.phone}</a>}
          </div>
        </div>
      </div>
    </header>
  );
}

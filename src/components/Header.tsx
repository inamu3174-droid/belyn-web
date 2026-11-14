import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, useRouter } from '../lib/router';
import { useCart } from '../lib/cart';
import { formatPrice } from '../data/products';
import { collections } from '../data/collections';
import { searchProducts, startingPrice } from '../lib/catalog';
import { useWishlist } from '../lib/saved';
import { ProductVisual } from './Art';
import { announcements } from '../data/home';
import SocialIcons from './SocialIcons';
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

const I = (d: ReactNode) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
);
const menuIcons = {
  explore: I(<><rect x="4" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.6" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.6" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.6" /></>),
  gifting: I(<><rect x="3.5" y="9" width="17" height="11" rx="1.5" /><path d="M3.5 13h17M12 9v11M12 9c-1.5-4.5-5.5-4-5.5-1.8C6.5 8.4 8 9 12 9Zm0 0c1.5-4.5 5.5-4 5.5-1.8C17.5 8.4 16 9 12 9Z" /></>),
  brand: I(<><path d="M12 21V11" /><path d="M12 11c0-4 3-6 7-6 0 4-2 7-7 6Z" /><path d="M12 14c0-3-2-5-6-5 0 3 2 6 6 5Z" /></>),
  support: I(<><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19c0 1.5-2 2-4 2" /></>),
};

/** Navigation drawer content. Every link goes to a working page, section or pre-filled enquiry. */
const menuSections = [
  {
    title: 'Explore',
    icon: menuIcons.explore,
    links: [
      { label: 'Home', to: '/' },
      { label: 'Shop All Products', to: '/shop' },
      { label: 'Featured Products', to: '/featured' },
      { label: 'Sample Kit', to: '/sample-kit' },
      { label: 'Build Your Own Box', to: '/build-your-own-box' },
    ],
  },
  {
    title: 'Gifting',
    icon: menuIcons.gifting,
    links: [
      { label: 'Festive Gifting', to: '/festive-gifting' },
      { label: 'Corporate Gifting', to: '/corporate-gifting' },
    ],
  },
  {
    title: 'Our Brand',
    icon: menuIcons.brand,
    links: [
      { label: 'Our Story', to: '/story' },
      { label: 'The People Behind BELYN', to: '/story/people' },
      { label: 'The BELYN Promise', to: '/promise' },
    ],
  },
  {
    title: 'Business & Support',
    icon: menuIcons.support,
    links: [
      { label: 'Wholesale', to: '/wholesale' },
      { label: 'Contact Us', to: '/contact' },
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

  // Keep the content offset equal to the real header + announcement height (no gap below the green bar).
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('.header--ref');
    if (!el) return;
    const sync = () => document.body.style.setProperty('--hdr-stack', `${el.getBoundingClientRect().height}px`);
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

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
          <img src="/images/logo.png" alt="Belyn" width="95" height="38" />
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
            <button type="button" className="menu-top__close" tabIndex={menu ? 0 : -1} aria-label="Close menu" onClick={() => setMenu(false)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5 5 19" /></svg>
            </button>
          </div>
          <div className="menu-hello">
            <div>
              <p className="menu-hello__title">Hey there <span aria-hidden="true">👋</span></p>
              <p className="menu-hello__sub">Discover a little Kashmir.</p>
            </div>
            <Link to="/account" className="menu-hello__btn" tabIndex={menu ? 0 : -1} onClick={() => setMenu(false)}>
              My Account
            </Link>
          </div>
          {menuSections.map((section) => (
            <section key={section.title} className="menu-panel">
              <h3 className="menu-panel__title">
                <span className="menu-panel__icon">{section.icon}</span>
                <span className="menu-panel__bar" aria-hidden="true" />
                {section.title}
              </h3>
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
          <div className="menu-social">
            <SocialIcons tabIndex={menu ? 0 : -1} />
            <p className="menu-social__note">ENJOY YOUR JOURNEY</p>
          </div>
        </div>
      </div>
    </header>
  );
}

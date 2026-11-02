import { useEffect, useRef, useState } from 'react';
import { Link, useRouter } from '../lib/router';
import { useCart } from '../lib/cart';
import { products } from '../data/products';

const Bag = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 7h12l1.2 13H4.8L6 7Zm3-1a3 3 0 0 1 6 0h-2a1 1 0 0 0-2 0H9Z" />
  </svg>
);

export default function Header() {
  const { path } = useRouter();
  const { count, setOpen } = useCart();
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);
  const isHome = path === '/';

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
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menu);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false);
        setShopOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menu]);

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

        <Link to="/" className="logo" aria-label="BELYN home">
          B E L Y N
        </Link>

        <div className="header__right">
          <Link className="nav-link hide-sm" to="/story">
            Our Story
          </Link>
          <Link className="nav-link hide-sm" to="/contact">
            Contact
          </Link>
          <button className="cart-btn" aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`} onClick={() => setOpen(true)}>
            <Bag />
            {count > 0 && <span className="cart-btn__count">{count}</span>}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`mobile-menu ${menu ? 'is-open' : ''}`} aria-hidden={!menu}>
        <Link to="/shop" tabIndex={menu ? 0 : -1}>Shop</Link>
        <Link to="/story" tabIndex={menu ? 0 : -1}>Our Story</Link>
        <Link to="/contact" tabIndex={menu ? 0 : -1}>Contact</Link>
        <p>Born in Kashmir. Crafted with Purity.</p>
      </div>
    </header>
  );
}

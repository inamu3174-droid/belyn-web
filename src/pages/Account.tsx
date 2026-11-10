import { Link } from '../lib/router';
import { useWishlist, useRecentlyViewed } from '../lib/saved';
import { useSeo } from '../lib/seo';
import { site } from '../data/site';

export default function Account() {
  useSeo({ title: 'Your account | BELYN', description: 'Your saved products and help.', path: '/account', noindex: true });
  const saved = useWishlist().length;
  const recent = useRecentlyViewed().length;
  return (
    <main className="page acct">
      <header className="page__head" data-reveal>
        <p className="eyebrow">BELYN</p>
        <h1 className="h-page">YOUR ACCOUNT</h1>
        <p className="lede">Everything saved on this device, plus help when you need it.</p>
      </header>
      <div className="acct__grid">
        <Link to="/wishlist" className="acct__card">
          <h2>Wishlist</h2>
          <p>{saved === 0 ? 'Nothing saved yet.' : `${saved} saved ${saved === 1 ? 'product' : 'products'}.`}</p>
        </Link>
        <Link to="/shop" className="acct__card">
          <h2>Shop all</h2>
          <p>{recent > 0 ? `${recent} recently viewed on this device.` : 'Browse every BELYN product.'}</p>
        </Link>
        <Link to="/contact" className="acct__card">
          <h2>Help &amp; orders</h2>
          <p>Ask about an order or a product. {site.email}</p>
        </Link>
        <Link to="/policies/shipping" className="acct__card">
          <h2>Shipping</h2>
          <p>Charges, zones and delivery information.</p>
        </Link>
      </div>
      <p className="acct__note">
        Sign-in, order history and saved addresses are not available yet. For anything about an order you have placed,
        contact us with your order reference and we will help directly.
      </p>
    </main>
  );
}

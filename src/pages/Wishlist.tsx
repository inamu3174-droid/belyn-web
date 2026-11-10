import { getProduct } from '../data/products';
import type { Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Link } from '../lib/router';
import { useWishlist } from '../lib/saved';
import { useSeo } from '../lib/seo';
import '../shop.css';

export default function Wishlist() {
  useSeo({ title: 'Wishlist | BELYN', description: 'Products you saved on BELYN.', path: '/wishlist', noindex: true });
  const slugs = useWishlist();
  const items = slugs.map((s) => getProduct(s)).filter((p): p is Product => !!p);
  return (
    <main className="page">
      <header className="page__head" data-reveal>
        <p className="eyebrow">BELYN</p>
        <h1 className="h-page">WISHLIST</h1>
        <p className="lede">Saved on this device.</p>
      </header>
      {items.length === 0 ? (
        <section className="coll__empty" role="status">
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on any product to keep it here.</p>
          <Link to="/shop" className="shop-btn shop-btn--primary">
            Shop all
          </Link>
        </section>
      ) : (
        <div className="grid coll__grid">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} detailed />
          ))}
        </div>
      )}
    </main>
  );
}

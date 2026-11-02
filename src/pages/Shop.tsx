import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useSeo } from '../lib/seo';

export default function Shop() {
  useSeo({ title: 'Shop', description: 'Shop Belyn: Kashmiri white honey, saffron, almonds, walnuts, dry fruits and kahwa.', path: '/shop' });
  return (
    <main className="page">
      <header className="page__head" data-reveal>
        <p className="eyebrow">BELYN</p>
        <h1 className="h-page">SHOP</h1>
        <p className="lede">Born in Kashmir. Crafted with Purity.</p>
      </header>
      <div className="grid" data-reveal>
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </main>
  );
}

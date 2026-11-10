import { products } from '../../data/products';
import ExploreCard from '../../components/ExploreCard';
import { useSeo } from '../../lib/seo';

/** Shop All Products: the full catalogue, straight into the grid. No banner or intro. */
export default function ShopAll() {
  useSeo({
    title: 'Shop All Products | BELYN',
    description: 'All BELYN products: Kashmiri honey, saffron, almonds, walnuts and kahwa. Purely from Kashmir.',
    path: '/shop',
  });
  return (
    <main className="page xpage">
      <h1 className="sr-only">Shop all products</h1>
      <div className="xgrid">
        {products.map((p) => (
          <ExploreCard key={p.slug} product={p} />
        ))}
      </div>
    </main>
  );
}

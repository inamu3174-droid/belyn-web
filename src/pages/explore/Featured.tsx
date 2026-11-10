import { getProduct, type Product } from '../../data/products';
import { featuredSlugs } from '../../data/sampleKit';
import ExploreCard from '../../components/ExploreCard';
import { useSeo } from '../../lib/seo';

export default function Featured() {
  useSeo({
    title: 'The BELYN Favourites | BELYN',
    description: 'Some of the products that beautifully represent the natural richness and traditional flavours of Kashmir.',
    path: '/featured',
  });
  const items = featuredSlugs.map((s) => getProduct(s)).filter((p): p is Product => !!p);
  return (
    <main className="page xpage">
      <header className="xbanner">
        <div className="xbanner__card">
          <h1>The BELYN Favourites</h1>
          <p className="xbanner__tag">Loved Flavours. Timeless Kashmir.</p>
          <p className="xbanner__text">
            Discover some of the products that beautifully represent the natural richness and traditional flavours of Kashmir.
          </p>
        </div>
      </header>
      <section aria-labelledby="feat-title">
        <h2 id="feat-title" className="xhead">
          Our Featured Collection
        </h2>
        <p className="xlede">
          Our featured collection brings together some of BELYN&rsquo;s most loved and distinctive products, carefully selected to
          showcase the flavours and natural richness of Kashmir.
        </p>
        <div className="xgrid xgrid--3">
          {items.map((p) => (
            <ExploreCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

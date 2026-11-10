import { useRef } from 'react';
import { Link } from '../../lib/router';
import { productsIn } from '../../data/collections';
import { liveCollections } from '../../data/home';
import ProductCard from '../ProductCard';

/** One "Product in focus" row per collection that has at least two products (scrolls sideways on phones). */
export default function FocusSections() {
  const cols = liveCollections().filter((c) => productsIn(c).length >= 2);
  return (
    <>
      {cols.map((c) => (
        <FocusRow key={c.slug} slug={c.slug} title={c.title} blurb={c.intro} />
      ))}
    </>
  );
}

function FocusRow({ slug, title, blurb }: { slug: string; title: string; blurb: string }) {
  const c = liveCollections().find((x) => x.slug === slug)!;
  const items = productsIn(c);
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * (rail.current.clientWidth * 0.8), behavior: 'smooth' });

  return (
    <section className="focus" aria-labelledby={`focus-${slug}`}>
      <header className="focus__head">
        <div>
          <p className="eyebrow">Product in focus</p>
          <h2 id={`focus-${slug}`} className="h-sec">
            Explore our {title}
          </h2>
          <p className="focus__blurb">{blurb}</p>
        </div>
        <div className="focus__tools">
          <Link to={`/collections/${slug}`} className="focus__all">
            See all
          </Link>
          {items.length > 4 && (
            <span className="focus__arrows">
              <button type="button" aria-label={`Scroll ${title} left`} onClick={() => scroll(-1)}>
                ‹
              </button>
              <button type="button" aria-label={`Scroll ${title} right`} onClick={() => scroll(1)}>
                ›
              </button>
            </span>
          )}
        </div>
      </header>
      <div className="rail" ref={rail}>
        {items.map((p) => (
          <div key={p.slug} className="rail__item">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { products } from '../data/products';
import ProductCard from './ProductCard';

const Arrow = ({ dir }: { dir: 'l' | 'r' }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true" style={{ transform: dir === 'l' ? 'rotate(180deg)' : undefined }}>
    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ProductShowcase() {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    el?.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el?.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.pcard');
    const w = (card?.offsetWidth ?? 240) + 16;
    el.scrollBy({ left: dir * w * 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <section className="showcase" id="best-sellers" aria-labelledby="bs-title">
      <div className="showcase__head">
        <h2 id="bs-title" className="h-section">
          BEST SELLERS
        </h2>
        <div className="arrows">
          <button className="arrow" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous products">
            <Arrow dir="l" />
          </button>
          <button className="arrow" onClick={() => step(1)} disabled={edge.end} aria-label="Next products">
            <Arrow dir="r" />
          </button>
        </div>
      </div>
      <div className="showcase__track" ref={track} tabIndex={0} role="region" aria-label="Products, scroll horizontally">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}

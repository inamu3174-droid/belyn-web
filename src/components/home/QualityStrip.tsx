import { useEffect, useRef, useState } from 'react';

/** "QUALITY, CHECKED WITH CARE": four quality posters (supplied artwork; text is part of each image). Swipes below 1024px. */
const posters = [
  { img: 'fssai', alt: 'Quality checks aligned with FSSAI parameters. Carefully tested for key quality and safety parameters.' },
  { img: 'checked', alt: 'Quality checked. Carefully selected. Key quality and safety parameters are assessed to help maintain the standard we expect from every product.' },
  { img: 'proof', alt: 'See the proof. Don’t just trust us. Lab reports for every batch, because real trust is built on transparency. This representation is for reference only.' },
  { img: 'extensive', alt: 'Extensive quality checks. From sourcing to packaging, every step is handled with care for quality, purity and consistency.' },
] as const;

export default function QualityStrip() {
  const track = useRef<HTMLUListElement>(null);
  const [on, setOn] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const kids = Array.from(el.children) as HTMLElement[];
        const x = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let dist = Infinity;
        kids.forEach((k, n) => {
          const d = Math.abs(k.offsetLeft + k.offsetWidth / 2 - x);
          if (d < dist) {
            dist = d;
            best = n;
          }
        });
        setOn(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 ? kids.length - 1 : best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  function go(n: number) {
    const el = track.current;
    const kid = el?.children[n] as HTMLElement | undefined;
    if (el && kid) el.scrollTo({ left: kid.offsetLeft - parseFloat(getComputedStyle(el).scrollPaddingLeft || '0'), behavior: 'smooth' });
  }

  return (
    <section className="qual" aria-labelledby="qual-title">
      <h2 id="qual-title" className="qual__title">QUALITY, CHECKED WITH CARE</h2>
      <ul className="qual__track" ref={track}>
        {posters.map((p) => (
          <li key={p.img} className="qual__item">
            <img src={`/images/quality-${p.img}.jpg`} width={900} height={1200} alt={p.alt} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
      <div className="qual__dots" role="group" aria-label="Quality highlights">
        {posters.map((p, n) => (
          <button key={p.img} type="button" className={n === on ? 'is-on' : ''} aria-label={`Show highlight ${n + 1} of ${posters.length}`} aria-current={n === on} onClick={() => go(n)} />
        ))}
      </div>
    </section>
  );
}

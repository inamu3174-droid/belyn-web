import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Reference: bold centred rows alternate with faded, oversized rows that slide sideways as you scroll.
const rows: { t: string; bold?: boolean; dir?: 1 | -1 }[] = [
  { t: '6 PRODUCTS FROM KASHMIR', bold: true },
  { t: 'WHITE HONEY, SAFFRON, ALMONDS, WALNUTS, DRY FRUITS, KAHWA, WHITE HONEY, SAFFRON, ALMONDS, WALNUTS, DRY FRUITS, KAHWA,', dir: 1 },
  { t: '1 VALLEY', bold: true },
  { t: 'BORN IN KASHMIR, CRAFTED WITH PURITY, BORN IN KASHMIR, CRAFTED WITH PURITY, BORN IN KASHMIR, CRAFTED WITH PURITY,', dir: -1 },
  { t: '1 BRAND CALLED BELYN', bold: true },
];

export default function TextRows() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.rows__fade').forEach((el) => {
          const dir = Number(el.dataset.dir);
          gsap.fromTo(el, { xPercent: dir * 14 }, { xPercent: dir * -14, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
        });
        gsap.utils.toArray<HTMLElement>('.rows__bold').forEach((el) => {
          gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        });
      });
    }, root);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section className="rows" ref={root} aria-label="Belyn in numbers">
      {rows.map((r, i) =>
        r.bold ? (
          <p key={i} className="rows__bold">
            {r.t}
          </p>
        ) : (
          <p key={i} className="rows__fade" data-dir={r.dir} aria-hidden="true">
            {r.t}
          </p>
        ),
      )}
    </section>
  );
}

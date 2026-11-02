import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '../lib/router';
import { Scene } from './Art';

gsap.registerPlugin(ScrollTrigger);

export default function SplitFeature() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.split__panel', { clipPath: 'inset(0 0 100% 0 round 12px)', duration: 1.1, ease: 'power3.out', stagger: 0.15, scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } });
        gsap.fromTo('.split__img svg', { scale: 1.18 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    }, root);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section className="split" ref={root} aria-label="Cook and sip with Kashmir">
      <div className="split__panel split__text">
        <h2>
          ONE VALLEY.
          <br />
          COUNTLESS USES.
        </h2>
        <p>Stir saffron into milk, drizzle honey over warm bread, brew kahwa, or simply reach for a handful of almonds and walnuts.</p>
        <Link to="/shop" className="btn btn--ghost">
          Shop the range <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="split__panel split__img">
        <Scene kind="honey" />
      </div>
    </section>
  );
}

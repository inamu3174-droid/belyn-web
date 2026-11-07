import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from '../lib/router';
import { Jar } from './Art';
import { products } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from('.hero__line > span', { yPercent: 110, duration: 1.05, stagger: 0.1 })
          .from('.hero__jar--a', { y: -120, x: -30, rotate: -40, opacity: 0, duration: 1.1, ease: 'back.out(1.2)' }, 0.2)
          .from('.hero__jar--b', { y: 120, x: 30, rotate: 40, opacity: 0, duration: 1.1, ease: 'back.out(1.2)' }, 0.35)
          .from('.hero__sub, .hero__cta', { y: 16, opacity: 0, duration: 0.75, stagger: 0.08 }, 0.65);

        gsap.to('.hero__content', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero__jar--a', {
          yPercent: -22,
          rotate: 8,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero__jar--b', {
          yPercent: -36,
          rotate: -6,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    }, root);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero hero--ref" ref={root} aria-label="Welcome to BELYN">
      <div className="hero__jar hero__jar--a" aria-hidden="true">
        <Jar jar={products[0].jar} />
      </div>
      <div className="hero__jar hero__jar--b" aria-hidden="true">
        <Jar jar={products[1].jar} />
      </div>
      <div className="hero__content">
        <h1 className="hero__title hero__title--ref">
          <span className="hero__line">
            <span>Born in the Quiet</span>
          </span>
          <span className="hero__line">
            <span>Winters of Kashmir.</span>
          </span>
        </h1>
        <p className="hero__sub">From our home to yours, bringing you nature just as it should be.</p>
        <Link to="/shop" className="hero__cta">
          Shop Now <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

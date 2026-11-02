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
        // entrance: headline lines rise out of a mask, jars drop in with a spin, copy fades up
        const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
        tl.from('.hero__line > span', { yPercent: 110, duration: 1.1, stagger: 0.12 })
          .from('.hero__jar--a', { y: -160, x: -40, rotate: -50, opacity: 0, duration: 1.2, ease: 'back.out(1.3)' }, 0.25)
          .from('.hero__jar--b', { y: 160, x: 40, rotate: 50, opacity: 0, duration: 1.2, ease: 'back.out(1.3)' }, 0.4)
          .from('.hero__sub, .hero__cta', { y: 18, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.7);

        // scroll: hero content drifts up slower than the sheet that slides over it
        gsap.to('.hero__content', {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.hero__jar--a', { yPercent: -30, rotate: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
        gsap.to('.hero__jar--b', { yPercent: -50, rotate: -10, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } });
      });
    }, root);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" ref={root} aria-label="Welcome to BELYN">
      <div className="hero__jar hero__jar--a" aria-hidden="true">
        <Jar jar={products[0].jar} />
      </div>
      <div className="hero__jar hero__jar--b" aria-hidden="true">
        <Jar jar={products[1].jar} />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">
          <span className="hero__line">
            <span>PURELY</span>
          </span>
          <span className="hero__line">
            <span>KASHMIR.</span>
          </span>
        </h1>
        <p className="hero__sub">Nature&rsquo;s finest, from the heart of Kashmir.</p>
        <Link to="/shop" className="hero__cta">
          Shop Now <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

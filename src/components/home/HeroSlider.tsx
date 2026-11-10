import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '../../lib/router';
import { heroSlides } from '../../data/home';
import { Scene } from '../Art';

const INTERVAL = 6500;

/** Promotional slider: autoplay (paused on hover/focus, off for reduced motion), dots, arrows, swipe. */
export default function HeroSlider() {
  const slides = useMemo(heroSlides, []);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const go = useCallback((n: number) => setI(((n % slides.length) + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || reduce || slides.length < 2) return;
    const t = window.setTimeout(() => go(i + 1), INTERVAL);
    return () => window.clearTimeout(t);
  }, [i, paused, reduce, slides.length, go]);

  return (
    <section
      className="hs"
      aria-roledescription="carousel"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(i + 1);
        if (e.key === 'ArrowLeft') go(i - 1);
      }}
    >
      <div className="hs__track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, n) => (
          <article
            key={s.id}
            className="hs__slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${n + 1} of ${slides.length}`}
            aria-hidden={n !== i}
          >
            <div className="hs__art">
              <Scene kind={s.kind} />
            </div>
            <div className="hs__copy">
              <p className="hs__eyebrow">{s.eyebrow}</p>
              <h1 className="hs__title" {...(n === 0 ? {} : { role: 'heading', 'aria-level': 2 })}>
                {s.title}
              </h1>
              <p className="hs__body">{s.body}</p>
              <div className="hs__cta">
                <Link to={s.primary.to} className="shop-btn shop-btn--primary" tabIndex={n === i ? 0 : -1}>
                  {s.primary.label}
                </Link>
                <Link to={s.secondary.to} className="shop-btn shop-btn--ghost hs__ghost" tabIndex={n === i ? 0 : -1}>
                  {s.secondary.label}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button type="button" className="hs__nav hs__nav--prev" aria-label="Previous slide" onClick={() => go(i - 1)}>
            ‹
          </button>
          <button type="button" className="hs__nav hs__nav--next" aria-label="Next slide" onClick={() => go(i + 1)}>
            ›
          </button>
          <div className="hs__dots" role="tablist" aria-label="Choose slide">
            {slides.map((s, n) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={n === i}
                aria-label={`Slide ${n + 1}`}
                className={`hs__dot${n === i ? ' is-on' : ''}`}
                onClick={() => go(n)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

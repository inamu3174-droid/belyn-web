import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { Link } from '../lib/router';
import { site } from '../data/site';

const LETTERS = ['B', 'E', 'L', 'Y', 'N'];

/**
 * Footer wordmark. Like the reference, the giant word sits still until it scrolls into view,
 * then the letters fall, collide and pile up (matter-js). Touch/mouse can nudge them.
 * Reduced-motion users keep the static word.
 */
function Wordmark() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const { Engine, Bodies, Body, Composite } = Matter;
    const spans = Array.from(el.querySelectorAll<HTMLElement>('.wm__l'));
    let engine: Matter.Engine | null = null;
    let bodies: Matter.Body[] = [];
    let raf = 0;
    let running = false;
    let dropped = false;
    let last = 0;

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const reset = () => {
      stop();
      if (engine) {
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      }
      engine = null;
      bodies = [];
      dropped = false;
      spans.forEach((s) => {
        s.style.cssText = '';
      });
      el.classList.remove('is-live');
    };

    const loop = (t: number) => {
      if (!running || !engine) return;
      const dt = Math.min(1000 / 60, t - (last || t));
      last = t;
      Engine.update(engine, dt);
      bodies.forEach((b, i) => {
        const s = spans[i];
        s.style.transform = `translate(${b.position.x - s.offsetWidth / 2}px, ${b.position.y - s.offsetHeight / 2}px) rotate(${b.angle}rad)`;
      });
      raf = requestAnimationFrame(loop);
    };

    const drop = () => {
      if (dropped) return;
      dropped = true;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const box0 = el.getBoundingClientRect();
      engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
      const t = 200;
      const walls = [
        Bodies.rectangle(W / 2, H + t / 2, W * 2, t, { isStatic: true }),
        Bodies.rectangle(-t / 2, H / 2, t, H * 4, { isStatic: true }),
        Bodies.rectangle(W + t / 2, H / 2, t, H * 4, { isStatic: true }),
      ];
      const rects = spans.map((s) => s.getBoundingClientRect());
      bodies = rects.map((r, i) => {
        // collision box slightly smaller than the glyph box so letters can interlock
        const b = Bodies.rectangle(r.left - box0.left + r.width / 2, r.top - box0.top + r.height / 2, r.width * 0.82, r.height * 0.7, {
          restitution: 0.35,
          friction: 0.5,
          density: 0.002,
        });
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.12 + (i % 2 ? 0.03 : -0.03));
        Body.setVelocity(b, { x: (Math.random() - 0.5) * 3, y: 0 });
        return b;
      });
      spans.forEach((s, i) => {
        s.style.position = 'absolute';
        s.style.left = '0';
        s.style.top = '0';
        s.style.width = rects[i].width + 'px';
        s.style.height = rects[i].height + 'px';
        s.style.willChange = 'transform';
      });
      el.classList.add('is-live');
      Composite.add(engine.world, [...walls, ...bodies]);
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    let timer = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearTimeout(timer);
        if (e.intersectionRatio > 0.6) timer = window.setTimeout(drop, 450);
        else if (e.intersectionRatio === 0) reset();
      },
      { threshold: [0, 0.6] },
    );
    io.observe(el);

    // pointer: shove nearby letters (mouse/pen only so touch scrolling is never hijacked)
    const onMove = (e: PointerEvent) => {
      if (!running || e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      for (const b of bodies) {
        const dx = b.position.x - px, dy = b.position.y - py;
        const d = Math.hypot(dx, dy);
        if (d < 160) Body.applyForce(b, b.position, { x: (dx / d) * 0.06 * b.mass, y: (dy / d) * 0.06 * b.mass - 0.03 * b.mass });
      }
    };
    el.addEventListener('pointermove', onMove);
    const onResize = () => dropped && reset();
    window.addEventListener('resize', onResize);

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
      el.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      reset();
    };
  }, []);

  return (
    <div className="wm" ref={box} aria-hidden="true">
      <div className="wm__word">
        {LETTERS.map((l, i) => (
          <span key={i} className="wm__l">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="foot">
      <h2 className="sr-only">BELYN</h2>
      <Wordmark />
      <nav className="foot__nav" aria-label="Footer">
        <Link to="/shop">Shop</Link>
        <Link to="/story">Our Story</Link>
        <Link to="/contact">Contact</Link>
        {site.instagram && (
          <a href={site.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
        )}
      </nav>
      <div className="foot__legal">
        <p>
          &copy; {new Date().getFullYear()} BELYN. {site.short}
        </p>
        {(site.email || site.phone) && (
          <p>
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
            {site.email && site.phone && ' · '}
            {site.phone && <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>}
          </p>
        )}
        <p className="foot__policies">
          <Link to="/policies/shipping">Shipping Policy</Link>
          <Link to="/policies/privacy">Privacy Policy</Link>
          <Link to="/policies/terms">Terms &amp; Conditions</Link>
        </p>
      </div>
    </footer>
  );
}

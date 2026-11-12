import { useState } from 'react';
import { Link } from '../lib/router';
import { site } from '../data/site';
import { hampers, occasions } from '../data/gifting';
import { useSeo } from '../lib/seo';

const MAX = 20;
const box = (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3.5" y="9" width="17" height="11" rx="1.5" /><path d="M2.5 6.5h19V9h-19zM12 6.5V20M12 6.5c-1-3-4.5-3.2-4.5-1.2S10.5 6.5 12 6.5zm0 0c1-3 4.5-3.2 4.5-1.2S13.5 6.5 12 6.5z" />
  </svg>
);

function Hamper({ h }: { h: (typeof hampers)[number] }) {
  const [qty, setQty] = useState(1);
  const clamp = (n: number) => Math.min(MAX, Math.max(1, n));
  const lines = h.contents.map(([n, s]) => `${n} — ${s}`).join(', ');
  const text = `Hello BELYN, I would like to order the Festive Gift Hamper "${h.title}" (${lines}). Quantity: ${qty}.`;
  const wa = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  return (
    <section className="hamper" aria-labelledby={`h-${h.id}`}>
      <p className="hamper__n">{h.n}</p>
      <h2 id={`h-${h.id}`} className="hamper__t">{h.title}</h2>
      <div className="hamper__imgs">
        <figure className="hamper__img">{box}<figcaption>Closed gift box</figcaption></figure>
        <figure className="hamper__img hamper__img--open">{box}<figcaption>Open gift box</figcaption></figure>
      </div>
      <div className="hamper__body">
        <h3 className="hamper__k">Contents</h3>
        <ul className="hamper__list">
          {h.contents.map(([n, s]) => (
            <li key={n}>{n} <span>— {s}</span></li>
          ))}
        </ul>
        <p className="hamper__row"><span className="hamper__k">Price</span><span>Shared on enquiry</span></p>
        <div className="hamper__row">
          <span className="hamper__k" id={`q-${h.id}`}>Quantity</span>
          <div className="qty" role="group" aria-labelledby={`q-${h.id}`}>
            <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty(clamp(qty - 1))}>−</button>
            <span aria-live="polite">{qty}</span>
            <button type="button" aria-label="Increase quantity" disabled={qty >= MAX} onClick={() => setQty(clamp(qty + 1))}>+</button>
          </div>
        </div>
        <a className="shop-btn shop-btn--primary hamper__cta" href={wa} target="_blank" rel="noopener noreferrer">Enquire to order</a>
      </div>
    </section>
  );
}

export default function FestiveGifting() {
  useSeo({ title: 'Festive Gifting | BELYN', description: 'Thoughtfully curated BELYN gift hampers featuring the natural flavours of Kashmir.', path: '/festive-gifting' });
  return (
    <main className="page xpage">
      <header className="xbanner" data-reveal>
        <div className="xbanner__card">
          <h1>Wrap &amp; Wonder</h1>
          <p className="xbanner__tag">Thoughtful Gifts. Beautiful Moments.</p>
          <p className="xbanner__text">Thoughtfully curated gift hampers featuring the natural flavours of Kashmir, beautifully arranged and ready to be shared.</p>
        </div>
      </header>

      {hampers.map((h) => (
        <Hamper key={h.id} h={h} />
      ))}

      <section className="wsec">
        <h2 className="wsec__h wsec__h--c">Made for moments that matter</h2>
        <div className="occ">
          {occasions.map((o, i) => (
            <div key={o} className={`occ__card occ__card--${i}`}><span>{o}</span></div>
          ))}
        </div>
      </section>

      <section className="wsec wsec--close">
        <h2 className="wsec__h">A little Kashmir, beautifully gifted.</h2>
        <p>Share the flavours of Kashmir with the people who make every moment special.</p>
        <p className="wnote">BELYN &mdash; A shared dream, made to be shared with the world.</p>
        <p><Link to="/contact?topic=festive">Questions about gifting? Get in touch</Link></p>
      </section>
    </main>
  );
}

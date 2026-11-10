import { useState } from 'react';
import { useCart } from '../../lib/cart';
import { SAMPLE_KIT_SLUG, formatPrice, sampleKit } from '../../data/products';
import { sampleKitItems, sampleKitPackaging, sampleKitWeight } from '../../data/sampleKit';
import { useSeo } from '../../lib/seo';

const MAX = 20;

export default function SampleKit() {
  useSeo({
    title: 'Sample Kit | BELYN',
    description: 'A little taste of Kashmir: eight BELYN products in one Sample Kit. Shipping included.',
    path: '/sample-kit',
  });
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const v = sampleKit.variants[0];
  const clamp = (n: number) => Math.min(MAX, Math.max(1, n));

  return (
    <main className="page xpage">
      <header className="xbanner">
        <div className="xbanner__card">
          <h1>Discover BELYN</h1>
          <p className="xbanner__tag">A Little Taste of Kashmir.</p>
        </div>
      </header>

      <div className="kit">
        <section className="kit__box" aria-labelledby="kit-contents">
          <h2 id="kit-contents" className="xhead xhead--sm">
            Sample Kit Contents
          </h2>
          <ul className="kit__list">
            {sampleKitItems.map((i) => (
              <li key={i.name}>
                {i.name} <span>— {i.size}</span>
              </li>
            ))}
          </ul>
          <p className="kit__sum">
            {sampleKitItems.length} Products • Total Weight: {sampleKitWeight}
          </p>
        </section>

        <aside className="kit__box kit__box--side" aria-labelledby="kit-pack">
          <h2 id="kit-pack" className="xhead xhead--sm">
            Packaging
          </h2>
          <p>{sampleKitPackaging}</p>
          <p className="xcard__label">Price</p>
          <p className="kit__price">{formatPrice(v.price)}</p>
          <p className="kit__ship">Shipping Included</p>
        </aside>
      </div>

      <div className="kit__buy">
        <p className="xcard__label" id="kit-qty-label">
          Quantity
        </p>
        <div className="stepper" role="group" aria-labelledby="kit-qty-label">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => clamp(q - 1))} disabled={qty <= 1}>
            −
          </button>
          <output aria-live="polite">{qty}</output>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => clamp(q + 1))} disabled={qty >= MAX}>
            +
          </button>
        </div>
        <button type="button" className="shop-btn shop-btn--primary kit__add" onClick={() => add(SAMPLE_KIT_SLUG, v.id, qty)}>
          Add Sample Kit to Bag
        </button>
      </div>
    </main>
  );
}

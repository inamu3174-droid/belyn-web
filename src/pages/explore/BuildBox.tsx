import { useMemo, useState } from 'react';
import { useCart } from '../../lib/cart';
import { formatPrice, products, type Product } from '../../data/products';
import { useSeo } from '../../lib/seo';

const MAX = 20;
interface BoxLine {
  slug: string;
  variantId: string;
  qty: number;
}
const clamp = (n: number) => Math.min(MAX, Math.max(1, n));

function Row({ product, onAdd, preset }: { product: Product; onAdd: (variantId: string, qty: number) => void; preset?: { variantId: string; qty: number } }) {
  const [size, setSize] = useState(preset?.variantId ?? '');
  const [qty, setQty] = useState(preset?.qty ?? 1);
  return (
    <li className="bbrow">
      <p className="bbrow__name">{product.name}</p>
      <div className="chips" role="radiogroup" aria-label={`Size for ${product.name}`}>
        {product.variants.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={size === v.id}
            disabled={!v.inStock}
            className={`chip${size === v.id ? ' is-on' : ''}${v.inStock ? '' : ' is-out'}`}
            onClick={() => setSize(v.id)}
            title={v.inStock ? undefined : 'Sold out'}
          >
            {v.label.replace(' ', '')}
          </button>
        ))}
      </div>
      <div className="stepper stepper--sm" role="group" aria-label={`Quantity for ${product.name}`}>
        <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => clamp(q - 1))} disabled={qty <= 1}>
          −
        </button>
        <output>{qty}</output>
        <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => clamp(q + 1))} disabled={qty >= MAX}>
          +
        </button>
      </div>
      <button
        type="button"
        className="shop-btn shop-btn--primary bbrow__add"
        disabled={!size}
        title={size ? undefined : 'Select a size first'}
        onClick={() => {
          onAdd(size, qty);
          setSize('');
          setQty(1);
        }}
      >
        Add
      </button>
    </li>
  );
}

export default function BuildBox() {
  useSeo({
    title: 'Build Your Own Box | BELYN',
    description: 'Choose your favourite BELYN products, select your preferred sizes and create a box of your own.',
    path: '/build-your-own-box',
  });
  const { add } = useCart();
  const [box, setBox] = useState<BoxLine[]>([]);
  const [editing, setEditing] = useState<{ slug: string; variantId: string; qty: number } | null>(null);
  const [added, setAdded] = useState(false);

  const detail = useMemo(
    () =>
      box.map((l) => {
        const p = products.find((x) => x.slug === l.slug)!;
        const v = p.variants.find((x) => x.id === l.variantId)!;
        return { ...l, name: p.name, label: v.label, line: v.price * l.qty };
      }),
    [box],
  );
  const total = detail.reduce((n, l) => n + l.line, 0);

  function addToBox(slug: string, variantId: string, qty: number) {
    setAdded(false);
    setEditing(null);
    setBox((prev) => {
      const i = prev.findIndex((l) => l.slug === slug && l.variantId === variantId);
      if (i >= 0) return prev.map((l, j) => (j === i ? { ...l, qty: Math.min(MAX, l.qty + qty) } : l));
      return [...prev, { slug, variantId, qty }];
    });
  }
  const remove = (slug: string, variantId: string) => setBox((b) => b.filter((l) => !(l.slug === slug && l.variantId === variantId)));
  function edit(l: BoxLine) {
    remove(l.slug, l.variantId);
    setEditing(l);
  }
  function addBoxToBag() {
    box.forEach((l) => add(l.slug, l.variantId, l.qty));
    setBox([]);
    setAdded(true);
  }

  return (
    <main className="page xpage">
      <header className="xbanner">
        <div className="xbanner__card">
          <h1>Build Your Own Box</h1>
          <p className="xbanner__tag">A Box Made by You.</p>
          <p className="xbanner__text">
            Choose your favourite BELYN products, select your preferred sizes and create a box of your own.
          </p>
        </div>
      </header>

      <section className="bb" aria-labelledby="bb-pick">
        <h2 id="bb-pick" className="xhead xhead--sm">
          Choose Your Favourites
        </h2>
        <p className="xlede">Select a size, set quantity and click ADD.</p>
        <ul className="bb__rows">
          {products.map((p) => (
            <Row
              key={p.slug + (editing?.slug === p.slug ? `|${editing.variantId}|${editing.qty}` : '')}
              product={p}
              onAdd={(v, q) => addToBox(p.slug, v, q)}
              preset={editing?.slug === p.slug ? { variantId: editing.variantId, qty: editing.qty } : undefined}
            />
          ))}
        </ul>
      </section>

      <div className="bbsum">
        <section className="kit__box" aria-labelledby="bb-box">
          <h2 id="bb-box" className="xhead xhead--sm">
            Your BELYN Box
          </h2>
          {detail.length === 0 ? (
            <p>{added ? 'Your box was added to the bag.' : 'Your box is empty. Add your favourites to begin.'}</p>
          ) : (
            <ul className="bbbox">
              {detail.map((l) => (
                <li key={l.slug + l.variantId}>
                  <div>
                    <p className="bbbox__name">{l.name}</p>
                    <p className="bbbox__meta">
                      {l.label} × {l.qty}
                    </p>
                  </div>
                  <p className="bbbox__price">{formatPrice(l.line)}</p>
                  <div className="bbbox__tools">
                    <button type="button" className="link-btn" onClick={() => edit(l)}>
                      Edit
                    </button>
                    <button type="button" className="link-btn" onClick={() => remove(l.slug, l.variantId)}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <aside className="kit__box kit__box--side" aria-label="Box total">
          <p className="xcard__label">Total</p>
          <p className="kit__price" aria-live="polite">
            {detail.length ? formatPrice(total) : '₹—'}
          </p>
        </aside>
      </div>

      <button type="button" className="shop-btn shop-btn--primary bb__submit" disabled={box.length === 0} onClick={addBoxToBag}>
        Add Custom Box to Bag
      </button>
    </main>
  );
}

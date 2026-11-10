import { formatPrice, type Variant } from '../data/products';
import { discountPercent } from '../lib/catalog';

/** Star rating. Callers only render this when a real rating exists. */
export function Rating({ value, count }: { value: number; count: number }) {
  const full = Math.round(value);
  return (
    <p className="rating" aria-label={`Rated ${value.toFixed(1)} out of 5 from ${count} review${count === 1 ? '' : 's'}`}>
      <span className="rating__stars" aria-hidden="true">
        {'★'.repeat(full)}
        <span className="rating__off">{'★'.repeat(5 - full)}</span>
      </span>
      <span className="rating__count">
        {value.toFixed(1)} ({count})
      </span>
    </p>
  );
}

export function PriceLine({
  price,
  compareAt,
  placeholder,
  from = false,
}: {
  price: number;
  compareAt?: number;
  placeholder?: boolean;
  /** show "From" before the price (cards that stand for several sizes) */
  from?: boolean;
}) {
  const off = discountPercent({ price, compareAt });
  return (
    <p className="priceline">
      {from && <span className="priceline__from">From</span>}
      <span className="priceline__now">{formatPrice(price)}</span>
      {off > 0 && compareAt && (
        <>
          <s className="priceline__was">{formatPrice(compareAt)}</s>
          <span className="priceline__off">{off}% off</span>
        </>
      )}
      {placeholder && <em className="ph-tag">Placeholder price</em>}
    </p>
  );
}

export function VariantChips({
  variants,
  value,
  onChange,
  label,
}: {
  variants: Variant[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div className="chips" role="radiogroup" aria-label={`Size for ${label}`}>
      {variants.map((v) => (
        <button
          key={v.id}
          type="button"
          role="radio"
          aria-checked={v.id === value}
          className={`chip${v.id === value ? ' is-on' : ''}${v.inStock ? '' : ' is-out'}`}
          onClick={() => onChange(v.id)}
          title={v.inStock ? undefined : 'Sold out'}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

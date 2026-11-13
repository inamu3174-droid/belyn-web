import { Link } from '../../lib/router';

/** Four origin photographs with live text overlays. Each card opens its collection. */
const stories = [
  { img: 'honey', to: '/collections/honey', title: 'Kashmiri Honey', line: 'Naturally sourced from Kashmir’s blossom valleys.', cta: 'Shop Honey' },
  { img: 'saffron', to: '/collections/saffron', title: 'Kashmiri Saffron', line: 'Delicate threads from the fields of Kashmir.', cta: 'Shop Saffron' },
  { img: 'walnuts', to: '/collections/dry-fruits', title: 'Kashmiri Walnut Kernels', line: 'Naturally sourced from Kashmir’s orchards.', cta: 'Shop Dry Fruits' },
  { img: 'almonds', to: '/collections/dry-fruits', title: 'Kashmiri Mamra Almonds', line: 'Naturally sourced from Kashmir’s orchards.', cta: 'Shop Dry Fruits' },
] as const;

export default function OriginStories() {
  return (
    <section className="origin" aria-label="From the fields and orchards of Kashmir">
      <div className="origin__grid">
        {stories.map((s) => (
          <Link key={s.img} to={s.to} className="origin__tile">
            <img src={`/images/story-${s.img}.jpg`} width={1200} height={800} alt="" loading="lazy" decoding="async" />
            <span className="origin__shade" aria-hidden="true" />
            <span className="origin__copy">
              <span className="origin__title">{s.title}</span>
              <span className="origin__line">{s.line}</span>
              <span className="origin__cta">{s.cta} <span aria-hidden="true">→</span></span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

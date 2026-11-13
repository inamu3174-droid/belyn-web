import { Link } from '../../lib/router';

/** Four origin photographs (supplied artwork, text is part of the image). Each opens its collection. */
const stories = [
  { img: 'honey', to: '/collections/honey', alt: 'Kashmiri Honey. Naturally sourced from Kashmir’s blossom valleys. Pure, raw and full of the natural goodness of Kashmir.' },
  { img: 'saffron', to: '/collections/saffron', alt: 'Kashmiri Saffron. Delicate threads from the fields of Kashmir.' },
  { img: 'walnuts', to: '/collections/dry-fruits', alt: 'Kashmiri Walnut Kernels. Naturally sourced from Kashmir’s orchards.' },
  { img: 'almonds', to: '/collections/dry-fruits', alt: 'Kashmiri Mamra Almonds. Naturally sourced from Kashmir’s orchards.' },
] as const;

export default function OriginStories() {
  return (
    <section className="origin" aria-label="From the fields and orchards of Kashmir">
      <div className="origin__grid">
        {stories.map((s) => (
          <Link key={s.img} to={s.to} className="origin__tile">
            <img src={`/images/story-${s.img}.jpg`} width={1000} height={1000} alt={s.alt} loading="lazy" decoding="async" />
          </Link>
        ))}
      </div>
    </section>
  );
}

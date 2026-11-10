import { Link } from '../lib/router';

const categories = [
  { label: 'All Products', to: '/shop', icon: 'grid', primary: true },
  { label: 'Honey', to: '/collections/honey', icon: 'jar' },
  { label: 'Saffron', to: '/collections/saffron', icon: 'box' },
  { label: 'Dry Fruits', to: '/collections/dry-fruits', icon: 'grid' },
  { label: 'Kahwa', to: '/collections/kahwa', icon: 'jar' },
  { label: 'Gift Boxes', to: '/collections/gift-boxes', icon: 'gift', wide: true },
];

function Icon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, 'aria-hidden': true as const };
  switch (name) {
    case 'grid':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case 'gift':
      return (
        <svg {...common}>
          <rect x="4" y="10" width="16" height="10" rx="1.5" />
          <path d="M12 10v10M4 14h16" />
          <path d="M12 10c-2-3-5-3-5-1.5S9 11 12 10c3-1 5-1 5 1.5S14 7 12 10Z" />
        </svg>
      );
    case 'building':
      return (
        <svg {...common}>
          <path d="M4 20V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14" />
          <path d="M9 20v-6h6v6M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01" />
        </svg>
      );
    case 'box':
      return (
        <svg {...common}>
          <path d="M3 8l9-4 9 4-9 4-9-4Z" />
          <path d="M3 8v8l9 4 9-4V8M12 12v8" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M8 9V7a4 4 0 0 1 8 0v2" />
          <rect x="6" y="9" width="12" height="11" rx="2" />
        </svg>
      );
  }
}

export default function FeatureStrip() {
  return (
    <section className="welcome" aria-labelledby="welcome-heading">
      <div className="welcome__head">
        <span className="welcome__rule" aria-hidden="true" />
        <h2 id="welcome-heading" className="welcome__title">
          Welcome to Belyn
        </h2>
        <span className="welcome__rule" aria-hidden="true" />
      </div>
      <p className="welcome__tagline">From our home to yours, bringing you nature just as it should be.</p>

      <nav className="welcome__cats" aria-label="Shop categories">
        {categories.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className={`welcome__cat${c.primary ? ' is-primary' : ''}${c.wide ? ' is-wide' : ''}`}
          >
            <Icon name={c.icon} />
            <span>{c.label}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}

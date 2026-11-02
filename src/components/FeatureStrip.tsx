import { Link } from '../lib/router';
import { CategoryIcon } from './Art';

const items = [
  { icon: 'honey', label: 'White\nHoney', to: '/product/kashmiri-white-honey' },
  { icon: 'saffron', label: 'Kashmiri\nSaffron', to: '/product/kashmiri-saffron' },
  { icon: 'almonds', label: 'Kashmiri\nAlmonds', to: '/product/kashmiri-almonds' },
  { icon: 'walnuts', label: 'Kashmiri\nWalnuts', to: '/product/kashmiri-walnuts' },
  { icon: 'dry', label: 'Premium\nDry Fruits', to: '/product/premium-dry-fruits' },
  { icon: 'kahwa', label: 'Kashmiri\nKahwa', to: '/product/kashmiri-kahwa' },
];

export default function FeatureStrip() {
  return (
    <nav className="strip" aria-label="Shop by product">
      <ul>
        {items.map((i) => (
          <li key={i.icon}>
            <Link to={i.to}>
              <CategoryIcon kind={i.icon} />
              <span>{i.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

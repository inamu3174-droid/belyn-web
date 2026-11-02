import { Link } from '../lib/router';
import { Scene } from './Art';

const cards = [
  { kind: 'kahwa', cat: 'Kahwa', title: 'STEEP A SLOW\nCUP OF KAHWA', to: '/product/kashmiri-kahwa' },
  { kind: 'saffron', cat: 'Saffron', title: 'A LITTLE SAFFRON\nGOES A LONG WAY', to: '/product/kashmiri-saffron' },
  { kind: 'walnut', cat: 'Walnuts', title: 'WALNUTS & ALMONDS,\nSIMPLY SNACKED', to: '/product/kashmiri-walnuts' },
] as const;

export default function Journal() {
  return (
    <section className="journal" aria-labelledby="journal-title">
      <div className="journal__head">
        <h2 id="journal-title">From the Valley</h2>
        <Link to="/shop">
          View All <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <div className="journal__grid">
        {cards.map((c) => (
          <Link key={c.cat} to={c.to} className="jcard">
            <div className="jcard__img">
              <Scene kind={c.kind} />
            </div>
            <span className="jcard__cat">{c.cat}</span>
            <h3 className="jcard__title">{c.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}

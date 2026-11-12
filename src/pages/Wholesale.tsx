import { Link } from '../lib/router';
import { site } from '../data/site';
import { useSeo } from '../lib/seo';

const who = ['Retailers', 'Resellers', 'Distributors', 'Hotels & Hospitality', 'Cafés & Restaurants', 'Business Buyers'];

export default function Wholesale() {
  useSeo({ title: 'Wholesale', description: 'Wholesale enquiries for retailers, resellers, distributors and businesses interested in BELYN products.', path: '/wholesale' });
  const text = 'Hello BELYN, I would like to enquire about wholesale. Business name and quantity needed: ';
  const wa = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  const mail = `mailto:${site.email}?subject=${encodeURIComponent('Wholesale enquiry')}&body=${encodeURIComponent(text)}`;
  return (
    <main className="page xpage">
      <header className="xbanner" data-reveal>
        <div className="xbanner__card">
          <h1>Wholesale</h1>
          <p className="xbanner__tag">Bring the natural richness of Kashmir to your customers.</p>
        </div>
      </header>

      <section className="wsec">
        <h2 className="wsec__h">Wholesale with BELYN</h2>
        <p>We welcome enquiries from retailers, resellers, distributors and businesses interested in offering BELYN products.</p>
      </section>

      <section className="wsec">
        <h2 className="wsec__h">Who we work with</h2>
        <ul className="wchips">
          {who.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      </section>

      <section className="wsec">
        <h2 className="wsec__h">Let&rsquo;s work together</h2>
        <p>Tell us a little about your business and what you&rsquo;re looking for.</p>
        <div className="wbtns">
          <a className="shop-btn shop-btn--primary" href={wa} target="_blank" rel="noopener noreferrer">Enquire via WhatsApp</a>
          <a className="shop-btn shop-btn--ghost" href={mail}>Enquire via Email</a>
        </div>
        <p className="wnote">Wholesale pricing and minimum order quantities will be shared after enquiry.</p>
      </section>

      <section className="wsec wsec--close">
        <h2 className="wsec__h">Build something meaningful with BELYN</h2>
        <p>Thoughtfully selected products from Kashmir, made to be shared beyond it.</p>
        <p className="wnote">BELYN &mdash; A shared dream, made to be shared with the world.</p>
        <p><Link to="/contact">Have another question? Contact us</Link></p>
      </section>
    </main>
  );
}

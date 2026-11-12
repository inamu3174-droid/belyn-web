import { Link } from '../lib/router';
import { site } from '../data/site';
import { products } from '../data/products';
import { corporateSlugs } from '../data/gifting';
import { ProductVisual } from '../components/Art';
import { useSeo } from '../lib/seo';

export default function CorporateGifting() {
  useSeo({ title: 'Corporate Gifting | BELYN', description: 'Thoughtful gifts for every professional occasion, inspired by the natural richness of Kashmir.', path: '/corporate-gifting' });
  const list = corporateSlugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is (typeof products)[number] => !!p);
  const text = 'Hello BELYN, I would like to enquire about corporate gifting. Quantity needed: ';
  const wa = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  const mail = `mailto:${site.email}?subject=${encodeURIComponent('Corporate gifting enquiry')}&body=${encodeURIComponent(text)}`;
  return (
    <main className="page xpage">
      <header className="xbanner" data-reveal>
        <div className="xbanner__card">
          <h1>Thoughtful gifting. Meaningful connections.</h1>
          <p className="xbanner__tag">Thoughtful Gifts for Every Professional Occasion.</p>
        </div>
      </header>

      <section className="wsec">
        <h2 className="wsec__h">Gifting that brings people together</h2>
        <p>Make every professional moment meaningful with thoughtfully selected products inspired by the natural richness of Kashmir.</p>
      </section>

      <section className="wsec" aria-labelledby="coll-title">
        <h2 id="coll-title" className="wsec__h">Our collection</h2>
        <div className="xgrid">
          {list.map((p) => (
            <article key={p.slug} className="xcard">
              <div className="xcard__media" style={{ background: p.bg }}>
                <ProductVisual product={p} className="xcard__img" />
              </div>
              <div className="xcard__body">
                <h3 className="xcard__name">{p.name}</h3>
                {p.subtitle && <p className="xcard__sub">{p.subtitle}</p>}
                <p className="xcard__label">Available sizes</p>
                <ul className="xcard__sizes">
                  {p.variants.map((v) => (
                    <li key={v.id}>{v.label.replace(' ', '')}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="cgift-img" role="img" aria-label="BELYN corporate gift arrangement" />

      <section className="wsec">
        <h2 className="wsec__h">Let&rsquo;s create something thoughtful</h2>
        <p>Connect with BELYN to discuss corporate gifting requirements, product selection, bulk orders and pricing.</p>
        <div className="wbtns">
          <a className="shop-btn shop-btn--primary" href={wa} target="_blank" rel="noopener noreferrer">Enquire via WhatsApp</a>
          <a className="shop-btn shop-btn--ghost" href={mail}>Enquire via Email</a>
        </div>
      </section>

      <section className="wsec wsec--close">
        <h2 className="wsec__h">Give with thought. Share with meaning.</h2>
        <p>Thoughtful gifts. Meaningful connections.</p>
        <p className="wnote">BELYN &mdash; A shared dream, made to be shared with the world.</p>
        <p><Link to="/contact">Contact us</Link></p>
      </section>
    </main>
  );
}

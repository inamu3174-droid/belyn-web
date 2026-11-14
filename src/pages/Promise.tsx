import { Link } from '../lib/router';
import { useSeo } from '../lib/seo';
import { promise } from '../data/brand';
import Banner from '../components/brand/Banner';

const ico: Record<string, JSX.Element> = {
  selection: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5M8.5 11l2 2 3.5-4" /></>,
  ingredients: <><path d="M5 19c0-8 5-13 14-14 0 9-5 14-14 14Z" /><path d="M5 19c3-5 6-8 10-10" /></>,
  presentation: <><rect x="4" y="9" width="16" height="11" rx="1.5" /><path d="M4 13h16M12 9v11M12 9c-1.5-4-5-3.5-5-1.5C7 8.5 8.5 9 12 9Zm0 0c1.5-4 5-3.5 5-1.5 0 1-1.500 1.5-5 1.5Z" /></>,
  information: <><rect x="5" y="3.5" width="14" height="17" rx="1.8" /><path d="M8.5 8h7M8.5 12h7M8.5 16h4" /></>,
  lab: <><path d="M9.5 3.5h5M10.5 3.5v6L5.5 18a1.8 1.8 0 0 0 1.6 2.5h9.8a1.8 1.8 0 0 0 1.6-2.5l-5-8.500v-6" /><path d="M8 14.5h8" /></>,
  experience: <><path d="M12 20.500s-7.5-4.500-7.5-10A4.2 4.2 0 0 1 12 8a4.2 4.2 0 0 1 7.5 2.5c0 5.500-7.5 10-7.5 10Z" /></>,
};

export default function PromisePage() {
  useSeo({ title: 'The BELYN Promise | BELYN', description: promise.tagline, path: '/promise' });
  return (
    <main className="brand">
      <Banner image={promise.banner} label="Kashmir landscape">
        <h1 className="bnr__h">{promise.title}</h1>
        <p className="bnr__p">{promise.tagline}</p>
      </Banner>
      <article className="brand__wrap">
        <header className="brand__head">
          <p className="brand__intro brand__intro--solo">{promise.intro}</p>
          <span className="orn" aria-hidden="true" />
        </header>
        <div className="prom">
          {promise.items.map((it) => (
            <section key={it.id} className="prom__item">
              <svg className="prom__ico" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ico[it.id]}
              </svg>
              <h2 className="prom__title">{it.title}</h2>
              <p>{it.text}</p>
            </section>
          ))}
        </div>
        <section className="brand__band">
          <h2 className="brand__h2">{promise.grows.title}</h2>
          <p>{promise.grows.text}</p>
        </section>
        <section className="brand__end">
          <h2 className="brand__h2">{promise.forward.title}</h2>
          <p>{promise.forward.text}</p>
          <p className="brand__sign">{promise.tagline.replace(/\.$/, '').toUpperCase()}.</p>
          <div className="brand__links">
            <Link to="/shop" className="shop-btn shop-btn--primary">Shop BELYN</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

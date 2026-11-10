import { Link } from '../../lib/router';
import { productsIn } from '../../data/collections';
import { liveCollections } from '../../data/home';
import { Scene } from '../Art';

/** Editorial band: one card per live collection, using the collection's own copy. */
export default function Editorial() {
  const cols = liveCollections();
  return (
    <section className="edit" aria-labelledby="edit-title">
      <h2 id="edit-title" className="edit__title">
        Native to Kashmir.
      </h2>
      <p className="edit__sub">Start with what you love.</p>
      <div className="edit__rail">
        {cols.map((c) => (
          <Link key={c.slug} to={`/collections/${c.slug}`} className="ecard">
            <div className="ecard__img">
              <Scene kind={c.kind} />
            </div>
            <div className="ecard__body">
              <h3 className="ecard__title">{c.title}</h3>
              <p className="ecard__text">{c.blurb}</p>
              <span className="ecard__meta">
                <span>
                  {productsIn(c).length} {productsIn(c).length === 1 ? 'product' : 'products'}
                </span>
                <span className="ecard__cta">
                  Shop {c.title} <span aria-hidden="true">→</span>
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

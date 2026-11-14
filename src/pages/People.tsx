import { useSeo } from '../lib/seo';
import { people } from '../data/brand';

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export default function People() {
  useSeo({ title: 'The People Behind BELYN | BELYN', description: people.vision.text, path: '/story/people' });
  return (
    <main className="brand">
      <article className="brand__wrap brand__wrap--top">
        <header className="brand__head">
          <p className="brand__eyebrow">BELYN</p>
          <h1 className="brand__title">{people.title}</h1>
          <span className="orn" aria-hidden="true" />
        </header>
        {people.video && (
          <div className="vid">
            <video controls playsInline preload="metadata" poster={people.poster || undefined} src={people.video} />
          </div>
        )}
        <div className="fnd">
          {people.founders.map((f) => (
            <figure key={f.name} className="fnd__card">
              <div className="fnd__ph">
                {f.photo ? <img src={f.photo} alt={`${f.name}, ${f.role} of BELYN`} loading="lazy" /> : <span aria-hidden="true">{initials(f.name)}</span>}
              </div>
              <figcaption>
                <span className="fnd__role">{f.role}</span>
                <span className="fnd__name">{f.name}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <section className="brand__band">
          <h2 className="brand__h2">{people.vision.title}</h2>
          <p>{people.vision.text}</p>
        </section>
        <section className="vals">
          <p className="brand__eyebrow">{people.values.eyebrow}</p>
          <h2 className="brand__h2">{people.values.title}</h2>
          <ul>
            {people.values.items.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </section>
        <section className="brand__beyond">
          <h2 className="brand__h2">{people.beyond.title}</h2>
          <p>{people.beyond.text}</p>
        </section>
        <section className="note">
          <h2 className="brand__h2">{people.note.title}</h2>
          {people.note.paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="note__with">{people.note.signoff}</p>
          <p className="note__sig">{people.note.signed}</p>
        </section>
        <p className="brand__sign brand__sign--end">{people.closing}</p>
      </article>
    </main>
  );
}

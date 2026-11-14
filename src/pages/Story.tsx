import { Link } from '../lib/router';
import { useSeo } from '../lib/seo';
import { story } from '../data/brand';
import Banner from '../components/brand/Banner';

export default function Story() {
  useSeo({ title: 'Our Story | BELYN', description: 'Two ordinary people, two different worlds, one shared dream. The story of BELYN, born in the quiet winters of Kashmir.', path: '/story' });
  return (
    <main className="brand">
      <Banner image={story.banner} label="Kashmir landscape" />
      <article className="brand__wrap">
        <header className="brand__head">
          <p className="brand__eyebrow">Our Story</p>
          <h1 className="brand__title">{story.lead}</h1>
          <p className="brand__intro">{story.intro}</p>
        </header>
        <div className="chap">
          {story.chapters.map((c, i) => (
            <section key={c.id} className="chap__item">
              <span className="chap__no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2 className="chap__title">{c.title}</h2>
                <p>{c.text}</p>
              </div>
            </section>
          ))}
        </div>
        <section className="brand__band">
          <h2 className="brand__h2">{story.home.title}</h2>
          {story.home.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </section>
        <section className="brand__end">
          <h2 className="brand__h2">{story.continues.title}</h2>
          <p>{story.continues.text}</p>
          <p className="brand__sign">{story.closing}</p>
          <div className="brand__links">
            <Link to="/shop" className="shop-btn shop-btn--primary">Shop BELYN</Link>
            <Link to="/story/people" className="shop-btn shop-btn--ghost">Meet the people behind BELYN</Link>
          </div>
        </section>
      </article>
    </main>
  );
}

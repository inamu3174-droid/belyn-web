import { Link } from '../lib/router';
import { Scene, StoryLineArt } from '../components/Art';
import { useSeo } from '../lib/seo';

export default function Story() {
  useSeo({ title: 'Our Story', description: 'Belyn: Born in Kashmir. Crafted with Purity. Premium Kashmiri white honey, saffron, almonds, walnuts, dry fruits and kahwa.', path: '/story' });
  return (
    <main className="page">
      <header className="page__head" data-reveal>
        <p className="eyebrow">OUR STORY</p>
        <h1 className="h-page h-page--long">BORN IN KASHMIR. CRAFTED WITH PURITY.</h1>
      </header>
      <section className="story-page" data-reveal>
        <div className="story-page__art">
          <StoryLineArt />
        </div>
        <div className="story-page__copy">
          {/* TODO(real copy): replace with Belyn's own brand story. Kept short and claim-free on purpose. */}
          <p>Belyn brings together some of Kashmir&rsquo;s best-loved products: white honey, saffron, almonds, walnuts, dry fruits and kahwa.</p>
          <p>Our promise is simple: nature&rsquo;s finest, from the heart of Kashmir, handled with care.</p>
          <Link to="/shop" className="btn btn--lime">
            Shop the range <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>
      <section className="trio" data-reveal>
        <div className="trio__img">
          <Scene kind="honey" />
        </div>
        <div className="trio__img">
          <Scene kind="saffron" />
        </div>
        <div className="trio__img">
          <Scene kind="almond" />
        </div>
      </section>
    </main>
  );
}

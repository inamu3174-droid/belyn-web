import { Link } from '../lib/router';
import { StoryLineArt } from './Art';

export default function StorySection() {
  return (
    <section className="story" aria-labelledby="story-title">
      <div className="story__text">
        <h2 id="story-title" className="h-story">
          OUR STORY ABOUT KASHMIR IS A STORY ABOUT PURITY
        </h2>
        <p>
          Belyn is built around one idea: Born in Kashmir. Crafted with Purity. From white honey and saffron to almonds, walnuts, dry fruits and kahwa, every product starts in
          the valley&hellip;
        </p>
        <Link to="/story" className="btn btn--lime">
          Tell Me More <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
      <StoryLineArt className="story__art" />
    </section>
  );
}

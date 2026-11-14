import { useRef, useState } from 'react';
import data from '../../../shared/reviews.json';

interface Review {
  name: string;
  rating: number;
  text: string;
  product?: string;
  photo?: string;
}

const Star = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 2.6 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4L2.8 9.3l6.4-.8L12 2.6Z" />
  </svg>
);

/**
 * "What Do Our Customers Say": one centred testimonial at a time (swipe or dots when there are several).
 * Content comes only from shared/reviews.json; the section is not rendered while that list is empty.
 */
export default function Reviews() {
  const reviews = (data.reviews as Review[]).filter((r) => r.name && r.text && r.rating >= 1 && r.rating <= 5);
  const rail = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(0);
  if (reviews.length === 0) return null;

  const onScroll = () => {
    const el = rail.current;
    if (!el) return;
    setOn(Math.round(el.scrollLeft / el.clientWidth));
  };
  const go = (i: number) => rail.current?.scrollTo({ left: i * rail.current.clientWidth, behavior: 'smooth' });

  return (
    <section className="rv" aria-labelledby="rev-title">
      <h2 id="rev-title" className="rv__title">
        What Do Our Customers Say
      </h2>
      <div className="rv__rail" ref={rail} onScroll={onScroll}>
        {reviews.map((r, i) => (
          <figure key={i} className="rv__item" aria-label={`Review ${i + 1} of ${reviews.length}`}>
            <blockquote className="rv__quote">
              <span className="rv__mark rv__mark--open" aria-hidden="true">&ldquo;</span>
              <p>{r.text}</p>
              <span className="rv__mark rv__mark--close" aria-hidden="true">&rdquo;</span>
            </blockquote>
            <figcaption className="rv__who">
              {r.photo ? (
                <img src={r.photo} alt="" loading="lazy" className="rv__photo" />
              ) : (
                <span className="rv__photo rv__photo--init" aria-hidden="true">{r.name.trim().charAt(0).toUpperCase()}</span>
              )}
              <span className="rv__id">
                <span className="rv__name">{r.name}</span>
                <span className="rv__stars" role="img" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }, (_, k) => (
                    <Star key={k} />
                  ))}
                </span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      {reviews.length > 1 && (
        <div className="rv__dots" role="group" aria-label="Choose review">
          {reviews.map((_, i) => (
            <button key={i} type="button" className={`rv__dot${i === on ? ' is-on' : ''}`} aria-label={`Review ${i + 1}`} aria-current={i === on} onClick={() => go(i)} />
          ))}
        </div>
      )}
    </section>
  );
}

import data from '../../../shared/reviews.json';
import { Rating } from '../ProductBits';

interface Review {
  name: string;
  rating: number;
  text: string;
  product?: string;
  photo?: string;
}

/** Real customer reviews from shared/reviews.json. Renders nothing while the list is empty. */
export default function Reviews() {
  const reviews = (data.reviews as Review[]).filter((r) => r.name && r.text && r.rating >= 1 && r.rating <= 5);
  if (reviews.length === 0) return null;
  return (
    <section className="reviews" aria-labelledby="rev-title">
      <h2 id="rev-title" className="h-sec">
        Customer reviews
      </h2>
      <div className="rail">
        {reviews.map((r, i) => (
          <figure key={i} className="rev rail__item">
            {r.photo && <img src={r.photo} alt="" loading="lazy" className="rev__photo" />}
            <Rating value={r.rating} count={1} />
            <blockquote>{r.text}</blockquote>
            <figcaption>
              {r.name}
              {r.product && <span> · {r.product}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

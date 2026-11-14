import data from '../../../shared/reviews.json';

interface Review {
  name: string;
  rating: number;
  text: string;
  product?: string;
  photo?: string;
}

function Stars({ value }: { value: number }) {
  const full = Math.max(0, Math.min(5, Math.round(value)));
  return "★".repeat(full)}
      <span className="reviews__star-off" aria-hidden="true">
        {"★".repeat(5 - full)}
      </span>
    </span>
  );
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?';
  return (
    <span className="reviews__avatar reviews__avatar--initials" aria-hidden="true">
      {letters}
    </span>
  );
}

/** Real customer reviews from shared/reviews.json. Renders nothing while the list is empty. */
export default function Reviews() {
  const reviews = (data.reviews as Review[]).filter((r) => r.name && r.text && r.rating >= 1 && r.rating <= 5);
  if (reviews.length === 0) return null;

  return (
    <section className="reviews" aria-labelledby="rev-title">
      <div className="reviews__inner">
        <h2 id="rev-title" className="reviews__title">
          What Do Our Customers Say
        </h2>

        <div className="reviews__list">
          {reviews.map((r, i) => (
            <figure key={`${r.name}-${i}`} className="reviews__item">
              <blockquote className="reviews__quote">
                <span className="reviews__mark reviews__mark--open" aria-hidden="true">
                  “
                </span>
                <p className="reviews__text">{r.text}</p>
                <span className="reviews__mark reviews__mark--close" aria-hidden="true">
                  ”
                </span>
              </blockquote>

              <figcaption className="reviews__person">
                {r.photo ? (
                  <img src={r.photo} alt="" className="reviews__avatar" width={64} height={64} loading="lazy" />
                ) : (
                  <Initials name={r.name} />
                )}
                <div className="reviews__meta">
                  <p className="reviews__name">{r.name}</p>
                  <Stars value={r.rating} />
                  {r.product && <p className="reviews__product">{r.product}</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import { site } from '../../data/site';
import { faqs } from '../../data/home';

export default function Faq() {
  const items = faqs({ email: site.email, phone: site.phone });
  return (
    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="h-sec">
        You ask, we answer
      </h2>
      <div className="faq__list">
        {items.map((f) => (
          <details key={f.q} className="faq__item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

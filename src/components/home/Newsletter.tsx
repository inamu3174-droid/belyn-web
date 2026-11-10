import NewsletterForm from '../NewsletterForm';

export default function Newsletter() {
  return (
    <section className="newsl" aria-labelledby="nl-title">
      <h2 id="nl-title" className="h-sec">
        Stay in the loop
      </h2>
      <p>New arrivals and news from BELYN, straight to your inbox.</p>
      <NewsletterForm id="nl-home" />
    </section>
  );
}

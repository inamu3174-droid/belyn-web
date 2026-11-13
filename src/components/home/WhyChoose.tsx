/** "Why Choose BELYN?": real text and cards; the four illustrations are cropped from the supplied artwork. */
const items = [
  { img: 'leaf', title: 'Thoughtfully Selected', text: 'Carefully chosen products selected for their natural character, quality and origin.', w: 173, h: 172 },
  { img: 'mortar', title: 'Honest & Natural', text: 'Naturally presented products with clear information and nothing unnecessary added.', w: 170, h: 174 },
  { img: 'check', title: 'Quality & Purity', text: 'Focused on quality, appropriate testing and careful attention to purity.', w: 146, h: 179 },
  { img: 'saffron', title: 'Rooted in Kashmir', text: 'Inspired by the natural richness of Kashmir and thoughtfully shared with the world.', w: 214, h: 171 },
] as const;

export default function WhyChoose() {
  return (
    <section className="why" aria-labelledby="why-title">
      <header className="why__head">
        <h2 id="why-title" className="why__title">
          <span className="why__rule" aria-hidden="true" />
          Why Choose BELYN?
          <span className="why__rule" aria-hidden="true" />
        </h2>
        <svg className="why__leaf" width="30" height="24" viewBox="0 0 30 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 22V12M15 12C15 6 11 3 3 3c0 7 4 9 12 9zM15 12c0-6 4-9 12-9 0 7-4 9-12 9z" />
        </svg>
      </header>
      <div className="why__grid">
        {items.map((i) => (
          <article key={i.title} className="why__card">
            <img className="why__icon" src={`/images/why-${i.img}.png`} width={i.w} height={i.h} alt="" loading="lazy" decoding="async" />
            <h3 className="why__name">{i.title}</h3>
            <p className="why__text">{i.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

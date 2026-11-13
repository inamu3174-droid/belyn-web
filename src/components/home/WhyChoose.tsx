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
        <h2 id="why-title" className="why__title">Why Choose BELYN?</h2>
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

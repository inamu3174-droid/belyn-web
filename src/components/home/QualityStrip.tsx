/** "Only the best makes it to BELYN": four quality posters (supplied artwork; text is part of each image). */
const posters = [
  { img: 'fssai', alt: 'Quality checks aligned with FSSAI parameters. Carefully tested for key quality and safety parameters.' },
  { img: 'checked', alt: 'Quality checked. Carefully selected. Key quality and safety parameters are assessed to help maintain the standard we expect from every product.' },
  { img: 'proof', alt: 'See the proof. Don’t just trust us. Lab reports for every batch, because real trust is built on transparency. This representation is for reference only.' },
  { img: 'extensive', alt: 'Extensive quality checks. From sourcing to packaging, every step is handled with care for quality, purity and consistency.' },
] as const;

export default function QualityStrip() {
  return (
    <section className="qual" aria-labelledby="qual-title">
      <header className="qual__head">
        <p className="qual__eyebrow">Our standard</p>
        <h2 id="qual-title" className="qual__title">
          Only the best makes it to <em>BELYN</em>
        </h2>
        <div className="qual__orn" aria-hidden="true">
          <span />
          <svg width="26" height="20" viewBox="0 0 30 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22V12M15 12C15 6 11 3 3 3c0 7 4 9 12 9zM15 12c0-6 4-9 12-9 0 7-4 9-12 9z" /></svg>
          <span />
        </div>
        <p className="qual__sub">Careful selection, careful checks and careful packing, from sourcing to your doorstep.</p>
      </header>
      <ul className="qual__track">
        {posters.map((p) => (
          <li key={p.img} className="qual__item">
            <img src={`/images/quality-${p.img}.jpg`} width={900} height={1200} alt={p.alt} loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    </section>
  );
}

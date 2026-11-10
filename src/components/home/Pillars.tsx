import { pillars } from '../../data/home';

const icons: Record<string, JSX.Element> = {
  origin: (
    <>
      <path d="M3 19 9 8l4 6 3-4 5 9Z" />
      <circle cx="17" cy="6" r="2" />
    </>
  ),
  sourcing: (
    <>
      <path d="M12 21V11" />
      <path d="M12 11c0-4 3-6 7-6 0 4-2 7-7 6Z" />
      <path d="M12 14c0-3-2-5-6-5 0 3 2 6 6 5Z" />
    </>
  ),
  quality: (
    <>
      <path d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3Z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  delivery: (
    <>
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </>
  ),
};

export default function Pillars() {
  return (
    <section className="pillars" aria-labelledby="why-title">
      <h2 id="why-title" className="h-sec">
        Why Choose BELYN?
      </h2>
      <ul className="pillars__grid">
        {pillars.map((p) => (
          <li key={p.id} className="pillar">
            <svg className="pillar__icon" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icons[p.id]}
            </svg>
            <h3 className="pillar__title">{p.title}</h3>
            <p className="pillar__text">{p.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

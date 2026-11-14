import type { ReactNode } from 'react';

/** "Why Choose BELYN?": four value cards with line icons drawn as inline SVG (48px grid, 2.2 stroke). */
const icons: Record<string, ReactNode> = {
  selected: (
    <>
      <circle cx="24" cy="24" r="21" />
      <path d="M24 37V27" />
      <path d="M23 34c-.5-6.2-4.6-9.6-11-9.8.2 6.4 4.6 10.2 11 9.8Z" fill="currentColor" />
      <path d="M25 33c.2-9 5.4-14.6 14-15.4.5 9-4.8 15.2-14 15.4Z" fill="currentColor" />
    </>
  ),
  honest: (
    <>
      <path d="M5 22h38c0 9.6-7.8 17-19 17S5 31.6 5 22Z" />
      <path d="M16 42h16" />
      <path d="M28 21.5 36.5 9.2a3 3 0 0 1 4.9 3.4L33 23" />
      <path d="M24 35c-.2-3.6-2.4-5.6-6-5.8.1 3.7 2.5 6 6 5.8Zm.6-.2c3.4-.1 5.6-2.2 5.9-5.6-3.6.2-5.8 2.2-5.9 5.6Z" fill="currentColor" strokeWidth="1.2" />
    </>
  ),
  quality: (
    <>
      <circle cx="24" cy="19" r="16" />
      <circle cx="24" cy="19" r="11.2" />
      <path d="m18.2 19.4 4.2 4.2 7.6-8.4" />
      <path d="m16.4 33.5-4.2 11.2 6.2-3 3 5" />
      <path d="m31.6 33.5 4.2 11.2-6.2-3-3 5" />
    </>
  ),
  rooted: (
    <>
      <path d="M24 5c-5.4 5.2-6.6 13.4 0 25 6.6-11.6 5.4-19.8 0-25Z" />
      <path d="M24 31C13.6 29.6 7.4 23.4 5 14c8.6.2 15.4 4.4 19 17Z" />
      <path d="M24 31c10.4-1.4 16.6-7.6 19-17-8.6.2-15.4 4.4-19 17Z" />
      <path d="M24 31c-6.6 3-13.6 3.4-20 .2 6.4-5 14.2-5 20-.2Zm0 0c6.6 3 13.6 3.4 20 .2-6.4-5-14.2-5-20-.2Z" />
      <path d="M24 31v12M20 31l-3-10M28 31l3-10" />
    </>
  ),
};

const items = [
  { id: 'selected', title: 'Thoughtfully Selected', text: 'Carefully chosen products selected for their natural character, quality and origin.' },
  { id: 'honest', title: 'Honest & Natural', text: 'Naturally presented products with clear information and nothing unnecessary added.' },
  { id: 'quality', title: 'Quality & Purity', text: 'Focused on quality, appropriate testing and careful attention to purity.' },
  { id: 'rooted', title: 'Rooted in Kashmir', text: 'Inspired by the natural richness of Kashmir and thoughtfully shared with the world.' },
] as const;

export default function WhyChoose() {
  return (
    <section className="why" aria-labelledby="why-title">
      <h2 id="why-title" className="why__title">Why Choose BELYN?</h2>
      <ul className="why__grid">
        {items.map((i) => (
          <li key={i.id} className="why__card">
            <svg className="why__icon" width="52" height="52" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {icons[i.id]}
            </svg>
            <h3 className="why__name">{i.title}</h3>
            <p className="why__text">{i.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

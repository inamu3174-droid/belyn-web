import { site } from '../../data/site';
import { gifting } from '../../data/brand';
import { useSeo } from '../../lib/seo';
import Banner from './Banner';

type Kind = 'festive' | 'corporate';

const wa = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5a9.5 9.5 0 0 0-8.1 14.4L2.5 21.5l4.7-1.2A9.5 9.5 0 1 0 12 2.5Zm0 1.8a7.7 7.7 0 1 1-3.9 14.4l-.3-.2-2.8.7.8-2.7-.2-.3A7.7 7.7 0 0 1 12 4.3Zm-3 3.4c-.2 0-.5.1-.7.4-.3.3-.9.9-.9 2.1s1 2.5 1.1 2.700c.1.2 1.900 3 4.700 4.100 2.300.9 2.800.7 3.300.7.500-.1 1.600-.7 1.800-1.300.2-.6.2-1.2.2-1.300-.1-.1-.3-.2-.6-.3l-1.800-.9c-.2-.1-.4-.1-.6.100l-.8 1c-.1.2-.3.2-.6.100-.3-.1-1.100-.4-2-1.300-.8-.7-1.300-1.500-1.400-1.800-.1-.2 0-.4.100-.5l.4-.5.3-.4c.1-.2.100-.3 0-.5l-.8-2c-.2-.5-.4-.4-.6-.4H9Z" />
  </svg>
);
const mail = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.500 6 8.500-6" />
  </svg>
);

/** Shared layout for Festive and Corporate Gifting: hero banner, intro, and a WhatsApp / email enquiry card. */
export default function GiftingPage({ kind }: { kind: Kind }) {
  const g = gifting[kind];
  useSeo({ title: `${g.eyebrow} | BELYN`, description: g.seo, path: g.path });
  const waHref = `https://wa.me/${site.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(g.message)}`;
  const mailHref = `mailto:${site.email}?subject=${encodeURIComponent(g.subject)}&body=${encodeURIComponent(g.message)}`;
  return (
    <main className="brand">
      <Banner image={g.banner} label="Kashmir landscape">
        <h1 className="bnr__h bnr__h--gift">{g.hero.title}</h1>
        <p className="bnr__tag">{g.hero.tag}</p>
        {g.hero.sub && <p className="bnr__p bnr__p--sub">{g.hero.sub}</p>}
      </Banner>
      <article className="brand__wrap brand__wrap--narrow">
        <header className="brand__head">
          <p className="brand__eyebrow">{g.eyebrow}</p>
          <p className="brand__lead">{g.lead}</p>
          <span className="orn" aria-hidden="true" />
        </header>
        <section className="enq" aria-labelledby="enq-title">
          <h2 id="enq-title" className="brand__h2">{g.ask.title}</h2>
          <p>{g.ask.text}</p>
          <div className="enq__btns">
            <a className="enq__btn enq__btn--wa" href={waHref} target="_blank" rel="noopener noreferrer">
              {wa}
              <span>Enquire via WhatsApp</span>
            </a>
            <a className="enq__btn enq__btn--mail" href={mailHref}>
              {mail}
              <span>Enquire via Email</span>
            </a>
          </div>
          <p className="enq__note">{g.note}</p>
        </section>
        <p className="brand__sign brand__sign--end">{gifting.closing}</p>
      </article>
    </main>
  );
}

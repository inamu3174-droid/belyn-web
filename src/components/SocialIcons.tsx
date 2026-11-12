import { site } from '../data/site';

const wa = () => `https://wa.me/${site.whatsapp.replace(/\D/g, '')}`;

/** Round social/contact icons (Facebook, Instagram, WhatsApp, Email). Only real BELYN accounts are listed. */
export default function SocialIcons({ tabIndex }: { tabIndex?: number }) {
  const ext = { target: '_blank', rel: 'noopener noreferrer', tabIndex } as const;
  return (
    <div className="social">
      <ul className="social__list">
        {site.facebook && (
          <li>
            <a href={site.facebook} aria-label="BELYN on Facebook" {...ext}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21z" /></svg>
            </a>
          </li>
        )}
        {site.instagram && (
          <li>
            <a href={site.instagram} aria-label="BELYN on Instagram" {...ext}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" /></svg>
            </a>
          </li>
        )}
        {site.whatsapp && (
          <li>
            <a href={wa()} aria-label="Chat with BELYN on WhatsApp" {...ext}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20l1.2-4.1A8 8 0 1 1 8.2 19z" /><path d="M9.2 8.8c.3 2.6 2.4 4.7 5 5l1-1.1-1.6-.9-.7.6c-.8-.3-1.6-1.1-1.9-1.9l.6-.7-.9-1.6z" fill="currentColor" stroke="none" /></svg>
            </a>
          </li>
        )}
        {site.email && (
          <li>
            <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} tabIndex={tabIndex}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.5 7 8.5 6.5L20.5 7" /></svg>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

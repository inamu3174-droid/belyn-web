import { useSeo } from '../lib/seo';
import { Link } from '../lib/router';
import { site } from '../data/site';
import NotFound from './NotFound';

const titles: Record<string, string> = { shipping: 'Shipping Policy', privacy: 'Privacy Policy', terms: 'Terms & Conditions' };

export default function Policy({ slug }: { slug: string }) {
  const title = titles[slug];
  useSeo({ title: title || 'Not found', description: `${title ?? 'Policy'} for BELYN.`, path: `/policies/${slug}`, noindex: true });
  if (!title) return <NotFound />;
  return (
    <main className="page page--narrow">
      <header className="page__head">
        <p className="eyebrow">POLICIES</p>
        <h1 className="h-page">{title.toUpperCase()}</h1>
      </header>
      {/* TODO(real copy): paste Belyn's official policy text here (copy it from belyn.in). Not invented on purpose. */}
      <div className="notice">
        <p>The official {title.toLowerCase()} text for BELYN will appear here.</p>
        <p>
          In the meantime, please <Link to="/contact">contact us</Link>
          {site.email ? <> at <a href={`mailto:${site.email}`}>{site.email}</a></> : null} with any questions.
        </p>
      </div>
    </main>
  );
}

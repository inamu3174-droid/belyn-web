import { useSeo } from '../lib/seo';
import { Link } from '../lib/router';
import { site } from '../data/site';
import NotFound from './NotFound';
import { JK_FREE_THRESHOLD, JK_SHIPPING, INDIA_SHIPPING } from '../lib/shipping';

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
      {slug === 'shipping' && (
        <section className="policy-block">
          <h2>Shipping charges</h2>
          <h3>Jammu &amp; Kashmir</h3>
          <p>Enjoy complimentary shipping on orders of ₹{JK_FREE_THRESHOLD} and above.</p>
          <p>Orders below ₹{JK_FREE_THRESHOLD} are subject to a flat shipping fee of ₹{JK_SHIPPING}.</p>
          <h3>Across India</h3>
          <p>A flat shipping fee of ₹{INDIA_SHIPPING} applies to all orders.</p>
          <p>The charge is shown in your cart and at checkout before you pay.</p>
        </section>
      )}
      {/* TODO(real copy): paste Belyn's official policy text here (copy it from belyn.in). Not invented on purpose. */}
      <div className="notice">
        <p>{slug === 'shipping' ? 'Delivery timelines and further details will appear here.' : `The official ${title.toLowerCase()} text for BELYN will appear here.`}</p>
        <p>
          In the meantime, please <Link to="/contact">contact us</Link>
          {site.email ? <> at <a href={`mailto:${site.email}`}>{site.email}</a></> : null} with any questions.
        </p>
      </div>
    </main>
  );
}

import { Link } from '../lib/router';
import { useSeo } from '../lib/seo';

export default function NotFound() {
  useSeo({ title: 'Page not found', description: 'This page could not be found.', path: location.pathname, noindex: true });
  return (
    <main className="page page--narrow">
      <header className="page__head">
        <p className="eyebrow">404</p>
        <h1 className="h-page">LOST IN THE VALLEY</h1>
        <p className="lede">We couldn&rsquo;t find that page.</p>
      </header>
      <Link to="/" className="btn btn--lime">
        Back home <span aria-hidden="true">&rarr;</span>
      </Link>
    </main>
  );
}

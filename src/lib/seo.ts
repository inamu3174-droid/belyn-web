import { useEffect } from 'react';

interface SeoOpts {
  title: string;
  description?: string;
  path?: string;
  noindex?: boolean;
  jsonLd?: object;
}

export function useSeo({ title, description, path, noindex, jsonLd }: SeoOpts) {
  useEffect(() => {
    document.title = title;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    if (description) setMeta('description', description);
    if (noindex) setMeta('robots', 'noindex');
    else {
      const r = document.querySelector('meta[name="robots"]');
      if (r) r.remove();
    }
    // simple json-ld
    const existing = document.getElementById('json-ld');
    if (existing) existing.remove();
    if (jsonLd) {
      const s = document.createElement('script');
      s.id = 'json-ld';
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [title, description, path, noindex, jsonLd]);
}

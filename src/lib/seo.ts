import { useEffect } from 'react';
import { site } from '../data/site';

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSeo(opts: { title: string; description: string; path: string; noindex?: boolean; jsonLd?: object }) {
  const { title, description, path, noindex, jsonLd } = opts;
  useEffect(() => {
    const full = title.includes('BELYN') ? title : `${title} | BELYN`;
    document.title = full;
    const url = site.url + path;
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', full);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[name="robots"]', 'name', 'robots', noindex ? 'noindex,follow' : 'index,follow');
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
    let ld = document.getElementById('ld-json');
    if (jsonLd) {
      if (!ld) {
        ld = document.createElement('script');
        ld.id = 'ld-json';
        ld.setAttribute('type', 'application/ld+json');
        document.head.appendChild(ld);
      }
      ld.textContent = JSON.stringify(jsonLd);
    } else ld?.remove();
  }, [title, description, path, noindex, jsonLd]);
}

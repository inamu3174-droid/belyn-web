import { useSyncExternalStore } from 'react';

/**
 * Tiny localStorage-backed lists (wishlist, recently viewed) that stay in sync across components and tabs.
 * Reads are validated against the catalog by callers, so stale slugs are harmless.
 */
function makeList(key: string, max: number) {
  const listeners = new Set<() => void>();
  let cache: string[] | null = null;

  const read = (): string[] => {
    if (cache) return cache;
    try {
      const raw = JSON.parse(localStorage.getItem(key) || '[]');
      cache = Array.isArray(raw) ? raw.filter((x) => typeof x === 'string').slice(0, max) : [];
    } catch {
      cache = [];
    }
    return cache;
  };
  const write = (next: string[]) => {
    cache = next.slice(0, max);
    try {
      localStorage.setItem(key, JSON.stringify(cache));
    } catch {
      /* storage unavailable: list works for this visit only */
    }
    listeners.forEach((l) => l());
  };
  const subscribe = (cb: () => void) => {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        cache = null;
        cb();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener('storage', onStorage);
    };
  };
  const use = () => useSyncExternalStore(subscribe, read, () => []);
  return { read, write, use };
}

const wish = makeList('belyn.wishlist.v1', 100);
export const useWishlist = wish.use;
export function toggleWishlist(slug: string) {
  const cur = wish.read();
  wish.write(cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur]);
}

const recent = makeList('belyn.recent.v1', 12);
export const useRecentlyViewed = recent.use;
export function recordViewed(slug: string) {
  const cur = recent.read();
  if (cur[0] === slug) return;
  recent.write([slug, ...cur.filter((s) => s !== slug)]);
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';

// Minimal History-API router (keeps the bundle small; no extra dependency).
interface Ctx {
  path: string;
  navigate: (to: string) => void;
}
const RouterCtx = createContext<Ctx>({ path: '/', navigate: () => {} });

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin);
    if (url.pathname === window.location.pathname && !url.hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    window.history.pushState({}, '', url.pathname + url.search + url.hash);
    setPath(url.pathname);
    if (url.hash) {
      const jump = () => document.querySelector(url.hash)?.scrollIntoView();
      requestAnimationFrame(() => {
        if (document.querySelector(url.hash)) jump();
        else window.setTimeout(jump, 150); // page is still mounting
      });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, []);
  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterCtx.Provider value={value}>{children}</RouterCtx.Provider>;
}

export const useRouter = () => useContext(RouterCtx);

export function Link({ to, onClick, children, ...rest }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useRouter();
  return (
    <a
      href={to}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        if (rest.target && rest.target !== '_self') return;
        e.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

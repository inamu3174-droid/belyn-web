import { useEffect } from 'react';
import { CartProvider } from './lib/cart';
import { Router, useRouter } from './lib/router';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Collection from './pages/Collection';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import ShopAll from './pages/explore/ShopAll';
import Featured from './pages/explore/Featured';
import SampleKit from './pages/explore/SampleKit';
import BuildBox from './pages/explore/BuildBox';
import Product from './pages/Product';
import Story from './pages/Story';
import Wholesale from './pages/Wholesale';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Policy from './pages/Policy';
import NotFound from './pages/NotFound';

function Routes() {
  const { path } = useRouter();
  const clean = path.replace(/\/+$/, '') || '/';

  // fade-up reveal for inner-page blocks
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [clean]);

  let page;
  if (clean === '/') page = <Home />;
  else if (clean === '/shop') page = <ShopAll />;
  else if (clean === '/featured') page = <Featured />;
  else if (clean === '/sample-kit') page = <SampleKit />;
  else if (clean === '/build-your-own-box') page = <BuildBox />;
  else if (clean.startsWith('/collections/')) page = <Collection slug={clean.split('/')[2]} />;
  else if (clean === '/wishlist') page = <Wishlist />;
  else if (clean === '/account') page = <Account />;
  else if (clean.startsWith('/product/')) page = <Product slug={clean.split('/')[2]} />;
  else if (clean === '/story') page = <Story />;
  else if (clean === '/wholesale') page = <Wholesale />;
  else if (clean === '/contact') page = <Contact />;
  else if (clean === '/checkout') page = <Checkout />;
  else if (clean.startsWith('/policies/')) page = <Policy slug={clean.split('/')[2]} />;
  else page = <NotFound />;

  return (
    <>
      <Header />
      <div key={clean} className="route">
        {page}
      </div>
      <Footer />
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Routes />
      </CartProvider>
    </Router>
  );
}

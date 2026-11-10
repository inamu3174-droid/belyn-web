import HeroSlider from '../components/home/HeroSlider';
import Welcome from '../components/home/Welcome';
import Pillars from '../components/home/Pillars';
import Editorial from '../components/home/Editorial';
import FocusSections from '../components/home/FocusSections';
import ShippingInfo from '../components/home/ShippingInfo';
import Faq from '../components/home/Faq';
import Reviews from '../components/home/Reviews';
import Newsletter from '../components/home/Newsletter';
import StorySection from '../components/StorySection';
import { useSeo } from '../lib/seo';

export default function Home() {
  useSeo({
    title: 'BELYN | Born in Kashmir. Crafted with Purity.',
    description: 'Belyn offers premium Kashmiri products: white honey, saffron, almonds, walnuts, dry fruits and kahwa. Purely from Kashmir.',
    path: '/',
  });
  return (
    <main className="home">
      <HeroSlider />
      <Welcome />
      <Editorial />
      <FocusSections />
      <Pillars />
      <StorySection />
      <ShippingInfo />
      <Faq />
      <Reviews />
      <Newsletter />
    </main>
  );
}

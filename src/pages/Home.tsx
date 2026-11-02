import Hero from '../components/Hero';
import FeatureStrip from '../components/FeatureStrip';
import ProductShowcase from '../components/ProductShowcase';
import TextRows from '../components/TextRows';
import SplitFeature from '../components/SplitFeature';
import StorySection from '../components/StorySection';
import Journal from '../components/Journal';
import { useSeo } from '../lib/seo';

export default function Home() {
  useSeo({
    title: 'BELYN | Born in Kashmir. Crafted with Purity.',
    description: 'Belyn offers premium Kashmiri products: white honey, saffron, almonds, walnuts, dry fruits and kahwa. Purely from Kashmir.',
    path: '/',
  });
  return (
    <>
      <Hero />
      <div className="sheet">
        <FeatureStrip />
        <hr className="rule" />
        <ProductShowcase />
        <hr className="rule" />
        <TextRows />
        <SplitFeature />
        <hr className="rule" />
        <StorySection />
        <hr className="rule" />
        <Journal />
        <hr className="rule rule--end" />
      </div>
    </>
  );
}

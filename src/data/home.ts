import { collections, productsIn, type Collection } from './collections';
import { JK_FREE_THRESHOLD, FLAT_SHIPPING } from '../lib/shipping';

/**
 * Homepage content, in one place. Edit copy here; nothing else on the home page hard-codes text.
 * Only state what is true and verifiable. Do not add ratings, certifications or review quotes.
 */

/** Messages in the slim bar above the header (shown in a loop). */
export const announcements: string[] = [
  '100% PURE & RAW',
  'DIRECT FROM KASHMIR',
  'LAB TESTED FOR PURITY',
  'NATURE, LEFT UNALTERED',
];

/** Collections that have at least one product (empty ones such as gift boxes are left out until stocked). */
export const liveCollections = (): Collection[] => collections.filter((c) => productsIn(c).length > 0);

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  kind: 'honey' | 'saffron' | 'walnut' | 'almond' | 'kahwa';
  primary: { label: string; to: string };
  secondary: { label: string; to: string };
}

/** Brand slide first, then one slide per live collection (copy comes from the collection itself). */
export const heroSlides = (): HeroSlide[] => [
  {
    id: 'brand',
    eyebrow: 'BELYN',
    title: 'Purely from Kashmir.',
    body: 'Honey, saffron, dry fruits and kahwa from the valley, delivered across India.',
    kind: 'honey',
    primary: { label: 'Shop Now', to: '/shop' },
    secondary: { label: 'Our Story', to: '/story' },
  },
  ...liveCollections().map<HeroSlide>((c) => ({
    id: c.slug,
    eyebrow: 'Collection',
    title: c.title,
    body: c.intro,
    kind: c.kind,
    primary: { label: 'Shop Now', to: `/collections/${c.slug}` },
    secondary: { label: 'Explore Collection', to: `/collections/${c.slug}` },
  })),
];

export const pillars = [
  {
    id: 'origin',
    title: 'Born in Kashmir',
    text: 'Honey, saffron, almonds, walnuts and kahwa from the valley we call home.',
  },
  {
    id: 'sourcing',
    title: 'Carefully Sourced',
    text: 'We choose what goes into every pack and describe it plainly on each product page.',
  },
  {
    id: 'quality',
    title: 'Quality Focused',
    text: 'Nature, left unaltered. We keep our products raw and describe them plainly.',
  },
  {
    id: 'delivery',
    title: 'Delivered With Care',
    text: `Shipped across India. Free shipping in Jammu & Kashmir from ₹${JK_FREE_THRESHOLD}; ₹${FLAT_SHIPPING} flat elsewhere.`,
  },
] as const;

export const faqs = (contact: { email: string; phone: string }) => [
  { q: 'Where do BELYN products come from?', a: 'BELYN products come from Kashmir, India.' },
  {
    q: 'How much is shipping?',
    a: `Orders within Jammu & Kashmir ship free from ₹${JK_FREE_THRESHOLD} and cost ₹${FLAT_SHIPPING} below that. Everywhere else in India is a flat ₹${FLAT_SHIPPING}. The charge is shown in your cart and at checkout before you pay.`,
  },
  {
    q: 'How can I pay?',
    a: 'You can pay online with UPI or cards through Razorpay. Cash on Delivery may also be offered at checkout.',
  },
  {
    q: 'How should I store my order?',
    a: 'Each product page lists its own storage instructions and shelf life, so check the product you ordered.',
  },
  {
    q: 'How do I reach you?',
    a: `Email ${contact.email}${contact.phone ? ` or call ${contact.phone}` : ''}, or use the contact page.`,
  },
];

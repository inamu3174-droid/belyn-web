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
  title: string;
  image: string;
  primary: { label: string; to: string };
}

/** Four promotional banner images for the hero carousel. */
export const heroSlides = (): HeroSlide[] => [
  {
    id: 'shop',
    title: 'Shop Now at Belyn.in — Born in Kashmir. Crafted with Purity.',
    image: '/images/shop.webp',
    primary: { label: 'Shop Now', to: '/shop' },
  },
  {
    id: 'saffron',
    title: 'Up to 40% off on Saffron',
    image: '/images/saffron.webp',
    primary: { label: 'Shop Now', to: '/collections/saffron' },
  },
  {
    id: 'honey',
    title: 'Up to 40% off on all Honey',
    image: '/images/honey.webp',
    primary: { label: 'Shop Now', to: '/collections/honey' },
  },
  {
    id: 'dry-fruits',
    title: 'Up to 50% off on all Dry Fruits',
    image: '/images/dryfruits.webp',
    primary: { label: 'Shop Now', to: '/collections/dry-fruits' },
  },
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

/**
 * Gifting tabs under "Welcome to BELYN". There are no gift-box products yet, so each opens an enquiry
 * (the contact form, pre-filled) instead of a product grid. Replace with real collections once stocked.
 */
export const giftingTabs = [
  {
    id: 'festive',
    label: 'Festive Gifting',
    icon: 'gift',
    title: 'Festive Gifting',
    text: 'Planning gifts for a festival or celebration? Tell us what you have in mind and we will put together a selection from BELYN products.',
    message: 'Hello BELYN, I would like to enquire about festive gifting. ',
  },
  {
    id: 'corporate',
    label: 'Corporate Gifting',
    icon: 'office',
    title: 'Corporate Gifting',
    text: 'Gifts for clients, teams or events. Share the quantity and timeline and we will get back to you directly.',
    message: 'Hello BELYN, I would like to enquire about corporate gifting. Quantity needed: ',
  },
  {
    id: 'custom',
    label: 'Build Your Own Box',
    icon: 'box',
    title: 'Build Your Own Box',
    text: 'Choose the BELYN products you want in one box. Tell us your picks and we will confirm availability and the total.',
    message: 'Hello BELYN, I would like to build my own box with these products: ',
  },
  {
    id: 'sample',
    label: 'Sample Kit',
    icon: 'bag',
    title: 'Sample Kit',
    text: 'Want to try BELYN before a bigger order? Ask us about sample options and we will tell you what is available.',
    message: 'Hello BELYN, I would like to know about sample kit options. ',
  },
] as const;

export type GiftingId = (typeof giftingTabs)[number]['id'];

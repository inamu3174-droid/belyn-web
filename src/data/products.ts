// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT CATALOG  —  EDIT THIS FILE WITH REAL BELYN DATA
//
// belyn.in could not be reached while this site was generated, so:
//   • PRICES and SIZES below are PLACEHOLDERS (not real Belyn prices).
//   • PRODUCT IMAGES are drawn placeholders. To use real photography, drop files
//     into /public/images/products/ and set `image: '/images/products/<file>.jpg'`.
// While PRICES_ARE_PLACEHOLDERS is true a small "Placeholder price" tag is shown
// on cards and product pages so nothing fake ships by accident.
// ─────────────────────────────────────────────────────────────────────────────
export const PRICES_ARE_PLACEHOLDERS = true;

export interface Variant {
  id: string;
  label: string; // e.g. "250 g"
  price: number; // INR, whole rupees
}

export interface Product {
  slug: string;
  name: string;
  short: string; // card line
  description: string;
  bg: string; // card background colour (from the reference palette)
  image?: string; // real photo URL; falls back to drawn jar
  jar: { lid: string; body: string; label: string; ink: string; lines: string[] };
  variants: Variant[];
}

export const products: Product[] = [
  {
    slug: 'kashmiri-white-honey',
    name: 'Kashmiri White Honey',
    short: 'White honey from Kashmir',
    description: 'Kashmiri white honey, selected and packed by Belyn. Born in Kashmir. Crafted with Purity.',
    bg: '#efdd3d',
    jar: { lid: '#193e10', body: '#f3e6b8', label: '#193e10', ink: '#ccfd51', lines: ['KASHMIRI', 'WHITE', 'HONEY'] },
    variants: [
      { id: 'honey-250', label: '250 g', price: 999 }, // PLACEHOLDER
      { id: 'honey-500', label: '500 g', price: 1799 }, // PLACEHOLDER
    ],
  },
  {
    slug: 'kashmiri-saffron',
    name: 'Kashmiri Saffron',
    short: 'Saffron from the valley',
    description: 'Kashmiri saffron, packed by Belyn. A little goes a long way in kahwa, sweets and rice.',
    bg: '#b7533c',
    jar: { lid: '#4b1c0e', body: '#7a2a1a', label: '#4b1c0e', ink: '#efdd3d', lines: ['KASHMIRI', 'SAFFRON'] },
    variants: [
      { id: 'saffron-1', label: '1 g', price: 499 }, // PLACEHOLDER
      { id: 'saffron-2', label: '2 g', price: 949 }, // PLACEHOLDER
    ],
  },
  {
    slug: 'kashmiri-almonds',
    name: 'Kashmiri Almonds',
    short: 'Almonds from Kashmir',
    description: 'Kashmiri almonds, selected and packed by Belyn.',
    bg: '#cbed41',
    jar: { lid: '#193e10', body: '#d9b98a', label: '#193e10', ink: '#ffffff', lines: ['KASHMIRI', 'ALMONDS'] },
    variants: [
      { id: 'almonds-250', label: '250 g', price: 699 }, // PLACEHOLDER
      { id: 'almonds-500', label: '500 g', price: 1299 }, // PLACEHOLDER
    ],
  },
  {
    slug: 'kashmiri-walnuts',
    name: 'Kashmiri Walnuts',
    short: 'Walnuts from Kashmir',
    description: 'Kashmiri walnuts, selected and packed by Belyn.',
    bg: '#a4dcf6',
    jar: { lid: '#1f4fc2', body: '#c79a6b', label: '#1f4fc2', ink: '#ffffff', lines: ['KASHMIRI', 'WALNUTS'] },
    variants: [
      { id: 'walnuts-250', label: '250 g', price: 599 }, // PLACEHOLDER
      { id: 'walnuts-500', label: '500 g', price: 1099 }, // PLACEHOLDER
    ],
  },
  {
    slug: 'premium-dry-fruits',
    name: 'Premium Dry Fruits',
    short: 'A Kashmiri dry fruit mix',
    description: 'A Belyn selection of premium dry fruits from Kashmir.',
    bg: '#f2b38c',
    jar: { lid: '#4b1c0e', body: '#c9824f', label: '#4b1c0e', ink: '#f2b38c', lines: ['PREMIUM', 'DRY', 'FRUITS'] },
    variants: [
      { id: 'dryfruits-250', label: '250 g', price: 799 }, // PLACEHOLDER
      { id: 'dryfruits-500', label: '500 g', price: 1499 }, // PLACEHOLDER
    ],
  },
  {
    slug: 'kashmiri-kahwa',
    name: 'Kashmiri Kahwa',
    short: 'Traditional Kashmiri tea',
    description: 'Kashmiri kahwa, packed by Belyn. Steep it slow and sip it warm.',
    bg: '#7fc8a9',
    jar: { lid: '#193e10', body: '#2f6b4a', label: '#193e10', ink: '#ccfd51', lines: ['KASHMIRI', 'KAHWA'] },
    variants: [
      { id: 'kahwa-50', label: '50 g', price: 399 }, // PLACEHOLDER
      { id: 'kahwa-100', label: '100 g', price: 749 }, // PLACEHOLDER
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const formatPrice = (n: number) => '₹' + n.toLocaleString('en-IN');

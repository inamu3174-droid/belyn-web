export const PRICES_ARE_PLACEHOLDERS = true;

export interface Variant {
  id: string;
  label: string;
  price: number;
}

export interface Product {
  slug: string;
  name: string;
  short: string;
  description: string;
  bg: string;
  image?: string;
  jar: {
    lid: string;
    body: string;
    label: string;
    ink: string;
    lines: string[];
  };
  variants: Variant[];
}

export const products: Product[] = [
  {
    slug: 'kashmiri-white-honey',
    name: 'White Honey',
    short: 'Pure White',
    description: 'Delicate Kashmiri white honey, raw and unfiltered.',
    bg: '#f8f0d8',
    jar: { lid: '#c4a35a', body: '#f5e6b8', label: '#fff8e7', ink: '#5c3d1e', lines: ['WHITE', 'HONEY'] },
    variants: [
      { id: '250g', label: '250 g', price: 899 },
      { id: '500g', label: '500 g', price: 1599 },
    ],
  },
  {
    slug: 'kashmiri-saffron',
    name: 'Kashmiri Saffron',
    short: 'Mongra',
    description: 'Hand-picked Kashmiri Mongra saffron threads.',
    bg: '#f4d4b8',
    jar: { lid: '#8b3a2a', body: '#e8a87c', label: '#fff0e0', ink: '#5c1e10', lines: ['SAFFRON'] },
    variants: [
      { id: '1g', label: '1 g', price: 1499 },
      { id: '2g', label: '2 g', price: 2799 },
    ],
  },
  {
    slug: 'kashmiri-almonds',
    name: 'Kashmiri Almonds',
    short: 'Mamra',
    description: 'Premium Kashmiri Mamra almonds.',
    bg: '#e8f0c8',
    jar: { lid: '#6b5a3a', body: '#d4c4a0', label: '#f5f0e0', ink: '#3a2e1a', lines: ['ALMONDS'] },
    variants: [
      { id: '250g', label: '250 g', price: 699 },
      { id: '500g', label: '500 g', price: 1299 },
    ],
  },
  {
    slug: 'kashmiri-walnuts',
    name: 'Kashmiri Walnuts',
    short: 'Kernels',
    description: 'Fresh Kashmiri walnut kernels.',
    bg: '#d8e8f0',
    jar: { lid: '#5a4a3a', body: '#c4b090', label: '#f0e8d8', ink: '#3a2e1a', lines: ['WALNUTS'] },
    variants: [
      { id: '250g', label: '250 g', price: 599 },
      { id: '500g', label: '500 g', price: 1099 },
    ],
  },
  {
    slug: 'premium-dry-fruits',
    name: 'Premium Dry Fruits',
    short: 'Mix',
    description: 'A curated mix of premium Kashmiri dry fruits.',
    bg: '#f0e0d0',
    jar: { lid: '#6b4a2a', body: '#d8b890', label: '#fff5e8', ink: '#3a2e1a', lines: ['DRY', 'FRUITS'] },
    variants: [
      { id: '250g', label: '250 g', price: 799 },
      { id: '500g', label: '500 g', price: 1499 },
    ],
  },
  {
    slug: 'kashmiri-kahwa',
    name: 'Kashmiri Kahwa',
    short: 'Blend',
    description: 'Traditional Kashmiri kahwa blend with saffron and spices.',
    bg: '#d0e8d8',
    jar: { lid: '#3a5a4a', body: '#a0c4b0', label: '#e8f5ee', ink: '#1a3a2a', lines: ['KAHWA'] },
    variants: [
      { id: '50g', label: '50 g', price: 449 },
      { id: '100g', label: '100 g', price: 799 },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

import { products, type Product } from './products';

export interface Collection {
  /** URL slug: /collections/<slug> ("all" = every product, also served at /shop) */
  slug: string;
  /** matches Product.category; undefined = all products */
  category?: string;
  title: string;
  /** one line used on cards and menus */
  blurb: string;
  /** longer intro shown on the collection page banner */
  intro: string;
  kind: 'honey' | 'saffron' | 'almond' | 'kahwa' | 'walnut';
}

export const collections: Collection[] = [
  {
    slug: 'honey',
    category: 'honey',
    title: 'Honey',
    blurb: 'Raw, unfiltered Kashmiri honey.',
    intro: 'Raw and unfiltered honeys from Kashmir, each shaped by its own floral source.',
    kind: 'honey',
  },
  {
    slug: 'saffron',
    category: 'saffron',
    title: 'Saffron',
    blurb: 'Hand-picked saffron threads.',
    intro: 'Saffron threads for kitchens, kahwa and gifting.',
    kind: 'saffron',
  },
  {
    slug: 'dry-fruits',
    category: 'dry-fruits',
    title: 'Dry Fruits',
    blurb: 'Almonds and walnuts from Kashmir.',
    intro: 'Mamra almonds and walnut kernels, sourced from Kashmir.',
    kind: 'almond',
  },
  {
    slug: 'kahwa',
    category: 'kahwa',
    title: 'Kahwa',
    blurb: 'Traditional Kashmiri saffron kahwa.',
    intro: 'The traditional Kashmiri tea, brewed with saffron.',
    kind: 'kahwa',
  },
  {
    slug: 'gift-boxes',
    category: 'gift-boxes',
    title: 'Gift Boxes',
    blurb: 'Curated Kashmiri gifting.',
    intro: 'Curated gift boxes of Kashmiri specialities.',
    kind: 'walnut',
  },
];

export const allCollection: Collection = {
  slug: 'all',
  title: 'Shop All',
  blurb: 'Everything from BELYN.',
  intro: 'Honey, saffron, dry fruits and kahwa, purely from Kashmir.',
  kind: 'honey',
};

export const getCollection = (slug: string): Collection | undefined =>
  slug === 'all' ? allCollection : collections.find((c) => c.slug === slug);

export const productsIn = (c: Collection): Product[] =>
  c.category ? products.filter((p) => p.category === c.category) : products;

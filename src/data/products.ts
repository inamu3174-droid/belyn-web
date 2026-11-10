import catalog from '../../shared/catalog.json';

/**
 * Variant ids, labels and prices live ONLY in shared/catalog.json so the storefront
 * and the server (api/*) always agree. Edit prices there, then set
 * "placeholderPrices": false.
 */
export const PRICES_ARE_PLACEHOLDERS: boolean = catalog._meta.placeholderPrices;

type CatalogVariant = { label: string; price: number; inStock?: boolean; compareAt?: number };
type CatalogProduct = {
  name: string;
  category: string;
  keywords: string[];
  bestseller?: boolean;
  rating?: { value: number; count: number };
  variants: Record<string, CatalogVariant>;
};
const catalogProducts = catalog.products as unknown as Record<string, CatalogProduct>;

function variant(slug: string, id: string): Variant {
  const v = catalogProducts[slug]?.variants[id];
  if (!v) throw new Error(`catalog.json is missing ${slug}/${id}`);
  return { id, label: v.label, price: v.price, inStock: v.inStock !== false, compareAt: v.compareAt };
}

export interface Variant {
  id: string;
  label: string;
  price: number;
  /** false = sold out (set in shared/catalog.json) */
  inStock: boolean;
  /** original price, only when a real discount applies (shared/catalog.json) */
  compareAt?: number;
}

export interface NutritionRow {
  nutrient: string;
  value: string;
}

export interface Product {
  slug: string;
  /** collection id: honey | saffron | dry-fruits | kahwa | gift-boxes */
  category: string;
  /** extra search terms (synonyms, Hindi names) */
  keywords: string[];
  bestseller: boolean;
  /** only present when real reviews exist */
  rating?: { value: number; count: number };
  name: string;
  subtitle?: string;
  short: string;
  description: string;
  badge?: string;
  quality?: string;
  purity?: string;
  ingredients?: string;
  allergen?: string;
  naturalCharacter?: string;
  care?: string;
  shelfLife?: string;
  brewing?: string[];
  promise?: string[];
  nutrition?: NutritionRow[];
  bg: string;
  /** Single product photo path under /public */
  image?: string;
  /** Multiple real product photos for gallery (preferred over image) */
  images?: string[];
  jar: {
    lid: string;
    body: string;
    label: string;
    ink: string;
    lines: string[];
  };
  variants: Variant[];
}

type BaseProduct = Omit<Product, 'category' | 'keywords' | 'bestseller' | 'rating'>;

const baseProducts: BaseProduct[] = [
  {
    slug: 'kashmiri-white-honey',
    name: 'Kashmiri White Honey',
    subtitle: 'Acacia Flora',
    short: 'Pure White',
    description: 'A delicate honey with a naturally light sweetness and subtle floral notes. Sourced from Acacia blossoms across Kashmir, it offers a gentle flavour and distinctive character, preserved in its raw and unfiltered form.',
    badge: 'LAB TESTED FOR PURITY',
    quality: 'Sourced from carefully selected native fields across Kashmir, this honey reflects the delicate floral character of Acacia blossoms. Its distinctive taste and aroma are shaped by its natural floral source.',
    purity: 'Raw and unfiltered, with no added sugar, syrups or preservatives.',
    ingredients: 'Raw White Acacia Honey (100%).',
    naturalCharacter: 'Naturally light in character, with a delicate floral aroma and gentle sweetness. Its sugars occur naturally from flower nectar. As raw, untreated honey, it may naturally crystallise in cooler weather and become more fluid in warmer conditions. This is a natural characteristic of honey.',
    care: 'Store in a cool, dry place away from direct sunlight. Do not refrigerate. If natural crystallisation occurs, gently place the jar in a warm water bath to soften.',
    shelfLife: '18 months from packaging.',
    nutrition: [
      { nutrient: 'Energy', value: '320 kcal' },
      { nutrient: 'Protein', value: '0.3g' },
      { nutrient: 'Total Fat', value: '0.0g' },
      { nutrient: 'Carbohydrates', value: '82.0g' },
      { nutrient: 'Total Sugars (Natural)', value: '80.0g' },
      { nutrient: 'Added Sugars', value: '0g' },
      { nutrient: 'Sodium', value: '4mg' },
      { nutrient: 'Cholesterol', value: '0mg' },
    ],
    bg: '#f8f0d8',
    jar: { lid: '#c4a35a', body: '#f5e6b8', label: '#fff8e7', ink: '#5c3d1e', lines: ['WHITE', 'HONEY'] },
    variants: [
      variant('kashmiri-white-honey', '50g'),
      variant('kashmiri-white-honey', '100g'),
      variant('kashmiri-white-honey', '200g'),
      variant('kashmiri-white-honey', '325g'),
      variant('kashmiri-white-honey', '500g'),
    ],
  },
  {
    slug: 'kashmiri-butter-honey',
    name: 'Kashmiri Butter Honey',
    subtitle: 'Sulai Blossom',
    short: 'Creamy',
    description: 'Naturally smooth honey with a delicate floral aroma, gentle sweetness and a distinctive creamy character. Sourced from Sulai blossoms across Kashmir, it offers a naturally rich expression of its floral origin.',
    badge: 'LAB TESTED FOR PURITY',
    quality: 'Sourced from carefully selected native fields across Kashmir, this honey reflects the distinctive floral character of Sulai blossoms. Its aroma, taste and naturally smooth texture are shaped by its floral source.',
    purity: 'Raw and untreated, with no added sugar, syrups or preservatives. Its natural composition is retained without unnecessary processing.',
    ingredients: 'Raw Kashmiri Sulai Honey (100%).',
    naturalCharacter: 'Naturally smooth and creamy in character, with a delicate floral aroma and gentle sweetness. Its sugars occur naturally from flower nectar. As raw honey, it may naturally crystallise in cooler weather and become more fluid in warmer conditions. This change in texture is a natural characteristic of honey.',
    care: 'Store in a cool, dry place away from direct sunlight. Do not refrigerate. Keep the lid tightly sealed after use. If crystallisation occurs, gently place the jar in a warm water bath to soften the honey.',
    shelfLife: '18 months from packaging.',
    nutrition: [
      { nutrient: 'Energy', value: '322 kcal' },
      { nutrient: 'Protein', value: '0.3g' },
      { nutrient: 'Total Fat', value: '0.0g' },
      { nutrient: 'Carbohydrates', value: '82.5g' },
      { nutrient: 'Total Sugars (Natural)', value: '80.2g' },
      { nutrient: 'Added Sugars', value: '0g' },
      { nutrient: 'Sodium', value: '4mg' },
    ],
    bg: '#f4e8c8',
    jar: { lid: '#b8956a', body: '#f0dcb0', label: '#fff8e8', ink: '#5c3d1e', lines: ['BUTTER', 'HONEY'] },
    variants: [
      variant('kashmiri-butter-honey', '50g'),
      variant('kashmiri-butter-honey', '100g'),
      variant('kashmiri-butter-honey', '200g'),
      variant('kashmiri-butter-honey', '325g'),
      variant('kashmiri-butter-honey', '500g'),
    ],
  },
  {
    slug: 'kashmiri-wild-forest-honey',
    name: 'Kashmiri Wild Forest Honey',
    subtitle: 'Forest Blossom',
    short: 'Wild',
    description: 'A richly flavoured honey with delicate floral notes and a distinctive woodland aroma. Sourced from wild forest regions across Kashmir, it captures the natural character of diverse forest blossoms in its raw and unfiltered form.',
    badge: 'LAB TESTED FOR PURITY',
    quality: 'Sourced from carefully selected native forest regions across Kashmir, this honey reflects the distinctive floral character of wild forest blossoms. Its flavour and aroma are shaped by the natural variety of its floral sources.',
    purity: 'Raw and unfiltered, with no added sugar, syrups or preservatives. Its natural composition is retained without unnecessary processing.',
    ingredients: 'Raw Wild Forest Honey (100%).',
    naturalCharacter: 'Naturally distinctive in flavour, with delicate floral notes and a characteristic woodland aroma. Its sugars occur naturally from flower nectar. As raw, untreated honey, it may naturally crystallise in cooler weather and become more fluid in warmer conditions. This change in texture is a natural characteristic of honey.',
    care: 'Store in a cool, dry place away from direct sunlight. Do not refrigerate. Keep the lid tightly sealed after use. If crystallisation occurs, gently place the jar in a warm water bath to soften.',
    shelfLife: '18 months from packaging.',
    nutrition: [
      { nutrient: 'Energy', value: '318 kcal' },
      { nutrient: 'Protein', value: '0.4g' },
      { nutrient: 'Total Fat', value: '0.0g' },
      { nutrient: 'Carbohydrates', value: '81.5g' },
      { nutrient: 'Total Sugars (Natural)', value: '79.5g' },
      { nutrient: 'Added Sugars', value: '0g' },
      { nutrient: 'Sodium', value: '5mg' },
      { nutrient: 'Cholesterol', value: '0mg' },
    ],
    bg: '#e8f0d0',
    jar: { lid: '#6b5a3a', body: '#d4c890', label: '#f5f0e0', ink: '#3a2e1a', lines: ['WILD', 'FOREST'] },
    variants: [
      variant('kashmiri-wild-forest-honey', '50g'),
      variant('kashmiri-wild-forest-honey', '100g'),
      variant('kashmiri-wild-forest-honey', '200g'),
      variant('kashmiri-wild-forest-honey', '325g'),
      variant('kashmiri-wild-forest-honey', '500g'),
    ],
  },
  {
    slug: 'raw-mongra-saffron',
    name: 'Raw Mongra Saffron',
    subtitle: 'A Rare Thread from Kashmir',
    short: 'Mongra',
    description: "Carefully hand-harvested from the delicate purple blossoms of Kashmir's saffron flowers, Mongra saffron is valued for its deep crimson threads, distinctive aroma and rich natural colour. Selected to preserve the characteristic qualities of Kashmiri saffron, each thread brings depth and fragrance to your culinary creations.",
    badge: 'LAB TESTED FOR PURITY',
    quality: 'Selected from the finest red stigmas of Kashmiri saffron flowers, Mongra saffron is recognised for its deep crimson appearance, distinctive aroma and natural colouring properties. Each selection reflects the characteristic qualities of this prized saffron variety.',
    purity: '100% Pure Kashmiri Mongra Saffron. Selected without artificial colours or blending, with its natural colour, aroma and character preserved.',
    ingredients: '100% Pure Kashmiri Saffron.',
    naturalCharacter: 'The deep crimson threads gradually release a rich golden colour when steeped in warm water or milk, while the threads retain their natural red appearance. Its distinctive aroma and flavour add colour and fragrance to a variety of preparations.',
    care: 'Store in a cool, dry and dark place, away from direct sunlight and moisture. Keep tightly sealed after every use to preserve its natural aroma and quality.',
    shelfLife: '36 months from packaging.',
    bg: '#f4d4b8',
    jar: { lid: '#8b3a2a', body: '#e8a87c', label: '#fff0e0', ink: '#5c1e10', lines: ['MONGRA', 'SAFFRON'] },
    variants: [
      variant('raw-mongra-saffron', '1g'),
      variant('raw-mongra-saffron', '2g'),
      variant('raw-mongra-saffron', '5g'),
    ],
  },
  {
    slug: 'irani-saffron',
    name: 'Irani Saffron',
    subtitle: 'A Golden Legacy of Persia',
    short: 'Irani',
    description: 'Sourced from the renowned saffron-growing regions of Iran, this saffron features fine crimson threads, a delicate floral aroma and distinctive flavour. When steeped, it releases a beautiful golden hue, bringing colour, fragrance and depth to culinary preparations.',
    badge: 'LAB TESTED FOR PURITY',
    quality: 'Carefully selected from saffron-growing regions of Iran, these fine threads are valued for their natural colour, delicate aroma and distinctive flavour profile.',
    purity: '100% Pure Irani Saffron. Selected without artificial colours or blending.',
    ingredients: '100% Pure Irani Saffron.',
    naturalCharacter: 'Fine crimson threads that release a beautiful golden colour and delicate floral aroma when steeped, adding colour, fragrance and depth to a variety of culinary preparations.',
    care: 'Store in a cool, dry and dark place, away from direct sunlight and moisture. Keep tightly sealed after every use.',
    shelfLife: '36 months from packaging.',
    bg: '#f0c8a0',
    jar: { lid: '#9a4030', body: '#e8b080', label: '#fff4e8', ink: '#5c1e10', lines: ['IRANI', 'SAFFRON'] },
    variants: [
      variant('irani-saffron', '1g'),
      variant('irani-saffron', '2g'),
      variant('irani-saffron', '5g'),
    ],
  },
  {
    slug: 'kashmiri-mamra-almonds',
    name: 'Kashmiri Mamra Almonds',
    subtitle: 'Naturally Rich',
    short: 'Mamra',
    description: 'Kashmiri Mamra Almonds are valued for their distinctive shape, rich nutty flavour and natural oils. Carefully selected and kept in their natural form, they retain their character and quality.',
    quality: 'Selected from traditional orchards across Kashmir, these almonds are chosen for their appearance, flavour and natural oils with minimal processing.',
    promise: ['100% Raw', 'No Added Sugar', 'No Artificial Colours', 'No Preservatives', 'No Added Additives', 'Carefully Selected Harvest'],
    ingredients: 'Kashmiri Mamra Almonds (Prunus dulcis).',
    allergen: 'Contains tree nuts (almonds). Packed in a facility that also handles tree nuts and seeds.',
    naturalCharacter: 'Naturally rich in plant-based protein, Vitamin E, dietary fibre and unsaturated fats. Their distinctive nutty flavour, natural oils and crisp texture make them a versatile addition to everyday meals and snacks.',
    care: 'Reseal the pack tightly after every use. Store in a cool, dry place away from direct sunlight. Refrigeration is recommended to help maintain freshness and quality.',
    shelfLife: '6 months from packaging.',
    nutrition: [
      { nutrient: 'Energy', value: '579 kcal' },
      { nutrient: 'Protein', value: '21.1g' },
      { nutrient: 'Total Carbohydrates', value: '21.6g' },
      { nutrient: 'Dietary Fibre', value: '12.5g' },
      { nutrient: 'Total Sugars', value: '4.4g' },
      { nutrient: 'Added Sugars', value: '0g' },
      { nutrient: 'Total Fat', value: '49.9g' },
      { nutrient: 'Saturated Fat', value: '3.8g' },
      { nutrient: 'Monounsaturated Fat', value: '31.5g' },
      { nutrient: 'Polyunsaturated Fat', value: '12.2g' },
      { nutrient: 'Sodium', value: '1mg' },
      { nutrient: 'Vitamin E', value: '25.6mg' },
      { nutrient: 'Calcium', value: '268mg' },
      { nutrient: 'Magnesium', value: '270mg' },
      { nutrient: 'Phosphorus', value: '481mg' },
    ],
    bg: '#e8f0c8',
    jar: { lid: '#6b5a3a', body: '#d4c4a0', label: '#f5f0e0', ink: '#3a2e1a', lines: ['MAMRA', 'ALMONDS'] },
    variants: [
      variant('kashmiri-mamra-almonds', '50g'),
      variant('kashmiri-mamra-almonds', '100g'),
      variant('kashmiri-mamra-almonds', '250g'),
      variant('kashmiri-mamra-almonds', '500g'),
    ],
  },
  {
    slug: 'kashmiri-walnut-kernels',
    name: 'Kashmiri Raw Walnut Kernels',
    subtitle: 'Goodness, from the Start.',
    short: 'Kernels',
    description: 'Naturally rich in flavour and texture, Kashmiri Walnut Kernels are valued for their delicate earthy taste, satisfying crunch and naturally occurring oils. Carefully selected in their raw, unpolished form, they retain their natural appearance and character.',
    quality: 'Selected from traditional open-tree orchards across Kashmir, these walnut kernels are carefully chosen for their appearance, flavour and texture. Kept raw and unpolished, they retain their natural form, flavour and oils with minimal processing.',
    promise: ['100% Raw & Unpolished', 'No Added Sugar', 'No Artificial Colours', 'No Preservatives', 'No Added Additives', 'Carefully Selected Harvest'],
    ingredients: 'Raw Kashmiri Walnut Kernels (100%).',
    allergen: 'Contains tree nuts (walnuts). Packed in a facility that also handles tree nuts and seeds.',
    naturalCharacter: 'Naturally rich in plant-based Omega-3 (ALA), protein, healthy fats and dietary fibre. Their delicate earthy flavour and satisfying crunch make them a versatile addition to everyday meals, snacks and recipes.',
    care: 'Reseal the pack tightly after every use. Store in a cool, dry place away from direct sunlight. Refrigeration is recommended to help maintain freshness and quality.',
    shelfLife: '6 months from packaging.',
    nutrition: [
      { nutrient: 'Energy', value: '654 kcal' },
      { nutrient: 'Protein', value: '15.2g' },
      { nutrient: 'Total Fat', value: '65.2g' },
      { nutrient: 'Saturated Fat', value: '6.1g' },
      { nutrient: 'Carbohydrates', value: '13.7g' },
      { nutrient: 'Dietary Fibre', value: '6.7g' },
      { nutrient: 'Total Sugars', value: '2.6g' },
      { nutrient: 'Added Sugars', value: '0g' },
      { nutrient: 'Sodium', value: '2mg' },
    ],
    bg: '#d8e8f0',
    jar: { lid: '#5a4a3a', body: '#c4b090', label: '#f0e8d8', ink: '#3a2e1a', lines: ['WALNUT', 'KERNELS'] },
    variants: [
      variant('kashmiri-walnut-kernels', '50g'),
      variant('kashmiri-walnut-kernels', '100g'),
      variant('kashmiri-walnut-kernels', '250g'),
      variant('kashmiri-walnut-kernels', '500g'),
    ],
  },
  {
    slug: 'kashmiri-saffron-kahwa',
    name: 'Kashmiri Saffron Kahwa',
    subtitle: 'Brewed in Winter Chill.',
    short: 'Blend',
    description: 'A traditional Kashmiri-inspired blend of delicate green tea, aromatic spices and Mongra saffron. Crafted to bring together warming notes of ginger, cardamom, cinnamon and cloves, with a separate almond garnish for a finishing touch.',
    quality: 'A carefully prepared blend combining green tea, aromatic spices and Mongra saffron. Each ingredient contributes its distinctive flavour and fragrance, creating a comforting cup inspired by Kashmiri tea traditions.',
    promise: ['Made with Mongra Saffron', 'Aromatic Spice Blend', 'Separate Almond Garnish', 'Thoughtfully Selected Ingredients', 'Convenient Brewing Preparation'],
    ingredients: 'Kahwa Powder Blend: Sugar, Green Tea Extract, Ginger, Cardamom, Cinnamon, Cloves and Raw Mongra Saffron. Separate Almond Garnish: Crushed almond slices in a separate sachet.',
    allergen: 'Contains tree nuts (almonds). Packed in a facility that also handles tree nuts.',
    naturalCharacter: 'A fragrant blend with warming spice notes, delicate tea character and the distinctive aroma of saffron. The separate almond garnish adds a gentle crunch and texture to the prepared cup.',
    brewing: ['Bring 120ml of water to a boil.', 'Add 1 teaspoon of Kahwa powder.', 'Simmer on low heat for 3–4 minutes.', 'Strain into a cup.', 'Add the separate crushed almond garnish to taste.'],
    care: 'Reseal the pack tightly after every use. Store in a cool, dry place away from direct sunlight and moisture. Keep the almond garnish sachet sealed until use.',
    shelfLife: '6 months from packaging.',
    nutrition: [
      { nutrient: 'Energy', value: '385 kcal' },
      { nutrient: 'Protein', value: '0.2g' },
      { nutrient: 'Total Fat', value: '0.1g' },
      { nutrient: 'Carbohydrates', value: '96g' },
      { nutrient: 'Added Sugars', value: '90g' },
      { nutrient: 'Cholesterol', value: '0mg' },
    ],
    bg: '#d0e8d8',
    jar: { lid: '#3a5a4a', body: '#a0c4b0', label: '#e8f5ee', ink: '#1a3a2a', lines: ['SAFFRON', 'KAHWA'] },
    variants: [
      variant('kashmiri-saffron-kahwa', '100g'),
      variant('kashmiri-saffron-kahwa', '200g'),
    ],
  },
];

export const products: Product[] = baseProducts.map((p) => {
  const c = catalogProducts[p.slug];
  if (!c) throw new Error(`catalog.json is missing product ${p.slug}`);
  return { ...p, category: c.category, keywords: c.keywords, bestseller: !!c.bestseller, rating: c.rating };
});

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

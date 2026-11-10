/** Sample Kit contents as listed in the BELYN Explore brief. The price (₹999, shipping included) lives in shared/catalog.json. */
export const sampleKitItems = [
  { name: 'Kashmiri White Honey', size: '50g' },
  { name: 'Kashmiri Butter Honey', size: '50g' },
  { name: 'Kashmiri Wild Forest Honey', size: '50g' },
  { name: 'Kashmiri Mamra Almonds', size: '40g' },
  { name: 'Kashmiri Walnut Kernels', size: '40g' },
  { name: 'Raw Mongra Saffron', size: '0.25g' },
  { name: 'Irani Saffron', size: '0.25g' },
  { name: 'Kashmiri Saffron Kahwa', size: '50g' },
] as const;

export const sampleKitWeight = '280.5g';
export const sampleKitPackaging = '3 Honey Containers • 2 Dry-Fruit Containers • 2 Saffron Containers • 1 Kahwa Container';

/** Products shown on the Featured page, in order. */
export const featuredSlugs = [
  'kashmiri-white-honey',
  'kashmiri-butter-honey',
  'kashmiri-wild-forest-honey',
  'raw-mongra-saffron',
  'kashmiri-mamra-almonds',
  'kashmiri-walnut-kernels',
] as const;

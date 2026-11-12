/** Festive gift hampers (contents from the BELYN gifting brief). Prices are not confirmed yet, so hampers are ordered by enquiry. */
export const hampers = [
  {
    id: 'a-little-something-to-share',
    n: '01',
    title: 'A Little Something to Share',
    contents: [
      ['Kashmiri White Honey', '100g'],
      ['Kashmiri Mamra Almonds', '200g'],
      ['Kashmiri Walnut Kernels', '200g'],
      ['Raw Mongra Saffron', '1g'],
      ['Kashmiri Saffron Kahwa', '100g'],
    ],
  },
  {
    id: 'a-little-more-to-enjoy',
    n: '02',
    title: 'A Little More to Enjoy',
    contents: [
      ['Kashmiri White Honey', '200g'],
      ['Kashmiri Butter Honey', '100g'],
      ['Kashmiri Mamra Almonds', '300g'],
      ['Kashmiri Walnut Kernels', '300g'],
      ['Raw Mongra Saffron', '1g'],
      ['Kashmiri Saffron Kahwa', '100g'],
    ],
  },
  {
    id: 'a-box-full-of-goodness',
    n: '03',
    title: 'A Box Full of Goodness',
    contents: [
      ['Kashmiri White Honey', '500g'],
      ['Kashmiri Butter Honey', '500g'],
      ['Kashmiri Mamra Almonds', '500g'],
      ['Kashmiri Walnut Kernels', '500g'],
      ['Raw Mongra Saffron', '2g'],
      ['Kashmiri Saffron Kahwa', '200g'],
    ],
  },
] as const;

export const occasions = ['Festive Celebrations', 'Birthdays & Special Occasions', 'Family & Friends', 'Thank You Gifts'] as const;

/** Order of the eight products on the Corporate Gifting page. */
export const corporateSlugs = [
  'kashmiri-white-honey',
  'kashmiri-butter-honey',
  'kashmiri-wild-forest-honey',
  'raw-mongra-saffron',
  'irani-saffron',
  'kashmiri-mamra-almonds',
  'kashmiri-walnut-kernels',
  'kashmiri-saffron-kahwa',
] as const;

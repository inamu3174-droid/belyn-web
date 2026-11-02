declare const __ENV__: Record<string, string>;

const env = typeof __ENV__ !== 'undefined' ? __ENV__ : {};

export const site = {
  short: 'Born in Kashmir. Crafted with Purity.',
  email: env.VITE_CONTACT_EMAIL || '',
  phone: env.VITE_CONTACT_PHONE || '',
  instagram: env.VITE_INSTAGRAM_URL || '',
};

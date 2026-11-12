declare const __ENV__: Record<string, string>;

const env = typeof __ENV__ !== 'undefined' ? __ENV__ : {};

export const site = {
  name: 'BELYN',
  wordmark: 'B E L Y N',
  tagline: 'Born in Kashmir. Crafted with Purity.',
  short: 'Born in Kashmir. Crafted with Purity.',
  url: env.VITE_SITE_URL || 'https://www.belyn.in',
  email: env.VITE_CONTACT_EMAIL || 'hello@belyn.in',
  phone: env.VITE_CONTACT_PHONE || '+91 9596481999',
  whatsapp: env.VITE_WHATSAPP_NUMBER || '919596481999',
  instagram: env.VITE_INSTAGRAM_URL || 'https://www.instagram.com/belyn.in',
  facebook: env.VITE_FACEBOOK_URL || 'https://www.facebook.com/people/%F0%9D%90%81%F0%9D%90%84%F0%9D%90%8B%F0%9D%90%98%F0%9D%90%8D/61594601715238/',
  currency: 'INR',
  orderEndpoint: '/api/order',
  contactEndpoint: '/api/contact',
};
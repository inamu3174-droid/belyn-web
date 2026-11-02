// Central site configuration. Replace the TODO values with the real details from belyn.in.
// Anything left `undefined` is simply not rendered (we never invent contact details).
export const site = {
  name: 'BELYN',
  wordmark: 'B E L Y N',
  tagline: 'Born in Kashmir. Crafted with Purity.',
  short: 'Purely from Kashmir.',
  url: (__ENV__.VITE_SITE_URL as string) || 'https://www.belyn.in',
  // TODO(real data): fill from belyn.in
  email: __ENV__.VITE_CONTACT_EMAIL as string | undefined,
  phone: __ENV__.VITE_CONTACT_PHONE as string | undefined,
  instagram: __ENV__.VITE_INSTAGRAM_URL as string | undefined,
  address: undefined as string | undefined,
  currency: 'INR',
  // Public endpoints (Vercel functions in /api). Optional.
  orderEndpoint: (__ENV__.VITE_ORDER_ENDPOINT as string) || '/api/order',
  contactEndpoint: (__ENV__.VITE_CONTACT_ENDPOINT as string) || '/api/contact',
  // When the order endpoint is not configured, simulate a confirmation so the flow can be reviewed.
  demoMode: (__ENV__.VITE_DEMO_MODE as string) !== 'false',
};

declare global {
  // injected by build.mjs from VITE_* environment variables
  const __ENV__: Record<string, string | undefined>;
}

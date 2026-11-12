import { JK_FREE_THRESHOLD, JK_SHIPPING, INDIA_SHIPPING } from '../lib/shipping';

/** FAQ for the Contact page (copy from the BELYN handoff PDF). `links` render below the answer. */
export type ContactFaq = { q: string; a: string; links?: { label: string; to: string }[] };

export const contactFaqs: ContactFaq[] = [
  { q: 'How long does delivery take?', a: 'Orders are generally delivered within 3–7 business days after dispatch. Delivery timelines may vary depending on the destination and courier service.' },
  {
    q: 'How much does shipping cost?',
    a: `For deliveries within Jammu & Kashmir, orders below ₹${JK_FREE_THRESHOLD} have a flat shipping charge of ₹${JK_SHIPPING}, while orders of ₹${JK_FREE_THRESHOLD} and above qualify for free shipping. For deliveries outside Jammu & Kashmir, a flat shipping charge of ₹${INDIA_SHIPPING} applies to all orders.`,
  },
  { q: 'How can I track my order?', a: 'Once your order has been dispatched, tracking details will be shared with you so you can follow your delivery.' },
  { q: 'What payment methods do you accept?', a: 'We accept secure online payments through our checkout, including UPI, cards and other payment methods supported by Razorpay.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be changed or cancelled only before they are dispatched. Once an order has been dispatched, it cannot be cancelled or modified.' },
  { q: 'What should I do if my order arrives damaged?', a: 'If your order arrives damaged, please contact BELYN as soon as possible with your order details and clear photographs of the package and product. Our team will review the issue and guide you through the next steps.' },
  {
    q: 'What is your return and refund policy?',
    a: 'Our return and refund policy depends on the product and the reason for the request. Please review our Shipping & Returns Policy for the applicable terms.',
    links: [{ label: 'View Shipping & Returns Policy', to: '/policies/shipping' }],
  },
  {
    q: 'Do you offer gifting options?',
    a: 'Yes. BELYN offers festive gift hampers and selected gifting options designed for special occasions and thoughtful celebrations.',
    links: [{ label: 'Explore Festive Gifting', to: '/festive-gifting' }],
  },
  {
    q: 'How can I place a wholesale or corporate gifting enquiry?',
    a: 'For wholesale enquiries, visit our Wholesale page. For corporate gifting, visit our Corporate Gifting page to discuss your requirements with BELYN.',
    links: [
      { label: 'Wholesale', to: '/wholesale' },
      { label: 'Corporate Gifting', to: '/corporate-gifting' },
    ],
  },
  { q: 'Where can I find product ingredients and nutrition information?', a: 'Product ingredients, nutritional information and relevant product details are provided on the individual product pages and packaging.' },
];

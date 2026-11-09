// Creates a Razorpay order. Needs RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET on Vercel.
// The amount is computed here from the catalog (items + PIN); the browser cannot set it.
import { priceOrder } from '../shared/pricing.js';
import { cleanRef } from './_order.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const KEY_ID = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
  if (!KEY_ID || !KEY_SECRET) {
    return res.status(501).json({
      message: 'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Vercel.',
    });
  }

  const b = req.body || {};
  const ref = cleanRef(b.ref);
  if (!ref) return res.status(400).json({ message: 'Invalid order reference.' });

  const pin = String(b.pin || '');
  const state = String(b.state || '');
  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json({ message: 'A valid 6-digit PIN code is required before payment.' });
  }

  const priced = priceOrder(b.items, pin, state);
  if (!priced.ok) return res.status(400).json({ message: priced.message });

  if (b.subtotal !== undefined && Number(b.subtotal) !== priced.subtotal) {
    return res.status(409).json({ message: 'Prices have been updated. Please refresh the page and review your cart.' });
  }

  const amount = Math.round(priced.total * 100);
  if (amount < 100) return res.status(400).json({ message: 'Minimum amount is ₹1.' });

  try {
    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: ref,
        notes: {
          source: 'belyn-web',
          ref,
          subtotal: String(priced.subtotal),
          shipping: String(priced.ship.amount),
          zone: priced.ship.zone,
        },
      }),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(502).json({ message: data.error?.description || 'Could not create payment order.' });
    }
    return res.status(200).json({
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: KEY_ID,
      subtotal: priced.subtotal,
      shipping: priced.ship.amount,
      total: priced.total,
    });
  } catch {
    return res.status(502).json({ message: 'Payment service unavailable. Please try again.' });
  }
}

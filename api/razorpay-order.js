// Creates a Razorpay order. Needs RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET on Vercel.
import { calculateShipping, orderTotal } from './_shipping.js';

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
  const subtotal = Number(b.subtotal ?? b.amount);
  if (!Number.isFinite(subtotal) || subtotal < 1) {
    return res.status(400).json({ message: 'Invalid amount.' });
  }

  const pin = String(b.pin || '');
  const state = String(b.state || '');
  if (!/^\d{6}$/.test(pin)) {
    return res.status(400).json({ message: 'A valid 6-digit PIN code is required before payment.' });
  }

  // Server is the source of truth for shipping — ignore client shipping amount
  const ship = calculateShipping(subtotal, pin, state);
  const totalRupees = orderTotal(subtotal, ship.amount);
  const amount = Math.round(totalRupees * 100);
  if (amount < 100) return res.status(400).json({ message: 'Minimum amount is ₹1.' });

  const receipt = String(b.receipt || 'BLY-' + Date.now()).slice(0, 40);

  try {
    const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt,
        notes: {
          source: 'belyn-web',
          subtotal: String(subtotal),
          shipping: String(ship.amount),
          zone: ship.zone,
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
      shipping: ship.amount,
      total: totalRupees,
    });
  } catch {
    return res.status(502).json({ message: 'Payment service unavailable. Please try again.' });
  }
}

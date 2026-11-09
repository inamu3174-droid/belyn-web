// Run with: npm test   (Node 20+, no dependencies)
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

import { shippingCharge, orderTotal } from '../shared/shipping.js';
import { priceOrder } from '../shared/pricing.js';
import catalog from '../shared/catalog.json' with { type: 'json' };

const res = () => {
  const r = { code: 200, body: null };
  r.status = (c) => ((r.code = c), r);
  r.json = (b) => ((r.body = b), r);
  return r;
};

const slug = Object.keys(catalog.products)[0];
const vid = Object.keys(catalog.products[slug].variants)[0];
const unit = catalog.products[slug].variants[vid].price;

const base = (over = {}) => ({
  ref: 'BLY-TEST1234',
  paymentMethod: 'cod',
  customer: { name: 'Test User', email: 'test@example.com', phone: '9876543210' },
  shipping: { address: '12 Lal Chowk Road', city: 'Srinagar', state: 'Jammu & Kashmir', pin: '190001' },
  items: [{ slug, variantId: vid, qty: 1 }],
  ...over,
});

test('shipping: J&K free at 600, 100 below, pan-India flat 100', () => {
  assert.deepEqual(shippingCharge(599, '190001', ''), { amount: 100, free: false, zone: 'jk' });
  assert.deepEqual(shippingCharge(600, '190001', ''), { amount: 0, free: true, zone: 'jk' });
  assert.deepEqual(shippingCharge(5000, '110001', 'Delhi'), { amount: 100, free: false, zone: 'pan' });
  assert.equal(shippingCharge(5000, '110001', 'Kashmir').zone, 'pan', 'a full PIN outranks the state text');
  assert.equal(shippingCharge(100, '', 'Ladakh').zone, 'jk');
  assert.equal(orderTotal(500, 100), 600, 'shipping is added exactly once');
});

test('pricing: server uses catalog prices, ignores client prices', () => {
  const p = priceOrder([{ slug, variantId: vid, qty: 2, unitPrice: 1, name: 'cheap' }], '110001', 'Delhi');
  assert.equal(p.ok, true);
  assert.equal(p.subtotal, unit * 2);
  assert.equal(p.lines[0].unitPrice, unit);
  assert.equal(p.total, unit * 2 + 100);
});

test('pricing: merges duplicate lines, accepts label fallback, rejects bad input', () => {
  const label = catalog.products[slug].variants[vid].label;
  const m = priceOrder([{ slug, variantId: vid, qty: 1 }, { slug, variant: label, qty: 2 }], '110001', '');
  assert.equal(m.lines.length, 1);
  assert.equal(m.lines[0].qty, 3);
  assert.equal(priceOrder([{ slug: 'nope', variantId: 'x', qty: 1 }], '110001', '').ok, false);
  assert.equal(priceOrder([{ slug, variantId: vid, qty: 0 }], '110001', '').ok, false);
  assert.equal(priceOrder([{ slug, variantId: vid, qty: 1.5 }], '110001', '').ok, false);
  assert.equal(priceOrder([{ slug, variantId: vid, qty: 21 }], '110001', '').ok, false);
  assert.equal(priceOrder([], '110001', '').ok, false);
});

test('order endpoint: validation, razorpay bypass blocked, stale price detected', async () => {
  const { default: order } = await import('../api/order.js');

  let r = res();
  await order({ method: 'GET' }, r);
  assert.equal(r.code, 405);

  r = res();
  await order({ method: 'POST', body: base({ paymentMethod: 'razorpay' }) }, r);
  assert.equal(r.code, 400, 'unpaid orders must not be accepted as RAZORPAY');

  r = res();
  await order({ method: 'POST', body: base({ ref: 'bad ref' }) }, r);
  assert.equal(r.code, 400);

  r = res();
  await order({ method: 'POST', body: base({ customer: { name: 'A', email: 'x', phone: '1' } }) }, r);
  assert.equal(r.code, 400);

  r = res();
  await order({ method: 'POST', body: base({ subtotal: 1 }) }, r);
  assert.equal(r.code, 409, 'client subtotal that disagrees with the catalog is rejected');
});

test('order endpoint: emails the SERVER-computed total, with an idempotency key', async () => {
  process.env.RESEND_API_KEY = 're_test';
  process.env.MAIL_FROM = 'Belyn <hello@belyn.in>';
  delete process.env.DELHIVERY_API_TOKEN;
  const calls = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return { ok: true, status: 200, json: async () => ({}) };
  };
  try {
    const { default: order } = await import('../api/order.js');
    const r = res();
    await order({ method: 'POST', body: base({ items: [{ slug, variantId: vid, qty: 1, unitPrice: 1 }], total: 1, subtotal: unit }) }, r);
    assert.equal(r.code, 200);
    assert.equal(r.body.total, unit + shippingCharge(unit, '190001', 'Jammu & Kashmir').amount); // goods + shipping, once
    const sent = calls.find((c) => String(c.url).includes('resend.com'));
    assert.ok(sent, 'email sent');
    assert.equal(sent.init.headers['Idempotency-Key'], 'order-BLY-TEST1234');
    assert.ok(!/INR 1\b/.test(JSON.parse(sent.init.body).text), 'client-sent price never reaches the email');
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('razorpay-verify: signature, amount match, and replay protection', async () => {
  process.env.RAZORPAY_KEY_ID = 'rzp_test_x';
  process.env.RAZORPAY_KEY_SECRET = 'secret';
  process.env.RESEND_API_KEY = 're_test';
  process.env.MAIL_FROM = 'Belyn <hello@belyn.in>';
  const { default: verify } = await import('../api/razorpay-verify.js');

  const order = base({ paymentMethod: 'razorpay' });
  const priced = priceOrder(order.items, order.shipping.pin, order.shipping.state);
  const orderId = 'order_ABC';
  const paymentId = 'pay_123';
  const sig = (secret) => crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  const body = (signature = sig('secret'), o = order) => ({
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
    order: o,
  });

  let rzpOrder = { status: 'paid', receipt: order.ref, amount: Math.round(priced.total * 100), notes: {} };
  const patches = [];
  const sent = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url);
    if (u.includes('api.razorpay.com') && (!init.method || init.method === 'GET')) {
      return { ok: true, status: 200, json: async () => rzpOrder };
    }
    if (u.includes('api.razorpay.com') && init.method === 'PATCH') {
      patches.push(JSON.parse(init.body));
      rzpOrder = { ...rzpOrder, notes: JSON.parse(init.body).notes };
      return { ok: true, status: 200, json: async () => rzpOrder };
    }
    if (u.includes('resend.com')) {
      sent.push(init);
      return { ok: true, status: 200, json: async () => ({}) };
    }
    throw new Error('unexpected fetch ' + u);
  };

  try {
    let r = res();
    await verify({ method: 'POST', body: body('0'.repeat(64)) }, r);
    assert.equal(r.code, 400, 'bad signature rejected');

    // paid a small order but submits a bigger cart
    r = res();
    await verify({ method: 'POST', body: body(sig('secret'), base({ items: [{ slug, variantId: vid, qty: 5 }] })) }, r);
    assert.equal(r.code, 409, 'amount mismatch rejected');
    assert.equal(sent.length, 0);

    // not paid yet
    rzpOrder = { ...rzpOrder, status: 'created' };
    r = res();
    await verify({ method: 'POST', body: body() }, r);
    assert.equal(r.code, 402);
    rzpOrder = { ...rzpOrder, status: 'paid' };

    // success
    r = res();
    await verify({ method: 'POST', body: body() }, r);
    assert.equal(r.code, 200);
    assert.equal(r.body.total, priced.total);
    assert.equal(sent.length, 1);
    assert.equal(patches.length, 1);

    // replay of the same verify: no second email
    r = res();
    await verify({ method: 'POST', body: body() }, r);
    assert.equal(r.code, 200);
    assert.equal(r.body.duplicate, true);
    assert.equal(sent.length, 1, 'replay must not send another email');
  } finally {
    globalThis.fetch = realFetch;
  }
});

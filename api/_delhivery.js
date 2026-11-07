// Delhivery Express — create shipment (CMU)
// Docs: POST /api/cmu/create.json
// Env (Vercel):
//   DELHIVERY_API_TOKEN   — required
//   DELHIVERY_PICKUP_NAME — warehouse / pickup location name registered in Delhivery
//   DELHIVERY_BASE_URL    — optional, default https://track.delhivery.com
//                           staging: https://staging-express.delhivery.com

function clean(s, max = 200) {
  return String(s || '')
    .replace(/[&#%;\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function delhiveryConfigured() {
  return !!(process.env.DELHIVERY_API_TOKEN && process.env.DELHIVERY_PICKUP_NAME);
}

/**
 * Create a Delhivery shipment for a Belyn order.
 * Returns { ok, waybill?, trackingUrl?, error? } — never throws.
 */
export async function createDelhiveryShipment(order) {
  const token = (process.env.DELHIVERY_API_TOKEN || '').trim();
  const pickupName = (process.env.DELHIVERY_PICKUP_NAME || '').trim();
  const base = (process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com').replace(/\/$/, '');

  if (!token || !pickupName) {
    return { ok: false, skipped: true, error: 'Delhivery not configured' };
  }

  const customer = order.customer || {};
  const shipping = order.shipping || {};
  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = Math.max(0, Number(order.subtotal) || 0);
  const total = Math.max(0, Number(order.total) || subtotal);
  const paymentMethod = String(order.paymentMethod || 'cod').toLowerCase();

  const isCod = paymentMethod === 'cod';
  const productsDesc = clean(
    items.map((i) => `${i.name} ${i.variant} x${i.qty}`).join(', ') || 'Belyn order',
    200,
  );
  const qty = items.reduce((n, i) => n + (Number(i.qty) || 0), 0) || 1;

  // Approximate weight in grams (honey jars etc.) — adjust later if needed
  const weightGrams = Math.max(200, qty * 250);

  const shipment = {
    name: clean(customer.name, 100),
    add: clean(shipping.address, 200),
    pin: clean(shipping.pin, 6),
    city: clean(shipping.city, 50),
    state: clean(shipping.state, 50),
    country: 'India',
    phone: clean(String(customer.phone || '').replace(/\D/g, '').slice(-10), 10),
    order: clean(order.ref, 40),
    payment_mode: isCod ? 'COD' : 'Prepaid',
    products_desc: productsDesc,
    cod_amount: isCod ? String(total) : '0',
    total_amount: String(total),
    quantity: String(qty),
    weight: String(weightGrams),
    shipment_width: '12',
    shipment_height: '12',
    shipment_length: '12',
    shipping_mode: 'Surface',
    address_type: 'home',
  };

  const payload = {
    shipments: [shipment],
    pickup_location: { name: pickupName },
  };

  // Delhivery expects: format=json&data=<json>
  const body = `format=json&data=${encodeURIComponent(JSON.stringify(payload))}`;

  try {
    const r = await fetch(`${base}/api/cmu/create.json`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    });

    const data = await r.json().catch(() => ({}));

    // Response shapes vary; try common fields
    const packages = data?.packages || data?.shipment_data || data?.data?.packages || [];
    const first = Array.isArray(packages) ? packages[0] : null;
    const waybill =
      first?.waybill ||
      first?.wbn ||
      data?.waybill ||
      data?.wbn ||
      (Array.isArray(data?.packages) && data.packages[0]?.waybill) ||
      '';

    const success =
      r.ok &&
      (data?.success !== false) &&
      (waybill || data?.rmk === 'success' || /success/i.test(String(data?.rmk || data?.message || '')));

    if (!success && !waybill) {
      const errMsg =
        data?.rmk ||
        data?.message ||
        data?.error ||
        (first && first.remarks) ||
        `Delhivery HTTP ${r.status}`;
      return { ok: false, error: String(errMsg).slice(0, 300), raw: data };
    }

    const wbn = String(waybill || '').trim();
    return {
      ok: true,
      waybill: wbn,
      trackingUrl: wbn ? `https://www.delhivery.com/track/package/${wbn}` : '',
      raw: data,
    };
  } catch (err) {
    return { ok: false, error: err?.message || 'Delhivery network error' };
  }
}

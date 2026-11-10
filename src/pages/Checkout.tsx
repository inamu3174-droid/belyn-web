import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useCart } from '../lib/cart';
import { Link } from '../lib/router';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, getPurchasable } from '../data/products';
import { ProductVisual } from '../components/Art';
import { submitOrder, createRazorpayOrder, verifyRazorpayPayment, loadRazorpay } from '../lib/api';
import { calculateShipping, orderTotal } from '../lib/shipping';
import { useSeo } from '../lib/seo';

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v: string) =>
  /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')) ||
  /^\+?\d{8,15}$/.test(v.replace(/[\s-]/g, ''));

interface Done {
  ref: string;
  demo: boolean;
  total: number;
  email: string;
  payment: string;
  shippingLabel: string;
}

function CheckoutField({
  label,
  name,
  type = 'text',
  textarea,
  error,
  autoComplete,
  inputMode,
  maxLength,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  error?: string;
  autoComplete?: string;
  inputMode?: 'numeric' | 'tel' | 'text';
  maxLength?: number;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const id = 'co-' + name;
  const controlled = value !== undefined;
  const common = {
    id,
    name,
    placeholder,
    'aria-invalid': !!error || undefined,
    'aria-describedby': error ? id + '-err' : undefined,
    autoComplete,
    ...(controlled
      ? { value, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value) }
      : {}),
  } as const;
  return (
    <div className={`co-field${error ? ' co-field--err' : ''}`}>
      <label className="co-label" htmlFor={id}>
        {label}
      </label>
      {textarea ? (
        <textarea className="co-input co-textarea" rows={4} {...common} />
      ) : (
        <input className="co-input" type={type} inputMode={inputMode} maxLength={maxLength} {...common} />
      )}
      {error && (
        <p id={id + '-err'} className="co-err" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Checkout() {
  useSeo({ title: 'Checkout', description: 'Complete your Belyn order.', path: '/checkout', noindex: true });
  const { lines, subtotal, shipBase, clear } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState('');
  const [done, setDone] = useState<Done | null>(null);
  const [pay, setPay] = useState<'razorpay' | 'cod' | 'upi'>('razorpay');
  const [stateVal, setStateVal] = useState('');
  const [pinVal, setPinVal] = useState('');
  // Synchronous double-submit guard (state updates are async, a fast double tap could slip through)
  const submitting = useRef(false);
  // One order reference per distinct cart+payment attempt, reused on retries (so a retry is the same order)
  const attempt = useRef<{ key: string; ref: string } | null>(null);

  const ship = useMemo(() => calculateShipping(subtotal, pinVal, stateVal, shipBase), [subtotal, pinVal, stateVal, shipBase]);
  const total = orderTotal(subtotal, ship.zone === 'pending' ? 0 : ship.amount);
  const payable = ship.zone === 'pending' ? subtotal : total;
  const shippingDisplay =
    ship.zone === 'pending' ? ship.label : ship.included ? 'Included' : ship.free ? 'FREE' : formatPrice(ship.amount);

  useEffect(() => {
    const id = 'belyn-checkout-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);

  if (done) {
    return (
      <main className="page page--narrow co-page">
        <div className="co-done" role="status">
          <p className="co-eyebrow">ORDER {done.demo ? 'PREVIEW' : 'RECEIVED'}</p>
          <h1 className="co-title">Thank you.</h1>
          <p className="co-lede">
            Reference <strong>{done.ref}</strong>. Payment: {done.payment}. Total {formatPrice(done.total)}
            {done.shippingLabel ? ` (shipping ${done.shippingLabel})` : ''}. We will contact you at {done.email}.
          </p>
          {done.demo && <p className="co-note">Demo mode: no order was sent and no payment was taken.</p>}
          <Link to="/shop" className="co-btn">
            Continue shopping <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="page page--narrow co-page">
        <header className="co-head">
          <p className="co-eyebrow">CHECKOUT</p>
          <h1 className="co-title">Your cart is empty</h1>
          <p className="co-lede">Add something pure from Kashmir, then return to complete your order.</p>
        </header>
        <Link to="/shop" className="co-btn">
          Shop now <span aria-hidden="true">→</span>
        </Link>
      </main>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const v = (k: string) => String(f.get(k) || '').trim();
    const pin = v('pin') || pinVal;
    const state = v('state') || stateVal;
    const next: Record<string, string> = {};
    if (v('name').length < 2) next.name = 'Please enter your full name.';
    if (!emailOk(v('email'))) next.email = 'Please enter a valid email address.';
    if (!phoneOk(v('phone'))) next.phone = 'Please enter a valid phone number.';
    if (v('address').length < 6) next.address = 'Please enter your street address.';
    if (v('city').length < 2) next.city = 'Please enter your city.';
    if (state.length < 2) next.state = 'Please enter your state.';
    if (!/^\d{6}$/.test(pin)) next.pin = 'PIN code must be 6 digits.';
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus());
      return;
    }

    if (submitting.current) return;
    submitting.current = true;
    const finish = () => {
      submitting.current = false;
      setBusy(false);
    };

    const liveShip = calculateShipping(subtotal, pin, state, shipBase);
    const liveTotal = orderTotal(subtotal, liveShip.amount);

    setBusy(true);
    setFail('');
    const paymentMethod = pay;
    const key = JSON.stringify([lines, paymentMethod]);
    if (!attempt.current || attempt.current.key !== key) {
      attempt.current = {
        key,
        ref: ('BLY-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)).toUpperCase(),
      };
    }
    const ref = attempt.current.ref;
    const payload = {
      ref,
      paymentMethod,
      customer: { name: v('name'), email: v('email'), phone: v('phone') },
      shipping: { address: v('address'), city: v('city'), state, pin },
      notes: v('notes'),
      // Only what the server needs to price the cart itself. It ignores any price sent from here.
      items: lines.map((l) => ({ slug: l.slug, variantId: l.variantId, qty: l.qty })),
      subtotal, // lets the server detect stale prices
      website: v('website'),
    };

    if (paymentMethod === 'razorpay') {
      const loaded = await loadRazorpay();
      if (!loaded) {
        finish();
        setFail('Could not load payment window. Please try again or choose Cash on Delivery.');
        return;
      }
      const order = await createRazorpayOrder(payload.items, subtotal, ref, pin, state);
      if (!order.ok) {
        finish();
        setFail(order.message);
        return;
      }
      const rzp = new (window as any).Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'BELYN',
        description: `Order ${ref}`,
        order_id: order.id,
        prefill: { name: v('name'), email: v('email'), contact: v('phone') },
        theme: { color: '#075E4D' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verified = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order: payload,
          });
          finish();
          if (verified.ok) {
            setDone({
              ref: verified.ref || ref,
              demo: false,
              total: verified.total ?? order.total,
              email: v('email'),
              payment: 'Paid online (Razorpay)',
              shippingLabel: liveShip.included ? 'Included' : liveShip.free ? 'FREE' : formatPrice(liveShip.amount),
            });
            attempt.current = null;
            clear();
          } else {
            setFail(
              verified.message ||
                'Payment received but confirmation failed. Please contact us with your payment ID.',
            );
          }
        },
        modal: {
          ondismiss: () => {
            finish();
            setFail('Payment cancelled. You can try again or choose Cash on Delivery.');
          },
        },
      });
      rzp.on('payment.failed', () => {
        finish();
        setFail('Payment failed. Please try again or choose Cash on Delivery.');
      });
      rzp.open();
      return;
    }

    const r = await submitOrder(payload);
    finish();
    if (r.ok) {
      setDone({
        ref: r.ref || ref,
        demo: !!r.demo,
        total: r.total ?? liveTotal,
        email: v('email'),
        payment: paymentMethod === 'upi' ? 'UPI (manual confirmation)' : 'Cash on Delivery',
        shippingLabel: liveShip.included ? 'Included' : liveShip.free ? 'FREE' : formatPrice(liveShip.amount),
      });
      attempt.current = null;
      clear();
    } else setFail(r.message || 'Could not place your order.');
  }

  return (
    <main className="page co-page">
      <header className="co-head">
        <p className="co-eyebrow">CHECKOUT</p>
        <h1 className="co-title">Your details</h1>
        <p className="co-lede">Almost there. Complete your details to place your order.</p>
      </header>

      <div className="co-layout">
        <form className="co-form" onSubmit={onSubmit} noValidate id="checkout-form">
          <section className="co-section" aria-labelledby="co-contact-heading">
            <h2 id="co-contact-heading" className="co-section-title">
              Contact & delivery
            </h2>
            <CheckoutField label="Full name" name="name" autoComplete="name" placeholder="Your full name" error={errors.name} />
            <div className="co-row2">
              <CheckoutField label="Email address" name="email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} />
              <CheckoutField label="Phone number" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" error={errors.phone} />
            </div>
            <CheckoutField label="Address" name="address" autoComplete="street-address" placeholder="House no., street, landmark" error={errors.address} />
            <div className="co-row3">
              <CheckoutField label="City" name="city" autoComplete="address-level2" placeholder="City" error={errors.city} />
              <CheckoutField
                label="State"
                name="state"
                autoComplete="address-level1"
                placeholder="State"
                error={errors.state}
                value={stateVal}
                onChange={setStateVal}
              />
              <CheckoutField
                label="PIN code"
                name="pin"
                inputMode="numeric"
                maxLength={6}
                autoComplete="postal-code"
                placeholder="6 digits"
                error={errors.pin}
                value={pinVal}
                onChange={(val) => setPinVal(val.replace(/\D/g, '').slice(0, 6))}
              />
            </div>
          </section>

          <section className="co-section" aria-labelledby="co-pay-heading">
            <h2 id="co-pay-heading" className="co-section-title">
              Payment method
            </h2>
            <div className="co-pay" role="radiogroup" aria-label="Payment method">
              <label className={`co-pay-card${pay === 'razorpay' ? ' is-selected' : ''}`}>
                <input type="radio" name="payment" value="razorpay" checked={pay === 'razorpay'} onChange={() => setPay('razorpay')} />
                <span className="co-pay-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </span>
                <span className="co-pay-body">
                  <span className="co-pay-title">Pay online</span>
                  <span className="co-pay-desc">UPI, cards & net banking via Razorpay</span>
                </span>
                <span className="co-pay-check" aria-hidden="true" />
              </label>

              <label className={`co-pay-card${pay === 'cod' ? ' is-selected' : ''}`}>
                <input type="radio" name="payment" value="cod" checked={pay === 'cod'} onChange={() => setPay('cod')} />
                <span className="co-pay-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 3v18M8 7h5.5a3.5 3.5 0 0 1 0 7H8m0 0h6a3.5 3.5 0 0 1 0 7H8" />
                  </svg>
                </span>
                <span className="co-pay-body">
                  <span className="co-pay-title">Cash on delivery</span>
                  <span className="co-pay-desc">Pay when your order arrives</span>
                </span>
                <span className="co-pay-check" aria-hidden="true" />
              </label>

              <label className={`co-pay-card${pay === 'upi' ? ' is-selected' : ''}`}>
                <input type="radio" name="payment" value="upi" checked={pay === 'upi'} onChange={() => setPay('upi')} />
                <span className="co-pay-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 7h10v10H7z" />
                    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
                  </svg>
                </span>
                <span className="co-pay-body">
                  <span className="co-pay-title">UPI (manual)</span>
                  <span className="co-pay-desc">Payment instructions shared after order</span>
                </span>
                <span className="co-pay-check" aria-hidden="true" />
              </label>
            </div>
          </section>

          <section className="co-section">
            <CheckoutField label="Order notes (optional)" name="notes" textarea placeholder="Delivery instructions, gift note…" />
          </section>

          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />

          {fail && (
            <p className="co-alert" role="alert">
              {fail}
            </p>
          )}

          <ul className="co-trust">
            <li>
              <strong>Secure checkout</strong>
              <span>Your payment is processed securely.</span>
            </li>
            <li>
              <strong>Carefully packed</strong>
              <span>Products packed with care from Kashmir.</span>
            </li>
            <li>
              <strong>Customer support</strong>
              <span>We&rsquo;re here to help with your order.</span>
            </li>
          </ul>

          <button className="co-btn co-btn--block" disabled={busy} type="submit">
            {busy ? 'Processing…' : `Place order · ${formatPrice(payable)}`}
          </button>
        </form>

        <aside className="co-summary" aria-label="Order summary">
          <div className="co-summary-card">
            <h2 className="co-summary-title">Order summary</h2>
            <ul className="co-lines">
              {lines.map((l) => {
                const p = getPurchasable(l.slug)!;
                const variant = p.variants.find((x) => x.id === l.variantId)!;
                return (
                  <li key={l.slug + l.variantId} className="co-line">
                    <div className="co-thumb" style={{ background: p.bg }}>
                      <ProductVisual product={p} />
                    </div>
                    <div className="co-line-meta">
                      <p className="co-line-name">{p.name}</p>
                      <p className="co-line-var">
                        {variant.label} × {l.qty}
                      </p>
                    </div>
                    <p className="co-line-price">{formatPrice(variant.price * l.qty)}</p>
                  </li>
                );
              })}
            </ul>
            <div className="co-totals">
              <div className="co-total-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="co-total-row">
                <span>Shipping</span>
                <span className={ship.free ? 'co-ship-free' : undefined}>{shippingDisplay}</span>
              </div>
              {ship.free && !ship.included && (
                <p className="co-ship-badge" role="status">
                  Free shipping · Jammu & Kashmir
                </p>
              )}
              {ship.zone !== 'pending' && (!ship.free || ship.included) && (
                <p className="co-note">{ship.note}</p>
              )}
              {ship.zone === 'pending' && <p className="co-note">{ship.note}</p>}
              <div className="co-total-row co-total-row--grand">
                <span>Total</span>
                <strong>{formatPrice(payable)}</strong>
              </div>
            </div>
            {PRICES_ARE_PLACEHOLDERS && (
              <p className="co-note">Prices are placeholders until real Belyn pricing is added.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

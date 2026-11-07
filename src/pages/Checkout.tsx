import { useState, type FormEvent } from 'react';
import { useCart } from '../lib/cart';
import { Link } from '../lib/router';
import { PRICES_ARE_PLACEHOLDERS, formatPrice, getProduct } from '../data/products';
import { ProductVisual } from '../components/Art';
import { submitOrder, createRazorpayOrder, verifyRazorpayPayment, loadRazorpay } from '../lib/api';
import { useSeo } from '../lib/seo';
import { Field } from './Contact';

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneOk = (v: string) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, '')) || /^\+?\d{8,15}$/.test(v.replace(/[\s-]/g, ''));

interface Done { ref: string; demo: boolean; total: number; email: string; payment: string }

export default function Checkout() {
  useSeo({ title: 'Checkout', description: 'Complete your Belyn order.', path: '/checkout', noindex: true });
  const { lines, subtotal, clear } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState('');
  const [done, setDone] = useState<Done | null>(null);

  if (done) return <main className="page page--narrow"><div className="notice notice--ok" role="status"><p className="eyebrow">ORDER {done.demo ? 'PREVIEW' : 'RECEIVED'}</p><h1 className="h-page">THANK YOU.</h1><p>Reference <strong>{done.ref}</strong>. Payment: {done.payment}. We have noted an order of {formatPrice(done.total)} and will contact you at {done.email}.</p>{done.demo && <p className="note">Demo mode: no order was sent and no payment was taken. Configure email on Vercel to go live.</p>}<Link to="/shop" className="btn btn--lime">Continue shopping <span aria-hidden="true">&rarr;</span></Link></div></main>;

  if (lines.length === 0) return <main className="page page--narrow"><header className="page__head"><h1 className="h-page">YOUR CART IS EMPTY</h1></header><Link to="/shop" className="btn btn--lime">Shop Now <span aria-hidden="true">&rarr;</span></Link></main>;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget; const f = new FormData(form); const v = (k: string) => String(f.get(k) || '').trim();
    const next: Record<string, string> = {};
    if (v('name').length < 2) next.name = 'Please enter your full name.';
    if (!emailOk(v('email'))) next.email = 'Please enter a valid email address.';
    if (!phoneOk(v('phone'))) next.phone = 'Please enter a valid phone number.';
    if (v('address').length < 6) next.address = 'Please enter your street address.';
    if (v('city').length < 2) next.city = 'Please enter your city.';
    if (v('state').length < 2) next.state = 'Please enter your state.';
    if (!/^\d{6}$/.test(v('pin'))) next.pin = 'PIN code must be 6 digits.';
    setErrors(next); if (Object.keys(next).length) { requestAnimationFrame(() => (form.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus()); return; }
    setBusy(true); setFail('');
    const ref = 'BLY-' + Date.now().toString(36).toUpperCase();
    const paymentMethod = v('payment') || 'cod';
    const payload = {
      ref,
      paymentMethod,
      customer: { name: v('name'), email: v('email'), phone: v('phone') },
      shipping: { address: v('address'), city: v('city'), state: v('state'), pin: v('pin') },
      notes: v('notes'),
      items: lines.map((l) => {
        const p = getProduct(l.slug)!;
        const variant = p.variants.find((x) => x.id === l.variantId)!;
        return { slug: l.slug, name: p.name, variant: variant.label, qty: l.qty, unitPrice: variant.price };
      }),
      subtotal,
      website: v('website'),
    };

    // ── Pay online via Razorpay ──
    if (paymentMethod === 'razorpay') {
      const loaded = await loadRazorpay();
      if (!loaded) {
        setBusy(false);
        setFail('Could not load payment window. Please try again or choose Cash on Delivery.');
        return;
      }
      const order = await createRazorpayOrder(subtotal, ref);
      if (!order.ok) {
        setBusy(false);
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
        theme: { color: '#075B4D' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verified = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            order: payload,
          });
          setBusy(false);
          if (verified.ok) {
            setDone({
              ref: verified.ref || ref,
              demo: false,
              total: subtotal,
              email: v('email'),
              payment: 'Paid online (Razorpay)',
            });
            clear();
          } else {
            setFail(verified.message || 'Payment received but confirmation failed. Please contact us with your payment ID.');
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setFail('Payment cancelled. You can try again or choose Cash on Delivery.');
          },
        },
      });
      rzp.on('payment.failed', () => {
        setBusy(false);
        setFail('Payment failed. Please try again or choose Cash on Delivery.');
      });
      rzp.open();
      return;
    }

    // ── COD / UPI (email order request only) ──
    const r = await submitOrder(payload);
    setBusy(false);
    if (r.ok) {
      setDone({
        ref: r.ref || ref,
        demo: !!r.demo,
        total: subtotal,
        email: v('email'),
        payment: paymentMethod === 'upi' ? 'UPI (manual confirmation)' : 'Cash on Delivery',
      });
      clear();
    } else setFail(r.message || 'Could not place your order.');
  }

  return <main className="page checkout"><header className="page__head"><p className="eyebrow">CHECKOUT</p><h1 className="h-page">YOUR DETAILS</h1></header><div className="checkout__grid"><form className="form" onSubmit={onSubmit} noValidate id="checkout-form">
    <Field label="Full name" name="name" autoComplete="name" error={errors.name}/><div className="row2"><Field label="Email" name="email" type="email" autoComplete="email" error={errors.email}/><Field label="Phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" error={errors.phone}/></div>
    <Field label="Address" name="address" autoComplete="street-address" error={errors.address}/><div className="row3"><Field label="City" name="city" autoComplete="address-level2" error={errors.city}/><Field label="State" name="state" autoComplete="address-level1" error={errors.state}/><Field label="PIN code" name="pin" inputMode="numeric" maxLength={6} autoComplete="postal-code" error={errors.pin}/></div>
    <fieldset className="form__field"><legend>Payment method</legend>
      <label><input type="radio" name="payment" value="razorpay" defaultChecked/> Pay online (UPI / Card / Netbanking)</label>
      <label><input type="radio" name="payment" value="cod"/> Cash on Delivery (COD)</label>
      <label><input type="radio" name="payment" value="upi"/> UPI (manual — instructions after order)</label>
    </fieldset>
    <Field label="Order notes (optional)" name="notes" textarea/><input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true"/>
    {fail && <p className="notice notice--err" role="alert">{fail}</p>}
    <p className="note">Online payments are processed securely by Razorpay. COD remains available if you prefer.</p>
    <button className="btn btn--dark btn--block" disabled={busy}>{busy ? 'Processing…' : `Place order · ${formatPrice(subtotal)}`}</button>
  </form><aside className="summary" aria-label="Order summary"><h2>Order summary</h2><ul>{lines.map((l) => { const p = getProduct(l.slug)!; const variant = p.variants.find((x) => x.id === l.variantId)!; return <li key={l.slug + l.variantId}><div className="cline__img" style={{ background: p.bg }}><ProductVisual product={p}/></div><div><strong>{p.name}</strong><p className="cline__var">{variant.label} × {l.qty}</p></div><span>{formatPrice(variant.price * l.qty)}</span></li>; })}</ul><div className="drawer__sub"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>{PRICES_ARE_PLACEHOLDERS && <p className="note">Prices are placeholders until real Belyn pricing is added.</p>}</aside></div></main>;
}

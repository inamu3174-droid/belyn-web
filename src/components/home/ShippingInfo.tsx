import { Link } from '../../lib/router';
import { JK_FREE_THRESHOLD, JK_SHIPPING, INDIA_SHIPPING } from '../../lib/shipping';

/** Shipping rules, read from the same constants the cart, checkout and server use. */
export default function ShippingInfo() {
  return (
    <section className="ship" id="shipping" aria-labelledby="ship-title">
      <h2 id="ship-title" className="h-sec">
        Shipping
      </h2>
      <div className="ship__grid">
        <article className="ship__card">
          <p className="ship__zone">Jammu &amp; Kashmir</p>
          <p className="ship__big">Free from ₹{JK_FREE_THRESHOLD}</p>
          <p>Enjoy complimentary shipping on orders of ₹{JK_FREE_THRESHOLD} and above.</p>
          <p>Orders below ₹{JK_FREE_THRESHOLD} are subject to a flat shipping fee of ₹{JK_SHIPPING}.</p>
        </article>
        <article className="ship__card">
          <p className="ship__zone">Across India</p>
          <p className="ship__big">Flat ₹{INDIA_SHIPPING}</p>
          <p>A flat shipping fee of ₹{INDIA_SHIPPING} applies to all orders.</p>
        </article>
      </div>
      <p className="ship__more">
        Delivery timelines and further details are available in our <Link to="/policies/shipping">Shipping Policy</Link>.
      </p>
    </section>
  );
}

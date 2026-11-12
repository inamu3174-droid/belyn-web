import { useState, type FormEvent } from 'react';
import { site } from '../data/site';
import { submitContact } from '../lib/api';
import { useSeo } from '../lib/seo';
import { enquiryMessages } from '../data/home';
import { contactFaqs } from '../data/contactFaq';
import { Link } from '../lib/router';
import SocialIcons from '../components/SocialIcons';

type Status = 'idle' | 'sending' | 'sent' | 'demo' | 'error';
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Contact() {
  useSeo({ title: 'Contact', description: 'Get in touch with Belyn.', path: '/contact' });
  const [status, setStatus] = useState<Status>('idle');
  const [err, setErr] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  // /contact?topic=festive pre-fills the message (only known topics are used)
  const topic = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('topic') : null;
  const prefill = topic && Object.prototype.hasOwnProperty.call(enquiryMessages, topic) ? enquiryMessages[topic] : undefined;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      name: String(f.get('name') || '').trim(),
      email: String(f.get('email') || '').trim(),
      message: String(f.get('message') || '').trim(),
      phone: String(f.get('phone') || '').trim(),
      subject: String(f.get('subject') || '').trim(),
      website: String(f.get('website') || ''),
    };
    const next: Record<string, string> = {};
    if (data.name.length < 2) next.name = 'Please enter your name.';
    if (!emailOk(data.email)) next.email = 'Please enter a valid email.';
    if (data.message.length < 10) next.message = 'A few more words will help us reply properly.';
    setErrors(next);
    if (Object.keys(next).length) {
      (e.currentTarget.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
      return;
    }
    setStatus('sending');
    const r = await submitContact(data);
    if (r.ok) setStatus(r.demo ? 'demo' : 'sent');
    else {
      setErr(r.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  }

  return (
    <main className="page contact-page xpage">
      <style>{`
        .contact-page .contact-head { margin-bottom: 2rem; }
        .contact-page .contact-head .lede { margin-top: 0.75rem; }
        .contact-page .contact-direct {
          margin-top: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem 1.25rem;
          font-size: 14px;
          font-weight: 600;
        }
        .contact-page .contact-direct a {
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }
        .contact-page .contact-direct a:hover {
          border-bottom-color: currentColor;
        }
        .contact-page .contact-form {
          display: grid;
          gap: 1.15rem;
          max-width: 520px;
        }
        .contact-page .field {
          display: grid;
          gap: 0.4rem;
        }
        .contact-page .field label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .contact-page .field input,
        .contact-page .field textarea {
          width: 100%;
          border: 1px solid var(--line, #E9E5D8);
          border-radius: 8px;
          background: #fff;
          color: inherit;
          font: inherit;
          font-size: 15px;
          padding: 0.85rem 1rem;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          -webkit-appearance: none;
          appearance: none;
        }
        .contact-page .field textarea {
          min-height: 140px;
          resize: vertical;
          line-height: 1.5;
        }
        .contact-page .field input:focus,
        .contact-page .field textarea:focus {
          border-color: var(--deep-green, #075B4D);
          box-shadow: 0 0 0 3px rgba(7, 91, 77, 0.12);
        }
        .contact-page .field input::placeholder,
        .contact-page .field textarea::placeholder {
          color: #9a9488;
        }
        .contact-page .field.has-err input,
        .contact-page .field.has-err textarea {
          border-color: #b85c38;
        }
        .contact-page .field__err {
          margin: 0;
          font-size: 12px;
          color: #b85c38;
        }
        .contact-page .contact-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.85rem 1.25rem;
          margin-top: 0.25rem;
        }
        .contact-page .contact-hint {
          margin: 0;
          font-size: 12px;
          color: var(--gray, #6B5E52);
          line-height: 1.4;
        }
        .contact-page .contact-success {
          max-width: 420px;
          padding: 1.5rem 0;
        }
        .contact-page .contact-success h2 {
          font-family: var(--serif);
          font-weight: 400;
          font-size: clamp(28px, 5vw, 40px);
          margin: 0 0 0.6rem;
        }
        .contact-page .contact-success p {
          margin: 0;
          line-height: 1.55;
        }
        .contact-page .notice--err {
          margin: 0;
          padding: 0.75rem 0.9rem;
          border-radius: 8px;
          border: 1px solid #e8c4b5;
          background: #fdf6f2;
          color: #8a3b22;
          font-size: 13px;
        }
      `}</style>

      <header className="xbanner" data-reveal>
        <div className="xbanner__card">
          <h1>Contact us</h1>
          <p className="xbanner__tag">We&rsquo;d love to hear from you.</p>
        </div>
      </header>

      <section className="csec">
        <h2 className="wsec__h">We&rsquo;d love to hear from you</h2>
        <p>Questions, feedback, or simply want to say hello? We&rsquo;re here to help.</p>
      </section>

      <section className="csec" aria-labelledby="touch-title">
        <h2 id="touch-title" className="wsec__h">Get in touch</h2>
        <div className="ctiles">
          {site.email && (
            <a className="ctile" href={`mailto:${site.email}`}>
              <span className="ctile__k">Email</span>
              <span className="ctile__v">{site.email}</span>
            </a>
          )}
          {site.whatsapp && (
            <a className="ctile" href={`https://wa.me/${site.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
              <span className="ctile__k">WhatsApp / Phone</span>
              <span className="ctile__v">{site.phone}</span>
            </a>
          )}
          {site.instagram && (
            <a className="ctile" href={site.instagram} target="_blank" rel="noopener noreferrer">
              <span className="ctile__k">Instagram</span>
              <span className="ctile__v">@belyn.in</span>
            </a>
          )}
          {site.facebook && (
            <a className="ctile" href={site.facebook} target="_blank" rel="noopener noreferrer">
              <span className="ctile__k">Facebook</span>
              <span className="ctile__v">BELYN on Facebook</span>
            </a>
          )}
        </div>
        <SocialIcons />
      </section>

      <h2 className="wsec__h csec">Send us a message</h2>
      {status === 'sent' || status === 'demo' ? (
        <div className="contact-success" role="status">
          <h2>Thank you for reaching out.</h2>
          <p>We&rsquo;ve received your message and will get back to you soon.</p>
          {status === 'demo' && (
            <p className="contact-hint" style={{ marginTop: '0.75rem' }}>
              Demo mode: email is not connected yet, so this note was not delivered.
            </p>
          )}
        </div>
      ) : (
        <form className="contact-form" onSubmit={onSubmit} noValidate data-reveal>
          <Field
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            error={errors.name}
          />
          <Field
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email}
          />
          <Field label="Phone number (optional)" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" />
          <Field label="Subject" name="subject" placeholder="What is this about?" />
          <Field
            label="Your message"
            name="message"
            textarea
            defaultValue={prefill}
            placeholder="How can we help?"
            error={errors.message}
          />
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />

          {status === 'error' && (
            <p className="notice notice--err" role="alert">
              {err}
            </p>
          )}

          <div className="contact-actions">
            <button className="btn btn--dark" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
            <p className="contact-hint">We usually reply within one to two business days.</p>
          </div>
        </form>
      )}
      <section className="csec cfaq" aria-labelledby="cfaq-title">
        <h2 id="cfaq-title" className="wsec__h">FAQ</h2>
        <div className="faq__list cfaq__list">
          {contactFaqs.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
              {f.links && (
                <p className="cfaq__links">
                  {f.links.map((l) => (
                    <Link key={l.to} to={l.to} className="shop-btn shop-btn--ghost">{l.label}</Link>
                  ))}
                </p>
              )}
            </details>
          ))}
        </div>
        <div className="wbtns wbtns--c">
          <Link to="/policies/shipping" className="shop-btn shop-btn--ghost">View Shipping &amp; Returns Policy</Link>
          <Link to="/contact?topic=festive" className="shop-btn shop-btn--ghost">Explore Festive Gifting</Link>
          <Link to="/shop" className="shop-btn shop-btn--primary">Shop All Products</Link>
        </div>
      </section>

      <section className="csec csec--close">
        <h2 className="wsec__h">Here when you need us</h2>
        <p>Whether you have a question, feedback or simply want to connect, we&rsquo;re always happy to hear from you.</p>
        <p className="wnote">BELYN &mdash; A shared dream, made to be shared with the world.</p>
      </section>
    </main>
  );
}

export function Field({
  label,
  name,
  type = 'text',
  textarea,
  error,
  autoComplete,
  inputMode,
  maxLength,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  error?: string;
  autoComplete?: string;
  inputMode?: 'numeric' | 'tel' | 'text';
  maxLength?: number;
  defaultValue?: string;
  placeholder?: string;
}) {
  const id = 'f-' + name;
  const common = {
    id,
    name,
    placeholder,
    'aria-invalid': !!error || undefined,
    'aria-describedby': error ? id + '-err' : undefined,
    autoComplete,
    defaultValue,
  } as const;
  return (
    <div className={`field${error ? ' has-err' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea rows={6} {...common} />
      ) : (
        <input type={type} inputMode={inputMode} maxLength={maxLength} {...common} />
      )}
      {error && (
        <p id={id + '-err'} className="field__err">
          {error}
        </p>
      )}
    </div>
  );
}

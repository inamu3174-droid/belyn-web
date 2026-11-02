import { useState, type FormEvent } from 'react';
import { site } from '../data/site';
import { submitContact } from '../lib/api';
import { useSeo } from '../lib/seo';

type Status = 'idle' | 'sending' | 'sent' | 'demo' | 'error';
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function Contact() {
  useSeo({ title: 'Contact', description: 'Get in touch with Belyn.', path: '/contact' });
  const [status, setStatus] = useState<Status>('idle');
  const [err, setErr] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = { name: String(f.get('name') || '').trim(), email: String(f.get('email') || '').trim(), message: String(f.get('message') || '').trim(), website: String(f.get('website') || '') };
    const next: Record<string, string> = {};
    if (data.name.length < 2) next.name = 'Please enter your name.';
    if (!emailOk(data.email)) next.email = 'Please enter a valid email address.';
    if (data.message.length < 10) next.message = 'Please write at least a short message (10+ characters).';
    setErrors(next);
    if (Object.keys(next).length) {
      (e.currentTarget.querySelector('[aria-invalid="true"]') as HTMLElement | null)?.focus();
      return;
    }
    setStatus('sending');
    const r = await submitContact(data);
    if (r.ok) setStatus(r.demo ? 'demo' : 'sent');
    else {
      setErr(r.message);
      setStatus('error');
    }
  }

  return (
    <main className="page page--narrow">
      <header className="page__head" data-reveal>
        <p className="eyebrow">CONTACT</p>
        <h1 className="h-page">SAY HELLO</h1>
        <p className="lede">Questions about an order or our products? Write to us.</p>
        {(site.email || site.phone) && (
          <p className="lede">
            {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
            {site.email && site.phone && ' · '}
            {site.phone && <a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a>}
          </p>
        )}
      </header>

      {status === 'sent' || status === 'demo' ? (
        <div className="notice notice--ok" role="status">
          <h2>Thank you.</h2>
          <p>Your message has been received. We&rsquo;ll get back to you soon.</p>
          {status === 'demo' && <p className="note">Demo mode: the contact form is not connected to email yet, so this message was not delivered. See README to connect it.</p>}
        </div>
      ) : (
        <form className="form" onSubmit={onSubmit} noValidate data-reveal>
          <Field label="Name" name="name" autoComplete="name" error={errors.name} />
          <Field label="Email" name="email" type="email" autoComplete="email" error={errors.email} />
          <Field label="Message" name="message" textarea error={errors.message} />
          {/* honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
          {status === 'error' && (
            <p className="notice notice--err" role="alert">
              {err}
            </p>
          )}
          <button className="btn btn--dark" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'} <span aria-hidden="true">&rarr;</span>
          </button>
        </form>
      )}
    </main>
  );
}

export function Field({ label, name, type = 'text', textarea, error, autoComplete, inputMode, maxLength, defaultValue }: { label: string; name: string; type?: string; textarea?: boolean; error?: string; autoComplete?: string; inputMode?: 'numeric' | 'tel' | 'text'; maxLength?: number; defaultValue?: string }) {
  const id = 'f-' + name;
  const common = { id, name, 'aria-invalid': !!error, 'aria-describedby': error ? id + '-err' : undefined, autoComplete, defaultValue } as const;
  return (
    <div className={`field ${error ? 'has-err' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {textarea ? <textarea rows={6} {...common} /> : <input type={type} inputMode={inputMode} maxLength={maxLength} {...common} />}
      {error && (
        <p id={id + '-err'} className="field__err">
          {error}
        </p>
      )}
    </div>
  );
}

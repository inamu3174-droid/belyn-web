import { useRef, useState, type FormEvent } from 'react';

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Newsletter signup. Posts to /api/newsletter, which emails the signup to BELYN. */
export default function NewsletterForm({ id = 'nl' }: { id?: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const busy = useRef(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (busy.current) return;
    const v = email.trim();
    if (!emailOk(v)) {
      setState('error');
      setMsg('Please enter a valid email address.');
      return;
    }
    busy.current = true;
    setState('busy');
    setMsg('');
    try {
      const hp = (e.currentTarget as HTMLFormElement).elements.namedItem('website') as HTMLInputElement | null;
      const r = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: v, website: hp?.value || '' }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.message || 'Could not subscribe right now.');
      setState('done');
      setMsg('Thank you. You are on the list.');
      setEmail('');
    } catch (err) {
      setState('error');
      setMsg(err instanceof Error ? err.message : 'Could not subscribe right now.');
    } finally {
      busy.current = false;
    }
  }

  return (
    <form className="nl" onSubmit={onSubmit} noValidate>
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="nl__row">
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={state === 'error'}
          aria-describedby={`${id}-msg`}
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="nl__hp" />
        <button type="submit" className="shop-btn shop-btn--primary" disabled={state === 'busy'}>
          {state === 'busy' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      <p id={`${id}-msg`} className={`nl__msg${state === 'error' ? ' is-err' : ''}`} role="status" aria-live="polite">
        {msg}
      </p>
    </form>
  );
}

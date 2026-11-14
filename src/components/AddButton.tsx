/** The BELYN "ADD" pill: dark charcoal, white label, cart icon. One look for every product card. */
export default function AddButton({
  onClick,
  disabled,
  state = 'idle',
  label,
  className = '',
}: {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  state?: 'idle' | 'added' | 'sold';
  label: string;
  className?: string;
}) {
  return (
    <button type="button" className={`add-pill ${className}`.trim()} onClick={onClick} disabled={disabled} aria-label={label}>
      <span>{state === 'sold' ? 'Sold out' : state === 'added' ? 'Added' : 'ADD'}</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 4h2.5l2.2 10.2a1.5 1.5 0 0 0 1.5 1.2h8a1.5 1.5 0 0 0 1.5-1.1L20 8H6.2" />
        <circle cx="9.5" cy="19.5" r="1.3" />
        <circle cx="17" cy="19.5" r="1.3" />
      </svg>
    </button>
  );
}

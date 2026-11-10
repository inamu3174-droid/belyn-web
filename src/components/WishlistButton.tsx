import { toggleWishlist, useWishlist } from '../lib/saved';

export default function WishlistButton({
  slug,
  name,
  className = '',
  withLabel = false,
}: {
  slug: string;
  name: string;
  className?: string;
  withLabel?: boolean;
}) {
  const saved = useWishlist().includes(slug);
  return (
    <button
      type="button"
      className={`wish${saved ? ' is-on' : ''} ${className}`}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(slug);
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9Z" />
      </svg>
      {withLabel && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}

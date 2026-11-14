/** Full-width banner: a supplied image if given, otherwise a calm layered-ridge illustration (no text unless children). */
export default function Banner({ image, label, children }: { image?: string; label: string; children?: React.ReactNode }) {
  return (
    <div className={`bnr${children ? ' bnr--text' : ''}`} role="img" aria-label={label}>
      {image ? (
        <img src={image} alt="" className="bnr__img" />
      ) : (
        <svg className="bnr__art" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
          <defs>
            <linearGradient id="bnr-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F3EEE0" />
              <stop offset="1" stopColor="#E9E1CC" />
            </linearGradient>
          </defs>
          <rect width="1200" height="420" fill="url(#bnr-sky)" />
          <circle cx="880" cy="120" r="46" fill="#F8F6EF" opacity=".9" />
          <path d="M0 270 L140 190 L230 240 L360 140 L470 230 L560 180 L700 262 L820 170 L960 250 L1080 200 L1200 260 V420 H0Z" fill="#CFC8B0" opacity=".7" />
          <path d="M0 320 L120 250 L220 300 L340 220 L450 300 L580 235 L700 310 L840 240 L980 315 L1100 265 L1200 310 V420 H0Z" fill="#6E8C7F" opacity=".75" />
          <path d="M0 370 L150 315 L260 360 L400 300 L520 360 L660 315 L800 365 L940 320 L1080 362 L1200 335 V420 H0Z" fill="#075B4D" />
        </svg>
      )}
      {children && <div className="bnr__over">{children}</div>}
    </div>
  );
}

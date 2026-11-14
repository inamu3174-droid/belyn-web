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
              <stop offset="0" stopColor="#FBF6E8" />
              <stop offset=".55" stopColor="#F1E6C9" />
              <stop offset="1" stopColor="#E7D6AC" />
            </linearGradient>
            <radialGradient id="bnr-sun" cx=".5" cy=".5" r=".5">
              <stop offset="0" stopColor="#FFF8E1" stopOpacity="1" />
              <stop offset=".35" stopColor="#F6DFA3" stopOpacity=".75" />
              <stop offset="1" stopColor="#F6DFA3" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bnr-mist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F8F6EF" stopOpacity="0" />
              <stop offset="1" stopColor="#F8F6EF" stopOpacity=".55" />
            </linearGradient>
          </defs>
          <rect width="1200" height="420" fill="url(#bnr-sky)" />
          <circle cx="1000" cy="150" r="190" fill="url(#bnr-sun)" />
          <circle cx="1000" cy="150" r="34" fill="#FFF9E6" />
          <path d="M0 250 L90 205 L180 238 L300 150 L400 215 L470 185 L580 250 L690 175 L790 232 L900 160 L1010 228 L1110 190 L1200 235 V420 H0Z" fill="#D9CFB2" opacity=".55" />
          <path d="M0 290 L110 232 L210 272 L330 190 L430 262 L540 205 L660 282 L780 212 L890 270 L1010 205 L1110 255 L1200 232 V420 H0Z" fill="#9DB3A5" opacity=".8" />
          <rect y="250" width="1200" height="90" fill="url(#bnr-mist)" />
          <path d="M0 335 L130 282 L240 322 L370 262 L490 328 L620 280 L750 336 L880 286 L1010 332 L1120 296 L1200 322 V420 H0Z" fill="#3F7A68" />
          <path d="M0 380 L160 340 L280 372 L430 326 L560 378 L700 338 L850 380 L990 344 L1110 374 L1200 356 V420 H0Z" fill="#075B4D" />
        </svg>
      )}
      {children && <div className="bnr__over">{children}</div>}
    </div>
  );
}

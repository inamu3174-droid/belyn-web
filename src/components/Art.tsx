import type { Product } from '../data/products';

// Drawn placeholder jar. Replaced automatically when a product has a real `image`.
export function Jar({ jar, className, title }: { jar: Product['jar']; className?: string; title?: string }) {
  const { lid, body, label, ink, lines } = jar;
  return (
    <svg className={className} viewBox="0 0 200 280" role="img" aria-label={title} focusable="false">
      <ellipse cx="100" cy="270" rx="68" ry="7" fill="#000" opacity=".12" />
      <rect x="40" y="48" width="120" height="212" rx="22" fill={body} />
      <rect x="44" y="52" width="14" height="196" rx="7" fill="#fff" opacity=".28" />
      <rect x="34" y="14" width="132" height="46" rx="10" fill={lid} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <rect key={i} x={42 + i * 14.5} y="18" width="3" height="38" rx="1.5" fill="#000" opacity=".18" />
      ))}
      <rect x="40" y="104" width="120" height="116" fill={label} />
      <text x="100" y="124" textAnchor="middle" fontSize="9" letterSpacing="2.5" fill={ink} opacity=".85" fontFamily="var(--sans)" fontWeight="700">
        B E L Y N
      </text>
      {lines.map((l, i) => (
        <text key={l} x="100" y={150 + i * 20} textAnchor="middle" fontSize={l.length > 7 ? 17 : 20} fill={ink} fontFamily="var(--serif)">
          {l}
        </text>
      ))}
    </svg>
  );
}

// Product visual: real photo if provided, otherwise the drawn jar.
export function ProductVisual({ product, className }: { product: Product; className?: string }) {
  if (product.image) return <img className={className} src={product.image} alt={product.name} loading="lazy" width={600} height={800} />;
  return <Jar jar={product.jar} className={className} title={product.name} />;
}

/** Simple flat editorial illustrations used where the reference shows photography.
 *  Swap for real photos by replacing <Scene> usages with <img>. */
export function Scene({ kind, className }: { kind: 'honey' | 'saffron' | 'walnut' | 'almond' | 'kahwa'; className?: string }) {
  if (kind === 'honey')
    return (
      <svg className={className} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect width="400" height="400" fill="#f2b38c" />
        <circle cx="200" cy="210" r="170" fill="#c0392b" opacity=".0" />
        <circle cx="200" cy="210" r="165" fill="#b5301f" />
        <circle cx="200" cy="210" r="140" fill="#e8a317" />
        <circle cx="200" cy="210" r="112" fill="#f6c453" />
        <ellipse cx="170" cy="180" rx="60" ry="26" fill="#fff" opacity=".28" />
        <rect x="205" y="40" width="16" height="210" rx="8" transform="rotate(24 213 145)" fill="#4b1c0e" />
        <ellipse cx="256" cy="262" rx="30" ry="14" transform="rotate(24 256 262)" fill="#4b1c0e" />
        <path d="M120 250c30 20 70 24 110 8" stroke="#fff" strokeWidth="4" opacity=".4" fill="none" strokeLinecap="round" />
      </svg>
    );
  if (kind === 'saffron')
    return (
      <svg className={className} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect width="400" height="400" fill="#d9742b" />
        {Array.from({ length: 70 }).map((_, i) => {
          const x = (i * 97) % 400, y = (i * 53) % 400, r = (i * 37) % 180;
          return <path key={i} d={`M${x} ${y}q18 -10 30 6`} stroke={i % 3 ? '#b7261b' : '#e8541b'} strokeWidth="5" strokeLinecap="round" fill="none" transform={`rotate(${r} ${x} ${y})`} />;
        })}
      </svg>
    );
  if (kind === 'walnut')
    return (
      <svg className={className} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect width="400" height="400" fill="#a4dcf6" />
        <g fill="#b98a58">
          <ellipse cx="150" cy="200" rx="86" ry="104" />
          <ellipse cx="258" cy="212" rx="78" ry="96" fill="#a77a49" />
        </g>
        <g stroke="#7b5731" strokeWidth="5" fill="none" strokeLinecap="round">
          <path d="M150 100v200M120 130c20 20 20 120 0 140M180 130c-20 20-20 120 0 140" />
          <path d="M258 118v190M232 148c16 20 16 100 0 120M284 148c-16 20-16 100 0 120" />
        </g>
      </svg>
    );
  if (kind === 'almond')
    return (
      <svg className={className} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect width="400" height="400" fill="#cbed41" />
        {[[110, 150, -20], [220, 120, 30], [290, 230, -35], [160, 270, 15], [80, 280, 40]].map(([x, y, r], i) => (
          <g key={i} transform={`rotate(${r} ${x} ${y})`}>
            <path d={`M${x} ${y - 58}C${x + 52} ${y - 20} ${x + 40} ${y + 40} ${x} ${y + 62}C${x - 40} ${y + 40} ${x - 52} ${y - 20} ${x} ${y - 58}Z`} fill="#c58b57" />
            <path d={`M${x - 8} ${y - 36}C${x - 22} ${y} ${x - 12} ${y + 28} ${x - 4} ${y + 44}`} stroke="#fff" opacity=".35" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </svg>
    );
  return (
    <svg className={className} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="400" fill="#7fc8a9" />
      <ellipse cx="200" cy="300" rx="130" ry="22" fill="#000" opacity=".12" />
      <path d="M90 170h220c0 80-40 124-110 124S90 250 90 170Z" fill="#fffffa" />
      <ellipse cx="200" cy="170" rx="110" ry="22" fill="#d9742b" />
      <ellipse cx="200" cy="168" rx="92" ry="15" fill="#e8a317" />
      <path d="M310 190c46 0 46 64-8 64" stroke="#fffffa" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M170 110c-12-20 12-26 0-46M210 118c-12-20 12-26 0-46" stroke="#fff" strokeWidth="6" opacity=".7" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Line illustration for the story block: a hand holding a jar with a saffron flower. */
export function StoryLineArt({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 360 300" fill="none" stroke="#193e10" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M40 270c10-70 40-110 90-130" />
      <path d="M130 140c-6-40 4-84 40-96 30-10 56 12 52 46" />
      <path d="M170 44c-6-14 2-26 16-26" />
      <path d="M222 90c20 12 30 40 22 70-8 30-30 50-66 56-26 4-44 20-48 54" />
      <path d="M196 120c-14-8-18-24-12-36" />
      {/* jar */}
      <rect x="226" y="86" width="74" height="104" rx="14" transform="rotate(8 263 138)" />
      <rect x="230" y="66" width="66" height="26" rx="6" transform="rotate(8 263 79)" />
      <path d="M240 126h46M240 144h40" transform="rotate(8 263 138)" />
      {/* flower */}
      <path d="M298 62c10-16 26-18 36-8-6 18-22 24-36 8Z" />
      <path d="M298 62c-4-22 10-36 24-34-2 18-10 30-24 34Z" />
      <path d="M312 40c8 4 14 10 18 20" />
      <path d="M110 150c40 10 70 40 76 90" />
    </svg>
  );
}

/** Small line icons for the 6-item feature strip. */
export function CategoryIcon({ kind }: { kind: string }) {
  const p = { fill: 'none', stroke: '#193e10', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const body = {
    honey: (
      <>
        <rect x="14" y="16" width="28" height="30" rx="6" {...p} />
        <rect x="16" y="9" width="24" height="9" rx="3" {...p} />
        <path d="M20 30h16M20 37h12" {...p} />
      </>
    ),
    saffron: (
      <>
        <path d="M28 12c10 10 12 22 0 34-12-12-10-24 0-34Z" {...p} />
        <path d="M12 30c8-6 14-4 16 4M44 30c-8-6-14-4-16 4" {...p} />
        <path d="M28 46v6" {...p} />
      </>
    ),
    almonds: (
      <>
        <path d="M20 12c14 6 18 24 6 40-12-14-16-30-6-40Z" {...p} />
        <path d="M36 18c10 8 10 22 0 32" {...p} />
        <path d="M22 24c-2 8 0 14 4 20" {...p} />
      </>
    ),
    walnuts: (
      <>
        <ellipse cx="28" cy="30" rx="16" ry="18" {...p} />
        <path d="M28 12v36M20 18c6 6 6 18 0 24M36 18c-6 6-6 18 0 24" {...p} />
      </>
    ),
    dry: (
      <>
        <circle cx="20" cy="22" r="8" {...p} />
        <circle cx="36" cy="26" r="9" {...p} />
        <circle cx="26" cy="40" r="8" {...p} />
        <path d="M20 14c0-4 2-6 5-6M36 17c0-4 2-6 5-6" {...p} />
      </>
    ),
    kahwa: (
      <>
        <path d="M12 24h28c0 14-6 22-14 22S12 38 12 24Z" {...p} />
        <path d="M40 28c8 0 8 12-2 12" {...p} />
        <path d="M20 8c-4 4 4 6 0 10M30 8c-4 4 4 6 0 10" {...p} />
      </>
    ),
  } as Record<string, React.ReactNode>;
  return (
    <svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" focusable="false">
      {body[kind]}
    </svg>
  );
}

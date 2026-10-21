import { cn } from '@/lib/utils'

/** Decorative storybook pieces: clouds, stars, seeds, and small spot illustrations. */

export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} aria-hidden="true">
      <path
        d="M24 52 C8 52 4 36 16 30 C14 16 32 10 42 20 C48 6 72 4 78 20 C92 12 110 22 104 36 C116 40 112 54 98 52 Z"
        fill="#FFFFFF"
        opacity="0.95"
      />
    </svg>
  )
}

export function Star({
  className,
  fill = '#FFF0B8',
  stroke = '#E9C45C',
}: {
  className?: string
  fill?: string
  stroke?: string
}) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <path
        d="M20 3 L25 14 L37 15 L28 23 L31 35 L20 29 L9 35 L12 23 L3 15 L15 14 Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SeedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        d="M16 4 C24 8 26 20 16 28 C6 20 8 8 16 4 Z"
        fill="#F2B66D"
        stroke="#51465F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M16 9 C19 13 19 19 16 23" fill="none" stroke="#FFF0B8" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M16 4 C18 1 22 1 24 2 C22 4 19 5 16 4 Z" fill="#7BCB9E" stroke="#51465F" strokeWidth="2" />
    </svg>
  )
}

/** Floating clouds and twinkling stars for hero areas. */
export function SkyDecor({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <Cloud className="animate-drift absolute top-[6%] -left-6 w-36 opacity-90" />
      <Cloud className="animate-drift absolute top-[18%] right-[-1.5rem] w-44 [animation-delay:-4s]" />
      <Cloud className="animate-drift absolute bottom-[22%] left-[8%] w-28 opacity-80 [animation-delay:-2s]" />
      <Star className="animate-twinkle absolute top-[12%] left-[38%] w-6" />
      <Star className="animate-twinkle absolute top-[30%] left-[12%] w-5 [animation-delay:-1s]" fill="#F8C8DC" stroke="#E592B6" />
      <Star className="animate-twinkle absolute top-[8%] right-[22%] w-7 [animation-delay:-1.6s]" fill="#DCD1FF" stroke="#A991EA" />
      <Star className="animate-twinkle absolute bottom-[30%] right-[10%] w-6 [animation-delay:-0.6s]" />
    </div>
  )
}

/* ---------- spot illustrations for the four home cards ---------- */

export function BlocksArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <g stroke="#51465F" strokeWidth="3.5" strokeLinejoin="round">
        <rect x="14" y="48" width="42" height="42" rx="8" fill="#CDEBFF" />
        <rect x="62" y="48" width="42" height="42" rx="8" fill="#F8C8DC" />
        <rect x="38" y="6" width="42" height="42" rx="8" fill="#FFF0B8" transform="rotate(-6 59 27)" />
      </g>
      <g fill="#51465F" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="26" textAnchor="middle">
        <text x="35" y="78">A</text>
        <text x="83" y="78">2</text>
        <text x="59" y="36" transform="rotate(-6 59 27)">b</text>
      </g>
    </svg>
  )
}

export function CrayonArt({ className }: { className?: string }) {
  const crayons = [
    { x: 22, c: '#F8C8DC', r: -14 },
    { x: 50, c: '#DCD1FF', r: -4 },
    { x: 78, c: '#C9F2DE', r: 8 },
  ]
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <path d="M10 88 C30 74 50 92 70 80 C86 72 100 84 112 78" fill="none" stroke="#8C69D9" strokeWidth="5" strokeLinecap="round" />
      {crayons.map(({ x, c, r }) => (
        <g key={x} transform={`rotate(${r} ${x + 9} 50)`} stroke="#51465F" strokeWidth="3.5" strokeLinejoin="round">
          <path d={`M${x} 28 L${x + 9} 8 L${x + 18} 28 Z`} fill={c} />
          <rect x={x} y="28" width="18" height="44" rx="3" fill={c} />
          <rect x={x} y="40" width="18" height="10" fill="#FFFFFF" />
        </g>
      ))}
    </svg>
  )
}

export function FlowerArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <path d="M6 92 Q60 72 114 92 Z" fill="#C9F2DE" stroke="#51465F" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M60 86 C60 70 60 56 60 44" stroke="#51465F" strokeWidth="4" fill="none" />
      <path d="M60 70 C48 60 38 66 38 66 C44 76 56 74 60 70 Z" fill="#9BDDB8" stroke="#51465F" strokeWidth="3" />
      <g transform="translate(60 34)" stroke="#51465F" strokeWidth="3">
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <ellipse key={r} cx="0" cy="-14" rx="9" ry="13" fill="#F8C8DC" transform={`rotate(${r})`} />
        ))}
        <circle r="9" fill="#FFF0B8" />
      </g>
      <g transform="translate(96 66) scale(0.55)" stroke="#51465F" strokeWidth="4">
        {[0, 72, 144, 216, 288].map((r) => (
          <ellipse key={r} cx="0" cy="-12" rx="8" ry="11" fill="#DCD1FF" transform={`rotate(${r})`} />
        ))}
        <circle r="7" fill="#FFF0B8" />
      </g>
      <g transform="translate(24 70) scale(0.5)" stroke="#51465F" strokeWidth="4">
        <path d="M-14 0 C-14 -18 14 -18 14 0 Z" fill="#F8C8DC" />
        <rect x="-6" y="0" width="12" height="14" rx="4" fill="#FFF9F0" />
        <circle cx="-5" cy="-7" r="3" fill="#FFFFFF" />
      </g>
    </svg>
  )
}

export function GrownUpsArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
      <g stroke="#51465F" strokeWidth="3.5" strokeLinejoin="round">
        <path d="M60 10 L96 22 L96 50 C96 72 78 86 60 92 C42 86 24 72 24 50 L24 22 Z" fill="#DCD1FF" />
        <path d="M60 36 C52 26 38 32 42 44 C45 52 60 62 60 62 C60 62 75 52 78 44 C82 32 68 26 60 36 Z" fill="#F8C8DC" />
      </g>
      <path
        d="M98 6 L101 13 L109 14 L103 19 L105 27 L98 23 L91 27 L93 19 L87 14 L95 13 Z"
        fill="#FFF0B8"
        stroke="#E9C45C"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

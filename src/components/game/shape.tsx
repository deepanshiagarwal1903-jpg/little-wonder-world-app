import type { ShapeName } from '@/data/games'

const PATHS: Record<ShapeName, React.ReactNode> = {
  circle: <circle cx="50" cy="50" r="38" />,
  square: <rect x="14" y="14" width="72" height="72" rx="6" />,
  triangle: <path d="M50 12 L90 86 L10 86 Z" />,
  star: <path d="M50 8 L61 36 L91 38 L68 57 L76 88 L50 71 L24 88 L32 57 L9 38 L39 36 Z" />,
  heart: <path d="M50 86 C20 64 8 46 14 30 C20 14 42 12 50 28 C58 12 80 14 86 30 C92 46 80 64 50 86 Z" />,
  rectangle: <rect x="6" y="26" width="88" height="48" rx="6" />,
  oval: <ellipse cx="50" cy="50" rx="42" ry="28" />,
  diamond: <path d="M50 6 L86 50 L50 94 L14 50 Z" />,
  pentagon: <path d="M50 8 L90 38 L75 88 L25 88 L10 38 Z" />,
  hexagon: <path d="M28 12 L72 12 L94 50 L72 88 L28 88 L6 50 Z" />,
}

const FILLS: Record<ShapeName, string> = {
  circle: '#F8C8DC',
  square: '#CDEBFF',
  triangle: '#FFF0B8',
  star: '#FFE07A',
  heart: '#F4A7C6',
  rectangle: '#C9F2DE',
  oval: '#DCD1FF',
  diamond: '#BFE3FF',
  pentagon: '#FFD8B0',
  hexagon: '#B9EBCF',
}

export function Shape({ shape, className }: { shape: ShapeName; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill={FILLS[shape]} stroke="#51465F" strokeWidth="5" strokeLinejoin="round">
        {PATHS[shape]}
      </g>
    </svg>
  )
}

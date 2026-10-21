import { cn } from '@/lib/utils'

type LumiMood = 'happy' | 'cheer' | 'thinking'

/**
 * Lumi — Little Wonder World's original bunny mascot.
 * Hand-built SVG so it stays crisp at every size and works offline.
 */
export function Lumi({
  mood = 'happy',
  className,
  title = 'Lumi the bunny',
}: {
  mood?: LumiMood
  className?: string
  title?: string
}) {
  const armsUp = mood === 'cheer'
  return (
    <svg
      viewBox="0 0 200 230"
      className={cn('select-none', className)}
      role="img"
      aria-label={title}
    >
      {/* ground shadow */}
      <ellipse cx="100" cy="220" rx="52" ry="8" fill="#51465F" opacity="0.08" />

      {/* ears */}
      <g className="lumi-ear">
        <path
          d="M70 92 C52 60 50 18 66 10 C84 2 92 46 90 88 Z"
          fill="#FFFFFF"
          stroke="#51465F"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M72 82 C62 58 62 28 69 22 C78 18 82 50 82 80 Z" fill="#F8C8DC" />
      </g>
      <g>
        <path
          d="M112 88 C112 46 124 4 142 12 C158 20 148 62 130 94 Z"
          fill="#FFFFFF"
          stroke="#51465F"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path d="M120 82 C122 52 130 26 139 24 C146 28 140 56 128 84 Z" fill="#F8C8DC" />
        {/* flower on ear */}
        <g transform="translate(140 34)">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse
              key={r}
              cx="0"
              cy="-8"
              rx="6"
              ry="8"
              fill="#FFF0B8"
              stroke="#51465F"
              strokeWidth="2.5"
              transform={`rotate(${r})`}
            />
          ))}
          <circle r="5" fill="#8C69D9" stroke="#51465F" strokeWidth="2.5" />
        </g>
      </g>

      {/* body */}
      <path
        d="M58 160 C52 196 70 214 100 214 C130 214 148 196 142 160 C138 140 62 140 58 160 Z"
        fill="#FFFFFF"
        stroke="#51465F"
        strokeWidth="4"
      />
      <ellipse cx="100" cy="186" rx="24" ry="20" fill="#FFF9F0" />

      {/* arms */}
      {armsUp ? (
        <>
          <path
            d="M64 160 C48 146 40 128 44 118"
            fill="none"
            stroke="#51465F"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M64 160 C48 146 40 128 44 118"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M136 160 C152 146 160 128 156 118"
            fill="none"
            stroke="#51465F"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M136 160 C152 146 160 128 156 118"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <ellipse cx="72" cy="176" rx="11" ry="14" fill="#FFFFFF" stroke="#51465F" strokeWidth="4" />
          <ellipse cx="128" cy="176" rx="11" ry="14" fill="#FFFFFF" stroke="#51465F" strokeWidth="4" />
        </>
      )}

      {/* feet */}
      <ellipse cx="80" cy="212" rx="16" ry="9" fill="#FFFFFF" stroke="#51465F" strokeWidth="4" />
      <ellipse cx="120" cy="212" rx="16" ry="9" fill="#FFFFFF" stroke="#51465F" strokeWidth="4" />

      {/* head */}
      <ellipse cx="100" cy="118" rx="54" ry="46" fill="#FFFFFF" stroke="#51465F" strokeWidth="4" />

      {/* eyes */}
      {mood === 'cheer' ? (
        <>
          <path d="M70 116 Q78 106 86 116" fill="none" stroke="#51465F" strokeWidth="5" strokeLinecap="round" />
          <path d="M114 116 Q122 106 130 116" fill="none" stroke="#51465F" strokeWidth="5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="78" cy="114" rx="8" ry="10" fill="#51465F" />
          <ellipse cx="122" cy="114" rx="8" ry="10" fill="#51465F" />
          <circle cx="81" cy="110" r="3" fill="#FFFFFF" />
          <circle cx="125" cy="110" r="3" fill="#FFFFFF" />
          <circle cx="75" cy="118" r="1.5" fill="#FFFFFF" />
          <circle cx="119" cy="118" r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* cheeks */}
      <ellipse cx="66" cy="132" rx="10" ry="6" fill="#F8C8DC" />
      <ellipse cx="134" cy="132" rx="10" ry="6" fill="#F8C8DC" />

      {/* nose + mouth */}
      <path d="M95 126 Q100 122 105 126 Q100 132 95 126 Z" fill="#E98FB4" stroke="#51465F" strokeWidth="2" />
      {mood === 'thinking' ? (
        <path d="M94 140 Q100 138 106 140" fill="none" stroke="#51465F" strokeWidth="3.5" strokeLinecap="round" />
      ) : (
        <path
          d="M90 134 Q95 142 100 134 Q105 142 110 134"
          fill={mood === 'cheer' ? '#F8C8DC' : 'none'}
          stroke="#51465F"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

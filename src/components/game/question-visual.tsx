import type { Visual } from '@/data/games'
import { Shape } from '@/components/game/shape'

function EmojiGroup({ emoji, count, label }: { emoji: string; count: number; label?: string }) {
  return (
    <div
      className="flex max-w-[16rem] flex-wrap items-center justify-center gap-1.5"
      role="img"
      aria-label={label ?? `${count} ${emoji}`}
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="animate-pop text-4xl sm:text-5xl" style={{ animationDelay: `${i * 60}ms` }}>
          {emoji}
        </span>
      ))}
    </div>
  )
}

/** Renders the "look at this" part of a question. */
export function QuestionVisual({ visual }: { visual: Visual }) {
  switch (visual.type) {
    case 'letter':
      return (
        <div className="font-display text-8xl font-bold tracking-wide text-lw-purple-deep sm:text-9xl">
          {visual.text}
        </div>
      )
    case 'picture':
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="animate-float text-8xl sm:text-9xl" role="img" aria-label={visual.caption ?? 'picture'}>
            {visual.emoji}
          </span>
          {visual.caption && (
            <span className="font-display text-2xl font-semibold capitalize">{visual.caption}</span>
          )}
        </div>
      )
    case 'count':
      return (
        <div className="rounded-[2rem] bg-[repeating-linear-gradient(45deg,#FDE2EC_0_14px,#FFF9F0_14px_28px)] p-5">
          <EmojiGroup emoji={visual.emoji} count={visual.count} label="Things to count" />
        </div>
      )
    case 'sum':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="rounded-3xl bg-lw-blue/70 p-3">
            <EmojiGroup emoji={visual.emoji} count={visual.a} />
          </div>
          <span className="font-display text-5xl font-bold text-lw-purple-deep">{visual.op}</span>
          <div className="rounded-3xl bg-lw-pink/70 p-3">
            {visual.op === '+' ? (
              <EmojiGroup emoji={visual.emoji} count={visual.b} />
            ) : (
              <span className="font-display text-4xl font-bold">{visual.b}</span>
            )}
          </div>
          <span className="sr-only">
            {visual.a} {visual.op === '+' ? 'plus' : 'take away'} {visual.b}
          </span>
        </div>
      )
    case 'pattern':
      return (
        <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Pattern">
          {visual.items.map((e, i) => (
            <span key={i} className="animate-pop rounded-2xl bg-white px-1.5 text-4xl shadow-sm sm:text-5xl" style={{ animationDelay: `${i * 70}ms` }}>
              {e}
            </span>
          ))}
          <span className="grid h-14 w-14 place-items-center rounded-2xl border-4 border-dashed border-lw-purple font-display text-3xl font-bold text-lw-purple-deep sm:h-16 sm:w-16">
            ?
          </span>
        </div>
      )
    case 'compare':
      return (
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="grid min-h-32 place-items-center rounded-3xl bg-lw-mint/80 p-3">
            <EmojiGroup emoji={visual.emoji} count={visual.left} label={`Left side has ${visual.left}`} />
          </div>
          <div className="grid min-h-32 place-items-center rounded-3xl bg-lw-butter/90 p-3">
            <EmojiGroup emoji={visual.emoji} count={visual.right} label={`Right side has ${visual.right}`} />
          </div>
        </div>
      )
    case 'swatch':
      return <div className="h-28 w-28 rounded-full border-4 border-lw-ink" style={{ background: visual.color }} />
    case 'shape':
      return <Shape shape={visual.shape} className="h-32 w-32" />
  }
}

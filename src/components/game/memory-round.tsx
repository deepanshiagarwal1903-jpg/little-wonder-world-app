import { useEffect, useState } from 'react'

import type { MemoryQuestion } from '@/data/games'
import { SpeakButton } from '@/components/game/choice-round'
import { useFeedback } from '@/lib/use-feedback'
import { cn } from '@/lib/utils'

/** Flip-two-cards matching game. No move counter, no timer — just finding pairs. */
export function MemoryRound({ question, onSolved }: { question: MemoryQuestion; onSolved: () => void }) {
  const { play, say } = useFeedback()
  const [open, setOpen] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [busy, setBusy] = useState(false)

  const pairsFound = matched.size / 2
  const totalPairs = question.cards.length / 2

  useEffect(() => {
    if (matched.size === question.cards.length && matched.size > 0) {
      const t = window.setTimeout(onSolved, 900)
      return () => window.clearTimeout(t)
    }
  }, [matched, question.cards.length, onSolved])

  function flip(i: number) {
    if (busy || open.includes(i) || matched.has(i)) return
    play('tap')
    const next = [...open, i]
    setOpen(next)
    if (next.length < 2) return
    const [a, b] = next
    if (question.cards[a] === question.cards[b]) {
      play('correct')
      setMatched((m) => new Set([...m, a, b]))
      setOpen([])
      if (pairsFound + 1 < totalPairs) say('A match!')
    } else {
      setBusy(true)
      window.setTimeout(() => {
        setOpen([])
        setBusy(false)
      }, 900)
    }
  }

  const cols = question.cards.length > 6 ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-3'

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-start gap-3">
        <h2 className="flex-1 font-display text-2xl leading-tight font-semibold sm:text-3xl">{question.prompt}</h2>
        <SpeakButton text={question.prompt} />
      </div>
      <p className="text-center text-lg font-bold text-lw-purple-deep" aria-live="polite">
        {pairsFound === totalPairs ? 'You found them all! 🌟' : `Pairs found: ${pairsFound} of ${totalPairs}`}
      </p>
      <div className={cn('grid gap-3', cols)}>
        {question.cards.map((card, i) => {
          const faceUp = open.includes(i) || matched.has(i)
          return (
            <button
              key={i}
              type="button"
              onClick={() => flip(i)}
              aria-label={faceUp ? card : `Card ${i + 1}, face down`}
              className={cn(
                'lw-press aspect-square rounded-3xl border-4 text-5xl shadow-md transition-colors sm:text-6xl',
                'focus-visible:border-lw-purple focus-visible:outline-none',
                faceUp ? 'border-white bg-white' : 'border-white/70 bg-lw-lavender',
                matched.has(i) && 'animate-pop border-[#7BCB9E] bg-lw-mint',
              )}
            >
              {faceUp ? card : <span className="text-4xl opacity-70">🌷</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

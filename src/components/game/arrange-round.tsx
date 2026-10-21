import { useEffect, useState } from 'react'

import type { ArrangeQuestion } from '@/data/games'
import { SpeakButton } from '@/components/game/choice-round'
import { useFeedback } from '@/lib/use-feedback'
import { cn } from '@/lib/utils'

/** Tap letter tiles in order to spell the word. Wrong tiles wiggle and stay available. */
export function ArrangeRound({ question, onSolved }: { question: ArrangeQuestion; onSolved: () => void }) {
  const { play, say, autoRead } = useFeedback()
  const [used, setUsed] = useState<number[]>([])
  const [wiggle, setWiggle] = useState<number | null>(null)
  const [nudge, setNudge] = useState(false)

  const placed = used.length
  const done = placed === question.word.length

  useEffect(() => {
    if (autoRead) say(question.prompt)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question])

  function tap(i: number) {
    if (done || used.includes(i)) return
    if (question.tiles[i] === question.word[placed]) {
      play('tap')
      const next = [...used, i]
      setUsed(next)
      setNudge(false)
      if (next.length === question.word.length) {
        play('correct')
        say(`${question.word.toLowerCase()}! Well done!`)
        window.setTimeout(onSolved, 1200)
      }
    } else {
      play('tryAgain')
      setWiggle(i)
      setNudge(true)
      window.setTimeout(() => setWiggle(null), 450)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-start gap-3">
        <h2 className="flex-1 font-display text-2xl leading-tight font-semibold sm:text-3xl">{question.prompt}</h2>
        <SpeakButton text={`${question.prompt} ${question.word.split('').join(', ')}`} />
      </div>

      <div className="lw-card flex flex-col items-center gap-5 p-5">
        <span className="animate-float text-8xl" role="img" aria-label={question.word.toLowerCase()}>
          {question.emoji}
        </span>
        <div className="flex gap-2" aria-label={`Spelled so far: ${question.word.slice(0, placed)}`}>
          {question.word.split('').map((letter, i) => (
            <span
              key={i}
              className={cn(
                'grid h-14 w-12 place-items-center rounded-2xl border-4 font-display text-3xl font-bold sm:h-16 sm:w-14',
                i < placed ? 'animate-pop border-[#7BCB9E] bg-lw-mint' : 'border-dashed border-lw-lavender bg-lw-cream',
                i === placed && !done && 'border-lw-purple',
              )}
            >
              {i < placed ? letter : ''}
            </span>
          ))}
        </div>
      </div>

      <p className="min-h-7 text-center text-lg font-bold text-lw-purple-deep" aria-live="polite">
        {done
          ? 'You spelled it! 🎉'
          : nudge
            ? `Almost! Which letter makes the "${question.word[placed]}" sound next?`
            : ''}
      </p>

      <div className="mt-auto flex flex-wrap justify-center gap-3">
        {question.tiles.map((letter, i) => (
          <button
            key={i}
            type="button"
            onClick={() => tap(i)}
            disabled={used.includes(i)}
            aria-label={`Letter ${letter}`}
            className={cn(
              'lw-press grid h-20 w-20 place-items-center rounded-3xl border-4 border-white bg-lw-butter font-display text-4xl font-bold shadow-md',
              'focus-visible:border-lw-purple focus-visible:outline-none disabled:opacity-25',
              wiggle === i && 'animate-wiggle',
            )}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  )
}

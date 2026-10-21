import { useEffect, useState } from 'react'
import { Volume2 } from 'lucide-react'

import type { Choice, ChoiceQuestion } from '@/data/games'
import { QuestionVisual } from '@/components/game/question-visual'
import { Shape } from '@/components/game/shape'
import { useFeedback } from '@/lib/use-feedback'
import { cn } from '@/lib/utils'

function Balloon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 90" className="h-20 w-14 sm:h-24 sm:w-16" aria-hidden="true">
      <path d="M30 62 C30 72 26 78 32 88" fill="none" stroke="#51465F" strokeWidth="2.5" />
      <ellipse cx="30" cy="32" rx="24" ry="29" fill={color} stroke="#51465F" strokeWidth="3.5" />
      <path d="M26 60 L34 60 L30 66 Z" fill={color} stroke="#51465F" strokeWidth="3" strokeLinejoin="round" />
      <ellipse cx="21" cy="21" rx="5" ry="8" fill="#FFFFFF" opacity="0.6" />
    </svg>
  )
}

function ChoiceFace({ choice }: { choice: Choice }) {
  if (choice.shape) return <Shape shape={choice.shape} className="h-20 w-20 sm:h-24 sm:w-24" />
  if (choice.color && !choice.label) return <Balloon color={choice.color} />
  return (
    <span className="flex flex-col items-center gap-1">
      {choice.emoji && <span className="text-5xl sm:text-6xl">{choice.emoji}</span>}
      {choice.color && (
        <span className="h-8 w-8 rounded-full border-[3px] border-lw-ink" style={{ background: choice.color }} />
      )}
      {choice.label && (
        <span className={cn('font-display font-bold', choice.emoji ? 'text-xl' : 'text-4xl sm:text-5xl')}>
          {choice.label}
        </span>
      )}
    </span>
  )
}

export function SpeakButton({ text, className }: { text: string; className?: string }) {
  const { say, soundOn } = useFeedback()
  if (!soundOn) return null
  return (
    <button
      type="button"
      onClick={() => say(text)}
      className={cn(
        'lw-press grid h-14 w-14 shrink-0 place-items-center rounded-full bg-lw-lavender text-lw-purple-deep',
        className,
      )}
      aria-label="Hear Lumi read this"
    >
      <Volume2 className="h-7 w-7" />
    </button>
  )
}

/** One multiple-choice challenge. Wrong taps are gently faded so the child can try again. */
export function ChoiceRound({ question, onSolved }: { question: ChoiceQuestion; onSolved: () => void }) {
  const { play, say, autoRead } = useFeedback()
  const [tried, setTried] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const [wiggle, setWiggle] = useState<string | null>(null)

  useEffect(() => {
    if (autoRead) say(question.prompt)
    // Only read when a new question appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question])

  function choose(choice: Choice) {
    if (solved || tried.includes(choice.id)) return
    if (choice.id === question.answerId) {
      setSolved(true)
      play('correct')
      say(['Yay!', 'You got it!', 'Wonderful!', 'Great job!'][Math.floor(Math.random() * 4)])
      window.setTimeout(onSolved, 1100)
    } else {
      setTried((t) => [...t, choice.id])
      setWiggle(choice.id)
      play('tryAgain')
      window.setTimeout(() => setWiggle(null), 450)
    }
  }

  const cols = question.choices.length === 4 ? 'grid-cols-2' : question.choices.length === 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-start gap-3">
        <h2 className="flex-1 font-display text-2xl leading-tight font-semibold sm:text-3xl">{question.prompt}</h2>
        <SpeakButton text={question.prompt} />
      </div>

      {question.visual && (
        <div className="lw-card flex min-h-40 items-center justify-center p-5">
          <QuestionVisual visual={question.visual} />
        </div>
      )}

      <div className="min-h-7 text-center text-lg font-bold" aria-live="polite">
        {solved ? (
          <span className="text-[#2F8A5F]">Yay! You did it! 🎉</span>
        ) : tried.length > 0 ? (
          <span className="text-lw-purple-deep">
            Almost! Let's try another one. {question.hint && <span className="block text-base font-semibold text-muted-foreground">{question.hint}</span>}
          </span>
        ) : null}
      </div>

      <div className={cn('mt-auto grid gap-3 sm:gap-4', cols)}>
        {question.choices.map((choice) => {
          const isWrong = tried.includes(choice.id)
          const isRight = solved && choice.id === question.answerId
          return (
            <button
              key={choice.id}
              type="button"
              onClick={() => choose(choice)}
              disabled={isWrong || solved}
              aria-label={choice.label && !choice.emoji ? choice.label : choice.spoken}
              className={cn(
                'lw-press lw-card flex min-h-28 items-center justify-center border-4 border-transparent p-3 sm:min-h-32',
                'focus-visible:border-lw-purple focus-visible:outline-none',
                isWrong && 'opacity-40',
                isRight && 'animate-pop border-[#7BCB9E] bg-lw-mint',
                wiggle === choice.id && 'animate-wiggle',
              )}
            >
              <ChoiceFace choice={choice} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

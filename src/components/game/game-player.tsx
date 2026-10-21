import { useCallback, useEffect, useState } from 'react'

import type { GameDef, Question } from '@/data/games'
import type { AgeBand } from '@/lib/progress-store'
import { progress } from '@/lib/progress-store'
import { ArrangeRound } from '@/components/game/arrange-round'
import { Celebration } from '@/components/game/celebration'
import { ChoiceRound } from '@/components/game/choice-round'
import { MemoryRound } from '@/components/game/memory-round'
import { Lumi } from '@/components/lumi'
import { cn } from '@/lib/utils'

/**
 * The shared game engine: builds a round of questions for the child's age
 * band, walks through them one at a time, then records the completion and
 * awards one seed. Every game in `src/data/games.ts` runs through here.
 */
export function GamePlayer({ game, age }: { game: GameDef; age: AgeBand }) {
  const [questions, setQuestions] = useState<Question[] | null>(null)
  const [error, setError] = useState(false)
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [session, setSession] = useState(0)

  // Questions are randomised, so build them in the browser after mount.
  useEffect(() => {
    try {
      setQuestions(game.build(age))
      setError(false)
    } catch {
      setError(true)
    }
    setIndex(0)
    setFinished(false)
  }, [game, age, session])

  const next = useCallback(() => {
    if (!questions) return
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1)
    } else {
      progress.completeActivity({ activityId: game.id, kind: 'game', skill: game.skill })
      setFinished(true)
    }
  }, [questions, index, game])

  if (error) {
    return (
      <div className="lw-card flex flex-col items-center gap-3 p-8 text-center">
        <Lumi mood="thinking" className="h-28 w-28" />
        <p className="text-lg font-bold">Oops! Lumi dropped the game cards.</p>
        <button
          type="button"
          onClick={() => setSession((s) => s + 1)}
          className="lw-press min-h-14 rounded-full bg-primary px-8 text-lg font-extrabold text-primary-foreground"
        >
          Try again
        </button>
      </div>
    )
  }

  if (!questions) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16" role="status">
        <Lumi className="animate-float h-28 w-28" />
        <p className="text-lg font-bold text-muted-foreground">Getting the game ready…</p>
      </div>
    )
  }

  const q = questions[index]

  return (
    <div className="flex flex-1 flex-col gap-4">
      {questions.length > 1 && (
        <ol className="flex justify-center gap-2" aria-label={`Step ${index + 1} of ${questions.length}`}>
          {questions.map((_, i) => (
            <li
              key={i}
              className={cn(
                'h-3.5 rounded-full transition-all',
                i < index ? 'w-3.5 bg-[#7BCB9E]' : i === index ? 'w-8 bg-lw-purple' : 'w-3.5 bg-lw-lavender',
              )}
            />
          ))}
        </ol>
      )}

      {/* key forces a fresh round state for every question */}
      {q.kind === 'choice' && <ChoiceRound key={`${session}-${index}`} question={q} onSolved={next} />}
      {q.kind === 'memory' && <MemoryRound key={`${session}-${index}`} question={q} onSolved={next} />}
      {q.kind === 'arrange' && <ArrangeRound key={`${session}-${index}`} question={q} onSolved={next} />}

      {finished && (
        <Celebration title={game.title} seedsEarned={1} onPlayAgain={() => setSession((s) => s + 1)} />
      )}
    </div>
  )
}

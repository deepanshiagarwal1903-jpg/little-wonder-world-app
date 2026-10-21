import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Home, RotateCcw, Sprout } from 'lucide-react'

import { Lumi } from '@/components/lumi'
import { SeedIcon, Star } from '@/components/storybook-art'
import { useFeedback } from '@/lib/use-feedback'

const MESSAGES = [
  'You worked so hard!',
  'What a curious mind!',
  'You kept trying — that is how we grow!',
  'Lumi is so proud of you!',
  'Your brain is blooming!',
]

const CONFETTI = ['#F8C8DC', '#DCD1FF', '#C9F2DE', '#CDEBFF', '#FFF0B8', '#8C69D9']

/** Gentle reward screen shown after an activity. No countdowns, no "next level" pressure. */
export function Celebration({
  title,
  seedsEarned,
  message,
  onPlayAgain,
}: {
  title: string
  seedsEarned: number
  message?: string
  onPlayAgain: () => void
}) {
  const { play, say } = useFeedback()
  const text = message ?? MESSAGES[title.length % MESSAGES.length]

  useEffect(() => {
    play('celebrate')
    say(`Hooray! ${text} You earned ${seedsEarned} seed for your garden.`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-lw-ink/30 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 22 }, (_, i) => (
          <span
            key={i}
            className="animate-confetti absolute top-0 h-3 w-2 rounded-sm"
            style={{
              left: `${(i * 37) % 100}%`,
              background: CONFETTI[i % CONFETTI.length],
              animationDelay: `${(i % 7) * 0.18}s`,
            }}
          />
        ))}
      </div>

      <div className="animate-pop lw-card relative w-full max-w-sm overflow-hidden px-6 pt-8 pb-6 text-center">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-lw-butter to-transparent" aria-hidden="true" />
        <div className="relative mx-auto -mb-6 h-28 w-28">
          <Star className="animate-spin-slow absolute inset-0 h-full w-full" />
        </div>
        <Lumi mood="cheer" className="relative mx-auto h-32 w-32" />
        <h2 id="celebration-title" className="relative mt-2 font-display text-3xl font-bold text-lw-purple-deep">
          Hooray!
        </h2>
        <p className="mt-1 text-lg font-bold">{text}</p>
        <p className="mt-1 text-base text-muted-foreground">You finished {title}.</p>

        <div className="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-lw-mint px-5 py-2 text-lg font-extrabold">
          <SeedIcon className="h-7 w-7" />+{seedsEarned} seed for your garden
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="lw-press flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary text-lg font-extrabold text-primary-foreground"
          >
            <RotateCcw className="h-5 w-5" /> Play again
          </button>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/games"
              className="lw-press flex min-h-14 items-center justify-center gap-2 rounded-full bg-lw-lavender font-extrabold"
            >
              <Sprout className="h-5 w-5" /> More games
            </Link>
            <Link
              to="/home"
              className="lw-press flex min-h-14 items-center justify-center gap-2 rounded-full bg-lw-blue font-extrabold"
            >
              <Home className="h-5 w-5" /> Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

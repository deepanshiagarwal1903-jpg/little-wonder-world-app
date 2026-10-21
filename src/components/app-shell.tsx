import { Link } from '@tanstack/react-router'
import { ArrowLeft, Home } from 'lucide-react'

import { SeedIcon } from '@/components/storybook-art'
import { useHydrated, useProgress } from '@/lib/progress-store'
import { cn } from '@/lib/utils'

type NavItem = {
  to: '/home' | '/games' | '/coloring' | '/garden' | '/grown-ups'
  label: string
  emoji: string
  tint: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/home', label: 'Home', emoji: '🏡', tint: 'bg-lw-butter' },
  { to: '/games', label: 'Games', emoji: '🧩', tint: 'bg-lw-pink' },
  { to: '/coloring', label: 'Coloring', emoji: '🖍️', tint: 'bg-lw-blue' },
  { to: '/garden', label: 'Garden', emoji: '🌷', tint: 'bg-lw-mint' },
  { to: '/grown-ups', label: 'Grown-Ups', emoji: '🔒', tint: 'bg-lw-lavender' },
]

export function SeedBadge({ className }: { className?: string }) {
  const { seeds } = useProgress()
  const hydrated = useHydrated()
  return (
    <Link
      to="/garden"
      className={cn(
        'lw-press flex min-h-12 items-center gap-1.5 rounded-full bg-white py-1.5 pr-4 pl-2 text-lg font-extrabold shadow-sm',
        className,
      )}
      aria-label={hydrated ? `${seeds} seeds. Open my garden` : 'Seeds. Open my garden'}
    >
      <SeedIcon className="h-8 w-8" />
      <span className="tabular-nums">{hydrated ? seeds : '–'}</span>
    </Link>
  )
}

function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <ul className="mx-auto grid max-w-2xl grid-cols-5 gap-1 px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="group flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-2xl text-xs font-extrabold text-muted-foreground sm:text-sm"
              activeProps={{ className: 'text-lw-ink' }}
              activeOptions={{ exact: item.to === '/home' }}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'grid h-10 w-12 place-items-center rounded-2xl text-2xl transition-transform',
                      isActive ? `${item.tint} -translate-y-0.5 scale-110` : 'group-hover:-translate-y-0.5',
                    )}
                    aria-hidden="true"
                  >
                    {item.emoji}
                  </span>
                  {item.label}
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** Page frame for the five main destinations: title bar, seed balance, bottom navigation. */
export function AppShell({
  title,
  subtitle,
  children,
  tint = 'from-lw-lavender/60',
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  tint?: string
}) {
  return (
    <div className="min-h-dvh bg-lw-cream">
      <div className={cn('pointer-events-none fixed inset-x-0 top-0 h-56 bg-gradient-to-b to-transparent', tint)} aria-hidden="true" />
      <header className="relative mx-auto flex max-w-2xl items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2 sm:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          {subtitle && <p className="text-base font-bold text-muted-foreground">{subtitle}</p>}
        </div>
        <SeedBadge />
      </header>
      <main className="relative mx-auto max-w-2xl px-4 pt-2 pb-32 sm:px-6">{children}</main>
      <BottomNav />
    </div>
  )
}

/** Frame for full-screen activities: a clear back button, a home button, and no bottom nav. */
export function ActivityShell({
  title,
  backTo,
  backLabel,
  children,
  tint,
}: {
  title: string
  backTo: '/games' | '/home' | '/coloring' | '/garden'
  backLabel: string
  children: React.ReactNode
  tint?: string
}) {
  return (
    <div className="flex min-h-dvh flex-col" style={{ background: `linear-gradient(to bottom, ${tint ?? 'var(--lw-lavender)'}, var(--lw-cream) 40%)` }}>
      <header className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2 sm:px-6">
        <Link
          to={backTo}
          className="lw-press grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white shadow-sm"
          aria-label={backLabel}
        >
          <ArrowLeft className="h-7 w-7" />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center font-display text-2xl font-bold sm:text-3xl">{title}</h1>
        <Link
          to="/home"
          className="lw-press grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white shadow-sm"
          aria-label="Go home"
        >
          <Home className="h-7 w-7" />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
        {children}
      </main>
    </div>
  )
}

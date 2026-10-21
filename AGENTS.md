# AGENTS.md

Little Wonder World is a TanStack Start + React 19 + Tailwind 4 web prototype of a children's learning app. **Read PLAN.md for remaining milestones.**

## Layout
- `src/styles.css`: brand palette (`--lw-*` and `bg-lw-pink` etc.), Fredoka/Nunito fonts (self-hosted through @fontsource), and `.lw-card`, `.lw-press`, and `animate-*` utilities that respect reduced motion.
- `src/lib/progress-store.ts`: local store validated with Zod (`useProgress`, `progress.*`). Safe for server rendering, and a corrupt save falls back to defaults.
- `src/lib/sound.ts`, `use-feedback.ts`: Web Audio sound effects and Web Speech read-aloud, gated by the sound settings.
- `src/data/games.ts`: game definitions. Each `build(age)` returns `Question[]` (choice, memory, or arrange). Add content here, not in the engine.
- `src/components/game/`: shared engine (`GamePlayer`) plus round components and `Celebration`.
- `src/components/app-shell.tsx`: `AppShell` (bottom nav, seed badge) and `ActivityShell` (back and home buttons). The links point to `/home`, `/games`, `/coloring`, `/garden`, and `/grown-ups`, and those route files must exist.
- `src/components/lumi.tsx`, `storybook-art.tsx`: original SVG art.

## Conventions
- Award seeds only through `progress.completeActivity` (exactly 1 seed per completed activity).
- Don't use timers, punishing scores, streaks, or third-party requests in the child experience.
- Keep payments, external links, and account actions behind the parent gate.

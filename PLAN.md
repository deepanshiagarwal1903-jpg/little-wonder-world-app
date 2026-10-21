# Little Wonder World — Plan

Responsive web prototype (TanStack Start + React) of a children's learning app for ages 3–8.

## Milestones

1. **Design system, mascot, navigation** — DONE: pastel palette and fonts, animations, Lumi mascot SVG, storybook art, app shell with bottom nav and activity shell. STILL TO DO: route pages (splash `/`, welcome, `/home`).
2. **Game engine + ten games** — DONE: data and difficulty by age in `src/data/games.ts`, engine in `src/components/game/` (choice, memory, letter puzzle, celebration). STILL TO DO: `/games` menu and `/games/$gameId` routes.
3. **Coloring** — 20 SVG pages with regions that can be filled, gallery, studio (tap-to-fill, undo, reset, save).
4. **Garden** — seed spending (flower 3, decoration 5, tree 8), free starter items, growth indicator, saved on the device.
5. **Grown-Ups' Corner** — parent gate, progress report, settings, privacy info, data deletion.
6. **Testing and accessibility** — tests and accessibility checks, offline support (PWA).
7. **Native and purchases** — Flutter port or wrapper, store in-app purchases behind the parent gate, store listing.

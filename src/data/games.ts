import type { AgeBand } from '@/lib/progress-store'

/**
 * Learning game content. The engine in `src/components/game` renders any
 * `Question` below, so new games or questions are added here as data —
 * no engine changes needed.
 */

export type ShapeName =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'rectangle'
  | 'oval'
  | 'diamond'
  | 'pentagon'
  | 'hexagon'

/** What the child looks at above the answer choices. */
export type Visual =
  | { type: 'letter'; text: string }
  | { type: 'picture'; emoji: string; caption?: string }
  | { type: 'count'; emoji: string; count: number }
  | { type: 'sum'; emoji: string; a: number; b: number; op: '+' | '−' }
  | { type: 'pattern'; items: string[] }
  | { type: 'compare'; emoji: string; left: number; right: number }
  | { type: 'swatch'; color: string }
  | { type: 'shape'; shape: ShapeName }

export type Choice = {
  id: string
  label?: string
  emoji?: string
  color?: string
  shape?: ShapeName
  /** Spoken name for read-aloud and screen readers. */
  spoken: string
}

export type ChoiceQuestion = {
  kind: 'choice'
  prompt: string
  visual?: Visual
  choices: Choice[]
  answerId: string
  /** Gentle hint shown after a wrong try. */
  hint?: string
}

export type MemoryQuestion = {
  kind: 'memory'
  prompt: string
  cards: string[]
}

export type ArrangeQuestion = {
  kind: 'arrange'
  prompt: string
  word: string
  emoji: string
  tiles: string[]
}

export type Question = ChoiceQuestion | MemoryQuestion | ArrangeQuestion

export type GameCategory = 'Letters' | 'Numbers' | 'Colors & Shapes' | 'Thinking' | 'Words'

export type GameDef = {
  id: string
  title: string
  description: string
  category: GameCategory
  skill: string
  icon: string
  tint: string
  build: (age: AgeBand) => Question[]
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const pick = <T,>(items: readonly T[], n: number) => shuffle(items).slice(0, n)
const rand = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1))

/** Choose `n - 1` distractors that differ from the answer by `key`. */
function withDistractors<T>(answer: T, pool: readonly T[], n: number, key: (t: T) => string) {
  const others = shuffle(pool.filter((p) => key(p) !== key(answer)))
  const seen = new Set([key(answer)])
  const picked: T[] = []
  for (const o of others) {
    if (picked.length >= n - 1) break
    if (seen.has(key(o))) continue
    seen.add(key(o))
    picked.push(o)
  }
  return shuffle([answer, ...picked])
}

function numberChoices(answer: number, n: number, min = 0): Choice[] {
  // Near-miss numbers (±1–3) make choices meaningful without being tricky.
  const nearby = [-3, -2, -1, 1, 2, 3].map((d) => answer + d).filter((v) => v >= min)
  const values = [answer, ...shuffle(nearby).slice(0, n - 1)]
  return shuffle(values).map((v) => ({ id: String(v), label: String(v), spoken: String(v) }))
}

/* ------------------------------------------------------------------ */
/* content banks                                                       */
/* ------------------------------------------------------------------ */

export const ALPHABET = [
  { letter: 'A', word: 'apple', emoji: '🍎' },
  { letter: 'B', word: 'bear', emoji: '🐻' },
  { letter: 'C', word: 'cat', emoji: '🐱' },
  { letter: 'D', word: 'dog', emoji: '🐶' },
  { letter: 'E', word: 'elephant', emoji: '🐘' },
  { letter: 'F', word: 'fish', emoji: '🐟' },
  { letter: 'G', word: 'grapes', emoji: '🍇' },
  { letter: 'H', word: 'house', emoji: '🏠' },
  { letter: 'I', word: 'ice cream', emoji: '🍦' },
  { letter: 'K', word: 'kite', emoji: '🪁' },
  { letter: 'L', word: 'lion', emoji: '🦁' },
  { letter: 'M', word: 'moon', emoji: '🌙' },
  { letter: 'O', word: 'owl', emoji: '🦉' },
  { letter: 'P', word: 'pig', emoji: '🐷' },
  { letter: 'R', word: 'rainbow', emoji: '🌈' },
  { letter: 'S', word: 'sun', emoji: '☀️' },
  { letter: 'T', word: 'turtle', emoji: '🐢' },
  { letter: 'U', word: 'umbrella', emoji: '☂️' },
  { letter: 'W', word: 'whale', emoji: '🐳' },
  { letter: 'Z', word: 'zebra', emoji: '🦓' },
] as const

const FRUITS = ['🍎', '🍓', '🍊', '🍐', '🍋', '🍒', '🍇', '🥕', '🧁', '🍪']

export const COLORS = [
  { name: 'red', hex: '#EF5B5B', thing: '🍓', thingName: 'strawberry' },
  { name: 'orange', hex: '#F59E42', thing: '🍊', thingName: 'orange' },
  { name: 'yellow', hex: '#F6D34A', thing: '🍋', thingName: 'lemon' },
  { name: 'green', hex: '#5CC27F', thing: '🐸', thingName: 'frog' },
  { name: 'blue', hex: '#4C9BE0', thing: '🐳', thingName: 'whale' },
  { name: 'purple', hex: '#9C6ADE', thing: '🍇', thingName: 'grapes' },
  { name: 'pink', hex: '#F08DB8', thing: '🌸', thingName: 'blossom' },
  { name: 'brown', hex: '#9A6B4F', thing: '🐻', thingName: 'bear' },
] as const

const SHAPE_FACTS: { shape: ShapeName; clue: string }[] = [
  { shape: 'triangle', clue: 'Which shape has 3 sides?' },
  { shape: 'square', clue: 'Which shape has 4 equal sides?' },
  { shape: 'rectangle', clue: 'Which shape has 2 long sides and 2 short sides?' },
  { shape: 'pentagon', clue: 'Which shape has 5 sides?' },
  { shape: 'hexagon', clue: 'Which shape has 6 sides, like a honeycomb?' },
  { shape: 'circle', clue: 'Which shape is perfectly round with no corners?' },
  { shape: 'oval', clue: 'Which shape looks like a stretched circle, like an egg?' },
  { shape: 'diamond', clue: 'Which shape looks like a kite with 4 corners?' },
]

const YOUNG_SHAPES: ShapeName[] = ['circle', 'square', 'triangle', 'star', 'heart']
const ALL_SHAPES: ShapeName[] = [...YOUNG_SHAPES, 'rectangle', 'oval', 'diamond', 'pentagon', 'hexagon']

const PATTERN_SETS = [
  ['🍓', '🍌', '🫐'],
  ['🐰', '🐻', '🐱'],
  ['⭐', '🌙', '☀️'],
  ['🌸', '🍀', '🌼'],
  ['🔴', '🔵', '🟡'],
  ['🦋', '🐞', '🐝'],
]

export const PUZZLE_WORDS = {
  '3-5': [
    { word: 'CAT', emoji: '🐱' },
    { word: 'DOG', emoji: '🐶' },
    { word: 'SUN', emoji: '☀️' },
    { word: 'BEE', emoji: '🐝' },
    { word: 'PIG', emoji: '🐷' },
    { word: 'COW', emoji: '🐮' },
    { word: 'HAT', emoji: '🎩' },
    { word: 'BUS', emoji: '🚌' },
    { word: 'OWL', emoji: '🦉' },
  ],
  '6-8': [
    { word: 'FROG', emoji: '🐸' },
    { word: 'STAR', emoji: '⭐' },
    { word: 'CAKE', emoji: '🍰' },
    { word: 'FISH', emoji: '🐟' },
    { word: 'MOON', emoji: '🌙' },
    { word: 'TRAIN', emoji: '🚂' },
    { word: 'APPLE', emoji: '🍎' },
    { word: 'HOUSE', emoji: '🏠' },
    { word: 'CLOUD', emoji: '☁️' },
  ],
}

/** Word families for the word builder. Older kids get look-alike distractors. */
const WORD_SETS = [
  { word: 'cat', emoji: '🐱', lookalikes: ['cap', 'car', 'bat'] },
  { word: 'dog', emoji: '🐶', lookalikes: ['dot', 'log', 'dig'] },
  { word: 'sun', emoji: '☀️', lookalikes: ['run', 'sum', 'bun'] },
  { word: 'bed', emoji: '🛏️', lookalikes: ['red', 'bad', 'bee'] },
  { word: 'hat', emoji: '🎩', lookalikes: ['hot', 'mat', 'ham'] },
  { word: 'fish', emoji: '🐟', lookalikes: ['dish', 'fist', 'wish'] },
  { word: 'cake', emoji: '🍰', lookalikes: ['lake', 'cave', 'bake'] },
  { word: 'boat', emoji: '⛵', lookalikes: ['goat', 'coat', 'bolt'] },
  { word: 'tree', emoji: '🌳', lookalikes: ['free', 'three', 'tea'] },
  { word: 'star', emoji: '⭐', lookalikes: ['stay', 'scar', 'car'] },
  { word: 'frog', emoji: '🐸', lookalikes: ['from', 'flag', 'log'] },
  { word: 'moon', emoji: '🌙', lookalikes: ['moose', 'noon', 'mood'] },
]

const MEMORY_PICTURES = ['🐰', '🐻', '🐱', '🦖', '🦄', '🌸', '⭐', '🍄', '🦋', '🐢', '🍓', '🌈']

const COMPARE_THINGS = ['🍎', '🐣', '🎈', '🌼', '🐟', '🍪', '⭐']

/* ------------------------------------------------------------------ */
/* games                                                               */
/* ------------------------------------------------------------------ */

const ROUNDS = 5

export const GAMES: GameDef[] = [
  {
    id: 'alphabet-adventure',
    title: 'Alphabet Adventure',
    description: 'Match letters with the pictures that start with them.',
    category: 'Letters',
    skill: 'Letter sounds',
    icon: '🔤',
    tint: 'var(--lw-pink)',
    build: (age) =>
      pick(ALPHABET, ROUNDS).map((item): ChoiceQuestion => {
        if (age === '3-5') {
          const opts = withDistractors(item, ALPHABET, 3, (a) => a.letter)
          return {
            kind: 'choice',
            prompt: `Which picture starts with ${item.letter}?`,
            visual: { type: 'letter', text: `${item.letter}${item.letter.toLowerCase()}` },
            choices: opts.map((o) => ({ id: o.letter, emoji: o.emoji, spoken: o.word })),
            answerId: item.letter,
            hint: `${item.letter} is for ${item.word}!`,
          }
        }
        const opts = withDistractors(item, ALPHABET, 4, (a) => a.letter)
        return {
          kind: 'choice',
          prompt: `What letter does ${item.word} start with?`,
          visual: { type: 'picture', emoji: item.emoji, caption: item.word },
          choices: opts.map((o) => ({ id: o.letter, label: o.letter.toLowerCase(), spoken: o.letter })),
          answerId: item.letter,
          hint: `Say it slowly: ${item.word}…`,
        }
      }),
  },
  {
    id: 'number-picnic',
    title: 'Number Picnic',
    description: 'Count the yummy fruits and treats on the picnic blanket.',
    category: 'Numbers',
    skill: 'Counting',
    icon: '🧺',
    tint: 'var(--lw-butter)',
    build: (age) =>
      Array.from({ length: ROUNDS }, (): ChoiceQuestion => {
        const count = age === '3-5' ? rand(1, 5) : rand(5, 12)
        const emoji = FRUITS[rand(0, FRUITS.length - 1)]
        return {
          kind: 'choice',
          prompt: 'How many can you count?',
          visual: { type: 'count', emoji, count },
          choices: numberChoices(count, age === '3-5' ? 3 : 4, 1),
          answerId: String(count),
          hint: 'Touch each one as you count. 1, 2, 3…',
        }
      }),
  },
  {
    id: 'color-pop',
    title: 'Color Pop',
    description: 'Find and match bright, happy colors.',
    category: 'Colors & Shapes',
    skill: 'Colors',
    icon: '🎨',
    tint: 'var(--lw-blue)',
    build: (age) =>
      pick(COLORS, ROUNDS).map((c): ChoiceQuestion => {
        if (age === '3-5') {
          const opts = withDistractors(c, COLORS, 3, (o) => o.name)
          return {
            kind: 'choice',
            prompt: `Pop the ${c.name} balloon!`,
            choices: opts.map((o) => ({ id: o.name, color: o.hex, spoken: o.name })),
            answerId: c.name,
            hint: `Look for ${c.name}, like a ${c.thingName}.`,
          }
        }
        const opts = withDistractors(c, COLORS, 4, (o) => o.name)
        return {
          kind: 'choice',
          prompt: `What color is the ${c.thingName}?`,
          visual: { type: 'picture', emoji: c.thing },
          choices: opts.map((o) => ({ id: o.name, label: o.name, color: o.hex, spoken: o.name })),
          answerId: c.name,
        }
      }),
  },
  {
    id: 'shape-safari',
    title: 'Shape Safari',
    description: 'Spot circles, squares, triangles, and more on safari.',
    category: 'Colors & Shapes',
    skill: 'Shapes',
    icon: '🔺',
    tint: 'var(--lw-mint)',
    build: (age) => {
      if (age === '3-5') {
        return pick(YOUNG_SHAPES, ROUNDS).map((shape): ChoiceQuestion => ({
          kind: 'choice',
          prompt: `Can you find the ${shape}?`,
          choices: withDistractors(shape, YOUNG_SHAPES, 3, (s) => s).map((s) => ({
            id: s,
            shape: s,
            spoken: s,
          })),
          answerId: shape,
        }))
      }
      return pick(SHAPE_FACTS, ROUNDS).map(({ shape, clue }): ChoiceQuestion => ({
        kind: 'choice',
        prompt: clue,
        choices: withDistractors(shape, ALL_SHAPES, 4, (s) => s).map((s) => ({
          id: s,
          shape: s,
          spoken: s,
        })),
        answerId: shape,
        hint: 'Try counting the corners.',
      }))
    },
  },
  {
    id: 'memory-garden',
    title: 'Memory Garden',
    description: 'Flip the garden cards and find the matching pairs.',
    category: 'Thinking',
    skill: 'Memory',
    icon: '🃏',
    tint: 'var(--lw-lavender)',
    build: (age) => {
      const pairs = pick(MEMORY_PICTURES, age === '3-5' ? 3 : 6)
      return [
        {
          kind: 'memory',
          prompt: 'Flip two cards to find a match!',
          cards: shuffle([...pairs, ...pairs]),
        },
      ]
    },
  },
  {
    id: 'pattern-parade',
    title: 'Pattern Parade',
    description: 'What comes next in the parade? Finish the pattern.',
    category: 'Thinking',
    skill: 'Patterns',
    icon: '🎏',
    tint: 'var(--lw-pink)',
    build: (age) =>
      pick(PATTERN_SETS, ROUNDS).map((set): ChoiceQuestion => {
        const templates =
          age === '3-5'
            ? [[0, 1], [0, 0, 1]]
            : [[0, 1, 2], [0, 0, 1], [0, 1, 1], [0, 1, 1, 2]]
        const t = templates[rand(0, templates.length - 1)]
        const shown = age === '3-5' ? t.length * 2 + 1 : t.length * 2 + rand(1, t.length - 1 || 1)
        const seq = Array.from({ length: shown + 1 }, (_, i) => set[t[i % t.length]])
        const answer = seq[seq.length - 1]
        return {
          kind: 'choice',
          prompt: 'What comes next?',
          visual: { type: 'pattern', items: seq.slice(0, -1) },
          choices: shuffle(set).map((e) => ({ id: e, emoji: e, spoken: e })),
          answerId: answer,
          hint: 'Say the pattern out loud and listen for what repeats.',
        }
      }),
  },
  {
    id: 'letter-puzzle',
    title: 'Letter Puzzle',
    description: 'Tap the letters in order to spell the picture word.',
    category: 'Words',
    skill: 'Spelling',
    icon: '🧩',
    tint: 'var(--lw-butter)',
    build: (age) =>
      pick(PUZZLE_WORDS[age], 4).map(
        ({ word, emoji }): ArrangeQuestion => ({
          kind: 'arrange',
          prompt: `Spell ${word.toLowerCase()}!`,
          word,
          emoji,
          tiles: shuffle(word.split('')),
        }),
      ),
  },
  {
    id: 'count-and-compare',
    title: 'Count & Compare',
    description: 'Which basket has more? Which has fewer?',
    category: 'Numbers',
    skill: 'Comparing',
    icon: '⚖️',
    tint: 'var(--lw-blue)',
    build: (age) =>
      Array.from({ length: ROUNDS }, (): ChoiceQuestion => {
        const max = age === '3-5' ? 6 : 10
        const left = rand(1, max)
        let right = rand(1, max)
        const allowEqual = age === '6-8'
        if (!allowEqual) while (right === left) right = rand(1, max)
        else if (Math.random() < 0.25) right = left
        const emoji = COMPARE_THINGS[rand(0, COMPARE_THINGS.length - 1)]
        const askMore = Math.random() < 0.5
        const answerId =
          left === right ? 'equal' : (left > right) === askMore ? 'left' : 'right'
        const choices: Choice[] = [
          { id: 'left', label: 'This side', emoji: '👈', spoken: 'left side' },
          { id: 'right', label: 'This side', emoji: '👉', spoken: 'right side' },
        ]
        if (allowEqual) choices.push({ id: 'equal', label: 'Equal', emoji: '🟰', spoken: 'equal' })
        return {
          kind: 'choice',
          prompt: allowEqual
            ? `Which side has ${askMore ? 'more' : 'fewer'}? Or are they equal?`
            : `Which side has ${askMore ? 'more' : 'fewer'}?`,
          visual: { type: 'compare', emoji, left, right },
          choices,
          answerId,
          hint: 'Count each side, then compare the numbers.',
        }
      }),
  },
  {
    id: 'little-word-builder',
    title: 'Little Word Builder',
    description: 'Match simple words to their pictures.',
    category: 'Words',
    skill: 'Reading',
    icon: '📖',
    tint: 'var(--lw-mint)',
    build: (age) =>
      pick(WORD_SETS, ROUNDS).map((set): ChoiceQuestion => {
        const distractors =
          age === '3-5'
            ? withDistractors(set, WORD_SETS, 3, (w) => w.word.charAt(0)).filter((w) => w !== set).map((w) => w.word)
            : pick(set.lookalikes, 3)
        const words = shuffle([set.word, ...distractors])
        return {
          kind: 'choice',
          prompt: 'Which word matches the picture?',
          visual: { type: 'picture', emoji: set.emoji },
          choices: words.map((w) => ({ id: w, label: w, spoken: w })),
          answerId: set.word,
          hint: `Listen to the first sound: ${set.word.charAt(0)}…`,
        }
      }),
  },
  {
    id: 'tiny-math-quest',
    title: 'Tiny Math Quest',
    description: 'Gentle adding and taking-away adventures.',
    category: 'Numbers',
    skill: 'Addition & subtraction',
    icon: '➕',
    tint: 'var(--lw-lavender)',
    build: (age) =>
      Array.from({ length: ROUNDS }, (): ChoiceQuestion => {
        const emoji = ['🐞', '🍓', '🐟', '⭐', '🌼'][rand(0, 4)]
        if (age === '3-5') {
          const a = rand(1, 3)
          const b = rand(1, 2)
          return {
            kind: 'choice',
            prompt: `${a} plus ${b} makes…?`,
            visual: { type: 'sum', emoji, a, b, op: '+' },
            choices: numberChoices(a + b, 3, 1),
            answerId: String(a + b),
            hint: 'Count all of them together.',
          }
        }
        const subtract = Math.random() < 0.5
        const a = subtract ? rand(6, 15) : rand(2, 10)
        const b = subtract ? rand(1, a - 1) : rand(1, 10)
        const answer = subtract ? a - b : a + b
        return {
          kind: 'choice',
          prompt: `What is ${a} ${subtract ? 'take away' : 'plus'} ${b}?`,
          visual: { type: 'sum', emoji, a, b, op: subtract ? '−' : '+' },
          choices: numberChoices(answer, 4, 0),
          answerId: String(answer),
          hint: subtract ? 'Start at the big number and count back.' : 'Start at the big number and count on.',
        }
      }),
  },
]

export const GAME_CATEGORIES: GameCategory[] = ['Letters', 'Numbers', 'Colors & Shapes', 'Thinking', 'Words']

export function getGame(id: string) {
  return GAMES.find((g) => g.id === id)
}

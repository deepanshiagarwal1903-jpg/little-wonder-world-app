import { useSyncExternalStore } from 'react'
import { z } from 'zod'

/**
 * On-device progress store. Everything a child earns lives in localStorage
 * on this device only — nothing is sent to a server. Saved data is validated
 * on load; anything missing or malformed falls back to safe defaults so a
 * corrupted save never crashes the app or wipes valid fields.
 */

const STORAGE_KEY = 'lww:progress:v1'

export type AgeBand = '3-5' | '6-8'

const completionSchema = z.object({
  activityId: z.string(),
  kind: z.enum(['game', 'coloring']),
  skill: z.string(),
  at: z.number(),
})

export type Completion = z.infer<typeof completionSchema>

const stateSchema = z.object({
  version: z.literal(1).catch(1),
  ageBand: z.enum(['3-5', '6-8']).nullable().catch(null),
  seeds: z.number().int().min(0).catch(0),
  soundOn: z.boolean().catch(true),
  readAloud: z.boolean().catch(false),
  completions: z.array(completionSchema).catch([]),
})

export type ProgressState = z.infer<typeof stateSchema>

export const DEFAULT_STATE: ProgressState = {
  version: 1,
  ageBand: null,
  seeds: 0,
  soundOn: true,
  readAloud: false,
  completions: [],
}

// Keep the history bounded so storage can't grow forever.
const MAX_COMPLETIONS = 500

let state: ProgressState = DEFAULT_STATE
let loaded = false
const listeners = new Set<() => void>()

function parse(raw: string | null): ProgressState {
  if (!raw) return DEFAULT_STATE
  try {
    const result = stateSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : DEFAULT_STATE
  } catch {
    return DEFAULT_STATE
  }
}

function load() {
  if (loaded || typeof window === 'undefined') return
  loaded = true
  try {
    state = parse(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    state = DEFAULT_STATE
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private mode or full storage: progress still works for this session.
  }
}

function setState(update: (prev: ProgressState) => ProgressState) {
  load()
  state = update(state)
  persist()
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = parse(e.newValue)
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

function getSnapshot() {
  load()
  return state
}

const getServerSnapshot = () => DEFAULT_STATE

/** Subscribe to progress. Renders defaults on the server, then the saved state. */
export function useProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** True once the browser has read saved progress (false during SSR/hydration). */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

export const progress = {
  setAgeBand(ageBand: AgeBand) {
    setState((s) => ({ ...s, ageBand }))
  },
  setSoundOn(soundOn: boolean) {
    setState((s) => ({ ...s, soundOn }))
  },
  setReadAloud(readAloud: boolean) {
    setState((s) => ({ ...s, readAloud }))
  },
  /** Records a finished activity and awards exactly one seed. */
  completeActivity(entry: Omit<Completion, 'at'>) {
    setState((s) => ({
      ...s,
      seeds: s.seeds + 1,
      completions: [{ ...entry, at: Date.now() }, ...s.completions].slice(
        0,
        MAX_COMPLETIONS,
      ),
    }))
  },
  /** Deletes everything stored on this device. */
  resetAll() {
    setState(() => DEFAULT_STATE)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  },
}

import { useProgress } from '@/lib/progress-store'
import { sfx, speak } from '@/lib/sound'

/** Sound effects and Lumi's voice, respecting the grown-up's sound settings. */
export function useFeedback() {
  const { soundOn, readAloud } = useProgress()
  return {
    soundOn,
    autoRead: soundOn && readAloud,
    play: (effect: keyof typeof sfx) => {
      if (soundOn) sfx[effect]()
    },
    say: (text: string) => {
      if (soundOn) speak(text)
    },
  }
}

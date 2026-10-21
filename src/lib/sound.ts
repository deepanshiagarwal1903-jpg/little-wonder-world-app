/**
 * Lumi's voice and gentle sound effects. Uses only built-in browser APIs
 * (Web Speech + Web Audio), so no audio is fetched from or sent to any service.
 */

let audioCtx: AudioContext | null = null

function ctx() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!Ctor) return null
    audioCtx = new Ctor()
  }
  return audioCtx
}

function tone(freq: number, start: number, duration: number, volume = 0.12) {
  const ac = ctx()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  const t = ac.currentTime + start
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start(t)
  osc.stop(t + duration + 0.05)
}

export const sfx = {
  tap() {
    tone(660, 0, 0.12, 0.06)
  },
  correct() {
    tone(784, 0, 0.18)
    tone(1047, 0.1, 0.28)
  },
  tryAgain() {
    // Soft, low "hmm" — never a buzzer.
    tone(392, 0, 0.18, 0.07)
    tone(349, 0.12, 0.22, 0.07)
  },
  celebrate() {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3))
  },
}

export function speechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string) {
  if (!speechSupported()) return
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 0.9
  utterance.pitch = 1.25
  const voice = synth
    .getVoices()
    .find((v) => v.lang.startsWith('en') && /female|samantha|karen|zira/i.test(v.name))
  if (voice) utterance.voice = voice
  synth.speak(utterance)
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel()
}

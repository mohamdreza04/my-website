/**
 * Tiny procedural sound effects using the Web Audio API — no audio files needed.
 * Each call creates a short-lived oscillator + gain envelope, then disconnects.
 * Safe no-op if AudioContext isn't available or the browser blocks autoplay
 * (will simply do nothing until a user gesture unlocks it, which is fine since
 * these are only ever called from click handlers anyway).
 */
let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function playClickOn() {
  const audioCtx = getCtx()
  if (!audioCtx) return
  const now = audioCtx.currentTime

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(520, now)
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)

  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(now)
  osc.stop(now + 0.2)
}

export function playClickOff() {
  const audioCtx = getCtx()
  if (!audioCtx) return
  const now = audioCtx.currentTime

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(420, now)
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.1)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.1, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15)

  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start(now)
  osc.stop(now + 0.17)
}
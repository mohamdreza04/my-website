import { useState, useRef } from 'react'
import Confetti from './Confetti'
import { playClickOn, playClickOff } from '../lib/sound'
import { haptic } from '../lib/haptics'

/**
 * A small playful easter-egg: a hanging lightbulb with a pull cord.
 * Click/tap the cord (or the bulb) to toggle the light on/off.
 * Turning it ON triggers a confetti burst + a little "click on" chime.
 * Turning it OFF just dims quietly — no fanfare for turning the lights off.
 */
export default function PullLamp() {
  const [isOn, setIsOn] = useState(false)
  const [pulling, setPulling] = useState(false)
  const [burst, setBurst] = useState(0)
  const timeoutRef = useRef<number | null>(null)

  const handlePull = () => {
    setPulling(true)
    setIsOn((prev) => {
      const next = !prev
      if (next) {
        setBurst((b) => b + 1)
        playClickOn()
        haptic('success')
      } else {
        playClickOff()
        haptic('light')
      }
      return next
    })
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setPulling(false), 300)
  }

  return (
    <div
      className="relative flex flex-col items-center select-none"
      style={{ width: 80, height: 140 }}
    >
      <Confetti trigger={burst} originX={0.5} originY={0.2} />

      {/* warm glow behind everything when on */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 28,
          left: '50%',
          width: 180,
          height: 180,
          transform: 'translateX(-50%)',
          borderRadius: '50%',
          background: isOn
            ? 'radial-gradient(circle, rgba(255,200,120,0.35) 0%, rgba(255,200,120,0.08) 45%, transparent 70%)'
            : 'transparent',
          filter: 'blur(10px)',
          transition: 'background 0.4s ease',
        }}
      />

      {/* ceiling mount + wire */}
      <div style={{ width: 2, height: 14, background: 'rgba(255,255,255,0.15)' }} />

      {/* bulb */}
      <button
        onClick={handlePull}
        aria-label={isOn ? 'Turn off the lamp' : 'Turn on the lamp'}
        className="relative flex items-center justify-center"
        style={{
          width: 34,
          height: 40,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <svg width="34" height="40" viewBox="0 0 34 40" fill="none">
          {/* bulb base */}
          <rect x="13" y="28" width="8" height="6" rx="1" fill={isOn ? '#3a3327' : '#2a2a2a'} />
          <rect x="14" y="34" width="6" height="3" rx="1" fill={isOn ? '#3a3327' : '#2a2a2a'} />
          {/* glass bulb */}
          <circle
            cx="17"
            cy="16"
            r="14"
            fill={isOn ? '#ffd98a' : '#1a1a1a'}
            stroke={isOn ? '#ffe8b8' : 'rgba(255,255,255,0.15)'}
            strokeWidth="1.2"
            style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
          />
          {/* filament glow */}
          {isOn && (
            <circle cx="17" cy="16" r="6" fill="#fff4d6" opacity="0.9" />
          )}
        </svg>
      </button>

      {/* pull cord */}
      <div
        onClick={handlePull}
        role="button"
        aria-label="Pull cord"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePull() }}
        className="cursor-pointer"
        style={{
          width: 1.5,
          height: pulling ? 26 : 20,
          background: 'rgba(255,255,255,0.3)',
          transition: 'height 0.15s ease',
          transformOrigin: 'top center',
        }}
      />
      {/* cord pull bead */}
      <div
        onClick={handlePull}
        className="cursor-pointer"
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.4)',
          marginTop: -1,
        }}
      />

      <p
        className="absolute text-white/20 text-[9px] tracking-widest uppercase whitespace-nowrap"
        style={{ bottom: -18, fontFamily: 'Inter, sans-serif' }}
      >
        Pull
      </p>
    </div>
  )
}
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * A fixed, full-viewport ambient background layer behind all sections.
 * Fully monochrome — no color — built from three elements:
 *  1. A faint abstract "circuit map": thin connecting lines + nodes, like a technical schematic.
 *  2. A mouse-following spotlight that softly lifts whatever is nearby (desktop only).
 *  3. Very light film grain to avoid flat, dead black.
 */
export default function AmbientBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(driftRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const el = spotlightRef.current
    if (!el) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(255,255,255,0.05), transparent 70%)`
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-background">

      {/* mouse-following spotlight, desktop only */}
      <div ref={spotlightRef} className="absolute inset-0 hidden md:block transition-opacity duration-500" />

      {/* abstract circuit / schematic map — monochrome lines + nodes */}
      <div
        ref={driftRef}
        className="absolute inset-0"
        style={{ opacity: 0.5 }}
      >
        <svg
          className="absolute w-full h-[140%] -top-[10%]"
          viewBox="0 0 1000 1400"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
        >
          {/* schematic connecting paths */}
          <path d="M 80 60 L 80 260 L 280 260 L 280 480" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M 280 480 L 480 480 L 480 720" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <path d="M 920 120 L 920 340 L 700 340 L 700 600" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M 700 600 L 520 600 L 520 880" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M 150 700 L 350 700 L 350 980 L 180 980" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          <path d="M 820 760 L 820 1000 L 600 1000" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          <path d="M 60 1100 L 260 1100 L 260 1320" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <path d="M 920 1080 L 700 1080 L 700 1300 L 880 1300" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          <path d="M 480 720 L 480 920 L 600 920" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <path d="M 350 980 L 350 1180 L 480 1180" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

          {/* nodes at intersections */}
          {[
            [80, 60], [80, 260], [280, 260], [280, 480], [480, 480], [480, 720],
            [920, 120], [920, 340], [700, 340], [700, 600], [520, 600], [520, 880],
            [150, 700], [350, 700], [350, 980], [180, 980],
            [820, 760], [820, 1000], [600, 1000],
            [60, 1100], [260, 1100], [260, 1320],
            [920, 1080], [700, 1080], [700, 1300], [880, 1300],
            [600, 920], [480, 1180],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={i % 5 === 0 ? 3 : 1.8} fill="rgba(255,255,255,0.12)" />
          ))}
        </svg>
      </div>

      {/* very light grain to break up flat black */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.05,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%273%27/%3E%3C/filter%3E%3Crect width=%27200%27 height=%27200%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
        }}
      />

      {/* vertical editorial guide lines */}
      <div className="absolute inset-0 max-w-7xl mx-auto hidden lg:block">
        <div className="h-full w-full grid grid-cols-4 px-12">
          <div className="border-l border-white/[0.04]" />
          <div className="border-l border-white/[0.04]" />
          <div className="border-l border-white/[0.04]" />
          <div className="border-l border-r border-white/[0.04]" />
        </div>
      </div>
    </div>
  )
}
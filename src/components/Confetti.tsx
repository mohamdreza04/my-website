import { useEffect, useRef } from 'react'

interface ConfettiProps {
  /** Increment this number from the parent each time you want a new burst. */
  trigger: number
  originX?: number // 0-1, horizontal origin as a fraction of the container width
  originY?: number // 0-1, vertical origin as a fraction of the container height
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  shape: 'rect' | 'circle'
  life: number
}

const COLORS = ['#ffd98a', '#ff9e7d', '#a3e635', '#82aaff', '#ffffff', '#f472b6']

/**
 * Lightweight canvas-based confetti burst, scoped to its parent container
 * (absolute positioned, fills the parent). No external library — just a
 * short-lived particle simulation that cleans itself up automatically.
 */
export default function Confetti({ trigger, originX = 0.5, originY = 0.3 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef(0)
  const isFirstRun = useRef(true)

  useEffect(() => {
    // skip the initial mount — only burst on actual trigger increments
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const parent = canvas.parentElement
    if (!parent) return
    const { width, height } = parent.getBoundingClientRect()
    canvas.width = width
    canvas.height = height

    const ox = width * originX
    const oy = height * originY

    const count = 36
    const particles: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = 2 + Math.random() * 4
      return {
        x: ox,
        y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // slight upward bias
        size: 4 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        life: 1,
      }
    })
    particlesRef.current = particles

    const gravity = 0.12
    const drag = 0.985

    const tick = () => {
      ctx.clearRect(0, 0, width, height)
      let anyAlive = false

      for (const p of particlesRef.current) {
        if (p.life <= 0) continue
        anyAlive = true

        p.vy += gravity
        p.vx *= drag
        p.vy *= drag
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.life -= 0.012

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = Math.max(p.life, 0)
        ctx.fillStyle = p.color
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      if (anyAlive) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, width, height)
      }
    }

    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  )
}
import { useEffect, useRef, useState } from 'react'

/**
 * A distinctive custom cursor with three layers:
 *  1. A small solid dot that tracks the mouse exactly.
 *  2. A rotating dashed ring around it (always spinning slowly) —
 *     gives a "radar / targeting reticle" feel that fits a dev portfolio.
 *  3. On hover over interactive elements, the ring morphs into a small
 *     pill label ("View" + arrow) that follows the cursor — useful AND cool.
 *
 * Desktop only — disabled on touch devices.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringWrapRef = useRef<HTMLDivElement>(null)
  const ringRotateRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [labelText, setLabelText] = useState('View')

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    setEnabled(!isTouch)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let rotation = 0
    let raf = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      }
    }

    const tick = () => {
      ringX += (mouseX - ringX) * 0.16
      ringY += (mouseY - ringY) * 0.16
      rotation += 0.6
      if (ringWrapRef.current) {
        ringWrapRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      }
      if (ringRotateRef.current) {
        ringRotateRef.current.style.transform = `rotate(${rotation}deg)`
      }
      raf = requestAnimationFrame(tick)
    }

    const isInteractive = (el: Element | null): Element | null => {
      if (!el) return null
      return el.closest('a, button, [role="button"], [data-cursor-hover]')
    }

    const onOver = (e: MouseEvent) => {
      const target = isInteractive(e.target as Element)
      setHovering(!!target)
      if (target) {
        const custom = target.getAttribute('data-cursor-text')
        setLabelText(custom || 'View')
      }
    }

    const onDown = () => ringWrapRef.current?.classList.add('cursor-click')
    const onUp = () => ringWrapRef.current?.classList.remove('cursor-click')

    const onLeaveWindow = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringWrapRef.current) ringWrapRef.current.style.opacity = '0'
    }
    const onEnterWindow = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringWrapRef.current) ringWrapRef.current.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)
    document.documentElement.addEventListener('mouseenter', onEnterWindow)
    raf = requestAnimationFrame(tick)

    document.body.classList.add('custom-cursor-active')

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
      document.documentElement.removeEventListener('mouseenter', onEnterWindow)
      cancelAnimationFrame(raf)
      document.body.classList.remove('custom-cursor-active')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      {/* tiny solid dot, tracks exactly */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: '#ffffff',
          pointerEvents: 'none',
          zIndex: 999998,
          opacity: hovering ? 0 : 1,
          transition: 'opacity 0.25s ease',
          willChange: 'transform',
        }}
      />

      {/* trailing wrapper — holds either the dashed ring or the hover label */}
      <div
        ref={ringWrapRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 999997,
          willChange: 'transform',
        }}
      >
        {/* rotating dashed "radar" ring — visible when not hovering */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: 'translate(-50%, -50%)',
            width: 34,
            height: 34,
            opacity: hovering ? 0 : 1,
            transform2: '',
            transition: 'opacity 0.25s ease, width 0.25s ease, height 0.25s ease',
          } as React.CSSProperties}
        >
          <div
            ref={ringRotateRef}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '1.5px dashed rgba(255,255,255,0.55)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* hover label pill — "View" + arrow, replaces the ring on hover */}
        <div
          ref={labelRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            transform: `translate(-50%, -50%) scale(${hovering ? 1 : 0.6})`,
            opacity: hovering ? 1 : 0,
            transition: 'opacity 0.25s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.95)',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: '#050505',
              letterSpacing: '0.02em',
            }}
          >
            {labelText}
          </span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M3 9L9 3M9 3H4M9 3V8" stroke="#050505" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <style>{`
        .custom-cursor-active, .custom-cursor-active * {
          cursor: none !important;
        }
        .cursor-click {
          filter: brightness(0.9);
        }
        @media (pointer: coarse) {
          .custom-cursor-active, .custom-cursor-active * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  )
}
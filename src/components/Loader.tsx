import { useEffect, useRef, useState } from 'react'

interface LoaderProps {
  onComplete: () => void
}

// the "source code" that types itself out, line by line
const CODE_LINES = [
  { indent: 0, text: 'const developer = {' },
  { indent: 1, text: "name: 'Pakpoor'," },
  { indent: 1, text: "role: 'Frontend Developer'," },
  { indent: 1, text: "stack: ['React', 'TypeScript']," },
  { indent: 0, text: '}' },
]

const FULL_TEXT = CODE_LINES.map((l) => '  '.repeat(l.indent) + l.text).join('\n')

export default function Loader({ onComplete }: LoaderProps) {
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState<'typing' | 'compiling' | 'reveal' | 'exiting'>('typing')
  const [hidden, setHidden] = useState(false)
  const cursorRef = useRef<HTMLSpanElement>(null)

  // phase 1: type out the code, char by char
  useEffect(() => {
    if (phase !== 'typing') return
    let i = 0
    const speed = 38 // ms per character — slower, comfortably readable
    const interval = setInterval(() => {
      i++
      setTyped(FULL_TEXT.slice(0, i))
      if (i >= FULL_TEXT.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('compiling'), 450)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [phase])

  // phase 2: brief "compiling" pulse, then reveal the name
  useEffect(() => {
    if (phase !== 'compiling') return
    const t = setTimeout(() => setPhase('reveal'), 900)
    return () => clearTimeout(t)
  }, [phase])

  // phase 3: hold on the revealed name briefly, then exit
  useEffect(() => {
    if (phase !== 'reveal') return
    const t = setTimeout(() => setPhase('exiting'), 1200)
    return () => clearTimeout(t)
  }, [phase])

  // phase 4: fade out and unmount
  useEffect(() => {
    if (phase !== 'exiting') return
    const t = setTimeout(() => {
      setHidden(true)
      onComplete()
    }, 650)
    return () => clearTimeout(t)
  }, [phase, onComplete])

  if (hidden) return null

  const exiting = phase === 'exiting'
  const showCode = phase === 'typing' || phase === 'compiling'
  const showName = phase === 'reveal' || phase === 'exiting'

  // render typed text with syntax-highlight-ish coloring (cheap, string-based)
  const renderHighlighted = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts: { t: string; c: string }[] = []
      const regex = /('.*?'|\[|\]|\{|\}|const|developer|name|role|stack|:|,)/g
      let lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = regex.exec(line))) {
        if (match.index > lastIndex) parts.push({ t: line.slice(lastIndex, match.index), c: '#e5e5e5' })
        const token = match[0]
        let color = '#e5e5e5'
        if (token === 'const') color = '#c792ea'
        else if (/^'.*'$/.test(token)) color = '#a3e635'
        else if (['name', 'role', 'stack'].includes(token)) color = '#82aaff'
        else if (['{', '}', '[', ']'].includes(token)) color = 'rgba(255,255,255,0.4)'
        else if (token === ':' || token === ',') color = 'rgba(255,255,255,0.4)'
        parts.push({ t: token, c: color })
        lastIndex = match.index + token.length
      }
      if (lastIndex < line.length) parts.push({ t: line.slice(lastIndex), c: '#e5e5e5' })
      return (
        <div key={i} style={{ minHeight: '1.6em' }}>
          {parts.map((p, j) => (
            <span key={j} style={{ color: p.c }}>{p.t}</span>
          ))}
        </div>
      )
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        backgroundColor: '#050505',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.04)' : 'scale(1)',
        transition: 'opacity 0.6s ease, transform 0.65s ease',
        pointerEvents: 'none',
        overflow: 'hidden',
        padding: '24px',
      }}
    >
      {/* code typing phase */}
      <div
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: 'clamp(13px, 2.6vw, 18px)',
          lineHeight: 1.6,
          textAlign: 'left',
          opacity: showCode ? 1 : 0,
          transform: showCode ? 'scale(1)' : 'scale(0.97)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          position: showCode ? 'static' : 'absolute',
          whiteSpace: 'pre',
        }}
      >
        {renderHighlighted(typed)}
        {phase === 'typing' && (
          <span
            ref={cursorRef}
            style={{
              display: 'inline-block',
              width: '8px',
              height: '1.1em',
              background: '#ffffff',
              marginLeft: '2px',
              verticalAlign: 'text-bottom',
              animation: 'loader-blink 0.9s steps(1) infinite',
            }}
          />
        )}
        {phase === 'compiling' && (
          <div
            style={{
              marginTop: '12px',
              fontSize: '0.85em',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.15em',
            }}
          >
            <span style={{ animation: 'loader-pulse 0.7s ease-in-out infinite' }}>
              compiling...
            </span>
          </div>
        )}
      </div>

      {/* revealed name phase */}
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: showName ? 1 : 0,
          transform: showName ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
          transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(2rem, 7vw, 3.5rem)',
            letterSpacing: '-0.02em',
          }}
        >
          Pakpoor
        </span>
        <span
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginTop: '10px',
          }}
        >
          Frontend Developer
        </span>
      </div>

      <style>{`
        @keyframes loader-blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes loader-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUp } from 'react-icons/fi'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setVisible(self.scroll() > window.innerHeight * 0.8),
    })
    return () => st.kill()
  }, [])

  const handleClick = () => {
    // works with Lenis since Lenis hijacks native scrollTo as well
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-11 h-11 rounded-full border border-white/15 bg-background/70 backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white hover:border-white/35 transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <FiArrowUp size={17} />
    </button>
  )
}
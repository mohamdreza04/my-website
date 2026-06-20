import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Contact from './sections/Contact'
import ScrollProgress from './components/ScrollProgress'
import AmbientBackground from './components/AmbientBackground'
import { useLang } from './contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)
  const { lang } = useLang()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })
    lenisRef.current = lenis

    // sync Lenis scroll position with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // drive Lenis from GSAP's own ticker instead of a separate rAF loop
    // this prevents the two scroll systems from fighting each other
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // re-measure ScrollTrigger after Lenis + fonts/images settle
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 300)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      window.removeEventListener('load', refresh)
      clearTimeout(t)
    }
  }, [])

  // re-measure when language/direction changes (layout shifts)
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 350)
    return () => clearTimeout(t)
  }, [lang])

  return (
    <div
      className="bg-background text-foreground min-h-screen relative"
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
      style={{ fontFamily: lang === 'fa' ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif' }}
    >
      <AmbientBackground />
      <ScrollProgress />
      <Navbar />
      <div className="relative z-[1]">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </div>
    </div>
  )
}
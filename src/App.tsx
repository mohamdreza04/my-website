import { useEffect, useRef, useState } from 'react'
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
import ScrollToTop from './components/ScrollToTop'
import CustomCursor from './components/CustomCursor'
import Loader from './components/Loader'
import { useLang } from './contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

function isMobileDevice() {
  if (typeof window === 'undefined') return false
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const narrowViewport = window.innerWidth < 768
  return coarsePointer || narrowViewport
}

export default function App() {
  const lenisRef = useRef<Lenis | null>(null)
  const { lang } = useLang()
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // always start at the top on refresh — browsers restore the previous scroll
  // position by default (scroll restoration), which feels broken on a portfolio
  // that's meant to be experienced from the Hero every time.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    setIsMobile(isMobileDevice())
  }, [])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
  }, [loading])

  useEffect(() => {
    const lenis = new Lenis({
      duration: isMobile ? 0.8 : 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: false,
    })
    lenisRef.current = lenis
    lenis.scrollTo(0, { immediate: true })

    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    window.addEventListener('resize', refresh)
    const t = setTimeout(refresh, 300)

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      window.removeEventListener('load', refresh)
      window.removeEventListener('resize', refresh)
      clearTimeout(t)
    }
  }, [isMobile])

  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 350)
    return () => clearTimeout(t)
  }, [lang])

  const handleLoaderComplete = () => {
    setLoading(false)
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }

  return (
    <div
      className="bg-background text-foreground min-h-screen relative"
      dir={lang === 'fa' ? 'rtl' : 'ltr'}
      style={{ fontFamily: lang === 'fa' ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif' }}
    >
      {loading && <Loader onComplete={handleLoaderComplete} />}

      <AmbientBackground />

      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <ScrollToTop />
      <div className="relative z-[1]">
        <Hero ready={!loading} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </div>
    </div>
  )
}
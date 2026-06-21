import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../contexts/LanguageContext'
import profileImg from '../assets/profile.jpg'
import { useTilt } from '../hooks/useTilt'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  /** When this flips to true (loader finished), the entrance timeline plays. */
  ready?: boolean
}

export default function Hero({ ready = true }: HeroProps) {
  const { t, lang } = useLang()
  const isRTL = lang === 'fa'

  const sectionRef = useRef<HTMLElement>(null)
  const outerFrameRef = useRef<HTMLDivElement>(null)
  const tiltRef = useTilt<HTMLDivElement>(7)
  const setPortraitRef = (el: HTMLDivElement | null) => {
    outerFrameRef.current = el
    ;(tiltRef as React.MutableRefObject<HTMLDivElement | null>).current = el
  }
  const photoBoxRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const nameWrapRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const tagRowRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const lineTopRef = useRef<HTMLDivElement>(null)
  const bigTextRef = useRef<HTMLDivElement>(null)
  const scrollLabelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ===== INITIAL STATES (entrance only) =====
      gsap.set(photoBoxRef.current, { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set(imgRef.current, { scale: 1.2 })
      gsap.set(nameRef.current, { yPercent: 100 })
      gsap.set(bigTextRef.current, { opacity: 0 })
      gsap.set(lineTopRef.current, { scaleX: 0 })
      gsap.set(dotRef.current, { scale: 0 })
      gsap.set(roleRef.current, { opacity: 0, y: 16 })
      gsap.set(subtitleRef.current, { opacity: 0, y: 16 })
      gsap.set(tagRowRef.current ? Array.from(tagRowRef.current.children) : [], { opacity: 0, y: 12 })
      gsap.set(scrollLabelRef.current, { opacity: 0 })

      const mm = gsap.matchMedia()

      // scroll-driven parallax setup is shared; only entrance timing differs
      const setupScrollAnimations = () => {
        mm.add('(min-width: 768px)', () => {
          gsap.to(imgRef.current, {
            yPercent: 8, scale: 1.08, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true },
          })
          gsap.to(outerFrameRef.current, {
            yPercent: -5, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 1.2, invalidateOnRefresh: true },
          })
          gsap.to(nameWrapRef.current, {
            yPercent: -120, opacity: 0, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '45% top', scrub: 1, invalidateOnRefresh: true },
          })
          gsap.to([roleRef.current, subtitleRef.current, tagRowRef.current], {
            y: -60, opacity: 0, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '35% top', scrub: 1, invalidateOnRefresh: true },
          })
          gsap.to(bigTextRef.current, {
            yPercent: -15, opacity: 0, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '60% top', scrub: 1.6, invalidateOnRefresh: true },
          })
          gsap.to(scrollLabelRef.current, {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '10% top', scrub: 1, invalidateOnRefresh: true },
          })
        })

        mm.add('(max-width: 767px)', () => {
          gsap.to(scrollLabelRef.current, {
            opacity: 0, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '15% top', scrub: 1 },
          })
        })
      }

      if (!ready) {
        // loader still showing — keep everything in its hidden initial state,
        // don't start the entrance timeline or scroll triggers yet
        return
      }

      // ===== ENTRANCE TIMELINE — plays once the loader has finished =====
      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: setupScrollAnimations, // only attach scroll-driven tweens after entrance settles
      })

      tl.to(photoBoxRef.current, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'power4.out' }, 0)
        .to(imgRef.current, { scale: 1, duration: 2.2, ease: 'power4.out' }, 0)
        .to(lineTopRef.current, { scaleX: 1, duration: 1.4, ease: 'power3.inOut' }, 0.3)
        .to(bigTextRef.current, { opacity: 1, duration: 1.2 }, 0.6)
        .to(nameRef.current, { yPercent: 0, duration: 1.3, ease: 'power4.out' }, 0.7)
        .to(dotRef.current, { scale: 1, duration: 0.6, ease: 'back.out(3)' }, 0.9)
        .to(roleRef.current, { opacity: 1, y: 0, duration: 0.9 }, 1.1)
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.9 }, 1.3)
        .to(tagRowRef.current?.children ?? [], { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 1.5)
        .to(scrollLabelRef.current, { opacity: 1, duration: 1 }, 1.9)

    }, sectionRef)

    return () => ctx.revert()
  }, [ready])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-hidden bg-background md:h-[180vh]"
      id="hero"
    >
      <div className="md:sticky md:top-0 md:h-screen overflow-hidden relative flex flex-col justify-center min-h-[100svh] md:min-h-0">

        {/* big background word — desktop only */}
        <div ref={bigTextRef} className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none select-none z-0">
          <span
            className="text-white whitespace-nowrap"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 'clamp(6rem, 16vw, 16rem)', opacity: 0.035, letterSpacing: '-0.04em' }}
          >
            FRONTEND
          </span>
        </div>

        {/* faint grid texture, desktop only — masked so it fades toward the edges */}
        <div
          className="absolute inset-0 pointer-events-none z-0 hidden md:block"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
          }}
        />

        <div ref={lineTopRef} className="absolute top-0 left-0 right-0 h-px bg-white/10 origin-center z-[3] hidden md:block" />

        <div className="absolute top-8 left-8 z-[5] hidden md:block" style={{ opacity: 0.35 }}>
          <span className="text-white text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>№01 — Portfolio</span>
        </div>
        <div className="absolute top-8 right-8 z-[5] hidden md:block" style={{ opacity: 0.35 }}>
          <span className="text-white text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>2026</span>
        </div>

        <div className="relative z-[4] w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:grid md:grid-cols-2 items-center gap-8 md:gap-8 py-20 md:py-0">

          {/* PORTRAIT — appears first on mobile so it reads top-to-bottom naturally */}
          <div className={`order-1 md:order-none ${isRTL ? 'md:order-1' : 'md:order-2'}`}>
            <div ref={setPortraitRef} className="relative mx-auto" style={{ width: 'min(56vw, 280px)' }}>

              <div
                className="absolute border border-white/10 rounded-sm pointer-events-none hidden sm:block"
                style={{ inset: '-14px', transform: isRTL ? 'translate(10px, 10px)' : 'translate(-10px, 10px)' }}
              />

              <div
                ref={photoBoxRef}
                className="relative overflow-hidden rounded-sm w-full"
                style={{ aspectRatio: '3 / 4', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7)' }}
              >
                <img
                  ref={imgRef}
                  src={profileImg}
                  alt={isRTL ? 'محمدرضا پاکپور' : 'Mohammad Reza Pakpoor'}
                  className="w-full h-full object-cover block"
                  style={{ objectPosition: '50% 22%', filter: 'grayscale(20%) contrast(1.08) brightness(0.98)' }}
                />
                <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)' }} />
                <div className="absolute inset-0 pointer-events-none border border-white/10" />

                <div
                  className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-2 rounded-md"
                  style={{ background: 'rgba(5,5,5,0.45)', backdropFilter: 'blur(8px)' }}
                >
                  <span className="text-white/70 text-[10px] tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Qom, Iran
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* TEXT */}
          <div className={`order-2 md:order-none ${isRTL ? 'md:order-2' : 'md:order-1'} text-center md:text-${isRTL ? 'right' : 'left'} w-full`}>
            <div ref={roleRef} className="flex items-center justify-center md:justify-start gap-2 mb-5 md:mb-6" style={{ opacity: 0 }}>
              <div ref={dotRef} className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <p className="text-white/40 text-[11px] md:text-xs tracking-[0.3em] md:tracking-[0.35em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
                {t('آماده پذیرش همکاری', 'Open to new opportunities')}
              </p>
            </div>

            <div className="overflow-hidden" ref={nameWrapRef}>
              <div ref={nameRef}>
                <h1
                  className="text-white leading-[1.08] mb-5 md:mb-6"
                  style={{
                    fontFamily: isRTL ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif',
                    fontWeight: 200,
                    fontSize: 'clamp(2.4rem, 9vw, 5.5rem)',
                    letterSpacing: isRTL ? '0' : '-0.02em',
                  }}
                >
                  {t('محمدرضا', 'Mohammad Reza')}
                  <br />
                  <span style={{ fontWeight: 700 }}>{t('پاکپور', 'Pakpoor')}</span>
                </h1>
              </div>
            </div>

            <div ref={subtitleRef} style={{ opacity: 0 }}>
              <p
                className="text-white/55 text-[15px] md:text-base max-w-sm mx-auto md:mx-0 mb-7 md:mb-8 px-2 md:px-0"
                style={{ fontFamily: isRTL ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif', fontWeight: 300, letterSpacing: '0.03em', lineHeight: '1.8' }}
              >
                {t('توسعه‌دهنده فرانت‌اند، متخصص در طراحی و پیاده‌سازی رابط‌های کاربری مدرن', 'Frontend Developer specializing in modern, high-performance user interfaces')}
              </p>
            </div>

            <div ref={tagRowRef} className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              {['React', 'TypeScript', 'GSAP'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full border border-white/10 text-white/45 text-[11px] tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 md:h-40 pointer-events-none z-[2]" style={{ background: 'linear-gradient(to top, #050505 0%, transparent 100%)' }} />

        <div ref={scrollLabelRef} className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-3 z-[5]" style={{ opacity: 0 }}>
          <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            {t('اسکرول', 'Scroll')}
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>

      </div>
    </section>
  )
}
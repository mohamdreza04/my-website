import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const skillsFa = [
  { id: '01', name: 'React', level: 'پیشرفته' },
  { id: '02', name: 'TypeScript', level: 'پیشرفته' },
  { id: '03', name: 'Tailwind CSS', level: 'پیشرفته' },
  { id: '04', name: 'JavaScript', level: 'پیشرفته' },
  { id: '05', name: 'GSAP', level: 'متوسط' },
  { id: '06', name: 'Next.js', level: 'متوسط' },
  { id: '07', name: 'Git', level: 'متوسط' },
  { id: '08', name: 'Figma', level: 'آشنا' },
]

const skillsEn = [
  { id: '01', name: 'React', level: 'Advanced' },
  { id: '02', name: 'TypeScript', level: 'Advanced' },
  { id: '03', name: 'Tailwind CSS', level: 'Advanced' },
  { id: '04', name: 'JavaScript', level: 'Advanced' },
  { id: '05', name: 'GSAP', level: 'Intermediate' },
  { id: '06', name: 'Next.js', level: 'Intermediate' },
  { id: '07', name: 'Git', level: 'Intermediate' },
  { id: '08', name: 'Figma', level: 'Familiar' },
]

export default function Skills() {
  const { lang } = useLang()
  const isRTL = lang === 'fa'
  const skills = isRTL ? skillsFa : skillsEn
  const font = isRTL ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif'

  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: labelRef.current, start: 'top 85%' },
      })
      gsap.fromTo(headingRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 80%' },
      })

      rowRefs.current.forEach((row, i) => {
        if (!row) return
        const line = row.querySelector('.row-line') as HTMLElement
        gsap.fromTo(row,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.04,
            scrollTrigger: { trigger: row, start: 'top 90%' },
          }
        )
        if (line) {
          gsap.fromTo(line,
            { scaleX: 0 },
            {
              scaleX: 1, duration: 1, ease: 'power3.out', delay: i * 0.04 + 0.15,
              scrollTrigger: { trigger: row, start: 'top 90%' },
            }
          )
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [lang])

  return (
    <section ref={sectionRef} id="skills" className="py-40" style={{ background: '#080808' }}>
      <div className="max-w-4xl mx-auto px-8">

        <div ref={labelRef} style={{ opacity: 0 }} className="mb-6">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isRTL ? '۰۳ — مهارت‌ها' : '03 — Skills'}
          </p>
        </div>
        <h2
          ref={headingRef}
          className="text-white mb-16"
          style={{ fontFamily: font, fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.2rem)', opacity: 0 }}
        >
          {isRTL ? <>ابزارهایی که <span style={{ fontWeight: 700 }}>باهاشون کار میکنم</span></> : <>Tools I <span style={{ fontWeight: 700 }}>work with</span></>}
        </h2>

        <div>
          {skills.map((skill, i) => (
            <div
              key={skill.id}
              ref={(el) => { rowRefs.current[i] = el }}
              className="group relative py-6 flex items-center justify-between gap-4 cursor-default"
              style={{ opacity: 0 }}
            >
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/8 row-line" style={{ transform: 'scaleX(0)', transformOrigin: isRTL ? 'right' : 'left' }} />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />

              <div className="flex items-center gap-6">
                <span
                  className="text-white/20 group-hover:text-white/40 transition-colors duration-300"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  {skill.id}
                </span>
                <span
                  className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: 'clamp(1.3rem, 2.6vw, 2rem)',
                    transform: isRTL ? undefined : undefined,
                  }}
                >
                  {skill.name}
                </span>
              </div>

              <span
                className="text-white/25 text-sm group-hover:text-white/50 transition-colors duration-300 flex-shrink-0"
                style={{ fontFamily: font }}
              >
                {skill.level}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
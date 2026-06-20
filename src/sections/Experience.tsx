import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiBriefcase, FiBookOpen } from 'react-icons/fi'
import { useLang } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const experienceFa = [
  {
    id: '01',
    year: '۱۴۰۲',
    yearEnd: 'اکنون',
    period: '۱۴۰۲ — اکنون',
    role: 'توسعه‌دهنده فرانت‌اند',
    company: 'هوش گستران واحه',
    desc: 'مشارکت در توسعه و نگهداری رابط‌های کاربری محصولات شرکت با React و TypeScript. همکاری نزدیک با تیم طراحی برای تبدیل طرح‌ها به کامپوننت‌های قابل استفاده مجدد، و بهینه‌سازی عملکرد و تجربه کاربری.',
    tags: ['React', 'TypeScript', 'Team Collaboration'],
    icon: 'work',
    highlights: [
      { label: 'تمرکز فنی', value: 'React / TypeScript' },
      { label: 'نوع همکاری', value: 'تمام‌وقت' },
    ],
  },
  {
    id: '02',
    year: '۱۴۰۱',
    yearEnd: '۱۴۰۲',
    period: '۱۴۰۱ — ۱۴۰۲',
    role: 'یادگیری و پروژه‌های شخصی',
    company: 'مسیر یادگیری مستقل',
    desc: 'تمرکز بر یادگیری عمیق React، اکوسیستم جاوااسکریپت مدرن و اصول طراحی رابط کاربری از طریق ساخت پروژه‌های واقعی و مطالعه مستمر.',
    tags: ['JavaScript', 'React', 'UI/UX Fundamentals'],
    icon: 'learn',
    highlights: [
      { label: 'تمرکز فنی', value: 'JavaScript / React' },
      { label: 'نوع همکاری', value: 'یادگیری مستقل' },
    ],
  },
]

const experienceEn = [
  {
    id: '01',
    year: '2023',
    yearEnd: 'Present',
    period: '2023 — Present',
    role: 'Frontend Developer',
    company: 'Hoosh Gostaran Vaheh',
    desc: 'Contributing to the development and maintenance of product interfaces using React and TypeScript. Working closely with the design team to translate designs into reusable components, while optimizing performance and user experience.',
    tags: ['React', 'TypeScript', 'Team Collaboration'],
    icon: 'work',
    highlights: [
      { label: 'Focus', value: 'React / TypeScript' },
      { label: 'Engagement', value: 'Full-time' },
    ],
  },
  {
    id: '02',
    year: '2022',
    yearEnd: '2023',
    period: '2022 — 2023',
    role: 'Self-Directed Learning & Projects',
    company: 'Independent Study',
    desc: 'Focused on deepening knowledge of React, the modern JavaScript ecosystem, and UI design principles through building real-world projects and continuous study.',
    tags: ['JavaScript', 'React', 'UI/UX Fundamentals'],
    icon: 'learn',
    highlights: [
      { label: 'Focus', value: 'JavaScript / React' },
      { label: 'Engagement', value: 'Self-directed' },
    ],
  },
]

export default function Experience() {
  const { lang } = useLang()
  const isRTL = lang === 'fa'
  const experience = isRTL ? experienceFa : experienceEn
  const font = isRTL ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif'

  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const bigYearRefs = useRef<(HTMLDivElement | null)[]>([])

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

      cardRefs.current.forEach((card) => {
        if (!card) return
        const fill = card.querySelector('.exp-fill')
        const chips = card.querySelectorAll('.exp-chip')

        gsap.fromTo(card,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          }
        )
        if (fill) {
          gsap.fromTo(fill,
            { scaleX: 0 },
            {
              scaleX: 1, duration: 1.3, ease: 'power3.out', delay: 0.2,
              scrollTrigger: { trigger: card, start: 'top 80%' },
            }
          )
        }
        if (chips.length) {
          gsap.fromTo(chips,
            { opacity: 0, y: 10 },
            {
              opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.3,
              scrollTrigger: { trigger: card, start: 'top 80%' },
            }
          )
        }
      })

      // big background year number parallax — drifts slowly behind each card
      bigYearRefs.current.forEach((yr) => {
        if (!yr) return
        gsap.to(yr, {
          yPercent: -25,
          ease: 'none',
          scrollTrigger: {
            trigger: yr,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [lang])

  return (
    <section ref={sectionRef} id="experience" className="py-40 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-8">

        <div ref={labelRef} style={{ opacity: 0 }} className="mb-6">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isRTL ? '۰۵ — سوابق کاری' : '05 — Experience'}
          </p>
        </div>
        <h2
          ref={headingRef}
          className="text-white mb-20"
          style={{ fontFamily: font, fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)', opacity: 0 }}
        >
          {isRTL ? <>مسیر <span style={{ fontWeight: 700 }}>حرفه‌ای</span></> : <>Professional <span style={{ fontWeight: 700 }}>Journey</span></>}
        </h2>

        <div className="space-y-8">
          {experience.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => { cardRefs.current[i] = el }}
              className="group relative rounded-3xl border border-white/8 overflow-hidden transition-colors duration-500 hover:border-white/20"
              style={{
                opacity: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)',
              }}
            >
              {/* giant ghost year number, clipped behind content */}
              <div
                ref={(el) => { bigYearRefs.current[i] = el }}
                className="absolute pointer-events-none select-none"
                style={{
                  top: '-10%',
                  [isRTL ? 'left' : 'right']: '-2%',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(6rem, 14vw, 11rem)',
                  color: 'rgba(255,255,255,0.04)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                {item.year}
              </div>

              <div className="relative z-10 p-8 md:p-12 grid md:grid-cols-[auto_1fr] gap-8 items-start">

                {/* left column: icon + period progress */}
                <div className="flex md:flex-col items-center md:items-start gap-4 md:w-40 flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl border border-white/15 flex items-center justify-center text-white/60 group-hover:text-white group-hover:border-white/30 transition-colors duration-500 flex-shrink-0">
                    {item.icon === 'work' ? <FiBriefcase size={18} /> : <FiBookOpen size={18} />}
                  </div>
                  <div className="flex-1 md:w-full">
                    <p
                      className="text-white/80 text-sm font-medium mb-2"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.period}
                    </p>
                    <div className="h-px w-full bg-white/8 relative overflow-hidden rounded-full">
                      <div
                        className="exp-fill absolute inset-y-0 h-px bg-emerald-400/70 origin-left"
                        style={{ width: '100%', transform: 'scaleX(0)', [isRTL ? 'right' : 'left']: 0 }}
                      />
                    </div>
                  </div>
                </div>

                {/* right column: content */}
                <div>
                  <div className="flex flex-wrap items-baseline gap-3 mb-1">
                    <h3
                      className="text-white"
                      style={{ fontFamily: font, fontWeight: 600, fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)' }}
                    >
                      {item.role}
                    </h3>
                  </div>
                  <p className="text-emerald-400/70 text-sm mb-5" style={{ fontFamily: font }}>
                    {item.company}
                  </p>

                  <p
                    className="text-white/45 leading-relaxed mb-6 max-w-2xl"
                    style={{ fontFamily: font, fontWeight: 300, lineHeight: '1.9' }}
                  >
                    {item.desc}
                  </p>

                  {/* highlight stats row */}
                  <div className="flex flex-wrap gap-6 mb-6">
                    {item.highlights.map((h) => (
                      <div key={h.label} className="exp-chip" style={{ opacity: 0 }}>
                        <p className="text-white/25 text-[10px] tracking-widest uppercase mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {h.label}
                        </p>
                        <p className="text-white/75 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          {h.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="exp-chip px-3 py-1.5 rounded-full border border-white/10 text-white/40 text-xs group-hover:text-white/60 group-hover:border-white/20 transition-colors duration-300"
                        style={{ fontFamily: 'Inter, sans-serif', opacity: 0 }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
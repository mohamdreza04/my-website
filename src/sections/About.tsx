import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const { lang } = useLang()
  const isRTL = lang === 'fa'
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const paraRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  const sentenceFa =
    'سلام، من محمدرضا پاکپور هستم. بیش از دو سال در شرکت هوش گستران واحه روی پروژه‌های فرانت‌اند کار کردم. عاشق ساختن رابط‌های کاربری هستم که هم زیبا باشن، هم سریع، هم قابل دسترس. تخصص اصلی‌ام React و اکوسیستم اطرافشه.'
  const sentenceEn =
    "Hi, I'm Mohammad Reza Pakpoor. I've spent over two years at Hoosh Gostaran Vaheh building frontend products. I love creating interfaces that are beautiful, fast, and accessible. My core expertise is React and its ecosystem."

  const sentence = isRTL ? sentenceFa : sentenceEn
  const words = sentence.split(' ')

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: lineRef.current, start: 'top 80%' } }
      )

      gsap.fromTo(labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, scrollTrigger: { trigger: labelRef.current, start: 'top 85%' } }
      )

      // word-by-word reveal driven by scroll
      const wordSpans = paraRef.current?.querySelectorAll('span.word') ?? []
      gsap.fromTo(wordSpans,
        { opacity: 0.08 },
        {
          opacity: 1,
          stagger: 0.04,
          ease: 'none',
          scrollTrigger: {
            trigger: paraRef.current,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 1,
          },
        }
      )

      gsap.fromTo(statsRef.current?.children ?? [],
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: statsRef.current, start: 'top 85%' }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [lang])

  const font = isRTL ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif'

  const stats = [
    { id: 'years', num: '+2', label: isRTL ? 'سال تجربه' : 'Years Experience' },
    { id: 'projects', num: '10+', label: isRTL ? 'پروژه تحویل‌داده‌شده' : 'Projects Delivered' },
    { id: 'quality', num: '100%', label: isRTL ? 'تعهد به کیفیت' : 'Quality Commitment' },
    { id: 'core', num: 'React', label: isRTL ? 'تخصص اصلی' : 'Core Expertise' },
  ]

  return (
    <section ref={sectionRef} id="about" className="py-40 bg-background">
      <div className="max-w-5xl mx-auto px-8">

        <div ref={lineRef} className="h-px bg-border mb-16 origin-left" style={{ transform: 'scaleX(0)' }} />

        <div ref={labelRef} className="mb-10" style={{ opacity: 0 }}>
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isRTL ? '۰۲ — درباره من' : '02 — About'}
          </p>
        </div>

        <p
          ref={paraRef}
          className="text-white mb-24"
          style={{
            fontFamily: font,
            fontWeight: 300,
            fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)',
            lineHeight: isRTL ? '2.1' : '1.6',
            textAlign: isRTL ? 'right' : 'left',
          }}
        >
          {words.map((word, i) => (
            <span key={i} className="word" style={{ display: 'inline-block', marginInlineEnd: '0.3em' }}>
              {word}
            </span>
          ))}
        </p>

        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="p-6 border border-border rounded-2xl hover:border-white/20 hover:bg-white/[0.02] transition-all duration-500"
              style={{ opacity: 0 }}
            >
              <div className="text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '1.8rem' }}>
                {stat.num}
              </div>
              <div className="text-white/40 text-sm" style={{ fontFamily: font }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUpRight } from 'react-icons/fi'
import { useLang } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const projectsFa = [
  { id: '01', title: 'پنل مدیریت', desc: 'داشبورد ادمین کامل با React و TypeScript', tags: ['React', 'TypeScript', 'Tailwind'], color: '#1a1a2e' },
  { id: '02', title: 'فروشگاه آنلاین', desc: 'اپلیکیشن فروشگاهی با سبد خرید و فیلتر محصولات', tags: ['React', 'Redux', 'API'], color: '#1f1a14' },
  { id: '03', title: 'اپ آب‌وهوا', desc: 'نمایش وضعیت آب‌وهوا با اتصال به API خارجی', tags: ['React', 'JavaScript', 'API'], color: '#0f1f1a' },
  { id: '04', title: 'پورتفولیو شخصی', desc: 'همین سایتی که الان داری میبینی', tags: ['React', 'GSAP', 'Tailwind'], color: '#1a1414' },
]

const projectsEn = [
  { id: '01', title: 'Admin Dashboard', desc: 'A full admin dashboard with React and TypeScript', tags: ['React', 'TypeScript', 'Tailwind'], color: '#1a1a2e' },
  { id: '02', title: 'E-commerce Store', desc: 'A shopping app with cart and product filters', tags: ['React', 'Redux', 'API'], color: '#1f1a14' },
  { id: '03', title: 'Weather App', desc: 'Displays live weather using an external API', tags: ['React', 'JavaScript', 'API'], color: '#0f1f1a' },
  { id: '04', title: 'Personal Portfolio', desc: "The very site you're looking at right now", tags: ['React', 'GSAP', 'Tailwind'], color: '#1a1414' },
]

export default function Projects() {
  const { lang } = useLang()
  const isRTL = lang === 'fa'
  const projects = isRTL ? projectsFa : projectsEn
  const font = isRTL ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif'
  const [hovered, setHovered] = useState<number | null>(null)

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

      rowRefs.current.forEach((row) => {
        if (!row) return
        gsap.fromTo(row,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 92%' },
          }
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [lang])

  return (
    <section ref={sectionRef} id="projects" className="py-40 bg-background relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-8">

        <div ref={labelRef} style={{ opacity: 0 }} className="mb-6">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isRTL ? '۰۴ — نمونه کارها' : '04 — Selected Work'}
          </p>
        </div>
        <h2
          ref={headingRef}
          className="text-white mb-16"
          style={{ fontFamily: font, fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)', opacity: 0 }}
        >
          {isRTL
            ? <>پروژه‌هایی که <span style={{ fontWeight: 700 }}>ساختم</span></>
            : <>Projects I've <span style={{ fontWeight: 700 }}>built</span></>}
        </h2>

        <div>
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => { rowRefs.current[i] = el }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative border-b border-white/8 py-8 md:py-10 cursor-pointer transition-colors duration-300"
              style={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-baseline gap-6 md:gap-10 flex-1 min-w-0">
                  <span
                    className="text-white/20 group-hover:text-white/50 transition-colors duration-300 flex-shrink-0"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}
                  >
                    {project.id}
                  </span>
                  <h3
                    className="text-white/80 group-hover:text-white transition-all duration-300 truncate"
                    style={{
                      fontFamily: font,
                      fontWeight: 500,
                      fontSize: 'clamp(1.4rem, 3.2vw, 2.4rem)',
                    }}
                  >
                    {project.title}
                  </h3>
                </div>

                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full border border-white/10 text-white/30 text-xs group-hover:text-white/50 group-hover:border-white/20 transition-colors duration-300"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/40 group-hover:rotate-45 transition-all duration-500 flex-shrink-0">
                  <FiArrowUpRight size={18} />
                </div>
              </div>

              <p
                className="text-white/35 mt-3 max-w-md hidden md:block"
                style={{ fontFamily: font, fontWeight: 300, fontSize: '0.95rem' }}
              >
                {project.desc}
              </p>

              {/* floating preview chip that follows hover, like an Awwwards gallery */}
              <div
                className="hidden lg:block absolute top-1/2 pointer-events-none rounded-2xl overflow-hidden transition-all duration-500 ease-out"
                style={{
                  right: isRTL ? 'auto' : '-40px',
                  left: isRTL ? '-40px' : 'auto',
                  width: '200px',
                  height: '140px',
                  transform: hovered === i ? 'translateY(-50%) scale(1)' : 'translateY(-50%) scale(0.85)',
                  opacity: hovered === i ? 1 : 0,
                  background: `linear-gradient(135deg, ${project.color} 0%, #050505 100%)`,
                  boxShadow: '0 20px 60px -10px rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className="text-white/20"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '2.5rem' }}
                  >
                    {project.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
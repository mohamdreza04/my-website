import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowUpRight, FiGithub, FiCode } from 'react-icons/fi'
import { useLang } from '../contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const GITHUB_USER = 'https://github.com/mohamdreza04'

const projectsFa = [
  {
    id: '01',
    title: 'اپ یادگیری زبان چینی',
    desc: 'اپلیکیشن تعاملی برای یادگیری واژگان و مکالمات زبان چینی، طراحی‌شده با تمرکز بر سادگی استفاده و تجربه یادگیری تدریجی.',
    tags: ['JavaScript', 'React'],
    accent: '#6366f1',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #0a0a0a 70%)',
    github: 'https://github.com/mohamdreza04/chinese-learn',
  },
  {
    id: '02',
    title: 'سایت آگهی و تبلیغات',
    desc: 'پلتفرم ثبت و مشاهده آگهی با امکان دسته‌بندی محتوا و رابط کاربری ساده برای کاربران.',
    tags: ['JavaScript', 'HTML/CSS'],
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #451a03 0%, #0a0a0a 70%)',
    github: 'https://github.com/mohamdreza04/agahi-salawati',
  },
  {
    id: '03',
    title: 'وب‌سایت پورتفولیو',
    desc: 'همین سایتی که الان داری میبینی؛ طراحی‌شده با React، GSAP و Tailwind با تمرکز بر تجربه کاربری و انیمیشن‌های اسکرولی.',
    tags: ['React', 'GSAP', 'Tailwind'],
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #022c22 0%, #0a0a0a 70%)',
    github: 'https://github.com/mohamdreza04/my-website',
  },
]

const projectsEn = [
  {
    id: '01',
    title: 'Chinese Learning App',
    desc: 'An interactive app for learning Chinese vocabulary and conversation, designed with a focus on ease of use and progressive learning.',
    tags: ['JavaScript', 'React'],
    accent: '#6366f1',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #0a0a0a 70%)',
    github: 'https://github.com/mohamdreza04/chinese-learn',
  },
  {
    id: '02',
    title: 'Classifieds & Listings Platform',
    desc: 'A platform for posting and browsing listings, with content categorization and a simple, user-friendly interface.',
    tags: ['JavaScript', 'HTML/CSS'],
    accent: '#f59e0b',
    gradient: 'linear-gradient(135deg, #451a03 0%, #0a0a0a 70%)',
    github: 'https://github.com/mohamdreza04/agahi-salawati',
  },
  {
    id: '03',
    title: 'Portfolio Website',
    desc: "The very site you're looking at right now; built with React, GSAP, and Tailwind with a focus on user experience and scroll-driven motion.",
    tags: ['React', 'GSAP', 'Tailwind'],
    accent: '#10b981',
    gradient: 'linear-gradient(135deg, #022c22 0%, #0a0a0a 70%)',
    github: 'https://github.com/mohamdreza04/my-website',
  },
]

export default function Projects() {
  const { lang } = useLang()
  const isRTL = lang === 'fa'
  const projects = isRTL ? projectsFa : projectsEn
  const font = isRTL ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif'

  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

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

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: card, start: 'top 90%' },
          }
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [lang])

  return (
    <section ref={sectionRef} id="projects" className="py-40 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-8">

        <div ref={labelRef} style={{ opacity: 0 }} className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isRTL ? '۰۴ — نمونه پروژه‌ها' : '04 — Selected Projects'}
          </p>
          <a
            href={GITHUB_USER}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/40 hover:text-white text-xs transition-colors duration-300"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <FiGithub size={14} />
            {isRTL ? 'مشاهده همه در گیت‌هاب' : 'View all on GitHub'}
            <FiArrowUpRight size={12} />
          </a>
        </div>

        <h2
          ref={headingRef}
          className="text-white mb-16"
          style={{ fontFamily: font, fontWeight: 300, fontSize: 'clamp(2rem, 4vw, 3.5rem)', opacity: 0 }}
        >
          {isRTL
            ? <>نمونه پروژه‌های <span style={{ fontWeight: 700 }}>اجراشده</span></>
            : <>Selected <span style={{ fontWeight: 700 }}>Projects</span></>}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <a
              key={project.id}
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              ref={(el) => { cardRefs.current[i] = el }}
              className="group relative rounded-3xl border border-white/10 overflow-hidden flex flex-col transition-all duration-500 hover:border-white/25 hover:-translate-y-1"
              style={{ opacity: 0, minHeight: '380px' }}
            >
              {/* visual top area with gradient + big code icon */}
              <div
                className="relative h-44 flex items-center justify-center overflow-hidden"
                style={{ background: project.gradient }}
              >
                {/* grid texture */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                {/* ghost id */}
                <span
                  className="absolute top-4 text-white/10 select-none"
                  style={{
                    [isRTL ? 'right' : 'left']: '16px',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 800,
                    fontSize: '3rem',
                  }}
                >
                  {project.id}
                </span>
                {/* center icon */}
                <div
                  className="relative w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: `${project.accent}22`, border: `1px solid ${project.accent}44` }}
                >
                  <FiCode size={26} style={{ color: project.accent }} />
                </div>
                {/* hover arrow badge */}
                <div
                  className="absolute top-4 w-9 h-9 rounded-full flex items-center justify-center text-white/70 bg-black/30 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-45"
                  style={{ [isRTL ? 'left' : 'right']: '16px' }}
                >
                  <FiArrowUpRight size={16} />
                </div>
              </div>

              {/* content */}
              <div className="flex-1 flex flex-col p-6">
                <h3
                  className="text-white mb-3 group-hover:opacity-90 transition-opacity duration-300"
                  style={{ fontFamily: font, fontWeight: 600, fontSize: '1.25rem' }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-white/40 leading-relaxed mb-6 flex-1"
                  style={{ fontFamily: font, fontWeight: 300, fontSize: '0.9rem', lineHeight: '1.8' }}
                >
                  {project.desc}
                </p>

                <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/8">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full border border-white/10 text-white/35 text-[11px]"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-white/25 group-hover:text-white/60 transition-colors duration-300 flex-shrink-0">
                    <FiGithub size={14} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
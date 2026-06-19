import { useEffect, useState } from 'react'
import { useLang } from '../contexts/LanguageContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { lang, setLang, t, isRTL } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: t('درباره', 'About'), href: '#about' },
    { label: t('مهارت‌ها', 'Skills'), href: '#skills' },
    { label: t('پروژه‌ها', 'Projects'), href: '#projects' },
    { label: t('تجربه', 'Experience'), href: '#experience' },
    { label: t('تماس', 'Contact'), href: '#contact' },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(5,5,5,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">

        <a
          href="#"
          className="text-white font-light tracking-[0.2em] text-sm"
          style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.2em' }}
        >
          PAKPOOR
        </a>

        <ul className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-muted hover:text-white text-sm transition-colors duration-300"
                style={{ fontFamily: lang === 'fa' ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif' }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setLang(lang === 'fa' ? 'en' : 'fa')}
          className="text-xs tracking-widest text-muted hover:text-white transition-colors duration-300 border border-border hover:border-white/20 px-4 py-2 rounded-full"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {lang === 'fa' ? 'EN' : 'FA'}
        </button>

      </div>
    </nav>
  )
}
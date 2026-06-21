import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import emailjs from '@emailjs/browser'
import { FiGithub, FiLinkedin, FiArrowUpRight, FiCopy, FiCheck, FiSend } from 'react-icons/fi'
import { useLang } from '../contexts/LanguageContext'
import { haptic } from '../lib/haptics'
import PullLamp from '../components/PullLamp'

gsap.registerPlugin(ScrollTrigger)

const EMAIL = 'mohamadrezapakpoor2005@gmail.com'

// EmailJS credentials
const EMAILJS_SERVICE_ID = 'service_5l1mi4s9'
const EMAILJS_TEMPLATE_ID = 'template_ugspjin'
const EMAILJS_PUBLIC_KEY = 'HHzw1FxlBKmm50Eth'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const { lang } = useLang()
  const isRTL = lang === 'fa'
  const font = isRTL ? 'Vazirmatn, sans-serif' : 'Inter, sans-serif'

  const sectionRef = useRef<HTMLElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [values, setValues] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8,
        scrollTrigger: { trigger: labelRef.current, start: 'top 88%' },
      })

      gsap.fromTo(headingRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
      })

      gsap.fromTo(formRef.current, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
      })

      gsap.fromTo(socialsRef.current?.children ?? [], { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
        scrollTrigger: { trigger: socialsRef.current, start: 'top 90%' },
      })

      gsap.fromTo(footerRef.current, { opacity: 0 }, {
        opacity: 1, duration: 1,
        scrollTrigger: { trigger: footerRef.current, start: 'top 95%' },
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [lang])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      haptic('light')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setStatus('sending')
    haptic('light')

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: EMAILJS_PUBLIC_KEY }
      )
      setStatus('success')
      haptic('success')
      setValues({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (err) {
      console.error(err)
      setStatus('error')
      haptic('medium')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const socials = [
    { icon: FiGithub, label: 'GitHub', href: 'https://github.com/mohamdreza04' },
    { icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  ]

  const inputBase =
    'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/25 outline-none transition-colors duration-300 focus:border-white/30 focus:bg-white/[0.05]'

  return (
    <section ref={sectionRef} id="contact" className="relative pt-20 md:pt-40 pb-12 overflow-hidden">
      <div className="max-w-2xl mx-auto px-8">

        <div ref={labelRef} style={{ opacity: 0 }} className="mb-6 text-center">
          <p className="text-white/30 text-xs tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isRTL ? '۰۶ — تماس' : '06 — Contact'}
          </p>
        </div>

        <div ref={headingRef} style={{ opacity: 0 }} className="text-center mb-12">
          <h2
            className="text-white mb-4"
            style={{ fontFamily: font, fontWeight: 300, fontSize: 'clamp(1.9rem, 4.5vw, 3rem)' }}
          >
            {isRTL ? <>بیایید <span style={{ fontWeight: 700 }}>صحبت کنیم</span></> : <>Let's <span style={{ fontWeight: 700 }}>talk</span></>}
          </h2>
          <p className="text-white/40 text-base" style={{ fontFamily: font, fontWeight: 300 }}>
            {isRTL ? 'برای همکاری یا گفتگو درباره فرصت‌های شغلی پیام بفرستید' : "Send a message about your next opportunity"}
          </p>
        </div>

        {/* contact form */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-4 mb-6 p-6 md:p-8 rounded-3xl border border-white/10"
          style={{ opacity: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)' }}
        >
          <div>
            <label className="block text-white/40 text-xs mb-2" style={{ fontFamily: font }}>
              {isRTL ? 'نام شما' : 'Your Name'}
            </label>
            <input
              type="text"
              name="name"
              required
              value={values.name}
              onChange={handleChange}
              placeholder={isRTL ? 'مثلاً علی محمدی' : 'e.g. John Doe'}
              className={inputBase}
              style={{ fontFamily: font }}
            />
          </div>

          <div>
            <label className="block text-white/40 text-xs mb-2" style={{ fontFamily: font }}>
              {isRTL ? 'ایمیل شما' : 'Your Email'}
            </label>
            <input
              type="email"
              name="email"
              required
              value={values.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputBase}
              style={{ fontFamily: 'Inter, sans-serif', direction: 'ltr', textAlign: isRTL ? 'right' : 'left' }}
            />
          </div>

          <div>
            <label className="block text-white/40 text-xs mb-2" style={{ fontFamily: font }}>
              {isRTL ? 'پیام شما' : 'Your Message'}
            </label>
            <textarea
              name="message"
              required
              rows={5}
              value={values.message}
              onChange={handleChange}
              placeholder={isRTL ? 'پیامتون رو اینجا بنویسید...' : 'Write your message here...'}
              className={`${inputBase} resize-none`}
              style={{ fontFamily: font }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-xl py-3.5 font-medium transition-opacity duration-300 hover:opacity-90 disabled:opacity-50"
            style={{ fontFamily: font }}
          >
            {status === 'sending' ? (
              isRTL ? 'در حال ارسال...' : 'Sending...'
            ) : (
              <>
                {isRTL ? 'ارسال پیام' : 'Send Message'}
                <FiSend size={15} className={isRTL ? 'rotate-180' : ''} />
              </>
            )}
          </button>

          {status === 'success' && (
            <p className="text-emerald-400/90 text-sm text-center" style={{ fontFamily: font }}>
              {isRTL ? 'پیام شما با موفقیت ارسال شد ✓' : 'Your message was sent successfully ✓'}
            </p>
          )}
          {status === 'error' && (
            <p className="text-red-400/90 text-sm text-center" style={{ fontFamily: font }}>
              {isRTL ? 'مشکلی پیش اومد، لطفاً دوباره تلاش کنید یا مستقیم ایمیل بزنید.' : 'Something went wrong — please try again or email directly.'}
            </p>
          )}
        </form>

        {/* direct email fallback */}
        <button
          onClick={handleCopy}
          className="group w-full flex items-center justify-between gap-3 px-5 py-3 rounded-xl border border-white/8 text-white/40 hover:text-white hover:border-white/20 transition-colors duration-300 mb-10"
        >
          <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{EMAIL}</span>
          <span className="flex items-center gap-1.5 text-xs flex-shrink-0">
            {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
            {copied ? (isRTL ? 'کپی شد' : 'Copied') : (isRTL ? 'کپی ایمیل' : 'Copy email')}
          </span>
        </button>

        <div ref={socialsRef} className="flex items-center justify-center gap-4 mb-32">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors duration-300"
              style={{ opacity: 0 }}
            >
              <s.icon size={15} />
              <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{s.label}</span>
              <FiArrowUpRight size={13} className="opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
            </a>
          ))}
        </div>

        <div className="flex justify-center mb-2">
          <PullLamp />
        </div>

        <div ref={footerRef} className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ opacity: 0 }}>
          <p className="text-white/25 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2026 Mohammad Reza Pakpoor
          </p>
          <p className="text-white/25 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            {isRTL ? 'طراحی و توسعه با React' : 'Designed & built with React'}
          </p>
        </div>

      </div>
    </section>
  )
}
import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }

    // ScrollTrigger fires on every Lenis-synced scroll update,
    // which is more accurate than listening to the native scroll event directly.
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: update,
    })

    update()
    return () => st.kill()
  }, [])

  return (
    <div className="fixed top-0 left-0 z-50 h-[1px] w-full bg-border">
      <div
        className="h-full bg-white/40"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
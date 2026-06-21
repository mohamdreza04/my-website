import { useEffect, useRef } from 'react'

/**
 * Mobile-only tilt effect: reads the device's gyroscope/orientation
 * and applies a subtle 3D tilt + parallax shadow to the attached element.
 * On desktop this does nothing (no deviceorientation events fire there
 * in any meaningful way for most laptops, and we gate it to touch devices).
 *
 * Usage: const ref = useTilt<HTMLDivElement>(); <div ref={ref}>...</div>
 */
export function useTilt<T extends HTMLElement>(maxTilt = 8) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (!isTouch || !ref.current) return

    const el = ref.current
    let raf = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const onOrientation = (e: DeviceOrientationEvent) => {
      // gamma: left-right tilt (-90 to 90), beta: front-back tilt (-180 to 180)
      const gamma = e.gamma ?? 0
      const beta = e.beta ?? 0
      targetX = Math.max(-maxTilt, Math.min(maxTilt, gamma / 3))
      targetY = Math.max(-maxTilt, Math.min(maxTilt, (beta - 45) / 4))
    }

    const tick = () => {
      currentX += (targetX - currentX) * 0.08
      currentY += (targetY - currentY) * 0.08
      el.style.transform = `perspective(800px) rotateY(${currentX}deg) rotateX(${-currentY}deg)`
      raf = requestAnimationFrame(tick)
    }

    // iOS 13+ requires an explicit permission request, triggered by a user gesture.
    // We request it on first touch; until granted, the element simply stays static.
    const requestPermission = async () => {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>
      }
      if (typeof DOE.requestPermission === 'function') {
        try {
          const result = await DOE.requestPermission()
          if (result === 'granted') {
            window.addEventListener('deviceorientation', onOrientation)
          }
        } catch {
          // permission denied or unsupported — fail silently, element stays static
        }
      } else {
        // non-iOS or older iOS — no permission gate needed
        window.addEventListener('deviceorientation', onOrientation)
      }
      window.removeEventListener('touchstart', requestPermission)
    }

    window.addEventListener('touchstart', requestPermission, { once: true })
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('deviceorientation', onOrientation)
      window.removeEventListener('touchstart', requestPermission)
      cancelAnimationFrame(raf)
    }
  }, [maxTilt])

  return ref
}
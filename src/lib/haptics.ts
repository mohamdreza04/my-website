/**
 * Tiny helper for haptic feedback (vibration) on supported mobile devices.
 * Safe no-op everywhere else (desktop, unsupported browsers).
 * Uses very short durations — this should feel like a subtle "tick", never buzzy.
 */
export function haptic(pattern: 'light' | 'medium' | 'success' = 'light') {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return
  try {
    switch (pattern) {
      case 'light':
        navigator.vibrate(8)
        break
      case 'medium':
        navigator.vibrate(15)
        break
      case 'success':
        navigator.vibrate([10, 30, 10])
        break
    }
  } catch {
    // some browsers throw if called outside a user gesture — fail silently
  }
}
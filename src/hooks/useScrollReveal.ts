import { useEffect, useRef } from 'react'

type WipeDir = 'up' | 'left' | 'right'

const WIPE_START: Record<WipeDir, string> = {
  up:    'inset(0 0 100% 0)',
  left:  'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
}

export function useScrollReveal<T extends HTMLElement>(wipeDirection?: WipeDir) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const cleanups: Array<() => void> = []

    // ── Clip-path wipe on the section itself ──────────────────────
    if (wipeDirection) {
      container.style.clipPath = WIPE_START[wipeDirection]

      const wipeObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              container.style.transition = 'clip-path 0.95s cubic-bezier(0.77, 0, 0.18, 1)'
              container.style.clipPath   = 'inset(0 0 0 0)'
            })
          })
          wipeObs.disconnect()
        }
      }, { threshold: 0.03 })

      wipeObs.observe(container)
      cleanups.push(() => wipeObs.disconnect())
    }

    // ── Fade/slide reveals on .reveal descendants ─────────────────
    const items = container.querySelectorAll('.reveal')
    if (items.length) {
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              revealObs.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      )
      items.forEach((el) => revealObs.observe(el))
      cleanups.push(() => revealObs.disconnect())
    }

    return () => cleanups.forEach((fn) => fn())
  }, [wipeDirection])

  return ref
}

import { useEffect, useRef } from 'react'

export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const cleanups: Array<() => void> = []
    const hasWipe = Boolean(container.dataset.wipe)

    const triggerWipe = () => {
      if (hasWipe) container.classList.add('wipe-in')
    }

    // ── Early wipe trigger via section bounding-box intersection ──
    if (hasWipe) {
      const wipeObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { triggerWipe(); wipeObs.disconnect() }
      }, { threshold: 0 })
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
              triggerWipe()                          // guaranteed fallback
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
  }, [])

  return ref
}

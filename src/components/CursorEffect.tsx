import { useEffect } from 'react'
import './CursorEffect.css'

const SYMBOLS = ['♥', '✦', '✿', '·', '✨', '❋']

export default function CursorEffect() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let last = 0

    const onMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - last < 85) return
      last = now

      const spark = document.createElement('span')
      spark.className = 'cursor-spark'
      spark.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      spark.style.left = `${e.clientX}px`
      spark.style.top  = `${e.clientY}px`
      spark.style.setProperty('--dx', `${(Math.random() - 0.5) * 44}px`)
      spark.style.setProperty('--dy', `${-(Math.random() * 44 + 18)}px`)
      spark.style.setProperty('--rot', `${(Math.random() - 0.5) * 90}deg`)
      document.body.appendChild(spark)
      spark.addEventListener('animationend', () => spark.remove(), { once: true })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return null
}

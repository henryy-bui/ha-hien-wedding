import { useEffect, useState } from 'react'
import './LoadingScreen.css'

type Phase = 'enter' | 'hold' | 'exit' | 'done'

interface Props {
  onDone: () => void
}

export default function LoadingScreen({ onDone }: Props) {
  const [phase, setPhase] = useState<Phase>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'),  400)
    const t2 = setTimeout(() => setPhase('exit'),  1900)
    const t3 = setTimeout(() => { setPhase('done'); onDone() }, 2900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  if (phase === 'done') return null

  return (
    <div className={`loading-screen phase-${phase}`} aria-hidden="true">
      <div className="loading-content">
        <div className="loading-monogram">
          <span className="loading-name loading-name-left">Van Ha</span>
          <span className="loading-amp">&amp;</span>
          <span className="loading-name loading-name-right">Thanh Hien</span>
        </div>
        <p className="loading-date">31 · 05 · 2026</p>
        <div className="loading-bar-track">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  )
}

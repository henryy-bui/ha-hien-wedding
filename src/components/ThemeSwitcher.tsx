import { useEffect, useRef, useState } from 'react'
import { THEMES, applyTheme, loadTheme, saveTheme, type ThemeId } from '../theme'
import './ThemeSwitcher.css'

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeId>(() => loadTheme())
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
  }, [theme])

  // Close popover on outside click or Escape.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer, { passive: true })
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`theme-switcher${open ? ' is-open' : ''}`} ref={wrapRef}>
      <button
        type="button"
        className="theme-toggle"
        aria-label="Chọn giao diện"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="theme-toggle-pie" aria-hidden="true" />
      </button>

      <div className="theme-pop" role="menu" aria-label="Giao diện">
        <p className="theme-pop-title">Giao Diện</p>
        <ul className="theme-list">
          {THEMES.map((t) => {
            const active = t.id === theme
            return (
              <li key={t.id}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  className={`theme-option${active ? ' is-active' : ''}`}
                  onClick={() => {
                    setTheme(t.id)
                    setOpen(false)
                  }}
                >
                  <span
                    className="theme-option-swatch"
                    aria-hidden="true"
                    style={{
                      background: `conic-gradient(${t.swatch[0]} 0 33%, ${t.swatch[1]} 33% 66%, ${t.swatch[2]} 66% 100%)`,
                    }}
                  />
                  <span className="theme-option-name">{t.name}</span>
                  {active && <span className="theme-option-check" aria-hidden="true">✓</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

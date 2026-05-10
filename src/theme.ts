export type ThemeId = 'ivory' | 'sage' | 'dusk'

export interface Theme {
  id: ThemeId
  /** Vietnamese label shown in the picker */
  name: string
  /** Three swatch colors in [primary, accent, surface] order — used for the swatch UI only */
  swatch: [string, string, string]
}

export const THEMES: readonly Theme[] = [
  { id: 'ivory', name: 'Vàng Kem',  swatch: ['#c9a96e', '#e8a598', '#fbe8d8'] },
  { id: 'sage',  name: 'Xanh Sage', swatch: ['#9caf88', '#d8a7a4', '#ebe5d6'] },
  { id: 'dusk',  name: 'Hoàng Hôn', swatch: ['#b07b5e', '#8e4a5d', '#f3dccb'] },
] as const

export const DEFAULT_THEME: ThemeId = 'ivory'
export const STORAGE_KEY = 'wedding:theme'

const VALID = new Set<ThemeId>(THEMES.map((t) => t.id))

/** Apply a theme to the document — `ivory` clears the attribute (uses :root defaults). */
export function applyTheme(id: ThemeId) {
  if (typeof document === 'undefined') return
  if (id === 'ivory') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', id)
}

/** Read persisted theme; falls back to default on first visit / invalid storage. */
export function loadTheme(): ThemeId {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw && VALID.has(raw as ThemeId)) return raw as ThemeId
  } catch {
    // localStorage may throw in private mode / disabled storage — fall through.
  }
  return DEFAULT_THEME
}

export function saveTheme(id: ThemeId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Persistence is best-effort.
  }
}

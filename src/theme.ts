export type ThemeId = "ivory" | "sage" | "dusk" | "crimson";

export interface Theme {
  id: ThemeId;
  /** Vietnamese label shown in the picker */
  name: string;
  /** Three swatch colors in [primary, accent, surface] order — used for the swatch UI only */
  swatch: [string, string, string];
}

export const THEMES: readonly Theme[] = [
  { id: "ivory", name: "Vàng Kem", swatch: ["#c9a96e", "#e8a598", "#fbe8d8"] },
  { id: "sage", name: "Lá Trầu", swatch: ["#6b8e5a", "#c2807a", "#e3dcc5"] },
  { id: "dusk", name: "Hoa Sen", swatch: ["#d97287", "#d4a85c", "#f7e3df"] },
  { id: "crimson", name: "Hỉ Đỏ", swatch: ["#b8323a", "#d4a64a", "#f5d9c5"] },
] as const;

export const DEFAULT_THEME: ThemeId = "crimson";
export const STORAGE_KEY = "wedding:theme";

const VALID = new Set<ThemeId>(THEMES.map((t) => t.id));

/** Apply a theme to the document — `ivory` clears the attribute (uses :root defaults). */
export function applyTheme(id: ThemeId) {
  if (typeof document === "undefined") return;
  if (id === "ivory") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", id);
}

/** Read persisted theme; falls back to default on first visit / invalid storage. */
export function loadTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && VALID.has(raw as ThemeId)) return raw as ThemeId;
  } catch {
    // localStorage may throw in private mode / disabled storage — fall through.
  }
  return DEFAULT_THEME;
}

export function saveTheme(id: ThemeId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Persistence is best-effort.
  }
}

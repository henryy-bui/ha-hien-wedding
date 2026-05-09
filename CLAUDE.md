# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # Start dev server with HMR
yarn build      # Type-check (tsc -b) then build with Vite
yarn lint       # Run ESLint
yarn preview    # Preview the production build locally
```

## Stack

- **React 19** + **TypeScript 6** + **Vite 8**
- **Yarn 4** (node-modules linker) — use `yarn` not `npm`
- Plain CSS per component (no CSS framework)
- `canvas-confetti` for the RSVP confetti burst
- No test framework configured

## Architecture

Online wedding invitation for Van Ha & Thanh Hien (31/05/2026). Single-page app: `index.html` → `src/main.tsx` → `src/App.tsx`, which composes 7 section components in order.

### Scroll reveal

`src/hooks/useScrollReveal.ts` exports a generic hook that returns a `ref`. Attach it to a section's root element. Any `.reveal` descendant will animate in (fade + slide up) when it enters the viewport via IntersectionObserver. Stagger with `.reveal-delay-1` through `.reveal-delay-6`. Classes and keyframes live in `src/index.css`.

### Components (`src/components/`)

Each component has a co-located `.css` file. CSS custom properties (colors, fonts, spacing tokens) are defined in `src/index.css` and used across all component stylesheets — do not hardcode color hex values in component CSS.

| Component | Key behaviour |
|---|---|
| `Hero` | Parallax bg via scroll listener, 12 bokeh particles (inline `style` for per-particle timing), live countdown timer via `setInterval` |
| `OurStory` | Timeline alternates left/right (`.tl-left` / `.tl-right`) on desktop, collapses to single column on mobile |
| `WeddingDetails` | 3-column card grid, responsive to 1-column below 900 px |
| `HumorSection` | 6-card grid (3→2→1 col) with tilt hover |
| `Gallery` | Gradient placeholder photos; real photos drop in by replacing the `PHOTOS` array `bg` values with `url(...)` strings |
| `RSVP` | Controlled form with local validation; fires a 3-wave `canvas-confetti` burst on submit when attending |
| `Footer` | Static; no interactivity |

### Styling conventions

- CSS custom properties: `--gold`, `--rose`, `--cream`, `--charcoal`, `--text-muted`, `--font-heading`, `--font-body`, `--transition`, `--radius`, `--shadow-hover` (all in `:root` in `src/index.css`)
- Section layout: wrap content in `<div className="section">` (max-width 1100 px, auto-centered, 100 px vertical padding)
- Section headers follow the pattern: `section-label` (small caps) → `section-title` (h2) → `section-divider`
- TypeScript strict mode is on: no `any`, no unused locals/params

### Wedding details (for copy changes)

- Couple: **Van Ha & Thanh Hien**
- Date: **31 tháng 05 năm 2026** — countdown target is `new Date(2026, 4, 31, 10, 0, 0)` in `Hero.tsx`
- All user-facing text is in **Vietnamese**

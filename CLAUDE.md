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
- **Yarn 4** (node-modules linker) — use `yarn`, not `npm`
- Plain CSS per component (no CSS framework)
- `canvas-confetti` for the RSVP submit burst
- No test framework configured

## Architecture

Online wedding invitation for Văn Hà & Thanh Hiền (31/05/2026). Single-page app: `index.html` → `src/main.tsx` → `src/App.tsx`.

### App composition + load gate

`App.tsx` gates main content on a `loaded` boolean controlled by `LoadingScreen`'s `onDone` callback (≈2.9 s splash). **Until the splash completes, only `LoadingScreen` + `CursorEffect` mount.** This is intentional — sections rely on entrance animations that should start *after* the user can actually see them.

After the gate, chrome (`AudioPlayer`, `ScrollProgress`, `NavDots`) renders, then 8 sections in scroll order:

`Hero` → `Introduction` → `OurStory` → `WeddingDetails` → `HumorSection` → `Gallery` → `RSVP` → `Footer`.

⚠ **When you add/rename a section, also update the `SECTIONS` array in `NavDots.tsx`** (id + Vietnamese label) or it falls out of the right-side nav rail.

### Hooks (`src/hooks/`)

- **`useScrollReveal<T>()`** — attach the returned ref to a section root. Does two things:
  1. Observes `.reveal` descendants; on intersection, adds `.visible` to trigger their CSS transition (threshold 0.12, rootMargin `-40 px` bottom).
  2. If the container has `data-wipe="left|right|up"`, observes the container itself and adds `.wipe-in` to play a clip-path curtain reveal. The reveal-children observer *also* adds `.wipe-in` as a guaranteed fallback.
- **`useTypewriter(text, speedMs, startDelayMs)`** — returns `[displayed, done]`. Used by `Hero` for the tagline.

### Reveal + wipe styling (defined in `src/index.css`)

- `.reveal` fades + slides up 36 px; `.visible` resets to `transform: none; filter: none;`. Stagger with `.reveal-delay-1` … `.reveal-delay-6` (100 ms steps).
- Entrance variants override only the *initial* transform/filter so they compose with delays: `.reveal-left`, `.reveal-right`, `.reveal-zoom`, `.reveal-drop`, `.reveal-blur`.
- Section wipes use a **paused CSS keyframe animation** (`@keyframes wipe-right|wipe-left|wipe-up`). The element is held at the `from` keyframe by `animation: ... paused`; `.wipe-in` flips `animation-play-state: running`. This pattern was chosen over a `clip-path` transition because a clipped-to-zero element broke IntersectionObserver detection — a paused animation keeps the layout box intact so the observer still fires.

### Components (`src/components/`)

Each component has a co-located `.css` file. **Always reference CSS custom properties from `src/index.css`** (`--gold`, `--rose`, `--cream`, `--charcoal`, `--text-muted`, `--font-heading`, `--font-body`, `--transition`, `--radius`, `--shadow-hover`, etc.) rather than hardcoding hex.

Section behaviours that aren't obvious from file names:

| Section          | Notes                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Hero`           | Layered parallax via `scroll` listener writing `transform: translateY(...)` directly to two refs (`bgRef` ×0.15, `petalsRef` ×0.42). 15 falling-petal divs with per-particle `animationDuration`/`Delay` inline. Names use gold-shimmer via `-webkit-background-clip: text`. Tagline is a `useTypewriter` with 1.4 s start delay. Countdown ticks via `setInterval`. |
| `Introduction`   | Editorial spread of two columns + central italic "&" spine. Drop in real photos by replacing `photoBg` (and removing the `<span className="intro-monogram">`) in the `PEOPLE` array. Each column ends with a "— Phụ Mẫu —" parents block — placeholder names live in `PEOPLE[i].parents`. Stacks at ≤ 880 px; spine line rotates vertical → horizontal at that breakpoint. |
| `OurStory`       | Timeline alternates `.tl-left` / `.tl-right` paired with `.reveal-left` / `.reveal-right`. Single column ≤ 768 px.                                                 |
| `WeddingDetails` | 3D card tilt is **JS-driven** — `useEffect` attaches `mousemove`/`mouseleave` listeners that write `transform: perspective(900px) rotateY(...) rotateX(...)` to inline style. Skipped on touch devices via `matchMedia('(hover: hover)')`. Don't add a CSS `transform` to `.detail-card` — the JS overwrites it. 1-column below 900 px. |
| `HumorSection`   | 6-card grid, 3 → 2 → 1 columns.                                                                                                                                    |
| `Gallery`        | Bento grid (`grid-column` placement per item). Replace `bg` in `PHOTOS` with `url(...)` strings to drop in real photos.                                            |
| `RSVP`           | Controlled form + local validation. On submit while attending, fires a 3-wave `canvas-confetti` burst with the gold/rose palette.                                  |

Chrome/overlay components (rendered outside the section flow):

- **`LoadingScreen`** — phase machine `enter → hold → exit → done` (400 ms / 1500 ms / 1000 ms). Calls `onDone` once at `done`.
- **`CursorEffect`** — appends transient `.cursor-spark` spans to `document.body` on `mousemove` (throttled ~85 ms, hover-only).
- **`AudioPlayer`** — attempts `audio.play()` at `volume = 0.35` on mount; falls back to a fixed glassmorphism toggle button (bottom-left) when the browser blocks autoplay. Source: `/music.mp3` in `public/`.
- **`ScrollProgress`** — top gradient bar tracking `scrollY / (scrollHeight - innerHeight)`.
- **`NavDots`** — IntersectionObserver (threshold 0.35) sets the active dot. See section composition warning above.

### Styling conventions

- Wrap section content in `<div className="section">` (max-width 1100 px, 100 px vertical padding).
- Section header pattern: `section-label` (small caps) → `section-title` (`<h2>`) → `section-divider` (gold→rose hairline; the divider has its own `.reveal`-driven scale-in transition).
- TypeScript strict mode: no `any`, no unused locals/params.
- All user-facing text is **Vietnamese**.

### Where copy lives (for name/date changes)

Names appear in **five files** — search-and-replace all of them:
`Hero.tsx` (display + countdown anchor), `Introduction.tsx` (`PEOPLE` array incl. parent placeholders), `LoadingScreen.tsx` (splash), `Footer.tsx` (monogram + closing), and this file.

Date anchor: `new Date(2026, 4, 31, 10, 0, 0)` in `Hero.tsx` (note: month is 0-indexed → `4` = May).

# Changelog

A running log of every meaningful change made to aqib.fyi.
Format: date, what changed, which files were affected.

---

## 2026-06-09 — Phase 1: Claim the space

**What changed:**
- Initialized Astro project with Tailwind CSS
- Built placeholder page: name, one quiet line, cream background, EB Garamond serif font
- Connected repo to Vercel for auto-deployment
- Pointed aqib.fyi DNS (Porkbun A record) at Vercel

**Files added:**
- `src/pages/index.astro` — the placeholder page
- `src/styles/global.css` — Tailwind entry point
- `astro.config.mjs` — Astro + Tailwind config
- `package.json` — project dependencies
- `public/` — favicon files
- `tsconfig.json` — TypeScript config

**Live at:** aqib.fyi

---

## 2026-06-09 -- Phase 2: Foundation

**What changed:**
- Built the real site structure replacing the placeholder: shared layout, dialogue navigation system, and four content pages
- Homepage is now the RPG dialogue box -- types out the intro character by character, then shows a menu of response options with arrow key navigation, 8-bit blip sounds (Web Audio API, no files), and sprite expression changes per option
- Inner pages (about, work, writing) all have a fixed [ talk ] overlay button for navigation -- no traditional nav bar anywhere
- Five pixel-art placeholder SVG sprites created, one per dialogue option state
- Design system defined in global.css with @theme tokens
- package.json renamed from "puffy-planet" to "aqib-fyi"

**Files added:**
- `src/layouts/Layout.astro` -- base layout used by all pages
- `src/components/DialogueNav.astro` -- homepage dialogue + typewriter + menu
- `src/components/TalkButton.astro` -- inner page overlay nav
- `src/pages/about.astro`, `work.astro`, `writing.astro` -- content pages
- `public/sprites/neutral.svg`, `warm.svg`, `confident.svg`, `thoughtful.svg`, `casual.svg` -- placeholder sprites

**Files changed:**
- `src/styles/global.css` -- @theme design tokens added
- `src/pages/index.astro` -- rewritten, now uses Layout + DialogueNav
- `package.json` -- renamed to aqib-fyi

---

## 2026-06-09 -- Stack switch: Astro to Next.js (decision logged)

**What changed:**
- Documented the decision to switch from Astro to Next.js in build-log.md
- Site concept evolved: RPG character is now a persistent presence across the whole site, not just a homepage intro. AI-driven response is the goal; scripted dialogue is the starting point.
- All existing Astro Phase 2 work will be rebuilt in Next.js (Phase 1b migration, then Phase 2 redo)

**Files changed:**
- `build-log.md` -- decision entry added

---

## 2026-06-09 -- Phase 1b: Migrate to Next.js

**What changed:**
- Full migration from Astro to Next.js. All Astro files removed and replaced with a fresh Next.js 16 project (TypeScript, Tailwind v4, App Router).
- Dialogue character intro rebuilt in React -- no sprite, no background image. Speaker name tag ("aqib") above the dialogue box instead. All dialogue logic, typewriter, menu, arrow key nav, blip sounds, and "surprise me" fact sequence carried over.
- [ talk ] persistent nav overlay carried over to TalkButton React component.
- All 4 content pages (about, work, writing, library) rebuilt.
- Root layout uses EB Garamond via next/font. Grain and vignette overlays preserved.
- Build: `next build` clean, 6 routes, zero errors.

**Files added/changed:**
- `src/app/layout.tsx`, `globals.css`, `page.tsx` -- root layout and homepage
- `src/app/about/page.tsx`, `work/page.tsx`, `writing/page.tsx`, `library/page.tsx` -- all content pages
- `src/components/DialogueNav.tsx` -- React dialogue system
- `src/components/TalkButton.tsx` -- React nav overlay
- `src/components/PageFooter.tsx` -- shared footer links
- All Astro files removed. `next.config.ts`, `tsconfig.json`, `postcss.config.mjs` added.

---

## 2026-06-09 -- Phase 2 refinements (Astro -- superseded by Next.js migration)

**What changed:**
- Dialogue sequence redesigned: sprite rises in from left, waves, then box appears -- no layout shift
- Multi-box dialogue: each line appears in its own box, requires a click or keypress to advance
- Menu options type in one by one after a pause, instead of appearing all at once
- "Surprise me!" replaces "just looking around" -- sprite spins, a random personal fact types out, then nav links appear
- Returning visitor sequence (via [ talk ] home button) shows a short alternative dialogue instead of the full intro
- Page transitions added via Astro ClientRouter -- smooth fade between all pages
- Homepage locked to viewport height, no scrolling during intro sequence
- Background color fix: moved body styles out of @layer base so cream + ink colors reliably apply
- Removed [ aqib ] name chip from dialogue box and talk overlay (redundant after intro)
- All four pages confirmed working end-to-end

---

## 2026-06-13 -- Phase 1: Foundation for the illustrated-world rebuild

**What changed:**
- Started the build for the illustrated-world direction (the warm, explorable, RPG-style world spec'd in the planning vault's concept.md). New branch `illustrated-world` from `main`.
- Removed Tailwind entirely. The locked plan calls for plain CSS Modules only. Uninstalled `tailwindcss` and `@tailwindcss/postcss`, deleted `postcss.config.mjs`. Next.js now uses its built-in CSS pipeline.
- Added `src/app/tokens.css`: the single source of truth for all design tokens (colors, type scale, spacing, radius, shadows, overlays, motion), translated directly from design-tokens.md.
- Switched fonts to the three the design calls for: Cormorant Garamond, DM Sans, Space Mono (was EB Garamond). Loaded via next/font and wired to token variables.
- Rewrote globals.css as a minimal reset plus base styles, all using tokens. Removed the old grain and vignette overlays.
- Cleared out the old quiet-archive / cat-world files and replaced the routes. "work" route renamed to "projects". Added placeholder pages for the four sections so the site runs.
- Kept the dialogue engine in `src/components/Intro/` for reuse; stubbed its deleted dependency so it compiles (full avatar wiring comes in the homepage phase).
- Aligned all repo docs so future sessions are not misled: rewrote the stale CLAUDE.md and README.md, marked the old uppercase BUILDLOG.md as superseded, and fixed the .vscode files that still pointed at Astro.
- Verified: `next build` passes clean, all five routes generated.

**Files added:**
- `src/app/tokens.css`
- `src/app/projects/page.tsx`, `src/app/thoughts/page.tsx`, `src/app/inspirations/page.tsx`
- `src/components/Intro/Intro.tsx`, `Intro.module.css`
- `public/images/` (all finalized art: landscape, nav panels, avatar, wall-of-love)
- `BUILDLOG.md` (historical cat-world log, now marked superseded)

**Files changed:**
- `src/app/layout.tsx` -- three fonts, token + globals imports, cleaned metadata
- `src/app/globals.css` -- reset + base styles, no Tailwind
- `src/app/page.tsx`, `src/app/about/page.tsx` -- placeholders
- `package.json`, `package-lock.json` -- Tailwind removed
- `CLAUDE.md`, `README.md`, `build-log.md` -- brought current
- `.vscode/launch.json`, `.vscode/extensions.json` -- Astro leftovers fixed

**Files removed:**
- `postcss.config.mjs`
- `src/components/DialogueNav.tsx`, `PageFooter.tsx`, `TalkButton.tsx`
- `src/app/library/`, `src/app/writing/`, `src/app/work/`

---

## 2026-06-13 -- Phase 2: Navigation system (desktop strip + phone Explore menu)

**What changed:**
- Built the full inner-page navigation as a single `NavStrip` component. It appears on every inner page and hides on the homepage (which gets its own links later).
- Desktop and tablet: a horizontal strip of five panels (Home, About, Projects, Thoughts, Inspirations), each showing its section illustration with the label centered on top, a warm dark wash that lightens on hover, and an amber accent under the active section. Panels are locked to a 2:1 shape so the whole image always shows, framed identically on every screen size.
- Phones (<=600px): the strip is replaced by an "Explore" bar that toggles a dropdown of the five sections stacked as slim 6:1 bars, each with its own phone-sized image and centered label. The Explore bar stays visible and closes the menu when tapped again; menu also closes on selection, route change, or Escape. The Explore bar uses its own background image.
- Recolored all five section images so each is visually distinct (violet dusk Home, green-gold About, cream morning Projects, teal rain Thoughts, navy night Inspirations).
- Active section detection is by the first URL segment, so sub-pages keep their parent highlighted.
- Accessibility: nav landmark labels, `aria-current` on the active link, `aria-expanded`/`aria-controls` on the Explore button, keyboard focus rings, Escape to close.

**Files added:**
- `src/components/NavStrip/NavStrip.tsx` and `NavStrip.module.css`
- `public/images/nav/mobile/6to1/` -- six 6:1 phone images (home, about, projects, thoughts, inspirations, explore)
- `public/images/nav/mobile/2to1/` -- earlier 2:1 phone attempts (kept, unused)

**Files changed:**
- `src/app/layout.tsx` -- renders `NavStrip` above page content
- `src/app/tokens.css` -- lightened nav overlay tokens; added `--text-shadow-on-image`
- `public/images/nav/home.png`, `about.png` (renamed from a8.png), `projects.png`, `thoughts.jpg`, `inspirations.png` -- recolored 2:1 desktop images
- `build-log.md` -- prompt-level history of the nav iterations

**Note:** nav images use Next's `unoptimized` prop to sidestep image-optimizer caching issues seen during iteration; fine for a few small images, revisit if needed.

---

## 2026-06-14 -- Color system aligned to the recolored section images

**What changed:**
- Updated the section-identity color tokens in `tokens.css` to match the recolored nav images, so the design system reflects what's actually on screen. These tokens are not used by any component yet (the nav uses only the warm/neutral tokens), so there is no visual change now; this prepares the section page accents for later phases.
  - About: replaced the old near-black `--about-deep` with `--about-green` (#7a9a5a) and `--about-gold` (#e8d890); kept `--thread-red` as the accent.
  - Home: added `--dusk-violet` (#6a4a8a) and `--dusk-lavender` (#b89ac8) for the violet-dusk panel.
  - Projects: kept the warm tokens, noting it is now a brighter cream morning.
  - Thoughts (teal) and Inspirations (navy) unchanged.
- The planning-vault docs were brought in sync to match (concept.md aesthetic + color system + navigation, design-tokens.md; old epic-world `DESIGN.md` marked superseded). Those live in the planning vault, not this repo.

**Files changed:**
- `src/app/tokens.css` -- section-identity color tokens updated

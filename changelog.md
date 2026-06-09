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

## 2026-06-09 -- Phase 2 refinements

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

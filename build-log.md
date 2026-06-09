# Build Log — aqib.fyi

A prompt-level log of every meaningful decision, change, or adjustment made during build sessions.
Updated during the session, not just at commit points.

Format: date, what was asked or decided, what changed.

---

## 2026-06-09

**Session: Phase 1 — Claim the space**

- Read both GitHub repos (pr0ject-zero and aqib-fyi) to understand full project context
- Entered plan mode, designed Phase 1 plan: initialize Astro, add Tailwind, build placeholder, deploy to Vercel, point domain
- Initialized Astro project with minimal template inside aqib-fyi repo
- Added Tailwind CSS via `npx astro add tailwind`
- Built placeholder page: EB Garamond serif, cream background (#FAF7F2), centered name and one italic line
- Confirmed clean build with `npm run build`
- Committed and pushed to GitHub
- Walked through Vercel setup (browser-based, imported from GitHub, auto-detected Astro)
- Added aqib.fyi as custom domain in Vercel
- Replaced Porkbun default ALIAS record with Vercel A record (216.198.79.1)
- DNS propagated, aqib.fyi confirmed live

**Version tracking setup**
- Created changelog.md (commit-level log)
- Created build-log.md (this file, prompt-level log)
- Updated global CLAUDE.md with commit rules: ask before committing, write descriptions, update changelog per commit
- Decided: changelog = per commit, build-log = per prompt/session

---

**Session: Phase 2 planning — Foundation**

Navigation decisions:
- Rejected standard "logo left, links right" nav as too generic
- Explored multiple concepts: home-as-hub, bottom nav, centered title-page, editorial byline, world map, book spine
- Decided on Idea 2a: dialogue-as-navigation. No nav bar anywhere. Homepage dialogue box ends with RPG-style response options. Inner pages have a small persistent `[ talk ]` element that opens an overlay menu.
- Idea 2b (constellation nav) saved for potential future use

Dialogue box decisions:
- Greeting word: "stranger" (recommended -- Waystone Inn energy, fits aesthetic doc)
- No mention of aqib.fyi in the dialogue text itself
- Dialogue: "Greetings, stranger! I'm Aqib. This is my corner of the internet -- a small, personal space I've built from scratch. There's quite a bit here if you look carefully. What would you like to explore?"
- Letters type out one by one (character-by-character typewriter)
- Four menu options after typing: about, work, library, just looking around
- Arrow key up/down navigation between options
- Currently highlighted option is clearly visible
- 8-bit blip sound on option switch, generated via Web Audio API (no audio files needed)
- Sprite expression changes per highlighted option -- 5 variants: neutral, warm, confident, thoughtful, casual

Content decisions:
- Email: aqib7raza@gmail.com
- LinkedIn: https://www.linkedin.com/in/aqib-raza/
- Footer links (all four): email, LinkedIn, Twitter/X (https://x.com/aqwe_eb), Substack (https://substack.com/@aqweeb)
- Resume PDF: will be provided, linked on work page
- Phase 2 plan saved as markdown doc in pr0ject-zero vault: 04-build-notes/phase-2-plan.md

---

**Session: Phase 2 execution -- 2026-06-09**

Files created or changed:
- `src/styles/global.css` -- updated with @theme tokens (cream, ink, muted, amber) and EB Garamond applied globally
- `src/layouts/Layout.astro` -- base layout with head, TalkButton conditional, main slot, footer with all 4 links
- `src/components/DialogueNav.astro` -- RPG dialogue box with typewriter, menu options, arrow key nav, 8-bit blip sounds via Web Audio API, sprite swapping per option
- `src/components/TalkButton.astro` -- fixed top-left [ talk ] button, opens overlay menu with keyboard + mouse nav, Escape to close
- `src/pages/index.astro` -- rewritten, wraps DialogueNav in centered layout, no TalkButton on homepage
- `src/pages/about.astro` -- personal page, honest first-person, no CV language, email link at bottom
- `src/pages/work.astro` -- pr0ject zero, KraftedX (4 projects), KRG, education, 3-tier skills, resume on request
- `src/pages/writing.astro` -- honest placeholder
- `public/sprites/` -- 5 pixel-art placeholder SVG sprites (neutral, warm, confident, thoughtful, casual)
- `package.json` -- renamed from "puffy-planet" to "aqib-fyi"

Build result: `npm run build` passed clean, 4 pages built, zero errors.

---

## 2026-06-09 -- Stack switch decision: Astro to Next.js

- Decided to migrate from Astro to Next.js
- Reason: the RPG dialogue character concept expanded. Instead of a one-time homepage intro, the character should be a persistent presence across the whole site -- always available, eventually AI-driven and capable of responding to the visitor dynamically
- That requires: API routes (to call an AI service without exposing keys), session state (character remembers context across pages), unified React component tree (share state between character and page content)
- Astro supports interactive components via islands but becomes awkward at this level of stateful cross-page interactivity
- Plan: reinitialize site repo with Next.js + Tailwind (Phase 1b). Rebuild Phase 2 in Next.js, starting with scripted dialogue. AI layer added as a later phase once the structure is solid
- All Phase 2 Astro work (components, pages, sprites) will be redone -- not lost, just rebuilt in the new framework
- project-zero-brief.md in vault updated to reflect the new stack and expanded character concept

---

## 2026-06-09 -- Phase 1b: Next.js migration complete

- Removed all Astro files (src/, .astro/, dist/, astro.config.mjs, node_modules, sprites)
- Initialized fresh Next.js 16 project with TypeScript, Tailwind v4, App Router, src/ directory
- Rebuilt all components and pages in React/TypeScript:
  - `src/components/DialogueNav.tsx` -- full dialogue system as a React client component. Typewriter, multi-line advance, menu with arrow key nav, 8-bit blip sounds, "surprise me" fact with nav reveal. No sprite, no background image -- character represented by a small amber name tag above the dialogue box.
  - `src/components/TalkButton.tsx` -- persistent [ talk ] overlay nav on all inner pages, keyboard nav, Escape to close
  - `src/components/PageFooter.tsx` -- shared footer with email, linkedin, x, substack links
  - `src/app/page.tsx` -- homepage, just the DialogueNav centered in full viewport height
  - `src/app/about/page.tsx` -- full about page, honest personal text, drop cap
  - `src/app/work/page.tsx` -- work page, KraftedX projects, earlier experience, skills grid, resume on request
  - `src/app/writing/page.tsx` -- placeholder
  - `src/app/library/page.tsx` -- placeholder
  - `src/app/layout.tsx` -- root layout, EB Garamond via next/font, grain + vignette overlays
  - `src/app/globals.css` -- all design tokens, grain/vignette, drop cap, ink-divider
- Build result: `next build` passed clean, 6 routes, zero errors

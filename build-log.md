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

---

## 2026-06-13 -- Phase 1: Foundation for the illustrated-world build

First actual build session for the illustrated-world direction. No visual UI yet -- this session laid the groundwork everything else sits on. Full spec in planning vault `03-site-planning/concept.md` and `design-tokens.md`.

**Branch:** created `illustrated-world` from `main`. The old `cat-world` and quiet-archive working files were cleared out. Kept the dialogue engine in `src/components/Intro/` (its typewriter and choice-state logic is reusable) and all finalized images in `public/images/`.

**Tailwind removed.** This is a deliberate break from the old setup, mandated by the locked plan (plain CSS Modules only).
- Uninstalled `tailwindcss` and `@tailwindcss/postcss`
- Deleted `postcss.config.mjs` (it only existed to run Tailwind); Next.js falls back to its built-in CSS pipeline
- `globals.css` rewritten from scratch: minimal reset, base body styles, reduced-motion support. No `@import "tailwindcss"`, no `@theme` block.

**Files created/changed:**
- `src/app/tokens.css` -- NEW. The single source of truth for all design tokens (colors, type scale, spacing, radius, shadows, overlays, motion). Direct translation of design-tokens.md. ~190 lines.
- `src/app/layout.tsx` -- three fonts via next/font/google: Cormorant Garamond (display), DM Sans (body), Space Mono (dialogue). Wired to `--font-cormorant`, `--font-dm-sans`, `--font-space-mono`, which tokens.css references. Removed EB Garamond, grain overlay, vignette overlay. Updated metadata.
- `src/app/globals.css` -- reset + base styles, all using tokens.
- `src/app/page.tsx` -- placeholder homepage.
- `src/app/about/page.tsx` -- placeholder (old bio content preserved in git history on main + planning vault about-me.md).
- `src/app/projects/page.tsx`, `thoughts/page.tsx`, `inspirations/page.tsx` -- NEW placeholder pages. "work" route renamed to "projects".
- `src/components/Intro/Intro.tsx` -- stubbed the deleted Cat import with a placeholder div so it compiles. Full avatar wiring deferred to Phase 3 (homepage).

**Removed:** `src/components/DialogueNav.tsx`, `PageFooter.tsx`, `TalkButton.tsx`; `src/app/library/`, `writing/`, `work/`.

**Verification:** `next build` passes clean, all 5 routes generated static. Running dev server serves `/` and `/about` at HTTP 200 with the new content. No Tailwind references remain.

**Flagged, not yet fixed:** the site's `CLAUDE.md` is stale -- it still says Astro, "Always use Tailwind," and "No animations," all of which now contradict the build. `BUILDLOG.md` (uppercase) is the abandoned cat-world log. Both should be reconciled.

**Next:** Phase 2 -- the five-panel inner-page nav strip.

---

## 2026-06-13 -- Phase 2: Five-panel nav strip

Built the inner-page navigation strip. First real visual component.

**Component:** `src/components/NavStrip/NavStrip.tsx` + `NavStrip.module.css`.
- Client component (uses `usePathname` to know the active section).
- Five panels: Home, About, Projects, Thoughts, Inspirations, each with its nav image (`public/images/nav/`) cropped to fill via `next/image`, a warm dark overlay (`--overlay-panel`), and the label in parchment DM Sans over it.
- Active section: lighter overlay (`--overlay-panel-active`) plus a 3px amber accent line at the bottom. Active detection matches the first path segment, so sub-pages like `/projects/kraftedx/scout` keep Projects highlighted.
- Hover/focus: overlay lightens to `--overlay-panel-hover`. Keyboard focus ring in gold. `aria-current="page"` on the active panel, `aria-label` on the nav landmark.
- Sticky at top, `z-index: 10`, `--shadow-md` to read as a distinct layer above content.
- Mobile (<=600px): strip shrinks to 60px, labels shrink so all five still fit side by side (no scrolling, all sections always visible).

**Placement:** rendered once in the root layout, above `{children}`. It returns `null` on the homepage (`/`), so the homepage keeps its own floating-links approach and every other route gets the strip automatically.

**New token:** `--text-shadow-on-image` added to tokens.css and design-tokens.md, for light labels sitting over imagery.

**Verified:** `next build` clean. Dev server confirms `/about` renders the nav with one active panel; `/` has no nav landmark.

**Next:** Phase 3 -- the homepage (landscape layer, floating nav links, intro sequence with the real avatar).

---

## 2026-06-13 -- Phase 2 refinement: nav strip tuning + locked-ratio rework

Iterated on the nav strip from visual feedback.

- **Brighter panels:** lightened the overlay tokens (inactive 0.55 -> 0.35, hover 0.40 -> 0.25, active 0.30 -> 0.15) and strengthened `--text-shadow-on-image` to a tight-edge + halo so labels stay legible over brighter images.
- **Labels:** switched from DM Sans to Cormorant Garamond (`--font-display`), semibold, sized up to `--text-display-sm` on desktop with responsive steps down for tablet/phone.
- **Cropping fix (the big one):** the cover-crop approach showed a different slice of each image at different screen widths (panel width is responsive, height was fixed), and the source images are all different shapes (one is portrait). Reworked so each panel is locked to a fixed 2:1 aspect ratio and the image is shown whole (`object-fit: contain`) on a dark mat, never cropped. Result: identical framing on every device; only the size scales. Removed the per-image `object-position` (no longer needed). Strip height now follows the 2:1 panels automatically (no fixed height).
- **Decision:** nav images to be regenerated to a uniform 2:1 (target 1600x800) so they fill each panel edge to edge. Until then, current images show whole but letterboxed (Inspirations, being portrait, has the most dark space around it). About (a7) is already ~2:1.

**Mobile nav (final approach):** on phones (<=600px) the horizontal strip is hidden and replaced by an "Explore" bar that stays visible and toggles a dropdown open/closed when tapped (chevron flips; no separate close control). The dropdown is the five sections stacked vertically as slim **6:1 bars, the same shape as the Explore bar**, each with its own phone-specific image and the label centered on top (matching the desktop panel look). Active section marked with an amber left edge. Closes on tap of Explore, selection, route change, or Escape; animated.

Phone images are a **separate set** from desktop: 6:1 (1200x200), in `public/images/nav/mobile/` (home.png, about.png, projects.png, thoughts.jpg, inspirations.png) plus `explore.png` for the Explore bar. Desktop strip uses the 2:1 set in `public/images/nav/` (Aqib regenerated and replaced these). Component references both sets via `img` (2:1) and `imgMobile` (6:1) per panel.

(Iteration history: cropped-cover -> locked 2:1 contain -> considered swipe filmstrip and thumbnail list -> landed on the Explore toggle with slim 6:1 bars per Aqib's direction.)

**Pending:** Aqib to add the six 6:1 phone images; then wire `explore.png` into the Explore bar. Once the nav is visually locked, sync into concept.md (still describes a "cropped background" five-panel strip on all devices) and design-tokens.md (nav shapes/labels, desktop 2:1 + mobile 6:1, Explore menu). Holding the doc sync until then.

**Next:** Phase 3 -- the homepage.

---

## 2026-06-13 -- Nav system complete (recolored final images, locked)

The whole nav system is done on desktop and phone, and the section images were recolored so each panel is visually distinct.

**Final recolored images (the big visual change):** each section now has its own signature color/atmosphere so the strip reads as five distinct places instead of blending. In nav order:
- Home: violet/lavender dusk with a warm amber sunset glow
- About: luminous green and gold, the red thread still the symbolic accent
- Projects: bright cream/ivory morning, warm, blue window sky (lightened from the old golden-hour look)
- Thoughts: teal blue-green rain, ink linework (unchanged)
- Inspirations: deep navy night, gold-lit clouds and stars (unchanged)

**File housekeeping:**
- About's chosen image came in as `a8.png`; renamed to `about.png` to match the other four and fix a broken reference (the code points to `about.png`).
- Desktop images: `public/images/nav/` at 2:1 (1774x887).
- Phone images: `public/images/nav/mobile/6to1/` at 6:1 (1200x200) -- home, about, projects, thoughts, inspirations, plus `explore.png`. The earlier 2:1 phone attempts are parked in `public/images/nav/mobile/2to1/` (unused).
- Explore bar uses `explore.png` as a cover background (set via inline `backgroundImage`).

**Rendering note:** nav `Image`s use the `unoptimized` prop. Next's image optimizer was caching aggressively during iteration and erroring on not-yet-added files; `unoptimized` serves the files directly, which is fine for a handful of small nav images. Can revisit later if we want optimization back.

**Final shapes:** desktop panels and phone bars/Explore are all driven by `aspect-ratio` (2:1 desktop, 6:1 phone) so they scale cleanly and show the whole image with no cropping. Verified `next build` clean.

This is the Phase 2 commit point.

---

## 2026-06-14 -- Phase 3 (part 1): Homepage scene + main menu

Built the homepage as a full-screen scene with a game-style main menu. The avatar intro (the other half of Phase 3) is not built yet; `page.tsx` renders the scene revealed for now.

**Component:** `src/components/HomeScene/HomeScene.tsx` + `.module.css` (client).

**Background -- now an animated GIF.** After trying the static painterly time-of-day system, Aqib provided a pixel-art "cozy night room" loop (`gif (7)`), copied in as `public/images/landscape/home.gif`. It is the homepage background. The five painterly time-of-day stills (lp11 dawn/day/dusk/twilight/night, the new `lp11-twilight.png` = the violet 2:1) are kept behind a `USE_GIF` flag as a fallback: when off, the scene auto-detects local time, crossfades between the five, and shows the manual time selector. When on (current), the gif plays and the selector is hidden.

**Main menu (game-style):**
- Lower-left on desktop, centered + lower (against the figure's back) on mobile.
- Four sections (About, Projects, Thoughts, Inspirations). Selected item: gold + bold + glow + `»  «` arrows that ease in.
- Keyboard up/down arrow navigation; Enter opens. Mouse hover syncs the same highlight.
- Soft retro UI blips on hover and select, generated with the Web Audio API (no audio files). The same sounds are on the bottom-right links.
- No title (removed; an sr-only h1 remains for accessibility/SEO).

**Other homepage pieces:**
- Bottom-right (desktop): LinkedIn, Twitter (X), and email -- all links, Cormorant, with sounds. (Earlier had a live clock; removed for the gif.)
- Ambient particles drifting up (warm motes), `--particle-glow` token.
- Custom cursor on the scene: a soft amber dot, a glowing ring on interactive elements (`cursor-dot.svg`, `cursor-ring.svg`).
- New tokens: `--particle-glow`, `--text-shadow-glow`.

**Deferred / planned:** cozy rain ambient audio (low volume, mute toggle, starts on first interaction -- waiting on a rain loop file); the avatar intro sequence; perf pass on the unoptimized images/gif.

**Verified:** `next build` clean throughout.

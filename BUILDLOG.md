# BUILDLOG -- aqib.fyi

> **SUPERSEDED (2026-06-13).** This file is kept only as history of the abandoned `cat-world` build. Do not add new entries here. The canonical prompt-level log is now `build-log.md` (lowercase) in this same folder. Current direction and active branch are documented there and in the planning vault `03-site-planning/concept.md`.

> **Branch status:** `cat-world` (dark minimal with SVG cat, RPG dialogue, sidebar nav) was abandoned. The `illustrated-world` branch was created for the direction decided in the June 11 design session. See planning vault `03-site-planning/concept.md` for the full current spec.

---

# cat-world branch -- ABANDONED

This branch is a fully separate direction from `epic-world-rebuild`.
It is not meant to replace the Ghibli world build -- it is a parallel experiment
with a completely different aesthetic and structure.

Logging rules: CLAUDE.md.

---

## v1.0.0 -- 2026-06-10 -- Full initial build: cat-world

**Branch:** `cat-world`, created from `main`.

**Concept:**
- A black and brown tabby cat named Mochi is the recurring character across the site.
  She runs the RPG intro sequence and walks across the bottom of every page.
- The aesthetic is dark, minimal, and typographic: near-black background, clean hierarchy,
  warm amber accent, three fonts (DM Serif Display for headings, DM Sans for body, Space Mono
  for code/mono elements). Inspired by minimal dark sites like mayaresearch.ai.
- Navigation: fixed left sidebar (220px) with name, divider, and four links. On mobile it
  collapses to a sticky top bar. Inspired by rivik.io / benleejamin.com.
- Structure: four sections -- about, work, inspirations, thoughts -- each with sub-pages.
- RPG intro: runs every time you land on the home route. Mochi appears, delivers three lines
  of dialogue, you pick a response from three choices, she replies, site reveals.

**What was built:**
- Design tokens: dark palette, font variables, spacing scale (tokens.css)
- Fonts via next/font/google: DM Sans, DM Serif Display, Space Mono
- Tailwind removed (postcss.config.mjs cleared; old components deleted)
- Cat SVG component (Cat.tsx): three variants -- portrait (140px, used in intro),
  walking (side-profile with leg animation, walks across the bottom rail), sitting
  (sidebar bottom ornament). All drawn as inline SVG paths.
- Intro component (Intro.tsx): full-screen RPG dialogue sequence with typewriter effect,
  choice buttons, cat portrait, "skip" escape. Every home page load.
- SiteLayout + SideNav: fixed sidebar + content area layout; responsive (top bar on mobile).
- HomeContent: landing page shown after the intro resolves.
- Pages: /about (real bio text), /work (projects list + experience), /inspirations,
  /thoughts -- all with [slug] sub-pages.
- Content files: src/content/work.ts, thoughts.ts, inspirations.ts (real + placeholder content).
- Walking cat rail: a thin section at the bottom of every page with the cat SVG animating
  across from right to left and back, looping every 22 seconds.

**Files created (new):**
src/app/tokens.css, src/app/globals.css (rewritten), src/app/layout.tsx (rewritten),
src/app/page.tsx (rewritten), src/app/about/page.tsx + about.module.css,
src/app/work/page.tsx + work.module.css, src/app/work/[slug]/page.tsx + project.module.css,
src/app/inspirations/page.tsx + inspirations.module.css,
src/app/inspirations/[slug]/page.tsx + entry.module.css,
src/app/thoughts/page.tsx + thoughts.module.css,
src/app/thoughts/[slug]/page.tsx + thought.module.css,
src/components/Cat/Cat.tsx + Cat.module.css,
src/components/Intro/Intro.tsx + Intro.module.css,
src/components/SiteLayout/SiteLayout.tsx + SiteLayout.module.css,
src/components/SideNav/SideNav.tsx + SideNav.module.css,
src/components/HomeContent/HomeContent.tsx + HomeContent.module.css,
src/content/work.ts, src/content/thoughts.ts, src/content/inspirations.ts.

**Files removed (old main-branch content):**
src/app/library/page.tsx, src/app/writing/page.tsx,
src/components/DialogueNav.tsx, src/components/PageFooter.tsx, src/components/TalkButton.tsx.

**Decisions:**
- Every home page load triggers the intro (not sessionStorage gated). User asked for this.
- Three typefaces: DM Serif Display for warmth in titles, DM Sans for clean body,
  Space Mono for the RPG dialogue and code/meta text.
- Accent color #c8914a (warm amber) ties to the cat's fur and keeps the dark theme alive.
- Walking cat animation: 22s loop, walks from right to left, then back, using CSS
  translateX + a leg-step keyframe cycle.
- Sidebar sitting cat at bottom: small ornament (32px), half-opacity, hover lifts slightly.
- No hardcoded colors anywhere; all palette values live in tokens.css.

**Still placeholder / not done:**
- Real content for inspirations and thoughts (bodies are real but could be expanded).
- Mobile cat rail animation may want tuning.
- No 404 / error pages yet.
- No commit yet (pending user review).

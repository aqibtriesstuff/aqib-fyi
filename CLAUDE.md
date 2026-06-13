# aqib.fyi -- Site Code

## What this is
The actual website code for aqib.fyi. Aqib's personal site: a living illustrated world you explore, with an RPG/visual-novel intro, an illustrated avatar of Aqib as the recurring identity, and four sections that each feel like a different place in that world. Personal and professional both, not a traditional portfolio.

GitHub repo: `aqibtriesstuff/aqib-fyi` (PUBLIC).
Hosting: Vercel. Domain: aqib.fyi (registered on Porkbun).

## The north star
The full design spec lives in the planning vault, not here. Read these before building anything:
- `C:\Users\aqibr\dumpster\pr0ject-zero\03-site-planning\concept.md` -- the canonical concept. Every design decision traces back here.
- `C:\Users\aqibr\dumpster\pr0ject-zero\03-site-planning\design-tokens.md` -- the exact token values (colors, type, spacing, motion). These are already implemented in `src/app/tokens.css`.

When in doubt, concept.md wins. If something here conflicts with concept.md, concept.md is right and this file should be corrected.

## Stack
- Framework: Next.js 16 (App Router), React, TypeScript
- Styling: plain CSS Modules. See AGENTS.md for an important note about this Next.js version being newer than your training data.
- Fonts: loaded via `next/font/google` in `src/app/layout.tsx`
- Hosting: Vercel (auto-deploys from GitHub)
- Domain: aqib.fyi via Porkbun

## Hard rules (non-negotiable)
- **No Tailwind. No styled-components.** Plain CSS Modules only. Tailwind was removed on 2026-06-13; do not reintroduce it.
- **No hardcoded colors or magic values in components.** Every color, font size, spacing value, radius, shadow, and timing comes from a CSS custom property defined in `src/app/tokens.css`. Use `var(--token-name)`. If a value is missing, add it to tokens.css, do not inline it.
- **One component per folder:** `ComponentName/ComponentName.tsx` + `ComponentName/ComponentName.module.css`.
- **Fonts:** Cormorant Garamond (display/headings, `--font-display`), DM Sans (body, `--font-body`), Space Mono (dialogue/RPG, `--font-mono`). All via `next/font/google`. No other fonts.
- **Icons:** mix approach, no icon library. Social links use standard flat brand SVGs (Twitter/X, Instagram, YouTube, Substack, LinkedIn). All other UI icons use custom simple SVGs with an ink/hand-drawn quality. No Phosphor, no external icon dependency.
- **Mobile is non-negotiable.** Every layout must work on mobile without compromise.
- **Animation serves atmosphere, never attention.** Everything that moves, moves slowly. Soft fades, gentle reveals, never pops or snaps. See the animation principles in concept.md. (The old "no animations" rule from the Astro era is dead.)
- **Homepage landscape:** short looping mp4, autoplay, muted, loop, no controls.
- **Time of day:** detected client-side via `new Date().getHours()` on mount.
- **Intro sequence:** runs every home page load. No sessionStorage gating.
- **Warm illustrated aesthetic.** Never dark, minimal, cold, or corporate.

## Project structure
- `src/app/` -- routes (App Router). Pages: `/` (home), `/about`, `/projects`, `/thoughts`, `/inspirations` and their sub-pages.
- `src/app/tokens.css` -- all design tokens. The single source of truth.
- `src/app/globals.css` -- reset and base document styles only. No component styling here.
- `src/components/` -- shared components, one folder each.
- `public/images/` -- all finalized art assets:
  - `landscape/` -- lp11 + four time-of-day variants (homepage video stills / sources)
  - `nav/` -- the five nav-strip panel images
  - `avatar/` -- av1 (primary), av2 (alternate)
  - `projects/wall-of-love/` -- wol-01 through wol-14

## Branch
- Active branch: `illustrated-world` (created from `main` on 2026-06-13).
- `cat-world` and `epic-world-rebuild` are abandoned experiments. Do not build on them.

## Logging rules
- `build-log.md` (lowercase) -- prompt-level log. Update it DURING the session as decisions and changes happen, not just at commit time. This is the canonical build log.
- `changelog.md` -- commit-level log. Add an entry describing what changed and why, updated when committing (a commit = one meaningful unit of work).
- `BUILDLOG.md` (uppercase) -- SUPERSEDED. Old cat-world log, kept only as history. Do not write new entries there.

## Working agreements (from Aqib's global CLAUDE.md)
- Aqib is non-technical and building his first site. Explain changes in plain language.
- Before changing any file, repo, or setting, say what you're about to do and why.
- Ask before committing anything, anywhere.
- Ask before any action that affects GitHub, Vercel, the domain, or any external service.
- Never commit `node_modules`.
- No em dashes, no emojis, no filler.
- Push back and share opinions when something seems off. Don't just execute.

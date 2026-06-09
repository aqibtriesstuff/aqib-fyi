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

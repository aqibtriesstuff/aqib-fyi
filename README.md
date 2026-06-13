# aqib.fyi

The source for [aqib.fyi](https://aqib.fyi), my personal site.

It is built as a living illustrated world you explore, rather than a traditional portfolio: an RPG-style intro, an illustrated avatar, and four sections (About, Projects, Thoughts, Inspirations) that each feel like a different place in the same world.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router), React, TypeScript
- Plain CSS Modules with a shared design-token file (no CSS framework)
- Fonts via `next/font/google`: Cormorant Garamond, DM Sans, Space Mono
- Deployed on Vercel

## Running locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Structure

- `src/app/` -- routes and pages (App Router)
- `src/app/tokens.css` -- all design tokens (colors, type, spacing, motion)
- `src/components/` -- shared components, one folder each
- `public/images/` -- illustrated art assets

## Notes

Built from scratch as a first coding project. The full design concept and decisions are documented in a separate planning vault.

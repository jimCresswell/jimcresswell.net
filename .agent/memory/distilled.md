---
fitness_line_target: 200
fitness_line_limit: 260
fitness_char_limit: 12000
fitness_line_length: 100
---

# Distilled Learnings

Quick-reference entries that are NOT in permanent docs. Read before every session. See
`docs/architecture/README.md` for full architecture coverage.

---

## Workspace Quick Reference

- Contact email: <contact@jimcresswell.net>; pronouns: he/him; honorific prefix: Dr (all in
  `content/entities.json` Person entity)

## Troubleshooting

- `StrReplace` fails on markdown files: Unicode quotes block matching, so read
  the exact text first
- Prettier reformats code fences: language tag `text` gets applied to bare
  fences
- Playwright import fails on JSON-backed app modules: keep route-emission
  proof in Playwright, but move app-module contract proof to Vitest or import
  raw JSON directly

## Playwright runs against a production build

`pnpm test:e2e` now uses `pnpm build && pnpm start` as its web server.
Production removes the dev-only Turbopack `Runtime ChunkLoadError` overlay and
the Next.js dev-tools issue badge that previously caused intermittent E2E
failures and forced narrow per-route stabilising helpers. PDF generation is
part of the build, so PDF tests run alongside everything else (no separate
`with-build` project). When in doubt, prefer producing more proof at the
production layer over working around dev-server transients in test code.

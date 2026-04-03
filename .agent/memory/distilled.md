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
- Local Playwright runs against `pnpm dev` can intermittently show a Next.js
  runtime chunk overlay on 404 routes; stabilise that in a narrow E2E helper
  instead of changing app code or weakening the assertion

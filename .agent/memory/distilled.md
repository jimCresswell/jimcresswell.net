---
fitness_ceiling: 200
---

# Distilled Learnings

Quick-reference entries that are NOT in permanent docs.
Read before every session. See `docs/architecture/README.md`
for full architecture coverage.

---

## Workspace Quick Reference

- postcss.config must be .mjs — Turbopack silently ignores .ts, causing CSS to fail in production
- www.jimcresswell.net is the canonical domain; Cloudflare redirects the apex to www
- `tsx` (build scripts) does not resolve TypeScript `@/` path aliases — use relative imports
- "Personal knowledge graph" is the canonical term (not "content entity model")
- Contact email: contact@jimcresswell.net; pronouns: he/him; honorific prefix: Dr (not yet in JSON-LD)
- Skills at `.agent/skills/<name>/SKILL.md` are 3 levels deep — use repo-root-relative inline code paths (`` `docs/architecture/...` ``), not relative markdown links, to avoid depth-counting errors

## Troubleshooting

| Symptom                            | Fix                                                       |
| ---------------------------------- | --------------------------------------------------------- |
| postcss.config.ts silently ignored | Rename to postcss.config.mjs — Turbopack limitation       |
| StrReplace fails on markdown files | Unicode quotes block matching — read the exact text first |
| Prettier reformats code fences     | Language tag `text` applied to bare fences                |

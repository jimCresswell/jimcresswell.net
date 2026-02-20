# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this
before every session. Every entry earned its place by
changing behaviour.

---

## User Preferences

- British spelling, grammar, and date formats
- pnpm only — never npm or yarn
- Plans must be discoverable (linked from parent plan, README, related docs)
- Archive docs are historical records — never update them
- Listen to user priorities, not document structure

## Content and Editorial

- Editorial guidance governs voice; EDRs record specific decisions
- Show, don't justify — describe what was done and what it creates, not why
- "Ecosystem" replaced with concrete language: systems, context, creating conditions for new states
- Oak data is fully sequenced, pedagogically rigorous, released under OGL — use this description consistently
- Product safety (AI services consuming data), not data safety (data is open by design)
- CV register: evidential, precise, agentic, scannable
- Front page register: narrative, reflective, expansive, invitational
- The editor sub-agent is read-only — it provides feedback, the calling agent writes

## Quality Gates

- `pnpm check` runs all six gates: format, lint, type-check, test, knip, gitleaks
- Pre-commit hook runs `pnpm check` — never bypass with `--no-verify`
- E2E tests (`pnpm test:e2e`) are separate — run explicitly
- After any fix, restart the full gate sequence from `pnpm format`
- Never disable checks — fix the root cause

## Testing

- TDD at all levels: unit, integration, E2E
- Test behaviour, not implementation
- No `as`, `any`, `!` — they disable the type system
- No complex mocks — simplify product code instead
- No global state mutation in tests

## Documentation

- TSDoc on all exported functions
- Comments explain why, not what
- Content changes go in `content/*.json`, never in components
- All metadata derives from content JSON files (ADR-007)
- Descriptions in different domains are different artifacts (ADR-011)

## Troubleshooting

| Symptom                             | Fix                                                       |
| ----------------------------------- | --------------------------------------------------------- |
| Pre-commit hook fails on formatting | Run `pnpm format` then retry                              |
| StrReplace fails on markdown files  | Unicode quotes block matching — read the exact text first |
| Prettier reformats code fences      | Language tag `text` applied to bare fences                |

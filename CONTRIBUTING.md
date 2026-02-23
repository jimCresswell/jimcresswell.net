# Contributing

Guidelines for contributing to [www.jimcresswell.net](https://www.jimcresswell.net). Contributions are by invite only, please do not submit unsolicited pull requests.

## Before you start

1. **Set up your environment** — follow the [Getting Started](README.md#getting-started) section in the README. You will need Node.js 24, pnpm, and gitleaks.
2. **Read the development standards** — the authoritative rules for all contributors live in two files within `.agent/directives/`. They are written for AI agents but define the conventions everyone follows:
   - [rules.md](.agent/directives/rules.md) — TDD, type safety, code quality, documentation
   - [testing-strategy.md](.agent/directives/testing-strategy.md) — test types, naming, philosophy

   The sections below summarise the repo-specific details you need day-to-day.

## Workflow

- Work on a **feature branch** and open a pull request. The repository owner commits to `main` directly; other contributors use branches.
- A **pre-commit hook** runs `pnpm check:ci` (read-only quality gates) on every commit — expect ~10–15 seconds. Do not skip it (`--no-verify` is not permitted).
- A **pre-push hook** runs `pnpm check && pnpm test:e2e && pnpm test:e2e:pdf` — the full gate sequence plus all E2E tests. This takes longer but catches issues before they reach the remote.
- If adding an architectural decision, create an ADR in `docs/architecture/decision-records/` following the existing format. See the [ADR index](docs/architecture/decision-records/README.md) for examples.

## Code conventions

These are repo-specific conventions. For general principles (DRY, KISS, YAGNI, SOLID), see [rules.md](.agent/directives/rules.md).

- **File naming** — components are `kebab-case.tsx`, tests use the suffixes `*.unit.test.ts`, `*.integration.test.ts`, `*.e2e-ui.test.ts`, and `*.e2e-api.test.ts`. See [testing-strategy.md](.agent/directives/testing-strategy.md) for the full taxonomy.
- **Server components by default** — only add `"use client"` when browser APIs are needed. Currently three client components: `ThemeToggle`, `ThemeProvider`, `SiteHeader`.
- **Content changes go in JSON** — edit files in `content/`, never component code. See the [content model](docs/architecture/content-model.md) for how content flows to pages.
- **Type safety** — no `as`, `any`, or `!`. Label type imports (`import type`). Full details in [rules.md](.agent/directives/rules.md).
- **TSDoc on all exports** — inline comments explain "why", not "what".

## Testing conventions

Assumes TDD familiarity. For the full philosophy and rules, see [testing-strategy.md](.agent/directives/testing-strategy.md).

- **Unit tests** (`*.unit.test.ts`) — pure functions, no mocks, no IO. Co-located with source.
- **Integration tests** (`*.integration.test.ts`) — React components via RTL + Vitest jsdom. Co-located with source.
- **E2E tests** (`*.e2e-ui.test.ts`, `*.e2e-api.test.ts`) — in `e2e/`. Journeys map to user stories; behaviour tests cover cross-cutting concerns (accessibility, SEO, content integrity). See [e2e/README.md](e2e/README.md) for the full test map.
- **No global state mocking** — product code accepts configuration as parameters. If you need a mock, inject a simple fake as an argument.

## Content and editorial voice

- All user-visible text lives in `content/*.json`. Components render it verbatim — they do not edit, summarise, or reorder it.
- Before any content work, read [editorial-guidance.md](.agent/directives/editorial-guidance.md). It describes Jim's voice, audience, keyword strategy, and editorial principles.
- For how content JSON becomes rendered pages, metadata, and PDF, see the [content model](docs/architecture/content-model.md).

## Troubleshooting

| Problem                           | Solution                                                                                                                                                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gitleaks: command not found`     | Install gitleaks — `brew install gitleaks` on macOS, or see [releases](https://github.com/gitleaks/gitleaks/releases) for other platforms.                                                                                |
| `pnpm check` fails on knip        | Unused export detected. Delete the export, or if it is dynamically used, add a targeted entry to the `knip` field in `package.json`. See [ADR-005](docs/architecture/decision-records/005-knip-unused-code-detection.md). |
| Playwright browsers not installed | Run `pnpm exec playwright install`.                                                                                                                                                                                       |
| PDF not generated locally         | Run `pnpm build` first. `/cv/pdf` redirects to a branded 404 until a build has run.                                                                                                                                       |

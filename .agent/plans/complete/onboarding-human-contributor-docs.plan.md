# Onboarding: human contributor docs

Add conventional, human-facing documentation that a mid-level developer would expect to find. The `.agent/directives/` files remain the authoritative source for rules, testing strategy, and editorial identity — they are not changed. New docs **reference** them to stay DRY.

## Status: Complete

## Principles

- **Do not duplicate `.agent/directives/` content.** New docs summarise, contextualise, and link. The agent directives are the single source of truth.
- **Target audience: mid-level dev.** Assumes familiarity with Next.js App Router, React server/client components, Vitest, Playwright, and TDD. Focuses on repo-specific conventions, not foundational knowledge.
- **Conventional locations.** `CONTRIBUTING.md` at root (GitHub auto-links it from PRs and issues). Content model guide in `docs/architecture/`.
- **British English** throughout, per project convention.

## Files to create/change

| File                                 | Action     | Purpose                                                                  |
| ------------------------------------ | ---------- | ------------------------------------------------------------------------ |
| `CONTRIBUTING.md`                    | **Create** | Workflow, conventions, and "how things work here" for human contributors |
| `docs/architecture/content-model.md` | **Create** | How content JSON becomes rendered pages, metadata, and PDF               |
| `docs/architecture/README.md`        | **Edit**   | Link to new content model doc                                            |
| `README.md`                          | **Edit**   | Link to CONTRIBUTING.md; update Development Standards to reference it    |
| `docs/README.md`                     | **Edit**   | Add content model doc to contents                                        |

No changes to any file in `.agent/directives/`.

---

## Phase 1: CONTRIBUTING.md

**File:** `CONTRIBUTING.md` (root)

### Structure

```
# Contributing

## Before you start
## Workflow
## Code conventions
## Testing conventions
## Content and editorial voice
## Troubleshooting
```

### Section details

**Before you start**

- Link to [README.md](README.md) Getting Started for setup (do not repeat it).
- "Read the development standards" — link to `.agent/directives/rules.md` and `.agent/directives/testing-strategy.md`. Frame as: "These files are written for AI agents but define the authoritative rules for all contributors. The conventions below summarise the repo-specific details you need."
- Note: no branch protection or PR template currently; commit directly to `main`. This may change.

**Workflow**

- Commit directly to `main` (single contributor project, may change).
- Pre-commit hook runs `pnpm check` automatically; expect ~10–15 seconds.
- Run `pnpm test:e2e` separately before significant changes (not in pre-commit hook — too slow).
- If adding an architectural decision, create an ADR in `docs/architecture/decision-records/` following the existing format (link to [ADR index](docs/architecture/decision-records/README.md)).

**Code conventions** (repo-specific, not repeating general principles)

- File naming: components are `kebab-case.tsx`, tests are `*.unit.test.ts` / `*.integration.test.ts` / `*.e2e-ui.test.ts` / `*.e2e-api.test.ts`. Link to [testing-strategy.md](.agent/directives/testing-strategy.md) for the full taxonomy.
- Components: server by default. Only add `"use client"` when browser APIs are needed. Currently three client components: `ThemeToggle`, `ThemeProvider`, `SiteHeader`.
- Content changes: edit JSON in `content/`, never component code. See [content model](docs/architecture/content-model.md).
- Type safety: no `as`, `any`, or `!`. Label type imports. Full details in [rules.md](.agent/directives/rules.md#type-safety).
- TSDoc on all exports. Inline comments for "why", not "what".

**Testing conventions** (repo-specific patterns, assumes TDD familiarity)

- Unit tests (`*.unit.test.ts`): pure functions, no mocks, no IO. Co-located with source.
- Integration tests (`*.integration.test.ts`): React components via RTL + Vitest jsdom. Co-located with source.
- E2E tests (`*.e2e-ui.test.ts`, `*.e2e-api.test.ts`): in `e2e/`. Journeys map to user stories; behaviour tests cover cross-cutting concerns (a11y, SEO, content integrity). See [e2e/README.md](e2e/README.md) for the full test map.
- No mocking global state. Product code accepts configuration as parameters. If you need a mock, inject a simple fake as an argument.
- Full philosophy and rules: [testing-strategy.md](.agent/directives/testing-strategy.md).

**Content and editorial voice**

- All user-visible text lives in `content/*.json`. Components render it verbatim.
- Before any content work, read [editorial-guidance.md](.agent/directives/editorial-guidance.md) — it describes Jim's voice, audience, keyword strategy, and editorial principles.
- Content model details: [docs/architecture/content-model.md](docs/architecture/content-model.md).

**Troubleshooting**

- `gitleaks: command not found` — install gitleaks (`brew install gitleaks` on macOS, see [releases](https://github.com/gitleaks/gitleaks/releases)).
- `pnpm check` fails on knip — unused export detected. Either delete the export or, if it is dynamically used, add a targeted entry to the `knip` field in `package.json`. See [ADR-005](docs/architecture/decision-records/005-knip-unused-code-detection.md).
- Playwright browsers not installed — run `pnpm exec playwright install`.
- PDF not generated locally — run `pnpm build` first. `/cv/pdf` redirects to a branded 404 until a build has run.

### Acceptance criteria

- `CONTRIBUTING.md` exists at the repo root.
- It does not duplicate content from `.agent/directives/` — it summarises and links.
- All internal links resolve.
- A mid-level dev reading it understands: workflow, where tests go, how content works, and where to find the authoritative rules.

---

## Phase 2: Content model guide

**File:** `docs/architecture/content-model.md`

### Purpose

Explain how content JSON becomes rendered pages, derived metadata (Open Graph, JSON-LD, Web App Manifest), and the PDF. Currently this information is scattered across `docs/architecture/README.md` (Content and Metadata table, PDF Generation section) and [ADR-007](docs/architecture/decision-records/007-dry-content-metadata.md). The new doc consolidates it into a single narrative a contributor can follow.

### Structure

```
# Content Model

## Overview
## Content files
## Content to page rendering
## Tilt variants
## Derived metadata
## PDF generation
## Adding or changing content
```

### Section details

**Overview** — One paragraph: all user-visible text originates from JSON files in `content/`. Components render content verbatim. Metadata is derived at build/render time so editorial changes flow through a single source of truth.

**Content files** — Describe `cv.content.json` structure (meta, positioning, experience, prior_roles, capabilities, education, links, tilts) and `frontpage.content.json`. Not a full schema — a navigable overview of what lives where.

**Content to page rendering** — How `app/cv/page.tsx` imports content via `lib/cv-content.ts`, passes it to `<CvLayout>`, which delegates to `<PageSection>`, `<ArticleEntry>`, `<Prose>`, `<RichText>`. Inline markdown (`[text](url)`, `_emphasis_`) is parsed by `lib/parse-markdown-links.tsx`. Mention that `lib/strip-inline-markdown.ts` strips this for plain-text contexts (e.g. `<meta>` descriptions).

**Tilt variants** — How `tilts` in the content JSON work: `_meta.web_routes` defines URL slugs, each variant key maps to alternative positioning text. `generateStaticParams` generates routes. Shared sections are not duplicated.

**Derived metadata** — Reference the table from `docs/architecture/README.md` (Open Graph, JSON-LD, Web App Manifest, page title). Link to [ADR-007](decision-records/007-dry-content-metadata.md) for the rationale. Mention that `lib/jsonld.ts` contains structured-data-specific constants not in the content file.

**PDF generation** — Brief: build-time Puppeteer renders `/cv` with `@media print` CSS. Link to [ADR-001](decision-records/001-build-time-pdf-generation.md) and [ADR-002](decision-records/002-pdf-serving-architecture.md) for full details. Note that content changes automatically flow to the PDF on next build.

**Adding or changing content** — Practical guidance: edit the JSON, run `pnpm dev` to preview, run `pnpm check` (content integrity E2E tests verify rendered content matches JSON). For new tilt variants: add the variant key to `tilts`, add the slug to `tilts._meta.web_routes`, and `generateStaticParams` picks it up automatically. Link to editorial-guidance.md for editorial voice.

### Acceptance criteria

- `docs/architecture/content-model.md` exists.
- It does not duplicate the architecture README or ADRs wholesale — it summarises, contextualises, and links.
- A contributor reading it understands how to change content and what happens downstream.
- All internal links resolve.

---

## Phase 3: Cross-linking

### Task 3.1: Update README.md

In the `## Development Standards` section, add a bullet for CONTRIBUTING.md at the top of the list:

```markdown
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Workflow, conventions, and troubleshooting for contributors
```

### Task 3.2: Update docs/architecture/README.md

In the Content and Metadata section (or after it), add a note:

```markdown
For a full walkthrough of the content model, see [content-model.md](content-model.md).
```

### Task 3.3: Update docs/README.md

Add the content model doc to the Related section or the architecture contents description as appropriate.

### Acceptance criteria

- README.md Development Standards links to CONTRIBUTING.md.
- Architecture README links to the content model doc.
- docs/README.md references the content model doc.
- No dead links anywhere in the documentation thread.

---

## Phase 4: Quality gates and commit

1. Run `pnpm format && pnpm check`.
2. Run `pnpm test:e2e`.
3. Walk the onboarding thread: README → CONTRIBUTING → rules/testing-strategy (via links) → content model → architecture → ADRs.
4. Commit with message: `Add CONTRIBUTING.md and content model guide for human contributors`.
5. Do not push.

---

## Files affected

| File                                 | Phase | Changes                                                                 |
| ------------------------------------ | ----- | ----------------------------------------------------------------------- |
| `CONTRIBUTING.md`                    | 1     | Create: workflow, conventions, testing, content, troubleshooting        |
| `docs/architecture/content-model.md` | 2     | Create: content model narrative with rendering, variants, metadata, PDF |
| `README.md`                          | 3     | Add CONTRIBUTING.md to Development Standards                            |
| `docs/architecture/README.md`        | 3     | Link to content model doc                                               |
| `docs/README.md`                     | 3     | Reference content model doc                                             |

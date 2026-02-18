---
name: Implement contributor docs plan
overview: Create `CONTRIBUTING.md` and `docs/architecture/content-model.md`, then cross-link from existing READMEs. All content references `.agent/directives/` without duplicating it, targeting a mid-level developer audience.
todos:
  - id: phase-1-contributing
    content: Create CONTRIBUTING.md at repo root with six sections (Before you start, Workflow, Code conventions, Testing conventions, Content and editorial voice, Troubleshooting)
    status: completed
  - id: phase-2-content-model
    content: Create docs/architecture/content-model.md with seven sections covering the full content rendering pipeline
    status: completed
  - id: phase-3-crosslinks
    content: Add cross-links in README.md (Development Standards), docs/architecture/README.md (Content and Metadata), and docs/README.md (Related)
    status: completed
  - id: phase-4-quality
    content: Run quality gates (pnpm format, pnpm check, pnpm test:e2e), verify links, and commit
    status: completed
isProject: false
---

# Implement Human Contributor Docs

Implements [onboarding-human-contributor-docs.plan.md](.agent/plans/onboarding-human-contributor-docs.plan.md) across four phases.

## Phase 1: Create CONTRIBUTING.md

**File:** [CONTRIBUTING.md](CONTRIBUTING.md) (new)

Six sections, each summarising repo-specific conventions and linking to `.agent/directives/` as the authoritative source:

- **Before you start** -- link to [README.md](README.md) Getting Started, frame `.agent/directives/rules.md` and `testing-strategy.md` as "written for AI agents but authoritative for all contributors".
- **Workflow** -- contributors work on feature branches and open PRs. Pre-commit hook runs `pnpm check` (~10-15s). Run `pnpm test:e2e` separately before significant changes. ADR creation guidance.
- **Code conventions** -- file naming (`kebab-case.tsx`, test suffixes), server-by-default (three client components: `ThemeToggle`, `ThemeProvider`, `SiteHeader`), content edits in JSON only, type safety rules (no `as`/`any`/`!`), TSDoc requirement.
- **Testing conventions** -- unit/integration/E2E taxonomy with file patterns and locations, no global state mocking, link to `testing-strategy.md` and `e2e/README.md`.
- **Content and editorial voice** -- content lives in `content/*.json`, link to `identity.md` for voice, link to content model doc.
- **Troubleshooting** -- gitleaks install, knip failures, Playwright browsers, PDF not generated locally.

All internal links must use relative paths from repo root.

## Phase 2: Create content-model.md

**File:** [docs/architecture/content-model.md](docs/architecture/content-model.md) (new)

Consolidates the content rendering pipeline into a single narrative. Seven sections:

- **Overview** -- one paragraph: JSON in `content/` is the single source of truth, components render verbatim, metadata derived at build/render time.
- **Content files** -- describe `cv.content.json` top-level keys (`meta`, `positioning`, `experience`, `prior_roles`, `capabilities`, `education`, `links`, `tilts`) and `frontpage.content.json` (`meta`, `hero`, `links`, `machine_readable_ref`). Navigable overview, not a full schema.
- **Content to page rendering** -- data flow:
  - `app/cv/page.tsx` imports `cvContent` from `lib/cv-content.ts` (which re-exports `cv.content.json`)
  - Passes `content` and `positioning` to `CVLayout`
  - `CVLayout` delegates to `PageSection`, `ArticleEntry`, `Prose`
  - `Prose` wraps `RichText`, which calls `parseMarkdownLinks()` from `lib/parse-markdown-links.tsx`
  - `stripInlineMarkdown()` from `lib/strip-inline-markdown.ts` for plain-text contexts
- **Tilt variants** -- `tilts._meta.web_routes` defines URL slugs, `app/cv/[variant]/page.tsx` uses `generateStaticParams()` with `activeTiltKeys`, each variant shares all sections but substitutes positioning text, canonical URL points to `/cv/`.
- **Derived metadata** -- reference the Content and Metadata table from [docs/architecture/README.md](docs/architecture/README.md) (OG, JSON-LD, Manifest, title), link to ADR-007, note `lib/jsonld.ts` constants (`KNOWS_ABOUT`, `OCCUPATION`, `CREDENTIAL_DETAILS`, `PUBLICATIONS`).
- **PDF generation** -- brief: build-time Puppeteer renders `/cv` with `@media print` CSS, link to ADR-001 and ADR-002.
- **Adding or changing content** -- edit JSON, `pnpm dev` to preview, `pnpm check` runs content integrity E2E tests, tilt variant addition steps, link to `identity.md`.

## Phase 3: Cross-linking

Three edits to existing files:

### 3.1 [README.md](README.md)

In the `## Development Standards` section, add a bullet at the **top** of the list:

```markdown
- `[CONTRIBUTING.md](CONTRIBUTING.md)` — Workflow, conventions, and troubleshooting for contributors
```

Current first bullet is at line 179 (`.agent/directives/AGENT.md`).

### 3.2 [docs/architecture/README.md](docs/architecture/README.md)

After the Content and Metadata section (after line 37, below the JSON-LD paragraph), add:

```markdown
For a full walkthrough of the content model, see [content-model.md](content-model.md).
```

### 3.3 [docs/README.md](docs/README.md)

Add the content model doc to the Related section (after the existing bullets):

```markdown
- [Content model](architecture/content-model.md) — How content JSON becomes rendered pages, metadata, and PDF
```

## Phase 4: Quality gates and commit

1. `pnpm format` then `pnpm check` (format, lint, type-check, test, knip, gitleaks)
2. `pnpm test:e2e`
3. Verify all internal links resolve (walk the thread: README -> CONTRIBUTING -> rules/testing-strategy -> content model -> architecture -> ADRs)
4. Commit: `Add CONTRIBUTING.md and content model guide for human contributors`
5. Do not push

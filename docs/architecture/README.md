# Architecture

## Overview

`www.jimcresswell.net` is a Next.js 16 application using the App Router,
deployed on Vercel. Editorial prose and shared identity atoms are rendered from
JSON files in `content/`; structural UI labels remain component-owned.

## Repo-Specific Operational Constraints

- The canonical public host is `www.jimcresswell.net`; Cloudflare redirects
  the apex domain to `www` before requests reach Vercel.
- `postcss.config` must remain `postcss.config.mjs`; Turbopack silently
  ignores a TypeScript PostCSS config in production builds.
- `scripts/*.ts` executed via `tsx` do not resolve the app's `@/` path
  aliases; use relative imports in build-time scripts.

## Key Principles

- **Server components by default** — Client components only where browser APIs are needed (theme toggle, theme provider, site header).
- **Content-driven rendering** — Editorial prose lives in page-composition JSON,
  while shared identity atoms and the machine-readable graph live in
  `content/entities.json`. Server composition injects identity props into
  generic site chrome. Inline markdown is parsed by `parseMarkdownLinks`.
- **Build-time PDF generation** — CV PDF generated at build time with full Chrome, served from our own URL.
- **Accessible** — WCAG 2.2 AA target throughout. Semantic HTML, heading hierarchy, visible focus indicators, 44px touch targets.
- **No decorative elements** — Editorial aesthetic. UI controls are text-only. No icons, charts, or illustrations.

## Routes

| Route                 | Type          | Purpose                                                                    |
| --------------------- | ------------- | -------------------------------------------------------------------------- |
| `/`                   | Page          | Home — personal narrative with inline links to CV, GitHub, Scholar, etc.   |
| `/cv`                 | Page          | Primary CV — positioning, experience, prior roles, capabilities, education |
| `/cv/pdf`             | Route Handler | Serves PDF binary (download or inline display)                             |
| `/cv/pdf/unavailable` | Page          | Branded 404 when PDF is not available                                      |
| `/api/graph`          | Route Handler | Full JSON-LD knowledge graph as `application/json`                         |
| `/api/accept-md`      | Route Handler | Public, proxy-oriented Markdown handler with its own route allowlist       |

## Content Negotiation

The home and canonical CV documents support multiple representations via the
Next.js proxy (`proxy.ts`). Native subroutes and missing routes retain their
own responses. See
[ADR-009](decision-records/009-content-negotiation-proxy.md) and
[ADR-010](decision-records/010-canonical-url-graph-identity.md).

| Mechanism                     | Returns                         | Example                                   |
| ----------------------------- | ------------------------------- | ----------------------------------------- |
| `Accept: text/markdown`       | Markdown with YAML frontmatter  | `curl -H "Accept: text/markdown" /cv`     |
| `.md` suffix                  | Markdown (browser-friendly)     | `/cv.md` or `/cv/index.md`                |
| `Accept: application/ld+json` | Full Schema.org knowledge graph | `curl -H "Accept: application/ld+json" /` |
| `/api/graph`                  | Full Schema.org knowledge graph | Direct access, no content negotiation     |
| Default (browser)             | HTML                            | Normal page rendering                     |

The canonical URL for the knowledge graph is `https://www.jimcresswell.net/`.
Requesting `/` or `/cv` with `Accept: application/ld+json` returns the full
graph — the graph models the person, not the page. Each supported editorial
HTML document embeds a page-specific view of the full entity model.

## Content & Metadata

Editorial prose and shared identity atoms originate from JSON files in
`content/`, but the repo does not yet have one unified graph-backed source of
truth for full page composition and machine-readable outputs.

The current implementation uses two related layers:

- page-composition JSON for editorial prose and page-specific metadata
- the entity graph in `content/entities.json` for shared identity atoms,
  JSON-LD, the manifest, and graph-facing metadata

[ADR-014](decision-records/014-entity-model-design.md) records the target
layered design in which the site becomes a view onto graph-owned structures.
The table below describes the current implementation truth.

| Output               | Constructed in                                                                                                                                      | Source fields used                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Site URL             | `lib/site-config.ts`                                                                                                                                | Vercel env vars (`VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`, `VERCEL_ENV`)                    |
| Open Graph (CV page) | `lib/cv-content.ts`                                                                                                                                 | `Person.name`, `Person.description`, CV locale, `SITE_URL`                                       |
| Open Graph (site)    | `app/layout.tsx`                                                                                                                                    | `Person.name`, `frontpage.meta.description`, `SITE_URL`                                          |
| JSON-LD              | `content/entities.json`, `lib/entities.ts`, `lib/page-document-contract.ts`, `lib/page-jsonld.ts`, `lib/jsonld.ts`, `lib/search-structured-data.ts` | Entity graph, canonical page identity, URL rewriting, page subgraphs, and rich-result validation |
| Web App Manifest     | `app/manifest.ts`                                                                                                                                   | `Person.name`, `Person.description`                                                              |
| Robots               | `app/robots.ts`                                                                                                                                     | `SITE_URL`                                                                                       |
| Sitemap              | `app/sitemap.ts`                                                                                                                                    | `SITE_URL`, canonical home and CV routes                                                         |
| Page `<title>`       | Page metadata exports                                                                                                                               | `Person.name` plus page role                                                                     |

The JSON-LD graph now derives from the entity model in `content/entities.json`, validated by `lib/entities.ts`, exposed as the full graph by `lib/jsonld.ts`, and sliced into page-specific subgraphs by `lib/page-jsonld.ts`. Structured-data-specific content such as publications, `knowsAbout`, occupation metadata, and abstract identity entities now lives in the entity graph rather than as module constants.

The shared page/document contract defines section anchors and canonical page
identity for the home and CV pages. ADR-020 records the bounded graph-owned
identity atoms; ADR-021 records the retirement of tilt routes and the resulting
single canonical CV identity.

For a full walkthrough of the content model, see [content-model.md](content-model.md).

## Regression Proofing

The repo includes a non-destructive visual regression harness at `visual-regression-harness/` for ref-to-ref comparison during structural refactors.

- CLI entrypoint: `pnpm visual-regression-harness <base-ref> <target-ref>`
- Special source value: `WORKTREE` snapshots the current live repo state (tracked, staged, unstaged, and untracked non-ignored files) against a known-good git ref
- Safety model: reads refs with `git rev-parse`, exports git refs with `git archive`, exports `WORKTREE` by overlaying live changes onto an archive of `HEAD`, builds only in temporary directories, and does not touch the caller's worktree, index, refs, or history
- Output: durable artefacts under `regression-artifacts/visual-regression-harness/`, including full-page screenshots, selected region screenshots, always-written PNG diff images, `*.review.png` strips, HTML artefacts, metadata JSON, `diff/summary.json`, and top-level `summary.txt`
- Review model: the harness records unexpected differences for approval or rejection; it is a review workflow, not a pass/fail quality gate
- Configuration boundary: `visual-regression.config.ts` owns this repository's routes, named regions, expected section IDs, and bounded allowances; the generic harness validates and consumes that injected policy without importing product source
- Comparison standard: screenshots remain strict; `document.html` is explicitly normalised to remove build-specific Next.js and Vercel runtime noise; target-only CV section-anchor additions are auto-accepted only when the injected route policy explicitly permits IDs derived from the shared page/document contract
- Current limitation: capture reuse and `--force` are not implemented yet; each run rebuilds and recaptures from scratch
- Process rule: for rendering-risk changes to the current captured site
  surfaces (`/` and `/cv`), the harness is blocking proof and
  should be run during implementation, not only at the end

See `visual-regression-harness/README.md` and [ADR-016](decision-records/016-review-oriented-visual-regression-harness.md) for operational details and the settled comparison model.

## PDF Generation

The CV PDF is generated at build time using Puppeteer with full Chrome for Testing. The build script (`scripts/generate-pdf.ts`) runs after `next build`, starts a local Next.js server, renders `/cv`, and stores the PDF in Vercel Blob (production) or the local filesystem (local builds).

At runtime, the Route Handler at `app/cv/pdf/route.ts` serves the PDF binary from our own URL. Two sources are tried in order: Vercel Blob (when `BLOB_READ_WRITE_TOKEN` is set), then the local filesystem (`.next/Jim-Cresswell-CV.pdf`). If neither has a PDF, the user is redirected to a branded 404 page.

### Environment Variables

| Variable                | Scope           | Source                                  | Purpose                                           |
| ----------------------- | --------------- | --------------------------------------- | ------------------------------------------------- |
| `BLOB_READ_WRITE_TOKEN` | Build + Runtime | Vercel Dashboard → Storage → Blob Store | Read/write access to Vercel Blob                  |
| `VERCEL_GIT_COMMIT_SHA` | Build + Runtime | Provided by Vercel automatically        | Deploy key for PDF versioning                     |
| `VERCEL_DEPLOYMENT_ID`  | Build + Runtime | Provided by Vercel automatically        | Fallback deploy key                               |
| `PUPPETEER_CACHE_DIR`   | Build           | Vercel project settings                 | Stores Chrome in cached `node_modules/` directory |
| `LOG_LEVEL`             | Build           | Vercel project settings                 | Controls `pino` log verbosity (default: `info`)   |

### Local Development

```bash
pnpm build          # next build + PDF generation → .next/Jim-Cresswell-CV.pdf
pnpm start          # serves the PDF at /cv/pdf from local filesystem
```

Without a prior build, `/cv/pdf` redirects to `/cv/pdf/unavailable` (branded 404).

To test the full Blob path locally, add `BLOB_READ_WRITE_TOKEN` to `.env.local` (from Vercel Dashboard → Storage).

### Operational Notes

- **Build time**: PDF generation adds ~10–15s to the build (start server, launch Chrome, render, store).
- **Chrome installation**: Chrome for Testing (~280 MB) is installed via `npx puppeteer browsers install chrome` in the `buildCommand`. `PUPPETEER_CACHE_DIR=./node_modules/.cache/puppeteer` ensures the binary persists in Vercel's cached `node_modules/` between builds. See [ADR-001](decision-records/001-build-time-pdf-generation.md) for the rationale behind `buildCommand` over `installCommand`.
- **System libraries**: Vercel's Amazon Linux 2023 image is missing several Chrome dependencies (`nss`, `mesa-libgbm`). These are installed via `dnf` in `buildCommand` on every build (system packages are not cached between builds).
- **Logging**: `pino` provides structured logging throughout `scripts/generate-pdf.ts`. Set `LOG_LEVEL=debug` in Vercel project settings for verbose build diagnostics.
- **Every build regenerates**: The PDF is regenerated on every production build (`allowOverwrite: true`). Since content is static per deploy, this ensures the PDF always matches the deployed code.
- **PDF size**: ~192 KB. Well within Vercel Blob's 4.5 MB server upload limit.
- **Serving cost**: Route Handler proxies ~192 KB per request. CDN-cached with `Cache-Control: public, max-age=31536000, immutable`.
- **Stale blobs**: Old deploy PDFs remain in Blob but are never referenced. Clean up if storage costs become relevant.
- **Fonts**: Full Chrome includes standard font rendering. Web fonts (Inter, Literata) are loaded via `next/font`; `networkidle0` + `document.fonts.ready` ensures they render correctly.
- **Accessible PDFs**: Full Chrome with `headless: true` produces tagged/accessible PDFs (unlike `@sparticuz/chromium`'s stripped build).
- **Dark mode**: Print CSS forces `background: white; color: #1a1a1a` inside `@media print`, so dark mode preferences do not affect PDF output.

## Decision Records

All significant architectural decisions are recorded as ADRs in [decision-records/](decision-records/). Editorial decisions about content framing, voice, and language are recorded as EDRs in [../editorial/decision-records/](../editorial/decision-records/).

| ADR                                                                          | Title                                                             |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [001](decision-records/001-build-time-pdf-generation.md)                     | Build-time PDF generation with Puppeteer                          |
| [002](decision-records/002-pdf-serving-architecture.md)                      | PDF serving via Route Handler at /cv/pdf                          |
| [003](decision-records/003-print-button-removed.md)                          | Print button removed in favour of PDF download                    |
| [004](decision-records/004-storybook-deferred.md)                            | Storybook deferred in favour of RTL + Vitest                      |
| [005](decision-records/005-knip-unused-code-detection.md)                    | Knip for unused code and dependency detection                     |
| [006](decision-records/006-header-responsive-layout.md)                      | Header responsive layout                                          |
| [007](decision-records/007-dry-content-metadata.md)                          | DRY content and metadata consolidation                            |
| [008](decision-records/008-schema-org-compliance.md)                         | Schema.org compliance for the knowledge graph                     |
| [009](decision-records/009-content-negotiation-proxy.md)                     | Content negotiation via Next.js proxy                             |
| [010](decision-records/010-canonical-url-graph-identity.md)                  | Canonical URL and graph identity                                  |
| [011](decision-records/011-domain-appropriate-descriptions.md)               | Domain-appropriate descriptions                                   |
| [012](decision-records/012-agent-memory-pipeline.md)                         | Agent memory pipeline                                             |
| [013](decision-records/013-security-headers.md)                              | Security headers and Content Security Policy                      |
| [014](decision-records/014-entity-model-design.md)                           | Entity model design for the personal knowledge graph              |
| [015](decision-records/015-codex-adapter-model.md)                           | Codex adapter model for skills, reviewers, and always-on guidance |
| [016](decision-records/016-review-oriented-visual-regression-harness.md)     | Review-oriented visual regression harness for exported refs       |
| [017](decision-records/017-cv-tilt-routes-are-canonical-aliases.md)          | CV tilt routes were canonical aliases (superseded by ADR-021)     |
| [018](decision-records/018-practice-context-adjunct-for-plasmid-exchange.md) | Practice-context adjunct for plasmid exchange                     |
| [019](decision-records/019-playwright-against-production-build.md)           | Playwright runs against a production build                        |
| [020](decision-records/020-entity-model-source-of-truth-for-shared-atoms.md) | Entity model is the source of truth for shared identity atoms     |
| [021](decision-records/021-canonical-only-cv-identity.md)                    | Canonical-only CV identity                                        |

The retired tilt content and its former canonical-alias rationale are preserved
in the [CV tilt reference](reference/cv-tilt-content-and-rationale.md).

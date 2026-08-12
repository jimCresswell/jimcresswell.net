# Content Model

How content JSON becomes rendered pages, derived metadata, the PDF, and machine-readable representations.

## Overview

Editorial content and shared identity atoms originate from JSON files in
`content/`. Components render editorial content verbatim; structural UI labels
and accessibility text remain component-owned.

The current implementation has **two related content layers**, not one unified
source of truth:

- page-composition JSON (`content/cv.content.json` and
  `content/frontpage.content.json`) drives visible editorial prose and
  page-specific metadata
- entity-graph JSON (`content/entities.json`) drives JSON-LD, the manifest, and
  shared identity atoms such as the person's name, email, description, and
  profile URLs

The site therefore has a strong structured-data layer, but it is **not yet** a
graph-backed page-composition system. [ADR-014](decision-records/014-entity-model-design.md)
records the target layered design; this document describes the current
implementation truth.

## Content files

### cv.content.json

The primary content file. Top-level keys:

| Key            | Purpose                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------- |
| `meta`         | Canonical headline and locale                                                                |
| `positioning`  | Positioning paragraphs at the top of the CV                                                  |
| `experience`   | Work history entries (organisation, role, years, summary paragraphs)                         |
| `prior_roles`  | Pre-Oak career entries, rendered under “Before Oak”                                          |
| `capabilities` | Capability claims with inline markdown links                                                 |
| `education`    | Degrees (degree, field, institution)                                                         |
| `links`        | Editorial links that are not identity profiles; currently the personal project link for Shiv |

### frontpage.content.json

Content for the home page at `/`. Top-level keys:

| Key    | Purpose                                                                            |
| ------ | ---------------------------------------------------------------------------------- |
| `meta` | Site section, page identifier, description (short social-card summary), and locale |
| `hero` | Home-page summary paragraphs                                                       |

## Content to page rendering

The CV page builds positioning from the editorial `cvContent` accessor and
passes `cvLayoutContent` to `CVLayout`. That composition accessor injects the
Person-owned name and email into the page JSON before rendering. The root
server layout resolves the same Person identity and injects the name and
profile links into generic `SiteHeader` and `SiteFooter` components.

`CVLayout` (`components/cv-layout.tsx`) is the main orchestrator. It delegates to:

- **`PageSection`** (`components/page-section.tsx`) — semantic `<section>` with an accessible `<h2>` heading
- **`ArticleEntry`** (`components/article-entry.tsx`) — an entry with heading, optional meta line (role, years), and body content
- **`Prose`** (`components/prose.tsx`) — paragraph wrapper that renders content through `RichText`
- **`RichText`** (`components/rich-text.tsx`) — calls `parseMarkdownLinks()` to convert inline markdown to React elements

Content strings may include inline markdown: `[text](url)` for links and `_text_` for emphasis. `parseMarkdownLinks()` in `lib/parse-markdown-links.tsx` parses these into React elements — relative URLs become Next.js `<Link>` components, external URLs become `<a target="_blank">`.

For plain-text contexts (e.g. `<meta>` descriptions, accessibility labels), `stripInlineMarkdown()` in `lib/strip-inline-markdown.ts` removes this markup, leaving only the visible text.

## Canonical CV identity

The site exposes one editorial CV document at `/cv/`. Former audience-tilt
routes and content are retired; old tilt slugs such as `/cv/public_sector`
return the branded 404, while the deliberate PDF subroutes remain. ADR-021
records the current decision, and the removed editorial material remains in the
[CV tilt reference](reference/cv-tilt-content-and-rationale.md) if a future
product requirement justifies a deliberate re-entry.

## Derived metadata

Metadata is derived from the current content layers rather than from one
unified source. The [Content & Metadata](README.md#content--metadata) section
in the architecture overview has the full derivation table showing which module
constructs each output and which source fields it uses.

Current ownership looks like this:

| Concern               | Current owner                                               | Notes                                                   |
| --------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| Visible page prose    | `content/cv.content.json`, `content/frontpage.content.json` | Primary source for editorial HTML                       |
| Shared identity atoms | `content/entities.json`                                     | Name, email, description, and profile URLs              |
| Graph entities        | `content/entities.json`                                     | Canonical machine-readable entity model                 |
| JSON-LD               | Graph-derived                                               | Strong integration                                      |
| Manifest              | Graph-derived                                               | Strong integration                                      |
| OG and some metadata  | Mixed                                                       | Graph identity plus page-specific editorial description |
| Page composition      | Page content JSON plus injected identity props              | Not fully graph-derived                                 |

The structured-data-specific content that used to live as JSON-LD module constants now lives in `content/entities.json` as part of the personal knowledge graph. `lib/entities.ts` validates that graph, `lib/jsonld.ts` exposes the full graph, `lib/page-jsonld.ts` derives page-specific subgraphs, and `lib/page-document-contract.ts` defines the page-level anchor and canonical-identity contract those subgraphs must honour.

When structural refactors need before/after proof rather than correctness against the current source, use `pnpm visual-regression-harness <base-ref> <target-ref>`. That harness captures HTML and pixel artifacts from exported git refs without touching the live worktree.

For the rationale behind the page-content layer, see
[ADR-007](decision-records/007-dry-content-metadata.md). For the target layered
graph design, see [ADR-014](decision-records/014-entity-model-design.md).

## PDF generation

The CV PDF is generated at build time using Puppeteer, which renders `/cv` with the `@media print` CSS from `app/globals.css`. Content changes automatically flow to the PDF on the next build — no separate step is needed.

For the full generation pipeline and serving architecture, see the [PDF Generation](README.md#pdf-generation) section in the architecture overview, [ADR-001](decision-records/001-build-time-pdf-generation.md), and [ADR-002](decision-records/002-pdf-serving-architecture.md).

## Machine-readable representations

The home and canonical CV documents support multiple output formats via
content negotiation (see
[ADR-009](decision-records/009-content-negotiation-proxy.md)). The Next.js
proxy (`proxy.ts`) inspects eligible requests and rewrites them to the
appropriate handler; native subroutes and missing routes pass through:

| Format   | Access                                                              | Source                                                                 |
| -------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| HTML     | Default browser request                                             | Page JSON plus injected graph-owned identity atoms                     |
| Markdown | `Accept: text/markdown`, or `.md` suffix (`/cv.md`, `/cv/index.md`) | HTML converted by `accept-md-runtime`                                  |
| JSON-LD  | `Accept: application/ld+json` on `/` or `/cv`, or `/api/graph`      | Entity graph from `content/entities.json`, exposed via `lib/jsonld.ts` |
| PDF      | `/cv/pdf`                                                           | Build-time Puppeteer render of `/cv`                                   |

The knowledge graph (`/api/graph`) returns the full Schema.org `@graph`, as do
negotiated requests to either supported editorial document — the graph models
the person, not the page. See
[ADR-010](decision-records/010-canonical-url-graph-identity.md) for the
rationale.

On the supported editorial documents, the site header exposes MD and DATA
(JSON-LD) links; the canonical CV also exposes PDF. Other routes omit the
unsupported MD control while retaining direct DATA access.

## Adding or changing content

1. **Edit the owning JSON** — change CV or home prose and the home social
   description in their page-composition files. Change the Person name, email,
   short description, or identity-profile URLs in `content/entities.json`.
   Other graph facts and machine-readable entities also belong there.
2. **Preview** — run `pnpm dev` and check the result at `http://localhost:3000`.
3. **Validate** — run `pnpm check`. The content integrity E2E tests verify that rendered content matches the JSON source.
4. **Editorial voice** — before writing or editing any content, read [editorial-guidance.md](../../.agent/directives/editorial-guidance.md) for Jim's voice, audience, and editorial principles.

Reintroducing CV tilts is an architectural and product decision, not a content
edit. Start from the preserved tilt reference and write a new plan and ADR.

## Presentation text

Not all user-visible text lives in `content/` JSON files. Some text is hardcoded in components or page files because it is structural rather than editorial:

- **Section headings** — "Experience", "Before Oak", "Capabilities", "Education" in `components/cv-layout.tsx`
- **Navigation and UI labels** — site header links ("CV", "MD", "DATA", "PDF"), theme toggle labels
- **Error pages** — `app/not-found.tsx`, `app/cv/pdf/unavailable/page.tsx`
- **Accessibility labels** — `aria-label` attributes on interactive elements

These are presentation concerns, not content in the editorial sense, and do not need to follow the content derivation chain. If a heading or label needs to change, edit it directly in the component.

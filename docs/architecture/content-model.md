# Content Model

How content JSON becomes rendered pages, derived metadata, the PDF, and machine-readable representations.

## Overview

All user-visible text originates from JSON files in `content/`. Components render content verbatim — they do not edit, summarise, or reorder it. Metadata (Open Graph, JSON-LD, Web App Manifest, page titles) is derived at build or render time, so editorial changes flow through a single source of truth. See [ADR-007](decision-records/007-dry-content-metadata.md) for the rationale behind this approach.

## Content files

### cv.content.json

The primary content file. Top-level keys:

| Key            | Purpose                                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `meta`         | Name, headline(s), summary, locale — used for page metadata and structured data. `headline_alt` (optional) enables an interactive toggle between two headlines on screen; print always uses `headline` |
| `positioning`  | Default positioning paragraphs (the narrative at the top of the CV)                                                                                                                                    |
| `experience`   | Work history entries (organisation, role, years, summary paragraphs)                                                                                                                                   |
| `prior_roles`  | Pre-Oak career entries (title, description paragraphs). Renders under the heading "Before Oak"                                                                                                         |
| `capabilities` | Capability claims — strings with inline markdown links, same format as experience summaries                                                                                                            |
| `education`    | Degrees (degree, field, institution)                                                                                                                                                                   |
| `links`        | Contact and profile URLs (email, LinkedIn, GitHub, Google Scholar, shiv)                                                                                                                               |
| `tilts`        | Variant positioning for different audiences — see [Tilt variants](#tilt-variants) below                                                                                                                |

### frontpage.content.json

Content for the home page at `/`. Top-level keys:

| Key     | Purpose                                                                                              |
| ------- | ---------------------------------------------------------------------------------------------------- |
| `meta`  | Site section, page identifier, title, description (short OG-length summary for social cards), locale |
| `hero`  | Name and summary paragraphs                                                                          |
| `links` | Profile URLs (LinkedIn, GitHub, Google Scholar)                                                      |

## Content to page rendering

The CV page (`app/cv/page.tsx`) imports `cvContent` from `lib/cv-content.ts`, which re-exports `content/cv.content.json`. The page builds a positioning element from `cvContent.positioning.paragraphs` and passes both `content` and `positioning` to `CVLayout`.

`CVLayout` (`components/cv-layout.tsx`) is the main orchestrator. It delegates to:

- **`PageSection`** (`components/page-section.tsx`) — semantic `<section>` with an accessible `<h2>` heading
- **`ArticleEntry`** (`components/article-entry.tsx`) — an entry with heading, optional meta line (role, years), and body content
- **`Prose`** (`components/prose.tsx`) — paragraph wrapper that renders content through `RichText`
- **`RichText`** (`components/rich-text.tsx`) — calls `parseMarkdownLinks()` to convert inline markdown to React elements

Content strings may include inline markdown: `[text](url)` for links and `_text_` for emphasis. `parseMarkdownLinks()` in `lib/parse-markdown-links.tsx` parses these into React elements — relative URLs become Next.js `<Link>` components, external URLs become `<a target="_blank">`.

For plain-text contexts (e.g. `<meta>` descriptions, accessibility labels), `stripInlineMarkdown()` in `lib/strip-inline-markdown.ts` removes this markup, leaving only the visible text.

## Tilt variants

Tilt variants allow the CV to present different positioning text for different audiences while sharing all other sections (experience, prior_roles, capabilities, education).

Variants are defined in `cv.content.json` under `tilts`:

- `tilts._meta.web_routes` — an array of variant keys that should have web routes (currently `["public_sector"]`)
- `tilts._meta.primary` — the default variant key
- `tilts._meta.order` — display ordering
- Each variant key (e.g. `public_sector`) maps to an object with `context` (short label) and `positioning` (the alternative narrative)

`app/cv/[variant]/page.tsx` uses `generateStaticParams()` to create a static route for each entry in `activeTiltKeys` (derived from `tilts._meta.web_routes` in `lib/cv-content.ts`). At render time, invalid variant slugs return a 404 via `notFound()`. Each variant page sets its canonical URL to `/cv/` via `alternates.canonical`.

To add a new variant: add the variant key and content to `tilts`, add the slug to `tilts._meta.web_routes`, and `generateStaticParams` picks it up automatically.

## Derived metadata

All metadata is derived from `cv.content.json` so that editorial changes propagate everywhere automatically. The [Content & Metadata](README.md#content--metadata) section in the architecture overview has the full derivation table showing which module constructs each output (Open Graph, JSON-LD, Web App Manifest, page title) and which source fields it uses.

`lib/jsonld.ts` also contains structured-data-specific constants that have no editorial equivalent in the content file: `KNOWS_ABOUT` (topic expertise), `OCCUPATION` (occupation metadata), `CREDENTIAL_DETAILS` (degree details), and `PUBLICATIONS` (thesis and publication records). These are designed for search engines and AI systems rather than human readers.

For the rationale behind this single-source approach, see [ADR-007](decision-records/007-dry-content-metadata.md).

## PDF generation

The CV PDF is generated at build time using Puppeteer, which renders `/cv` with the `@media print` CSS from `app/globals.css`. Content changes automatically flow to the PDF on the next build — no separate step is needed.

For the full generation pipeline and serving architecture, see the [PDF Generation](README.md#pdf-generation) section in the architecture overview, [ADR-001](decision-records/001-build-time-pdf-generation.md), and [ADR-002](decision-records/002-pdf-serving-architecture.md).

## Machine-readable representations

Every page supports multiple output formats via content negotiation (see [ADR-009](decision-records/009-content-negotiation-proxy.md)). The Next.js proxy (`proxy.ts`) inspects the request and rewrites to the appropriate handler:

| Format   | Access                                                              | Source                                       |
| -------- | ------------------------------------------------------------------- | -------------------------------------------- |
| HTML     | Default browser request                                             | Page components rendering content JSON       |
| Markdown | `Accept: text/markdown`, or `.md` suffix (`/cv.md`, `/cv/index.md`) | HTML converted by `accept-md-runtime`        |
| JSON-LD  | `Accept: application/ld+json` on any page, or `/api/graph`          | `lib/jsonld.ts` — Schema.org knowledge graph |
| PDF      | `/cv/pdf`                                                           | Build-time Puppeteer render of `/cv`         |

The knowledge graph (`/api/graph`) returns the full Schema.org `@graph` regardless of which page URL is requested — the graph models the person, not the page. See [ADR-010](decision-records/010-canonical-url-graph-identity.md) for the rationale.

The site header includes links to the MD, DATA (JSON-LD), and PDF (CV pages only) representations on every page, making these formats discoverable by visitors.

## Adding or changing content

1. **Edit the JSON** — make changes in `content/cv.content.json` (or `content/frontpage.content.json` for the home page).
2. **Preview** — run `pnpm dev` and check the result at `http://localhost:3000`.
3. **Validate** — run `pnpm check`. The content integrity E2E tests verify that rendered content matches the JSON source.
4. **Editorial voice** — before writing or editing any content, read [editorial-guidance.md](../../.agent/directives/editorial-guidance.md) for Jim's voice, audience, and editorial principles.

For new tilt variants, add the variant key and content to `tilts` in `cv.content.json`, add the slug to `tilts._meta.web_routes`, and `generateStaticParams` picks it up automatically. Run `pnpm test:e2e` to verify the new route works end-to-end.

## Presentation text

Not all user-visible text lives in `content/` JSON files. Some text is hardcoded in components or page files because it is structural rather than editorial:

- **Section headings** — "Experience", "Before Oak", "Capabilities", "Education" in `components/cv-layout.tsx`
- **Navigation and UI labels** — site header links ("CV", "MD", "DATA", "PDF"), theme toggle labels
- **Error pages** — `app/not-found.tsx`, `app/cv/pdf/unavailable/page.tsx`
- **Accessibility labels** — `aria-label` attributes on interactive elements

These are presentation concerns, not content in the editorial sense, and do not need to follow the content derivation chain. If a heading or label needs to change, edit it directly in the component.

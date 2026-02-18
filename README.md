# jimcresswell.net

Personal website and CV for Jim Cresswell. Built with Next.js 16, React 19, and Tailwind CSS 4. Deployed on Vercel.

Live at [www.jimcresswell.net](https://www.jimcresswell.net).

## Overview

A minimal, editorial-quality personal site with a front page and CV pages. The design is calm, serious, and intentional — Inter for headings and labels, Literata for prose, whitespace-driven hierarchy, warm colour palette, light and dark themes, comprehensive print styles.

All content is driven from JSON files in `content/`. The site does not invent or rewrite any copy — all text is rendered directly from the content files.

## Getting Started

**Prerequisites:**

- **Node.js 24** — use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to manage versions
- **pnpm** — the only supported package manager (`npm install -g pnpm`)
- **gitleaks** — secret scanning, required by quality gates (`brew install gitleaks` on macOS, see [gitleaks releases](https://github.com/gitleaks/gitleaks/releases) for other platforms)

```bash
pnpm install
pnpm dev          # Start development server at http://localhost:3000
```

To run E2E tests, install Playwright browsers once after `pnpm install`:

```bash
pnpm exec playwright install
```

## Development Commands

```bash
pnpm dev            # Development server
pnpm build          # Production build
pnpm start          # Start production server

pnpm lint           # ESLint
pnpm type-check     # TypeScript type checking
pnpm format         # Prettier format (write)
pnpm format-check   # Prettier check (read-only)
pnpm test           # Unit and integration tests (Vitest)
pnpm test:watch     # Tests in watch mode
pnpm test:coverage  # Tests with coverage report
pnpm test:e2e       # E2E tests — default project (Playwright, requires browsers installed)
pnpm test:e2e:pdf   # E2E tests — PDF project (requires production build on :3001)
pnpm test:e2e:ui    # Playwright UI mode (interactive)

pnpm check          # All gates: format-check, lint, type-check, test, knip, gitleaks
pnpm knip           # Find unused exports and dependencies
pnpm gitleaks       # Scan git history for secrets
pnpm generate:icons # Regenerate favicon and OG images from logo
```

## Project Structure

```text
app/                         # Next.js App Router pages and layouts
  api/graph/route.ts         # Knowledge graph API (JSON-LD)
  api/accept-md/route.ts     # Markdown conversion handler (internal)
  cv/                        # CV pages (base and variant routes)
  globals.css                # Theme colours, Tailwind config, print styles
  layout.tsx                 # Root layout (fonts, theme provider, analytics)
  sitemap.ts                 # Dynamic sitemap generation
  manifest.ts                # Dynamic Web App Manifest generation

components/                  # React components
  cv-layout.tsx              # Full CV rendering (experience, prior roles, etc.)
  download-pdf-link.tsx      # PDF download link (points to /cv/pdf)
  markdown-page-link.tsx     # MD link to markdown version of current page
  site-header.tsx            # Navigation, theme toggle, page actions
  site-footer.tsx            # Copyright, external links
  rich-text.tsx              # Markdown link rendering in CV prose
  prose.tsx                  # Content paragraph renderer
  page-section.tsx           # Reusable page section with heading
  article-entry.tsx          # Individual article/experience entry
  theme-toggle.tsx           # Light / Dark / Auto theme switcher
  logo.tsx                   # SVG logo component
  skip-link.tsx              # Keyboard accessibility skip link
  theme-provider.tsx         # next-themes wrapper

content/                     # Content JSON (single source of truth for all copy)
  cv.content.json            # CV content, tilt variants, links, metadata source
  frontpage.content.json     # Homepage content

lib/                         # Utility functions and types
  cv-content.ts              # Content accessors and tilt helpers
  parse-markdown-links.tsx   # Parses [text](url) in content strings
  pdf-config.ts              # PDF deploy key and path utilities
  jsonld.ts                  # Schema.org JSON-LD structured data builder
  strip-inline-markdown.ts   # Strips markdown syntax for plain-text contexts

proxy.ts                     # Content negotiation (markdown, JSON-LD, .md aliases)
accept-md.config.js          # accept-md runtime configuration

scripts/                     # Build-time scripts
  generate-pdf.ts            # Puppeteer PDF generation (runs after next build)

e2e/                         # End-to-end tests (Playwright)
  journeys/                  # User story journey tests
  behaviour/                 # Cross-cutting behavioural tests (a11y, SEO, content)

docs/                        # Project documentation
  architecture/              # System architecture and decision records
  project/                   # User stories and requirements

public/                      # Static assets
  icons/                     # Favicon, Apple Touch Icon, OG image

logo/                        # Logo generation tooling (excluded from lint/build)
  generate-icons.ts          # Script to generate favicon/OG from font
```

### Routes

| Route                 | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `/`                   | Front page — personal narrative with inline links                          |
| `/cv/`                | Primary CV — positioning, experience, prior roles, capabilities, education |
| `/cv/<variant>/`      | CV variants — alternative positioning for different contexts               |
| `/cv/pdf`             | PDF download / inline display (Route Handler)                              |
| `/cv/pdf/unavailable` | Branded 404 when PDF has not been generated                                |
| `/api/graph`          | Full JSON-LD knowledge graph (Schema.org `@graph`)                         |
| `/<page>.md`          | Markdown version of any page (e.g. `/cv.md`, `/index.md`)                  |

Current variants are defined in `content/cv.content.json` under `tilts._meta.web_routes`.

Every page also supports content negotiation: `Accept: text/markdown` for markdown, `Accept: application/ld+json` for the knowledge graph. See [ADR-009](docs/architecture/decision-records/009-content-negotiation-proxy.md) and [ADR-010](docs/architecture/decision-records/010-canonical-url-graph-identity.md).

## Key Design Decisions

**Content-driven rendering** — All user-visible text comes from JSON files in `content/`. Components render content verbatim; they do not edit, summarise, or reorder it.

**Server components by default** — Only three components use `"use client"`: the theme toggle, the theme provider, and the site header. Everything else is server-rendered.

**Tilt variants** — CV variants share the same experience, prior roles, capabilities, and education sections but substitute different positioning text. Variants are defined in the content JSON and generate static routes via `generateStaticParams`.

**Build-time PDF** — The CV PDF is generated at build time using Puppeteer with full Chrome, stored in Vercel Blob (production) or the local filesystem (local builds), and served from `/cv/pdf`. Comprehensive `@media print` CSS drives both the PDF layout and manual browser printing. See [docs/architecture/](docs/architecture/) for details and [decision records](docs/architecture/decision-records/).

**Accessibility** — WCAG 2.2 AA target. Skip link, semantic HTML, heading hierarchy, visible focus indicators, 44px touch targets, `prefers-reduced-motion` respect, theme state announced to assistive technology.

**No icons, charts, or decorative elements** — Editorial aesthetic. UI controls are text-only.

## Quality Gates

Run before committing. The pre-commit hook runs `pnpm check` automatically.

```bash
pnpm check          # All gates: format-check, lint, type-check, test, knip, gitleaks
pnpm test:e2e       # E2E tests (separate — requires Chromium)
```

`pnpm check` runs, in order: Prettier format check, ESLint, TypeScript type checking, Vitest (unit + integration tests), Knip (unused code detection), and gitleaks (secret scanning). Gitleaks scans the full git history to ensure no secrets are committed — it requires [gitleaks](https://github.com/gitleaks/gitleaks) to be installed (`brew install gitleaks` on macOS).

The pre-commit hook ([Husky](https://typicode.github.io/husky/)) runs `pnpm check` automatically on every commit. Husky is installed by the `prepare` script when you run `pnpm install` — no manual setup needed. The checks are chained with `&&` (fail-fast): if any step fails, subsequent steps do not run. Expect commits to take ~10-15 seconds.

**Local development** works without any environment variables. `.env.local` is only needed to test the full Vercel Blob PDF path (see [architecture docs](docs/architecture/README.md) for details).

## Stack

| Layer           | Technology                                    |
| --------------- | --------------------------------------------- |
| Framework       | Next.js 16 (App Router)                       |
| UI              | React 19, Tailwind CSS 4                      |
| Fonts           | Inter (sans), Literata (serif) via next/font  |
| Theming         | next-themes (class strategy)                  |
| PDF generation  | Puppeteer (build-time), Vercel Blob (storage) |
| Testing         | Vitest, Playwright (E2E)                      |
| Linting         | ESLint (eslint-config-next)                   |
| Formatting      | Prettier                                      |
| Secret scanning | gitleaks                                      |
| Analytics       | Vercel Analytics                              |
| Hosting         | Vercel                                        |
| Package manager | pnpm                                          |

## Documentation

- [docs/architecture/](docs/architecture/) — System architecture, PDF generation, operational notes
- [docs/architecture/decision-records/](docs/architecture/decision-records/) — Architecture Decision Records (ADRs)
- [docs/project/](docs/project/) — User stories and requirements
- [e2e/](e2e/) — E2E test organisation, naming conventions, and test map

## Development Standards

This project has explicit rules for code quality, testing, and editorial voice that apply to all contributors — human and AI. Contributions are by invite only; please do not submit unsolicited pull requests.

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — Workflow, conventions, and troubleshooting for contributors
- [`.agent/directives/AGENT.md`](.agent/directives/AGENT.md) — Project context, commands, structure (start here)
- [`.agent/directives/rules.md`](.agent/directives/rules.md) — Development rules: TDD, type safety, code quality
- [`.agent/directives/testing-strategy.md`](.agent/directives/testing-strategy.md) — Testing philosophy, test types, naming conventions
- [`.agent/directives/editorial-guidance.md`](.agent/directives/editorial-guidance.md) — Jim's editorial voice and identity (read before any content work)

## Licence

- **Code**: [MIT](LICENSE)
- **Content**: [CC BY-NC 4.0](LICENSE-CONTENT) — CV text, biographical information, logo, identity assets. Free to share and adapt with attribution; not for commercial use.

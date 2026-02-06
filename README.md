# jimcresswell.net

Personal website and CV for Jim Cresswell. Built with Next.js 16, React 19, and Tailwind CSS 4. Deployed on Vercel.

Live at [jimcresswell.net](https://jimcresswell.net).

## Overview

A minimal, editorial-quality personal site with a front page and CV pages. The design is calm, serious, and intentional — Inter for headings and labels, Literata for prose, whitespace-driven hierarchy, warm colour palette, light and dark themes, comprehensive print styles.

All content is driven from JSON files in `content/`. The site does not invent or rewrite any copy — all text is rendered directly from the content files.

### Routes

| Route                 | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `/`                   | Front page — hero, highlights, navigation                                  |
| `/cv/`                | Primary CV — positioning, experience, foundations, capabilities, education |
| `/cv/<variant>/`      | CV variants — alternative positioning for different contexts               |
| `/cv/pdf`             | PDF download / inline display (Route Handler)                              |
| `/cv/pdf/unavailable` | Branded 404 when PDF has not been generated                                |

Current variants are defined in `content/cv.content.json` under `tilts._meta.web_routes`.

## Getting Started

**Prerequisites**: Node.js 24, pnpm

```bash
pnpm install
pnpm dev          # Start development server at http://localhost:3000
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

pnpm check          # All checks: format, lint, type-check, test
pnpm knip           # Find unused exports and dependencies
pnpm generate:icons # Regenerate favicon and OG images from logo
```

## Project Structure

```text
app/                    # Next.js App Router pages and layouts
  cv/                   # CV pages (base and variant routes)
  globals.css           # Theme colours, Tailwind config, print styles
  layout.tsx            # Root layout (fonts, theme provider, analytics)
  sitemap.ts            # Dynamic sitemap generation

components/             # React components
  cv-layout.tsx         # Full CV rendering (experience, foundations, etc.)
  download-pdf-link.tsx # PDF download link (points to /cv/pdf)
  site-header.tsx       # Navigation, theme toggle, page actions
  site-footer.tsx       # Copyright, external links
  rich-text.tsx         # Markdown link rendering in CV prose
  theme-toggle.tsx      # Light / Dark / Auto theme switcher
  logo.tsx              # SVG logo component
  skip-link.tsx         # Keyboard accessibility skip link
  theme-provider.tsx    # next-themes wrapper

content/                # Content JSON (single source of truth for all copy)
  cv.content.json       # CV content, tilt variants, links
  frontpage.content.json # Homepage content
  cv.og.json            # Open Graph metadata for CV pages
  jsonld.json           # Schema.org structured data

lib/                    # Utility functions and types
  cv-content.ts         # Content accessors and tilt helpers
  parse-markdown-links.tsx  # Parses [text](url) in content strings
  pdf-config.ts         # PDF deploy key and path utilities

scripts/                # Build-time scripts
  generate-pdf.ts       # Puppeteer PDF generation (runs after next build)

docs/                   # Project documentation
  architecture/         # System architecture and decision records
  project/              # User stories and requirements

public/                 # Static assets
  icons/                # Favicon, Apple Touch Icon, OG image
  manifest.webmanifest  # PWA manifest
  robots.txt            # Search engine directives

logo/                   # Logo generation tooling (excluded from lint/build)
  generate-icons.ts     # Script to generate favicon/OG from font
```

## Key Design Decisions

**Content-driven rendering** — All user-visible text comes from JSON files in `content/`. Components render content verbatim; they do not edit, summarise, or reorder it.

**Server components by default** — Only two components use `"use client"`: the theme toggle and the theme provider. Everything else is server-rendered.

**Tilt variants** — CV variants share the same experience, foundations, capabilities, and education sections but substitute different positioning text. Variants are defined in the content JSON and generate static routes via `generateStaticParams`.

**Build-time PDF** — The CV PDF is generated at build time using Puppeteer with full Chrome, stored in Vercel Blob (production) or the local filesystem (local builds), and served from `/cv/pdf`. Comprehensive `@media print` CSS drives both the PDF layout and manual browser printing. See [docs/architecture/](docs/architecture/) for details and [decision records](docs/architecture/decision-records/).

**Accessibility** — WCAG 2.2 AA target. Skip link, semantic HTML, heading hierarchy, visible focus indicators, 44px touch targets, `prefers-reduced-motion` respect, theme state announced to assistive technology.

**No icons, charts, or decorative elements** — Editorial aesthetic. UI controls are text-only.

## Quality Gates

Run before committing. The pre-commit hook runs lint-staged, lint, type-check, and test automatically.

```bash
pnpm format         # 1. Format
pnpm lint           # 2. Lint
pnpm type-check     # 3. Type check
pnpm test           # 4. Unit and integration tests
```

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
| Analytics       | Vercel Analytics                              |
| Hosting         | Vercel                                        |
| Package manager | pnpm                                          |

## Documentation

- [docs/architecture/](docs/architecture/) — System architecture, PDF generation, operational notes
- [docs/architecture/decision-records/](docs/architecture/decision-records/) — Architecture Decision Records (ADRs)
- [docs/project/](docs/project/) — User stories and requirements

## Agent Directives

AI agents working on this codebase should read [`.agent/directives/AGENT.md`](.agent/directives/AGENT.md) first. It contains project rules, testing strategy, and links to plans and prompts.

## Licence

- **Code**: [MIT](LICENSE)
- **Content**: [CC BY-NC 4.0](LICENSE-CONTENT) — CV text, biographical information, logo, identity assets. Free to share and adapt with attribution; not for commercial use.

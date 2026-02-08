# Architecture

## Overview

jimcresswell.net is a Next.js 16 application using the App Router, deployed on Vercel. All user-visible text is rendered from JSON files in `content/` — components render content verbatim and do not invent, summarise, or reorder it.

## Key Principles

- **Server components by default** — Client components only where browser APIs are needed (theme toggle, theme provider).
- **Content-driven rendering** — Single source of truth for all copy in `content/` JSON files. Content may include inline markdown (`[text](url)` for links, `_text_` for emphasis), which is parsed into React elements at render time by `parseMarkdownLinks` in `lib/parse-markdown-links.tsx`. Relative URLs render as Next.js `<Link>`, external URLs as `<a target="_blank">`.
- **Build-time PDF generation** — CV PDF generated at build time with full Chrome, served from our own URL.
- **Accessible** — WCAG 2.2 AA target throughout. Semantic HTML, heading hierarchy, visible focus indicators, 44px touch targets.
- **No decorative elements** — Editorial aesthetic. UI controls are text-only. No icons, charts, or illustrations.

## Routes

| Route                 | Type          | Purpose                                                                    |
| --------------------- | ------------- | -------------------------------------------------------------------------- |
| `/`                   | Page          | Home — personal narrative with inline links to CV, GitHub, Scholar, etc.   |
| `/cv`                 | Page          | Primary CV — positioning, experience, foundations, capabilities, education |
| `/cv/[variant]`       | Dynamic page  | CV variants with alternative positioning text                              |
| `/cv/pdf`             | Route Handler | Serves PDF binary (download or inline display)                             |
| `/cv/pdf/unavailable` | Page          | Branded 404 when PDF is not available                                      |

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
- **PDF size**: ~165 KB. Well within Vercel Blob's 4.5 MB server upload limit.
- **Serving cost**: Route Handler proxies ~165 KB per request. CDN-cached with `Cache-Control: public, max-age=31536000, immutable`.
- **Stale blobs**: Old deploy PDFs remain in Blob but are never referenced. Clean up if storage costs become relevant.
- **Fonts**: Full Chrome includes standard font rendering. Web fonts (Inter, Literata) are loaded via `next/font`; `networkidle0` + `document.fonts.ready` ensures they render correctly.
- **Accessible PDFs**: Full Chrome with `headless: true` produces tagged/accessible PDFs (unlike `@sparticuz/chromium`'s stripped build).
- **Dark mode**: Print CSS forces `background: white; color: #1a1a1a` inside `@media print`, so dark mode preferences do not affect PDF output.

## Decision Records

All significant architectural decisions are recorded as ADRs in [decision-records/](decision-records/).

| ADR                                                       | Title                                          |
| --------------------------------------------------------- | ---------------------------------------------- |
| [001](decision-records/001-build-time-pdf-generation.md)  | Build-time PDF generation with Puppeteer       |
| [002](decision-records/002-pdf-serving-architecture.md)   | PDF serving via Route Handler at /cv/pdf       |
| [003](decision-records/003-print-button-removed.md)       | Print button removed in favour of PDF download |
| [004](decision-records/004-storybook-deferred.md)         | Storybook deferred in favour of RTL + Vitest   |
| [005](decision-records/005-knip-unused-code-detection.md) | Knip for unused code and dependency detection  |
| [006](decision-records/006-header-responsive-layout.md)   | Header responsive layout                       |

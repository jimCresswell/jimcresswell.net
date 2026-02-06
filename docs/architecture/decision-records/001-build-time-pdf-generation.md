# ADR-001: Build-time PDF generation with Puppeteer

## Status

Accepted

## Date

2026-02-06

## Context

The site needs to offer a downloadable PDF of the CV. There are two broad approaches: generate the PDF at runtime (on each request or on-demand) or generate it at build time (once per deploy).

**Runtime generation is not viable on Vercel** because:

1. Standard Puppeteer with full Chrome for Testing is ~280 MB. Vercel's serverless function size limit is 250 MB (enforced by AWS Lambda, not configurable).
2. The alternative, `@sparticuz/chromium`, is a stripped-down `headless_shell` build that:
   - Does not produce accessible or tagged PDFs (would require recompiling Chromium with a custom patch).
   - Ships only Open Sans as a font; the Lambda runtime has no system fonts.
3. A runtime endpoint would need warming and would add latency to the user experience.

The CV content is fully static and deterministic per deploy — it changes only when the content JSON or code changes, which means a new deployment.

## Decision

Generate the PDF at **build time** using standard Puppeteer with full Chrome for Testing.

### Build flow

```
pnpm build  (runs: next build && tsx scripts/generate-pdf.ts)
                │
                ├─ next build              → produces .next/
                │
                └─ scripts/generate-pdf.ts
                    ├─ starts next start (background, on a free port)
                    ├─ puppeteer navigates to http://localhost:$PORT/cv
                    ├─ page.pdf() → generates PDF buffer
                    ├─ if BLOB_READ_WRITE_TOKEN is set:
                    │     uploads to Vercel Blob at pdf/cv-$DEPLOY_KEY.pdf
                    │   else:
                    │     writes to .next/Jim-Cresswell-CV.pdf (local)
                    ├─ stops the server
                    └─ exits
```

Key implementation details:

- `puppeteer` is a **devDependency** — not included in the runtime function bundle.
- `headless: true` (full Chrome, not headless shell) for accessible, tagged PDFs with proper font rendering.
- The Next.js server is spawned via `node_modules/.bin/next` (pnpm requirement — never `npx`).
- `networkidle0` + `document.fonts.ready` ensures web fonts (Inter, Literata) load before rendering.

### Vercel build environment

Vercel's build image uses Amazon Linux 2023. It pre-installs many Chrome dependencies (`gtk3`, `atk`, `at-spi2-atk`, `cups-libs`, `pango`, `alsa-lib`, `libXcomposite`, `libXrandr`, etc.) but is missing several libraries Chrome requires at runtime:

- `nss` (provides `libnss3.so`; depends on `nspr` which provides `libnspr4.so`)
- `mesa-libgbm` (provides `libgbm.so`)
- `libdrm` (provides `libdrm.so`)
- `libxkbcommon` (provides `libxkbcommon.so`)
- `libXdamage` (provides `libXdamage.so`)

These are installed via `dnf` in the custom `installCommand` in `vercel.json`:

```json
{
  "installCommand": "dnf install -y nss mesa-libgbm libdrm libxkbcommon libXdamage && pnpm install"
}
```

### Rejected alternatives

**`@sparticuz/chromium` / `@sparticuz/chromium-min`** — rejected because:

- It is a stripped-down `headless_shell` build, not full Chrome.
- It does not produce accessible or tagged PDFs (no UA accessibility tree export).
- It ships only Open Sans; the Lambda/build runtime has no system fonts, so Inter and Literata would not render. PDF quality and brand fidelity would be unacceptable.
- Using it would contradict the core requirement for accessible, properly-typeset PDFs.

**`headless: "shell"` (Puppeteer's legacy headless shell)** — rejected because:

- It is the deprecated legacy headless mode.
- Like `@sparticuz/chromium`, it is a headless shell binary, not full Chrome.
- Same accessibility and font limitations as above.

## Consequences

**Benefits:**

- PDF is ready before the deployment goes live (no warming, no latency).
- Full Chrome produces accessible, tagged PDFs with correct font rendering.
- No runtime dependency on Puppeteer or Chrome — the function bundle stays small.
- Works locally without any cloud services — falls back to writing to disk.

**Trade-offs:**

- Adds ~10–15 seconds to the build (start server, launch Chrome, render, store).
- Chrome for Testing (~280 MB) is downloaded during `pnpm install` in the build environment.
- Requires a custom `installCommand` in `vercel.json` to install Chrome's missing system library dependencies on Amazon Linux 2023.
- PDF only updates on new deploys — but since content is static per deploy, this is correct behaviour.

## Related

- [ADR-002: PDF serving architecture](002-pdf-serving-architecture.md)
- `scripts/generate-pdf.ts` — the build-time generation script
- `lib/pdf-config.ts` — pure utility functions for deploy keys and paths

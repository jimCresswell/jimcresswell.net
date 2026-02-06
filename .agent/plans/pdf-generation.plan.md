# PDF Generation: deterministic "1 PDF per deploy" on Vercel

Generate a PDF from the existing CV page at **build time** using standard Puppeteer with full Chrome, store it in Vercel Blob, serve via redirect.

---

## Codebase context (read this first)

This is a Next.js 16 personal-website / CV app deployed on Vercel (Hobby plan). Key files:

| What                    | Where                                                           | Notes                                                                                                                                         |
| ----------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| CV page (base)          | `app/cv/page.tsx`                                               | SSR, uses `<CVLayout>`, `<SiteHeader>`, `<SiteFooter>`                                                                                        |
| CV page (variant)       | `app/cv/[variant]/page.tsx`                                     | Dynamic route, uses tilts from content JSON                                                                                                   |
| Shared layout component | `components/cv-layout.tsx`                                      | Renders all CV sections                                                                                                                       |
| Print button (existing) | `components/print-button.tsx`                                   | `"use client"`, calls `window.print()` — **keep as-is** alongside the new Download PDF link                                                   |
| Print CSS               | `app/globals.css` lines 222–423                                 | Comprehensive `@media print` + `@page` rules already in place. Uses class `print-hidden` (not `.no-print`) to hide header/footer/nav in print |
| Content JSON            | `content/cv.content.json`                                       | All CV data, including `tilts._meta`                                                                                                          |
| Content helpers         | `lib/cv-content.ts`                                             | Exports `cvContent`, `activeTiltKeys`, `getTilt`, etc.                                                                                        |
| Tilts metadata          | `content/cv.content.json → tilts._meta`                         | `"note": "...all variants are available for PDF generation"`                                                                                  |
| Next config             | `next.config.mjs`                                               | Minimal — `ignoreBuildErrors: true`, `images.unoptimized: true`                                                                               |
| Package manager         | pnpm (see `packageManager` field in `package.json`)             |
| TypeScript runner       | `tsx` (devDependency)                                           | Used to run `.ts` scripts outside Next.js                                                                                                     |
| Agent directives        | `.agent/directives/AGENT.md`, `rules.md`, `testing-strategy.md` | TDD, pure functions, fail fast, no `as`/`any`/`!`, TSDoc on all exports                                                                       |

**There is no `app/api/` directory yet — it will be created.**

### Variant PDF scope

`tilts._meta.note` says "all variants are available for PDF generation." However, only the base `/cv` route needs a PDF endpoint initially. Variant PDFs (`/cv/public_sector`, etc.) can be added later by parameterising the generation script. The plan below covers the base case only, with a note on where to extend.

### Relationship to existing PrintButton

The existing `<PrintButton>` in `components/print-button.tsx` triggers `window.print()` (browser's native print dialog). **Keep it.** The new "Download PDF" link is a separate action that fetches a pre-generated PDF from Vercel Blob. Both will appear in the header — Print and Download serve different use cases.

---

## Architecture

### Why build-time, not runtime?

Standard Puppeteer (with real Chrome) produces accessible, tagged PDFs with proper font rendering. However, its Chrome binary is ~280 MB — it exceeds Vercel's 250 MB serverless function size limit (enforced by AWS Lambda, not configurable). The alternative, `@sparticuz/chromium`, is a stripped-down `headless_shell` build that:

- **Does not produce accessible/tagged PDFs** (requires recompiling Chromium with a custom patch).
- **Ships only Open Sans** as a font; the Lambda runtime has no system fonts at all.

Since the CV content is fully static and deterministic per deploy, the PDF can be generated at **build time** where there are no size constraints. This also eliminates the need for a warm endpoint and deployment webhook — the PDF exists before the deploy goes live.

### Flow

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
                    │     writes to .next/Jim-Cresswell-CV.pdf (local validation)
                    ├─ stops the server
                    └─ exits

Runtime (Vercel):
  GET /api/pdf  →  look up Blob by deploy key  →  302 redirect to Blob CDN URL

Local validation:
  pnpm build  →  open .next/Jim-Cresswell-CV.pdf directly
```

### Key properties

- `puppeteer` is a **devDependency** only — not in the runtime function bundle.
- Full Chrome for Testing — proper fonts, accessible PDFs, standard headless mode.
- PDF is ready before the deployment goes live (no warming needed).
- `/api/pdf` is a thin redirect route with no Puppeteer dependency at runtime.
- No warm endpoint, no webhook — two fewer API routes, one fewer env var.
- **Works locally without Blob** — when `BLOB_READ_WRITE_TOKEN` is absent, the script writes to disk instead. Same Puppeteer path, different storage backend.

---

## 0) Install dependencies

```bash
pnpm add -D puppeteer
pnpm add @vercel/blob
```

- `puppeteer` (devDependency): full package with Chrome for Testing. Used only at build time.
- `@vercel/blob` (production dependency): stores and serves the generated PDF via CDN.

---

## 1) Environment variables

### Required (set in Vercel project settings)

| Variable                | Scope           | Source                                                              | Purpose                          |
| ----------------------- | --------------- | ------------------------------------------------------------------- | -------------------------------- |
| `BLOB_READ_WRITE_TOKEN` | Build + Runtime | Vercel Dashboard → Storage → Create Blob Store → connect to project | Read/write access to Vercel Blob |

### Vercel Blob store setup

1. Go to Vercel Dashboard → your project → Storage tab.
2. Click "Create" → "Blob".
3. Name it (e.g. `cv-pdf-store`), select the region closest to your function.
4. Connect it to this project. This auto-sets `BLOB_READ_WRITE_TOKEN`.
5. **Important:** ensure the variable is scoped to both **Build** and **Runtime** environments (Build for the generation script, Runtime for the redirect route).

### Provided by Vercel at runtime (no action needed)

- `VERCEL_GIT_COMMIT_SHA` — available at both build and runtime.
- `VERCEL_DEPLOYMENT_ID` — available at both build and runtime.

---

## 2) Shared utility: `lib/pdf-config.ts`

Pure functions for deploy key logic and PDF naming. Used by both the build script and the API route.

All functions accept their inputs as parameters — no direct `process.env` reads. Call sites at the system boundary (the script and the route handler) pass env values in. This keeps the functions testable without global state mutation.

```ts
/**
 * Derive the canonical deploy key for PDF versioning.
 *
 * Prefers the git commit SHA (most stable), falls back to the
 * Vercel deployment ID, then to "local" for local builds.
 *
 * @param commitSha - Value of VERCEL_GIT_COMMIT_SHA, if set
 * @param deploymentId - Value of VERCEL_DEPLOYMENT_ID, if set
 * @returns A non-empty string identifying this deployment
 */
export function getDeployKey(commitSha?: string, deploymentId?: string): string {
  return commitSha || deploymentId || "local";
}

/**
 * Build the versioned Blob storage path for a deployment's PDF.
 *
 * @param deployKey - The deploy key from {@link getDeployKey}
 * @returns A path like `pdf/cv-abc123.pdf`
 */
export function getBlobPath(deployKey: string): string {
  return `pdf/cv-${deployKey}.pdf`;
}

/** Human-readable filename used when the PDF is saved to disk locally. */
export const PDF_FILENAME = "Jim-Cresswell-CV.pdf";
```

### Unit tests: `lib/pdf-config.unit.test.ts`

Written **before** the implementation (TDD red phase).

```ts
import { describe, it, expect } from "vitest";
import { getDeployKey, getBlobPath } from "./pdf-config";

describe("getDeployKey", () => {
  it("prefers commit SHA when both are provided", () => {
    expect(getDeployKey("sha123", "dep456")).toBe("sha123");
  });

  it("falls back to deployment ID when commit SHA is absent", () => {
    expect(getDeployKey(undefined, "dep456")).toBe("dep456");
  });

  it("falls back to deployment ID when commit SHA is empty", () => {
    expect(getDeployKey("", "dep456")).toBe("dep456");
  });

  it("returns 'local' when neither is provided", () => {
    expect(getDeployKey()).toBe("local");
  });

  it("returns 'local' when both are empty strings", () => {
    expect(getDeployKey("", "")).toBe("local");
  });
});

describe("getBlobPath", () => {
  it("formats the path with the deploy key", () => {
    expect(getBlobPath("abc123")).toBe("pdf/cv-abc123.pdf");
  });
});
```

---

## 3) Build-time PDF generation script

Create: `scripts/generate-pdf.ts`

This script runs as part of the Vercel build step, after `next build`. It:

1. Starts `next start` on a free port.
2. Waits for the server to be ready.
3. Uses Puppeteer to render `/cv` and generate a PDF.
4. If `BLOB_READ_WRITE_TOKEN` is set: uploads to Vercel Blob (CI/Vercel build).
5. Otherwise: writes to `.next/Jim-Cresswell-CV.pdf` (local validation).
6. Stops the server and exits.

```ts
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import puppeteer from "puppeteer";
import { getDeployKey, getBlobPath, PDF_FILENAME } from "../lib/pdf-config";

// ---------------------------------------------------------------------------
// Storage: Blob (Vercel) or local disk
// ---------------------------------------------------------------------------

// @vercel/blob is imported dynamically so the module is never loaded when
// running locally without a token. All blob operations are gated on this flag.
const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * Check whether this deploy's PDF already exists in Blob.
 * Returns false when running locally (no token).
 * Fails fast on unexpected errors (auth, network).
 */
async function pdfExistsInBlob(blobPath: string): Promise<boolean> {
  if (!hasBlobToken) return false;
  const { head, BlobNotFoundError } = await import("@vercel/blob");
  try {
    await head(blobPath);
    return true;
  } catch (error: unknown) {
    if (error instanceof BlobNotFoundError) return false;
    throw error;
  }
}

/**
 * Store the PDF in Blob (when token is available) or write to disk.
 * @returns The Blob URL or local file path where the PDF was written.
 */
async function storePdf(pdf: Buffer, blobPath: string): Promise<string> {
  if (hasBlobToken) {
    const { put } = await import("@vercel/blob");
    const blob = await put(blobPath, pdf, {
      access: "public",
      contentType: "application/pdf",
    });
    return blob.url;
  }

  // Local fallback — write into .next/ (which is .gitignored).
  const localPath = path.resolve(process.cwd(), ".next", PDF_FILENAME);
  await fs.writeFile(localPath, pdf);
  return localPath;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Find a free TCP port. */
function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const addr = srv.address();
      if (!addr || typeof addr === "string") {
        reject(new Error("Could not determine port"));
        return;
      }
      const port = addr.port;
      srv.close(() => resolve(port));
    });
    srv.on("error", reject);
  });
}

/** Poll until the server responds with 200. */
async function waitForServer(
  url: string,
  { timeout = 30_000, interval = 500 } = {}
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return;
    } catch {
      // Server not ready yet — expected during startup.
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const deployKey = getDeployKey(
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.VERCEL_DEPLOYMENT_ID
  );
  const blobPath = getBlobPath(deployKey);

  // Skip if this deploy's PDF already exists in Blob (idempotent).
  if (await pdfExistsInBlob(blobPath)) {
    console.log(`[generate-pdf] PDF already exists at ${blobPath}, skipping.`);
    return;
  }

  const port = await getFreePort();
  const origin = `http://localhost:${port}`;

  console.log(`[generate-pdf] Starting Next.js on port ${port}...`);

  const server: ChildProcess = spawn("npx", ["next", "start", "-p", String(port)], {
    stdio: "pipe",
    env: { ...process.env, PORT: String(port) },
  });

  // Forward server output for build log visibility.
  server.stdout?.on("data", (d: Buffer) => process.stdout.write(d));
  server.stderr?.on("data", (d: Buffer) => process.stderr.write(d));

  try {
    await waitForServer(`${origin}/cv`);
    console.log("[generate-pdf] Server ready. Launching Puppeteer...");

    const browser = await puppeteer.launch({
      headless: "shell",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.goto(`${origin}/cv`, { waitUntil: "networkidle0" });

      // Ensure web fonts (Inter, Literata) have finished loading.
      await page.evaluate(() => document.fonts.ready);

      const pdf = await page.pdf({
        printBackground: true,
        preferCSSPageSize: true, // respects @page { size: A4; margin: 18mm 20mm; }
      });

      console.log(`[generate-pdf] PDF generated (${(pdf.length / 1024).toFixed(1)} KB).`);

      const destination = await storePdf(Buffer.from(pdf), blobPath);
      console.log(`[generate-pdf] Stored: ${destination}`);
    } finally {
      await browser.close();
    }
  } finally {
    server.kill("SIGTERM");
    // Give the server a moment to shut down gracefully.
    await new Promise((r) => setTimeout(r, 1_000));
  }
}

main().catch((err: unknown) => {
  console.error("[generate-pdf] Fatal error:", err);
  process.exit(1);
});
```

### Wire into the build command

In `package.json`, update the `build` script:

```json
"build": "next build && tsx scripts/generate-pdf.ts"
```

`tsx` is already a devDependency in the project.

On Vercel (where `BLOB_READ_WRITE_TOKEN` is set), the PDF uploads to Blob. Locally, it writes to `.next/Jim-Cresswell-CV.pdf` for inspection.

---

## 4) Runtime redirect endpoint

Create: `app/api/pdf/route.ts`

This is a thin route with no Puppeteer dependency. It looks up the Blob by deploy key and redirects. It distinguishes "not found" from unexpected errors (fail fast).

```ts
import { NextResponse } from "next/server";
import { head, BlobNotFoundError } from "@vercel/blob";
import { getDeployKey, getBlobPath } from "@/lib/pdf-config";

export const runtime = "nodejs";

/** Redirect to the pre-generated CV PDF stored in Vercel Blob. */
export async function GET(): Promise<NextResponse> {
  const deployKey = getDeployKey(
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.VERCEL_DEPLOYMENT_ID
  );
  const blobPath = getBlobPath(deployKey);

  try {
    const meta = await head(blobPath);
    return NextResponse.redirect(meta.url, 302);
  } catch (error: unknown) {
    if (error instanceof BlobNotFoundError) {
      return NextResponse.json(
        { error: "PDF not yet available for this deployment." },
        { status: 404 }
      );
    }
    throw error;
  }
}
```

Usage: `/api/pdf` → 302 redirect to the Blob CDN URL. Since the PDF was generated at build time, this always succeeds for a valid deployment.

---

## 5) Front-end: Download PDF link

Create: `components/download-pdf-link.tsx`

```tsx
/**
 * Link to download the pre-generated CV PDF.
 * Points to the `/api/pdf` redirect endpoint.
 * Hidden in print media via the `print-hidden` class.
 */
export function DownloadPdfLink() {
  return (
    <a
      href="/api/pdf"
      target="_blank"
      rel="noreferrer"
      className="print-hidden font-sans text-base underline text-accent hover:opacity-80 transition-opacity min-h-[44px] py-2"
    >
      Download PDF
    </a>
  );
}
```

Then update the header in `app/cv/page.tsx` (and `app/cv/[variant]/page.tsx`):

```tsx
import { DownloadPdfLink } from "@/components/download-pdf-link";

// ...

<SiteHeader
  actions={
    <>
      <DownloadPdfLink />
      <PrintButton />
    </>
  }
/>;
```

---

## 6) Testing approach

### Unit tests (Vitest) — TDD

| Function       | File                          | What it proves                                    |
| -------------- | ----------------------------- | ------------------------------------------------- |
| `getDeployKey` | `lib/pdf-config.unit.test.ts` | Priority: SHA > ID > "local"; skips empty strings |
| `getBlobPath`  | `lib/pdf-config.unit.test.ts` | Formats path correctly                            |

These are pure functions with no I/O. Tests are written **before** the implementation (red → green → refactor). See section 2 for the full test listing.

### Build script — local validation

`scripts/generate-pdf.ts` is orchestration glue: it spawns a server, launches a browser, and writes a file. This is not unit-testable and should not pretend to be. Its validation is:

```bash
pnpm build              # generates .next/Jim-Cresswell-CV.pdf
open .next/Jim-Cresswell-CV.pdf   # visually inspect layout, fonts, page breaks
```

This runs the same Puppeteer + Chrome path as CI. If the PDF is wrong, fix the print CSS or the script and rebuild.

### API route — E2E-API test (Playwright, when set up)

| Behaviour                                    | File                          | What it proves                   |
| -------------------------------------------- | ----------------------------- | -------------------------------- |
| Returns 302 to Blob URL when PDF exists      | `e2e/pdf-api.e2e-api.test.ts` | Happy path redirect works        |
| Returns 404 with message when PDF is missing | `e2e/pdf-api.e2e-api.test.ts` | Graceful handling of missing PDF |

### Download link — E2E-UI test (Playwright, when set up)

| Behaviour                      | File                         | What it proves                 |
| ------------------------------ | ---------------------------- | ------------------------------ |
| Link appears in CV page header | `e2e/cv-page.e2e-ui.test.ts` | Link renders with correct href |

E2E tests depend on Playwright, which is not yet set up in this project. The test files and naming conventions are documented here so they can be written when Playwright is added (`e2e/` directory, `*.e2e-api.test.ts` and `*.e2e-ui.test.ts` suffixes).

---

## 7) Local development

The generation script detects its environment automatically via the presence of `BLOB_READ_WRITE_TOKEN`. No flags or env overrides needed.

### Local validation (no Blob token required)

```bash
pnpm build          # next build + tsx scripts/generate-pdf.ts
                    # → writes .next/Jim-Cresswell-CV.pdf
open .next/Jim-Cresswell-CV.pdf   # inspect the output
```

This runs the **same Puppeteer + Chrome path** as CI. The only difference is the storage backend (local file vs. Blob). Use this to validate print layout, fonts, page breaks, and content before pushing.

### Local build with Blob upload

If you want to test the full Blob path locally, add `BLOB_READ_WRITE_TOKEN` to `.env.local` (get it from Vercel Dashboard → Storage → your Blob store). Then `pnpm build` will upload to Blob and `/api/pdf` will redirect correctly when running `pnpm start`.

### Dev mode

During `pnpm dev`, the `/api/pdf` route will return 404 (no Blob entry for the `"local"` deploy key). This is expected — PDF generation only happens during a full build. To iterate on print CSS, use the browser's native `Cmd+P` / `Ctrl+P` (or the existing Print CV button) which triggers the same `@media print` rules.

---

## 8) Print CSS (already done — verification checklist)

The existing `app/globals.css` already contains comprehensive print styles. Verify these are still correct after any layout changes:

- `@page { size: A4; margin: 18mm 20mm; }` — sets page dimensions
- `body { background: white !important; color: #1a1a1a !important; }` — forces light mode in print
- `.print-hidden { display: none !important; }` — hides header, footer, nav, theme toggle
- `section[aria-labelledby="experience-heading"] { break-before: page; }` — page break control
- `-webkit-print-color-adjust: exact;` — **not currently set** in the existing CSS; consider adding it to `body` inside `@media print` for exact colour reproduction

---

## 9) Operational notes

- **Build time**: The generation script adds ~10–20s to the build (start server, launch Chrome, render, upload). Vercel build timeout is 45 minutes — not a concern.
- **Puppeteer install during build**: Vercel's build environment runs on Linux. `puppeteer` will download Chrome for Testing (~280 MB) during `pnpm install`. This is fine — the build environment has no size limit. The binary is not included in the function output.
- **Blob size limit**: Vercel Blob server uploads have a ~4.5 MB limit per request. A text-heavy CV PDF is typically <100 KB.
- **Idempotency**: The script checks for an existing Blob entry before generating. Re-running with the same deploy key is a no-op.
- **Stale blobs**: Old deploy PDFs remain in Blob but are never referenced. Set up periodic cleanup if storage costs become relevant.
- **Fonts**: Full Chrome for Testing includes standard font rendering. Web fonts (Inter, Literata) are loaded via `next/font` and `networkidle0` + explicit `document.fonts.ready` ensures they render correctly.
- **Accessible PDFs**: Full Chrome produces tagged/accessible PDFs by default (unlike `@sparticuz/chromium`'s `headless_shell` build).
- **Dark mode**: The print CSS forces `background: white; color: #1a1a1a;` inside `@media print`, so dark mode preferences do not affect PDF output.

---

## 10) Extending for variant PDFs

To generate PDFs for variant routes (e.g. `/cv/public_sector`):

1. In `scripts/generate-pdf.ts`, loop over the variant keys (import or hardcode `activeTiltKeys`).
2. For each variant, navigate to `${origin}/cv/${variant}` and generate a PDF.
3. Upload to Blob with a variant-specific key: `pdf/cv-${variant}-${deployKey}.pdf`.
4. In `app/api/pdf/route.ts`, accept an optional `?variant=` query param, validate against known keys, and adjust the Blob lookup path.

---

## Implementation order

TDD: write tests before implementation. Red → green → refactor.

1. **Install dependencies** (step 0)
2. **Write unit tests** for `getDeployKey` and `getBlobPath` in `lib/pdf-config.unit.test.ts` — **RED**: tests fail because the module does not exist yet
3. **Create `lib/pdf-config.ts`** — **GREEN**: tests pass. Refactor if needed.
4. **Run quality gates**: `pnpm check` (format, lint, type-check, test)
5. **Create `scripts/generate-pdf.ts`** (step 3)
6. **Update `package.json`** build script: `"build": "next build && tsx scripts/generate-pdf.ts"`
7. **Local validation**: `pnpm build` → inspect `.next/Jim-Cresswell-CV.pdf`
8. **Create `app/api/pdf/route.ts`** (step 4)
9. **Create `components/download-pdf-link.tsx`** and update `app/cv/page.tsx` + `app/cv/[variant]/page.tsx` (step 5)
10. **Run quality gates**: `pnpm check`
11. **Full local test**: `pnpm build` then `pnpm start` → visit `/api/pdf`
12. **Set up Blob store** in Vercel Dashboard (step 1)
13. **Deploy** — Vercel runs build, script generates PDF, `/api/pdf` works immediately
14. **E2E tests** (deferred until Playwright is set up): add `e2e/pdf-api.e2e-api.test.ts` and `e2e/cv-page.e2e-ui.test.ts`

---

## Files created/modified (summary)

| Action       | Path                               | Notes                                                         |
| ------------ | ---------------------------------- | ------------------------------------------------------------- |
| **Create**   | `lib/pdf-config.unit.test.ts`      | Unit tests — written first (TDD)                              |
| **Create**   | `lib/pdf-config.ts`                | Pure functions: `getDeployKey`, `getBlobPath`, `PDF_FILENAME` |
| **Create**   | `scripts/generate-pdf.ts`          | Build-time PDF generation script                              |
| **Create**   | `app/api/pdf/route.ts`             | Runtime Blob redirect (no Puppeteer)                          |
| **Create**   | `components/download-pdf-link.tsx` | Download PDF link component                                   |
| **Modify**   | `package.json`                     | Add dependencies + update `build` script                      |
| **Modify**   | `app/cv/page.tsx`                  | Add `<DownloadPdfLink>` to header actions                     |
| **Modify**   | `app/cv/[variant]/page.tsx`        | Add `<DownloadPdfLink>` to header actions                     |
| **Deferred** | `e2e/pdf-api.e2e-api.test.ts`      | E2E-API tests (when Playwright is added)                      |
| **Deferred** | `e2e/cv-page.e2e-ui.test.ts`       | E2E-UI tests (when Playwright is added)                       |

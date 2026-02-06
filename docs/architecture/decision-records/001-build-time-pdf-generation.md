# ADR-001: Build-time PDF generation with Puppeteer

## Status

Accepted (updated 2026-02-06 — revised Vercel build strategy)

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

### Vercel build configuration strategy

**Approach: `buildCommand` override** (current)

System dependencies and Chrome are installed via the `buildCommand` in `vercel.json`:

```json
{
  "buildCommand": "dnf install -y nss mesa-libgbm libdrm libxkbcommon libXdamage && npx puppeteer browsers install chrome && pnpm run build"
}
```

**Why `buildCommand` instead of `installCommand`:**

An earlier iteration used a custom `installCommand` to prepend `dnf install` before `pnpm install`. This violated Vercel's caching invariant: Vercel hashes the lockfile and skips `installCommand` entirely on cache hits. When the cache was warm and `installCommand` was skipped, Chrome's system library dependencies were absent and the build failed.

`buildCommand` runs on **every build** regardless of cache state, making it the correct hook for non-deterministic prerequisites like system libraries and browser binaries.

**`PUPPETEER_CACHE_DIR` environment variable:**

Set in Vercel project settings:

```
PUPPETEER_CACHE_DIR=./node_modules/.cache/puppeteer
```

This ensures `npx puppeteer browsers install chrome` stores the Chrome binary inside `node_modules/`, which Vercel caches between builds. On cache-hit builds, `pnpm install` is a no-op (lockfile unchanged), but the Chrome binary persists in the cached `node_modules/.cache/puppeteer/` directory. The explicit `npx puppeteer browsers install chrome` in `buildCommand` then becomes a fast no-op (binary already present) rather than a ~280 MB download.

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

**`installCommand` override** — abandoned because:

- Vercel skips `installCommand` when the lockfile cache is warm.
- This caused intermittent failures: first build after a dependency change succeeded (cache miss → `installCommand` ran → `dnf` installed libraries), but subsequent builds with only code changes failed (cache hit → `installCommand` skipped → no system libraries).
- The approach conflated two concerns (system dependencies and package installation) in a hook that is designed purely for package installation.

**GitHub Actions** — considered but deferred because:

- Would require a post-deploy webhook or polling to know when the Vercel preview URL is live.
- Adds CI/CD complexity and a separate Chrome installation in GitHub's Ubuntu runners.
- Acceptable if Vercel-native approaches prove unreliable, but adds operational overhead.

## Future alternative: Cloudflare Browser Rendering

If `dnf` on Vercel's build image proves unreliable (e.g. Vercel changes the base image, removes `dnf`, or tightens the sandbox), the documented fallback is a **Cloudflare Worker with a Browser Rendering binding**.

### How it would work

A separate Cloudflare Worker:

1. Receives a POST request with the deployment URL and a pre-signed Vercel Blob upload URL.
2. Launches a Chromium instance via Cloudflare's Browser Rendering binding (`@cloudflare/puppeteer`).
3. Navigates to the deployment's `/cv` page, waits for fonts and a readiness sentinel.
4. Generates a tagged PDF with full Chrome-class rendering.
5. Uploads the PDF to Vercel Blob via the pre-signed URL.

### Repository structure

Adopting this approach would require splitting the repository into a **monorepo with two workspaces**:

- **`packages/site`** — the Next.js application (current codebase).
- **`packages/pdf-renderer`** — the Cloudflare Worker (`wrangler.toml`, `src/index.ts`, `@cloudflare/puppeteer`).

pnpm workspaces or Turborepo would manage the monorepo. Each workspace deploys independently (Vercel for the site, Cloudflare for the Worker).

### On-demand rendering via Cloudflare proxy

The site is already proxied through Cloudflare. This opens up a simpler integration pattern: rather than Vercel calling out to Cloudflare post-build, the Cloudflare Worker could sit in the request path and render on demand.

For example, a request to `/cv/pdf` could be intercepted by a Cloudflare Worker that:

1. Checks Vercel Blob for a cached PDF keyed by the current deployment.
2. If absent, renders one using Browser Rendering, uploads it, and serves it.
3. If present, redirects to the blob URL.

This removes the build-time dependency entirely — PDF generation happens lazily on first request, with subsequent requests served from Blob. It also removes the need for Vercel to explicitly call Cloudflare, since Cloudflare already sits in the request path.

### Why it is not the current approach

- The `buildCommand` approach is simpler: no extra infrastructure, no Worker deployment, no monorepo split.
- Cloudflare Browser Rendering is a paid add-on with usage-based billing.
- The current approach keeps everything in one repository and one deployment target.

This alternative is documented here as a contingency. A full draft implementation is available in `.agent/research/cloudflare-pdf-render-service.md`.

## Consequences

**Benefits:**

- PDF is ready before the deployment goes live (no warming, no latency).
- Full Chrome produces accessible, tagged PDFs with correct font rendering.
- No runtime dependency on Puppeteer or Chrome — the function bundle stays small.
- Works locally without any cloud services — falls back to writing to disk.

**Trade-offs:**

- Adds ~10–15 seconds to the build (start server, launch Chrome, render, store).
- Chrome for Testing (~280 MB) is downloaded during `npx puppeteer browsers install chrome` in `buildCommand` (cached on subsequent builds via `PUPPETEER_CACHE_DIR`).
- Requires a custom `buildCommand` in `vercel.json` to install Chrome's missing system library dependencies on Amazon Linux 2023 before running the build.
- PDF only updates on new deploys — but since content is static per deploy, this is correct behaviour.

## Related

- [ADR-002: PDF serving architecture](002-pdf-serving-architecture.md)
- `scripts/generate-pdf.ts` — the build-time generation script
- `lib/pdf-config.ts` — pure utility functions for deploy keys and paths
- `.agent/research/cloudflare-pdf-render-service.md` — full draft of the Cloudflare alternative

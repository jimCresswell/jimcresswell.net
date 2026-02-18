# ADR-002: PDF serving via Route Handler at /cv/pdf

## Status

Accepted

## Date

2026-02-06

## Context

The build-time PDF (see [ADR-001](001-build-time-pdf-generation.md)) needs to be served to users. The original plan used an API route at `/api/pdf` that returned a 302 redirect to the Vercel Blob CDN URL. This had several problems:

1. **Third-party URL** — The browser would navigate to a `*.public.blob.vercel-storage.com` URL, not our domain.
2. **No branded error page** — When the PDF was unavailable (e.g. local dev without a prior build), the API route returned a JSON error or a blank "this page isn't working" browser error.
3. **Single source** — The redirect-to-Blob approach did not support the local filesystem fallback needed for local development.

User feedback required:

- The PDF must be served from **our own URL** (`/cv/pdf`).
- When unavailable, a **branded 404 page** must be shown (not a JSON error or browser error).
- The system must support **two sources**: Vercel Blob (production) and local filesystem (local builds).
- Clicking "Download PDF" on the CV page must **trigger a download** without navigating away.

## Decision

Serve the PDF via a **Next.js Route Handler** at `app/cv/pdf/route.ts` that proxies the PDF binary.

### Route structure

```
app/cv/pdf/
  route.ts                    — serves PDF binary or redirects on error
  unavailable/
    page.tsx                  — calls notFound() (always 404)
    not-found.tsx             — branded "PDF not found" page
```

### Serving logic

1. **Blob** (when `BLOB_READ_WRITE_TOKEN` is set): call `head(blobPath)` to get the Blob URL, then `fetch()` to get the binary content.
2. **Local filesystem** (fallback): read `.next/Jim-Cresswell-CV.pdf`.
3. **Neither available**: 302 redirect to `/cv/pdf/unavailable`.

### Response headers (happy path)

- `Content-Type: application/pdf`
- `Content-Disposition: inline; filename="Jim-Cresswell-CV.pdf"` — displays in the browser's built-in PDF viewer.
- `Cache-Control: public, max-age=31536000, immutable` — the PDF is tied to the deploy and never changes.

### Frontend download link

```html
<a href="/cv/pdf" download="Jim-Cresswell-CV.pdf">Download PDF</a>
```

- The `download` attribute forces a file download — the user stays on the CV page.
- Direct visits to `/cv/pdf` (without the `download` attribute) display the PDF inline in the browser.

### Error handling

The `/cv/pdf/unavailable` route uses Next.js's built-in `notFound()` mechanism:

- `page.tsx` unconditionally calls `notFound()`.
- `not-found.tsx` renders a branded error page with a link back to `/cv`.
- Next.js returns a proper **404 status code** automatically.

## Consequences

**Benefits:**

- PDF served from our own URL — consistent branding, no third-party URLs.
- Works locally without Blob — the filesystem fallback supports local development.
- Branded 404 with proper HTTP status code when PDF is unavailable.
- Download attribute keeps users on the CV page during download.
- CDN caching with immutable headers minimises serving cost.

**Trade-offs:**

- The Route Handler proxies ~192 KB of PDF binary per request (vs. a redirect which would offload the transfer to the Blob CDN). For a personal CV site with low traffic, this is negligible. CDN caching mitigates it further.
- Two PDF sources add a small amount of complexity to the route handler.

## Related

- [ADR-001: Build-time PDF generation](001-build-time-pdf-generation.md)
- `app/cv/pdf/route.ts` — the Route Handler
- `app/cv/pdf/unavailable/` — the branded 404 page
- `components/download-pdf-link.tsx` — the frontend download link

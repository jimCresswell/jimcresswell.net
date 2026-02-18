# ADR-003: Print button removed in favour of PDF download

## Status

Accepted

## Date

2026-02-06

## Context

The site had two ways to produce a physical or offline copy of the CV:

1. **Print CV button** — A `"use client"` component (`components/print-button.tsx`) that called `window.print()`, opening the browser's native print dialog.
2. **Download PDF link** — A link to `/cv/pdf` with the `download` attribute, triggering a background file download.

Both appeared in the header on the CV pages. `<SiteHeader>` is a client component that uses `usePathname()` to detect when the user is on a CV route and conditionally renders `<DownloadPdfLink>` in that case. It does not accept an `actions` prop; it is self-contained.

Having both added UI complexity without proportional value. The PDF download serves the same purpose with a more polished and consistent result — the PDF is generated with controlled formatting, fonts, and page breaks, whereas browser print output varies across browsers and operating systems.

## Decision

Remove the Print CV button from the UI. The PDF download link is the sole action in the CV page header.

### What was removed

The `<PrintButton>` component was previously rendered alongside `<DownloadPdfLink>` in the header on CV pages. The component looked like this:

```tsx
// components/print-button.tsx (removed)
"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print-hidden font-sans text-base underline text-accent hover:opacity-80 transition-opacity min-h-[44px] py-2"
    >
      Print CV
    </button>
  );
}
```

### What was retained

The comprehensive `@media print` CSS in `app/globals.css` is **retained**. It is still exercised by:

- The PDF generation script (Puppeteer's `page.pdf()` uses print media).
- Users who manually trigger print via Ctrl+P / Cmd+P.

### How to restore the print button

1. Create a new client component (e.g. `components/print-button.tsx`) that renders a button calling `window.print()` on click, with the same styling as other header actions (e.g. `print-hidden`, accent link style, 44px min height).
2. In `SiteHeader`, add `<PrintButton />` alongside `<DownloadPdfLink />` inside the conditional block that runs when `isCV` is true (so it only appears on CV pages).
3. The existing `@media print` block in `app/globals.css` already handles print layout; no change needed there.

## Consequences

**Benefits:**

- Simpler UI — one action in the header instead of two.
- The print button was the only component that existed solely for a client-side action (triggering `window.print()`). The remaining client components (`SiteHeader`, `ThemeToggle`, `ThemeProvider`) serve other purposes.
- Consistent output — the PDF is generated under controlled conditions rather than relying on browser print rendering.

**Trade-offs:**

- Users who preferred the immediate print dialog must now download the PDF first, then print from their PDF viewer. Alternatively, they can use Ctrl+P / Cmd+P directly.
- The print CSS continues to be maintained despite having no in-app trigger — but it is exercised by the PDF generation script and manual printing.

## Related

- [ADR-002: PDF serving architecture](002-pdf-serving-architecture.md)
- `components/download-pdf-link.tsx` — the replacement download link
- `components/site-header.tsx` — self-contained header; conditionally renders the download link on CV routes
- `app/globals.css` — print CSS (retained)

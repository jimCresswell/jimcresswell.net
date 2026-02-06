# ADR-003: Print button removed in favour of PDF download

## Status

Accepted

## Date

2026-02-06

## Context

The site had two ways to produce a physical or offline copy of the CV:

1. **Print CV button** — A `"use client"` component (`components/print-button.tsx`) that called `window.print()`, opening the browser's native print dialog.
2. **Download PDF link** — A link to `/cv/pdf` with the `download` attribute, triggering a background file download.

Both appeared in the `<SiteHeader>` actions on the CV pages (`app/cv/page.tsx` and `app/cv/[variant]/page.tsx`).

Having both adds UI complexity without proportional value. The PDF download serves the same purpose with a more polished and consistent result — the PDF is generated with controlled formatting, fonts, and page breaks, whereas browser print output varies across browsers and operating systems.

## Decision

Remove the Print CV button from the UI. The PDF download link is the sole action in the CV page header.

### What was removed

The `<PrintButton>` component was rendered alongside `<DownloadPdfLink>` in the `SiteHeader` actions:

```tsx
<SiteHeader
  actions={
    <>
      <DownloadPdfLink />
      <PrintButton />
    </>
  }
/>
```

The component itself:

```tsx
// components/print-button.tsx
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

The comprehensive `@media print` CSS in `app/globals.css` (lines 222–425) is **retained**. It is still exercised by:

- The PDF generation script (Puppeteer's `page.pdf()` uses print media).
- Users who manually trigger print via Ctrl+P / Cmd+P.

### How to restore the print button

1. Create `components/print-button.tsx` with the component shown above.
2. Import it in both `app/cv/page.tsx` and `app/cv/[variant]/page.tsx`.
3. Add `<PrintButton />` alongside `<DownloadPdfLink />` in the `SiteHeader actions` prop.

## Consequences

**Benefits:**

- Simpler UI — one action in the header instead of two.
- Eliminates the only remaining `"use client"` component on the CV pages (the download link is a plain `<a>` tag with no client-side JavaScript).
- Consistent output — the PDF is generated under controlled conditions rather than relying on browser print rendering.

**Trade-offs:**

- Users who preferred the immediate print dialog must now download the PDF first, then print from their PDF viewer. Alternatively, they can use Ctrl+P / Cmd+P directly.
- The print CSS continues to be maintained despite having no in-app trigger — but it is exercised by the PDF generation script and manual printing.

## Related

- [ADR-002: PDF serving architecture](002-pdf-serving-architecture.md)
- `components/download-pdf-link.tsx` — the replacement download link
- `app/globals.css` — print CSS (retained)

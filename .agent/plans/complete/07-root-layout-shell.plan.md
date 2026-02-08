# Cloud Sub-Plan 07: Root Layout Shell — Eliminate Page Scaffolding Duplication

**Parent plan:** [component-audit.plan.md](../component-audit.plan.md) — Part 2
**Dependencies:** [05-site-header-refactor](05-site-header-refactor.plan.md), [04-site-footer-refactor](04-site-footer-refactor.plan.md), and [06-cv-layout-refactor](06-cv-layout-refactor.plan.md) must all be complete
**Enables:** Clean page scaffolding for the timeline page and any future pages

## Goal

Move the shared page shell (SkipLink, SiteHeader, `<main>`, SiteFooter) into `app/layout.tsx` so that all pages get it automatically. Pages then provide only their unique content.

## Intended Impact

Eliminates the repeated shell pattern from 5 page files. Adding a new page no longer requires manually composing SkipLink + SiteHeader + main + SiteFooter. The root layout becomes the single source of truth for the page shell.

## Context

### The duplicated shell

Five pages manually compose the same structure:

```tsx
<>
  <SkipLink />
  <SiteHeader actions={...} />
  <main id="main-content" className="mx-auto max-w-content px-4 py-8 md:px-8 md:py-16">
    {/* page content */}
  </main>
  <SiteFooter links={footerLinks} />
</>
```

Duplicated in:

- `app/page.tsx` (home)
- `app/cv/page.tsx`
- `app/cv/[variant]/page.tsx`
- `app/not-found.tsx`
- `app/cv/pdf/unavailable/not-found.tsx`

Meanwhile `app/cv/layout.tsx` is a pass-through (`return children`) that does nothing.

### Design decisions (already made in the parent plan)

1. **SiteHeader actions slot:** The header reads `usePathname()` and conditionally renders the download PDF link for CV pages. This is idiomatic Next.js — the header is already a client component. No context layer needed.

2. **`<main>` wrapper:** The root layout provides `<main id="main-content">` with standard max-width and padding. Error pages that need centring nest a centring `<div>` inside `<main>`.

3. **SiteFooter:** The root layout imports `footerLinks` once and passes it to `SiteFooter`. No per-page configuration needed.

## Steps

### 1. Move the `actions` logic into `SiteHeader`

Currently, CV pages pass `actions={<DownloadPdfLink />}` to `SiteHeader`. After this refactor, `SiteHeader` is rendered in the root layout (which doesn't know about CV-specific actions).

**Solution:** `SiteHeader` already uses `usePathname()`. Add the download link conditionally:

```tsx
import { DownloadPdfLink } from "@/components/download-pdf-link";

export function SiteHeader() {
  const pathname = usePathname();
  const isCV = pathname.startsWith("/cv");

  // ... existing code ...

  <div className="flex items-center gap-4 print-hidden">
    {isCV && (
      <>
        <DownloadPdfLink />
        <span className="opacity-30" aria-hidden="true">
          |
        </span>
      </>
    )}
    <ThemeToggle />
  </div>;
}
```

**Remove the `actions` prop entirely.** The `SiteHeaderProps` interface is no longer needed if `actions` was the only prop.

**Update the SiteHeader RTL test** (from sub-plan 05) to test the pathname-based download link behaviour instead of the actions slot.

### 2. Update `app/layout.tsx`

Add the shared shell around `{children}`:

```tsx
import { SkipLink } from "@/components/skip-link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { footerLinks } from "@/lib/cv-content";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${literata.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider ...>
          <SkipLink />
          <SiteHeader />
          <main id="main-content" className="mx-auto max-w-content px-4 py-8 md:px-8 md:py-16">
            {children}
          </main>
          <SiteFooter links={footerLinks} />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
```

Note: `max-w-content` assumes [02-tailwind-hygiene](02-tailwind-hygiene.plan.md) has been applied. If not, use `max-w-[760px]`.

### 3. Strip the shell from all page files

Each page file removes SkipLink, SiteHeader, `<main>`, and SiteFooter, keeping only its content.

**`app/page.tsx`** — keep only the hero and highlights sections:

```tsx
export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-heading" className="mb-6">
        {/* hero content */}
      </section>
      <section aria-labelledby="highlights-heading">{/* highlights content */}</section>
    </>
  );
}
```

**`app/cv/page.tsx`** — keep only CVLayout and JSON-LD:

```tsx
export default function CVPage() {
  return (
    <>
      <CVLayout content={cvContent} positioning={<BasePositioning />} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
```

Remove the `DownloadPdfLink` import — it's now in `SiteHeader`.

**`app/cv/[variant]/page.tsx`** — same pattern as CV page.

**`app/not-found.tsx`** — keep the centred content, wrap in a `<div>` for centring:

```tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 ...>Page not found</h1>
      <p ...>...</p>
      <Link ...>Go back home</Link>
    </div>
  );
}
```

**`app/cv/pdf/unavailable/not-found.tsx`** — same pattern as not-found.

### 4. Clean up `app/cv/layout.tsx`

It is currently a pass-through. If there are no CV-section-specific concerns, it can remain as-is or be deleted. If it is deleted, the `app/cv/` directory still works — Next.js uses the parent layout.

**Recommendation:** Keep it for now as a placeholder for future CV-section concerns (e.g. timeline integration). It costs nothing.

### 5. Remove unused imports

After stripping the shell, several pages will have unused imports of `SkipLink`, `SiteHeader`, `SiteFooter`, `footerLinks`, and `DownloadPdfLink`. Remove them all. The linter will catch any missed ones.

### 6. Write RTL integration test for the root layout

This is optional but valuable — test that the root layout renders the structural shell:

Create a test that renders the layout with mock children and verifies:

- `SkipLink` is present (skip link anchor)
- Navigation is present (main navigation landmark)
- `<main>` with `id="main-content"` exists
- Footer is present (external links navigation landmark)
- Children are rendered inside `<main>`

**Note:** Testing the full root layout with RTL may be complex due to `<html>` and `<body>` elements. If this proves difficult, rely on E2E tests for layout verification and skip the RTL test for the layout itself.

### 7. Run full quality gates

```bash
pnpm format
pnpm lint
pnpm type-check
pnpm test
pnpm test:e2e
```

**E2E tests are critical here** — they verify the full page shell on real pages. The existing E2E suite covers accessibility, content integrity, navigation journeys, and SEO. All must pass.

## Important Notes

- **This is the highest-risk sub-plan** — it touches every page file and the root layout. Run E2E tests after every significant change, not just at the end.
- **JSON-LD scripts in CV pages** must remain in the page files, not move to the layout.
- **The `<main>` element must retain `id="main-content"`** — the skip link targets it.
- **Print styles depend on the `<main>` element** — verify print layout is unaffected.
- **Do not change any content or visual styling** — this is a structural refactor only.

## Acceptance Criteria

- [ ] `app/layout.tsx` renders SkipLink, SiteHeader, `<main>`, SiteFooter around `{children}`
- [ ] `SiteHeader` no longer accepts an `actions` prop — it renders the download link based on pathname
- [ ] All 5 page files have their shell scaffolding removed
- [ ] Each page file contains only its unique content
- [ ] No unused imports remain
- [ ] `pnpm check` passes
- [ ] `pnpm test:e2e` passes — all existing E2E tests (accessibility, content integrity, navigation, SEO, theme) pass unchanged
- [ ] Visual appearance is identical on all pages (home, CV, not-found)
- [ ] Print layout is unaffected (verify with print preview if possible)

## Layout Hierarchy After Refactoring

```
app/layout.tsx          → SkipLink, SiteHeader, <main>, SiteFooter, ThemeProvider
  app/page.tsx          → Home content only
  app/not-found.tsx     → Error content only (centred within main)
  app/cv/layout.tsx     → Pass-through (future CV-section concerns)
    app/cv/page.tsx     → CV content only + JSON-LD
    app/cv/[variant]/   → Variant CV content only + JSON-LD
    app/cv/timeline/    → Timeline content only (future)
```

## Files Affected

| File                                          | Changes                                                 |
| --------------------------------------------- | ------------------------------------------------------- |
| `app/layout.tsx`                              | Add shared page shell                                   |
| `app/page.tsx`                                | Remove shell, keep content only                         |
| `app/cv/page.tsx`                             | Remove shell, keep content + JSON-LD                    |
| `app/cv/[variant]/page.tsx`                   | Remove shell, keep content + JSON-LD                    |
| `app/not-found.tsx`                           | Remove shell, wrap content in centring div              |
| `app/cv/pdf/unavailable/not-found.tsx`        | Remove shell, wrap content in centring div              |
| `components/site-header.tsx`                  | Remove `actions` prop, add pathname-based download link |
| `components/site-header.integration.test.tsx` | Update to test pathname-based download link             |

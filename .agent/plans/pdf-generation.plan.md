# PDF Generation — Completion Record

Build-time PDF generation for the CV page. **All implementation work is complete.** Documentation has been moved to `docs/`.

## Status: Complete

Remaining items (Vercel Blob store setup, production deploy, E2E tests) are tracked in [e2e-testing-and-quality.plan.md](e2e-testing-and-quality.plan.md).

## Implementation Summary

| Step                                             | Status | Notes                                                                                 |
| ------------------------------------------------ | ------ | ------------------------------------------------------------------------------------- |
| Install dependencies                             | Done   | `puppeteer` (dev), `@vercel/blob` (prod)                                              |
| Shared utility `lib/pdf-config.ts`               | Done   | TDD. Pure functions: `getDeployKey`, `getBlobPath`, `getLocalPdfPath`, `PDF_FILENAME` |
| Build-time generation `scripts/generate-pdf.ts`  | Done   | `headless: true`, spawns `node_modules/.bin/next`                                     |
| Runtime serving `app/cv/pdf/route.ts`            | Done   | Route Handler serves binary. Two sources: Blob and filesystem                         |
| Branded 404 `app/cv/pdf/unavailable/`            | Done   | `page.tsx` calls `notFound()`, `not-found.tsx` renders branded content                |
| Download link `components/download-pdf-link.tsx` | Done   | `download` attribute, no `target="_blank"`                                            |
| CV pages updated                                 | Done   | `<DownloadPdfLink />` in `SiteHeader` actions                                         |
| Print CSS                                        | Done   | `print-color-adjust: exact` added to `app/globals.css`                                |
| Unit tests                                       | Done   | 8 tests in `lib/pdf-config.unit.test.ts` (TDD)                                        |
| Print button removed                             | Done   | See [ADR-003](../../docs/architecture/decision-records/003-print-button-removed.md)   |

## Documentation

All architectural and operational documentation has been moved out of this plan:

| Content                                             | Location                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Why build-time generation                           | [ADR-001](../../docs/architecture/decision-records/001-build-time-pdf-generation.md) |
| PDF serving architecture                            | [ADR-002](../../docs/architecture/decision-records/002-pdf-serving-architecture.md)  |
| Print button removal                                | [ADR-003](../../docs/architecture/decision-records/003-print-button-removed.md)      |
| Environment variables, local dev, operational notes | [docs/architecture/README.md](../../docs/architecture/README.md)                     |
| User stories (US-04, US-05)                         | [docs/project/user-stories.md](../../docs/project/user-stories.md)                   |
| Requirements (REQ-07)                               | [docs/project/requirements.md](../../docs/project/requirements.md)                   |

## Files Created/Modified

| Action | Path                                   |
| ------ | -------------------------------------- |
| Create | `lib/pdf-config.unit.test.ts`          |
| Create | `lib/pdf-config.ts`                    |
| Create | `scripts/generate-pdf.ts`              |
| Create | `app/cv/pdf/route.ts`                  |
| Create | `app/cv/pdf/unavailable/page.tsx`      |
| Create | `app/cv/pdf/unavailable/not-found.tsx` |
| Create | `components/download-pdf-link.tsx`     |
| Modify | `package.json`                         |
| Modify | `app/cv/page.tsx`                      |
| Modify | `app/cv/[variant]/page.tsx`            |
| Modify | `app/globals.css`                      |
| Delete | `components/print-button.tsx`          |

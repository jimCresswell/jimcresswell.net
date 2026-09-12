# E2E Testing & Quality Infrastructure — Completion Record

Set up Playwright, create E2E tests that prove user stories and requirements, verify WCAG 2.2 AA compliance, and complete the PDF generation production setup. **All implementation work is complete.**

## Status: Complete

## Acceptance Criteria — All Met

1. Playwright installed and configured with `pnpm test:e2e`.
2. E2E tests prove each user story in `docs/project/user-stories.md`.
3. Automated WCAG 2.2 AA checks (axe-core) pass on all pages.
4. PDF-specific E2E tests verify serving, download, and error handling.
5. Vercel Blob store created and connected.
6. Production deploy verified — `/cv/pdf` serves the PDF correctly.
7. Blob management uses the idiomatic `@vercel/blob` approach.
8. Quality gates pass: `pnpm check`.

## Implementation Summary

| Step                                     | Status   | Notes                                                                                                |
| ---------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| Step 0: Vercel Blob Store Setup          | Complete | Blob store created, `BLOB_READ_WRITE_TOKEN` set in Vercel and `.env.local`                           |
| Step 1: Install and Configure Playwright | Complete | Two projects (`default`, `with-build`), axe-core, subdirectory structure (`journeys/`, `behaviour/`) |
| Step 2: E2E Tests for User Stories       | Complete | 7 journey tests (US-01 through US-07), all passing                                                   |
| Step 3: WCAG 2.2 AA Compliance Checks    | Complete | axe-core checks on all pages in both light and dark themes                                           |
| Step 4: Verify Blob Management           | Complete | Reviewed and confirmed idiomatic; `allowOverwrite: true` added                                       |
| Step 5: Production Deploy and Verify     | Complete | PDF serves correctly, CSS renders correctly, `buildCommand` approach verified across two builds      |

## Documentation

All non-ephemeral information has been moved out of this plan:

| Content                                           | Location                                                              |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| E2E test structure, naming, projects              | `e2e/README.md`                                                       |
| Testing strategy and TDD approach                 | `.agent/directives/testing-strategy.md`                               |
| E2E commands                                      | `.agent/directives/AGENT.md`                                          |
| Accessibility testing scope and limitations       | `e2e/README.md`                                                       |
| Build-time PDF generation and Vercel build config | `docs/architecture/decision-records/001-build-time-pdf-generation.md` |
| PDF serving architecture                          | `docs/architecture/decision-records/002-pdf-serving-architecture.md`  |
| Environment variables and operational notes       | `docs/architecture/README.md`                                         |

## Files Created/Modified

| Action | Path                                                    |
| ------ | ------------------------------------------------------- |
| Create | `playwright.config.ts`                                  |
| Create | `e2e/README.md`                                         |
| Create | `e2e/journeys/home-to-cv.e2e-ui.test.ts`                |
| Create | `e2e/journeys/read-cv.e2e-ui.test.ts`                   |
| Create | `e2e/journeys/cv-variant.e2e-ui.test.ts`                |
| Create | `e2e/journeys/download-pdf.with-build.e2e-ui.test.ts`   |
| Create | `e2e/journeys/pdf-unavailable.e2e-ui.test.ts`           |
| Create | `e2e/journeys/not-found.e2e-ui.test.ts`                 |
| Create | `e2e/journeys/theme-comfort.e2e-ui.test.ts`             |
| Create | `e2e/behaviour/accessibility.e2e-ui.test.ts`            |
| Create | `e2e/behaviour/seo.e2e-api.test.ts`                     |
| Create | `e2e/behaviour/content-integrity.e2e-ui.test.ts`        |
| Create | `e2e/behaviour/pdf-response.with-build.e2e-api.test.ts` |
| Modify | `package.json`                                          |
| Modify | `.gitignore`                                            |
| Modify | `.prettierignore`                                       |
| Modify | `eslint.config.ts`                                      |
| Modify | `vitest.config.ts`                                      |

## Deferred Items

| Item                                     | Reason                                                              |
| ---------------------------------------- | ------------------------------------------------------------------- |
| Variant PDFs (`/cv/public_sector`, etc.) | Variant strategy is under review — may change or be removed         |
| Stale blob cleanup                       | Not needed until storage costs become relevant                      |
| CI integration for E2E tests             | Set up after local E2E tests are stable                             |
| Performance testing (Lighthouse CI)      | Valuable but lower priority than functional and accessibility tests |

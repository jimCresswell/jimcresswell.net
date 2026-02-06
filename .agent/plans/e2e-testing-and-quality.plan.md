# E2E Testing & Quality Infrastructure

Set up Playwright, create E2E tests that prove user stories and requirements, verify WCAG 2.2 AA compliance, and complete the PDF generation production setup.

## Acceptance Criteria

1. Playwright is installed and configured with `pnpm test:e2e`.
2. E2E tests prove each user story in [docs/project/user-stories.md](../../docs/project/user-stories.md).
3. Automated WCAG 2.2 AA checks (axe-core) pass on all pages.
4. PDF-specific E2E tests verify serving, download, and error handling.
5. Vercel Blob store is created and connected (manual step).
6. Production deploy is verified — `/cv/pdf` serves the PDF correctly.
7. Blob management uses the idiomatic `@vercel/blob` approach for Next.js.

---

## Step 0: Vercel Blob Store Setup — Manual

**Owner:** Jim (manual step in Vercel Dashboard)

1. Go to Vercel Dashboard → project → Storage tab.
2. Click "Create" → "Blob".
3. Name it (e.g. `cv-pdf-store`), select the nearest region.
4. Connect it to the project. This auto-sets `BLOB_READ_WRITE_TOKEN`.
5. Ensure the variable is scoped to both **Build** and **Runtime**.

---

## Step 1: Install and Configure Playwright

| Status | Pending |
| ------ | ------- |

### Dependencies

```bash
pnpm add -D @playwright/test @axe-core/playwright
```

After installing, run `pnpm exec playwright install --with-deps chromium` to download the browser binary.

### Configuration

Create `playwright.config.ts` at project root:

- Base URL: `http://localhost:3000`
- Web server command: `pnpm dev` (or `pnpm build && pnpm start` for production-like tests)
- Projects: Chromium only (initially; expand later if needed)
- Test directory: `e2e/`
- Reporter: HTML (for local) + list (for CI)

### Scripts

Add to `package.json`:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

### Verification

- `pnpm test:e2e` runs successfully (with zero tests initially).
- The `e2e/` directory exists with a README.

---

## Step 2: E2E Tests for User Stories

| Status | Pending |
| ------ | ------- |

Create Playwright tests that prove the system satisfies each user story. Tests follow TDD: write the test first, then verify it passes against the running application.

File naming follows the [testing strategy](../../.agent/directives/testing-strategy.md): `*.e2e-ui.test.ts` for browser tests, `*.e2e-api.test.ts` for HTTP-level tests.

### Test Plan

| User Story             | Test File                       | What It Proves                                                                  |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| US-01: Home page       | `e2e/home.e2e-ui.test.ts`       | Name, tagline, summary visible; CV link navigates correctly                     |
| US-02: CV online       | `e2e/cv.e2e-ui.test.ts`         | All CV sections render; content matches JSON; responsive layout                 |
| US-03: CV variant      | `e2e/cv-variant.e2e-ui.test.ts` | Variant positioning renders; shared sections unchanged; invalid slug → 404      |
| US-04: PDF download    | `e2e/pdf.e2e-api.test.ts`       | `/cv/pdf` returns `application/pdf` with correct headers (requires prior build) |
| US-05: PDF unavailable | `e2e/pdf.e2e-ui.test.ts`        | `/cv/pdf/unavailable` shows branded 404; link to `/cv` present                  |
| US-06: Global 404      | `e2e/not-found.e2e-ui.test.ts`  | Non-existent route → branded 404; link to home                                  |
| US-07: Theme toggle    | `e2e/theme.e2e-ui.test.ts`      | Theme toggle cycles Light → Dark → Auto; class applied to `<html>`              |
| US-08: Accessibility   | See Step 3 (WCAG checks)        |                                                                                 |
| US-09: SEO             | `e2e/seo.e2e-api.test.ts`       | `<title>`, `<meta description>`, OG tags, sitemap, JSON-LD present              |

### Notes

- PDF download test (US-04) requires a prior `pnpm build` to generate the PDF. The Playwright config should use `pnpm build && pnpm start` as the web server command for these tests, or the tests should be tagged and run separately.
- Theme persistence test should verify the theme survives a page navigation.
- CV content tests should assert against the actual content JSON to verify content-driven rendering (import the JSON in the test and compare).

---

## Step 3: WCAG 2.2 AA Compliance Checks

| Status | Pending |
| ------ | ------- |

Use `@axe-core/playwright` to run automated accessibility checks on every page.

### Test File

`e2e/accessibility.e2e-ui.test.ts`

### Pages to Test

| Page            | URL                          | Notes                     |
| --------------- | ---------------------------- | ------------------------- |
| Home            | `/`                          |                           |
| CV (base)       | `/cv`                        |                           |
| CV (variant)    | `/cv/<first-active-variant>` | Test at least one variant |
| PDF unavailable | `/cv/pdf/unavailable`        |                           |
| 404             | `/non-existent-route`        |                           |

### Test Structure

For each page:

1. Navigate to the page.
2. Wait for content to load.
3. Run `new AxeBuilder({ page }).analyze()`.
4. Assert zero violations.
5. Test in both light and dark themes (colour contrast differs).

### What axe-core Checks

axe-core covers approximately 30–40% of WCAG criteria automatically:

- Colour contrast ratios (4.5:1 normal text, 3:1 large text)
- Missing alt text, labels, ARIA attributes
- Heading hierarchy
- Landmark regions
- Form element associations
- Focus management
- Link purpose

### Limitations

Automated tooling cannot fully verify:

- Keyboard-only navigation flow
- Screen reader comprehension
- Meaningful reading order
- Complex interaction patterns

These require manual review. The automated checks establish a baseline.

---

## Step 4: Verify Blob Management is Idiomatic

| Status | Pending |
| ------ | ------- |

Review `scripts/generate-pdf.ts` and `app/cv/pdf/route.ts` against the latest `@vercel/blob` Next.js documentation to ensure the SDK is being used idiomatically.

Current approach:

- **Upload**: `put(blobPath, pdf, { access: "public", contentType: "application/pdf" })`
- **Lookup**: `head(blobPath)` to get metadata, then `fetch(meta.url)` for binary content

Check whether there is a more idiomatic retrieval pattern (e.g. direct `get()` or `download()` method).

---

## Step 5: Production Deploy and Verify

| Status | Pending (blocked by Step 0) |
| ------ | --------------------------- |

1. Deploy to Vercel (push to main or trigger deploy).
2. Vercel runs `pnpm build` → `next build` → `scripts/generate-pdf.ts` → uploads PDF to Blob.
3. Verify: visit `https://jimcresswell.net/cv/pdf` and confirm the PDF displays correctly.
4. Verify: click "Download PDF" on `/cv` and confirm the file downloads.
5. Verify: `/cv/pdf/unavailable` shows the branded 404 (test by temporarily removing the Blob, or on a preview deploy without the token).

---

## Deferred

| Item                                     | Reason                                                              |
| ---------------------------------------- | ------------------------------------------------------------------- |
| Variant PDFs (`/cv/public_sector`, etc.) | Variant strategy is under review — may change or be removed         |
| Stale blob cleanup                       | Not needed until storage costs become relevant                      |
| CI integration for E2E tests             | Set up after local E2E tests are stable                             |
| Performance testing (Lighthouse CI)      | Valuable but lower priority than functional and accessibility tests |

---

## Dependencies

| Dependency             | Version | Purpose                          |
| ---------------------- | ------- | -------------------------------- |
| `@playwright/test`     | latest  | E2E test runner                  |
| `@axe-core/playwright` | latest  | Automated WCAG compliance checks |

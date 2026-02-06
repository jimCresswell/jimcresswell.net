# E2E Tests

End-to-end tests using [Playwright](https://playwright.dev/) and [axe-core](https://github.com/dequelabs/axe-core) for WCAG 2.2 AA compliance.

## Running

```bash
pnpm test:e2e          # Run default project (journeys + behaviour)
pnpm test:e2e:pdf      # Run with-build project (PDF tests — requires production server on :3001)
pnpm test:e2e:ui       # Open Playwright UI mode
```

## Test Classes

### Journeys (`e2e/journeys/`)

User story tests that exercise end-to-end flows and prove the site delivers value. Each test follows the user's actual journey: arrive, orient, act, achieve.

### Behaviour (`e2e/behaviour/`)

Cross-cutting behavioural tests that prove specific correctness concerns: accessibility compliance, SEO signals, content integrity against JSON sources, and HTTP-level response correctness.

## Naming Conventions

| Suffix                         | Description                              |
| ------------------------------ | ---------------------------------------- |
| `*.e2e-ui.test.ts`             | Browser automation test (UI)             |
| `*.e2e-api.test.ts`            | HTTP-level test (Playwright request API) |
| `*.with-build.e2e-ui.test.ts`  | UI test requiring a production build     |
| `*.with-build.e2e-api.test.ts` | API test requiring a production build    |

## Projects

| Project      | Web Server                   | Filter                 | Used For                              |
| ------------ | ---------------------------- | ---------------------- | ------------------------------------- |
| `default`    | `pnpm dev` (auto-started)    | Ignores `.with-build.` | All tests except PDF download/serving |
| `with-build` | Manual: `pnpm start -p 3001` | Only `.with-build.`    | PDF download and response tests       |

To run `with-build` tests locally:

```bash
pnpm build && pnpm start -p 3001 &   # Start production server
pnpm test:e2e:pdf                      # Run PDF tests
```

## Test Map

### Journeys

| File                                      | User Story                          |
| ----------------------------------------- | ----------------------------------- |
| `journeys/home-to-cv.e2e-ui.test.ts`      | US-01: Visitor discovers Jim → CV   |
| `journeys/read-cv.e2e-ui.test.ts`         | US-02: Visitor reads full CV        |
| `journeys/cv-variant.e2e-ui.test.ts`      | US-03: Visitor follows variant link |
| `journeys/download-pdf.with-build.*`      | US-04: Visitor downloads PDF        |
| `journeys/pdf-unavailable.e2e-ui.test.ts` | US-05: Missing PDF → helpful error  |
| `journeys/not-found.e2e-ui.test.ts`       | US-06: Broken link → branded 404    |
| `journeys/theme-comfort.e2e-ui.test.ts`   | US-07: Theme toggle for comfort     |

### Behaviour

| File                                         | Concern                       |
| -------------------------------------------- | ----------------------------- |
| `behaviour/accessibility.e2e-ui.test.ts`     | US-08: WCAG 2.2 AA (axe-core) |
| `behaviour/seo.e2e-api.test.ts`              | US-09: SEO signals            |
| `behaviour/content-integrity.e2e-ui.test.ts` | REQ-06: Content matches JSON  |
| `behaviour/pdf-response.with-build.*`        | REQ-07: PDF HTTP correctness  |

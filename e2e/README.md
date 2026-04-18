# E2E Tests

End-to-end tests using [Playwright](https://playwright.dev/) and [axe-core](https://github.com/dequelabs/axe-core) for WCAG 2.2 AA compliance.

## Running

```bash
pnpm test:e2e          # Run the full suite against a production build
pnpm test:e2e:ui       # Open Playwright UI mode
```

The Playwright web server runs `pnpm build && pnpm start --port 3000` so every
test exercises the same artefact a visitor would see in production. The build
is reused between local runs (`reuseExistingServer: true` outside CI). PDF
generation is part of `pnpm build` (postbuild script), so PDF tests run
alongside everything else with no separate project.

This avoids dev-server-only flakes — Turbopack `Runtime ChunkLoadError`
overlays and Next.js dev-tools issue badges — by removing the `pnpm dev`
process from the E2E loop entirely.

## Test Classes

### Journeys (`e2e/journeys/`)

User story tests that exercise end-to-end flows and prove the site delivers value. Each test follows the user's actual journey: arrive, orient, act, achieve.

### Behaviour (`e2e/behaviour/`)

Cross-cutting behavioural tests that prove specific correctness concerns: accessibility compliance, SEO signals, content integrity against JSON sources, and HTTP-level response correctness.

## Naming Conventions

| Suffix              | Description                              |
| ------------------- | ---------------------------------------- |
| `*.e2e-ui.test.ts`  | Browser automation test (UI)             |
| `*.e2e-api.test.ts` | HTTP-level test (Playwright request API) |

## Test Map

### Journeys

| File                                      | User Story                          |
| ----------------------------------------- | ----------------------------------- |
| `journeys/home-to-cv.e2e-ui.test.ts`      | US-01: Visitor discovers Jim → CV   |
| `journeys/read-cv.e2e-ui.test.ts`         | US-02: Visitor reads full CV        |
| `journeys/cv-variant.e2e-ui.test.ts`      | US-03: Visitor follows variant link |
| `journeys/download-pdf.e2e-ui.test.ts`    | US-04: Visitor downloads PDF        |
| `journeys/pdf-unavailable.e2e-ui.test.ts` | US-05: Missing PDF → helpful error  |
| `journeys/not-found.e2e-ui.test.ts`       | US-06: Broken link → branded 404    |
| `journeys/theme-comfort.e2e-ui.test.ts`   | US-07: Theme toggle for comfort     |

### Behaviour

| File                                                     | Concern                             |
| -------------------------------------------------------- | ----------------------------------- |
| `behaviour/accessibility.e2e-ui.test.ts`                 | US-08: WCAG 2.2 AA (axe-core)       |
| `behaviour/seo.e2e-api.test.ts`                          | US-09: SEO signals                  |
| `behaviour/content-integrity.e2e-ui.test.ts`             | REQ-06: Content matches JSON        |
| `behaviour/pdf-response.e2e-api.test.ts`                 | REQ-07: PDF HTTP correctness        |
| `behaviour/graph-api.e2e-api.test.ts`                    | US-10: Knowledge graph API          |
| `behaviour/markdown-content-negotiation.e2e-api.test.ts` | US-10: Markdown content negotiation |

## Accessibility Testing Scope

axe-core covers approximately 30–40% of WCAG criteria automatically: colour contrast, missing labels/ARIA, heading hierarchy, landmark regions, focus management, and link purpose. It cannot verify keyboard-only navigation flow, screen reader comprehension, meaningful reading order, or complex interaction patterns — these require manual review. The automated checks establish a baseline.

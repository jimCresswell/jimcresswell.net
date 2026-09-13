# E2E Tests

End-to-end tests using [Playwright](https://playwright.dev/) and [axe-core](https://github.com/dequelabs/axe-core) for WCAG 2.2 AA compliance.

## Running

```bash
pnpm test:e2e          # Run the full suite against a production build
pnpm test:ui       # Open Playwright UI mode
```

The suite's server is one process the harness starts from Playwright's
global setup (`scripts/e2e-global-setup.ts` starts `scripts/e2e-web-server.ts`).
It binds a free port and keeps the socket for its whole life: it prints the
port, builds the site with it (so the build's canonical URLs and JSON-LD carry
that origin; the two Vercel URL variables are cleared for the build and the
server), attaches Next's production server to the socket in-process
(`scripts/built-site-server.ts`), and prints `ready`. So two checkouts can run
the suite at once on one host and each proves its own build: no other process
can be handed the port, and no server on it can be anything but this run's.
The origin reaches the workers as Playwright's `baseURL` through the runner's
environment, written by global setup before any worker is forked; the port is
chosen in the server process and nowhere else (tests take `baseURL`). PDF
generation is part of the `pnpm build` script and serves its build the same
way, so PDF tests run alongside everything else with no separate project.

One falsifier proves the origin cannot be set from outside; run it from this
directory and expect the full suite green on the bound port:

```bash
VERCEL_URL=stranger.vercel.app VERCEL_ENV=production node_modules/.bin/playwright test  # inherited Vercel URL: cleared
```

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

| File                                         | User Story                              |
| -------------------------------------------- | --------------------------------------- |
| `journeys/home-to-cv.e2e-ui.test.ts`         | US-01: Visitor discovers Jim → CV       |
| `journeys/read-cv.e2e-ui.test.ts`            | US-02: Visitor reads full CV            |
| `journeys/retired-cv-variant.e2e-ui.test.ts` | US-03: Obsolete tilt link → branded 404 |
| `journeys/download-pdf.e2e-ui.test.ts`       | US-04: Visitor downloads PDF            |
| `journeys/pdf-unavailable.e2e-ui.test.ts`    | US-05: Missing PDF → helpful error      |
| `journeys/not-found.e2e-ui.test.ts`          | US-06: Broken link → branded 404        |
| `journeys/theme-comfort.e2e-ui.test.ts`      | US-07: Theme toggle for comfort         |

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

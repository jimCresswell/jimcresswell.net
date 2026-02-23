# Requirements

Non-functional requirements and quality standards for jimcresswell.net.

---

## REQ-01: Accessibility — WCAG 2.2 AA

All user interfaces must meet [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Level AA compliance.

This includes (non-exhaustive):

- **Perceivable**: Text alternatives for non-text content; sufficient colour contrast (4.5:1 for normal text, 3:1 for large text); content adaptable to different presentations; distinguishable without relying on colour alone.
- **Operable**: All functionality available via keyboard; no keyboard traps; sufficient time; no content that causes seizures; skip navigation mechanisms; visible focus indicators; target size ≥ 24×24 CSS pixels (44px recommended).
- **Understandable**: Readable text; predictable navigation; input assistance for forms.
- **Robust**: Valid HTML; compatible with current assistive technologies; correct use of ARIA where needed.

Automated WCAG checks (axe-core) must pass on all pages. Manual accessibility review is recommended for aspects that automated tooling cannot fully verify.

---

## REQ-02: Responsive Design

All pages must be usable and readable on mobile (320px), tablet (768px), and desktop (1280px+) viewports.

- Layout adapts fluidly between breakpoints.
- No horizontal scrolling on any viewport.
- Touch targets meet the 44px minimum size.
- Text is readable without zooming on mobile.

---

## REQ-03: Server-rendered Content

Core content must be server-rendered and accessible without client-side JavaScript.

- All CV text, positioning, and metadata are rendered on the server.
- Client components are used only for interactive features (theme toggle).
- The page is meaningful and navigable with JavaScript disabled.

---

## REQ-04: Performance

Pages must load quickly and provide a responsive user experience.

- Largest Contentful Paint (LCP) < 2.5 seconds.
- Cumulative Layout Shift (CLS) < 0.1.
- First Input Delay (FID) < 100 milliseconds.
- Minimal client-side JavaScript — server components by default.

---

## REQ-05: SEO, Discoverability, and Machine-Readable Content

The site must be discoverable by search engines, present well when shared, and be accessible to AI systems and programmatic consumers.

- All pages have appropriate `<title>` and `<meta description>` tags.
- Open Graph metadata is present for social sharing.
- Schema.org structured data (JSON-LD) is embedded on CV pages and available as a standalone knowledge graph at `/api/graph`.
- Content negotiation via `Accept` headers supports `text/markdown` and `application/ld+json` on all pages.
- Browser-friendly `.md` aliases (e.g. `/cv.md`, `/cv/index.md`) serve markdown without requiring custom headers.
- A dynamic sitemap is generated at `/sitemap.xml`.
- `robots.txt` permits crawling (generated dynamically via `app/robots.ts`).
- The site header provides visible links to MD, DATA, and PDF representations.

---

## REQ-06: Content Integrity

All user-visible text must come from content JSON files (`content/`).

- Components render content verbatim — they do not invent, summarise, or reorder text.
- Content changes are made in the JSON files, not in component code.
- This ensures a single source of truth for all copy.

---

## REQ-07: PDF Quality

The downloadable CV PDF must be high quality and accessible.

- Generated with full Chrome for Testing (not a stripped-down headless shell).
- Correct fonts (Inter, Literata) matching the web version.
- Proper page breaks, margins, and A4 layout.
- Tagged/accessible PDF structure for screen reader compatibility.
- Available immediately on deploy (build-time generation).

---

## REQ-08: Quality Gates

The codebase must pass all quality gates before deployment.

The definitive gate list and command names live in [rules.md](../../.agent/directives/rules.md#code-quality). `pnpm check` runs all six gates; `pnpm test:e2e` and `pnpm test:e2e:pdf` run E2E tests separately. All exported functions must have TSDoc documentation.

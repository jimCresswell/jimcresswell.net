# jimcresswell.net — Design Brief (v0.app)

## Purpose
Build a small, high-quality personal site for Jim Cresswell with:
- A **front page** that communicates positioning quickly and confidently.
- A **CV section** that is readable, credible, and *print-friendly*.
- Strong **accessibility**, **performance**, and **SEO** fundamentals.
- A design that feels **serious, modern, minimalist, and intentional** — “editorial” rather than “marketing”.

Primary outcomes:
- Recruiters/hiring panels can grok the story in < 60 seconds.
- The CV page reads cleanly on mobile + desktop, and prints to A4 well.
- Site looks excellent in both **light and dark mode**.
- Minimal moving parts: extremely robust, low maintenance.

Non-goals:
- Blogging platform, CMS, heavy animations, decorative visuals.
- Social-media-like elements or “personal brand” gimmicks.

## Inputs (source-of-truth content)
This project uses the following provided JSON files as content + constraints:

- `frontpage.content.json`
- `cv.content.json`
- `cv.og.json`
- `cv.presentation.json`

These files are canonical. Do not invent content.

## Information Architecture & Routes
- `/` — Front page
- `/cv/` — Primary CV view (web-first + print-friendly)
- Optional: `/cv/<variant>/` mapped from `cv.content.json -> tilts`

URLs define the resource identity. No hidden state.

## Design Principles
- Editorial clarity over marketing.
- Whitespace as structure.
- Low ornamentation.
- Credibility and calm.
- Accessibility by default.
- Print is first-class for CV.

## Visual System
### Layout
- CV max width: ~760px (single column).
- Front page may be slightly wider for hero.
- Consistent vertical rhythm.

### Typography
- Primary: Inter (via next/font).
- Optional serif for long-form: Literata.
- Line height ~1.6 for CV.
- Type scale (CV):
  - Name: ~42px
  - Section headers: ~18px
  - Body: ~16px

### Color & Theme
- Light and dark modes via CSS variables.
- Neutral palette, high contrast.
- No gradients or decorative color usage.
- Links clearly identifiable.

## Components
Global:
- Header
- Footer
- Container
- Prose
- Section

Front page:
- Hero (name, tagline, summary, CV CTA)
- Highlights (typographic blocks)

CV page:
- CV Header (name, headline, links, print button)
- Sections:
  - Positioning
  - Experience
  - Foundations
  - Capabilities
  - Education
  - Tilts / Contexts

No icons, timelines, or charts.

## Interaction & UX
- Minimal animation.
- Respect prefers-reduced-motion.
- Full keyboard support.
- Proper semantic headings.

## Accessibility (WCAG 2.2 AA)
- Contrast compliant.
- Visible focus.
- Semantic HTML.
- No color-only meaning.
- Accessible print output.

## SEO & Social
### Metadata
- `/`: title + description from frontpage content.
- `/cv/`: title + description from CV content.

### Open Graph
- Implement OG metadata using `cv.og.json`.
- Support configurable OG image URL.

### JSON-LD
- Inject JSON-LD from `cv.content.json -> machine_readable.json_ld`
- Required on `/cv/`.

## Performance & Engineering
- Latest stable Next.js (App Router).
- Modern React.
- Server components by default.
- Minimal JS.
- Lighthouse targets: 95+ across categories.

## Print (CV)
- A4 layout.
- Sensible margins.
- Single column.
- Avoid widows/orphans.
- Print button triggers browser print.

## Content Rules
- No PII beyond explicit CV email if present.
- No invented copy.
- External links safe and explicit.

## Acceptance Criteria
- Clean front page aligned with JSON.
- Single-column CV, readable and printable.
- WCAG 2.2 AA compliant.
- Excellent Lighthouse scores.
- Modern, maintained dependencies only.

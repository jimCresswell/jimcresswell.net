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
This project uses the following files as content + constraints:

**Content files** (in `content/`):
- `content/frontpage.content.json` — front page content
- `content/cv.content.json` — CV content and tilt variants
- `content/cv.og.json` — Open Graph metadata
- `content/jsonld.json` — structured data (JSON-LD)

**Spec files** (in `spec/`):
- `spec/cv.presentation.json` — typography and layout constraints
- `spec/jimcresswell.cv-variants.md` — variant construction rules
- `spec/jimcresswell.deps.md` — approved dependencies
- `spec/theme.json` — colors, typography, layout values

These files are canonical. Do not invent content.

## Information Architecture & Routes
- `/` — Front page
- `/cv/` — Primary CV view (web-first + print-friendly)
- `/cv/<variant>/` — Variant CVs mapped from `content/cv.content.json -> tilts`

URLs define the resource identity. No hidden state.

## Design Principles
- Editorial clarity over marketing.
- Whitespace as structure.
- Low ornamentation.
- Credibility and calm.
- Accessibility by default.
- Print is first-class for CV.

## Character and Tone

The design should express:
- **Inexorable forward motion**: Subtle asymmetry, left-alignment bias, directional energy. Content emerges rather than appears.
- **Warmth without softness**: Warm color palette, generous line-height (1.7), breathing room. Caring, not cold.
- **Non-destructive iconoclasm**: Rounded edges on firm structure. Gentle presentation, unyielding organization.
- **Let the voice through**: The content is distinctive — the design should not flatten it into generic professionalism.

### Typography (locked in)
- **Literata**: Prose, positioning, experience narratives — scholarly, warm, persistent
- **Inter**: Headers, labels, metadata — clean, modern, functional

### Color Direction
- Light mode: warm off-white (#faf9f7), warm charcoal (#292524), accent deep teal (#0d5c63)
- Dark mode: warm dark (#1c1917), warm cream (#f5f5f4), accent teal (#14b8a6)

**Verified contrast ratios**:

| Combination                        | Light   | Dark    | Requirement | Status |
|------------------------------------|---------|---------|-------------|--------|
| Body text (fg) on page background  | 14.42:1 | 16.03:1 | 4.5:1       | ✓      |
| Accent text/links on page bg       | 7.32:1  | 7.03:1  | 4.5:1       | ✓      |
| Focus ring (accent) against page   | 7.32:1  | 7.03:1  | 3:1         | ✓      |
| Page bg color on accent fill       | 7.32:1  | 7.03:1  | 4.5:1       | ✓      |
| Foreground on accent fill          | 1.97:1  | 2.28:1  | 4.5:1       | ✗ FAIL |

**Constraint**: Foreground on accent fill is an unsupported combination (fails contrast). If accent is used as a filled element background (buttons, badges), use the page background color (#faf9f7 / #1c1917) for text. Current design uses text-only controls and avoids this scenario.

## Visual System
### Layout
- CV max width: 760px (single column).
- Front page may be slightly wider for hero.
- Consistent vertical rhythm.

### Typography
- Primary: Inter (via next/font) — headers, labels, metadata.
- Serif for prose: Literata — positioning, experience narratives.
- Line height: 1.7 for CV prose.
- Type scale (CV):
  - Name: 42px
  - Section headers: 18px
  - Body: 16px

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
- CV Header (name, headline, links)
- Sections:
  - Positioning
  - Experience
  - Foundations
  - Capabilities
  - Education
  - Tilts / Contexts

No icons, timelines, or charts.

### UI Controls (text-only)
- **Theme toggle**: Text links — "Light · Dark · Auto" — no sun/moon icons
- **Print button**: Text button — "Print CV" — no printer icon
- This is an intentional choice: typography-driven controls fit the editorial aesthetic

## Interaction & UX
- Minimal animation.
- Respect prefers-reduced-motion.
- Full keyboard support.
- Proper semantic headings.

## Accessibility (WCAG 2.2 AA)

Meet all WCAG 2.2 Level A and AA success criteria. Key requirements for this project:

### Perceivable
- **Color contrast**: 4.5:1 minimum for body text, 3:1 for large text (≥18pt or ≥14pt bold)
- **No color-only meaning**: Links must be distinguishable by more than color (underline or other indicator)
- **Text resize**: Content must remain usable at 200% text zoom
- **Reflow**: Content must reflow to single column at 400% zoom (already single-column layout)
- **No images of text**: Use real text, not image-based headings
- **Responsive**: All content accessible on mobile and desktop

### Operable
- **Keyboard accessible**: All interactive elements (links, buttons, theme toggle) must be operable via keyboard
- **Skip link**: Provide "Skip to content" link for keyboard users
- **Focus visible (2.4.7)**: Visible focus indicator on all interactive elements
- **Focus appearance (2.4.11, new in 2.2)**: Focus indicator must be at least 2px thick outline or equivalent contrasting area
- **Focus not obscured (2.4.12, new in 2.2)**: Focused elements must not be hidden behind sticky headers
- **Target size (2.5.8, new in 2.2)**: Interactive targets must be at least 24×24 CSS pixels (text links in prose exempt if sufficient spacing)
- **No motion harm**: No flashing content; respect `prefers-reduced-motion`
- **Descriptive page titles**: Each page has unique, descriptive `<title>`
- **Descriptive link text**: Links make sense out of context (no "click here")
- **Meaningful headings**: Proper heading hierarchy (h1 → h2 → h3), no skipped levels

### Understandable
- **Language declared**: `<html lang="en">`
- **Consistent navigation**: Header/footer consistent across pages
- **Labels match names**: Accessible names match visible labels

### Robust
- **Valid HTML**: Semantic markup, proper nesting
- **ARIA when needed**: Use native HTML elements first; ARIA only for enhancement
- **State changes announced**: Theme toggle state changes should be perceivable

### Print Accessibility
- **PDF readability**: Print output should maintain reading order
- **Sufficient contrast**: Print styles must also be legible
- **No information loss**: All content visible in print (no hidden-by-JS content)

## SEO & Social
### Metadata
- `/`: title + description from frontpage content.
- `/cv/`: title + description from CV content.

### Open Graph
- Implement OG metadata using `content/cv.og.json`.
- Support configurable OG image URL.

### JSON-LD
- Inject JSON-LD from `content/jsonld.json`
- Required on `/cv/` and all `/cv/<variant>/` pages.

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

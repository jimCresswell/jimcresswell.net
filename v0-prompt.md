You are building jimcresswell.net using the latest stable Next.js (App Router) and modern React.

## Source Files (Canonical — Do Not Invent Content)

Read all content from these files. They are the single source of truth:

**Content files** (in `content/`):
- `content/frontpage.content.json` — front page content
- `content/cv.content.json` — CV content and tilt variants
- `content/cv.og.json` — Open Graph metadata
- `content/jsonld.json` — structured data (JSON-LD)

**Spec files** (in `spec/`):
- `spec/jimcresswell.design-brief.md` — design outcomes and requirements
- `spec/cv.presentation.json` — typography and layout constraints
- `spec/jimcresswell.cv-variants.md` — variant construction rules
- `spec/jimcresswell.deps.md` — approved dependencies
- `spec/theme.json` — colors, typography, layout values (import for CSS variables)
- `spec/ui-structural-components.md` — navigation and chrome (header, footer, theme toggle, skip link)
- `spec/ui-content-components.md` — content rendering (hero, positioning, experience, etc.)
- `spec/responsive-layout.md` — mobile-first responsive behavior and breakpoints

**Critical**: Do not invent, rewrite, paraphrase, summarise, or omit any text. All copy must come from these files **and must be rendered in full**.

**Voice preservation**: Do not simplify or sanitise language that expresses uncertainty, constraint, or trade-off. Preserve deliberate asymmetry, restraint, and unfinished edges in the prose.

---

## Copy Lock (Non-Negotiable)

All copy in `content/*.json` is FINAL.

- Do **not** rewrite, paraphrase, summarise, correct, "improve", normalise, or translate any copy.
- Do **not** omit any sentence, paragraph, list item, or section for aesthetic or layout reasons.
- Do **not** reorder copy within a section unless a spec explicitly requires it.
- Headings, labels, punctuation, casing, and hyphenation are part of the copy. Do not change them.
- Your job is **typesetting and rendering**, not editing.

If a layout constraint conflicts with content length, **change the layout** (spacing, breaks, flow), never the content.

### Document Precedence (when in conflict)
1. This prompt
2. `spec/jimcresswell.design-brief.md`
3. `spec/cv.presentation.json` + `spec/theme.json`
4. Content files (`content/*.json`)

---

## Goal

Create a minimal, editorial-quality personal site with a front page and CV pages. The design should feel calm, serious, and intentional — not like a SaaS dashboard or marketing site.

"Editorial-quality" refers to typography, spacing, hierarchy, and reading experience — not any change to wording, tone, or structure of the copy.

### Do Not Optimise For
- Animation density or decorative motion
- Visual novelty / "portfolio template" aesthetics
- Marketing persuasion, hype language, or testimonial patterns
- Heavy gradients, glows, or glassmorphism
- Unnecessary component abstraction
- Timelines, milestones, career arcs, or "impact metrics" not present in content
- Leadership clichés, journeys, growth narratives, or inspirational framing

---

## Character and Tone

The design should express:
- **Inexorable forward motion**: Subtle asymmetry, left-alignment bias, directional energy. Content emerges rather than appears.
- **Warmth without softness**: Warm color palette, generous line-height (1.7), breathing room. Caring, not cold.
- **Non-destructive iconoclasm**: Rounded edges on firm structure. Gentle presentation, unyielding organization.
- **Let the voice through**: The content is distinctive — the design should not flatten it into generic professionalism.

The personal "Grounded Practice" section in foundations should feel integrated, not separate — it demonstrates the same methodology (systems thinking, leverage points, changing context to change practice) applied outside professional contexts. **Do not visually demote this section** as an aside or personal footer; it maintains equal typographic seriousness with other foundations.

---

## Routes

- `/` — front page
- `/cv/` — primary CV
- `/cv/<variant>/` — variant CVs mapped from `content/cv.content.json -> tilts`

Variants are separate resources. Do not blend base CV and tilt copy.

- `/cv/` renders base CV content only.
- `/cv/<variant>/` renders the variant's tilt content plus the shared non-tilt CV sections, exactly as defined in `spec/jimcresswell.cv-variants.md`.

---

## Key Requirements

### Layout & Typography
- Single-column CV layout, max width 760px
- **Inter** (via next/font): Headers, labels, metadata — clean, modern, functional
- **Literata** (via next/font): Prose, positioning, experience narratives — scholarly, warm, persistent
- CV line height: 1.7 for prose
- Type scale: name 42px, section headers 18px, body 16px
- Whitespace-driven hierarchy — no boxes, rules, or decorative elements

### Color Direction
- Light mode: warm off-white (#faf9f7), warm charcoal (#292524), accent deep teal (#0d5c63)
- Dark mode: warm dark (#1c1917), warm cream (#f5f5f4), accent slightly lighter
- No gradients or decorative color usage

### Theme
- Light and dark mode via CSS variables + next-themes
- Support system, light, and dark modes
- No flash of wrong theme on load
- Use Tailwind 4 with `attribute="class"` strategy

### Accessibility (WCAG 2.2 AA)
Full compliance with WCAG 2.2 Level A and AA. Key implementation requirements:

**Contrast & Color**
- Body text: 4.5:1 contrast ratio minimum
- Large text (≥18pt): 3:1 minimum
- Links: underline or non-color indicator (not color alone)

**Keyboard & Focus**
- All interactive elements keyboard accessible
- Skip to content link at page start
- Visible focus indicator (2px outline or equivalent)
- Focus not obscured by sticky elements
- Interactive targets: 24×24px minimum (text links in prose exempt)

**Structure & Semantics**
- `<html lang="en">`
- Proper heading hierarchy (h1 → h2 → h3, no skipped levels)
- Semantic HTML elements (nav, main, article, section, footer)
- Unique, descriptive page titles

**Motion & State**
- Respect `prefers-reduced-motion`
- Theme toggle state announced to assistive tech

**Print**
- Maintains reading order
- All content visible (no JS-hidden content in print)

### Print (CV)
- A4 layout with proper margins (18mm)
- Single column, no page breaks mid-section
- Avoid widows/orphans
- Print button triggers browser print
- **Variant print behaviour**: All variant routes (`/cv/<variant>/`) are independently printable with identical print styling. `/cv/` is the canonical print target; variants inherit the same print layout.

### SEO & Metadata
- Open Graph metadata from `content/cv.og.json` (no Twitter tags)
- JSON-LD injected from `content/jsonld.json` on `/cv/` and all variants
- Proper title and description per page

### Engineering
- Server components by default, minimal client JS
- next/font for fonts
- Lighthouse 95+ target
- Modern dependencies only (see spec/jimcresswell.deps.md)

---

## Front Page

- Hero with name, tagline, summary, and CV CTA
- Highlights rendered as clean typographic sections
- Minimal navigation
- Content from `content/frontpage.content.json`

---

## CV Page

- Name, headline, positioning paragraphs
- Experience, foundations (including "Grounded Practice"), capabilities, education sections
- Context/tilt variants (see spec/jimcresswell.cv-variants.md)
- Strong reading experience on mobile and desktop
- Content from `content/cv.content.json`

---

## Quality Bar

- Editorial, calm, credible
- No icons, charts, timelines, or gimmicks
- UI controls are text-only: "Light · Dark · Auto" for theme toggle, "Print CV" for print button
- Lighthouse 95+
- Print-friendly
- Logo assets (`logo/`) are authoritative — do not redesign or stylistically alter
- Variants are URL-defined resources — do not merge or blend them; if uncertain, generate `/cv/` and leave stubs for variants
- **If uncertain, do less**: Prefer omission over approximation. Render less rather than guess at layout, content, or hierarchy.

---

## Completeness Check (Before You Finish)

Verify that every field of user-visible copy from:
- `content/frontpage.content.json`
- `content/cv.content.json` (including all paragraphs and list items)

has been rendered on the relevant route.

No truncation, collapsing, "read more", or editorial shortening.
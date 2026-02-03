# UI Content Component Specification

This document specifies how content from `content/*.json` is rendered. For structural/navigational components (header, footer, theme toggle, etc.), see `ui-structural-components.md`.

---

## Content Authority

**The JSON files are the sole source of content.** This specification describes:
- How to **render** content (typography, spacing, hierarchy)
- What **capacity** the design should accommodate (e.g., "typically 1-3 paragraphs")
- How to **structure** the markup (semantic elements, accessibility)

This specification does **not**:
- Dictate how much content exists
- Permit truncation, summarization, or omission
- Allow invention of content not present in the JSON

When this document says "1-2 paragraphs" or "array of items," it describes **expected content shape for design purposes**. The actual content is defined entirely by the JSON. Render whatever is there, in full.

---

## Front Page

### Hero

- **Source**: `frontpage.content.json → hero`
- **Structure**:
  - Name: `<h1>`, largest type (42px)
  - Tagline: Below name, accent color or muted, Inter font
  - Summary: Paragraphs from `hero.summary[]`, Literata (prose font), generous line-height (1.7). Design should accommodate multiple paragraphs.
- **Layout**:
  - Vertically centered or top-third of viewport on desktop
  - Full-width container, content max-width 760px
  - Generous vertical padding (min 2rem mobile, 4rem desktop)
- **CTA**: Primary navigation link to `/cv/` styled as text link or subtle button

### Highlights

- **Source**: `frontpage.content.json → highlights`
- **Structure**: Array of `{ title, description }` objects
- **Rendering**:
  - Each highlight as a typographic block (no cards or boxes)
  - Title: Section header style (18px, Inter, bold or semibold)
  - Description: Body text (16px, Literata)
- **Layout**:
  - Single column, stacked vertically
  - Consistent spacing between highlights (section gap: 24px)
- **Quantity**: Render all items, do not truncate

### External Links

- **Source**: `frontpage.content.json → links`
- **Rendering**: Simple text links, optionally in footer or after highlights
- **Format**: Label (key name, capitalized) + URL
- **Accessibility**: Descriptive link text, open in new tab with `rel="noopener"`

---

## CV Page

### CV Header

- **Source**: `cv.content.json → meta`
- **Structure**:
  - Name: `<h1>`, largest type (42px)
  - Headline: Below name, smaller (16px), may use middle dots as separators
- **Links**: Render from `cv.content.json → links`
  - Email: `mailto:` link
  - Others: External links with icons or text labels
- **Print button**: In header actions slot on CV pages, see `ui-structural-components.md`

### Positioning

- **Source**: `cv.content.json → positioning.paragraphs`
- **Rendering**:
  - Each paragraph as `<p>` in Literata (prose font)
  - Line height: 1.7
  - Paragraph gap: 14px
- **Section heading**: None (positioning is the lead, not a labeled section)
- **Importance**: This is the first thing readers see after the header — do not compress or summarize

### Experience

- **Source**: `cv.content.json → experience[]`
- **Section heading**: "Experience" or similar, `<h2>`, 18px Inter
- **Per entry**:
  - Organisation: Bold or semibold
  - Role: Regular weight, may be on same line or below
  - Dates: `start_year` – `end_year`, muted color or parenthetical
  - Summary: Array of paragraphs, Literata, full prose treatment
- **Layout**: Single column, stacked entries with section gap (24px) between
- **Quantity**: Render all entries and all paragraphs within each entry

### Foundations

- **Source**: `cv.content.json → foundations[]`
- **Section heading**: "Foundations" or similar, `<h2>`, 18px Inter
- **Per entry**:
  - Title: Bold or semibold, `<h3>` (implied, for hierarchy)
  - Description: Array of paragraphs, Literata, full prose treatment
- **"Grounded Practice"**: This section must be rendered with equal typographic weight — it is not an aside or footer
- **Layout**: Single column, consistent with Experience section

### Capabilities

- **Source**: `cv.content.json → capabilities[]`
- **Section heading**: "Capabilities" or similar, `<h2>`, 18px Inter
- **Rendering**: 
  - Simple unordered list (`<ul>`, `<li>`)
  - Or: Comma-separated prose line
  - Body text styling (16px)
- **Layout**: Single column, no multi-column grids
- **Quantity**: Render all items, do not truncate

### Education

- **Source**: `cv.content.json → education[]`
- **Section heading**: "Education" or similar, `<h2>`, 18px Inter
- **Per entry**:
  - Degree + Field: e.g., "PhD, Astrophysics & Cosmology"
  - Institution: Below or inline, muted or regular weight
- **Layout**: Compact list, single column
- **Quantity**: Render all entries

### Links

- **Source**: `cv.content.json → links`
- **Rendering**: May be in CV header or as a separate section at bottom
- **Format**:
  - Email: `mailto:` link, visible email address
  - URLs: Text links with descriptive labels

---

## Variant Pages (`/cv/<variant>/`)

### Tilt-Modified Content

- **Source**: `cv.content.json → tilts.<key>`
- **What changes**: Positioning paragraphs are replaced with tilt-specific `positioning`
- **What stays the same**: Experience, Foundations, Capabilities, Education, Links
- **Context label**: May be shown subtly (e.g., "UK Civil Service / Public AI Leadership")
- **See also**: `jimcresswell.cv-variants.md` for construction rules

---

## General Content Rules

### Typography Assignment

| Content Type | Font | Size | Line Height |
|--------------|------|------|-------------|
| Name (h1) | Inter | 42px | 1.2 |
| Section headers (h2) | Inter | 18px | 1.3 |
| Entry titles (h3) | Inter | 16px bold | 1.4 |
| Prose (paragraphs) | Literata | 16px | 1.7 |
| Lists | Literata or Inter | 16px | 1.5 |
| Metadata (dates, labels) | Inter | 14px | 1.4 |

### Spacing

| Element | Gap |
|---------|-----|
| Paragraphs within a section | 14px |
| Between sections | 24px |
| Between entries (experience, foundations) | 24px |

### Completeness

- Render **all** content from the JSON
- No truncation, "read more", or collapsing
- No editorial compression or summarization
- If layout conflicts with content length, adjust layout, not content

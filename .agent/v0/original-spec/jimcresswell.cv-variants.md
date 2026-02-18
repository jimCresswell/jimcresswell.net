# jimcresswell.net — CV Variants Specification

This document defines what **CV variants** are, **why they exist**, and **how to construct them** from the canonical content files.

It is designed to be used alongside:

**Content files** (in `content/`):

- `content/cv.content.json`
- `content/cv.og.json`
- `content/frontpage.content.json`
- `content/jsonld.json`

**Spec files** (in `spec/`):

- `spec/cv.presentation.json`

No other content sources should be introduced without an explicit decision.

---

## What “CV variants” are

A **variant** is a _contextual view_ of the CV, presented at a distinct URL:

- Primary CV: `/cv/`
- Variant CV: `/cv/<variant>/`

A variant is **not a different CV** and should not fork the core narrative.
Instead, it is:

- the same underlying factual record, and
- the same visual system,
- with _lightweight, explicitly-scoped adjustments_ to emphasis and ordering so a reader in a specific context gets the most relevant story faster.

The variants exist to improve “time-to-credibility” for different audiences while preserving a single canonical source of truth.

---

## Why variants exist

### 1) Reader context differs

Different readers scan for different evidence:

- hiring managers and principals look for scope, judgment, systems thinking
- product/strategy audiences look for decision-making and measurable outcomes
- AI-adjacent audiences look for applied reasoning, safety, pragmatism, and leverage

A single linear CV can be excellent and still be suboptimal for specific contexts.

### 2) Preserve integrity without duplication

Variants allow “positioning” and “tilt” to change without duplicating the entire CV content or risking divergence over time.

### 3) Better SEO + sharability

Each variant has a stable URL that can be shared to the most relevant audience (and can have its own metadata), without changing the canonical CV.

---

## Source-of-truth relationships (content + structure)

### Canonical files and responsibilities

#### `content/cv.content.json` — content source of truth

Contains:

- core CV content (positioning, experience, foundations, capabilities, education)
- optional "tilts" that define variants (variant-specific copy and/or emphasis)

This file defines **what can be said** on any CV page.

#### `content/jsonld.json` — structured data source of truth

Contains:

- machine-readable JSON-LD graph (schema.org)
- Person, Organization, credentials, publications

This file defines **how the CV is understood by machines and search engines**.

#### `spec/cv.presentation.json` — presentation constraints (structure rules)

Defines:

- the CV layout constraints (single column, max widths)
- typography scale guidance
- print guidance

This file defines **how the CV must look and behave**, including print.

#### `content/cv.og.json` — Open Graph metadata base

Defines the Open Graph fields for the CV.
Variants may override certain fields, but should fall back to this file.

This file defines **how the CV appears when shared**.

#### `content/frontpage.content.json` — homepage content and links

Defines:

- hero, highlights, links, primary navigation

This file may include:

- a link to `/cv/`
- optionally a small “CV variants” list if you decide to expose them on the front page

---

## Variant Selection Rules

Variants are **deterministic**: the URL uniquely defines which variant to render.

| Route            | Behaviour                              |
| ---------------- | -------------------------------------- |
| `/cv/`           | Render base CV (no tilt applied)       |
| `/cv/<key>/`     | Render CV with tilt from `tilts.<key>` |
| `/cv/<unknown>/` | Return 404 (do not fall back to base)  |

**Do not merge variants**. Each variant is a distinct resource. If uncertain which tilt to apply, generate `/cv/` only and leave stubs for variant routes.

---

## Variant Inventory

### Where variants come from

Variants are defined by `content/cv.content.json -> tilts`.

Each key under `tilts` becomes a route slug:

- `tilts.<key>` → `/cv/<key>/`

Current variants:

- `/cv/` — Main CV (general positioning, covers private sector and founder contexts)
- `/cv/public_sector/` — UK Civil Service / Public AI Leadership

Note: The JSON file may contain additional tilt definitions (`private_ai`, `founder`) retained for future use. Only `public_sector` is currently active as a variant route.

(Use the actual keys present in the file — do not invent new ones without editing the JSON.)

### What a tilt contains

A tilt typically includes:

- a short “context” statement (what this version is optimised for)
- optional re-ordering guidance (what to surface earlier)
- optional variant-specific bullets or highlights

A tilt should **not**:

- contradict the main CV
- introduce new factual claims not in the canonical experience sections
- create a second truth

---

## Construction rules: how to build a variant page

A variant page is built by applying a **thin transform** to the base CV model.

### 1) Load canonical CV model

Load the base CV content from `content/cv.content.json`:

- meta
- positioning
- experience
- foundations
- capabilities
- education
- tilts

Load JSON-LD from `content/jsonld.json`.

### 2) Select the tilt by route slug

- Route: `/cv/<variant>/`
- Variant key: `<variant>`
- Tilt object: `cv.tilts[variantKey]`

If tilt is missing:

- Return 404 (preferred), or
- Redirect to `/cv/` (acceptable fallback, but 404 is cleaner for SEO).

### 3) Apply allowed transformations (in order)

Allowed transforms are intentionally limited:

#### A) “Context header” injection (recommended)

Add a small, clearly-labelled block near the top:

- Heading: “Context”
- Body: tilt-specific context copy

This should appear:

- after the name/headline header
- before the main positioning paragraphs

#### B) Emphasis / ordering adjustments (optional)

Permitted adjustments:

- reorder **sections** (e.g., move “Capabilities” above “Education”)
- reorder **experience entries** only if you preserve chronology somewhere (e.g. “Selected experience” first, followed by full chronology)

Not permitted:

- hiding or removing roles entirely (unless the base CV explicitly supports a “selected experience” subset and still provides the full list)

#### C) Variant highlight callouts (optional)

You may include:

- a small list of 3–5 “Relevant highlights” derived from existing experience bullets
- these must be direct extracts or faithful paraphrases of existing canonical content

Not permitted:

- new facts
- new metrics
- new employers/projects not already present

### 4) Presentation must not change

Variants must follow `spec/cv.presentation.json` exactly:

- single-column layout
- typographic hierarchy
- print CSS rules

Variants are about _content emphasis_, not redesign.

### 5) Metadata rules (Open Graph only; no Twitter)

- Default OG values come from `content/cv.og.json`
- Variant page may override:
  - `title`
  - `description`
- Variant page should generally keep:
  - `type`
  - `locale`
  - `site_name`
  - base OG image (unless you explicitly generate variant images)

Recommended pattern:

- Base: “CV — Jim Cresswell”
- Variant: “CV (AI Platform) — Jim Cresswell” or similar

If no variant override is provided, use the base OG metadata.

### 6) JSON-LD rules

Always include the same JSON-LD graph from `content/jsonld.json` on:

- `/cv/`
- all `/cv/<variant>/` pages

Variants do not alter structured data, because they are simply views of the same person and career record.

---

## Navigation & discoverability

### Where to show variants

Choose one of these strategies:

#### Strategy A — Minimal (recommended initially)

- `/` links to `/cv/`
- `/cv/` contains a small “Variants” section listing available variants

#### Strategy B — Front page exposure

- `/` includes links to specific variants (only if you want visitors to pick a track)

#### Strategy C — Hidden but shareable

- Variants exist, but only appear in the footer or not at all
- Used mainly when sharing a specific URL

The best default is **Strategy A**: discoverable but not cluttering the front page.

### Variant link labels

Use tilt-provided labels if present; otherwise generate human labels from the key.

---

## URL & canonicalization rules

- `/cv/` is canonical for the CV.
- Variants should set:
  - `rel="canonical"` to `/cv/` (recommended)
  - or to themselves if you want independent indexing

Default recommendation for personal sites:

- Canonical of variants → `/cv/`
  This avoids SEO dilution and keeps the main CV as the authoritative page, while variants remain useful for sharing.

---

## Acceptance criteria

A correct implementation will:

- [ ] Build `/cv/<variant>/` pages only for keys in `content/cv.content.json -> tilts`
- [ ] Show a clear “Context” block for variants
- [ ] Keep the same layout and print behaviour as `/cv/` (per `spec/cv.presentation.json`)
- [ ] Use Open Graph metadata with base defaults from `content/cv.og.json`
- [ ] Include the same JSON-LD on all CV pages
- [ ] Never invent or add new factual claims in variant-specific copy

# jimcresswell.net — v0 Project Bundle

This repository contains the specification and content files for generating jimcresswell.net using [v0.app](https://v0.app).

## Quick Start

**Pass to v0:**
```
v0-prompt.md     ← Entry point (read this first)
content/         ← Data sources
spec/            ← Requirements and constraints
```

**Do NOT pass to v0:**
```
archive/         ← Historical reference only
post-v0/         ← Post-generation hardening (use after export)
logo/            ← Identity asset generation
```

---

## File Structure

### `v0-prompt.md` — Entry Point

The primary instruction file for v0. Contains:
- Document precedence order
- Goals and anti-goals ("Do not optimise for")
- Routes to generate
- Key requirements (accessibility, theming, print)
- Quality bar

**Start here.**

### `content/` — Data Sources

Canonical content — v0 should read from these, not invent text.

| File | Purpose |
|------|---------|
| `cv.content.json` | CV content: positioning, experience, foundations, capabilities, education, tilts |
| `frontpage.content.json` | Homepage: hero, highlights, navigation, links |
| `cv.og.json` | Open Graph metadata for social sharing |
| `jsonld.json` | Schema.org structured data for SEO |

### `spec/` — Requirements & Constraints

Design and engineering specifications.

| File | Purpose |
|------|---------|
| `jimcresswell.design-brief.md` | Design outcomes, principles, WCAG 2.2 AA details, contrast table |
| `cv.presentation.json` | Typography scale, layout constraints, print rules |
| `jimcresswell.cv-variants.md` | How to construct CV variants from tilts |
| `jimcresswell.deps.md` | Approved npm dependencies and exclusions |
| `theme.json` | Colors, typography, layout values (import for CSS variables) |
| `ui-structural-components.md` | Structural UI (header, footer, theme toggle, skip link, print button) |
| `ui-content-components.md` | Content rendering (hero, positioning, experience, etc.) |
| `responsive-layout.md` | Mobile-first responsive behavior and breakpoints |

### `logo/` — Identity Assets

Logo generation and display.

| File | Purpose |
|------|---------|
| `generate-icons.ts` | Dev script to generate static favicon/OG SVGs |
| `Logo.tsx` | Theme-aware React component for in-page logo |

**Do not redesign.** These are authoritative identity assets.

### `archive/` — Historical Reference

Not for v0. Contains prior content for reference only.

### `post-v0/` — Post-Generation

Not for v0. Use after exporting from v0:
- `hardening-checklist.md` — Comprehensive QA checklist
- `testing-strategy.md` — Manual + automated testing approach
- `deployment-notes.md` — Hosting, security headers, SEO

---

## Document Precedence

When documents conflict, follow this order:

1. `v0-prompt.md`
2. `spec/jimcresswell.design-brief.md`
3. `spec/cv.presentation.json` + `spec/theme.json`
4. Content files (`content/*.json`)

---

## Routes to Generate

| Route | Source |
|-------|--------|
| `/` | `content/frontpage.content.json` |
| `/cv/` | `content/cv.content.json` |
| `/cv/<variant>/` | `content/cv.content.json` → `tilts.<key>` |

Current variants:
- `/cv/` — Main (general, covers private sector and founder contexts)
- `/cv/public_sector/` — UK Civil Service / Public AI Leadership

---

## Key Constraints

- **No invented content** — All text from JSON files
- **WCAG 2.2 AA** — Full accessibility compliance
- **Print-friendly CV** — A4, 18mm margins, single column
- **Text-only controls** — "Light · Dark · Auto" toggle, "Print CV" button
- **No icons, charts, timelines** — Editorial aesthetic
- **Inter + Literata** — Only approved fonts (via next/font)

---

## After v0 Export

1. Commit raw export as `v0-export/<date>`
2. Work through `post-v0/hardening-checklist.md`
3. Run tests per `post-v0/testing-strategy.md`
4. Configure deployment per `post-v0/deployment-notes.md`

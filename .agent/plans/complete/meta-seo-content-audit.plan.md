# Meta & SEO Content Audit

Review and align all titles, descriptions, Open Graph tags, JSON-LD fields, manifest entries, and hardcoded editorial text across the site. Broken out from [cv-editorial-improvements.plan.md](../cv-editorial-improvements.plan.md) (which flagged `meta.summary` for review after the capabilities rewrite).

## Status: Complete — Phase 1 (technical) and Phase 2 (editorial) both done

## How to use this plan

Both phases are complete. This document is now a reference and audit trail.

### Phase 2 decisions (editorial session with Jim, 2026-02-18)

| #   | Item                      | Decision                                                                                                                                                                                                                                                                                                                                                         |
| --- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `meta.summary`            | Replaced "open ecosystems" with "public digital infrastructure". Derived from capability 2.                                                                                                                                                                                                                                                                      |
| 2   | Front page OG description | Added `frontpage.meta.description` field: "Understanding systems — from cosmology and large-scale structure to AI for public benefit. The more I learn, the bigger the questions get." `app/layout.tsx` now uses this instead of joining all hero paragraphs.                                                                                                    |
| 3   | `KNOWS_ABOUT`             | Rewritten from 20 to 34 items. Clustered by theme (leadership, creation, domains, craft, technologies, ecological). Added MCP, public digital infrastructure, organisational design, zero-to-one, responsible AI, education technology, and more. Removed stale "AI-enabled ecosystems", "Genetic diversity". Reframed "Resilience through diversity".           |
| 4   | `OCCUPATION`              | Name changed from "Leading exploration" to "Exploration and origination". Skills updated from 5 to 7: Problem shaping, Systems understanding, Judgment under uncertainty, Constraint-based decision making, Research-to-practice translation, Origination, Architectural direction-setting. Description unchanged (already aligns with positioning paragraph 1). |

Editorial hierarchy established: `editorial-guidance.md` governs voice → positioning paragraphs and capabilities are the editorial baseline → metadata derives from these.

---

## Goals

1. **Remove all hardcoded data.** Values like the site URL, the person's name, and the OG image path should be defined once and derived everywhere else. (This applies to data — config values like icon paths, cache headers, and OG image dimensions are fine where they are.) **Phase 1 complete** — site URL is now environment-aware (`lib/site-config.ts`), person name derived in components and config, `robots.txt` converted to dynamic `app/robots.ts`.

2. **Bring editorial and content consistency.** After the capabilities rewrite, section rename, and headline change, several content-facing outputs are stale or misaligned — `meta.summary` still says "open ecosystems", `KNOWS_ABOUT` predates the new capabilities. Every piece of content that a human or search engine reads should reflect the current editorial voice and positioning. (This applies to content, not to pure data like theme colours or cache policies.) **Phase 2 pending** — editorial review with Jim needed for items 1–4.

## The trigger

The capabilities rewrite deliberately removed "open ecosystems" language, but `meta.summary` still uses it. More broadly, metadata is spread across content JSON, derivation modules, JSON-LD constants, and hardcoded component strings — no single audit has checked whether all of these are editorially consistent after recent changes (capabilities rewrite, section rename to "Before Oak", headline change to dual headlines).

Additionally, the editorial guidance (formerly `identity.md`) referenced the old headline "The problem is the interesting part" — this was updated as part of Phase 1 to reflect the current headlines.

---

## Sequencing

**This plan completes before the [personal knowledge graph plan](../personal-knowledge-graph.plan.md) starts.** The knowledge graph plan migrates content into a new entity model. This plan fixes the _content_ of things that are currently in the wrong place. If PKG runs first, it migrates stale content (e.g. "open ecosystems" in `meta.summary`, outdated `KNOWS_ABOUT`) and then needs editorial fixes on top.

Specifically:

- **`meta.summary`** (Phase 2) — Fix the editorial content now while it's a single string. PKG will later decouple it into domain-appropriate descriptions (see [ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md)). The editorial fix is not wasted — it establishes the right content. PKG changes where it lives.
- **`KNOWS_ABOUT` and `OCCUPATION`** (Phase 2) — Fix the editorial content now while it's in `lib/jsonld.ts`. PKG will later move these into the content model. Same principle: fix the content first, migrate the corrected content.
- **Hardcoded URL** (Phase 1, done) — `lib/site-config.ts` provides an environment-aware `SITE_URL` that PKG can build on.
- **`editorial-guidance.md`** (Phase 1, done) — Stale headline reference updated to current headlines.

---

## Editorial context for Phase 2

The capabilities rewrite ([capabilities-editorial.plan.md](capabilities-editorial.plan.md), completed) changed the editorial positioning. The metadata hasn't caught up. Here's what changed and what's now stale:

**What the capabilities rewrite did:**

- Replaced four abstract strategic capabilities with five blended capabilities that pair strategic framing with concrete, verifiable claims.
- Deliberately removed "open ecosystems" language. The new capabilities use clearer terms: "public digital infrastructure", "accessible … in AI-mediated environments", "public services".
- Added prominent references to: AI-first interfaces, MCP, SDK design (capability #2), team topologies and organisational growth (capability #4), system-level impact through public services (capability #5).

**What's now stale:**

- `meta.summary` still says "open ecosystems" — the phrase the rewrite removed.
- `KNOWS_ABOUT` says "AI-enabled ecosystems" (removed language), is missing MCP and SDK design (now prominent), and may have other gaps.
- `OCCUPATION` description was written before the rewrite — framing may need alignment.
- The front page OG description (derived from `hero.summary`) is 2000+ characters — social media truncates at ~200.

---

## Inventory of all metadata and SEO-relevant content

### A. Content-derived metadata (from `content/*.json`)

These values are the editorial source of truth. Changes here propagate automatically.

| Field                    | Current value                                                                                                                             | Used by                                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `cv.meta.name`           | "Jim Cresswell"                                                                                                                           | Page titles, OG, JSON-LD Person, manifest, footer copyright                                             |
| `cv.meta.headline`       | "Understanding systems, shaping change"                                                                                                   | Screen headline (primary), print headline                                                               |
| `cv.meta.headline_alt`   | "The questions keep getting bigger"                                                                                                       | Screen headline (alternate, toggle)                                                                     |
| `cv.meta.summary`        | "Shaping high-impact problems for people and planet — AI-powered knowledge systems, national-scale public services, and open ecosystems." | OG description (CV pages), JSON-LD Person description, manifest description, page meta description (CV) |
| `cv.meta.locale`         | "en-GB"                                                                                                                                   | OG locale (as "en_GB"), `<html lang>` attribute (derived from `frontpage.meta.locale`).                 |
| `frontpage.meta.title`   | "Jim Cresswell"                                                                                                                           | Root page title, root OG title, OG siteName                                                             |
| `frontpage.hero.name`    | "Jim Cresswell"                                                                                                                           | Front page `<h1>`, footer copyright                                                                     |
| `frontpage.hero.summary` | 9 paragraphs, starting with "I have always been drawn to understanding systems." and ending with "My CV is available here."               | Root page description (all paragraphs stripped of markdown and joined), root OG description             |

### B. Derived metadata (logic in `lib/`)

These modules build OG/JSON-LD objects from content JSON. The derivation logic is the place to change formats.

| Module               | What it produces         | Key hardcoded formats                                                                                                                                                                                |
| -------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/site-config.ts` | `SITE_URL` constant      | Environment-aware via Vercel env vars (`VERCEL_ENV`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`). Pure `getSiteUrl` function, unit-tested. Production resolves to `https://www.jimcresswell.net`. |
| `lib/cv-content.ts`  | `cvOpenGraph` object     | Title format: `"${name} — CV"`. URL and OG image URL derived from `SITE_URL`.                                                                                                                        |
| `lib/jsonld.ts`      | Full Schema.org `@graph` | Imports `SITE_URL` from `site-config.ts`. WebPage and Person nodes derived from `cvOpenGraph` and `cvContent`.                                                                                       |
| `lib/pdf-config.ts`  | PDF filename and paths   | `PDF_FILENAME` derived from `cv.meta.name`. Used in download link and `Content-Disposition` header.                                                                                                  |

### C. Hardcoded JSON-LD constants (`lib/jsonld.ts`)

These have no editorial equivalent in content JSON — they exist only for search engines and AI systems.

**`KNOWS_ABOUT`** (20 items):

> Exploratory leadership · Systems thinking · Technical strategy · Communicating technical impact to non-technical stakeholders · Digital-first public services · AI-enabled ecosystems · Open API and SDK design · Agentic software development · Open data · Hybrid semantic search · TypeScript · Node.js · React · Next.js · Google Cloud Platform · Vercel · Netlify · Ecology-informed agriculture · Perennial food systems · Genetic diversity

**`OCCUPATION`**:

> Name: "Leading exploration". Description: "Finding the underlying structure in undefined problem spaces — shaping the frame that turns ambiguity into something that can be confidently delivered against…". Skills: Exploratory leadership, Systems thinking, Judgment under uncertainty, Constraint-based decision making, Research-to-practice translation.

**`CREDENTIAL_DETAILS`** (3 degrees): PhD (Doctoral, about: Cosmology, Large-scale structure, Statistical modelling), MSc (Master), MPhys (Master).

**`PUBLICATIONS`** (4 entries): MPhys thesis (Theremin), arXiv preprint (CMB alignments), MNRAS paper (galaxy bias), PhD thesis (luminosity functions). A fabricated "Exploratory Technical Leadership Practice" creative work was removed during this plan's preparation.

### D. Page-level metadata (`app/` files)

| File                        | What                                                                                             | Derivation                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `app/layout.tsx`            | Root metadata export (title, description, OG, icons, theme colours). `<html lang>` from content. | Mostly derived from `frontpage.content.json`. Icons, generator, theme colours hardcoded. URLs from `SITE_URL`.    |
| `app/cv/page.tsx`           | CV page metadata (title, description, OG). JSON-LD `<script>` tag.                               | Derived from `cvOpenGraph` in `lib/cv-content.ts`.                                                                |
| `app/cv/[variant]/page.tsx` | Variant page metadata + `generateMetadata`.                                                      | Title format: `"${name} — CV (${tilt.context})"`. Canonical URL and OG URL derived from `SITE_URL`.               |
| `app/manifest.ts`           | Web App Manifest.                                                                                | Name, description derived from `cv.content.json`. Icons, colours hardcoded.                                       |
| `app/sitemap.ts`            | Sitemap XML.                                                                                     | URLs derived from `SITE_URL`. Frequencies and priorities hardcoded.                                               |
| `app/page.tsx`              | Front page.                                                                                      | No page-specific metadata export — inherits root layout metadata. Content rendered from `frontpage.content.json`. |

### E. Hardcoded editorial text in components

UI labels, section headings, and other text that is not derived from content JSON.

| Component                           | Hardcoded text                                                                                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/cv-layout.tsx`          | Section headings: "Positioning", "Capabilities", "Experience", "Before Oak", "Education". PDF footer: "Download … this CV as a PDF", print URL derived from `SITE_URL`. |
| `components/site-header.tsx`        | Nav labels: "Home", "CV". Aria label derived from `frontpage.hero.name`. "Main navigation", "Page controls". Link text: "DATA".                                         |
| `components/site-footer.tsx`        | Link labels: "LinkedIn", "GitHub", "Google Scholar", "Shiv". Aria label: "External links".                                                                              |
| `components/download-pdf-link.tsx`  | Link text: "PDF".                                                                                                                                                       |
| `components/markdown-page-link.tsx` | Link text: "MD".                                                                                                                                                        |
| `components/skip-link.tsx`          | "Skip to main content".                                                                                                                                                 |
| `components/theme-toggle.tsx`       | "Light", "Dark", "Auto". Aria label: "Theme selection".                                                                                                                 |

### F. Error pages

| File                                   | Hardcoded text                                                                                                                                        |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/not-found.tsx`                    | "Page not found", "The page you're looking for doesn't exist or has been moved.", "Go back home"                                                      |
| `app/cv/pdf/unavailable/not-found.tsx` | "PDF not found", "The CV PDF has not been generated for this deployment. It is created automatically during production builds.", "View the CV online" |

### G. SEO files and response headers

| File/route                   | Content                                                                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/robots.ts`              | Dynamic robots metadata (was `public/robots.txt`). Empty rules (Cloudflare handles crawl policy). Sitemap URL derived from `SITE_URL`.                                 |
| `app/cv/pdf/route.ts`        | `Content-Disposition: inline; filename="${PDF_FILENAME}"` (derived from `cv.meta.name` via `lib/pdf-config.ts`). `Cache-Control: public, max-age=31536000, immutable`. |
| `app/api/graph/route.ts`     | `Cache-Control: no-store` (with TODO comment about re-enabling caching once the graph stabilises).                                                                     |
| `app/api/accept-md/route.ts` | `Content-Type: text/markdown; charset=utf-8`. Cache headers from accept-md config.                                                                                     |

---

## Review items

Items 1–4 are **Phase 2 (pending)** — editorial decisions needed. Items 5–10 are **Phase 1 (complete)** — kept below for reference and audit trail.

### 1. `meta.summary` — "open ecosystems" language

**Type: Editorial — requires Jim's input. Priority: High.**

This is the original trigger for this plan.

Current: "Shaping high-impact problems for people and planet — AI-powered knowledge systems, national-scale public services, and open ecosystems."

"Open ecosystems" was deliberately removed from capabilities. This value currently drives OG descriptions, JSON-LD Person description, manifest description, and page meta descriptions for all CV pages.

**The single-string approach is an interim simplification** ([ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md)). These contexts are fundamentally different domains — social sharing, structured data, app metadata, search results — serving different audiences for different purposes. They are not variants of one description; they are different artifacts that happen to describe the same person. The knowledge graph plan will naturally decouple them: the Person entity gets its own description, pages get their own OG descriptions, the manifest gets its own description. For now, fix the content of the single string. The editorial fix establishes the right positioning; the structural decoupling happens later.

**Decision: Done.** Replaced "open ecosystems" with "public digital infrastructure" — the phrase used in the rewritten capabilities. New value: "Shaping high-impact problems for people and planet — AI-powered knowledge systems, national-scale public services, and public digital infrastructure."

### 2. Front page OG description

**Type: Editorial. Priority: High.**

The root page description was derived from `frontpage.hero.summary` — all 9 paragraphs stripped of markdown and joined into one long string (2000+ characters). Social media truncates at ~200 characters.

**Decision: Done.** Added a dedicated `description` field to `frontpage.content.json`'s `meta` section, authored for social sharing: "Understanding systems — from cosmology and large-scale structure to AI for public benefit. The more I learn, the bigger the questions get." (134 characters). `app/layout.tsx` now reads `frontpage.meta.description` instead of joining all hero paragraphs. The `stripInlineMarkdown` import was removed from `layout.tsx` (still used elsewhere).

### 3. `KNOWS_ABOUT` alignment with new capabilities

**Type: Editorial. Priority: Medium.**

**Decision: Done.** Rewritten from 20 to 34 items, clustered by theme. Changes include:

- **Dropped:** "Exploratory leadership" (broadened to "Technical leadership"), "Genetic diversity" (reframed as "Resilience through diversity"), "AI-enabled ecosystems" (removed language), "Hybrid semantic search" (simplified to "Semantic search")
- **Added:** Systems thinking, Product strategy, Organisational design, Zero-to-one product creation, Proof of concept creation, Rapid prototyping, Public services, Education technology, Public digital infrastructure, Responsible AI, National-scale systems, Model Context Protocol (MCP), Agentic software engineering, Software engineering, The open web, Model fitting, Nature-based solutions, Climate tech
- **Renamed:** "Technical strategy" → "Technical leadership", "Systems thinking" → "Systems understanding" (both kept), "Google Cloud Platform" → "Google Cloud Platform (GCP)"
- **Merged:** Vercel + Netlify → "PaaS hosting e.g. Vercel, Netlify", Ecology-informed agriculture + Perennial food systems → combined
- **Reframed:** "Genetic diversity" → "Resilience through diversity"

A headhunter gap analysis identified the sector terms (education technology, public services), scale signal (national-scale systems), and responsibility terms (responsible AI, product strategy) as critical additions for discoverability.

### 4. `OCCUPATION` description and skills

**Type: Editorial. Priority: Medium.**

**Decision: Done.** Name changed from "Leading exploration" to "Exploration and origination" — capturing both the discovery and creation dimensions without pigeonholing into purely technical roles. Skills updated from 5 to 7:

- Problem shaping (was "Exploratory leadership" — now describes the activity, not a role label)
- Systems understanding (was "Systems thinking" — understanding, not just methodology)
- Judgment under uncertainty (unchanged)
- Constraint-based decision making (unchanged)
- Research-to-practice translation (unchanged)
- Origination (new — the zero-to-one/conceiver dimension)
- Architectural direction-setting (new — from capability 1)

Description unchanged — already aligns closely with positioning paragraph 1.

### 5. Hardcoded site URL

**Type: Technical. Priority: Medium.**

**Decision: Done.** The site URL (`https://jimcresswell.net`) was hardcoded in 8 locations. Created `lib/site-config.ts` with a pure `getSiteUrl` function (unit-tested, accepts env values as parameters) that derives the URL from Vercel system environment variables:

- **Production**: `https://www.jimcresswell.net` (from `VERCEL_PROJECT_PRODUCTION_URL`). `www.` is canonical; Cloudflare redirects the apex domain before requests reach Vercel.
- **Preview**: deployment-specific URL (from `VERCEL_URL`), so OG cards work for preview links.
- **Local**: `http://localhost:${PORT}`.

All code locations now import `SITE_URL` from this module. `public/robots.txt` was converted to `app/robots.ts` (dynamic metadata, consistent with `sitemap.ts` and `manifest.ts`; rules are empty because Cloudflare handles crawl policy). The E2E sitemap test was fixed to test behaviour (sitemap contains expected pages) not implementation (hardcoded domain string). `package.json` (npm metadata) and `content/cv.content.json` (editorial content) remain as-is.

### 6. Component hardcoded text

**Type: No action expected. Priority: None.**

Section headings and UI labels in components are appropriate to hardcode (they are presentation, not content). Listed for completeness. If any label feels editorially stale after the recent changes, flag it during the session.

### 7. `<html lang="en">` vs locale `"en-GB"`

**Type: Technical — can be done independently. Priority: Low.**

The root layout hardcodes `<html lang="en">` but both content files specify `locale: "en-GB"`. The HTML `lang` attribute should match the content locale for accessibility and search engines. One-line fix. Goal 1.

**Decision: Done.** Root layout now derives `lang` from `frontpageContent.meta.locale` ("en-GB"). E2E test added to verify (`seo.e2e-api.test.ts`).

### 8. Editorial guidance stale headline reference

**Type: Documentation — can be done independently. Priority: Low.**

The editorial guidance (formerly `identity.md`) referenced "The problem is the interesting part" — this headline has been replaced with "Understanding systems, shaping change" / "The questions keep getting bigger". The editorial principles section was updated. Goal 2.

**Decision: Done.** Updated to reference the current headlines: "Understanding systems, shaping change" / "The questions keep getting bigger".

### 9. Hardcoded person name in components and config

**Type: Technical — can be done independently. Priority: Low.**

"Jim Cresswell" is hardcoded in:

- `components/site-header.tsx` — aria label `"Jim Cresswell — Home"`
- `lib/pdf-config.ts` — `PDF_FILENAME = "Jim-Cresswell-CV.pdf"`

Both should derive from `cv.meta.name` or `frontpage.hero.name`. Goal 1.

**Decision: Done.** `site-header.tsx` derives the aria label from `frontpage.hero.name`. `pdf-config.ts` derives `PDF_FILENAME` from `cv.meta.name`.

### 10. `"Jim Cresswell"` duplicated across content files

**Type: Technical — can be done independently. Priority: Low.**

The name appears in both `cv.content.json` (`meta.name`) and `frontpage.content.json` (`meta.title`, `hero.name`). The content model already notes this overlap. Unifying to a single source would serve goal 1, but may be better addressed by the [knowledge graph plan](../personal-knowledge-graph.plan.md) which proposes a first-class Person entity.

**Decision: Deferred to PKG.** Creating an intermediate unification (e.g. shared `person.json`) would be immediately replaced by the knowledge graph plan's Person entity. The duplication is low-risk — the person's name won't change independently between files.

---

## Verification

After implementing changes, verify that all outputs are consistent:

1. **Quality gates:** `pnpm check` (format, lint, type-check, test, knip, gitleaks).
2. **E2E tests:** `pnpm test:e2e` — includes `e2e/behaviour/seo.e2e-api.test.ts` (checks meta tags, OG output) and `e2e/behaviour/graph-api.e2e-api.test.ts` (checks JSON-LD graph structure).
3. **Manual checks** (with dev server running via `pnpm dev`):
   - JSON-LD graph: `http://localhost:3000/api/graph`
   - Web App Manifest: `http://localhost:3000/manifest.webmanifest`
   - Sitemap: `http://localhost:3000/sitemap.xml`
   - OG tags: view page source for `<meta property="og:…">` tags on `/`, `/cv`, and `/cv/public_sector`
   - Front page meta description: check `<meta name="description">` on `/` — should not be a wall of text

---

## Files affected

### Phase 1 (complete)

| File                                      | Change                                                               |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `lib/site-config.ts`                      | **New.** Environment-aware `SITE_URL` with unit-tested `getSiteUrl`. |
| `lib/cv-content.ts`                       | OG URLs derived from `SITE_URL`.                                     |
| `lib/jsonld.ts`                           | `SITE_URL` imported from `site-config.ts`.                           |
| `lib/pdf-config.ts`                       | `PDF_FILENAME` derived from `cv.meta.name`.                          |
| `app/layout.tsx`                          | `lang` derived from content locale. OG URLs from `SITE_URL`.         |
| `app/cv/[variant]/page.tsx`               | OG URL and canonical URL derived from `SITE_URL`.                    |
| `app/sitemap.ts`                          | URLs derived from `SITE_URL`.                                        |
| `components/cv-layout.tsx`                | Print footer URL derived from `SITE_URL`.                            |
| `components/site-header.tsx`              | Aria label derived from `frontpage.hero.name`.                       |
| `.agent/directives/editorial-guidance.md` | Stale headline reference updated.                                    |
| `app/robots.ts`                           | **New.** Dynamic robots metadata (replaced `public/robots.txt`).     |
| `lib/site-config.unit.test.ts`            | **New.** Unit tests for `getSiteUrl`.                                |
| `e2e/behaviour/seo.e2e-api.test.ts`       | New `lang` test. Sitemap test fixed to test behaviour.               |

### Phase 2 (complete — editorial session with Jim, 2026-02-18)

| File                             | Change                                                                        |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `content/cv.content.json`        | `meta.summary`: "open ecosystems" → "public digital infrastructure" (item 1)  |
| `content/frontpage.content.json` | Added `meta.description` for social sharing OG description (item 2)           |
| `app/layout.tsx`                 | Uses `frontpage.meta.description` instead of joining hero paragraphs (item 2) |
| `lib/jsonld.ts`                  | `KNOWS_ABOUT` rewritten (20→34 items), `OCCUPATION` updated (items 3–4)       |

---

## Scope boundary with the knowledge graph plan

The [personal-knowledge-graph.plan.md](../personal-knowledge-graph.plan.md) also covers JSON-LD constants (`KNOWS_ABOUT`, `OCCUPATION`, `PUBLICATIONS`, `CREDENTIAL_DETAILS`) and the structural question of how descriptions serve different domains. The boundary:

- **This plan** reviews whether the _editorial content_ of those constants is still consistent with the current capabilities, voice, and positioning. Changes are content decisions (add/remove/reword items). It also fixes the content of `meta.summary` as an interim step.
- **The knowledge graph plan** addresses the _structural_ question of whether these constants should be promoted to the content model, made visible alongside other editorial content, and integrated into a first-class entity model. It also naturally decouples the domain-appropriate descriptions ([ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md)) — different domains acquire their own descriptions as part of the entity model design.

**This plan completes first** (see Sequencing section above). If this audit changes the content of `KNOWS_ABOUT` or `OCCUPATION`, the knowledge graph plan migrates the corrected content — its scope is unaffected.

---

## Related

- [cv-editorial-improvements.plan.md](../cv-editorial-improvements.plan.md) — parent plan
- [capabilities-editorial.plan.md](capabilities-editorial.plan.md) — completed capabilities rewrite (triggered this audit)
- [personal-knowledge-graph.plan.md](../personal-knowledge-graph.plan.md) — broader entity model work (structural, not editorial — see scope boundary above)
- [ADR-007](../../docs/architecture/decision-records/007-dry-content-metadata.md) — current single-string approach (evolved by ADR-011)
- [ADR-010](../../docs/architecture/decision-records/010-canonical-url-graph-identity.md) — canonical URL (`https://www.jimcresswell.net/`) and graph identity
- [ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md) — domain-appropriate descriptions (target state)
- [editorial-guidance.md](../../.agent/directives/editorial-guidance.md) — editorial voice, constraints, and cross-domain consistency principle

# CV Editorial Improvements

Refine the positioning, capabilities, and structured data in the editorial CV.

## Status: In Progress — positioning, capabilities, metadata, and experience/Before Oak settled; knowledge graph Phases 1-3 code complete (automated gates pass), Phase 4 in progress; LinkedIn subsumed by PKG Phase 5

## Prerequisite: PII security mitigation

The PII security mitigation has been completed. `identity.md` was split into a public `editorial-guidance.md` and a private `.agent/private/identity.md`. Privacy and secops directives were created. Git history was rewritten.

## Current state

Positioning paragraphs, capabilities, `meta.summary`, structured data (`KNOWS_ABOUT`, `OCCUPATION`), and front page OG description are all editorially settled and mutually consistent. The editorial hierarchy is codified in `editorial-guidance.md`.

**Remaining work in dedicated plans:**

| Item                                      | Plan                                                                                               | Status         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------- |
| Experience & Before Oak editorial review  | [experience-editorial.plan.md](complete/experience-editorial.plan.md)                              | Complete       |
| Personal knowledge graph — design         | [personal-knowledge-graph.plan.md](personal-knowledge-graph.plan.md)                               | Implementation |
| Personal knowledge graph — implementation | [personal-knowledge-graph-implementation.plan.md](personal-knowledge-graph-implementation.plan.md) | In progress    |
| PKG execution plan                        | [personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md)           | In progress    |
| LinkedIn update                           | [linkedin-update.plan.md](linkedin-update.plan.md) — subsumed by PKG Phase 5                       | Subsumed       |
| Tilt mechanism                            | No plan yet — see [Deferred](#deferred) below                                                      | Deferred       |
| Tilt content                              | Depends on tilt mechanism                                                                          | Deferred       |

## How to use this plan

This is a collaborative editorial session. The workflow is:

1. Read `.agent/directives/AGENT.md` and `.agent/directives/rules.md` to understand project conventions.
2. Read `.agent/directives/editorial-guidance.md` to internalise Jim's editorial voice, identity, editorial hierarchy, and audience.
3. Read `content/cv.content.json` to understand the full current content.
4. Read `archive/prior_cv_content.json.bak` for Jim's full career history and prior editorial framing.
5. Walk through each open observation with Jim, presenting options and getting decisions. **Do not propose final wording without Jim's input — present options and iterate.**
6. Implement agreed changes in the JSON content file(s) — not in components.
7. Run quality gates (`pnpm check`) and verify the site visually.

See `docs/architecture/README.md` for project architecture, including how content propagates to metadata.

## Context

The site is technically complete — infrastructure, PDF generation, E2E tests, and deployment all work. The front page has been reworked as a personal narrative (see [completed plan](complete/front-page-content.plan.md)). The positioning paragraphs have been editorially settled (two paragraphs — see Decided section below). Content architecture has been consolidated so all metadata derives from content JSON files (see [ADR-007](../../docs/architecture/decision-records/007-dry-content-metadata.md)).

Additional reference material (gitignored — may not be present in all environments):

- **`.agent/temp/linkedin.pdf`** — export of Jim's current LinkedIn profile. Use alongside the archive and old CV for fact-checking.
- **`.agent/temp/old-cv-website/`** — full copy of Jim's previous CV website with role descriptions and education details.
- **Old CV website** — also available at `https://jimcresswell.github.io/cv/`.

---

## Decided (implemented — kept for context)

**Headline:** Two headlines — "Understanding systems, shaping change" (default and print) and "The questions keep getting bigger" (alternate). Toggle on click with a CSS fade transition. The `HeadlineToggle` component (`components/headline-toggle.tsx`) uses `onTransitionEnd` for timing and always renders the primary headline in `@media print`. Content lives in `meta.headline` and `meta.headline_alt` in `cv.content.json`.

**Positioning paragraphs (two total):**

Paragraph 1: "I'm drawn to problems that don't have shape yet — in digital‑first public services, AI‑mediated access to trusted knowledge, community‑driven systems change, and the structure of the early Universe. My work is to find the underlying structure: the frame that turns ambiguity into something that can be confidently delivered against. Shaping the problem is my creative act."

Paragraph 2: "My background spans digital product creation, software engineering, research, and building national‑scale public services — the common thread is origination: zero‑to‑one work, before problems have operational form. I set direction early, decide what should and should not be built, and hold that so others can build with confidence. Part of the work is recognising when the existing system is the wrong starting point and shaping what replaces it. The impact I care about is long‑term and structural: changing constraints in large‑scale systems so that the natural paths lead to different, better outcomes, lasting far beyond my direct involvement."

**Key decisions:** Two paragraphs, not three — tighter, and the systemic impact claim works as the culmination of paragraph 2 rather than a separate paragraph. AI is not in the default headline (tilt-specific). Founder is tilt-specific. Keywords are carried by JSON-LD and OG metadata, freeing narrative for humans. Headlines must be part of the tilt data structure. "The early Universe" appears in paragraph 1 as a research domain (reads as breadth, not academic identity); "research" replaces "physics" in paragraph 2's background list — see updated `editorial-guidance.md` for the refined "physics as silent ballast" rationale.

---

## Resolved: Section rename — Foundations → Before Oak

The "Foundations" section is now "Before Oak" — playful, signals narrative intent, and improves the flow between Experience (Oak) and the prior career entries. The JSON key is `prior_roles` (renamed from `foundations` for clarity); the display heading is set in `components/cv-layout.tsx` and the print CSS targets `section[aria-labelledby="before-oak-heading"]`.

Oak National Academy remains the only entry in Experience. FT Labs, HMPO, British Airways, and HP Labs appear in Before Oak, which works narratively. LinkedIn separately addresses chronological completeness — see the [LinkedIn update plan](linkedin-update.plan.md).

---

## Resolved: Factual error in content

Cross-referencing `cv.content.json` against the career archive, old CV website (`jimcresswell.github.io/cv`), and current LinkedIn profile (`.agent/temp/linkedin.pdf`):

**Oak `start_year` was 2019 — fixed to 2020.** The earliest Oak role (Senior Developer, Consulting) started August 2020, per the archive, old CV, and Jim's confirmation. Fixed in `content/cv.content.json` and `plans/complete/front-page-content.plan.md`.

All other facts verified as accurate, including: "bespoke version control" at British Airways (confirmed: the environment used SVN, CVS, and custom systems — "bespoke" is a fair characterisation), all education entries, all Foundations claims, all publications, and all links.

---

## Resolved: Capabilities rewritten with concrete anchors

**Breakout plan:** [capabilities-editorial.plan.md](complete/capabilities-editorial.plan.md) — full analysis, decision log, and final text.

**Decision:** Four strategic-only capabilities replaced with five blended capabilities. Each combines a strategic thread with a concrete, verifiable anchor. Capabilities section moved from after Foundations to after Positioning (most prominent position). Links to public repo, Oak's open API, published research, and the `.agent` directory are inline in capability text. See the breakout plan for the full editorial rationale and decision history.

---

## Resolved: Meta & SEO content audit

Completed in a dedicated plan: [meta-seo-content-audit.plan.md](complete/meta-seo-content-audit.plan.md). That plan fixed `meta.summary`, expanded `KNOWS_ABOUT` (20 → 34 items) and refined `OCCUPATION` in `lib/jsonld.ts`, added a dedicated `meta.description` to `frontpage.content.json` for OG, and updated `app/layout.tsx` to use it. A follow-up editorial pass surfaced "origination" in positioning P2 and refined three capabilities to better bridge narrative content and structured data terms. The editorial hierarchy principle was codified in `editorial-guidance.md`.

---

## Resolved: Experience and Before Oak editorial review

**Breakout plan:** [experience-editorial.plan.md](complete/experience-editorial.plan.md) — all 21 items complete. Research rewritten (model fitting, Galaxy Zoo, CMB observational test, colour-age disproof), Applied Exploration connected to the open web with collaborative credit, voice/framing fixes (passive → agentic, justificatory → confident), and capabilities consistency (Cap 2 OGL framing, Cap 4 vision not standards). Quality gates pass.

---

## In progress: Personal knowledge graph

**Design reference:** [personal-knowledge-graph.plan.md](personal-knowledge-graph.plan.md) — entity inventory, principles, Schema.org conventions. All design decisions resolved.

**Implementation:** [personal-knowledge-graph-implementation.plan.md](personal-knowledge-graph-implementation.plan.md) — Phases 1-3 code complete (automated gates pass), Phase 4 in progress.

**Execution plan:** [personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md) — detailed operational plan with per-task status. **Start here** for next session.

Phases 1-3 code complete: `content/entities.json` with ~50 entities at all abstraction levels, 17 Zod schemas validating at import time, subgraph closure algorithm for page-specific JSON-LD, all views rewired to derive from the entity model. **Automated gates pass on the current tree** — `pnpm check:ci` and `pnpm test:e2e` both passed on 2026-03-08. Manual Schema.org Validator and Rich Results Test checks remain outstanding. All changes remain uncommitted on `main`.

---

## Previously resolved (no action required)

- **Grounded Practice section** — keep as-is (distinctive and human).
- **Tilts underused** — deferred to tilt mechanism plan.
- **Front page** — complete (see [completed plan](complete/front-page-content.plan.md)).

---

## Files affected

| File                       | Status                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `content/cv.content.json`  | Positioning, capabilities, meta.summary, experience, and Before Oak all editorially settled.                                                           |
| `lib/jsonld.ts`            | Now derives the graph from the entity model and handles URL rewriting. Editorial updates to knowsAbout and occupation live in `content/entities.json`. |
| `components/cv-layout.tsx` | Done — `<RichText>` for capabilities, section reorder (Capabilities after Positioning). Knowledge graph: possible `id` attribute binding.              |

---

## Next steps

| Item                                         | When                                                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ~~Factual fix (Oak start_year 2019 → 2020)~~ | Done                                                                                                                           |
| ~~Capabilities (concrete additions)~~        | Done — see [capabilities-editorial.plan.md](complete/capabilities-editorial.plan.md)                                           |
| ~~Meta & SEO content audit~~                 | Done — see [meta-seo-content-audit.plan.md](complete/meta-seo-content-audit.plan.md)                                           |
| ~~Experience & Before Oak editorial review~~ | Done — see [experience-editorial.plan.md](complete/experience-editorial.plan.md)                                               |
| Personal knowledge graph                     | See [personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md) — start here for the next session |

---

## Deferred

| Item                         | Reason                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tilt mechanism               | Separate plan. Tilts need headlines + positioning. The current tilt data structure in `cv.content.json` has `context` and `positioning` per tilt but no `headline` field — extending the schema is part of this work. Three audiences: default, public sector, founder/funder. Possibly a fourth NED/board advisor tilt. Primary delivery via generated PDFs. |
| Tilt content                 | Content for public sector, founder/funder, and NED tilts to be written once the default is finalised.                                                                                                                                                                                                                                                         |
| A/B testing or user feedback | No infrastructure for this currently.                                                                                                                                                                                                                                                                                                                         |

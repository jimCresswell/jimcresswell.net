# CV Editorial Improvements

Refine the positioning, capabilities, and structured data in the editorial CV.

## Status: In Progress — editorial CV work settled; remaining work tracked in dedicated plans

## Prerequisite: PII security mitigation

The privacy mitigation is complete. Public-safe editorial governance lives in the directives;
private source material, analysis and drafts live in the ignored nested editorial repository. The
public feature-branch history was rewritten from a verified recovery set, and the replacement PR is
the current review surface.

## Current state

Positioning paragraphs, capabilities, the Person-owned CV/manifest description,
structured data (`knowsAbout`, `Occupation`), and the separately authored front
page description are editorially settled and mutually consistent. Editorial
strategy and voice are codified in `editorial-strategy.md` and
`editorial-guidance.md` respectively.

**Remaining work in dedicated plans:**

| Item                                     | Plan                                                                                                                                                                                   | Status             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| Experience & Before Oak editorial review | [experience-editorial.plan.md](../archive/experience-editorial.plan.md)                                                                                                                | Complete           |
| Graph current-state audit                | [graph-current-state-audit.md](../research/graph-current-state-audit.md)                                                                                                               | Baseline           |
| Graph roadmap                            | [personal-knowledge-graph-roadmap.plan.md](personal-knowledge-graph-roadmap.plan.md)                                                                                                   | In progress        |
| Track A execution                        | [personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md)                                                                                               | Complete           |
| Track B source-of-truth design           | [personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md) — single canonical CV view; tilt + A/B deferred door-open | In progress        |
| Track B B1 layer map                     | [graph-source-of-truth-layer-map.md](../research/graph-source-of-truth-layer-map.md)                                                                                                   | Complete           |
| Graph metaplan                           | [graph-metaplan.plan.md](../archive/graph-metaplan.plan.md)                                                                                                                            | Complete           |
| Visual regression harness                | [visual-regression-harness.plan.md](../archive/visual-regression-harness.plan.md)                                                                                                      | Complete           |
| LinkedIn update                          | [linkedin-update.plan.md](linkedin-update.plan.md) — collaborative editorial, parallel-runnable                                                                                        | In progress        |
| Tilt retirement                          | [tilt-retirement.plan.md](tilt-retirement.plan.md) — canonical-only implementation present; final proof/review/merge pending                                                           | Verifying          |
| Tilt mechanism (future re-introduction)  | No plan — door open via preserved reference doc                                                                                                                                        | Deferred door-open |
| Tilt content (future re-introduction)    | Depends on tilt mechanism                                                                                                                                                              | Deferred door-open |
| A/B testing                              | No plan — no current infrastructure                                                                                                                                                    | Deferred door-open |
| Dev-tooling hygiene                      | [dev-tooling-hygiene.plan.md](dev-tooling-hygiene.plan.md) — security-coherent refresh in PR #36; remaining majors + dependency-cruiser retained                                       | In progress        |
| PKG durable design decisions             | [ADR-014](../../../docs/architecture/decision-records/014-entity-model-design.md) and related ADRs                                                                                     | Accepted           |

## How to use this plan

This is a collaborative editorial session. The workflow is:

1. Read `.agent/directives/AGENT.md` and `.agent/directives/principles.md` to understand project conventions.
2. Read `.agent/directives/editorial-strategy.md` for audience, attention, structure, evidence, and surface fit, then `.agent/directives/editorial-guidance.md` for Jim's identity, voice, and register.
3. Read `content/cv.content.json` to understand the full current content.
4. Read `archive/prior_cv_content.json.bak` for Jim's full career history and prior editorial framing.
5. Walk through each open observation with Jim, presenting options and getting decisions. **Do not propose final wording without Jim's input — present options and iterate.**
6. Implement agreed changes in the JSON content file(s) — not in components.
7. Run quality gates (`pnpm check`) and verify the site visually.

See `docs/architecture/README.md` for project architecture, including how content propagates to metadata.

## Context

The site is technically complete — infrastructure, PDF generation, E2E tests,
and deployment all work. The front page has been reworked as a personal
narrative. The positioning paragraphs are settled. Editorial prose remains in
page JSON while ADR-020 assigns shared identity atoms to the Person entity.

Additional private reference material is routed through
`.agent/reference-local/editorial-private/README.md`. Do not name or quote individual private files
from this public plan.

Public reference:

- **Old CV website** — also available at `https://jimcresswell.github.io/cv/`.

---

## Decided (implemented — kept for context)

**Headline:** The canonical CV uses “Understanding systems, shaping change”.
The former alternate “The questions keep getting bigger” and its toggle are
retired by ADR-021 and preserved in the CV tilt reference.

**Positioning paragraphs (two total):**

Paragraph 1: "I'm drawn to problems that don't have shape yet — in digital‑first public services, AI‑mediated access to trusted knowledge, community‑driven systems change, and the structure of the early Universe. My work is to find the underlying structure: the frame that turns ambiguity into something that can be confidently delivered against. Shaping the problem is my creative act."

Paragraph 2: "My background spans digital product creation, software engineering, research, and building national‑scale public services — the common thread is origination: zero‑to‑one work, before problems have operational form. I set direction early, decide what should and should not be built, and hold that so others can build with confidence. Part of the work is recognising when the existing system is the wrong starting point and shaping what replaces it. The impact I care about is long‑term and structural: changing constraints in large‑scale systems so that the natural paths lead to different, better outcomes, lasting far beyond my direct involvement."

**Key decisions:** Two paragraphs, not three — tighter, and the systemic impact
claim works as the culmination of paragraph 2 rather than a separate paragraph.
AI is not in the canonical headline. Founder remains implicit. Keywords are
carried by JSON-LD and metadata, freeing narrative for humans. “The early
Universe” appears in paragraph 1 as breadth; “research” replaces “physics” in
paragraph 2's background list.

---

## Resolved: Section rename — Foundations → Before Oak

The "Foundations" section is now "Before Oak" — playful, signals narrative intent, and improves the flow between Experience (Oak) and the prior career entries. The JSON key is `prior_roles` (renamed from `foundations` for clarity); the display heading is set in `components/cv-layout.tsx` and the print CSS targets `section[aria-labelledby="before-oak-heading"]`.

Oak National Academy remains the only entry in Experience. FT Labs, HMPO, British Airways, and HP Labs appear in Before Oak, which works narratively. LinkedIn separately addresses chronological completeness — see the [LinkedIn update plan](linkedin-update.plan.md).

---

## Resolved: Factual error in content

Cross-referencing `cv.content.json` against the career archive, old CV website
(`jimcresswell.github.io/cv`), and the private LinkedIn profile export:

**Oak `start_year` was 2019 — fixed to 2020.** The earliest Oak role (Senior Developer, Consulting) started August 2020, per the archive, old CV, and Jim's confirmation. Fixed in `content/cv.content.json` and `plans/archive/front-page-content.plan.md`.

All other facts verified as accurate, including: "bespoke version control" at British Airways (confirmed: the environment used SVN, CVS, and custom systems — "bespoke" is a fair characterisation), all education entries, all Foundations claims, all publications, and all links.

---

## Resolved: Capabilities rewritten with concrete anchors

**Breakout plan:** [capabilities-editorial.plan.md](../archive/capabilities-editorial.plan.md) — full analysis, decision log, and final text.

**Decision:** Four strategic-only capabilities replaced with five blended capabilities. Each combines a strategic thread with a concrete, verifiable anchor. Capabilities section moved from after Foundations to after Positioning (most prominent position). Links to public repo, Oak's open API, published research, and the `.agent` directory are inline in capability text. See the breakout plan for the full editorial rationale and decision history.

---

## Resolved: Meta & SEO content audit

Completed in a dedicated plan: [meta-seo-content-audit.plan.md](../archive/meta-seo-content-audit.plan.md).
That historical slice fixed the then-current `meta.summary`, expanded
`knowsAbout` (20 → 34 items), refined the `Occupation`, and added a dedicated
front page description. ADR-020 subsequently removed `meta.summary` and made
`Person.description` the bounded owner for CV metadata and the manifest while
preserving the distinct front page description. A follow-up editorial pass
surfaced “origination” in positioning P2 and refined three capabilities to
better bridge narrative content and structured data terms. The editorial
hierarchy is governed by `editorial-strategy.md`, with identity and voice
governed by `editorial-guidance.md`.

---

## Resolved: Experience and Before Oak editorial review

**Breakout plan:** [experience-editorial.plan.md](../archive/experience-editorial.plan.md) — all 21 items complete. Research rewritten (model fitting, Galaxy Zoo, CMB observational test, colour-age disproof), Applied Exploration connected to the open web with collaborative credit, voice/framing fixes (passive → agentic, justificatory → confident), and capabilities consistency (Cap 2 OGL framing, Cap 4 vision not standards). Quality gates pass.

---

## In progress: Personal knowledge graph

**Current-state audit:** [graph-current-state-audit.md](../research/graph-current-state-audit.md) — observed implementation truth, lessons learned, and the current architecture record.

**Strategic roadmap:** [personal-knowledge-graph-roadmap.plan.md](personal-knowledge-graph-roadmap.plan.md) — adopted parent roadmap. Both tracks are required; Track A comes first.

**Track A execution:** [personal-knowledge-graph-execution.plan.md](personal-knowledge-graph-execution.plan.md) — adopted first execution track for graph expression work.

**Track B design:** [personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md) — adopted required follow-on design track for the graph-backed source-of-truth architecture.

**Track B B1 completion:** [graph-source-of-truth-layer-map.md](../research/graph-source-of-truth-layer-map.md) — completed ownership and topology note. Track B now continues from B2 composition work.

**Graph metaplan:** [graph-metaplan.plan.md](../archive/graph-metaplan.plan.md) — completed reset record for how the graph stack was reframed and adopted.

**Harness plan:** [visual-regression-harness.plan.md](../archive/visual-regression-harness.plan.md) — completed proof record for the historical PKG regression work.

**Durable design decisions:** [ADR-014](../../../docs/architecture/decision-records/014-entity-model-design.md) and the related ADRs in `docs/architecture/decision-records/`.

**Historical references:** [personal-knowledge-graph-phase-model.plan.md](../archive/personal-knowledge-graph-phase-model.plan.md) and [personal-knowledge-graph-design-notes.md](../research/personal-knowledge-graph-design-notes.md) remain useful as archive records, but they are no longer the live planning model.

Use the audit plus the adopted roadmap and track plans for current graph
framing. This parent plan keeps only the editorial context and plan map.

---

## Previously resolved (no action required)

- **Grounded Practice section** — keep as-is (distinctive and human).
- **Tilts underused** — the live tilt mechanism is retired by ADR-021; any
  future re-entry starts from the preserved reference and a new requirement.
- **Front page** — complete (see [completed plan](../archive/front-page-content.plan.md)).

---

## Files affected

| File                       | Status                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `content/cv.content.json`  | Positioning, capabilities, experience, and Before Oak all editorially settled; shared identity atoms come from the Person entity.                      |
| `lib/jsonld.ts`            | Now derives the graph from the entity model and handles URL rewriting. Editorial updates to knowsAbout and occupation live in `content/entities.json`. |
| `components/cv-layout.tsx` | Done — `<RichText>` for capabilities, section reorder (Capabilities after Positioning). Knowledge graph: possible `id` attribute binding.              |

---

## Next steps

| Item                                         | When                                                                                                                                                                                                                                                                                                                                                                                                              |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~Factual fix (Oak start_year 2019 → 2020)~~ | Done                                                                                                                                                                                                                                                                                                                                                                                                              |
| ~~Capabilities (concrete additions)~~        | Done — see [capabilities-editorial.plan.md](../archive/capabilities-editorial.plan.md)                                                                                                                                                                                                                                                                                                                            |
| ~~Meta & SEO content audit~~                 | Done — see [meta-seo-content-audit.plan.md](../archive/meta-seo-content-audit.plan.md)                                                                                                                                                                                                                                                                                                                            |
| ~~Experience & Before Oak editorial review~~ | Done — see [experience-editorial.plan.md](../archive/experience-editorial.plan.md)                                                                                                                                                                                                                                                                                                                                |
| Graph work                                   | Continue from [personal-knowledge-graph-roadmap.plan.md](personal-knowledge-graph-roadmap.plan.md), [graph-source-of-truth-layer-map.md](../research/graph-source-of-truth-layer-map.md), and [personal-knowledge-graph-source-of-truth-design.plan.md](../active/personal-knowledge-graph-source-of-truth-design.plan.md). Track A is complete for the current publication surface; Track B Phase B2 is current. |

---

## Deferred

| Item                         | Reason                                                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Tilt mechanism               | No current plan or live schema. Re-entry requires a product requirement, plan, and ADR starting from the preserved CV tilt reference; delivery form and audience set must be decided then. |
| Tilt content                 | Former public-sector, private-AI, and founder material is preserved as reference, not live content. New editorial work begins only after a tilt mechanism is deliberately reopened.        |
| A/B testing or user feedback | No infrastructure for this currently.                                                                                                                                                      |

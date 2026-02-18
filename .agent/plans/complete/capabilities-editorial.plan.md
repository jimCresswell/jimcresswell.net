# Capabilities Editorial

Rework the CV capabilities section to include concrete, verifiable claims alongside the existing strategic framing. Breakout plan from [cv-editorial-improvements.plan.md](../cv-editorial-improvements.plan.md).

## Status: Complete

All editorial decisions settled and implemented. Five blended capabilities live in `cv.content.json`, section reorder done, quality gates pass, site verified visually.

Phase 4 (meta.summary review) is deferred — see [meta-seo-content-audit.plan.md](meta-seo-content-audit.plan.md) for the broader audit that subsumes it.

---

## The problem

The original four capabilities were all strategic framing — "how Jim thinks" — with no concrete anchors in "what he can do." The positioning paragraphs already establish the strategic identity. The capabilities section has a different job: show that the strategic claims are backed by real, demonstrable ability.

---

## Constraints from editorial-guidance.md

These were applied throughout the editorial session:

- **No buzzword lists.** Each capability reads as a confident claim, not a keyword.
- **Voice:** Confident, a touch joyful and mischievous, with underlying seriousness.
- **"My" not "the"** — personal claims, not universal statements.
- **Delivery is honoured, not opposed** — concrete capabilities are natural extensions of the strategic framing.
- **Physics as silent ballast** — capabilities claim what the physics training produced (modelling, rigour), not "physicist."
- **Keyword strategy** — keywords are carried by JSON-LD. Capabilities are for humans.
- **Agency through outcomes, not persistence** — tenure is shown through what it produced (growth, scope), not through duration language.
- **No "ecosystem" language** — Jim removed this from the positioning; capabilities use clearer terms (public infrastructure, accessible to others).

---

## Technical scope

### Links in capabilities — DONE

Capabilities rendering was updated to use `<RichText>` before the editorial session (separate commit: `19262f7`). The `capabilities` type remains `string[]` — strings now contain inline markdown, same as `experience[].summary` and `prior_roles[].description`. The E2E content integrity test was updated to use `stripInlineMarkdown` for capability assertions.

### Oak MCP ecosystem repo

The [oak-mcp-ecosystem](https://github.com/oaknational/oak-mcp-ecosystem) repo is currently private. When it goes public (expected: public alpha), it becomes a second piece of directly inspectable evidence for the AI-first interfaces claim and significantly strengthens capability #2. Flag for a future update — do not block current work.

### Section position — DECIDED

Capabilities move to after Positioning, before Experience. See Phase 1 decision below.

---

## Phase 1: Structure and position — DECIDED

### Structure: Five blended capabilities

**Decision:** Option B (blended), evolved through iteration to **five** capabilities. Each combines a strategic thread with a concrete, verifiable anchor. The original four strategic-only capabilities are fully replaced.

The session started at ~6 blended, explored 7 threads (zero-to-one leadership, AI-first interfaces, hands-on execution, open data, research reasoning, strategy/coaching, system-level impact), then consolidated:

- **AI-first interfaces + open data** merged — both are about making trusted data accessible as public infrastructure.
- **Hands-on execution** integrated into the AI-first capability — the MCP work IS hands-on execution, and this site is a second piece of evidence.
- **Strategy/coaching and system-level impact** kept separate — Jim confirmed these are distinct capabilities.

### Position: After Positioning, before Experience

**Decision:** Position A. Capabilities become the first concrete section after the strategic framing. The claims are confident enough to stand before the narrative evidence.

New page flow: Header → Positioning → **Capabilities** → Experience → Foundations → Education.

---

## Phase 2: Concrete claims — DECIDED

### Selected claims (anchoring a capability)

- Hands-on with modern web stacks (this site as evidence) — integrated into #2
- Structured data and API design (JSON-LD, Schema.org, MCP) — merged into #2
- AI-first interfaces (SDK/MCP for Oak curriculum data) — capability #2
- National-scale public service architecture (Oak rebuild decision) — capability #1
- Open data as public infrastructure (Oak's open API) — merged into #2
- Computational modelling (PhD research) — capability #3

### Dropped claims

- Build-time PDF generation pipeline — too granular for a capability
- Quality engineering as a discipline — not selected
- Published research — Jim wants this clear but it is already visible in Foundations and JSON-LD; does not need to be a capability
- Systems change from outside (Obaith, community organising) — not selected

### Added by Jim (missing from original inventory)

- **Strategy, coaching, executive leadership** — shaping and communicating direction, enabling others. Concrete anchor: the growth trajectory of Oak's Engineering function (four contractors → five product squads and three platform groups).
- **System-level impact through public services** — Jim's work at Oak contributes to education quality and teacher wellbeing. Avoid "systems change" language (inflammatory). Concrete anchor: Oak's position and mission.

### Nuance on computational modelling

Jim: "Computational modelling is true, but I am not an expert. I have enough experience in that and adjacent fields to become an expert, but would only do that if it was the highest leverage action to take." The capability is framed as transferable capacity, not claimed expertise: "I carry this rigour; I deploy it where it creates the most leverage."

---

## Phase 3: Final capabilities text — DECIDED

Agreed through iterative drafting (two full options presented, multiple rounds of refinement).

### Capability 1: Zero-to-one technical leadership

> Zero-to-one technical leadership — I set architectural direction at [national scale](https://www.oaknational.org.uk/) and hold the early decisions that shape long-term innovation and reach.

### Capability 2: AI-first interfaces and hands-on execution

> Designing and building AI-first interfaces — I conceived and delivered Oak's SDK and MCP server end-to-end, making [openly licensed curriculum data](https://open-api.thenational.academy/) accessible as public digital infrastructure in AI-mediated environments. I built [this site](https://github.com/jimCresswell/jimcresswell.net) myself, with [exploratory AI tooling processes](https://github.com/jimCresswell/jimcresswell.net/tree/main/.agent).

### Capability 3: Research-trained reasoning

> Research-trained reasoning — computational modelling and [published research](https://scholar.google.co.uk/citations?hl=en&user=7yf2vEEAAAAJ) in astrophysics. I carry this rigour; I deploy it where it creates the most leverage.

### Capability 4: Strategy and leadership at scale

> Strategy and technical leadership at scale — I helped shape [Oak's](https://www.oaknational.org.uk/) Engineering function from four contractors into five product squads and three platform groups. I hold space for team direction within the long-term vision and standards, coaching others and making the ambiguous navigable.

### Capability 5: System-level impact

> System-level impact through public services — my technical and strategic work at [Oak](https://www.oaknational.org.uk/) contributes to infrastructure that supports education quality and teacher wellbeing, in the UK and beyond.

### Key editorial decisions during drafting

- **"Shape long-term innovation and reach"** (not "everything after") — specific and avoids double-use of "impact" with #5.
- **"Engineering function"** (capitalised) — makes clear this is an organisational unit, not the act of engineering.
- **"Exploratory AI tooling processes"** with link to `.agent` directory — stronger than "I work hands-on"; shows process innovation, not just tool use.
- **"Hold space for team direction within the long-term vision and standards"** — Jim doesn't dictate direction; he creates conditions for teams to find their own direction within guardrails.
- **"Public services" appears once** (in #5, not #1) — broadens #1 beyond public sector while keeping the strongest anchor in #5. "National scale" in #1 is sector-neutral.

---

## Phase 4: Review meta.summary — DEFERRED

Deferred to the broader [meta & SEO content audit](meta-seo-content-audit.plan.md), which covers `meta.summary` alongside all other titles, descriptions, OG tags, JSON-LD fields, and hardcoded metadata across the site.

---

## Phase 5: Implement and verify — DONE

All items complete:

1. ~~Update `components/cv-layout.tsx` — render capabilities with `<RichText>`.~~ (commit `19262f7`)
2. ~~Update `e2e/behaviour/content-integrity.e2e-ui.test.ts` — use `stripInlineMarkdown` for capability assertions.~~ (commit `19262f7`)
3. ~~Add integration test for markdown links in capabilities.~~ (commit `19262f7`)
4. ~~Update `content/cv.content.json` — replace four old capabilities with five new ones.~~ (commit `42252aa`)
5. ~~Reorder sections in `components/cv-layout.tsx` — Capabilities after Positioning, before Experience.~~ (commit `42252aa`)
6. ~~Run `pnpm check` and `pnpm test:e2e`.~~ All gates pass.
7. ~~Verify the site visually.~~ Verified.
8. ~~Update the parent plan's status.~~ Done.

---

## Files affected

| File                                             | Changes                                          | Status |
| ------------------------------------------------ | ------------------------------------------------ | ------ |
| `components/cv-layout.tsx`                       | `<RichText>` for capabilities, section reorder   | Done   |
| `components/cv-layout.integration.test.tsx`      | Test for markdown links in capabilities          | Done   |
| `e2e/behaviour/content-integrity.e2e-ui.test.ts` | `stripInlineMarkdown` for capability assertions  | Done   |
| `content/cv.content.json`                        | Five new capabilities with inline markdown links | Done   |

---

## Related

- [cv-editorial-improvements.plan.md](../cv-editorial-improvements.plan.md) — parent plan
- [meta-seo-content-audit.plan.md](meta-seo-content-audit.plan.md) — meta.summary review (deferred from Phase 4)
- [personal-knowledge-graph.plan.md](../personal-knowledge-graph.plan.md) — personal knowledge graph (KNOWS_ABOUT, JSON-LD, OG, all views)
- [editorial-guidance.md](../../../.agent/directives/editorial-guidance.md) — editorial voice and constraints
- [linkedin-update.plan.md](../linkedin-update.plan.md) — LinkedIn content should be consistent with capabilities once settled

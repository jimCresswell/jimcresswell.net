# CV Editorial Improvements

Refine the headline, positioning, and capabilities in the editorial CV based on a critical reading of the current content.

## Status: Planning

## How to use this plan

This is a collaborative editorial session. The observations below identify issues in the CV content; the decisions require Jim's input. The workflow is:

1. Read `.agent/directives/AGENT.md` and `.agent/directives/rules.md` to understand project conventions.
2. Read `content/cv.content.json` to understand the full current content.
3. Read `archive/prior_cv_content.json.bak` for Jim's full career history and prior editorial framing — essential context for making informed suggestions.
4. Walk through each open observation with Jim, presenting options and getting decisions. **Do not propose final wording without Jim's input — present options and iterate.**
5. Implement agreed changes in the JSON content file(s) — not in components.
6. Run quality gates (`pnpm lint && pnpm type-check && pnpm test`) and verify the site visually.

See `docs/architecture/README.md` for project architecture.

## Context

The site is technically complete — infrastructure, PDF generation, E2E tests, and deployment all work. The front page has been reworked as a personal narrative (see [completed plan](complete/front-page-content.plan.md)). The editorial CV content has been through several rounds of editing but has not had a structured review against how it reads to its audience.

This plan captures the editorial observations and proposed changes that apply to the CV itself. A separate plan covers the [LinkedIn career narrative](timeline-page.plan.md) — a preparation document for updating LinkedIn with Jim's full chronological history.

### Content architecture

All user-visible text lives in JSON files under `content/`. Components render content verbatim — they do not invent, summarise, or reorder it. The primary file for this plan is:

- **`content/cv.content.json`** — headline, positioning paragraphs, experience, foundations, capabilities, education, links, and tilt variants.
- **`archive/prior_cv_content.json.bak`** — previous version of the CV content with fuller career history. Useful for understanding the narrative arc and what was deliberately edited down.

Changes to CV content mean editing the JSON. If the headline changes, `content/cv.og.json` and `content/jsonld.json` may also need updating for consistency.

### Career context not in any file

Jim's career includes several short contracts not captured in either content file: a six-week academic consultancy in the Middle East, a month-long consultancy at a startup called We Predict, and a few months at a startup called Medicspot. These don't need to be added to the CV, but they provide additional flavour — Jim has breadth beyond the named employers, including startup and international experience.

## Audience

The primary readers are:

1. **Hiring managers and senior leaders** — scanning to decide whether to have a conversation.
2. **Recruiters** — scanning to decide whether to forward to a hiring manager.
3. **Peers and collaborators** — following a shared link to understand Jim's work.
4. **AI systems** — consuming JSON-LD and page content for search and retrieval.

---

## Observation 1: Headline ambiguity

**Current:** "Exploratory AI Application leader · Zero‑to‑One Systems · Digital‑First Public Services"

"AI Application leader" creates ambiguity. It reads as "someone who leads AI application development" (i.e. building AI apps), but the content describes something broader — someone who applies exploratory and AI-informed thinking to large-scale problems. The word "Application" is doing the wrong job.

**Options:**

- Drop "Application": "Exploratory AI leader" — simpler but possibly too vague.
- Reframe: "Exploratory AI & Systems Leader" — clearer about the systems focus.
- Keep as-is if "AI Application" is an intentional keyword play for discoverability.

**Decision:** TBD.

---

## Observation 2: Abstraction density in positioning

The positioning section opens with three paragraphs of conceptual framing before any concrete evidence. The writing is precise and the ideas are coherent, but it asks a lot of a reader who is scanning.

The first paragraph's most distinctive claim — "I determine when exploration has done its job" — is buried mid-sentence. That is the sharpest articulation of the value proposition and could lead.

**Proposed direction:**

- Consider leading with the most concrete, distinctive claim.
- Reduce from three paragraphs to two if possible without losing meaning.
- Or: keep three paragraphs but front-load the first sentence of each with something concrete rather than abstract.

**Decision:** TBD.

---

## Observation 3: Single employer in Experience

Oak National Academy is the only entry in the Experience section. FT Labs, HMPO, British Airways, and HP Labs appear in Foundations, which works narratively (grouping by theme rather than chronology) but may confuse a reader expecting a career history.

Someone skimming might conclude only one employer. Whether this matters depends on the audience — if the CV is primarily sent directly to people who will read it carefully, it is fine. If it needs to survive fast scanning or ATS screening, it may not.

**Proposed direction:**

- No change to the structure (it is a deliberate editorial choice).
- But consider whether the Foundations section headings signal clearly enough that these are professional roles, not hobbies. "Applied Exploration in Complex Technical Contexts" is accurate but does not immediately say "FT Labs, HMPO, BA, HP Labs" — the employers are only revealed inside the prose.
- Note: LinkedIn directly addresses this — see the [LinkedIn career narrative plan](timeline-page.plan.md) for preparing that content.

**Decision:** TBD.

---

## Observations 4 & 5: Capabilities need concrete additions

The current four capabilities are all about how Jim thinks, not what he can do in concrete terms:

1. "Zero-to-one leadership: forming systems and fixing early direction in unstructured problem spaces"
2. "Designing conditions for high‑leverage, responsible AI use"
3. "Judgement and decision-making involving irreversible or high‑cost trade-offs..."
4. "Enabling ecosystems rather than centralising solutions"

Meanwhile, the site itself demonstrates strong hands-on technical ability (Next.js 16, TypeScript, Puppeteer, Playwright, Tailwind, Vercel), but the CV mentions none of it. A hiring manager may want at least one or two capabilities that map to a job description — something concrete and testable.

This is a single decision: **what concrete bullets to add to the capabilities list.** The existing four are strong and should stay. Candidates for additions:

- "Hands-on with modern web stacks (TypeScript, React, Next.js) — I built this site" (accepted in principle — closes the technical gap without undermining the strategic positioning, and serves as a conversation starter)
- "Technical architecture for public-facing services at national scale"
- "Structured data and API design for open ecosystems"
- "Hands-on with modern PaaS web stacks and data-fluent — not a practicing data scientist, but comfortable across the stack"

**Decision:** Accepted in principle that concrete capabilities should be added. Exact wording and number of additions TBD.

---

## Resolved observations (no action required)

These are kept for context. No further work is needed.

- **Observation 6: "Grounded Practice"** — The theremin, allotments, and runner bean breeding section is distinctive and human. It rounds out the narrative and connects to the systems thinking theme. **Decision: Keep as-is.**
- **Observation 7: Tilts are underused** — Three positioning variants exist (`public_sector`, `private_ai`, `founder`) but only `public_sector` is exposed on the web. **Decision: Deferred.** Revisit when there is clarity on how tilts should be presented to different audiences.
- **Front page** — Reworked as a personal narrative with inline links. See [completed plan](complete/front-page-content.plan.md). **Decision: Complete.**

---

## Files affected

| File                      | Changes                                            | Status |
| ------------------------- | -------------------------------------------------- | ------ |
| `content/cv.content.json` | Headline, positioning, capabilities                | Open   |
| `content/cv.og.json`      | Update if headline changes                         | Open   |
| `content/jsonld.json`     | Update if headline or capabilities change          | Open   |
| Components                | May need layout changes if capabilities list grows | Open   |

## Deferred

| Item                         | Reason                                         |
| ---------------------------- | ---------------------------------------------- |
| Tilt strategy                | Needs further thought on audience and exposure |
| A/B testing or user feedback | No infrastructure for this currently           |

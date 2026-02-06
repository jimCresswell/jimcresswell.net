# Content Review and Refinement

Review and improve the content across all four content JSON files and the front page, based on a critical reading of the current state.

## Status: Planning

## Context

The site is technically complete — infrastructure, PDF generation, E2E tests, and deployment all work. The content has been through several rounds of editing but has not had a structured review against how it reads to its audience. This plan captures observations and proposed changes.

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

**Decision:** TBD.

---

## Observation 4: No concrete technical skills

The content is entirely about thinking and judgement. The site itself demonstrates strong hands-on technical ability (Next.js 16, TypeScript, Puppeteer, Playwright, Tailwind, Vercel), but the CV mentions none of it.

This is a positioning choice — "I am not applying as a developer" — but it means anyone wondering whether Jim can also build things will not find the answer in the CV content.

**Proposed change (accepted in principle):**

Add a Capabilities bullet along the lines of:

> "Hands-on with modern web stacks (TypeScript, React, Next.js) — I built this site"

This closes the gap without undermining the strategic positioning. It also serves as a conversation starter and proof of craft.

**Decision:** Accepted. Exact wording TBD.

---

## Observation 5: Capabilities are all meta-level

The current four capabilities are all about how Jim thinks, not what he can do in concrete terms:

1. "Zero-to-one leadership: forming systems and fixing early direction in unstructured problem spaces"
2. "Designing conditions for high‑leverage, responsible AI use"
3. "Judgement and decision-making involving irreversible or high‑cost trade-offs..."
4. "Enabling ecosystems rather than centralising solutions"

A hiring manager may want at least one or two that map to a job description — something concrete and testable.

**Proposed direction:**

- Keep the existing four (they are strong and distinctive).
- Add one or two concrete capabilities, e.g.:
  - "Technical architecture for public-facing services at national scale"
  - "Structured data and API design for open ecosystems"
  - The "I built this site" bullet (see Observation 4)

**Decision:** TBD — exact additions to be refined.

---

## Observation 6: "Grounded Practice" — personality vs. signal

The theremin, allotments, and runner bean breeding section is distinctive and human. It shows breadth, groundedness, and intellectual curiosity. Some readers will love it; others may find it tangential.

It works because it rounds out the narrative — Jim does not just think about systems in the abstract, he works with real ones. The "ecology-informed food growing" thread connects to the systems thinking theme.

**Proposed direction:**

- Keep as-is. It is a deliberate editorial choice that shows personality.
- No action needed unless feedback from real readers suggests otherwise.

**Decision:** Keep.

---

## Observation 7: Tilts are underused

Three well-differentiated positioning variants exist (`public_sector`, `private_ai`, `founder`) but only `public_sector` is exposed on the web. The `private_ai` and `founder` variants read well and are available for PDF generation.

**Current status:** Noted but not actionable yet. The tilt strategy needs further thought — the variants exist and work technically, but the question of how and whether to expose them on the web is open.

**Decision:** Deferred. Revisit when there is clarity on how tilts should be presented to different audiences.

---

## Observation 8: Front page needs work

Broken out into a separate plan: [front-page-content.plan.md](front-page-content.plan.md).

**Decision:** Active — see linked plan.

---

## Files affected

| File                             | Changes                                            |
| -------------------------------- | -------------------------------------------------- |
| `content/cv.content.json`        | Headline, positioning, capabilities                |
| `content/frontpage.content.json` | Highlights, summary, navigation framing            |
| `content/cv.og.json`             | Update if headline changes                         |
| `content/jsonld.json`            | Update if headline or capabilities change          |
| Components                       | May need layout changes if capabilities list grows |

## Deferred

| Item                         | Reason                                         |
| ---------------------------- | ---------------------------------------------- |
| Tilt strategy                | Needs further thought on audience and exposure |
| A/B testing or user feedback | No infrastructure for this currently           |

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

**Decision:** Complete. The front page has been reworked as a continuous personal narrative with inline links. See the linked plan for full details.

---

## Files affected

| File                             | Changes                                            | Status   |
| -------------------------------- | -------------------------------------------------- | -------- |
| `content/frontpage.content.json` | Reworked as personal narrative with inline links   | Complete |
| `content/cv.content.json`        | Headline, positioning, capabilities                | Open     |
| `content/cv.og.json`             | Update if headline changes                         | Open     |
| `content/jsonld.json`            | Update if headline or capabilities change          | Open     |
| Components                       | May need layout changes if capabilities list grows | Open     |

## Observation 9: Timeline page at `/cv/timeline`

The current CV is an editorial, thematic document — it deliberately groups experience by narrative arc rather than chronology, and only Oak National Academy appears as a standalone entry. This is an intentional positioning choice and works well for its purpose.

However, there is a significant body of career history that the editorial CV elides or compresses. The archive (`archive/prior_cv_content.json.bak`) contains a full chronological record:

| Period              | Role                                    | Organisation                            |
| ------------------- | --------------------------------------- | --------------------------------------- |
| Jun 2022 – present  | Principal Engineer                      | Oak National Academy                    |
| Jan 2021 – Jun 2022 | Head of DevOps and Quality (Consulting) | Oak National Academy                    |
| Aug 2020 – Dec 2020 | Senior Developer (Consulting)           | Oak National Academy                    |
| Feb 2018 – present  | Managing Director                       | Code Science Limited                    |
| Jan 2018 – Dec 2020 | Founder                                 | Obaith (tech for good / systems change) |
| Feb 2017 – Dec 2017 | Programme QA Consultant                 | Home Office (HMPO)                      |
| Mar 2015 – Dec 2015 | QA Automation Consultant                | British Airways                         |
| Aug 2011 – Jul 2014 | Senior Developer                        | FT Labs (Financial Times)               |
| Apr 2009 – Nov 2010 | Systems Engineer                        | HP Labs (for N-able)                    |
| Sep 2005 – Dec 2010 | PhD Researcher                          | University of Portsmouth                |

Plus education at Portsmouth, Sussex, and Bath — with thesis titles and links.

The original content is at <https://jimcresswell.github.io/cv>.

This history is currently invisible on the site. A dedicated timeline page would serve two purposes:

### 1. Standalone value

A chronological page complements the editorial CV by giving readers who want a career history a place to find one. The editorial CV answers "what is Jim about?"; the timeline answers "what has Jim done, and when?". Different readers want different things — hiring managers scanning for employer names and dates, recruiters checking tenure, peers satisfying curiosity.

The page should **not** be a visual timeline widget (the design brief's "no timelines" constraint refers to decorative UI elements on the main CV). It should be a clean, text-first page in the same editorial aesthetic as the rest of the site — chronological entries with dates, role, organisation, and a brief description. Think of it as a detailed career record, not a graphic.

### 2. LinkedIn preparation

Jim's LinkedIn profile will need updating to align with the narrative voice and positioning of the new CV. The timeline page is a natural staging ground for this: it forces a review of every role and period, produces written descriptions in the right voice, and creates a canonical reference that LinkedIn entries can be derived from. Once the timeline page is right, updating LinkedIn becomes a matter of adapting format rather than generating content from scratch.

### Content approach

The timeline content should be authored fresh, not copied verbatim from the archive. The archive is a source of facts (dates, titles, organisations, thesis links) but its prose is in a different voice — it reads as a traditional CV with bullet points. The timeline page should:

- Use the same narrative voice as the rest of the site (first person where appropriate, editorial, precise).
- Keep descriptions concise — one to three sentences per role, not bullet lists.
- Include links where they add value (FT Labs, Oak, HMPO Passport Service, thesis, Google Scholar).
- Cover the Obaith / systems-change period honestly — this is a distinctive part of the story and connects to the current positioning.
- Include Code Science Limited as the consulting vehicle, but keep it brief — the substance is in the client roles.
- Include education with thesis titles (the theremin thesis is a good conversation piece and already referenced in Grounded Practice).

### Content file

A new `content/timeline.content.json` following the same pattern as the other content files. Rough structure:

```json
{
  "meta": { "name": "Jim Cresswell", "page": "timeline", "locale": "en-GB" },
  "entries": [
    {
      "type": "role",
      "organisation": "Oak National Academy",
      "role": "Principal Engineer",
      "start_year": 2022,
      "end_year": "present",
      "summary": "..."
    },
    ...
    {
      "type": "education",
      "institution": "University of Portsmouth",
      "degree": "PhD",
      "field": "Astrophysics & Cosmology",
      "start_year": 2005,
      "end_year": 2010,
      "thesis": { "title": "...", "link": "..." },
      "summary": "..."
    }
  ]
}
```

Entries are ordered reverse-chronologically. The `type` field distinguishes roles from education so the page can render them in a single interleaved timeline (the PhD overlaps with the HP Labs role, for example).

### Page and routing

- Route: `app/cv/timeline/page.tsx`
- Sits under the existing `/cv` layout.
- Server component, same pattern as the main CV page.
- Navigation: linked from the main CV page (and possibly the front page) but clearly secondary — the editorial CV is the primary document.
- Metadata and Open Graph tags following the same pattern as the main CV.
- Add to `sitemap.ts`.

### Relationship to existing observations

- **Observation 3** (single employer in Experience) — the timeline page directly addresses this. Readers who want to see the full employer list will find it there.
- **Observation 4** (no concrete technical skills) — timeline role descriptions can naturally mention technologies without a separate skills section.
- **Observation 7** (tilts underused) — the timeline page does not need tilts; it is factual record, not positioning.

### Open questions

- Should the timeline be linked from the main CV page navigation, or only discoverable via the URL and sitemap? Linking it makes it accessible but risks diluting the editorial CV's focus.
- Should the education entries be interleaved chronologically with roles, or separated into their own section at the bottom? Interleaving is more honest (the PhD and HP Labs overlapped) but may feel unusual.
- Should the Obaith entry be presented as a role or as a distinct "research period"? It was a genuine venture but also overlaps with Code Science and early Oak.
- What do we do with the running for the local elections info? See archive/prior_cv_content.json.bak

### Decision

Accepted in principle. Content authoring is the primary work; the technical implementation is straightforward. Begin with the content file, then build the page.

---

## Deferred

| Item                         | Reason                                         |
| ---------------------------- | ---------------------------------------------- |
| Tilt strategy                | Needs further thought on audience and exposure |
| A/B testing or user feedback | No infrastructure for this currently           |

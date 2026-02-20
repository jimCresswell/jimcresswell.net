# Experience & Before Oak Editorial Review

Review the Experience section (Oak National Academy) and the Before Oak section (prior_roles) in a single editorial session. Breakout plan from [cv-editorial-improvements.plan.md](cv-editorial-improvements.plan.md).

## Status: In Progress — Oak section complete (items 1–7), Before Oak + voice + capabilities remaining (items 8–21)

### Resume point

**Next session starts at item 8** (Research P1–P3). Items 1–7 (Oak P1, P2, P3) are done and committed. Items 8–14 are the original Before Oak changes. Items 15–18 are voice/framing issues found by the editor sub-agent. Items 19–21 are capabilities consistency items triggered by the Oak changes. Use the editor sub-agent (`/jc-editor`) to review proposed changes before finalising.

## Prerequisite: PII security mitigation — Complete

The PII security mitigation has been completed. `identity.md` was split into `editorial-guidance.md` (public) and `.agent/private/identity.md` (private). Privacy and secops directives were created. Git history was rewritten. Step 2 below reads `editorial-guidance.md` for editorial constraints; `.agent/private/identity.md` provides psychological context and career breadth for agents with local access.

## How to use this plan

This is a collaborative editorial session. Both sections must be reviewed together — they read as one narrative arc (Oak is where Jim is now, Before Oak is how he got there), and framing decisions in one directly constrain the other.

1. Read `.agent/directives/AGENT.md` and `.agent/directives/rules.md` — standard project entry point.
2. Read `.agent/directives/editorial-guidance.md` — voice, audience, editorial hierarchy. The editorial hierarchy establishes that the editorial guidance governs voice, positioning paragraphs and capabilities are the editorial baseline, and everything else derives from these. Pay particular attention to "Physics as silent ballast" — Jim is proudly academic, but the framing should avoid triggering the presumption some readers hold that academic backgrounds imply impracticality. This is not about banning words; it is about ensuring the narrative leads with effectiveness and impact while letting the academic credentials speak for themselves.
3. Read `content/cv.content.json` — the full current content. Focus on `experience`, `prior_roles`, `positioning`, and `capabilities`.
4. Read `content/frontpage.content.json` — the front page hero narrative. The front page and CV tell related but distinct stories with significant overlap (cosmology, published research, Oak, ecology, systems thinking, the open web). Where concepts appear in both, framing must be consistent. The front page includes elements the CV deliberately omits (urban rewilding, local government, personal research projects) and vice versa — this is intentional, but both should feel like the same person.
5. Read `lib/jsonld.ts` — current `KNOWS_ABOUT` and `OCCUPATION`, which the experience entries should be consistent with.
6. Read `archive/prior_cv_content.json.bak` — full career history with dates and role titles, for fact-checking.
7. Read the EDRs linked at the bottom of this plan — they record specific editorial decisions already made. Do not re-litigate them.
8. Walk through each section with Jim, presenting options and iterating. **Do not propose final wording without Jim's input.** Use the editor sub-agent (`/jc-editor`) to review proposed changes for voice and consistency.
9. Implement agreed changes in `content/cv.content.json` — not in components.
10. Run full quality gates: `pnpm check` and `pnpm test:e2e`. Verify the site visually.

---

## Context

The positioning paragraphs, capabilities, `meta.summary`, structured data (`KNOWS_ABOUT`, `OCCUPATION`), and front page OG description have all been editorially settled and are mutually consistent (see completed [meta-seo-content-audit.plan.md](complete/meta-seo-content-audit.plan.md) and [capabilities-editorial.plan.md](complete/capabilities-editorial.plan.md)). The front page hero narrative (`frontpage.content.json`) has also been carefully edited and sits at tier 3 of the editorial hierarchy. The editorial hierarchy is codified in `editorial-guidance.md`.

The Experience and Before Oak sections have not received the same editorial attention. They were written earlier and may not fully reflect the voice, framing, and terminology that the positioning and capabilities now use.

---

## Review criteria

- **Voice and framing** — do they match the editorial voice in `editorial-guidance.md`? Are they framed for who Jim is now, not who he was perceived to be? The "Physics as silent ballast" principle is especially relevant to the Research section: Jim is proudly academic, but the framing should avoid triggering the presumption that academic = impractical. Lead with what the thinking produces, not with disciplinary labels. There are no banned words — just presumptions to avoid.
- **Consistency with positioning** — do they support and ground the claims in the positioning paragraphs and capabilities? All five capabilities bridge the experience sections: cap 1 (zero-to-one technical leadership at national scale) and cap 5 (system-level impact through public services) ground in Oak directly; cap 2 (SDK/MCP, public digital infrastructure) grounds in Oak paragraph 3; cap 3 (research-trained reasoning) grounds in the research background; cap 4 (strategy and organisational growth) grounds in Oak's engineering function growth. Check that the experience entries actually substantiate all five claims.
- **Consistency with structured data** — do terms and framing align with the `KNOWS_ABOUT` and `OCCUPATION` in `lib/jsonld.ts`?
- **Consistency with front page** — the front page hero in `frontpage.content.json` tells a parallel narrative that overlaps with several Before Oak themes (cosmology, published research, ecology, systems thinking, the open web) and with the Oak experience (AI for public benefit). Where concepts appear in both the CV and the front page, any reframing in one should be checked against the other.
- **Narrative arc** — does the Before Oak → Oak progression tell a coherent story? Does the "origination" thread (now explicit in positioning P2) run through both?
- **Concision** — all sections should be reviewed for length and level of detail. Oak has three substantial paragraphs; Research has four; Applied Exploration has four; Grounded Practice has three. Are any over-explained or under-explained for the CV context?
- **Commercial sensibility** — does the narrative show product instinct and commercial awareness? The positioning is strong on system-creation and structural impact but thinner on the sense that Jim understands what is worth building as a product, not just as a system. Oak paragraph 3 (SDK, MCP, infrastructure play, optionality) carries this; check whether the signal is strong enough across all sections. See "Commercial sensibility" in `editorial-guidance.md`.
- **The implicit reading test** — does the full narrative (positioning + experience + Before Oak) leave a reader thinking: "This person could found something serious if they chose to"? This is a cumulative effect, not a single line. If the impression is missing, the fix is in the evidence sections. See "The implicit reading test" in `editorial-guidance.md`.
- **Stability evidence** — does the breadth of Jim's career read as range and curiosity, or as restlessness? The experience sections must provide enough staying-power evidence — sustained impact, long-term consequences of decisions, systems that endured — to anchor the forward-leaning positioning. Oak (2020–present, four years of sustained development and innovation) is the primary anchor. The Before Oak sections need careful framing so that movement across FT Labs, HMPO, BA, HP Labs reads as deliberate exploration, not flight. See "Breadth as range, not restlessness" in `editorial-guidance.md`.
- **Career breadth** — Jim's career includes significant additional experience not currently in the CV (see [Career breadth context](#career-breadth-context) below). The review should consider whether any of this broader experience should be acknowledged — it may not belong in the narrative, but the question should be asked.

---

## Sections to review

### Experience: Oak National Academy

Three summary paragraphs with a deliberate arc — a future agent editing any one paragraph must understand the structure:

1. **Who Jim is at Oak** — the role, the teams, the stakes. Sets the frame for everything that follows.
2. **What he did** — the rebuild decision. A specific act of judgment under pressure, with long-term consequences.
3. **What he's doing now** — the SDK/MCP work. Enabling infrastructure for system-level change, product safety as the live frontier. This is the most forward-looking paragraph and should carry the energy of current, exciting work.

Front page overlap: "responsibly apply AI for public benefit" and the shared concept "The more I learn, the bigger the questions get" (the CV alternate headline uses the short form: "The questions keep getting bigger").

### Before Oak: Research & Sense-Making in Unknown Systems

Four paragraphs covering academic background, published research, systems thinking instincts, and non-academic systems change work.

Front page overlap: cosmology, published research, understanding systems, data and generalisation. The "Physics as silent ballast" principle from `editorial-guidance.md` is most relevant here — let the credentials speak through what they produced, not through disciplinary labels.

### Before Oak: Applied Exploration in Complex Technical Contexts

Four paragraphs covering FT Labs, HMPO, BA, HP Labs, and the consistent thread of clarifying intent and shaping systems.

Front page overlap: "found myself in tech" and "fell in love with the open web."

### Before Oak: Grounded Practice

Three paragraphs covering the Theremin thesis, market gardening/allotment work, and ecology-informed food growing interests. Previously reviewed and kept as-is (distinctive and human). May still benefit from a consistency pass alongside the other sections.

Front page overlap: market garden, sunflowers, ecology, resilience through diversity. The "Play as creation" and "Impact framing" principles from `editorial-guidance.md` are directly relevant here.

---

## Editorial clarifications (from session)

These clarifications were agreed during the editorial session and apply throughout the review:

- **"Ecosystem" language must go.** It is unclear and has already been removed elsewhere. The intent is about systems, context, and creating and holding the conditions for new states to emerge.
- **"Physics" is not banned.** The goal is to avoid sounding academic in a bad way — leading with disciplinary labels rather than what the thinking produces. The word itself is fine where it describes a concrete thing (e.g. the Theremin thesis).
- **FT Labs and Oak both rely on and present through the open web.** This is a factual connection that should be visible in the experience sections.
- **KNOWS_ABOUT claims should be evidenced in narrative content** — not as explicit keyword placement, but as alluded concepts that point at the same reality. This principle has been added to `editorial-guidance.md` under "Keyword strategy."
- **Show, don't justify.** Describing why Jim did something is calibration. Describe what he did and what it makes possible; let the significance speak. This principle has been added to `editorial-guidance.md` under "Editorial principles."

### Oak curriculum data context

Oak's curriculum data is not just "high-quality" — it is fully sequenced, complete (fully resourced), pedagogically rigorous, and openly licensed under the Open Government Licence. These are not isolated pieces of information; this is a complete digital curriculum. That is why easy access is radically game-changing.

Jim did not "treat the data as" public infrastructure — it IS public infrastructure. The data is standards-compliant with an OpenAPI spec. What Jim conceived and built (the SDK and MCP server) makes this data more accessible and directly pluggable into AI-powered services.

### Product safety, not data safety

The data is open by design — access is not constrained. The responsibility concern at Oak is specifically about AI products consuming the data: how to make those services reliable, safe, and accurate. This is product safety through technical means, not data safety. The KNOWS_ABOUT term "Responsible AI" should be understood in this light.

### The enabling vision

Jim's framing of the SDK/MCP work: he is lowering the cost of innovation for others. He did this on his own initiative (vision, not rebellion). The second and third-order effects — what others will create with reliable access to this data — will far outstrip the effort required to create the tools. Teachers are already using AI products to reduce their workloads; developers and edtech companies are already building in this space. Access to trusted, high-quality, fully sequenced curriculum material at this level changes the system.

This framing connects directly to positioning P2: "changing constraints in large-scale systems so that the natural paths lead to different, better outcomes, lasting far beyond my direct involvement." The SDK/MCP work is an instance of that pattern — the experience entry's job is to show it happening, not to re-explain the philosophy.

This reframing is bigger than one paragraph. All content describing the Oak SDK/MCP work — including capabilities, structured data, and any future tilt variants — should reflect it.

---

## Factual audit

Before reviewing voice and framing, the experience sections were audited against all settled content (positioning, capabilities, front page, KNOWS_ABOUT, OCCUPATION) to map support, contradictions, and gaps. The frame: settled content as claims, experience sections as evidence.

### Well grounded

- Oak P1 and P2 strongly ground cap 1 (zero-to-one leadership), cap 5 (system-level impact), and most of positioning P1/P2.
- Oak P3 grounds cap 2 (AI-first interfaces, SDK/MCP, public digital infrastructure).
- Research P1/P2 ground cap 3 (published research in astrophysics).
- Applied Exploration provides the breadth evidence for positioning P2's "background spans" claim.
- Grounded Practice connects well to KNOWS_ABOUT ecological terms and front page themes.

### Significant gaps

1. **Cap 4 has no experience backing.** The four-contractors-to-five-squads growth trajectory, coaching, and translating for non-technical stakeholders are claimed only in the capability text. No experience entry substantiates any of these.
2. **"Holds so others can build with confidence"** (positioning P2) — no experience entry demonstrates this.
3. **Research-to-practice translation** (OCCUPATION) and "I carry this rigour; I deploy it where it creates most leverage" (cap 3) — Research P3 asserts this connection but no experience entry shows research training being applied outside academia. The bridge is stated, not demonstrated.

### Framing mismatches

4. **Cap 2 agency exceeds its experience backing.** Cap 2 says Jim "conceived, prototyped, and delivered...end-to-end." Oak P3 uses "my work has focused on" and "this has included" — descriptive, not agentic.
5. **"Ecosystem" language in Research P4** contradicts a settled editorial decision to remove it.

### Missing connections

6. **The open web** is in KNOWS_ABOUT and on the front page but absent from all experience entries, despite FT Labs and Oak both presenting through it.
7. Several KNOWS_ABOUT concepts (responsible AI, product strategy, communicating to non-technical stakeholders, computational modelling/model fitting) lack narrative allusion in the experience sections.

### No contradictions found

No experience entry directly contradicts any settled content claim.

---

## Change list

Twenty-one items identified. Items 1–14 from the factual audit, items 15–21 from the editor sub-agent voice review. Working through sequentially with Jim.

### Oak P1

| #   | Change                                                                     | Status                                                                             |
| --- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | Allude to "holds so others can build with confidence" (positioning P2 gap) | **Done** — Option A: "giving teams a clear frame to build against with confidence" |
| 2   | Allude to product strategy (KNOWS_ABOUT)                                   | **Done** — "technical and product direction"                                       |

**Decision:** Option A selected. "technical" → "technical and product"; "enabling durable, ethical, and high-impact solutions to emerge" → "giving teams a clear frame to build against with confidence."

### Oak P2

| #   | Change                                                                                           | Status                                      |
| --- | ------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| 3   | Ground cap 4 (engineering function growth, coaching, translating for non-technical stakeholders) | **Done** — Option B: new sentence in Oak P1 |
| 4   | Allude to communicating with non-technical stakeholders (KNOWS_ABOUT, cap 4)                     | **Done** — included in item 3               |

**Decision:** Option B selected — placed in P1 as a dimension of the overall role, not a consequence of the rebuild. "For over five years, I have helped shape the Engineering function from four contractors into five product squads and three platform groups — designing structure, coaching engineers, and translating technical options for non-technical leadership." Jim clarified that the four-contractor stage was the very start (2020), the rebuild came over a year later, and the growth spans the full 5.5-year tenure. "Over five years" chosen over "For over five years" — the latter sounds like a struggle; the former carries the duration with grace.

### Oak P3

| #   | Change                                            | Status                                                                                                    |
| --- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 5   | Strengthen personal agency to match cap 2's claim | **Done** — "I conceived and built" in full P3 rewrite                                                     |
| 6   | Name the open web (KNOWS_ABOUT, front page)       | **Done** — "on the open web" in P3 rewrite                                                                |
| 7   | Allude to responsible AI → product safety         | **Done** — "product safety: ensuring AI services that consume this data are reliable, accurate, and safe" |

**Decision:** Full P3 rewrite. The original P3's framing was incorrect (data framed as being "treated as" infrastructure rather than being infrastructure), the voice was passive/descriptive, and the closing tell sentence was redundant after P1/P2 edits. Jim's reframing (see "Oak curriculum data context" and "The enabling vision" in editorial clarifications above) required a substantially different paragraph. The old "deliberately indirect" / "preserve optionality" framing has been replaced by the enabling/leverage vision and the product safety challenge.

Key discoveries during drafting: (1) the "show, don't justify" principle — earlier drafts explained why Jim built the tools rather than stating what they create; (2) the difference between justification ("I built these because...") and confident intent ("the lasting impact is in what others will build"); (3) the data description matters — "fully sequenced, pedagogically rigorous, released under the Open Government Licence" carries enough weight for the reader to see the significance without explanation.

**Additional changes arising from P3 rewrite:**

- **Cap 5 refined** — "contributes to infrastructure that supports" → "I create infrastructure that lowers the cost of innovation for others, enabling lasting change in" — agentic, shows the enabling mechanism.
- **KNOWS_ABOUT expanded** — added "Holding space for systems change through second and third-order effects, mediated through the creation of open digital infrastructure" to carry the leverage/enabling concept in structured data.

**Consistency note:** Cap 2 still says "openly licensed curriculum data." P3 now uses "fully sequenced, pedagogically rigorous...released under the Open Government Licence." This is now tracked as item 19 below.

### Research P1–P3

| #   | Change                                                                  | Status                                 |
| --- | ----------------------------------------------------------------------- | -------------------------------------- |
| 8   | Show research-to-practice bridge, not just state it (OCCUPATION, cap 3) | Open — decision needed on what example |
| 9   | Allude to model fitting / computational modelling (KNOWS_ABOUT, cap 3)  | Open                                   |

### Research P4

| #   | Change                                                                                          | Status                                                                                             |
| --- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 10  | Replace "enabling ecosystems rather than building destinations"                                 | Open — direction given: systems, context, creating and holding conditions for new states to emerge |
| 11  | Anchor the non-academic work more concretely (positioning P1 "community-driven systems change") | Open — decision needed on whether to name Obaith or describe type of work                          |

### Applied Exploration

| #   | Change                                                    | Status                                                                              |
| --- | --------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 12  | Connect FT Labs to the open web (KNOWS_ABOUT, front page) | Open — Jim confirmed: FT Labs and Oak both rely on and present through the open web |
| 13  | Strengthen origination thread (positioning P2)            | Open — decision needed on how explicit                                              |

### Grounded Practice

| #   | Change                                            | Status |
| --- | ------------------------------------------------- | ------ |
| 14  | No changes identified; consistency pass if needed | N/A    |

### Voice and framing issues (from editor review)

Items 15–18 were identified by the editor sub-agent during a full CV voice review.

#### Oak P1

| #   | Change                                                              | Status                                           |
| --- | ------------------------------------------------------------------- | ------------------------------------------------ |
| 15  | "My responsibility sits in" — passive framing, Jim is not the actor | Open — should fix, make Jim the explicit subject |

#### Oak P2

| #   | Change                                                                             | Status                                                              |
| --- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 16  | "Rather than pursuing incremental optimisation...to avoid" — justificatory framing | Open — should fix, keep decisiveness but remove defensive reasoning |

#### Research P3

| #   | Change                                                                                                    | Status                                             |
| --- | --------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 17  | "instincts that now underpin my exploratory leadership outside academia" — tell sentence, self-interprets | Open — should fix, ground in action/effect instead |

#### Applied Exploration

| #   | Change                                                                         | Status                                                          |
| --- | ------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| 18  | "massively reducing rework" — imprecise emphatic claim, rest of CV is grounded | Open — consider, improve precision without losing impact signal |

### Capabilities consistency (from editor review)

Items 19–21 affect capabilities, identified during the experience editorial review because the experience changes created new inconsistencies.

| #   | Change                                                                                  | Status                                                     |
| --- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 19  | Cap 2: "openly licensed curriculum data" doesn't match Oak P3's OGL framing (EDR-001)   | Open — must fix, align with accepted data description      |
| 20  | Cap 2: bundles two proof points (Oak SDK/MCP + this website) — scannability concern     | Open — consider, ensure one dominant claim per capability  |
| 21  | Cap 4: "hold space...making the ambiguous navigable" — abstract compared to CV register | Open — should fix, make mechanism and effect more explicit |

---

## Files affected

| File                             | Changes                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------- |
| `content/cv.content.json`        | `experience` and `prior_roles` entries — editorial refinements (primary target)               |
| `lib/jsonld.ts`                  | Secondary — may need updates if the review surfaces terms that should appear in `KNOWS_ABOUT` |
| `content/frontpage.content.json` | Secondary — consistency check if shared concepts are reframed                                 |

---

## Career breadth context

Jim's career includes significant experience beyond the roles currently named in the CV — teaching, making, guiding, retail, wholesale, short consultancies, and a post-doctoral position. There is also a compelling MSc admission story that directly demonstrates the origination instinct. This context is available for the editorial session and may warrant inclusion or acknowledgement in the narrative.

See `.agent/private/identity.md` for the full list of roles, biographical details, and the MSc admission story. That file is gitignored and local-only.

---

## Related

- [cv-editorial-improvements.plan.md](cv-editorial-improvements.plan.md) — parent plan
- [capabilities-editorial.plan.md](complete/capabilities-editorial.plan.md) — capabilities the experience entries should ground
- [meta-seo-content-audit.plan.md](complete/meta-seo-content-audit.plan.md) — structured data the experience entries should be consistent with
- [editorial-guidance.md](../../.agent/directives/editorial-guidance.md) — editorial voice and hierarchy

### Editorial Decision Records

The editorial decisions made during this session are permanently recorded as EDRs:

- [EDR-001: Oak curriculum data description](../../docs/editorial/decision-records/001-oak-curriculum-data-description.md)
- [EDR-002: Show, don't justify](../../docs/editorial/decision-records/002-show-dont-justify.md)
- [EDR-003: Ecosystem language removal](../../docs/editorial/decision-records/003-ecosystem-language-removal.md)
- [EDR-004: Enabling vision — leverage through third-order effects](../../docs/editorial/decision-records/004-enabling-vision-leverage-third-order.md)
- [EDR-005: Oak P3 rewrite — from passive to confident intent](../../docs/editorial/decision-records/005-oak-p3-rewrite.md)

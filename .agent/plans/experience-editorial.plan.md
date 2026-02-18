# Experience & Before Oak Editorial Review

Review the Experience section (Oak National Academy) and the Before Oak section (prior_roles) in a single editorial session. Breakout plan from [cv-editorial-improvements.plan.md](cv-editorial-improvements.plan.md).

## Status: Open

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
7. Walk through each section with Jim, presenting options and iterating. **Do not propose final wording without Jim's input.**
8. Implement agreed changes in `content/cv.content.json` — not in components.
9. Run full quality gates: `pnpm check` and `pnpm test:e2e`. Verify the site visually.

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
- **Career breadth** — Jim's career includes significant additional experience not currently in the CV (see [Career breadth context](#career-breadth-context) below). The review should consider whether any of this broader experience should be acknowledged — it may not belong in the narrative, but the question should be asked.

---

## Sections to review

### Experience: Oak National Academy

Three summary paragraphs covering:

1. The overall role — leading on complex, high-impact problems by setting foundational technical direction in a national public service.
2. A specific decision — arguing for a deeper intervention (the rebuild) and standing behind it.
3. Recent work — treating curriculum data as public digital infrastructure, SDK/MCP, enabling access in AI-mediated environments.

Front page overlap: "responsibly apply AI for public benefit" and the shared headline concept "The more I learn, the bigger the questions get."

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

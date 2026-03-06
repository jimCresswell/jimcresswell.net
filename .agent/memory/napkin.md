# Napkin

## Session: 2026-03-05 — Practice-Core Hydration

### What Was Done

- Hydrated practice-core into the new-cv repo on `feature/practice-core-hydration` branch
- Phase 1: Canonical-first restructuring — moved 7 commands, 5 skills, 1 agent from `.cursor/` to `.agent/` (canonical), created thin Cursor adapters. Renamed `consolidate-docs` to `jc-consolidate-docs`. Merged two start-right variants into one.
- Phase 2: New mechanisms — created metacognition directive, 3 technical reviewers (code-reviewer, test-reviewer, type-reviewer), 6 always-applied rules with Cursor triggers, 4 new commands (review, think, step-back, go)
- Phase 3: Growth governance — added fitness_ceiling frontmatter to all 7 directives and distilled.md, YAML frontmatter to prompts, updated provenance chains on all three trinity files, created experience/ and code-patterns/ directories
- Phase 4: Validation — created practice-index.md bridge file, updated AGENT.md with full Practice reference, verified all links resolve (practice-index: 100%, AGENT.md: 100%), self-containment check passed, all quality gates pass (66 tests)
- Fixed broken references in ADR-012 from old `.cursor/` paths to new canonical paths

### Patterns to Remember

- The naive reference check script from practice-lineage.md does not resolve relative paths from source file location — all "broken" results for `./rules.md` etc. are false positives because the file exists relative to AGENT.md's directory
- Cursor command adapters use `@` prefix for file injection; canonical commands use plain relative paths — strip `@` when canonicalising
- Skill classification: napkin is `passive` (always on, no trigger), most others are `active` (explicitly invoked)
- When renaming a command, grep the whole repo for references to the old name — ADRs and other permanent docs may link to it
- Cursor adapter pointer syntax was inconsistent after hydration: commands/skills used `@`, rules/agents used backticks. User preference: `@` everywhere for consistency.
- The consolidation command specification appears in TWO places in practice-core: practice-lineage.md §Workflow Commands and practice-bootstrap.md §Required Commands table. Both must be updated together.
- "Five files" / "package of five" appears in multiple practice-core locations. Adding CHANGELOG.md means all of these need updating — grep before editing.
- The practice-core has never been through a "restructuring" hydration before (always cold start or return trip). This is genuinely new ground.

## Session: 2026-02-20 — Experience Editorial: Before Oak, Voice, Capabilities (items 8–21)

### What Was Done

- Completed items 8–21 of the experience editorial plan: Research section rewrite (P2–P4), Applied Exploration FT Labs open web connection, voice/framing fixes (Oak P1 passive, Oak P2 justificatory, Applied Exploration precision), and capabilities consistency (cap 2 data description + repo link, cap 4 vision not standards).
- Fixed front page Obaith URL (missing slash in Wayback Machine URL).
- Research P2: replaced MSc-only description with PhD work — model fitting on galaxy surveys, Galaxy Zoo citizen science combination (pioneering).
- Research P3: replaced tell sentence with factual descriptions of both research lines — CMB topology ("the question had been asked, but no one had looked"), galaxy colour-age approximation disproved (forced field to change approach).
- Research P4: replaced "enabling ecosystems" (EDR-003), anchored Obaith as independent research via link.
- Applied Exploration P3: FT Web App now names the open web and its pioneering nature; "helping build" for collaborative credit.
- Cap 2: links to open-source ecosystem repo, OGL data description per EDR-001, dropped website proof point.
- Cap 4: "hold the long-term technical vision" replaces "hold space for team direction within the long-term vision and standards."

### Patterns to Remember

- Jim's CMB topology work was MSc (Sussex), PhD was SDSS/Galaxy Zoo model fitting (Portsmouth) — never conflate.
- Model fitting (computational) and strategic uncertainty (planning/delivery) are unrelated domains — don't conflate.
- "Partied a lot" is privileged information — never in version control. The roguish quality shows in voice, not biography.
- Obaith and Reforest Now were genuine in-depth research projects, not ventures. Obaith was before Oak, Reforest Now during early Oak.
- Jim wrote every line of code in the Oak ecosystem repo (via agent direction). The idea, vision, execution, and frameworks — all his.
- FT Web App story: FT chose open web over Apple's App Store gatekeeping. Industry-changing, award-winning. Don't claim sole credit — "helping build."
- Jim is the vision/creator, not the standards administrator. Cap 4 should reflect this.
- Zero to one is not immaculate conception — it's seeing a future connection nobody else sees and building it.

### Mistakes Made

- Initially described "second and third-order effects" in Research P3 as if it described the cosmological research — it doesn't, it's positioning language.
- Initially conflated model fitting with strategic uncertainty — Jim corrected this.
- Initially said "no one had actually asked" about CMB topology — wrong, Janna Levin asked the theoretical question. Jim LOOKED (observational test). Corrected after Jim's input.
- First draft of FT Labs used "building" without collaborative credit qualification — Jim flagged.

## Session: 2026-02-20 — Continual Learning, Consolidation, Documentation Pipeline

### What Was Done

- Mined 25 transcripts (Jan 28 – Feb 20) via continual-learning skill. Initial extraction produced 13 user preferences and 22 workspace facts in AGENTS.md.
- Verified all AGENTS.md entries against actual codebase, ADRs, EDRs, and directives. Found 2 wrong (reference-style links never existed; headline was superseded), 1 not-yet-implemented (pronouns/honorific), and 11 low-signal entries. Corrected and trimmed.
- Consolidated all documentation: moved orphaned entries from distilled.md and AGENTS.md into permanent homes:
  - rules.md: CSS rem/em, gate restart, branches for risky changes, content in JSON, permanent docs never reference ephemeral
  - AGENT.md: don't push commits, verify claims, plans standalone/discoverable, archive docs historical, listen to user priorities
  - editorial-guidance.md: two register descriptions, front page distinction, product safety, collaborative credit, editorial process note
- Rewrote AGENTS.md as anchors-only (landing pad for continual-learning, not a permanent home).
- Updated distillation skill to clarify the full pipeline: transcripts → AGENTS.md → distilled.md → permanent docs. Each stage filters for signal. Only anchors remain in AGENTS.md.
- Trimmed distilled.md to 5 workspace quick-reference entries + troubleshooting table. Everything else now lives in permanent docs.

### Patterns to Remember

- AGENTS.md is a landing pad, not a destination. Continual-learning deposits entries; distillation moves them to distilled.md; consolidation moves them to permanent docs. Anchors remain to prevent re-extraction.
- The distillation skill (step 1, Extract) already listed AGENTS.md as a source to check — but the instruction to remove processed entries and leave anchors was missing. Now explicit.
- "Work on branches" is a CSS and Accessibility section item in rules.md — slightly odd placement, but it's about protecting main from deploy failures, which relates to the same "don't break production" concern as the postcss gotcha.

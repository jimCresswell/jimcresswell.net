# Napkin

## Session: 2026-03-06 — Practice-Core Evolution

### What Was Done

- Implemented the practice-core-evolution plan: all 3 phases (6 + 3 + 4 = 13 tasks)
- Phase 1: Evolved practice-core trinity files — added restructuring hydration path to practice-lineage.md, expanded ecosystem survey to include practice maturity, extended "never overwrite" to cover practice mechanisms, added cohesion audit to consolidation spec (both locations), reframed underscore-prefix rule as universal principle, created CHANGELOG.md, updated all "five files" → "six files" references across 5 practice-core files
- Phase 2: Fixed adapter pointer syntax — all 6 `.cursor/rules/*.mdc` and all 4 `.cursor/agents/*.md` now use `@` prefix (consistent with command/skill adapters), updated practice-index.md
- Phase 3: Validation passed — all trinity files under ceilings (practice.md 216/250, practice-lineage.md 312/320, practice-bootstrap.md 392/400), self-containment check zero violations, all links resolve, all 6 quality gates pass (66 tests)
- Tightened practice-lineage.md (325→312): compressed Agent Pattern section, Tightening Process, Adaptation Levels
- Tightened practice-bootstrap.md (432→392): compressed Prompts section (removed YAML code block template, kept field descriptions), Distillation protocol, Claude Code trigger template example

### Patterns to Remember

- Both practice-lineage.md and practice-bootstrap.md were already OVER their ceilings before this work started (325/320 and 432/400). Tightening must happen BEFORE or DURING additions, not just as a validation step
- The naive reference-check scripts from practice-lineage.md have word-splitting issues in bash `for link in $links` loops and don't handle markdown anchor fragments (`#section-name`). Results need human judgment — false positives are common
- When adding a companion file (CHANGELOG.md) to the practice-core package, grep for ALL count references ("five files", "package of five", "all five") across ALL practice-core files before editing — they appear in practice-lineage.md, practice-bootstrap.md, practice.md, index.md, and README.md
- practice-bootstrap.md Prompts section: the YAML code block template was removed during tightening. The field names are preserved in text description. If agents have trouble constructing prompt frontmatter in future, may need to restore a compact example
- Consolidation cohesion audit caught two real issues: (1) provenance dates not updated from 2026-03-05 to 2026-03-06 after evolution edits, (2) code-quality.md canonical rule still used old ecosystem-specific wording while practice-lineage.md had the reframed universal principle. Both fixed.
- AGENT.md is 2 lines over its 150-line ceiling (152/150) — flagged but not tightened. Split strategy suggests extracting dev commands or project structure

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

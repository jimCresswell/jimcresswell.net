# Napkin

## Session: 2026-03-07 — Consolidation

### What Was Done

- Ran full consolidation checklist (8 items)
- Fixed three plan files with stale "Phases 1-3 complete" wording — changed to "code complete" to match the reality that quality gates have not yet passed (design reference, roadmap dependency tree, cv-editorial-improvements)
- Added ADR-014 (Entity model design) to practice-index.md — was missing from the Architectural Decisions table
- Added two Schema.org pitfalls to PKG skill common pitfalls table: `isBasedOn` domain (DefinedTerm extends Intangible, not CreativeWork) and `makesOffer` range (expects Offer, not WebAPI). Both already settled in ADR-014 but missing from the operational quick-reference
- Updated stale distilled.md entry: pronouns/honorific now IN entities.json Person entity, not "not yet in JSON-LD"
- Verified all fitness ceilings (7 directives, all under ceiling), practice box (empty), napkin length (255 lines, under 500), practice-index cohesion (all 23 link targets resolve, AGENT.md tables match practice-index)
- Practice evolution: no candidates clearing the three-part bar — the premature-completion lesson is already covered by "Verify claims with evidence" in AGENT.md

### Patterns to Remember

- The "code complete vs complete" distinction keeps recurring. The napkin from the previous session already caught this, but the fix didn't propagate to all plan files. When correcting a status across plan files, grep for ALL instances of the old status wording — three out of four plan files still had the stale "complete" phrasing.
- When a domain-specific skill (like PKG) has a common pitfalls table, check it during consolidation for pitfalls discovered since the skill was created. ADR findings are permanent records but the quick-reference skill is what agents actually consult during work.

## Session: 2026-03-06 — PKG Phase 4 Completion and Validation Strategy

### What Was Done

- Continued Phase 4 editorial pass: fixed "support climate breakdown" ambiguity in Obaith CreativeWork entity, fixed Code Science Ltd description to be concise vehicle description
- Fixed all 5 capability descriptions to consistent gerund register (was mixed past-tense fragments and gerunds)
- Added "fully sequenced, pedagogically rigorous" qualifier to Oak curriculum data in Principal Engineer role description
- Reflected on Phases 1-4 progress, identified remaining work
- Evaluated validation tool options: schema-dts, ajv, schemaorg-jsd
- Updated on-disk execution plan with detailed progress notes, new tasks (schema-dts validation, quality gates), and file inventory

### Patterns to Remember

- schema-dts (Google, 1.5M weekly downloads, zero runtime, types-only) fills the gap between Zod (shape validation) and Schema.org (vocabulary correctness). Catches the exact class of error the pkg-reviewer has been finding manually (isBasedOn on DefinedTerm, makesOffer expecting Offer).
- schemaorg-jsd is pre-1.0 (v0.17.1) and duplicates Zod's runtime role. Not worth adding alongside schema-dts.
- ajv alone doesn't add value over Zod for this use case — Zod is already the runtime JSON validator.
- All Phase 1-4 changes are uncommitted on main (no branch). This is a risk that should be addressed.

### Mistakes Made

- **Marked phases as "completed" without verifying quality gates.** Phases 1-3 were labelled ✅ COMPLETE across four plan files, but `pnpm check` fails at the first gate (Prettier — 13 files unformatted), `pnpm test:e2e` was never run, and the Phase 3 pixel-identical regression check was never formally verified. "Code complete" is not "complete" — quality gates are part of the acceptance criteria. Never mark a phase complete without running the gates.
- Previous session left capability descriptions in mixed register (gerunds + past-tense fragments). The editor reviewer caught this but it should have been noticed during authoring.

## Session: 2026-03-06 — PKG Implementation Phases 1-3

### What Was Done

- Implemented Phases 1-3 of the personal knowledge graph
- Phase 1: Resolved 5 design decisions, created entities.json skeleton (50 entities), Zod schemas (16 entity types), ADR-014
- Phase 2: Migrated KNOWS_ABOUT (35 items, 24 Wikidata-linked), OCCUPATION, CREDENTIAL_DETAILS, PUBLICATIONS from lib/jsonld.ts to entity model. Populated all concrete entities, drafted identity-framed role descriptions, populated abstract/expressive entities from cv.content.json
- Phase 3: Rewired lib/jsonld.ts from 287 lines of inline constants to 46-line import+URL-rewrite layer. Rewired cv-content.ts and manifest.ts to import Person data from entity model. Implemented subgraph closure algorithm with TDD.
- PKG reviewer, type reviewer, and test reviewer all invoked. All findings addressed.
- 128 tests passing (38 unit + 7 integration for entities, 10 for subgraph, 7 for jsonld, plus existing)

### Patterns to Remember

- `isBasedOn` is NOT in the domain of `DefinedTerm` (extends Intangible, not CreativeWork). Capability-to-evidence grounding must be expressed as prose, not typed links.
- `Organization.makesOffer` expects `Offer`, not `WebAPI`. Use the reverse: `WebAPI.provider → Organization`.
- `inSupportOf` is Text in Schema.org. The Zod schema enforces this at parse time and the test rejects @id references.
- `knowsAbout` items without `@id` are technically blank nodes. Acceptable for the skeleton but should get IDs in future.
- The original KNOWS_ABOUT had 35 items (design ref rounded to ~34). Always count from source, not from estimates.
- Zod v4 uses `import { z } from "zod"` (named import), not the v3 `import * as z from "zod"`.
- URL rewriting for deployment-specific JSON-LD: only rewrite strings starting with the canonical base. External URLs (Wikidata, DOI, arXiv, GitHub) pass through unchanged.

### Mistakes Made

- Test initially looked for "Cosmology" knowsAbout item that was replaced during migration. Always match test fixtures to actual data.
- `makesOffer` on Organization was incorrect Schema.org — pkg-reviewer caught it.

## Session: 2026-03-06 — Consolidation

### What Was Done

- Ran full consolidation checklist (8 items)
- Fixed AGENT.md fitness ceiling: compressed Development Commands section (154→134/150) — replaced full command listing with a 2-line summary referencing rules.md and package.json
- Moved skill path depth gotcha from napkin to distilled.md (workspace quick reference)
- Added "Agent tooling" section to PKG implementation plan — notes existence of pkg skill and pkg-reviewer for agents starting Phase 1
- Verified: napkin 191 lines (under ~500), distilled.md clean, practice box empty, all practice-index/AGENT.md tables consistent, no candidates for practice evolution

### Patterns to Remember

- The Development Commands section in AGENT.md was the obvious compression target for ceiling compliance — the full listing duplicated information already in rules.md and package.json. Key commands + reference is sufficient.
- When creating new agent tools (skills, reviewers), add a note to the relevant implementation plans so agents picking up the work know the tooling exists.

## Session: 2026-03-06 — PKG Skill and Reviewer Sub-Agent

### What Was Done

- Created `.agent/skills/pkg/SKILL.md` — compact operational guide for PKG work (type mappings, `@id` conventions, JSON-LD constraints, consumer value tiers, Neo4j checklist, validation workflow, common pitfalls)
- Created `.agent/sub-agents/templates/pkg-reviewer.md` — specialist reviewer with 7 assessment dimensions (Schema.org correctness, `@id` resolution, JSON-LD constraints, consumer value alignment, Neo4j compatibility, entity completeness, Zod schema coverage)
- Created `.cursor/agents/pkg-reviewer.md` — Cursor adapter
- Registered both in practice-index.md, AGENT.md, invoke-reviewers.md, and code-reviewer.md triage instruction
- Code reviewer caught broken relative paths in the skill — off-by-one depth error on all inline markdown links. Fixed by switching to repo-root-relative inline code paths (matching editorial-voice skill pattern).

### Patterns to Remember

- Files at `.agent/skills/<name>/SKILL.md` are 3 levels deep. Links to `docs/` need `../../../`, not `../../`. The safer pattern (used by editorial-voice) is repo-root-relative inline code paths: `` `docs/architecture/...` `` rather than `[text](../../docs/...)`. Avoids the depth-counting class of error entirely.
- When creating a new reviewer, also update the code-reviewer template's triage instruction (Step 4) — not just the invoke-reviewers rule. Both need to mention the new specialist.
- AGENT.md is now 155/150 lines — 5 over ceiling. The split strategy says "extract sub-agent roster, development commands, or project structure." Needs tightening.

## Session: 2026-03-06 — PKG Plans Research-Grounded Improvements

### What Was Done

- Created `.agent/plans/research/pkg-research-findings.md` — consolidated four research sub-agent reports (Schema.org types, JSON-LD best practices, Google structured data, Neo4j compatibility) into a single structured reference
- Applied 11 improvements to the design reference (`personal-knowledge-graph.plan.md`):
  - Fixed `Thesis.inSupportOf` (expects Text, not entity reference) in entity audit, relationships, and conventions
  - Resolved volunteer modelling (OrganizationRole + memberOf, removed VolunteerAction)
  - Updated `Person.pronouns` as first-class Schema.org property
  - Added consumer value tiers section after Principles
  - Added JSON-LD constraints section (CBD, 1.0 subset, self-containment, `@id` rules) to Design Phase 3
  - Added canonical document rule to Design Phase 2 conventions
  - Added `knowsAbout` Wikidata entity-linking recommendation
  - Added Google Scholar finding (citation\_\* meta tags)
  - Added Statement assessment note
  - Expanded validation strategy to four-tool workflow
  - Added research findings link to Related section
- Applied 9 improvements to the implementation plan (`personal-knowledge-graph-implementation.plan.md`):
  - Added TypeScript/Zod validation strategy to Phase 1 key decisions
  - Added JSON-LD validity requirement to skeleton task
  - Added Zod schema creation as Phase 1 task 6
  - Added Neo4j forward-compatibility checklist to quality gates
  - Added `.agent/private/identity.md` to Phase 2 reading requirements
  - Added CBD pattern reference and TDD note to Phase 3 subgraph closure task
  - Added `inSupportOf` migration note to Phase 3 task 1
  - Improved Phase 4 validation task to four-tool workflow
  - Added Google Scholar decision flag to Phase 4
- Ran editor and code-reviewer sub-agents, applied their fixes:
  - Moved `Occupation` from Tier 2 to Tier 3 (this site has no job postings)
  - Standardised inline annotation labels to "Research note" / "Open decision for Jim"
  - Trimmed consumer tiers paragraph (removed motivational closing)
  - Fixed Phase 1 table: "no code changes" → "design + skeleton + schemas"
  - Removed stale "breakout plan" framing from opening line
  - Added blank-node exception examples (PostalAddress, PropertyValue)

### Patterns to Remember

- Read exact file text before StrReplace on markdown — Unicode quotes block matching (from distilled.md). Did not hit this issue but the caution is justified.
- Inline annotations in plan documents should use consistent labels: "Research note" for research-derived context, "Open decision for Jim" for unresolved decisions. The editor caught three different labels in the first pass.
- When adding a "consumer value tier" to plan documents, the tier assignment must match the actual project context. `Occupation` is Tier 2 in job-posting contexts but Tier 3 on a personal site — editor caught this.
- Code reviewer caught that adding a new Phase 1 key decision (TypeScript/Zod) without a corresponding task creates a gap. Always pair key decisions with tasks.
- Code reviewer caught that existing code (`lib/jsonld.ts`) uses `inSupportOf` incorrectly but the implementation plan didn't call out the migration. Always check current code for violations of corrections you're documenting.

## Session: 2026-03-06 — Plans Roadmap and PKG Plan Restructuring

### What Was Done

- Created `.agent/plans/roadmap.md` — single entry point for all work streams
- Sequencing decided: knowledge graph first, LinkedIn as derived view (PKG Phase 5)
- Restructured the two PKG plans with clear boundary:
  - **Design reference** (personal-knowledge-graph.plan.md) = the WHY. Entity inventory, principles, Schema.org conventions, open questions.
  - **Implementation** (personal-knowledge-graph-implementation.plan.md) = the WHAT. Phased tasks with acceptance criteria, todos.
- Removed Phase 6 (Implementation) from the vision plan — replaced with pointer to implementation plan
- Marked TBD decisions in vision plan with notes on which ADRs have already answered them
- Rewrote implementation plan in jc-plan format: goals, impacts, acceptance criteria per task
- Removed duplicated content from implementation plan (was partially copying vision plan context)
- Added DRY explanation to implementation plan: Person entity defined once, `@id` resolves against root URL, front page is canonical document for the Person entity

### Patterns to Remember

- When two plans exist (design + execution), the execution plan should REFERENCE the design plan for context, not partially duplicate it. Duplication causes the two plans to drift apart.
- Open "Decision: TBD" markers in plans should note which ADRs have already answered the question. A fresh agent seeing "TBD" will try to resolve it again; noting "partially answered by ADR-008" prevents wasted effort.
- The Person entity's `@id` fragment (`#person`) resolves against the ROOT URL — this means the front page is the canonical Linked Data document for the Person. Currently backwards (Person only on `/cv`). The PKG corrects this.
- jc-plan format: every phase needs a goal, intended impact, and acceptance criteria per task. Plans without per-task criteria can't be tracked or verified.

## Session: 2026-03-06 — Practice-Core Portability Fixes

### What Was Done

- Triaged 14 Copilot comments on PR #19 independently — Copilot identified real issues but proposed wrong fixes (would hardcode this repo's paths into a portable package)
- Fixed practice.md: removed vestigial ADR numbers (114, 117, 119, 124, 125), broken references (schema-first-execution.md, invoke-code-reviewers, pnpm qg), non-canonical paths (architectural-decisions/), aligned distillation threshold ~800→~500
- Fixed practice-bootstrap.md: removed ADR-114/125 references, made template ADR path a placeholder, aligned thresholds, made portability check ecosystem-agnostic
- Updated CHANGELOG.md, deleted triage working document

### Patterns to Remember

- Automated reviewers (Copilot, etc.) don't understand the portability architecture of practice-core. They see "this path doesn't exist in this repo" and suggest changing it to match — but practice-core is portable and shouldn't be tied to any specific repo's paths. Independent assessment is always needed.
- Practice-core defines `.agent/` structure (canonical). It does NOT own `docs/` paths — those are repo-specific and routed through `practice-index.md`. ADR numbers from originating repos are vestigial when the concepts are described inline.
- ADR-117 was missed in the original plan but caught during implementation — same class of issue as 114/119/124/125. When removing a pattern (vestigial ADR numbers), grep for ALL instances of that pattern, not just the ones explicitly listed.
- Distillation threshold: practice-core said ~800, canonical skill said ~500. This inconsistency survived the practice-core evolution round because the threshold wasn't in scope. Lesson: during evolution work, run a quick consistency check between practice-core descriptions and the local operational skills/rules they describe.

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

---
name: ""
overview: ""
todos: []
isProject: false
---

# Practice-Core Evolution: Learnings from the New-CV Hydration

## Overview

This plan captures all findings from the first restructuring hydration of practice-core (hydrating into a repo with an existing mature, platform-locked practice). Five recommendations cleared the three-part bar, one new mechanism (changelog) was proposed, three borderline observations are recorded for further exploration, and one local inconsistency (adapter pointer syntax) needs fixing.

**Branch**: Continue on `feature/practice-core-hydration` (same branch as the hydration work).

**Scope**: Practice-core trinity files, local Cursor adapters, and the practice-index. No product code changes.

**Context**: The hydration was the first time practice-core was adopted by a repo that already had a mature practice. Previous propagations were all cold starts or return trips between repos that evolved together. This surfaced friction that the cold-start path doesn't encounter.

## Phases

Three phases: evolve the practice-core files, align the local practice, validate.

### Phase 1: Practice-core evolution

**Principle**: The practice-core's own three-part bar governs what changes. Each change here was validated by real work during the hydration, would prevent a recurring mistake if present, and is stable.

**Impact**: The practice-core becomes better equipped for the common "restructuring" hydration path, and the changelog reduces the risk of innovations being missed during plasmid exchange.

**Acceptance criteria**:

- `practice-lineage.md` contains a new "Restructuring an Existing Practice" section in §Growing a Practice
- `practice-bootstrap.md` §Ecosystem Survey includes practice maturity as a survey dimension
- `practice-bootstrap.md` §Ecosystem Survey "Never overwrite" step explicitly covers domain-specific practice mechanisms
- `practice-lineage.md` §Workflow Commands consolidation entry includes routine cohesion audit
- `practice-lineage.md` §Always-Applied Rules: underscore-prefix rule is either removed or reframed as universal principle
- A new `CHANGELOG.md` exists in `.agent/practice-core/` with format specification
- `practice-core/index.md` updated to reference the changelog
- All changes respect the self-containment boundary (no navigable external links)
- All three trinity files remain under their fitness ceilings after changes

#### Tasks

**1.1 Add "Restructuring an Existing Practice" path to practice-lineage.md**

**Location**: `practice-lineage.md` §Growing a Practice from This Blueprint — add a new subsection after the effort heuristic paragraph and before step 1.

**Content**: The practice-core currently describes two paths: cold start (no existing practice) and incoming plasmid integration. A third path is common: restructuring an existing platform-locked practice into canonical-first. Key points to cover:

- Survey existing practice topology first: commands, skills, rules, agents, memory pipeline, prompts — not just language/tooling
- Three hydration paths based on survey: cold start (no practice), augmentation (partial practice), restructuring (mature but platform-locked practice)
- For restructuring: create canonical versions first, convert platform files to thin adapters second, update references third
- Existing practice mechanisms that exceed the blueprint are adaptations, not deviations — preserve them

**Impact**: A hydrating agent encountering a mature repo knows which path to take and in what order.

**Acceptance criteria**:

- The section describes the restructuring path with clear sequencing
- It references the Ecosystem Survey for the initial assessment
- It does not duplicate the cold-start steps (cross-reference, don't repeat)
- `practice-lineage.md` remains under its 320-line fitness ceiling

**1.2 Expand Ecosystem Survey to include practice maturity**

**Location**: `practice-bootstrap.md` §Before You Begin: Ecosystem Survey — expand step 1 and add a step between current steps 1 and 2.

**Current step 1**: "Survey the existing repo: language(s), test framework(s), linter(s), formatter(s), package manager, build system, and existing quality standards."

**Change**: Add to step 1: "Survey existing practice infrastructure: commands, skills, rules, sub-agents, memory pipeline, prompts. Determine the hydration path: cold start (no existing practice), augmentation (partial practice), or restructuring (mature but platform-locked practice)."

**Impact**: The survey catches practice maturity before artefact creation begins, routing to the correct hydration path.

**Acceptance criteria**:

- Step 1 mentions practice infrastructure alongside language/tooling
- The three hydration paths are named
- `practice-bootstrap.md` remains under its 400-line fitness ceiling

**1.3 Extend "Never overwrite" to cover domain-specific practice mechanisms**

**Location**: `practice-bootstrap.md` §Before You Begin: Ecosystem Survey — expand step 4 ("Never overwrite").

**Current**: "the Practice enables excellence; it does not replace what has already been achieved."

**Change**: Add: "This extends beyond tooling standards to practice mechanisms: specialised reviewers, additional knowledge flow feeds, editorial systems, domain-specific sub-agents. The local practice may exceed the blueprint in areas the blueprint does not model. These are adaptations, not deviations — preserve and integrate them."

**Impact**: A hydrating agent preserves local sophistication rather than flattening it to match the blueprint.

**Acceptance criteria**:

- Step 4 explicitly names practice mechanisms (not just tooling)
- Examples are concrete enough to guide judgment

**1.4 Add routine cohesion audit to consolidation command specification**

**Location**: `practice-lineage.md` §Workflow Commands — the consolidate-docs entry.

**Current**: "Verify documentation is current (decisions should already be in ADRs/docs from when they were made), extract any remaining plan content to permanent locations, update status markers, check the practice box, consider Practice evolution (apply the bar from this lineage doc)."

**Change**: Add after "check the practice box": "audit cohesion (practice-core internal consistency, practice-index links, broader Practice alignment)."

**Impact**: Drift between practice-core and the local practice is caught during routine consolidation, not only during plasmid integration.

**Acceptance criteria**:

- The consolidation entry explicitly includes cohesion audit
- It is clear this is routine (every consolidation), not just on plasmid arrival

**1.5 Reframe underscore-prefix rule as universal principle**

**Location**: `practice-lineage.md` §Always-Applied Rules.

**Current**: "No unused-variable underscore prefixes"

**Change**: Reframe as the universal principle it encodes: "Don't suppress warnings with naming conventions — fix the root cause." This is what the rule actually means, expressed in a way that applies to Python's `_`, Go's blank identifier, and any other ecosystem convention.

**Impact**: The always-applied rules list remains ecosystem-agnostic.

**Acceptance criteria**:

- The rule is expressed as a universal principle
- No ecosystem-specific syntax is referenced
- The meaning is preserved (the root cause must be fixed, not masked)

**1.6 Add CHANGELOG.md to practice-core**

**Rationale**: The provenance chain records WHICH repos evolved the files and the high-level PURPOSE. But it does not record WHAT changed. When incoming practice-core files arrive in the practice box, step 2 of the Integration Flow says "Read it. Understand what they learned and why." A changelog makes this faster and more thorough — the receiving agent can scan for relevant changes rather than diffing ~300-line files.

**Location**: New file `.agent/practice-core/CHANGELOG.md`.

**Format**:

```markdown
# Practice-Core Changelog

Changes to the practice-core files, newest first. Each entry records the repo
that made the change and what was changed. This file travels with the
practice-core package.

## [new-cv] 2026-03-05

- Added "Restructuring an Existing Practice" path to practice-lineage.md
- Expanded Ecosystem Survey to include practice maturity assessment
- Extended "Never overwrite" to cover domain-specific practice mechanisms
- Added routine cohesion audit to consolidation command specification
- Reframed underscore-prefix rule as ecosystem-agnostic principle
- Added this changelog

## [oak-open-curriculum-ecosystem] 2026-02-28

- (initial entries from prior evolution — reconstruct from provenance)
```

**Self-containment**: The changelog uses repo names in square brackets (matching provenance entries). No navigable external links.

**Travelling with the package**: Update `practice-core/index.md` to list CHANGELOG.md in the file table. The package becomes six files (trinity + two entry points + changelog). Update `practice-lineage.md` §Plasmid Exchange to mention the changelog as part of the travelling package. Update `practice.md` §Plasmid Exchange similarly.

**Integration Flow impact**: Add to step 2: "Read the changelog for a summary of what changed since the last provenance entry matching the local repo."

**Impact**: Receiving repos can quickly assess what changed, reducing the risk of innovations being missed.

**Acceptance criteria**:

- `CHANGELOG.md` exists in `.agent/practice-core/`
- `index.md` file table includes it
- `practice-lineage.md` and `practice.md` Plasmid Exchange sections mention it
- Integration Flow step 2 references it
- Format uses repo names and dates matching provenance entries
- No navigable external links (self-containment preserved)
- All files referencing the changelog remain under their fitness ceilings

### Phase 2: Local practice alignment

**Principle**: Consistency is more important than strict correctness. All Cursor adapters should use `@` for file references, and the local practice should reflect any practice-core changes.

**Impact**: A predictable, consistent adapter pattern across all artefact types. No surprises when reading any `.cursor/` file.

**Acceptance criteria**:

- All `.cursor/rules/*.mdc` files use `@` syntax for file references
- All `.cursor/agents/*.md` files use `@` syntax for file references
- `.agent/practice-index.md` reflects any new files (CHANGELOG.md)
- AGENT.md is consistent with updated practice-core content

#### Tasks

**2.1 Fix rule adapter pointer syntax**

Update all 6 files in `.cursor/rules/` to use `@` syntax:

- `read-agent-md.mdc`: `Read and follow @.agent/rules/read-practice.md`
- `napkin-always-on.mdc`: `Read and follow @.agent/rules/napkin-always-on.md`
- `tdd.mdc`: `Read and follow @.agent/rules/tdd.md`
- `type-safety.mdc`: `Read and follow @.agent/rules/type-safety.md`
- `code-quality.mdc`: `Read and follow @.agent/rules/code-quality.md`
- `invoke-reviewers.mdc`: `Read and follow @.agent/rules/invoke-reviewers.md`

Remove backticks and trailing periods. Match the command/skill adapter format exactly.

**Acceptance criteria**:

- All 6 rule triggers use `Read and follow @.agent/rules/{name}.md` (no backticks, no trailing period)

**2.2 Fix agent adapter pointer syntax**

Update all 4 files in `.cursor/agents/` to use `@` syntax:

- `editor.md`: `Read and follow @.agent/sub-agents/templates/editor.md`
- `code-reviewer.md`: `Read and follow @.agent/sub-agents/templates/code-reviewer.md`
- `test-reviewer.md`: `Read and follow @.agent/sub-agents/templates/test-reviewer.md`
- `type-reviewer.md`: `Read and follow @.agent/sub-agents/templates/type-reviewer.md`

**Acceptance criteria**:

- All 4 agent adapters use `Read and follow @.agent/sub-agents/templates/{name}.md` (no backticks)

**2.3 Update practice-index.md**

Add CHANGELOG.md to the practice-core section of the practice-index if not already there. Verify all existing links still resolve.

**Acceptance criteria**:

- Practice-index references the changelog
- All links resolve

### Phase 3: Validation

**Principle**: Silent degradation is the worst failure mode.

**Impact**: Every reference resolves. Practice-core is self-contained. Fitness ceilings are respected.

**Acceptance criteria**:

- Self-containment check passes on practice-core (no external links except `../practice-index.md`)
- All practice-core files are under their fitness ceilings
- Practice-index links all resolve
- `pnpm check` passes

#### Tasks

**3.1 Check fitness ceilings**

After all edits, count lines in each trinity file and verify:

- `practice.md` under 250 lines
- `practice-lineage.md` under 320 lines
- `practice-bootstrap.md` under 400 lines

If any file exceeds its ceiling, apply tightening: merge overlapping principles, remove examples that have served their teaching purpose, compress without losing coverage. Present tightened version to user before committing.

**3.2 Run self-containment check**

Run the self-containment check script from `practice-lineage.md` on all practice-core files (now including CHANGELOG.md). Zero violations expected.

**3.3 Run reference and link checks**

- Verify practice-index links all resolve
- Verify AGENT.md links all resolve
- Verify practice-core internal cross-references are consistent

**3.4 Run quality gates**

`pnpm check` — all six gates must pass.

## Findings to Explore (did not clearly clear the bar — recorded for discussion)

These observations surfaced during the hydration but may not yet be stable enough for practice-core changes. Record them here for exploration in future sessions.

### F1: Skill classification semantics undefined

The skill YAML frontmatter includes `classification: active | passive` but neither the bootstrap nor the lineage doc defines what these mean. Inferred: `passive` = always on, no explicit trigger (napkin); `active` = explicitly invoked. A one-line definition in the bootstrap §Skills Format would help.

**Bar assessment**: Validated, but minor — agents can infer from context. May not prevent a recurring mistake. Low priority.

### F2: practice.md fitness ceiling may be too aggressive

At 250 lines with current content at ~215, there's only ~35 lines of headroom. The file covers: three-layer model, knowledge flow (the most important conceptual section), artefact map, workflow, review system, plasmid exchange, meta-principles, self-teaching property, sustainability. Any substantive addition will trigger tightening.

**Bar assessment**: The ceiling is a soft trigger, and tightening is the mechanism working. But 250 may force premature compression. Needs more data from additional hydrations before changing. Monitor.

### F3: Agent adapter format differs from command/skill adapter format

Commands and skills use `@`-prefixed file injection in Cursor adapters. Agent adapters were written with backtick-formatted paths. This plan fixes the local inconsistency (Phase 2), but the practice-bootstrap.md template for agent adapters should also be checked for consistency with the command/skill templates.

**Bar assessment**: The practice-bootstrap.md is platform-agnostic and uses generic pointer descriptions. The `@` syntax is Cursor-specific. The bootstrap correctly doesn't mandate platform syntax. The issue is local, not in the core.

### F4: practice-core package size — five files becoming six

Adding CHANGELOG.md means the travelling package grows from five to six files. The practice-lineage.md, practice.md, practice-bootstrap.md, README.md, and index.md all reference "five files" and "the plasmid trinity plus two entry points." All of these references need updating if the changelog is adopted. The changelog is not part of the trinity and not an entry point — it is a companion artefact.

**Bar assessment**: This is a mechanical consequence of adding the changelog. The references are enumerable and the update is straightforward. But it changes a well-established description ("five files") that appears in multiple places. Worth tracking all occurrences before editing.

### F5: The consolidation command specification lives in two places

The consolidation command's scope is described in both `practice-lineage.md` §Workflow Commands (brief) and `practice-bootstrap.md` §Required Commands (table row). Adding cohesion audit to one but not the other creates inconsistency. Both need updating.

**Bar assessment**: This is a cohesion concern, not a new principle. The fix is mechanical — update both locations.

### F6: The Integration Flow could reference the changelog

Step 2 of the Integration Flow says "Read it. Understand what they learned and why." With a changelog, this step becomes: "Read the changelog for a summary of what changed. Then read the full files to understand the context." This is a natural enhancement but depends on the changelog being adopted first.

**Bar assessment**: Dependent on F4 (changelog adoption). Include in Phase 1.6.

## Notes

- **No product code changes.** All changes are to practice infrastructure markdown files.
- **Self-containment is critical.** Every edit to a practice-core file must be checked against the boundary contract: no navigable links outside practice-core except to `../practice-index.md`.
- **Fitness ceilings are soft triggers.** If a file exceeds its ceiling after edits, the response is tightening (compress without losing coverage), not removing content.
- **The three-part bar applies to the practice-core itself.** Before writing any change, verify: validated by real work? Would its absence cause a recurring mistake? Stable?
- **"Five files" references.** If CHANGELOG.md is adopted, grep for all occurrences of "five files", "five practice-core files", "package of five", etc. across practice-core and update them. This is tracked in Finding F4.

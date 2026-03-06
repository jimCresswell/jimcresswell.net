---
name: Practice-Core Hydration
overview: "Hydrate practice-core into the new-cv repo: restructure existing commands/skills/agents into the canonical-first model, add the new mechanisms (metacognition, technical reviewers, always-applied rules), introduce growth governance (fitness functions, prompt frontmatter), and validate everything with the bootstrap checklist."
todos:
  - id: phase-1-canonical
    content: "Phase 1: Canonical-first restructuring — directory structure, migrate commands/skills/agent, create Cursor adapters"
    status: completed
  - id: phase-2-mechanisms
    content: "Phase 2: New mechanisms — metacognition, 3 technical reviewers, always-applied rules layer, new commands, consolidate start-right"
    status: completed
  - id: phase-3-governance
    content: "Phase 3: Growth governance — fitness frontmatter, prompt frontmatter, enhanced consolidation, experience/code-patterns dirs, update provenance"
    status: completed
  - id: phase-4-validation
    content: "Phase 4: Integration and validation — practice-index, AGENT.md update, reference/bootstrap checks, cohesion audit"
    status: completed
isProject: false
---

# Practice-Core Hydration

## Context

The repo has a mature Practice: 6 directives, 7 commands, 5 skills, 1 sub-agent, 3 prompts, napkin/distilled memory, 13 ADRs. But everything substantive lives directly in `.cursor/` (platform-locked), there are no always-applied rules beyond "read AGENT.md", no technical reviewers, no fitness governance on permanent docs, and no metacognition directive.

Practice-core brings: the canonical-first artefact model (portability), automatic enforcement via always-applied rules, technical review (code/test/type reviewers), fitness functions, metacognition, and the propagation mechanism.

**Branch**: Work on `feature/practice-core-hydration` to protect main. This restructuring touches many files — the risk is broken references, not broken product code.

**Guiding constraint**: This is a personal website project on Cursor only. No multi-platform adapters (`.claude/`, `.gemini/`, `.agents/`). The canonical layer enables that later without rework.

## Current state

- **Commands** (7, all in `.cursor/commands/`): consolidate-docs (7L), jc-plan (48L), jc-gates (22L), jc-start-right (40L), jc-start-right-thorough (57L), jc-commit (54L), jc-editor (35L)
- **Skills** (5, all in `.cursor/skills/`): deslop (24L), quality-gates (47L), distillation (186L), editorial-voice (74L), napkin (98L)
- **Agents** (1, in `.cursor/agents/`): editor (79L)
- **Rules** (1, in `.cursor/rules/`): read-agent-md (9L)
- **Prompts** (3, in `.agent/prompts/`): start-right (9L), start-right-thorough (16L), project-spec-creation-process (279L)
- **No YAML frontmatter** on any directive, prompt, or memory file
- **No** `.agent/commands/`, `.agent/rules/`, `.agent/skills/`, `.agent/sub-agents/`, `.agent/experience/`, `.agent/memory/code-patterns/`, `.agent/practice-index.md`, `metacognition.md`

## Phases

Four phases, each building on the previous. Phase 1 is the structural prerequisite; Phase 2 adds what's new; Phase 3 adds governance; Phase 4 validates the whole.

### Phase 1: Canonical-first restructuring

**Principle**: Separate substance from platform activation. All substantive content moves to `.agent/` (platform-agnostic); `.cursor/` retains only thin adapters with activation metadata and a pointer.

**Impact**: Every command, skill, and agent template becomes portable. The Practice is no longer Cursor-locked.

**Acceptance criteria**:

- `.agent/commands/` contains 7+ canonical command files with substantive workflow instructions
- `.agent/skills/` contains 5 canonical skill directories, each with a `SKILL.md` carrying YAML frontmatter (`name`, `classification`, `description`)
- `.agent/sub-agents/templates/` contains the editor agent template
- Every `.cursor/commands/`, `.cursor/skills/`, `.cursor/agents/` file is a thin adapter (activation metadata + `@`-prefixed pointer to canonical source, no substantive instructions)
- All `jc-` naming is consistent (rename `consolidate-docs.md` to `jc-consolidate-docs.md`)

#### Tasks

**1.1 Create canonical directory structure**

Create: `.agent/commands/`, `.agent/rules/`, `.agent/skills/{napkin,distillation,editorial-voice,quality-gates,deslop}/`, `.agent/sub-agents/templates/`

**1.2 Migrate commands to canonical locations**

For each of the 7 commands in `[.cursor/commands/](.cursor/commands/)`:

- Move the substantive content to `.agent/commands/{command-name}.md`
- Strip any Cursor-specific syntax (`@`-prefixed paths become plain relative paths)
- Replace the `.cursor/commands/` file with a thin adapter: `Read and follow @.agent/commands/{command-name}.md`
- Rename `consolidate-docs.md` to `jc-consolidate-docs.md` for consistency

**1.3 Migrate skills to canonical locations**

For each of the 5 skills in `[.cursor/skills/](.cursor/skills/)`:

- Move the substantive content to `.agent/skills/{name}/SKILL.md`
- Add YAML frontmatter (`name`, `classification`, `description`)
- Replace the `.cursor/skills/{name}/SKILL.md` file with a thin Cursor adapter: frontmatter + `Read and follow @.agent/skills/{name}/SKILL.md`

**1.4 Migrate editor agent to canonical location**

- Move the substantive content from `[.cursor/agents/editor.md](.cursor/agents/editor.md)` to `.agent/sub-agents/templates/editor.md`
- Replace `[.cursor/agents/editor.md](.cursor/agents/editor.md)` with Cursor adapter: YAML frontmatter (`name`, `description`, `model`, `tools`, `readonly`) + pointer to canonical template

### Phase 2: New mechanisms

**Principle**: Add what the Practice brings that this repo doesn't have: metacognition, technical review, automatic enforcement, and structured reflection commands.

**Impact**: Principles that currently depend on agent discovery become always-on constraints. Non-trivial changes get technical review. Agents pause and reflect before planning.

**Acceptance criteria**:

- `.agent/directives/metacognition.md` exists and is linked from AGENT.md
- 3 new technical reviewers (code-reviewer, test-reviewer, type-reviewer) exist as canonical templates + Cursor adapters
- `.agent/rules/` contains canonical rules for all always-applied constraints
- `.cursor/rules/` contains matching trigger wrappers (`.mdc` files, `alwaysApply: true`)
- 4 new commands (review, think, step-back, go) exist as canonical + Cursor adapters
- Start-right variants are consolidated into one command + one prompt

#### Tasks

**2.1 Create metacognition directive**

Create `[.agent/directives/metacognition.md](.agent/directives/metacognition.md)` from the universal template in [practice-bootstrap.md](.agent/practice-core/practice-bootstrap.md). This is ecosystem-agnostic — no project-specific content. Link it from [AGENT.md](.agent/directives/AGENT.md).

**2.2 Create technical reviewers**

Create three canonical reviewer templates in `.agent/sub-agents/templates/`:

- `code-reviewer.md` — gateway reviewer, always invoked after non-trivial changes. Assesses correctness, edge cases, security, performance, readability, test coverage. Triages to specialists.
- `test-reviewer.md` — TDD compliance, test classification, mock simplicity, test value. Recommends deletion for tests that test mocks or types.
- `type-reviewer.md` — type flow tracing, widening detection, assertion usage. "Why solve at runtime what you can embed at compile time?"

All adapted to this repo's stack (Next.js 16, React 19, Tailwind 4, Vitest, Playwright). Each reads [AGENT.md](.agent/directives/AGENT.md), [rules.md](.agent/directives/rules.md), [testing-strategy.md](.agent/directives/testing-strategy.md) as mandatory first step. Create matching Cursor adapters in `.cursor/agents/`.

Update [AGENT.md](.agent/directives/AGENT.md) sub-agents table.

**2.3 Build always-applied rules layer**

Create canonical rules in `.agent/rules/` (short, imperative, 2-8 lines each) and matching Cursor triggers in `.cursor/rules/` (`alwaysApply: true`). Group related rules into a few canonical files:

- `read-practice.md` — read AGENT.md and practice-index at session start (expands existing `read-agent-md.mdc`)
- `napkin-always-on.md` — read and write napkin continuously (promotes skill to rule)
- `tdd.md` — TDD at all levels, test behaviour not implementation
- `type-safety.md` — no type shortcuts, no `as`/`any`/`!`
- `code-quality.md` — fail fast, never disable checks, no skipped tests, no unused underscore prefixes, all gate issues blocking
- `invoke-reviewers.md` — invoke code-reviewer after non-trivial changes (references the reviewer roster)

Each canonical rule points to the full policy in [rules.md](.agent/directives/rules.md) or [testing-strategy.md](.agent/directives/testing-strategy.md).

**2.4 Create new commands**

Create 4 new commands in `.agent/commands/` (canonical) + `.cursor/commands/` (adapters):

- `jc-review.md` — run gates, triage which reviewers are needed, invoke them, consolidate into single report with verdict
- `jc-think.md` — structured thinking: understand, analyse, reason, synthesise, conclude. No action.
- `jc-step-back.md` — pause, reflect on goals/approach/alignment with rules, apply First Question
- `jc-go.md` — quick grounding: read AGENT.md, read rules, check task list, proceed

**2.5 Consolidate start-right variants**

Merge `jc-start-right.md` and `jc-start-right-thorough.md` into a single `jc-start-right.md` (one canonical command, one Cursor adapter). Similarly merge the two prompt variants into one `start-right.prompt.md`. The thorough version's extras (system-level value checks, TSDoc requirements) fold into the main version. Fewer moving parts, same coverage.

### Phase 3: Growth governance and provenance

**Principle**: Every stage of the knowledge flow needs a fitness function. Without growth governors, consolidation moves unbounded growth downstream. The provenance chain records this repo's participation in the sharing network.

**Impact**: Documents self-govern their growth. Prompts have lifecycle tracking. The practice box is wired into workflows. The Practice can travel from this repo to others.

**Acceptance criteria**:

- All directives carry `fitness_ceiling` and `split_strategy` in YAML frontmatter
- All prompts carry YAML frontmatter (`prompt_id`, `title`, `type`, `status`, `last_updated`)
- `distilled.md` carries `fitness_ceiling` frontmatter
- `.agent/experience/` and `.agent/memory/code-patterns/` directories exist (with `.gitkeep`)
- The `jc-consolidate-docs` command includes: fitness ceiling checks, practice box check, cohesion audit, practice evolution consideration
- All three trinity files have a new provenance entry for `new-cv`

#### Tasks

**3.1 Add fitness frontmatter to directives**

Add YAML frontmatter with `fitness_ceiling` and `split_strategy` to all 6 directives in `.agent/directives/`. Suggested ceilings based on current lengths and expected growth:

- `AGENT.md` — ~150 lines (stable index, should not grow much)
- `rules.md` — ~120 lines (authoritative rules, moderate growth)
- `testing-strategy.md` — ~100 lines
- `editorial-guidance.md` — ~150 lines (rich, domain-specific)
- `privacy.md` — ~50 lines
- `secops.md` — ~50 lines

Split strategy for each: split by responsibility when ceiling is exceeded.

**3.2 Add YAML frontmatter to prompts**

Add frontmatter (`prompt_id`, `title`, `type`, `status`, `last_updated`) to all prompts in `.agent/prompts/`. Mark `project-spec-creation-process.prompt.md` as `type: workflow` (or archive it if no longer needed — confirm with user).

**3.3 Add fitness frontmatter to memory files**

Add `fitness_ceiling` to `distilled.md` (~200 lines, per practice-core spec).

**3.4 Create experience and code-patterns directories**

Create `.agent/experience/` and `.agent/memory/code-patterns/` with `.gitkeep`. Lightweight — just establishing the directories for future use.

**3.5 Enhance consolidation command**

Update `jc-consolidate-docs` canonical command to include:

- Check fitness ceilings on all directives and permanent docs
- Check practice box (`.agent/practice-core/incoming/`) for incoming files
- Cohesion audit: practice-core internal consistency, practice-index links, broader Practice alignment
- Consider practice evolution: apply the three-part bar

**3.6 Update provenance chains**

Append a new entry to each trinity file's provenance array:

```yaml
- index: 3 # (or next in sequence)
  repo: new-cv
  date: 2026-03-05
  purpose: "Personal website and CV: editorial voice, accessibility, single-developer workflow with learning loop"
```

Update the `attribution` field if needed.

### Phase 4: Integration and validation

**Principle**: Silent degradation is the worst failure mode. Files that look correct but whose references don't resolve cause agents to produce plausible but ungrounded output.

**Impact**: Every reference resolves. The system is internally consistent. A fresh agent can navigate from any entry point to any artefact.

**Acceptance criteria**:

- `.agent/practice-index.md` exists with all four required sections (Directives, Architectural Decisions, Tools and Workflows, Artefact Directories), all links resolve
- [AGENT.md](.agent/directives/AGENT.md) links to `.agent/practice-core/index.md` and references the full sub-agent roster
- Reference check script finds zero broken references
- Self-containment check confirms practice-core has no external links (except `../practice-index.md`)
- Bootstrap checklist (12 items from [practice-bootstrap.md](.agent/practice-core/practice-bootstrap.md)) passes
- All quality gates pass (`pnpm check`)

#### Tasks

**4.1 Create practice-index.md**

Create `[.agent/practice-index.md](.agent/practice-index.md)` — the bridge file linking practice-core to local artefacts. Four sections: Directives (6), Architectural Decisions (13 ADRs), Tools and Workflows (commands, skills, rules), Artefact Directories. All links must resolve.

**4.2 Update AGENT.md**

Update [AGENT.md](.agent/directives/AGENT.md):

- Add link to `.agent/practice-core/index.md` in a new "The Practice" section
- Update sub-agents table to include all four reviewers (editor, code-reviewer, test-reviewer, type-reviewer)
- Update commands table with new commands (review, think, step-back, go)
- Update skills table if any names/purposes changed
- Ensure all file paths resolve

**4.3 Run validation**

- Run the reference check script from [practice-lineage.md](.agent/practice-core/practice-lineage.md) across `.agent/` and `.cursor/`
- Run the self-containment check on practice-core
- Run the agent dependency check on `.cursor/agents/`
- Walk the 12-item bootstrap checklist from [practice-bootstrap.md](.agent/practice-core/practice-bootstrap.md)
- Run `pnpm check` to verify product quality gates still pass

**4.4 Cohesion audit**

Final pass: verify all practice-core files are internally consistent, practice-index links resolve, and broader Practice files (directives, rules, commands, prompts, skills) are aligned with the core. No stale descriptions, no contradictions, no outdated wording.

## Notes

- **No product code changes.** This plan is entirely about practice infrastructure. Quality gates on product code should pass throughout.
- **ADR consideration.** The canonical-first restructuring is an architectural decision worth recording. Create an ADR (e.g. ADR-014: Canonical-First Practice Artefact Model) during Phase 1.
- **The project-spec-creation-process prompt** (279 lines) is a special case — it's a workflow prompt for generative UI agents that may or may not still be active. Confirm status with user during Phase 3.2.

---
provenance: provenance.yml
fitness_line_target: 525
fitness_line_limit: 675
fitness_char_limit: 32000
fitness_line_length: 100
---

# Practice Bootstrap

This file completes the plasmid trinity. `practice.md` is the **what**,
`practice-lineage.md` the **why**, and this file the **how**: annotated
templates for every artefact type. Four companion files travel with the
trinity: `README.md`, `index.md`, `CHANGELOG.md`, and `provenance.yml`.
Templates use `{placeholders}` for project-specific content. The Practice uses
a **canonical-first artefact model**: substantive content lives in `.agent/`,
and thin platform adapters point back to it. Sections below use Cursor and
TypeScript/Node.js as concrete examples — adapt them to local platforms and
ecosystems.

## Before You Begin: Ecosystem Survey

The templates below use TypeScript/Node.js/Cursor conventions as concrete
examples. Before creating any artefacts, the hydrating agent MUST:

1. **Survey the existing repo**: language(s), test framework(s), linter(s),
   formatter(s), package manager, build system, quality standards, and
   existing Practice infrastructure. Determine whether this is a cold start,
   augmentation, or restructuring.
2. **Assess alignment**: identify what the repo already has that meets or
   exceeds Practice principles. Existing standards that are at least as
   rigorous as the Practice MUST be preserved.
3. **Adapt templates**: substitute local tooling in every template. File
   extensions, tool names, configuration formats, and platform conventions all
   change.
4. **Never overwrite**: preserve any local standard or Practice mechanism that
   already meets or exceeds the blueprint. These are adaptations, not
   deviations.

## The Artefact Model

Four artefact types follow the canonical-first model. Canonical content in
`.agent/` is the single source of truth; thin platform adapters contain only
activation metadata and a pointer to the canonical source.

| Type                         | Canonical                          | Platform adapters                                                                                                  |
| ---------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Skills**                   | `.agent/skills/*/SKILL.md`         | Native wrappers such as `.cursor/skills/*/SKILL.md`, plus portable `.agents/skills/*/SKILL.md` where supported     |
| **Rules**                    | `.agent/rules/*.md`                | `.cursor/rules/*.mdc`, or an entry-point chain where the local surface matrix documents that choice                |
| **Commands** (`jc-*` prefix) | `.agent/commands/*.md`             | `.cursor/commands/jc-*.md`, `.agents/skills/jc-*/SKILL.md`, and equivalent native wrappers where the repo has them |
| **Sub-agent templates**      | `.agent/sub-agents/templates/*.md` | `.cursor/agents/`, `.codex/`, and other platform-specific reviewer config where supported                          |

Canonical rules are short operational reinforcements of policy. Each platform
trigger wrapper points at either `.agent/rules/*.md` or
`.agent/skills/*/SKILL.md` — never both, and never at a directive directly.

Some artefact types are consumed directly rather than adapted:

- **Directives** (`.agent/directives/`) — policy documents such as `AGENT.md`,
  `rules.md`, `testing-strategy.md`, and `metacognition.md`
- **Plans** (`.agent/plans/`) — all platforms read plans from the same
  canonical location
- **Reference** (`.agent/reference/`) — stable operational material: surface
  contracts, setup guidance, and reference notes that should not age quickly
- **Research** (`.agent/research/`) — synthesis-heavy notes, surveys, and
  rationale trails that age differently from reference material

A thin wrapper MUST NOT contain substantive instructions or logic not in the
canonical source. Add a portability validation script to the quality gates to
enforce this.

Where a repo supports multiple agent platforms, keep a local surface matrix
(for example `.agent/reference/cross-platform-agent-surface-matrix.md`) that
records supported and unsupported mappings explicitly. Do not infer broad
parity from the presence of one portable adapter family.

## Metacognition

Before planning work, pause.

Reflect on what you are about to do — those are your thoughts. Think about
those reflections — those are your insights. Consider what those insights
teach you about the original problem and your assumptions. How does that
change the framing? Why?

This process costs nothing and prevents shallow execution. Apply it before
every plan, every architectural decision, and every non-trivial
implementation choice. Create this as `.agent/directives/metacognition.md`
(it is universal — no project-specific content).

Do not reduce metacognition to a planning checklist. Its job is to create a
mode shift from execution to reflection before execution starts.

## The Practice Index (.agent/practice-index.md)

The Practice Index is the bridge between the portable Practice Core and the
local repo. It is **not** part of the travelling package — it is created
during hydration and stays in the repo. Practice Core files link to it via
`../practice-index.md`; it carries the navigable links to the repo's actual
artefacts.

### Required sections

| Section                     | Content                                                        |
| --------------------------- | -------------------------------------------------------------- |
| **Directives**              | Table of directive files with paths and purposes               |
| **Architectural Decisions** | Table of ADRs referenced by `practice.md`, with links          |
| **Tools and Workflows**     | Tables of key commands, skills, rules, and validation surfaces |
| **Artefact Directories**    | Table of `.agent/` and active platform-adapter directories     |

If the repo spans multiple agent platforms, either surface the local matrix
directly from the Practice Index or make sure the Artefact Directories section
points clearly to `.agent/reference/`.

### Template

```markdown
# Practice Index

Bridge between the portable Practice Core and this repo's local artefacts.
Not part of the travelling package. Format specified by practice-bootstrap.md.

## Directives

## Architectural Decisions

## Tools and Workflows

## Artefact Directories
```

Populate every section during hydration.

## Entry Points

### AGENTS.md (repo root)

The cross-platform entry point. Every agent platform looks for this file.

```markdown
# AGENTS.md

**{Project name}** -- {one-line description}.

Read [AGENT.md](.agent/directives/AGENT.md)
```

### AGENT.md (.agent/directives/)

The operational entry point. Sections (in order): **Grounding** (spelling,
date format, link to metacognition), **The Practice** (link to
`.agent/practice-core/index.md` and start-right), **First Question**,
**Project Context** (what, package manager, framework, scope, key artefacts),
**Rules** (link to `rules.md`), **Sub-agents** (installed roster or explicit
not-yet-installed status), **Development Commands** (project-specific),
**Structure** (directory tree).

Keep it stable — no mutable session state. Mutable state belongs in plans.

## Directives

### rules.md (.agent/directives/)

Encode the Principles from `practice-lineage.md` as imperative rules.
Sections: **First Question**, **Core Rules** (code design, domain-specific,
tooling, code quality, types, testing summary, developer experience). Each
rule is stated as a command, not a suggestion. Link to `testing-strategy.md`
from the testing section.

### testing-strategy.md (.agent/directives/)

Encode the Testing Philosophy from `practice-lineage.md` with local tooling.
Sections: **Tooling** (test runner), **Philosophy** (imperative rules),
**Test Types** (unit, integration, end-to-end), **What to Test**
(project-specific surfaces), and **Workflow** (TDD always, tests next to
code). Make explicit that strictness means complete proof in the correct layer
rather than forcing type, lint, or portability concerns into tests.

## Rules: Canonical Rules and Platform Triggers

The rules system has three layers:

1. **Policy** — `.agent/directives/` (`rules.md`, `testing-strategy.md`,
   etc.). Authoritative and comprehensive.
2. **Canonical rules** — `.agent/rules/*.md`. Short operational
   reinforcements of policy. Each stands alone.
3. **Platform triggers** — `.cursor/rules/*.mdc` and equivalent native
   wrappers where a platform supports them.

A trigger MUST point at either `.agent/rules/*.md` or
`.agent/skills/*/SKILL.md` — never at a directive directly, and never both.
No double indirection.

### Canonical Rule Format

```text
# {Rule Title}

{2-8 lines of imperative instruction — enough to act on standalone}

See `{directive-or-ADR-path}` for the full policy.
```

### Trigger Wrapper Formats

**Cursor** (`.cursor/rules/*.mdc`):

```text
---
description: {one-line}
alwaysApply: true  # or globs: '**/*.test.ts'
---

Read and follow `.agent/rules/{name}.md`.
```

If a platform has no native rules layer, document that in the local surface
matrix and rely on the entry-point chain instead of inventing an unsupported
adapter family.

Codex note: this repo does not use a parallel `.agents/rules/` layer. Codex
picks up always-on behaviour through the entry-point chain
(`AGENTS.md` → `.agent/directives/AGENT.md` → canonical rules). When a rule
activates a command or skill, add the corresponding `.agents/skills/` wrapper.
Reviewer roles should be configured through `.codex/`, not modelled as skills.

## Sub-agents: Templates and Platform Adapters

Canonical sub-agent prompts live in `.agent/sub-agents/templates/*.md`
(platform-agnostic). For production work, use the three-layer composition
system: shared components → canonical templates → thin platform adapters.

Platform adapters contain only activation metadata and a pointer to the
canonical template: Cursor `.cursor/agents/*.md`, Codex project-agent config
under `.codex/`, and other platform-specific equivalents where supported. If a
platform has no supported sub-agent surface in the local matrix, keep that
state explicit rather than implying parity.

### Template Structure

A sub-agent template requires these sections:

1. YAML frontmatter: `name`, `description`, `model`, `tools`, `readonly`
2. Role statement including "Mode: Observe, analyse and report. Do not modify
   code."
3. Identity block: Name, Purpose, Summary
4. Reading Requirements: directive paths
5. Core Philosophy: one guiding principle
6. When Invoked: Gather Context, Analyse, Prioritise, Report
7. Output Format: Scope, Verdict, Critical Issues, Important Improvements,
   Suggestions, Positive Observations

### Core Review Agents

Default portable roster. Local practices may add editorial, domain-specific,
or browser-facing specialists.

| Agent           | Specialisation                   | Key assessment areas                                                                        |
| --------------- | -------------------------------- | ------------------------------------------------------------------------------------------- |
| `code-reviewer` | Gateway reviewer, always invoked | Correctness, edge cases, security, performance, readability, maintainability, test coverage |
| `test-reviewer` | Test quality and TDD compliance  | Test classification, naming conventions, mock simplicity, test value, TDD evidence          |
| `type-reviewer` | TypeScript type safety           | Type flow tracing, widening detection, assertion usage, and external-boundary validation    |

## Commands: Canonical and Platform Adapters

Canonical commands in `.agent/commands/*.md` contain the substantive workflow
instructions. Platform adapters use the `jc-*` prefix consistently across all
platforms and contain only a pointer to the canonical command.

### Canonical Format (.agent/commands/)

```markdown
# {Command Name}

{Workflow instructions — the substantive content.}
```

### Platform Adapter Formats

Cursor (`.cursor/commands/jc-*.md`) uses `@` file injection. Codex
(`.agents/skills/jc-*/SKILL.md`) uses `name` / `description` frontmatter and a
thin pointer body. Unsupported states belong in the local surface matrix.

### Required Commands

| Command          | File                     | Core logic                                                                                                              |
| ---------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| start-right      | `jc-start-right.md`      | Read and follow `.agent/skills/start-right/SKILL.md`                                                                    |
| gates            | `jc-gates.md`            | Run the repo's documented quality-gate sequence with restart-on-fix discipline                                          |
| commit           | `jc-commit.md`           | Check status, review diff, verify gates, stage selectively, conventional commit format                                  |
| consolidate-docs | `jc-consolidate-docs.md` | Verify documentation is current, check the Practice Box, audit cohesion, check fitness, and consider Practice evolution |
| plan             | `jc-plan.md`             | Create a plan with explicit outcome, impact, value mechanism, acceptance criteria, risks, and non-goals                 |

## Prompts (.agent/prompts/)

Track and handover prompts live here. Prompts may carry YAML frontmatter such
as `prompt_id`, `title`, `type`, `status`, `last_updated`, and `parent_plan`
when the repo uses prompt metadata. Completed prompts move to `archive/`.
**Session grounding** is not a prompt — it is the `start-right` skill,
invoked via `/jc-start-right` and thin adapters.

## Skills (.agent/skills/)

### SKILL.md Format

Canonical skills use YAML frontmatter. Platform adapters in `.cursor/skills/`
and `.agents/skills/` are thin wrappers.

```yaml
---
name: { skill-name }
classification: active | passive
description: { When to invoke this skill — one sentence trigger condition }
---
# {Skill Title}
```

Cursor adapter (`.cursor/skills/{name}/SKILL.md`): `name` / `description`
frontmatter plus `Read and follow @.agent/skills/{name}/SKILL.md`.
Codex adapter (`.agents/skills/{name}/SKILL.md`): the same frontmatter plus a
pointer to the canonical path without `@`.

### Napkin (.agent/skills/napkin/SKILL.md)

The napkin is the capture stage of the learning loop. It is always active.

- **Session start**: read `.agent/memory/distilled.md`, then
  `.agent/memory/napkin.md`
- **Continuous updates**: write whenever you learn something worth recording —
  errors you figure out, user corrections, your own mistakes, tool surprises,
  or approaches that work or fail
- **Rotation**: when the napkin exceeds ~500 lines, follow the distillation
  skill

### Distillation (.agent/skills/distillation/SKILL.md)

Extract high-signal patterns from the napkin into `distilled.md`
(target: <200 lines). Trigger when the napkin grows large or when the user
asks.

## Platform Configuration

Each supported platform has project configuration files. Treat them as tracked
infrastructure, not incidental clutter. Examples include Cursor settings,
Codex reviewer registration, and entry-point files such as `AGENTS.md` and
`.github/copilot-instructions.md`.

If a platform supports machine-local overrides, keep the project-level
contract tracked in git and document the split in the local surface matrix.
Then validate the supported mappings with a portability check rather than
assuming parity by inspection.

## Bootstrap Checklist

After creating all files, validate:

1. `.agent/practice-core/` contains all seven Practice Core files
   (`practice.md`, `practice-lineage.md`, `practice-bootstrap.md`, `README.md`,
   `index.md`, `CHANGELOG.md`, `provenance.yml`) and `incoming/.gitkeep`.
2. `.agent/practice-index.md` exists, its links resolve, and it points at the
   local artefacts that actually exist.
3. `AGENT.md` links to `.agent/practice-core/index.md`.
4. Every file path referenced in AGENT.md, rules, commands, prompts, and
   agents resolves.
5. Every reviewer's reading requirements point to files that exist.
6. `AGENTS.md` links to `AGENT.md`, which links onward to `rules.md` and
   `testing-strategy.md`.
7. The `start-right` skill references all foundation documents.
8. The napkin rule points to a napkin skill that exists.
9. The repo's documented quality gates are wired in `package.json`.
10. If the repo spans multiple agent platforms,
    `.agent/reference/cross-platform-agent-surface-matrix.md` (or equivalent)
    exists and matches reality.
11. A portability validator exists, or wrapper parity has been checked
    manually and documented.
12. If governed docs use the four-field fitness frontmatter, a Practice
    fitness validator exists or equivalent checks are documented.
13. **Cohesion audit**: Practice Core, Practice index, reference docs, and
    broader repo-facing tooling docs are aligned. No stale descriptions, no
    contradictions, no outdated gate counts or hook descriptions.

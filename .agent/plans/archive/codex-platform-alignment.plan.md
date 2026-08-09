# Codex Platform Alignment

## Status

Complete as of 2026-03-08. Architecture mapping, real Codex reviewer
sub-agents, entry-point docs, practice docs, gateway reviewer verification, ADR
extraction, and quality-gate verification are complete.

## Completion evidence

- Discoverability and cohesion were re-audited across `AGENTS.md`,
  `.agent/directives/AGENT.md`, `.agent/practice-index.md`, `.agents/skills/`,
  `.codex/`, and the practice-core docs.
- Gateway reviewer verification found documentation-cohesion issues only:
  stale ADR indexes and one napkin note that still implied reviewer wrappers
  under `.agents/skills/`. Those issues were fixed in the close-out pass; no
  specialist triage remained necessary.
- The stable Codex architecture decision has now graduated into
  `docs/architecture/decision-records/015-codex-adapter-model.md`.
- Quality-gate verification completed on the aligned tree: `pnpm check` and
  `pnpm test:e2e` both passed on 2026-03-08.

## Overview

Align this repo's Codex integration with Codex's actual
customisation model while preserving the repo's
canonical-first practice:

- canonical repo content remains in `.agent/`
- Codex skills remain in `.agents/skills/`
- Codex sub-agents use `.codex/config.toml` and
  project-local adapter files under `.codex/`
- always-on Codex behaviour comes from the entry-point chain
  (`AGENTS.md` and `.agent/directives/AGENT.md`), not from a
  Cursor-style rule-trigger layer

This plan covers the full correction pass: reviewer roles,
skills, command-shaped skills, optional metadata, entry-point
docs, and cleanup of the current partial Codex adapter layer.

## Why this plan exists

The repo now has a useful Codex skill layer, but the recent
review against the Codex documentation surfaced three
important mismatches:

1. reviewer roles such as `editor` and `code-reviewer` are
   currently represented only as `.agents/skills/` wrappers,
   but Codex supports real sub-agents through
   `.codex/config.toml`
2. some docs currently imply that `.agents/skills/` is the
   correct home for reviewer roles, when it should be the
   home for skills
3. the repo's canonical `.agent/rules/` layer is a good
   practice abstraction, but Codex does not have Cursor-style
   rule triggers, so the documentation needs to explain the
   actual Codex activation model clearly

The current `.codex/config.toml` now defines the repo's
reviewer sub-agents and points them at thin adapters under
`.codex/agents/`.

## External references

- `https://developers.openai.com/codex/skills#optional-metadata`
- `https://agentskills.io/specification`
- `https://developers.openai.com/codex/concepts/customization`
- `https://developers.openai.com/codex/multi-agent`

These references were re-checked during implementation on
2026-03-08 before finalising the `.codex/` reviewer layer.
Keep them as the primary sources for future Codex-specific
changes.

## Foundation discipline

Before every phase, re-read and re-commit to:

- `.agent/directives/AGENT.md`
- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`

Before every session, also read:

- `.agent/memory/distilled.md`
- `.agent/memory/napkin.md`

## Target end state

- `.agent/skills/` remains the canonical source of skill
  instructions
- `.agent/sub-agents/templates/` remains the canonical source
  of reviewer/sub-agent instructions
- `.agents/skills/` contains only real Codex skills plus
  optional Codex-only metadata
- `.codex/config.toml` defines the repo's real Codex
  sub-agents
- `.codex/` contains thin, platform-specific Codex adapter
  files for those sub-agents
- repo docs clearly distinguish:
  - Codex skills
  - Codex sub-agents
  - Codex entry-point / always-on behaviour
- no doc claims that reviewer roles are implemented only via
  `.agents/skills/`
- no doc implies Codex has a native `.agents/rules/` trigger
  layer

## Phases

### Phase 1: Codify the Codex architecture

Key principle: correct the mental model first, then change
files.

Intended impact: implementation work follows an explicit
repo-local mapping from canonical artefact type to Codex
surface, rather than continuing to guess from Cursor
patterns.

Acceptance criteria:

- The repo has an explicit mapping for:
  - skills
  - reviewer/sub-agent roles
  - command-shaped workflows
  - always-on guidance
- The mapping is consistent with the external Codex docs.
- The plan records whether reviewer wrappers in
  `.agents/skills/` are temporary migration shims or should be
  removed as redundant.

#### Tasks

1. **Audit the current Codex surface.**
   Description: review `AGENTS.md`, `.agent/directives/AGENT.md`,
   `.agent/practice-core/practice-bootstrap.md`,
   `.agents/skills/`, and `.codex/config.toml` together.
   Impact: the migration starts from a verified inventory of
   what exists and what is mis-modelled.
   Acceptance criteria: every Codex-facing file is listed
   with its current role and its correct target role.

2. **Write the repo-local Codex mapping.**
   Description: capture the canonical-first mapping that this
   repo will use:
   - skills -> `.agent/skills/` + `.agents/skills/`
   - reviewers/sub-agents -> `.agent/sub-agents/templates/`
     - `.codex/`
   - command workflows -> canonical `.agent/commands/` plus
     Codex command-shaped skills unless a better native Codex
     mechanism is adopted
   - always-on guidance -> AGENTS entry-point chain
     Impact: later phases can implement against one clear
     architecture.
     Acceptance criteria: the mapping is explicit, internally
     consistent, and reflected in this plan.

### Phase 2: Implement real Codex sub-agents

Key principle: reviewers are not just skills. Codex supports
sub-agents and the repo should use that capability.

Intended impact: `editor`, `code-reviewer`,
`test-reviewer`, `type-reviewer`, and `pkg-reviewer` become
real Codex roles instead of only promptable skill wrappers.

Acceptance criteria:

- `.codex/config.toml` defines the project's reviewer roles.
- Each reviewer has a thin Codex adapter file under `.codex/`
  that points to the canonical reviewer template.
- The `editor` role is implemented as a first-class Codex
  sub-agent.
- Role-specific settings such as model choice, reasoning
  effort, sandbox policy, and developer instructions are
  deliberate and documented.

#### Tasks

1. **Design the Codex sub-agent adapter shape.**
   Description: decide the local pattern for Codex
   sub-agents: `config.toml` entries plus thin adapter files
   under `.codex/agents/` (or another clearly documented
   `.codex/` location) that reference the canonical reviewer
   templates.
   Impact: the repo keeps the same canonical-first structure
   it already uses for skills and commands.
   Acceptance criteria: the chosen `.codex/` layout is
   documented and compatible with Codex's configuration model.

2. **Implement the reviewer roles in `.codex/config.toml`.**
   Description: add concrete agent-role definitions for
   `code-reviewer`, `editor`, `test-reviewer`,
   `type-reviewer`, and `pkg-reviewer`.
   Impact: Codex can invoke the repo's reviewer roster as
   actual sub-agents.
   Acceptance criteria: all five reviewer roles are defined
   in `.codex/config.toml` and resolve to working
   project-local adapter files.

3. **Tune reviewer role settings.**
   Description: choose appropriate model, reasoning effort,
   sandbox mode, and instruction file for each reviewer, with
   the editor treated as a high-value specialised role.
   Impact: reviewer behaviour is explicit rather than relying
   on defaults or copy-paste assumptions.
   Acceptance criteria: each reviewer role has settings that
   match its job and do not contradict the canonical reviewer
   template.

### Phase 3: Rationalise the Codex skill layer

Key principle: keep skills as skills. Do not use the skill
surface to stand in for unsupported concepts.

Intended impact: `.agents/skills/` becomes a clean Codex
skill layer with consistent metadata and no confusion about
what is a skill versus a sub-agent.

Acceptance criteria:

- Every retained `.agents/skills/` wrapper points to a real
  canonical skill or command source.
- Reviewer wrappers are removed once the sub-agent layer is in
  place.
- Optional `agents/openai.yaml` metadata is used
  intentionally, not sporadically.
- Skills that benefit from explicit invocation policy or
  dependencies declare them.

#### Tasks

1. **Review all Codex skill wrappers for correctness.**
   Description: inspect every directory under
   `.agents/skills/` and classify it as:
   - real skill
   - command-shaped skill
   - temporary migration shim
   - redundant wrapper
     Impact: the skill layer can be cleaned up systematically.
     Acceptance criteria: every current wrapper has a retained,
     changed, or removed decision.

2. **Normalise optional metadata usage.**
   Description: review `agents/openai.yaml` files and add
   fields such as interface metadata, invocation policy, and
   dependencies where they improve Codex behaviour.
   Impact: Codex gets better discovery and more deliberate
   invocation semantics.
   Acceptance criteria: metadata usage follows one explicit
   repo-local pattern rather than ad hoc additions.

3. **Resolve reviewer-wrapper redundancy.**
   Description: once real Codex sub-agents exist, remove
   wrappers like `.agents/skills/editor/` to reduce
   ambiguity.
   Impact: the repo ends with one clear story for reviewer
   invocation.
   Acceptance criteria: reviewer wrappers are gone and the
   docs no longer imply they exist.

### Phase 4: Align rules, entry points, and practice docs

Key principle: the docs must describe the actual platform
model, not a convenient fiction.

Intended impact: fresh agents will understand how Codex
behaviour is activated in this repo without importing Cursor
assumptions.

Acceptance criteria:

- `AGENTS.md` explains Codex entry-point behaviour clearly.
- `.agent/directives/AGENT.md` describes `.codex/` and
  `.agents/` accurately.
- `.agent/practice-core/practice-bootstrap.md` and any other
  affected practice docs describe Codex skills and Codex
  sub-agents separately.
- No doc implies that `.agent/rules/` behaves as a native
  Codex trigger layer.

#### Tasks

1. **Update the entry-point chain.**
   Description: revise `AGENTS.md` and
   `.agent/directives/AGENT.md` so they correctly describe
   Codex skills, Codex sub-agents, and always-on guidance.
   Impact: a fresh Codex session starts with the right mental
   model.
   Acceptance criteria: the repo entry points are accurate
   and do not rely on Cursor-specific terminology.

2. **Update practice-core and index documents.**
   Description: revise `.agent/practice-core/` and
   `.agent/practice-index.md` where needed so the documented
   adapter model matches the implemented one.
   Impact: the portable practice and the local repo docs stop
   drifting apart.
   Acceptance criteria: practice docs, index docs, and repo
   structure all tell the same story.

3. **Update invocation guidance.**
   Description: revise rules or reviewer-guidance docs such as
   `.agent/rules/invoke-reviewers.md` where needed so they
   refer to Codex sub-agents in the correct way.
   Impact: reviewer invocation instructions remain useful in
   both Cursor and Codex.
   Acceptance criteria: reviewer guidance is platform-aware
   without duplicating policy.

### Phase 5: Validation, cleanup, and cutover

Key principle: finish with one coherent system, not a
half-migrated hybrid.

Intended impact: the repo ends with a validated Codex setup,
clean docs, and no stale platform assumptions.

Acceptance criteria:

- All obsolete or misleading Codex adapter files are removed
  or clearly marked as compatibility shims.
- A fresh agent can identify:
  - what is a Codex skill
  - what is a Codex sub-agent
  - how always-on guidance is applied
- Reviewer and skill discovery are both evidence-backed.
- Quality gates pass.

#### Tasks

1. **Run a discoverability and cohesion audit.**
   Description: verify that a fresh agent can discover the
   correct Codex surfaces from `AGENTS.md`,
   `.agent/directives/AGENT.md`, `.agent/practice-index.md`,
   `.agents/skills/`, and `.codex/`.
   Impact: the repo's Codex support is usable without prior
   context.
   Acceptance criteria: no stale references, contradictions,
   or missing links remain.

2. **Run reviewer verification.**
   Description: once the real Codex sub-agent layer exists,
   use the gateway reviewer flow to inspect the new setup and
   triage to specialists if needed.
   Impact: the migration is checked using the repo's own
   review practice.
   Acceptance criteria: reviewer findings are resolved or
   explicitly tracked.

3. **Run the full quality gates.**
   Description: run `pnpm check` and `pnpm test:e2e`, fixing
   issues with restart-on-fix discipline.
   Impact: the Codex platform alignment does not degrade the
   repo.
   Acceptance criteria: both commands pass on the final tree.

## Key files

| File                                         | Purpose                                                            |
| -------------------------------------------- | ------------------------------------------------------------------ |
| `AGENTS.md`                                  | Codex/agent entry point                                            |
| `.codex/config.toml`                         | Project-level Codex configuration, including multi-agent roles     |
| `.codex/`                                    | Codex-specific project adapters                                    |
| `.agents/skills/`                            | Codex skill wrappers and optional metadata                         |
| `.agent/skills/`                             | Canonical skills                                                   |
| `.agent/sub-agents/templates/`               | Canonical reviewer/sub-agent templates                             |
| `.agent/rules/`                              | Canonical always-applied rule documents                            |
| `.agent/directives/AGENT.md`                 | Canonical operational entry point                                  |
| `.agent/practice-core/practice-bootstrap.md` | Portable practice adapter model                                    |
| `.agent/practice-index.md`                   | Local index of practice artefacts                                  |
| `.agent/rules/invoke-reviewers.md`           | Reviewer invocation guidance                                       |
| `.agent/skills/author-skills/SKILL.md`       | Canonical guidance for maintaining the shared adapter pattern      |
| `.agents/skills/package-deps-up-to-date/`    | Existing richer Codex skill example and compatibility-shim pattern |

## Related

- [Roadmap](../roadmap.md) — overall work-stream status
- [Visual Regression Harness](visual-regression-harness.plan.md) — example of a completed technical plan with a separate icebox for later enhancements
- [Graph Metaplan](graph-metaplan.plan.md) — example of a current standalone plan with preserved draft inputs split out

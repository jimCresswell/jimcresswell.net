# .agent/ — The Practice Infrastructure

> **Human developers**: this directory is AI agent infrastructure. See
> [HUMANS.md](HUMANS.md) for where to go instead.

This directory holds the canonical infrastructure for the agentic engineering
practice that governs this personal-sites monorepo (first site: `jimcresswell.net`). The Practice lineage was transplanted
from the Oak Open Curriculum Ecosystem on 2026-09-12; the transplant manifest
and its owner rulings live at
[`docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`](../docs/explorations/2026-09-12-oce-practice-lineage-transplant.md).

**Practice, not product.** Everything under `.agent/` is how this repository is
built and governed. The product — the site, the CV, the personal knowledge graph
— lives in [`jcdotnet/`](../jcdotnet/). The Practice tooling lives in
[`agent-tools/`](../agent-tools/README.md) and the `@engraph/*` packages under
[`tooling/`](../tooling/).

## Structural model

`.agent/` is the **canonical layer** in a three-layer architecture:

```text
                    .agent/
                    (canonical content — rules, skills, sub-agents)
                      ↑                        ↑
        referenced by |                        | pointed to, via
                      |                        | directives/AGENT.md
.claude/ .cursor/                   CLAUDE.md, AGENTS.md
.codex/ .agents/ .github/
(thin platform adapters —           (entry points platforms
 generated, one-line pointers)       read or can use)
```

Adapters and entry points are independent platform-facing surfaces: each
references `.agent/` directly, and no entry point consumes an adapter
directory. A rule in `.claude/rules/` or `.cursor/rules/` is a one-line pointer
back to the canonical version in `.agent/rules/`. Edit the canonical version;
adapters are regenerated with `pnpm portability:fix` and checked with
`pnpm portability:check` and `pnpm subagents:check`.

## How information flows

### Rules: directives → rules → platform adapters

`directives/` holds the authoritative source documents — principles, testing
strategy, editorial strategy and guidance, privacy, secops. `rules/` atomises
those directives into individual canonical rules. Platform adapters point back
to `rules/`.

### Plans: sketch → ratified → superseded / archived

Plans are plan nodes under `plans/` — `strategic/`, `delivery/`, `runbooks/` —
governed by [`plans/plan-node-schema.md`](plans/plan-node-schema.md). Every
plan is born `status: sketch` and governs no work until it carries an owner
ratification stamp. The pre-schema plans (the lifecycle lanes and the roadmap) are conserved as
records in [`plans-legacy-2026-09/`](plans-legacy-2026-09/DISPOSITIONS.md), each
with its disposition; live intent was re-authored into the strategy layer and
nodes at the plan-node migration (2026-09-13).

### Knowledge: napkin → distilled → pending-graduations → permanent homes

Session observations are captured in
[`memory/active/napkin.md`](memory/active/napkin.md). Distillation extracts
high-signal learnings into
[`memory/active/distilled.md`](memory/active/distilled.md). Learned doctrine
awaiting a home queues in
[`memory/operational/pending-graduations.md`](memory/operational/pending-graduations.md)
and graduates into rules, PDRs, ADRs, directives or documentation through the
consolidation workflow. Rotation of the napkin is an archive step that follows
processing; it is never a goal in itself.

## Directory map

### Core

| Directory                                | Purpose                                                                                                                                                                    |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `directives/`                            | Authoritative rules and the operational entry point ([AGENT.md](directives/AGENT.md)); editorial strategy and guidance for content that represents Jim; privacy and secops |
| `rules/`                                 | Individual canonical rules referenced by platform adapters                                                                                                                 |
| `practice-core/`                         | Portable Practice Core: the trinity files, `provenance.yml`, `protocol.json`, and `decision-records/` (PDRs)                                                               |
| [`practice-index.md`](practice-index.md) | Bridge from the portable Practice Core to this repo's local artefacts                                                                                                      |

### Planning and execution

| Directory  | Purpose                                                                                                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `plans/`   | Plan nodes (`strategic/`, `delivery/`, `runbooks/`, `templates/`, `plan-node-schema.md`, `impact-areas.md`) plus the pre-transplant plan record                                                           |
| `prompts/` | Session continuation and track handoff prompts                                                                                                                                                            |
| `skills/`  | Canonical skills — the user-and-model-invokable workflow surface. Each skill lives at `skills/<name>/SKILL-CANONICAL.md` (OCE lineage) or `skills/<name>/SKILL.md` (local lineage, pending normalisation) |

### Knowledge and learning

| Directory      | Purpose                                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `memory/`      | Three-mode persistent content — see [`memory/README.md`](memory/README.md): `active/` (learning loop), `operational/` (continuity and registers), `executive/` (contracts) |
| `experience/`  | Qualitative records of what work was like across sessions                                                                                                                  |
| `research/`    | Technical research notes                                                                                                                                                   |
| `evaluations/` | Skill and experiment evaluation logs                                                                                                                                       |

### Agent infrastructure

| Directory                                | Purpose                                                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `sub-agents/`                            | Expert sub-agent templates and standards                                                             |
| `roles/`                                 | Named role definitions                                                                               |
| `collaboration/`                         | Rapid-comms channels for multi-seat sessions                                                         |
| `state/`                                 | Machine-local coordination state (git-ignored) and tracked decision provenance; see its `.gitignore` |
| `hooks/`                                 | Hook policy for platform harnesses                                                                   |
| `setup/`, `claude-harness-integrations/` | Cloud-session preflight and setup scripts                                                            |

### Reference

| Directory           | Purpose                                                                           |
| ------------------- | --------------------------------------------------------------------------------- |
| `reference/`        | Supporting reference material, including the private-editorial-workspace contract |
| `reference-local/`  | Git-ignored private material (the editorial private repository)                   |
| `operator-local/`   | Git-ignored operator profile; the two stubs declare the contract                  |
| `practice-context/` | Local exchange context (incoming / outgoing)                                      |

## Entry point and reading order

Start with [directives/AGENT.md](directives/AGENT.md). The grounding sequence is:

1. [AGENT.md](directives/AGENT.md) — operational entry point
2. [principles.md](directives/principles.md) — authoritative rules
3. [testing-strategy.md](directives/testing-strategy.md) — TDD at all levels
4. [`memory/active/distilled.md`](memory/active/distilled.md) and
   [`memory/active/napkin.md`](memory/active/napkin.md) — learned context
5. [`memory/operational/repo-continuity.md`](memory/operational/repo-continuity.md)
   and [`prompts/session-continuation.prompt.md`](prompts/session-continuation.prompt.md)
   — where we are and what is next
6. For content work: [editorial-strategy.md](directives/editorial-strategy.md)
   and [editorial-guidance.md](directives/editorial-guidance.md)

For the full artefact index, see [practice-index.md](practice-index.md).

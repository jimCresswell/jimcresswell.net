# .agent/ — The Practice Infrastructure

> **Human developers**: this directory is AI agent infrastructure. See
> [HUMANS.md](HUMANS.md) for where to go instead.

This directory holds the canonical infrastructure for the agentic engineering
practice that governs this repository. One Practice runs in two estates (this
repository and its sibling, OCE): its general layer is the same text in both,
and what binds to this repository is in §This host at the end of this file.

**Practice, not product.** Everything under `.agent/` is how this repository is
built and governed, never the product; §This host names where the product and
the Practice tooling live.

## Structural model

`.agent/` is the **canonical layer** in a three-layer architecture:

```text
                    .agent/
                    (canonical content — rules, skills, sub-agents)
                      ↑                        ↑
        referenced by |                        | pointed to, via
                      |                        | directives/AGENT.md
.claude/ .cursor/ .codex/ .agents/  CLAUDE.md, AGENTS.md and the
and the other platform directories  other entry files the host's
the host renders                    platforms read or can use
(thin platform adapters —
 generated, one-line pointers)
```

Adapters and entry points are independent platform-facing surfaces: each
references `.agent/` directly, and no entry point consumes an adapter
directory. A rule in `.claude/rules/` or `.cursor/rules/` is a one-line pointer
back to the canonical version in `.agent/rules/`. Edit the canonical version;
adapters are regenerated with `pnpm portability:fix` (`pnpm skills:generate`
for a skill) and checked with `pnpm portability:check`, `pnpm subagents:check`
and `pnpm skills:check`. The platforms a host renders, and what each has
wired, are in
[`memory/executive/cross-platform-agent-surface-matrix.md`](memory/executive/cross-platform-agent-surface-matrix.md).

## How information flows

### Rules: directives → rules → platform adapters

`directives/` holds the authoritative source documents — principles, the
testing and validation strategies, the collaboration and continuity
directives, and the host's own. `rules/` atomises those directives into
individual canonical rules. Platform adapters point back to `rules/`.

### Plans: sketch → ratified → superseded / archived

Plans are plan nodes under `plans/` — `strategic/`, `delivery/`, `runbooks/` —
governed by [`plans/plan-node-schema.md`](plans/plan-node-schema.md). Every
plan is born `status: sketch` and governs no work until it carries an owner
ratification stamp. The pre-schema plans are conserved as records, each with
its disposition, where §This host says.

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

The directories every estate carries. The ones only this repository carries
are in §This host.

### Core

| Directory                                | Purpose                                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `directives/`                            | Authoritative source documents and the operational entry point ([AGENT.md](directives/AGENT.md))             |
| `rules/`                                 | Individual canonical rules referenced by platform adapters                                                   |
| `practice-core/`                         | Portable Practice Core: the trinity files, `provenance.yml`, `protocol.json`, `schemas/`, `decision-records/` (PDRs) and the `incoming/` exchange box |
| [`practice-index.md`](practice-index.md) | Bridge from the portable Practice Core to this repository's local artefacts                                  |

### Planning and execution

| Directory  | Purpose                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `plans/`   | Plan nodes (`strategic/`, `delivery/`, `runbooks/`, `templates/`, `plan-node-schema.md`, `impact-areas.md`)                                     |
| `prompts/` | Session continuation and handoff prompts                                                                                                        |
| `skills/`  | Canonical skills — the user-and-model-invokable workflow surface. Each skill lives at `skills/<name>/SKILL-CANONICAL.md`; adapters are generated |

### Knowledge and learning

| Directory      | Purpose                                                                                                                                                                    |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `memory/`      | Three-mode persistent content — see [`memory/README.md`](memory/README.md): `active/` (learning loop), `operational/` (continuity and registers), `executive/` (contracts) |
| `experience/`  | Qualitative records of what work was like across sessions                                                                                                                  |
| `research/`    | Research notes and analysis                                                                                                                                                |
| `evaluations/` | Skill and experiment evaluation logs                                                                                                                                       |
| `reports/`     | Promoted audits, syntheses and measurement reports                                                                                                                         |

### Agent infrastructure

| Directory                                | Purpose                                                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `sub-agents/`                            | Expert sub-agent templates, components and standards                                                 |
| `roles/`                                 | Named role definitions                                                                               |
| `collaboration/`                         | Rapid-comms channels for multi-seat sessions                                                         |
| `state/`                                 | Machine-local coordination state (git-ignored) and tracked decision provenance; see its `.gitignore` |
| `hooks/`                                 | Hook policy for platform harnesses                                                                   |
| `family/`                                | The family layer: the tooling family's declared Practice operations (`typescript/practice-operations.json`, its hook copies) and `host.json`, the host's placeholder values |
| `setup/`, `claude-harness-integrations/` | Cloud-session preflight and setup scripts                                                            |

### Reference

| Directory          | Purpose                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `reference/`       | The Practice's reference documents, read on demand; its README is the index                               |
| `reference-local/` | Git-ignored local material, never source-controlled                                                       |
| `operator-local/`  | Git-ignored and empty by design: the operator profile lives in the home directory (PDR-141); its README is the pointer |

## Entry point and reading order

Start with [directives/AGENT.md](directives/AGENT.md). The grounding sequence is:

1. [AGENT.md](directives/AGENT.md) — operational entry point
2. [principles.md](directives/principles.md) — authoritative rules
3. [testing-strategy.md](directives/testing-strategy.md) — TDD at all levels
4. [`memory/active/distilled.md`](memory/active/distilled.md) and
   [`memory/active/napkin.md`](memory/active/napkin.md) — learned context
5. [`memory/operational/repo-continuity.md`](memory/operational/repo-continuity.md)
   — where we are and what is next
6. The host's own directives for its product work (§This host)

For the full artefact index, see [practice-index.md](practice-index.md).

## This host

The facts above that bind to this repository (jimcresswell.net); the sibling
estate's copy of this file carries its own section here, and everything above
it is the same text in both.

- **Product and tooling.** The product — the site, the CV, the personal
  knowledge graph — lives in [`jcdotnet/`](../jcdotnet/). The Practice tooling
  lives in [`agent-tools/`](../agent-tools/README.md) and the `@engraph/*`
  packages under [`tooling/`](../tooling/).
- **Lineage.** The Practice lineage here was transplanted from OCE on
  2026-09-12; the transplant manifest and its owner rulings live at
  [`docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`](../docs/explorations/2026-09-12-oce-practice-lineage-transplant.md).
- **Platforms rendered.** `.claude/`, `.cursor/`, `.codex/`, `.gemini/`,
  `.agents/` and `.github/`; the entry files are `CLAUDE.md`, `AGENTS.md`,
  `GEMINI.md`, `.github/copilot-instructions.md` and `skills.md`.
- **Host directives.** Editorial strategy and guidance for content that
  represents Jim ([editorial-strategy.md](directives/editorial-strategy.md),
  [editorial-guidance.md](directives/editorial-guidance.md)), privacy and
  secops; reading-order step 6 is the editorial pair, for content work.
- **Pre-schema plans.** Conserved as records in
  [`plans-legacy-2026-09/`](plans-legacy-2026-09/DISPOSITIONS.md), each with
  its disposition; live intent was re-authored into the strategy layer
  ([`plans/strategy/`](plans/strategy/README.md)) and nodes at the plan-node
  migration (2026-09-13).
- **Directories only this repository carries.**

| Directory                | Purpose                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------- |
| `plans/strategy/`        | The strategy index and its streams, which the strategic nodes serve                                   |
| `plans-legacy-2026-09/`  | The pre-schema plan record, with dispositions                                                         |
| `practice-context/`      | Optional exchange adjunct outside the Core (ADR-018): `incoming/` and `outgoing/` support notes       |
| `private/`               | Git-ignored owner-private material, never source-controlled                                           |

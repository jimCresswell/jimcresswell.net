# Codex Adoption Report

This repo has gone further on first-class Codex support than the earlier
Practice-hosting repos. That is useful to share, but it is too platform-specific
to belong in the portable Core.

## What this repo achieved

The Codex model in this repo is fully wired across the main surfaces:

- `AGENTS.md` as the Codex entry point
- canonical skills, commands, rules, and reviewer prompts in `.agent/`
- thin Codex skill and command adapters in `.agents/skills/`
- real Codex reviewer sub-agents registered in `.codex/config.toml`
- thin per-reviewer adapters in `.codex/agents/`
- durable architectural record in
  `docs/architecture/decision-records/015-codex-adapter-model.md`

The important outcome is not just "Codex works". It is that Codex works without
becoming a second source of truth.

## Why this is outgoing context, not Core

The Core should teach canonical-first structure and portability. It should not
freeze one platform's exact wiring model as if every receiving repo must copy
it.

This report exists so a receiving repo can learn from a completed Codex
adoption without turning those details into universal doctrine.

## Recommended adoption sequence

1. Establish the canonical layer first in `.agent/`.
   Do not start by creating Codex wrappers.
2. Put repo-local skills and `jc-*` command workflows in `.agents/skills/` as
   thin adapters only.
3. Register reviewer sub-agents in `.codex/config.toml`.
4. Create one thin `.codex/agents/*.toml` adapter per reviewer.
5. Point each reviewer adapter back to the canonical prompt in
   `.agent/sub-agents/templates/`.
6. Document the supported and unsupported surfaces in
   `.agent/reference/cross-platform-agent-surface-matrix.md`.
7. Make `AGENTS.md` and `.codex/README.md` describe the same model.
8. Add or update the architectural record once the model is stable.

## Validation checklist

- `.agent/` remains the canonical behavioural source
- `.agents/skills/` contains skills and command workflows, not reviewer roles
- `.codex/config.toml` and `.codex/agents/` describe the reviewer roster
- reviewer prompts remain canonical in `.agent/sub-agents/templates/`
- no separate `.agents/rules/` layer appears
- `.agent/reference/cross-platform-agent-surface-matrix.md` matches the
  actual wrappers and project config
- `AGENTS.md`, `.agent/directives/AGENT.md`, `.agent/practice-index.md`,
  `.codex/README.md`, and ADR-015 all tell the same story
- `pnpm portability:check` passes after any Codex surface change

## Failure modes this repo hit

- treating reviewer roles as if they were skills
- letting `AGENTS.md` drift away from the actual repo structure
- duplicating behavioural truth in platform wrappers instead of pointing back
  to canonical sources
- describing Codex as if it had a Cursor-like rules layer when it does not

## What a receiving repo should copy carefully

Copy the architecture, not the incidental filenames alone:

- canonical-first ownership
- thin adapters
- reviewer registration through `.codex/`
- one durable record of the model once it settles

Do not copy the exact reviewer roster or every local wrapper unless the
receiving repo genuinely needs them.

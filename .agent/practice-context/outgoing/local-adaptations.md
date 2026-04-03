# Local Adaptations

These are useful local shapes, but they should not be copied blindly.

## Documentation as infrastructure

This repo treats plans, ADRs, READMEs, directives, and Practice files as
fundamental infrastructure. Consolidation work here is not tidy-up work; it is
part of how the repo stays operable.

## Codex model

This repo uses a canonical-first model:

- `.agent/` for canonical rules, commands, skills, and reviewer templates
- `.agents/skills/` for thin Codex skill and command adapters
- `.codex/` for real Codex reviewer sub-agents

That split is portable in principle but still platform-shaped in practice.
Another repo should adopt it only if its tooling model matches.

## Explicit surface contract

This repo writes supported and unsupported platform mappings down explicitly in
`.agent/reference/cross-platform-agent-surface-matrix.md` instead of letting
missing files imply intent.

That is useful locally because the repo spans Cursor, Codex, and GitHub
Copilot entry instructions, but it is still a local support layer rather than
portable Core doctrine.

## Validation split

This repo uses two distinct validators:

- `pnpm portability:check` is blocking and belongs in `pnpm check`
- `pnpm practice:fitness:informational` is advisory unless a task is
  intentionally enforcing doc limits

That split fits a repo where agent-surface drift is a hard defect but document
growth still needs human judgement.

## Editorial review layer

This repo has strong public-writing requirements around Jim Cresswell's voice,
register, and identity claims. That editorial layer is real and important here,
but many repos will not need an equivalent reviewer system.

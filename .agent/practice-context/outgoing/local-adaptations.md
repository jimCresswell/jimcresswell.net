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

## Editorial review layer

This repo has strong public-writing requirements around Jim Cresswell's voice,
register, and identity claims. That editorial layer is real and important here,
but many repos will not need an equivalent reviewer system.

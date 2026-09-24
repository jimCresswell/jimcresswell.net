---
boundary: B4-Engineering-Operations
doc_role: index
authority: engineering-navigation
status: active
last_reviewed: 2026-09-12
---

# Engineering Documentation

Developer-facing documentation for this repository: how the monorepo builds,
how work flows from branch to merge, and the testing recipes the directives
point at. Agent-facing doctrine lives under `.agent/directives/`; agent
reference material under `.agent/reference/`.

## Contents

- [Root README](../../README.md) — the workspace layout, getting started and key commands
- [Working with this Repo for Devs](./working-with-this-repo-for-devs.md) — the practical guide: how you direct the work, what the agents do around you, and what keeps the quality honest
- [Developer Experience](./developer-experience.md) — the session surfaces and feedback loops a developer works through, including the statusline
- [Build System](./build-system.md) — Turborepo tasks, caching, the gate aggregate and what pre-commit, pre-push and CI each run
- [Workflow](./workflow.md) — the development lifecycle from branch creation to merge, and the skills that enact each phase
- [Testing Patterns](./testing-patterns.md) — reusable test recipes referenced by the testing strategy
- [Testing TDD Recipes](./testing-tdd-recipes.md) — worked Red/Green/Refactor examples and common TDD violations

## Related

- [Testing Strategy](../../.agent/directives/testing-strategy.md) and [TDD as Design](../../.agent/directives/tdd-as-design.md) — the doctrine the recipes serve
- [Gates skill](../../.agent/skills/change-custody/gates/SKILL-CANONICAL.md) — the canonical gate list
- [Tooling](../../.agent/reference/tooling.md), [Pre-Merge Divergence Analysis](../../.agent/reference/pre-merge-analysis.md) and [Shell and tooling gotchas](../../.agent/reference/shell-and-tooling-gotchas.md) — agent reference material developers also use
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — the development process

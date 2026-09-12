# Copilot Instructions

Read `.agent/directives/AGENT.md`, `.agent/directives/principles.md`, and
`.agent/directives/testing-strategy.md` to understand the project, the agent's
role, and the repo's live tooling surfaces.

If you are touching agent tooling or platform adapters, also read
`.agent/directives/metacognition.md`,
`.agent/practice-index.md`,
`.agent/memory/executive/cross-platform-agent-surface-matrix.md`,
`.agent/practice-core/practice.md`,
`.agent/practice-core/practice-bootstrap.md`,
and `.agent/practice-core/practice-verification.md`.

Canonical gate names for this repo are `pnpm check`, `pnpm fix`,
`pnpm portability:check`, `pnpm subagents:check`, `pnpm skills:check`,
`pnpm check:docs`, and `pnpm test:e2e`.

## Code review

Review against the pull request description's `## Scope` section. A finding whose remedy
falls outside the declared scope is reported as an out-of-scope observation with no
proposed change; do not propose additions the scope does not ask for. On a prose- or
records-class changeset, and on the prose findings of a mixed one, grade against the
declared intake (artefact class, verification point, bar) rather than against
completeness; code findings keep the code review's own standard.

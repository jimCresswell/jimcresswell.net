# ADR-015: Codex adapter model for skills, reviewers, and always-on guidance

## Status

Accepted

## Date

2026-03-08

## Context

This repo uses a canonical-first practice model: substantive instructions live in
`.agent/`, while platform-specific files stay thin.

The initial Codex integration blurred three different Codex surfaces:

- skills and command-shaped workflows
- reviewer sub-agents
- always-on behaviour

That produced two concrete problems:

- reviewer roles such as `code-reviewer` and `editor` were modelled as
  `.agents/skills/` wrappers instead of real Codex sub-agents
- some docs implied a Cursor-like `.agents/rules/` trigger layer even though
  Codex uses the entry-point chain and project-agent configuration differently

The repo needed one stable local architecture for Codex so future changes do not
re-open that ambiguity.

## Decision

Codex integration in this repo uses the following split.

### 1. Canonical content stays in `.agent/`

- canonical skills live in `.agent/skills/`
- canonical commands live in `.agent/commands/`
- canonical reviewer prompts live in `.agent/sub-agents/templates/`
- canonical rules live in `.agent/rules/` and `.agent/directives/`

`.agent/` remains the single source of truth.

### 2. Codex skills and command wrappers live in `.agents/skills/`

`.agents/skills/` is reserved for thin Codex adapters for:

- repo-local skills
- command-shaped workflows such as `jc-*`
- optional Codex-local metadata such as `agents/openai.yaml`

These adapters must point back to canonical content and must not duplicate the
substantive instructions.

### 3. Codex reviewer roles live in `.codex/`

Reviewer roles are not modelled as skills.

- `.codex/config.toml` registers the project reviewer roster
- `.codex/agents/*.toml` holds thin per-reviewer configuration
- each reviewer adapter points back to the canonical prompt in
  `.agent/sub-agents/templates/`

For this repo, the Codex reviewer roster includes `code-reviewer`, `editor`,
`test-reviewer`, `type-reviewer`, and `pkg-reviewer`.

### 4. Always-on Codex behaviour comes from the entry-point chain

This repo does not define a parallel `.agents/rules/` layer.

Always-on Codex behaviour comes from:

- `AGENTS.md`
- `.agent/directives/AGENT.md`
- the canonical directives and rules under `.agent/`

When a canonical rule activates a skill or command, Codex should surface that
through the corresponding `.agents/skills/` wrapper. Reviewer invocation should
use the `.codex/` project-agent configuration.

### 5. Codex adapters stay thin

Codex-specific files may declare platform concerns such as:

- descriptions
- approval and sandbox policy
- reasoning effort
- lightweight invocation metadata

They must not become a second source of behavioural truth.

## Consequences

- Reviewer discovery is clearer: skills are in `.agents/skills/`, reviewer
  roles are in `.codex/`
- The canonical reviewer prompts remain reusable across platforms
- Fresh agents can discover the Codex model from `AGENTS.md`,
  `.agent/directives/AGENT.md`, `.agent/practice-index.md`, and `.codex/`
- Future Codex changes have one explicit architectural baseline rather than an
  inferred Cursor analogue
- The repo must maintain two Codex-facing surfaces (`.agents/skills/` and
  `.codex/`), but each now has one responsibility

## Related

- [ADR-012](012-agent-memory-pipeline.md) — canonical knowledge should graduate
  into discoverable permanent docs
- [`AGENTS.md`](../../../AGENTS.md) — repo entry point for Codex behaviour
- [`.agent/directives/AGENT.md`](../../../.agent/directives/AGENT.md) —
  operational description of the current reviewer and skill surfaces

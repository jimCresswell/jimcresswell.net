# .agent

Agent-facing documentation and planning for this project. Start with [directives/AGENT.md](directives/AGENT.md) — it is the entry point for all AI agents.

## Directory Structure

```text
.agent/
├── directives/       ← START HERE
│   ├── AGENT.md              # Entry point — project context, commands, structure
│   ├── rules.md              # Core development rules (TDD, type safety, code quality)
│   ├── testing-strategy.md   # Testing philosophy, test types, naming conventions
│   └── editorial-guidance.md  # Jim's editorial voice and identity
│
├── plans/            ← Work planning
│   ├── current/              # Active plans
│   ├── complete/             # Plans that have been fully executed
│   ├── icebox/               # Non-current future work
│   ├── research/             # Investigations and current-state audits
│   ├── roadmap.md            # Repo-level roadmap
│   └── graph-metaplan.plan.md # Completed graph reset record
│
├── practice-core/    ← Portable Practice Core, provenance, and incoming practice box
├── practice-context/ ← Optional repo-local exchange context
│   ├── incoming/            # Transient received support material
│   └── outgoing/            # Sender-maintained support material
│
├── reference/        ← Stable local reference material
│   └── cross-platform-agent-surface-matrix.md  # Supported / unsupported platform mappings
│
├── skills/           ← Canonical skills (see practice-index.md)
│   ├── start-right/          # Session grounding (core)
│   ├── project-spec-creation/  # Generative UI handoff specs (core)
│   └── …
│
├── prompts/          ← Handover and track prompts (not session entry — use skills/start-right)
│   └── personal-knowledge-graph-*.prompt.md
│
├── temp/             ← Gitignored working files (LinkedIn export, old CV website, etc.)
│
├── research/         ← Technical research and investigation notes
│   └── cloudflare-pdf-render-service.md
│
└── v0/               ← Original project specification (historical)
    └── original-spec/        # Design brief, component specs, theme, v0 prompt
```

## Navigation Guide

### Starting a session

1. Read [directives/AGENT.md](directives/AGENT.md) — project context, stack, commands, structure
2. Read [directives/rules.md](directives/rules.md) — the authoritative rules; these must be followed at all times
3. Read [directives/testing-strategy.md](directives/testing-strategy.md) — TDD approach and test type conventions
4. If touching agent tooling or platform adapters, read
   [reference/cross-platform-agent-surface-matrix.md](reference/cross-platform-agent-surface-matrix.md)

### Understanding what needs doing

Active plans describe work that is planned or in progress:

| Plan                                                                                                                            | Status      | Description                                                  |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------------------------------------ |
| [cv-editorial-improvements.plan.md](plans/current/cv-editorial-improvements.plan.md)                                            | In Progress | Parent editorial plan and context map                        |
| [personal-knowledge-graph-roadmap.plan.md](plans/current/personal-knowledge-graph-roadmap.plan.md)                              | In Progress | Adopted graph roadmap — both tracks required, Track A first  |
| [personal-knowledge-graph-execution.plan.md](plans/current/personal-knowledge-graph-execution.plan.md)                          | In Progress | Track A execution plan for graph expression work             |
| [personal-knowledge-graph-source-of-truth-design.plan.md](plans/active/personal-knowledge-graph-source-of-truth-design.plan.md) | Active      | Primary Track B design plan for graph-backed source of truth |
| [linkedin-update.plan.md](plans/current/linkedin-update.plan.md)                                                                | Subsumed    | Downstream LinkedIn reference plan                           |

Completed plans are in [plans/complete/](plans/complete/) for reference.

### Project documentation (outside .agent)

For architecture decisions, user stories, and requirements, see [docs/](../docs/):

- [docs/architecture/](../docs/architecture/) — System architecture and ADRs
- [docs/project/user-stories.md](../docs/project/user-stories.md) — User stories
- [docs/project/requirements.md](../docs/project/requirements.md) — Non-functional requirements

## Agent tooling checks

- `pnpm portability:check` — validate thin-wrapper parity and the local
  cross-platform surface contract
- `pnpm practice:fitness:informational` — advisory fitness report for Practice
  and directive docs using the four-field fitness frontmatter

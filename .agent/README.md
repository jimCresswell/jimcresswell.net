# .agent

Agent-facing documentation and planning for this project. Start with [directives/AGENT.md](directives/AGENT.md) — it is the entry point for all AI agents.

## Directory Structure

```text
.agent/
├── directives/       ← START HERE
│   ├── AGENT.md              # Entry point — project context, commands, structure
│   ├── principles.md         # Core development rules (TDD, type safety, code quality)
│   ├── testing-strategy.md   # Testing philosophy, test types, naming conventions
│   ├── editorial-strategy.md  # Audience, attention, structure, and evidence
│   └── editorial-guidance.md  # Jim's editorial voice and identity
│
├── plans/            ← Work planning
│   ├── active/               # Single primary execution plan
│   ├── current/              # Live but non-primary executable plans
│   ├── future/               # Strategic later-intent plans with promotion triggers
│   ├── archive/              # Completed or superseded historical plans
│   ├── research/             # Investigations and current-state audits
│   ├── roadmap.md            # Repo-level roadmap
│   └── README.md             # Lane semantics and move rules
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
2. Read [directives/principles.md](directives/principles.md) — the authoritative rules; these must be followed at all times
3. Read [directives/testing-strategy.md](directives/testing-strategy.md) — TDD approach and test type conventions
4. If touching agent tooling or platform adapters, read
   [reference/cross-platform-agent-surface-matrix.md](reference/cross-platform-agent-surface-matrix.md)
5. If writing or reviewing content, read
   [directives/editorial-strategy.md](directives/editorial-strategy.md) and
   [directives/editorial-guidance.md](directives/editorial-guidance.md)

### Understanding what needs doing

The primary plan lives in `plans/active/`; related live work stays in `plans/current/`:

| Plan                                                                                                                            | Status       | Description                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------- |
| [personal-knowledge-graph-source-of-truth-design.plan.md](plans/active/personal-knowledge-graph-source-of-truth-design.plan.md) | Active       | Current Track B design plan and primary graph workstream                        |
| [cv-editorial-improvements.plan.md](plans/current/cv-editorial-improvements.plan.md)                                            | In Progress  | Parent editorial plan and context map                                           |
| [personal-knowledge-graph-roadmap.plan.md](plans/current/personal-knowledge-graph-roadmap.plan.md)                              | In Progress  | Adopted graph roadmap — both tracks required, Track A first                     |
| [personal-knowledge-graph-execution.plan.md](plans/current/personal-knowledge-graph-execution.plan.md)                          | Complete     | Track A execution plan for graph expression work                                |
| [workspace-architecture-roadmap.plan.md](plans/current/workspace-architecture-roadmap.plan.md)                                  | In Progress  | Accepted incremental workspace family; Visual extraction gate is the next slice |
| [visual-regression-workspace.plan.md](plans/current/visual-regression-workspace.plan.md)                                        | In Progress  | First workspace extraction attempt; landed configuration seam remains green     |
| [practice-validation-workspace.plan.md](plans/current/practice-validation-workspace.plan.md)                                    | Pending      | Independent Practice validator extraction candidate                             |
| [professional-profile-graph-workspace.plan.md](plans/current/professional-profile-graph-workspace.plan.md)                      | Pending      | Stable Jim-free professional-profile graph candidate                            |
| [cv-workspace.plan.md](plans/current/cv-workspace.plan.md)                                                                      | Pending      | Synthetic Jim-free CV model and renderer candidate                              |
| [jim-profile-workspace.plan.md](plans/current/jim-profile-workspace.plan.md)                                                    | Pending      | Track B-gated configured public-profile adoption                                |
| [web-page-workspace-and-boundary-enforcement.plan.md](plans/current/web-page-workspace-and-boundary-enforcement.plan.md)        | Pending      | Conditional generic primitives and final boundary audit                         |
| [optional-app-relocation.plan.md](plans/archive/optional-app-relocation.plan.md)                                                | Not Selected | Archived Sequence R decision; root application retained                         |
| [dev-tooling-hygiene.plan.md](plans/current/dev-tooling-hygiene.plan.md)                                                        | In Progress  | Parked major upgrades and dependency-cruiser work                               |
| [linkedin-update.plan.md](plans/current/linkedin-update.plan.md)                                                                | Paused       | Private-boundary routing; reopen only for a concrete owner purpose              |
| [tilt-retirement.plan.md](plans/current/tilt-retirement.plan.md)                                                                | Complete     | Canonical-only CV retirement record awaiting consolidation                      |
| [practice-core-wholesale-adoption.plan.md](plans/archive/practice-core-wholesale-adoption.plan.md)                              | Complete     | Structural Practice adoption ratchet and migration record                       |

Completed plans are in [plans/archive/](plans/archive/) for reference.

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

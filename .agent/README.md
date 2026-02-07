# .agent

Agent-facing documentation and planning for this project. Start with [directives/AGENT.md](directives/AGENT.md) — it is the entry point for all AI agents.

## Directory Structure

```
.agent/
├── directives/       ← START HERE
│   ├── AGENT.md              # Entry point — project context, commands, structure
│   ├── rules.md              # Core development rules (TDD, type safety, code quality)
│   └── testing-strategy.md   # Testing philosophy, test types, naming conventions
│
├── plans/            ← Current and completed work plans
│   ├── cloud/                # Self-contained sub-plans for cloud agents
│   │   └── README.md         # Index with dependency graph
│   ├── complete/             # Plans that have been fully executed
│   └── *.plan.md             # Active plans
│
├── prompts/          ← Reusable prompt templates
│   ├── start-right.prompt.md
│   ├── start-right-thorough.prompt.md
│   └── project-spec-creation-process.prompt.md
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

### Understanding what needs doing

Active plans describe work that is planned or in progress:

| Plan                                                           | Status   | Description                                                        |
| -------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| [component-audit.plan.md](plans/component-audit.plan.md)       | Planning | Audit and refactor components, tokens, and page scaffolding        |
| [content-review.plan.md](plans/content-review.plan.md)         | Planning | Content observations and improvements across the site              |
| [front-page-content.plan.md](plans/front-page-content.plan.md) | Planning | Rework front page content and positioning (blocked on Jim's input) |

Completed plans are in [plans/complete/](plans/complete/) for reference.

### Cloud agent sub-plans

The [plans/cloud/](plans/cloud/) directory contains small, self-contained sub-plans designed for Cursor cloud agents. Each includes full context, step-by-step instructions, and acceptance criteria. See the [cloud README](plans/cloud/README.md) for the index and dependency graph.

### Project documentation (outside .agent)

For architecture decisions, user stories, and requirements, see [docs/](../docs/):

- [docs/architecture/](../docs/architecture/) — System architecture and ADRs
- [docs/project/user-stories.md](../docs/project/user-stories.md) — User stories
- [docs/project/requirements.md](../docs/project/requirements.md) — Non-functional requirements

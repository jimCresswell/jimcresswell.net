---
fitness_line_target: 180
fitness_line_limit: 220
fitness_char_limit: 12500
fitness_line_length: 100
split_strategy: Extract detail to referenced docs; this file is an index/entry point
---

# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first,
then follow all instructions.

## Grounding

Commit to always using British spelling, British English grammar, and British date and time formats.

## First Question

Always apply the first question: **Ask: could it be simpler without compromising quality?**

## Project Context

**What**: Personal website and CV for Jim Cresswell
**Stack**: Next.js 16, React 19, Tailwind CSS 4, deployed on Vercel
**Package Manager**: pnpm (REQUIRED — never npm/yarn)

## The Practice

This repo follows the Agentic Engineering Practice. For the full system — principles, structure,
tooling, and knowledge flow — see [practice-core/index.md](../practice-core/index.md). For navigable
links to this repo's artefacts, validators, and reference surfaces, see
[practice-index.md](../practice-index.md). For explicit supported and unsupported platform mappings,
see [cross-platform-agent-surface-matrix.md](../reference/cross-platform-agent-surface-matrix.md).

## Rules

Read [the rules](./rules.md); reflect on them, _apply_ them — they MUST be followed at ALL times.
Read [metacognition](./metacognition.md) and apply it before planning.

## Essential Links

- [Rules](./rules.md) — Core development principles
- [Testing Strategy](./testing-strategy.md) — TDD approach and test types
- [Metacognition](./metacognition.md) — Pause and reflect before planning
- [Editorial Guidance](./editorial-guidance.md) — Jim's editorial voice and identity (read before
  any content work)
- [Privacy](./privacy.md) — Psychological safety and PII handling
- [Security Operations](./secops.md) — Git email, PII audits, operational security
- [Cross-Platform Surface Matrix](../reference/cross-platform-agent-surface-matrix.md) — Supported
  and unsupported agent surfaces
- [Architecture](../../docs/architecture/) — System architecture and ADRs
- [Editorial Decision Records](../../docs/editorial/decision-records/) — Specific editorial
  decisions with context and rationale (EDRs)
- [User Stories](../../docs/project/user-stories.md) — Key user stories
- [Requirements](../../docs/project/requirements.md) — Non-functional requirements

## Session Start

Every session, read `.agent/memory/distilled.md` and scan `.agent/memory/napkin.md` before doing
anything. These contain hard-won patterns and recent context. Update the napkin continuously as you
work — log mistakes, corrections, and what works. See the [napkin skill](../skills/napkin/SKILL.md).

Then follow the **[start-right skill](../skills/start-right/SKILL.md)** (command: `/jc-start-right`)
for foundation documents, guiding questions, practice box, and quality expectations.

Also read **`.agent/plans/active/README.md`** and the **active plan markdown** in
`.agent/plans/active/` — the current execution focus lives in that folder as the real plan file, not
only in `plans/current/`. When the primary focus changes, move plans, update that README, and
reconcile `roadmap.md` together.

## Agent Tools

### Sub-agents

Canonical reviewer prompts live in `.agent/sub-agents/templates/`. In Codex, the project reviewer
roster is registered in `.codex/config.toml` and each role uses a thin `.codex/agents/*.toml`
adapter that points back to the canonical template.

| Agent                                                     | Purpose                                               |
| --------------------------------------------------------- | ----------------------------------------------------- |
| [editor](../sub-agents/templates/editor.md)               | Editorial reviewer — voice, consistency, and pitfalls |
| [code-reviewer](../sub-agents/templates/code-reviewer.md) | Gateway reviewer — quality, correctness, and triage   |
| [test-reviewer](../sub-agents/templates/test-reviewer.md) | TDD compliance and test quality                       |
| [type-reviewer](../sub-agents/templates/type-reviewer.md) | TypeScript type safety                                |
| [pkg-reviewer](../sub-agents/templates/pkg-reviewer.md)   | PKG specialist — Schema.org, JSON-LD, graph           |

### Skills

| Skill                                                                 | Purpose                                                                         |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [start-right](../skills/start-right/SKILL.md)                         | Core session grounding — foundation docs, active plan, practice box, gates      |
| [project-spec-creation](../skills/project-spec-creation/SKILL.md)     | Core workflow — project definition docs for generative UI handoff (v0, Bolt, …) |
| [editorial-voice](../skills/editorial-voice/SKILL.md)                 | Apply Jim's editorial voice — two registers, common pitfalls                    |
| [quality-gates](../skills/quality-gates/SKILL.md)                     | Run quality gates with restart-on-fix discipline                                |
| [napkin](../skills/napkin/SKILL.md)                                   | Session learning log — always active, read and update every session             |
| [distillation](../skills/distillation/SKILL.md)                       | Rotate napkin into curated distilled.md when it grows large                     |
| [author-skills](../skills/author-skills/SKILL.md)                     | Create or update repo-local skills and adapters                                 |
| [deslop](../skills/deslop/SKILL.md)                                   | Remove AI-generated code slop from diffs                                        |
| [pkg](../skills/pkg/SKILL.md)                                         | PKG entity model and structured data guide                                      |
| [package-deps-up-to-date](../skills/package-deps-up-to-date/SKILL.md) | Audit and update `package.json` dependencies safely                             |

### Commands

| Command                | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `/jc-start-right`      | Ground yourself before beginning work            |
| `/jc-gates`            | Run quality gates with restart-on-fix discipline |
| `/jc-commit`           | Create a well-formed commit with safety checks   |
| `/jc-consolidate-docs` | Ensure plans, prompts, and memory are up to date |
| `/jc-plan`             | Structured planning workflow                     |
| `/jc-editor`           | Invoke editorial review                          |

## Development Commands

All commands use `pnpm`. Key commands:

- `pnpm dev` — local development server
- `pnpm build` — production build
- `pnpm check` — eight blocking gates with auto-fix, including portability
- `pnpm test:e2e` — Playwright E2E suite against a production build
- `pnpm test:e2e:ui` — interactive Playwright UI mode
- `pnpm portability:check` — agent-surface parity validation
- `pnpm practice:fitness:informational` — advisory Practice/doc fitness report

Full gate sequence, restart-on-fix discipline, and individual checks are documented in
[rules.md](./rules.md#code-quality). All available scripts are in `package.json`.

## Project Structure

```text
app/                    # Next.js App Router pages and layouts
components/             # React components
content/                # CV content JSON files
lib/                    # Utility functions and types
scripts/                # Build-time scripts (PDF generation)
docs/                   # Project documentation
  architecture/         # System architecture and ADRs
  editorial/            # Editorial decision records (EDRs)
  project/              # User stories and requirements
public/                 # Static assets
e2e/                    # End-to-end tests (Playwright)
  journeys/             # User story journey tests
  behaviour/            # Cross-cutting behavioural tests (a11y, SEO, content)
.agent/                 # Canonical Practice artefacts (platform-agnostic)
  directives/           # Principles, rules, and operational directives
  practice-core/        # Portable practice-core files and practice box
  reference/            # Stable local reference docs such as the surface matrix
  commands/             # Canonical commands
  skills/               # Canonical skills
  rules/                # Canonical always-applied rules
  sub-agents/templates/ # Canonical sub-agent templates
  plans/                # Work planning — active/ holds the primary plan file; see active/README.md
  prompts/              # Reusable prompt playbooks
  memory/               # Napkin, distilled, code patterns
  experience/           # Experiential records
.agents/                # Codex platform adapters
  skills/               # Thin skill and command wrappers plus adapter-local metadata
.codex/                 # Codex project configuration
  config.toml           # Project-local reviewer sub-agent registry
  agents/               # Thin reviewer adapter files
.github/                # GitHub Copilot and GitHub-facing agent surfaces
.cursor/                # Cursor platform adapters (thin wrappers)
  agents/               # Sub-agent adapters
  commands/             # Command adapters
  skills/               # Skill adapters
  rules/                # Rule triggers (alwaysApply)
```

## Agent Behaviour

- **Don't push git commits** unless explicitly asked.
- **Verify claims with evidence** — check build logs, rendered output, terminal state. Never assume
  or report success without checking.
- **Plans must be standalone** — a fresh agent with no prior context must be able to pick up and
  execute a plan without ambiguity.
- **Plans must be discoverable** — linked from parent plan, README, and related docs.
- **Archive docs are historical records** — never update them.
- **Listen to user priorities** — not document structure. When the user says focus on X, don't get
  sidetracked by Y.

## Remember

1. When in doubt, **make it simpler**
2. Test behaviour, not implementation
3. TSDoc on all exported functions

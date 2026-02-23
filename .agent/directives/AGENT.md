# AGENT.md

This file provides core directives for AI agents working with this codebase. Read ALL of it first, then follow all instructions.

## Grounding

Commit to always using British spelling, British English grammar, and British date and time formats.

## First Question

Always apply the first question: **Ask: could it be simpler without compromising quality?**

## Project Context

**What**: Personal website and CV for Jim Cresswell
**Stack**: Next.js 16, React 19, Tailwind CSS 4, deployed on Vercel
**Package Manager**: pnpm (REQUIRED — never npm/yarn)

## Rules

Read [the rules](./rules.md); reflect on them, _apply_ them — they MUST be followed at ALL times.

## Essential Links

- [Rules](./rules.md) — Core development principles
- [Testing Strategy](./testing-strategy.md) — TDD approach and test types
- [Editorial Guidance](./editorial-guidance.md) — Jim's editorial voice and identity (read before any content work)
- [Privacy](./privacy.md) — Psychological safety and PII handling
- [Security Operations](./secops.md) — Git email, PII audits, operational security
- [Architecture](../../docs/architecture/) — System architecture and ADRs
- [Editorial Decision Records](../../docs/editorial/decision-records/) — Specific editorial decisions with context and rationale (EDRs)
- [User Stories](../../docs/project/user-stories.md) — Key user stories
- [Requirements](../../docs/project/requirements.md) — Non-functional requirements

## Session Start

Every session, read `.agent/memory/distilled.md` and scan `.agent/memory/napkin.md` before doing anything. These contain hard-won patterns and recent context. Update the napkin continuously as you work — log mistakes, corrections, and what works. See the [napkin skill](../../.cursor/skills/napkin/SKILL.md).

## Agent Tools

### Sub-agents

| Agent                                    | Purpose                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [editor](../../.cursor/agents/editor.md) | Read-only editorial reviewer — provides structured feedback on voice, consistency, and pitfalls |

### Skills

| Skill                                                            | Purpose                                                             |
| ---------------------------------------------------------------- | ------------------------------------------------------------------- |
| [editorial-voice](../../.cursor/skills/editorial-voice/SKILL.md) | Apply Jim's editorial voice — two registers, common pitfalls        |
| [quality-gates](../../.cursor/skills/quality-gates/SKILL.md)     | Run quality gates with restart-on-fix discipline                    |
| [napkin](../../.cursor/skills/napkin/SKILL.md)                   | Session learning log — always active, read and update every session |
| [distillation](../../.cursor/skills/distillation/SKILL.md)       | Rotate napkin into curated distilled.md when it grows large         |
| [deslop](../../.cursor/skills/cursor-deslop/SKILL.md)            | Remove AI-generated code slop from diffs                            |

### Commands

| Command             | Purpose                                                        |
| ------------------- | -------------------------------------------------------------- |
| `/jc-editor`        | Invoke the editor sub-agent for a voice and consistency review |
| `/jc-gates`         | Run quality gates sequentially with restart-on-fix discipline  |
| `/jc-commit`        | Create a well-formed commit with safety checks                 |
| `/jc-start-right`   | Standard project onboarding                                    |
| `/jc-plan`          | Structured planning workflow                                   |
| `/consolidate-docs` | Ensure plans, prompts, and memory are up to date               |

## Development Commands

```bash
pnpm install        # Setup
pnpm dev            # Development server
pnpm build          # Production build (next build + PDF generation)
pnpm start          # Start production server
pnpm format:fix     # Prettier format (auto-fix)
pnpm format:check   # Prettier check (read-only)
pnpm lint:fix       # ESLint (auto-fix)
pnpm lint:check     # ESLint (read-only)
pnpm typecheck      # TypeScript type checking
pnpm test           # Unit and integration tests (Vitest)
pnpm test:watch     # Tests in watch mode
pnpm test:coverage  # Tests with coverage
pnpm check          # All quality gates with auto-fix (see rules.md)
pnpm check:ci       # All quality gates read-only (used by pre-commit hook)
pnpm test:e2e       # E2E tests — default project (Playwright)
pnpm test:e2e:pdf   # E2E tests — with-build project (PDF tests)
pnpm test:e2e:ui    # Playwright UI mode
```

For the full quality gate sequence, restart-on-fix discipline, and what each gate checks, see [rules.md](./rules.md#code-quality).

## Project Structure

```
app/                # Next.js App Router pages and layouts
components/         # React components
content/            # CV content JSON files
lib/                # Utility functions and types
scripts/            # Build-time scripts (PDF generation)
docs/               # Project documentation
  architecture/     # System architecture and ADRs
  editorial/        # Editorial decision records (EDRs)
  project/          # User stories and requirements
public/             # Static assets
e2e/                # End-to-end tests (Playwright)
  journeys/         # User story journey tests
  behaviour/        # Cross-cutting behavioural tests (a11y, SEO, content)
.agent/memory/      # Session learning: napkin.md (current), distilled.md (curated)
.cursor/
  agents/           # Sub-agents (editor)
  commands/         # Custom commands (/jc-editor, /jc-gates, etc.)
  skills/           # Agent skills (editorial-voice, quality-gates, napkin, distillation, deslop)
  settings.json     # Cursor plugins (Vercel, continual-learning)
```

## Agent Behaviour

- **Don't push git commits** unless explicitly asked.
- **Verify claims with evidence** — check build logs, rendered output, terminal state. Never assume or report success without checking.
- **Plans must be standalone** — a fresh agent with no prior context must be able to pick up and execute a plan without ambiguity.
- **Plans must be discoverable** — linked from parent plan, README, and related docs.
- **Archive docs are historical records** — never update them.
- **Listen to user priorities** — not document structure. When the user says focus on X, don't get sidetracked by Y.

## Remember

1. When in doubt, **make it simpler**
2. Test behaviour, not implementation
3. TSDoc on all exported functions

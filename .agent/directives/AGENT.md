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

## Editorial Tools

Content work has dedicated tooling. Use these when editing, reviewing, or drafting any content that represents Jim.

### Sub-agents

| Agent                                    | Purpose                                                                                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [editor](../../.cursor/agents/editor.md) | Read-only editorial reviewer. Provides detailed feedback on voice, consistency, and pitfalls — does not write or edit files. The calling agent applies the feedback. |

### Skills

| Skill                                                            | Purpose                                                                                 |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [editorial-voice](../../.cursor/skills/editorial-voice/SKILL.md) | Practical guidance for applying Jim's voice — two registers, common pitfalls, the check |

### Commands

| Command           | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| `/jc-editor`      | Invoke the editor sub-agent for a voice and consistency review |
| `/jc-gates`       | Run quality gates sequentially, fixing issues as they arise    |
| `/jc-commit`      | Create a well-formed commit with safety checks                 |
| `/jc-start-right` | Standard project onboarding                                    |
| `/jc-plan`        | Structured planning workflow                                   |

## Development Commands

```bash
pnpm install        # Setup
pnpm dev            # Development server
pnpm build          # Production build (next build + PDF generation)
pnpm start          # Start production server
pnpm lint           # ESLint
pnpm type-check     # TypeScript type checking
pnpm format         # Prettier format
pnpm format-check   # Prettier check
pnpm test           # Unit and integration tests (Vitest)
pnpm test:watch     # Tests in watch mode
pnpm test:coverage  # Tests with coverage
pnpm check          # All checks: format, lint, type-check, test, knip, gitleaks
pnpm gitleaks       # Scan git history for secrets
pnpm test:e2e       # E2E tests — default project (Playwright)
pnpm test:e2e:pdf   # E2E tests — with-build project (PDF tests)
pnpm test:e2e:ui    # Playwright UI mode
```

**Note:** `test:e2e` is intentionally separate from `pnpm check`. E2E tests are slower (browser automation) and have external dependencies (Chromium). Run them explicitly.

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
.cursor/
  agents/           # Sub-agents (editor)
  commands/         # Custom commands (/jc-editor, /jc-gates, etc.)
  skills/           # Agent skills (editorial-voice)
```

## Remember

1. When in doubt, **make it simpler**
2. Test behaviour, not implementation
3. TSDoc on all exported functions

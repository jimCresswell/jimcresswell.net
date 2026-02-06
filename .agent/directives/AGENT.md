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
- [Architecture](../../docs/architecture/) — System architecture and decision records
- [User Stories](../../docs/project/user-stories.md) — Key user stories
- [Requirements](../../docs/project/requirements.md) — Non-functional requirements

## Development Commands

```bash
pnpm install        # Setup
pnpm dev            # Development server
pnpm build          # Production build
pnpm start          # Start production server
pnpm lint           # ESLint
pnpm type-check     # TypeScript type checking
pnpm format         # Prettier format
pnpm format-check   # Prettier check
pnpm test           # Unit and integration tests (Vitest)
pnpm test:watch     # Tests in watch mode
pnpm test:coverage  # Tests with coverage
pnpm check          # All checks: format, lint, type-check, test, knip
```

## Project Structure

```
app/                # Next.js App Router pages and layouts
components/         # React components
content/            # CV content JSON files
lib/                # Utility functions and types
scripts/            # Build-time scripts (PDF generation)
docs/               # Project documentation
  architecture/     # System architecture and decision records
  project/          # User stories and requirements
public/             # Static assets
e2e/                # End-to-end tests (Playwright) — to be added
```

## Remember

1. When in doubt, **make it simpler**
2. Test behaviour, not implementation
3. TSDoc on all exported functions

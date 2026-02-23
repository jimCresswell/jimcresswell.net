# Start Right

Ground yourself before beginning work.

## Foundation Documents

Read and internalise these documents:

1. @.agent/directives/AGENT.md - Entry point and project context
2. @.agent/directives/rules.md - **THE AUTHORITATIVE RULES**
3. @.agent/directives/testing-strategy.md - TDD at all levels

## Guiding Questions

Before diving in, pause and ask:

1. **Are we solving the right problem, at the right layer?**
2. **What value are we delivering, through what impact, for which users?**
3. **Could it be simpler without compromising quality?**
4. **What assumptions am I making? Are they valid?**

## Commit

**Commit** to excellence in systems architecture, software engineering, and developer experience. Choose architectural correctness over short-term expediency. This requires critical and _long-term_ thinking.

## Process

**Do not assume you know the initial step.** Discuss with the user first.

## Quality Gates

Run after making changes:

```bash
pnpm check       # All six gates with auto-fix (see rules.md)
pnpm test:e2e    # E2E tests (separate, requires Chromium)
```

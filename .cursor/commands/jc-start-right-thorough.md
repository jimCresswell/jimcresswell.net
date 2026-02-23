# Start Right (Thorough)

Ground yourself rigorously before beginning significant work.

## Foundation Documents

Read and internalise these documents:

1. @.agent/directives/AGENT.md - Entry point and project context
2. @.agent/directives/rules.md - **THE AUTHORITATIVE RULES**
3. @.agent/directives/testing-strategy.md - TDD at all levels

**Plans must include regularly re-reading and re-committing to these foundation documents.**

## Guiding Questions

Before diving in, pause and ask:

1. **Are we solving the right problem, at the right layer?**
2. **What value are we delivering, through what impact, for which users?**
3. **Could it be simpler without compromising quality?**
4. **What assumptions am I making? Are they valid?**

Step back and consider if work is delivering value through impact at the system level, not just fixing the problem right in front of you.

## Commit

**Commit** to excellence in systems architecture, software engineering, and developer experience. Choose architectural correctness over short-term expediency. This requires critical and _long-term_ thinking.

## Process

**Do not assume you know the initial step.** Discuss with the user first.

## After Each Piece of Work

1. **Run the full quality gate suite** one gate at a time
2. **Wait for all gates to complete** before analysing issues
3. **Analysis must include**: Are there fundamental architectural issues or opportunities for improvement?

## Documentation Requirements

All plans must include instructions to create:

- **TSDoc**: General on all logic and state, extensive examples on public interfaces
- **Markdown**: READMEs where appropriate

## Quality Gates

Run after making changes:

```bash
pnpm check       # All six gates with auto-fix (see rules.md)
pnpm test:e2e    # E2E tests (separate, requires Chromium)
```

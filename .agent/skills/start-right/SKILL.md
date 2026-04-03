---
name: start-right
classification: active
description: Core session workflow — ground yourself before beginning work. Read when starting a session, invoking /jc-start-right, or whenever you need foundation documents, guiding questions, practice box check, and quality expectations.
---

# Start Right

Ground yourself before beginning work.

## Foundation Documents

Read and internalise these documents:

1. `.agent/directives/AGENT.md` — Entry point and project context
2. `.agent/directives/rules.md` — **THE AUTHORITATIVE RULES**
3. `.agent/directives/testing-strategy.md` — TDD at all levels

4. **`.agent/plans/active/`** — **The currently active execution plan** lives here as the real markdown file. Read **`active/README.md`** for which file, then open that plan. Do not guess which plan is primary from `current/` alone.

**Plans must include regularly re-reading and re-committing to these foundation documents.**

## Guiding Questions

Before diving in, pause and ask:

1. **Are we solving the right problem, at the right layer?**
2. **What value are we delivering, through what impact, for which users?**
3. **Could it be simpler without compromising quality?**
4. **What assumptions am I making? Are they valid?**

Step back and consider if work is delivering value through impact at the system level, not just fixing the problem right in front of you.

## Practice Box

Check `.agent/practice-core/incoming/` for incoming practice-core files. If files are present, alert the user.

## Commit

Commit to excellence in systems architecture, software engineering, and developer experience. Choose architectural correctness over short-term expediency. This requires critical and long-term thinking.

## Process

Do not assume you know the initial step. Discuss with the user first.

## After Each Piece of Work

1. Run the full quality gate suite one gate at a time.
2. Wait for all gates to complete before analysing issues.
3. If the current slice can affect rendered output through data, graph,
   metadata, content-model, or rendering changes, run the visual regression
   harness during implementation rather than leaving it until the end.
   Unexpected differences are blocking until reviewed and resolved.
4. Include architectural analysis, not just local fixes.

## Documentation Requirements

All plans must include instructions to create:

- TSDoc on logic and state, with extensive examples on public interfaces
- READMEs where appropriate

## Quality Gates

Run after making changes:

```bash
pnpm check       # All seven gates with auto-fix (see rules.md)
pnpm test:e2e    # E2E tests (separate, requires Chromium)
```

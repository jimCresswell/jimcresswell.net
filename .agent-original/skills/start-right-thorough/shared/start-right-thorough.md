# Start Right Thorough

Use this workflow for structural migrations, cross-platform Practice work,
review-heavy changes, or any session that will span multiple phases.

## Foundation pass

Read:

1. `.agent/directives/AGENT.md`
2. `.agent/directives/principles.md`
3. `.agent/directives/testing-strategy.md`
4. `.agent/directives/metacognition.md`
5. `.agent/directives/privacy.md`
6. `.agent/directives/secops.md`
7. `.agent/memory/distilled.md`
8. `.agent/memory/napkin.md`
9. `.agent/practice-index.md`
10. `.agent/reference/cross-platform-agent-surface-matrix.md`
11. `.agent/practice-core/index.md`
12. `.agent/practice-core/practice-verification.md`
13. `.agent/plans/active/README.md`
14. The active plan markdown file
15. Any prompt or current-plan surfaces the active plan names as continuity
    inputs

## Inbound and continuity pass

1. Inspect `.agent/practice-core/incoming/`.
2. Inspect `.agent/practice-context/README.md` plus inbound support notes if
   present.
3. Reconcile the active plan, roadmap, and prompt surfaces before coding if
   they disagree.
4. Challenge every assumption from prior sessions before treating it as settled.

## Structured reasoning

Thorough grounding is for high-risk, architectural, cross-platform, or
planning-heavy work — precisely where structured reasoning earns its place.
Read `.agent/reference/grammar-of-thinking.md` as the yardstick for this
work, and use `.agent/skills/reason/SKILL.md` to structure the analysis or
plan before committing to an approach. Before the first non-planning edit,
leave an observable work-shape artefact: bounded work records goal, scope,
and validation in chat; multi-session, architectural, Practice, or
high-risk work uses a repo plan via `.agent/skills/plan/SKILL.md`.

If the session is part of a multi-seat collaboration (a live ARC channel, a
directing seat), also apply `.agent/skills/start-right-team/SKILL.md`.

## Execution discipline

- Run one slice at a time and keep the plan truthful as the work moves.
- Re-ground after every substantial fix, phase boundary, or reviewer finding.
- Invoke specialist reviewers whenever a change crosses their domain rather
  than relying on a single generic pass.
- For rendering-risk slices, run `pnpm visual-regression-harness` during the
  implementation loop, not only at the end.

## Verification discipline

1. Run blocking validators when agent/platform surfaces change:
   `pnpm vital-surfaces:check`,
   `pnpm portability:check`,
   `pnpm subagents:check`
2. Run informational Practice validators when governed docs change:
   `pnpm practice:fitness:informational`,
   `pnpm fitness-vocabulary:check`
3. Run `pnpm check` with restart-on-fix discipline.
4. Run `pnpm test:e2e` after the blocking gates are green when user-visible
   behaviour or tooling integration could be affected.

## Closeout

Before pausing, update the active plan, roadmap, prompt surface, and napkin so
the next session can resume from the next concrete task rather than re-deriving
state.

# Start Right Quick

Use this fast grounding workflow at the start of a normal session or before
resuming paused work.

## Read First

1. `.agent/directives/AGENT.md`
2. `.agent/directives/principles.md`
3. `.agent/directives/testing-strategy.md`
4. `.agent/directives/metacognition.md`
5. `.agent/memory/distilled.md`
6. `.agent/memory/napkin.md`
7. `.agent/plans/active/README.md`
8. The primary plan file named in `.agent/plans/active/README.md`
9. Your own platform's per-user memory, if present (Claude Code:
   the per-project memory directory under `~/.claude/projects/`). Read only
   the surface for the platform you are running on; cross-platform
   ingestion is consolidation-time work, not session-open work.

## Check the inbound surfaces

1. Inspect `.agent/practice-core/incoming/`.
2. If `.agent/practice-context/` exists, inspect `README.md` and any inbound
   support material before assuming the repo is already reconciled.
3. If inbound Practice material is present, surface it immediately rather
   than starting implementation.

## Check live state before edits

1. `git status --short` and `git log --oneline --decorate -5` — in this
   repo's shared checkout, note any PEER staged or unstaged work and leave
   it alone; commit with scoped pathspecs only.
2. If an ARC channel is live under `.agent/collaboration/rapid-comms/`,
   re-read its tail before asserting anything about collaboration state.
3. Check for leaked background processes or watchers from an earlier
   session before arming new ones.

## Landing commitment and work shape

State your landing target at session open:

> Target: `<plan, lane, or artefact>` — `<specific outcome>`.

A landing is a specific invariant achieved — a test added, a file authored,
a commit made — not a plan edit or a "lane opened". If no landing is
appropriate, say so with the reason.

Before the first non-planning edit, leave a small observable plan artefact
whose size matches the work: trivial work needs only the landing target;
bounded non-trivial work records goal, scope, and validation in chat;
multi-session, architectural, Practice, or high-risk work uses a repo plan
via `.agent/skills/plan/SKILL.md`.

Once the session intent is clear — and before significant implementation —
suggest the user run `/rename <session-name> - <intent>` so the session
title matches the work. Surface this once; never in closeout summaries.

## Re-grounding prompts

Pause and ask:

1. Are we solving the right problem at the right layer?
2. Could it be simpler without compromising quality?
3. What assumptions are we making, and what evidence challenges them?
4. What is the goal, and what is the full set of surfaces relevantly in
   scope for it — not just what I was pointed at? Name in/out before
   approach.
5. What continuity surface will the next session need if this work pauses?

These questions are not session-open-only: re-ask them at every new task or
pointer arrival and before declaring done.

For analysis-, planning-, or decision-heavy work,
`.agent/skills/reason/SKILL.md` structures the thinking outward (the pair to
`metacognition`'s inward reflection), and
`.agent/reference/grammar-of-thinking.md` is the yardstick for complex
rewrites and high-stakes planning.

## Extra reads when the slice touches special surfaces

- Agent tooling or platform adapters:
  `.agent/practice-index.md`,
  `.agent/reference/cross-platform-agent-surface-matrix.md`,
  `.agent/practice-core/practice-verification.md`
- Rendering, content, metadata, or graph surfaces:
  plan for `pnpm visual-regression-harness` during implementation
- Practice Core or directive docs:
  plan to run `pnpm practice:fitness:informational` and
  `pnpm fitness-vocabulary:check`

## Working stance

- Do not guess the first edit; ground first, then act. Do not assume you
  know the initial step when intent is genuinely unclear — discuss
  first-step direction with the user.
- Keep the active plan as the continuity surface.
- Treat `pnpm check` as restart-on-fix: after any fix, restart from the top.
- Include periodic re-grounding checkpoints in any non-trivial plan so the
  session re-reads and recommits to the foundation files.

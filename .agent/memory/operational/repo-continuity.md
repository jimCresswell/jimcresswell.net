---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 115
fitness_line_length_rationale: >-
  Raised 100 → 115 (owner-authorised 2026-06-29) for this append-heavy
  narrative/continuity surface. Marginal prose-width drift on appended prose is
  chronic-cosmetic (99% of breaches were ≤120; median 104) and manual reflow is a
  transient non-cure on a file that grows by append each session; 115 clears the
  noise while still flagging genuine over-runs.
fitness_content_role: reference
overflow_disposition: "leave-if-live; else conserve-insight-and-delete — never archive/split/rotate/shard (see continuity-practice.md §Disposition of Continuity Surfaces)"
merge_class: index-narrative-tables
---

# Repo Continuity

The canonical continuity contract for `jimcresswell.net`: where we are, what is
live, what is next. Refreshed by `session-handoff`; read at session resume.

## Current State

- Branch `feat/monorepo`: OCE Practice lineage transplant in progress. Plan of
  record: `docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`
  (§Amendment, §Hour 1, §Owner rulings rounds 1–3 carry the live state).
- Seven pnpm workspaces; root scripts through Turborepo; root devDeps installed.
- **Directives merged** (`principles`, `testing-strategy`, `AGENT.md`); **rules
  triaged** (127 canonical; table in the plan doc); `commands/` retired; Practice
  docs layer brought over (`docs/governance|engineering|foundation`, residue
  pass owed); skills generated and enabled (`jc-*`, 66); `portability:check`
  passes; zero broken links in `.agent/rules/`; `subagents:check` 175
  (adapter/template contract); agent-tools `tsc` clean; validator scripts still
  failing on missing harness (Phase 8).
- `.agent-original/` still present pending the owner's loss-scan review.

## Active Threads

- OCE Practice lineage transplant (owner-led rulings, agent execution).

## Paused Threads

- LinkedIn editorial pass (owner-led, private boundary; headline is the only
  settled field).
- Track B Source-of-Truth Design, Phase B2.1.
- Dev-Tooling Hygiene (dependency updates handled locally).

## Next Safe Steps

Owner-set order (2026-09-12): 1. ~~rules triage~~ done; 2. **harness integration
(plan Phase 8) — next**; 3. re-evaluate.
Re-evaluate includes: the 29 copied `docs/governance|engineering|foundation`
files may belong in whole, part or concept under `.agent/` (owner note) —
assign each a role and a home. Then: sub-agent contract conformance, plan-node migration (39 legacy plans),
duplicate-skill merges, Oak-residue pass on the copied governance docs, owner
review + `.agent-original` deletion, 57-lesson synthesis with quorum, Vercel
root directory, PR.

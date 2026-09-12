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
- **Committed on `feat/monorepo`** (two commits, all hooks green): the transplant
  (directives merged, 127 rules triaged, skills + adapters, JC statusline mark,
  `preserve-caught-error` on) and Phase 8 harness (Claude/Codex/Cursor hooks and
  statusline, hook policy restored, full Husky set, `ci.yml` with CI parity,
  root gates: gitleaks, knip, depcruise, markdownlint footprint, sub-agent
  adapters for 27 templates). **`pnpm check` is green end to end.**
- **Re-evaluate slice 1 committed** (plan §Re-evaluate ×3): the identity CLIs read
  the harness-native `CLAUDE_CODE_SESSION_ID` (PDR-027 amendment) and the hook
  reports truthfully; the shared start-right workflows cite the gates skill
  instead of a lineage gate list; `validate-cited-scripts` (green, 1198 files)
  and `machine-local-paths:check` are new `check`/`check:docs` legs (15 legs,
  CI parity); the copied docs layer is re-homed by role — `docs/governance` and
  `docs/foundation` dissolved, six developer docs stay in `docs/engineering`,
  eight host guides in `.agent/reference`, six doctrine merges into directives
  and rules. `.agent-original/` still present pending the owner's loss-scan.
- Outside `check`, still failing (pre-existing): patterns index, plan corpus and
  gate drift (plan-node migration), ratified-lists (upstream refounding
  artefacts), fitness vocabulary (`.agent-original`), collaboration-tui smoke,
  codex-session-alert smoke (`pnpm -s`); `check:docs` is red only on
  `validate-markdown-links` (418 broken links repo-wide, mostly lineage record
  links in memory, skills, plans and three local ADRs — the link-repair
  backlog; `docs/**` and every re-homed file are clear).

- Deep consolidation status: **due — deferred by owner ruling**. The napkin
  carries three 2026-09-12 sessions of unsynthesised lessons and the 57-lesson
  archive; the owner ruled the synthesis runs right after `.agent-original/`
  is deleted (plan §Ordering note). Four candidates are on the
  pending-graduations register meanwhile.
- Session-local generators (sub-agent adapters, classified rules index) are
  not in the repo; recipes are in the efficiency-guidance report. Land them
  as `agent-tools` bins before the next regeneration.

## Active Threads

- OCE Practice lineage transplant (owner-led rulings, agent execution).

## Paused Threads

- LinkedIn editorial pass (owner-led, private boundary; headline is the only
  settled field).
- Track B Source-of-Truth Design, Phase B2.1.
- Dev-Tooling Hygiene (dependency updates handled locally).

## Next Safe Steps

Owner-set order (2026-09-12): 1. rules triage done; 2. harness integration done
(plan §Phase 8); 3. re-evaluate slice 1 done (seed contract, session-open
surfaces, docs layer); 4. **next, owner-ordered at the 2026-09-12 wrap**: (a) at
the owner's restart, assess the fixes and predictions listed on the napkin's
Wrap 3 (startup env-file write, seed source, hook context line, picker
duplicates); (b) the link-repair pass — largely mechanical, and a link whose
target is a lineage record or surface with no local equivalent is removed,
not re-pointed; (c) then re-evaluate slice 2, candidates in order:
re-import OCE's pull-request machinery at the SHAs the OCE seat named (PR #136
after its merge commit lands on `engraph`; PR #138 at `352ad0ee5`; the source is
read-only, read with `git show` at a pinned commit); the content-grain merge of
the 11 local expert templates; the link-repair backlog (418; record-number
citations across `.agent/` and in `agent-tools` source comments — ADR-199 alone
is cited in fourteen modules; check the title at the target, a number surviving
proves nothing); plan-node migration (39 legacy plans); duplicate-skill merges;
the tooling residue listed in the plan (§Oak residue in tooling: `packages/core`
metadata URLs in `tooling/*/package.json`, fixture strings) and `turbo.json`'s
site `build` outputs (`.next/` unnamed, so the cache restores nothing); the
OCE-seeded `.agent/practice-core/incoming/resonance-outbound-bundle-2026-07-08.md`
(drop with the other emptied registers); `jcdotnet/accept-md.config.js`
(hand-authored JS; source-is-TypeScript); the retirement candidates among
agent-tools scripts (plan §Owner rulings on the agent-tools scripts); the two
session-local generators as `agent-tools` bins; owner review + `.agent-original`
deletion; 57-lesson synthesis with quorum; Vercel root directory; PR. Restart
assessment (2026-09-12, resumed session): the seed contract holds (both variables
in the first Bash call; preflight names the hook path, and the native fallback
with it unset); the "missed startup write" was a non-event (no hook existed at
startup; the shim runs in 0.11 s) and the timeout is back at 5 s. Falsifier still
open: duplicate `jc-*` entries in the Claude picker — the model-facing listing
shows each once, no second skill source exists (`.agents/skills/` is not a
Claude Code load location in 2.1.269), so the owner's picker is the only test.

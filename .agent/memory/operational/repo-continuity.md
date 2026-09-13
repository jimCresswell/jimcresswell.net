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
  instead of a lineage gate list; the copied docs layer is re-homed by role —
  `docs/governance` and `docs/foundation` dissolved, six developer docs stay in
  `docs/engineering`, eight host guides in `.agent/reference`, six doctrine
  merges into directives and rules. `.agent-original/` still present pending
  the owner's loss-scan.
- **Link repair done (2026-09-12, resumed session):** `validate-markdown-links`
  reports 0; `docs-validators:check` (reference direction, machine-local paths,
  markdown links, cited scripts) is a `check` leg and a CI step, so `check:docs`
  is now a subset of `check`. The patterns index is generated from the (empty)
  local corpus and its validator is green. Two lineage methodology docs were
  imported: `memory/operational/{ephemeral-to-permanent-homing,collaboration-state-lifecycle}.md`.
- Outside `check`, still failing (pre-existing): plan corpus and gate drift
  (plan-node migration; the validator needs `docs/strategy`), ratified-lists
  (upstream refounding artefacts), fitness vocabulary (`.agent-original`),
  collaboration-tui smoke, codex-session-alert smoke (`pnpm -s` is not a pnpm 12
  flag). Green but not yet wired as legs: check-ci-parity, claim-freshness,
  pretooluse-guard-routing, lifecycle-scripts, no-stale-script-invocations,
  collaboration-state, identity-naming, workspace-config-isolation,
  policy-reappraisal (OCE runs these as `repo-validators:check`).

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
surfaces, docs layer); 4. restart assessment done (below); 5. link repair done
(418 → 0; lineage-only targets removed, not re-pointed); 6. script naming
adopted from the lineage as practised (owner direction 2026-09-12; PDR-008
amended; `pnpm check` green on 16 legs, CI parity 16); 7. both plan nodes
ratified by the owner (2026-09-12, evening) and the journey understood
(`.agent/reports/practice-transplant/journey-so-far.md`, status provisional);
8. re-evaluate slice 2 item 1 done — the lineage's pull-request machinery
re-imported at `e477e62f7` (four doctrine patches, a §Scope section in the PR
template, §Code review in the Copilot instructions and `AGENTS.md`; the
PR #135 fixture not carried); 9. slice 2 item 2 done — the ten expert
templates merged at content grain (four commits; adapter descriptions still
the old ones until the generator bin lands); 10. slice 2 item 3 done — the
fifteen lineage ADR numbers in the `agent-tools` sources replaced by the
concepts they named (about two hundred sites; PDR numbers resolve and stay);
11. **next, in order — the rest of slice 2, "the design and transformation"
(owner's words at the 2026-09-13 compaction)**: the plan-node migration —
start from the plan of record's §Plan-node migration design brief (measured
facts; the one owner fork: a three-stream strategy layer, or a flat node
estate with the validator's absent-strategy zero-case; the two ratified
nodes are mis-named `.md` not `.plan.md` and mis-parented, cured in the
migration with every citing path re-pointed); then the ratified delivery node
`castr-lineage-update-preparation`'s slices (instruments as `agent-tools`
bins, instance-1 verdicts as `inputs/` data); duplicate-skill merges;
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

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

- `main` carries the monorepo and the Practice since PR #53 merged (`55649a2`, 2026-09-13); the
  transplant closure runs as small PRs against `main` (node §Transplant closure; items 1 to 4
  landed, item 4 as bounded with its residue rows named in the report). Plan of record: `docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`
  (§Owner rulings, rounds 1 to 16, carry the state; the latest round is current).
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
  merges into directives and rules. `.agent-original/` deleted 2026-09-13 after
  the computed loss-scan (round 13).
- **Link repair done (2026-09-12, resumed session):** `validate-markdown-links`
  reports 0; `docs-validators:check` (reference direction, machine-local paths,
  markdown links, cited scripts) is a `check` leg and a CI step, so `check:docs`
  is now a subset of `check`. The patterns index is generated from the (empty)
  local corpus and its validator is green. Two lineage methodology docs were
  imported: `memory/operational/{ephemeral-to-permanent-homing,collaboration-state-lifecycle}.md`.
- Outside `check`, still failing (pre-existing): plan corpus and gate drift
  (plan-node migration; the validator needs `docs/strategy`), ratified-lists
  (upstream refounding artefacts), fitness vocabulary (its own `practice-fitness`
  sources still say "two-threshold"; rechecked 2026-09-13 after the archive deletion),
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
- **2026-09-13, late afternoon (wrap 6):** `practice-completion` ratified with its three gates
  cleared and the transplant closure as eight checked exit conditions in two sessions (node
  §Transplant closure); the private editorial material made optional and minimally mentioned;
  `compute-dont-hope` and `record-generalisation-moves` are rules; the generalisation register
  holds fifteen rows, six owed to the lineage; the bootstrap closure and the validators' universe
  are derived; draft PR #53 open and green through 653f274, CI running on 7d6f292. No watcher,
  cron, claim or monitor was live at the wrap; nothing survives compaction and nothing needs
  re-arming.

- **2026-09-13, evening (wrap 7, the Director session):** the owner named this seat Director (PDR-117)
  and started three Implementer seats. Landed on `main`: the Director records and the channel rule
  (PR #54, `c426c6c`), closure item 4 (PR #57, `4a61112`, merged by the merge bot the owner created:
  App `jimbot-of-the-devonshire-jimbots`, config per-checkout and untracked, key outside the repo).
  Then, the same evening: item 3 merged (PR #56, `1829cd4`, by the owner); lanes B and C handed
  back and stood down; the owner set n=2 (Director and lane A, 17:16Z) with an ARC channel beside
  native messaging; open at 17:40Z: #58 (records), #60 (the per-checkout Playwright port), #55
  (one thread, cure by lane A), #59 (carried on #58). The live map is `director-handoff.md`
  (§Current handoff state, the board, the routing log whose last entry is current); it is the
  successor Director's first read.

## Active Threads

- OCE Practice lineage transplant — closure (Director: Cauldron herds Lustre, `director-handoff.md`;
  lanes A, B, C under `threads/closure-lane-*.next-session.md`).

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
11. plan-node migration done (2026-09-13, plan §Plan-node migration — executed):
strategy corpus at `.agent/plans/strategy/` (three streams, ten choices), three
strategic nodes born sketch, the two ratified nodes renamed and re-parented,
the impact registry local, the legacy lanes conserved at
`.agent/plans-legacy-2026-09/` with `DISPOSITIONS.md`, `validate-plan-corpus`
a `repo-validators:check` leg and green; 12. round 6 (2026-09-13): the platform
stream split into site and Practice, the four strategic nodes ratified, the
dispositions table ratified, the Track B delivery node authored at pickup;
13. owner word 2026-09-13 (mid-morning): **define what belongs to the
Practice** — the definition by function, the transplant set, and the gaps by
evidence class are in
`.agent/reports/practice-transplant/what-the-practice-is.md` (provisional);
its proposals are the delivery node
`.agent/plans/delivery/practice-completion.plan.md`, **ratified on cards
2026-09-13 (round 8)** with its three gates cleared in the same round: Gemini
carried and Windsurf rejected; the knowledge base as the cited subset,
scrubbed; the transplant instruments as that node's todo 6. The earlier
second-host preparation node was withdrawn as premature and removed from the
estate on the owner's word (the same round); the Practice's understanding of
its future is host-agnostic. **Transplant closure ratified (node §Transplant closure; plan §Owner rulings round 11),
re-sequenced round 13 (2026-09-13, evening): session 1 deleted `.agent-original/` first (done
2026-09-13 evening: the loss-scan computed,
`.agent/reports/practice-transplant/inputs/loss-scan-dispositions.tsv`, 255 rows, 24 residue, all
ruled; nothing moved to `reference/`; the private directories beneath it consolidated into the
live ignored boundary on the owner's word), then merged PR #53 (merge commit `55649a2`,
2026-09-13, every check green; `main` now carries the monorepo and the Practice), then
closure items 3 to 7 as small PRs against `main`; session 2 is the 57-lesson synthesis
(cards, one batch) from the three unprocessed napkins now under `.agent/memory/active/unconsolidated/`
(an archive holds only processed material, owner ruling round 13).** Todo 1 done (2026-09-13, plan
§Practice completion — todo 1 executed):
`validate-cited-paths` is a `docs-validators:check` leg, 35 absent targets cured to
0, five patterns and four cited records imported with provenance. Now: todo 2
(activate class B3: `practice-substrate`, `validate-protocol-wire-contract`, the
smoke suite, the lineage root scripts with consumers here).** Then the node's todos 2 to
6 in order; the `practice-language-separation` node (sketch, 2026-09-13, plan §Owner
direction round 9: the universal core, thin language packs, JSON Schema contracts plus a
conformance corpus; not urgent) awaits ratification on cards; duplicate-skill merges;
the tooling residue listed in the plan (§Oak residue in tooling: `packages/core`
metadata URLs in `tooling/*/package.json`, fixture strings) and `turbo.json`'s
site `build` outputs (`.next/` unnamed, so the cache restores nothing); the
OCE-seeded `.agent/practice-core/incoming/resonance-outbound-bundle-2026-07-08.md`
(drop with the other emptied registers); `jcdotnet/accept-md.config.js`
(hand-authored JS; source-is-TypeScript); the retirement candidates among
agent-tools scripts (plan §Owner rulings on the agent-tools scripts); the two
session-local generators as `agent-tools` bins; 57-lesson synthesis with quorum. Vercel root directory configured and the first
monorepo build green (owner-observed 2026-09-13); draft PR #53 open. Restart
assessment (2026-09-12, resumed session): the seed contract holds (both variables
in the first Bash call; preflight names the hook path, and the native fallback
with it unset); the "missed startup write" was a non-event (no hook existed at
startup; the shim runs in 0.11 s) and the timeout is back at 5 s. The picker
falsifier is closed (owner, 2026-09-13: each `jc-*` skill shows once after the
restart). **Owner rulings round 5 (2026-09-13, plan §Owner rulings, round 5)
govern the migration:** corpus under `.agent/plans/` with the strategy registry
at `.agent/plans/strategy/` (validator `STRATEGY_DIR` re-pointed); four streams
after round 6 (content, knowledge graph, site, Practice — the platform split at
ratification); every legacy plan reviewed before convert / conserve / history;
the legacy lanes conserved as a sibling corpus outside the scan root because the
loader walks `archive/`. OCE channel open: findings go to the OCE seat as they
arise, batched (batch 1 sent 2026-09-13). `.agent-original/` is deleted (round 13,
after the computed loss-scan); the 57-lesson synthesis is one seat's list reviewed by
the owner before graduation.

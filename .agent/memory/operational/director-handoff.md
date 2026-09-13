---
fitness_line_target: 120
fitness_line_limit: 160
fitness_line_length: 100
fitness_content_role: reference
---

# Director handoff entry point

The single file the next Director rehydrates from (PDR-117 §Consequences). Role doctrine lives in
[PDR-117](../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md); this
file carries the pickup procedure, the readiness self-check, the current handoff state and the
live board. It is rewritten in place at every Director transition, never appended.

## Role pickup procedure

1. Run `start-right-team` as `team-closeout-owner`; arm the all-channels comms watcher first
   (`comms watch --exclude-tag heartbeat`, as a persistent Monitor) and assert it live.
2. Read this file, then `repo-continuity.md` §Current State, then the controlling node named
   under §Current handoff state, then the thread records under `threads/` for every live lane.
3. Cross-check the outgoing Director on **both** surfaces before any acknowledgement: the claims
   registry (`claims status`) and the comms heartbeat stream. Registry-stale with comms-live is
   the trap; never take a live seat.
4. Adopt the Director claim in place (`claims adopt --claim-id <id>`), never a duplicate row.
5. Arm the heartbeat loop (both legs, failures emitted; the canonical invocation is in
   `liveness-heartbeat-cron.md`) and recompute `heartbeat_at` from the claim row.
6. Broadcast the PDR-064 Moment-2 active acknowledgement naming the adopted claim. Authority
   transfers on that event and not before.

## Readiness self-check before a Moment-2 acknowledgement

Every line answered first-hand, none inferred:

- The watcher is live for this identity (`comms assert-watcher-live` exits 0).
- The outgoing Director's last comms heartbeat is older than the retirement threshold, or the
  outgoing Director posted a Moment-1 pre-positioning event naming this seat.
- Every live lane's claim owner, branch and last substantive event are known (registry and
  comms, read now).
- The owner's standing rulings below are read and can be restated without the file.
- Nothing is queued to the owner that the Decision Lenses could resolve.

## Standing owner rulings the Director carries

- A green, clean pull request is merged, by merge commit, without asking; cards are for
  decisions only the owner can make.
- Compute, don't hope: no hand-kept list; every list is derived or gated by a validator.
- The private editorial material is optional, confidential, never a dependency, mentioned
  minimally, never quoted.
- Records are technical, not emotional. A move is a stepping stone, never an end state; an
  archive holds only processed material.
- The transplant is bounded: closure items 3 to 8 finish it, then editorial work.

## Current handoff state (2026-09-13, evening)

- Director: Cauldron herds Lustre (880ff9), claim `1db07581`, thread `transplant-closure`,
  branch `chore/transplant-closure-session-1` (records only; the Director makes no source
  edits).
- Controlling node: `.agent/plans/delivery/practice-completion.plan.md` §Transplant closure.
  Items 1 and 2 done (archive deleted after the computed loss-scan; PR #53 merged at
  `55649a2`). Items 3 to 7 are session 1's remaining work; item 8 is session 2.
- Plan of record: `docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`, rounds 11
  and 13.
- Team shape: three Implementer seats, owner-started, one worktree each, picked up with
  `start-right-team continue closure-lane-<a|b|c>`. Full protocol at n≥3.

## Live board

| Lane | Items | Owns exclusively | Seat | Claim | Branch / PR | State |
| ---- | ----- | ---------------- | ---- | ----- | ----------- | ----- |
| A | 3 then 5 | root scripts, CI workflow, `agent-tools/` legs and retirements, the leak validator, `tooling/*/package.json`, `turbo.json`, `jcdotnet/accept-md.config.js`, the incoming bundle | unfilled | — | `closure/lane-a` | ready to route |
| B | 6 | `.agent/rules/**`, `RULES_INDEX.md`, `.cursor/rules/**`, `.claude/rules/**`, `.agents/rules/**`, the rules-index and trigger generator, sub-agent adapter descriptions | unfilled | — | `closure/lane-b` | ready to route |
| C | 4 | the definition report, `testing-strategy.md`, the substrate manifest's register declarations, the Gemini projection; hands its four rule re-triages to B as a list | unfilled | — | `closure/lane-c` | ready to route |
| Director | 7 | reports index, runbook step 13, `provenance.yml` completion entry; merges | Cauldron herds Lustre | 1db07581 | after A, B, C land | waiting on lanes |

Sequencing constraints: B owns `.agent/rules/` alone, so C's rule edits travel to B as a
directed event, not a commit. A's two items are two PRs, item 3 first. Pushes serialise through
the commit queue (one host, one e2e port). Item 7 is written last because it records 3 to 6.

## Routing log

- 2026-09-13 evening: seat opened; team-start `ca1ba4d8`; lanes A, B, C authored, unfilled.
- 2026-09-13 evening: pre-push gate red on the Director records because markdownlint walks the
  disk and linted the untracked, generated `shared-comms-log.md` (green in CI, red locally: a
  check that reads the local disk proves the local disk). Stepping stone applied by the Director
  (one ignore line, `.markdownlint-cli2.jsonc`); the cure is routed to lane A: lint the tracked
  universe, not disk globs, and drop the hand-kept ignore list (`compute-dont-hope`).

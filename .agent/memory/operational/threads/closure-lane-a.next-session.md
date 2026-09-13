# Thread: closure-lane-a — instruments activated, lineage residue off the live surfaces

**Thread identity.** Lane A of the transplant closure (node
`.agent/plans/delivery/practice-completion.plan.md` §Transplant closure, items 3 then 5).
Director: Cauldron herds Lustre (880ff9), claim `1db07581`; route questions and blocks to the
Director by directed comms event, never to the owner (`route-blocks-and-questions-to-director`).

## State at 17:45Z, 2026-09-13 (n=2 with the Director since 17:16Z)

Item 3 landed (PR #56, `1829cd4`; `closure/lane-a` merged). Live: PR #60
(`fix/e2e-port-per-worktree`, the per-checkout Playwright port; three Copilot threads routed for
cure) and the #55 path-escape cure in the `closure-lane-b` worktree on `closure/lane-b`. Next:
item 5 on a fresh branch from `main` (64aa005 held on `closure/lane-a-checkpoint` rides it), and
the follow-on that brings `@engraph/result` into the site workspace for the port helper.
Dialogue on the ARC channel
`.agent/collaboration/rapid-comms/2026-09-13-transplant-closure-n2-cauldron-herds-lustre-saffron-turns-verdure.md`;
quick coordination native; state on the comms stream.

## Continuation at the go (2026-09-13 about 14:00Z; historical since the hand-back above)

- **Role:** Implementer (PDR-117). Enter your own worktree before any edit
  (`worktree-residency`); branch `closure/lane-a` from `main` (at or after `55649a2`).
- **Owns exclusively:** root `package.json` scripts, `.github/workflows/**`, `agent-tools/`
  sources and tests except the rules-index generator (lane B), `tooling/*/package.json`,
  `turbo.json`, `jcdotnet/accept-md.config.js`, the consumed incoming bundle under
  `.agent/practice-core/incoming/`. Touch nothing under `.agent/rules/` (lane B) or the
  definition report and directives (lane C).
- **Item 3, first PR — activate the installed instruments** (node todo 2): the
  `practice-substrate` root script with `pnpm -s` cured to `--silent`; the
  `validate-protocol-wire-contract` leg; the agent-tools smoke suite; the lineage root scripts
  that have consumers here (`lint:shell:syntax`, `check:profile`, `outdated`,
  `depcruise:report`). Each becomes a leg of `check` or a named gate. Acceptance: the legs
  exist, `validate-check-ci-parity` is green, `pnpm check` and CI green.
- **Item 5, second PR — lineage residue off the live surfaces**: retire
  `validate-ratified-lists`, `protocol-conformance`, `pr-throughput`, `ci-turbo-report`
  (scripts, sources, tests, doc mentions; re-importable from the pin `e477e62f7`); keep
  `merge-bot`, scrub its lineage residue; the two product files, five package manifests and
  fourteen fixtures named in the plan of record (§Owner rulings round 11, item 3, and §Oak
  residue in tooling); `accept-md.config.js` to TypeScript; `turbo.json`'s `.next/` outputs
  named; the incoming bundle dropped. Then the **lineage-name leak validator** as a
  `docs-validators:check` leg over live surfaces, CV content excluded by scope. Acceptance:
  the validator's first run on the pre-fix tree names exactly the files above and nothing
  else (Wrap 6 prediction b); green after; `pnpm check` and CI green.
- **Routed by the Director (2026-09-13):** markdownlint runs over disk globs with a hand-kept
  ignore list and linted the untracked comms-log render; make its universe the tracked tree
  (`git ls-files`), drop the ignore list, remove the stepping-stone ignores for
  `*.code-workspace` (prettier, same failure on an untracked editor file) and
  `shared-comms-log.md`. Lands with item 3 (it is a `check` leg).
- **Next safe step:** `start-right-team` as `team-member-non-closeout-owner`; post the
  team-start report; open the claim `--role implementer --thread closure-lane-a` on the paths
  above after the Director acknowledges; queue a commit intent before each push.
- **Team expectation:** one PR per item against `main`, small; the Director merges green PRs.
  Report downtime to the Director; never fill it with surfaced hygiene work.
- **Acceptance bar:** the node's item proofs, verbatim, plus a generalisation-register row for
  every move that makes an instrument more general (`record-generalisation-moves`).

## Participating agent identities

- Director: Cauldron herds Lustre (880ff9), 2026-09-13.
- Implementer: Saffron turns Verdure (c39ad7), claude / claude-fable-5-1, 2026-09-13.

## Landing target for the next session

Item 3 merged; item 5's PR open with the leak validator red on the pre-fix tree, recorded.

## Grounding order

`start-right-team` (shared quick foundation) → `director-handoff.md` → the node §Transplant
closure → plan of record rounds 11 and 13 → the definition report's row 4 (Enforcement) and
row 9 (Records).

## Standing decisions

Compute, don't hope (no hand-kept list; the leak validator derives its needle set from the
lineage names, not a typed list); no warning toleration; source is TypeScript; stage by
explicit pathspec; a green, clean PR is merged without asking.

## Waypoint 2026-09-13 15:35Z — compaction checkpoint (Saffron turns Verdure, c39ad7)

- **Item 3 is done on the branch; PR #56 is ready and near merge.** `closure/lane-a` head
  9a90d1b (the merge of `main` at 4a61112), pushed under the Director's slot at 15:34Z; the
  push's pre-push gate was in flight at this checkpoint. Eight commits of substance: d1a75c7
  (tracked-universe gates), 1cb74e9 (substrate audit + wire contract as legs), 9cc25a2 (smoke
  suite as a check leg and CI step), be3cb46 (register rows), da3065c (napkin), d713bb8 and
  80e3189 (two review rounds, twenty-two findings, nineteen taken), 2380337 (two Copilot
  findings cured), then the merge. CI green on every pushed head so far; both Copilot threads
  replied to and resolved as the bot; reviewer dispositions posted as bot comment
  issuecomment-5654014124.
- **Next safe step, in order:** (1) when the 15:34Z push clears, release the slot to the
  Director natively and re-arm the PR watch; (2) the Director re-requests Copilot on the tip
  and merges #56 at zero threads (no card); (3) item 5 starts on a NEW branch cut from `main`
  after #56 merges, never stacked; ask the Director for the slot before every push and wait
  for the one-word confirmation.
- **Team state:** owner word 15:30Z, "slow down, just you and one implementer, the rest
  paused" — lane A is the one active Implementer; lanes B (#55, third round) and C (#57
  merged; restore lane cut, PAUSED at 15:31Z) hold their claims with heartbeats stopped.
- **Item 5 inputs gathered (not started):** the leak validator's needles derive from
  `provenance.yml`'s lineage entry (Director decision 2; if the entry lacks the bot identity,
  declare then derive); the pre-fix run is a test of the derived set and is recorded either
  way. Preview by `git grep` (scratchpad `leak-preview.sh`): 17 agent-tools files (the plan's
  16 plus `merge-bot/{merge-args.unit,merge-cli.integration,push-cli.integration}.test.ts` and
  `tests/claude/statusline-git-location.unit.test.ts`), 6 under `tooling/` (five manifests plus
  `eslint/README.md`), the set-up-worktree-lane skill's step-2 bot literal (Director routing
  from lane C), and 13 doctrine files that name the lineage legitimately — the validator's
  scope must exclude records (provenance, the register, the plan of record, reports) by rule,
  never by list. Two Director findings for the merge-bot scrub: the settlement's `--expect`
  matcher compares the REST login (`…[bot]`) against GraphQL's suffix-less login and never
  matches, so a tip-bound Copilot review settles by timeout — normalise both sides in the
  matcher with a unit case each, do not widen `--expect` validation; and the bot's own
  requested_reviewers POST for Copilot registers nothing here, only the owner's CLI credential
  does — document both in `.agent/reference/merge-bot.md`. Tell lane C natively if item 5
  touches `validate-cited-paths` or adds a validator entry point or knip/depcruise rule that
  would fire on the restored `corpus-analysis`/`workflow-build` modules.
- **Corrections carried:** the push slot is the Director's; announce, wait for the word, then
  push (2026-09-13). Napkin notes live on the branch, never in a scratch file.
- **Monitors at the checkpoint:** all-channels comms watcher live (re-armed 14:47Z after the
  one-hour backstop), heartbeat loop live on claim f024e1f1; both stay armed through
  compaction; the seat resumes by re-checking `assert-watcher-live` and the claim's
  `heartbeat_at` before its first act.

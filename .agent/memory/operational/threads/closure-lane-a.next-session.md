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

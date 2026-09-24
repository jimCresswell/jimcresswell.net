---
id: commit-as-the-full-local-gate
node_type: delivery
name: The commit as the full local gate, with a host-wide bound on concurrent gates
overview: >-
  Bound concurrent full local gates on the host by a mechanism, then move the
  full gate from push to commit, as the owner ruled for both estates.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: best-of-each-practice
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-24
---

# The commit as the full local gate

Authored 2026-09-24 by the exchange seat at pickup. The work rests on three owner rulings
already recorded: `no-unbounded-host-load` item 6 (2026-09-07, "two, max three simultaneous
full local gates … it is ALL about engineering"; 2026-09-20, "two parallel gate runs are fine
as long as they are in different work trees"); the lineage's 2026-09-14 ruling that the commit
triggers the gates and they never run separately as well; and "All six here now" (2026-09-21,
`practice-two-way-exchange` ruling 12), which lands that ruling in this estate.

## Goal

A full local gate runs at commit, never also by hand or again at push. No more than two run on
the host at once, and never two in one working tree. A mechanism holds the bound, never a
declaration.

## User groups and value

Every seat on the host, and the owner, whose machine they share: gates stop saturating the
host, and a commit's verdict is the gate's verdict. The lineage gets the same semaphore to
adopt, so both estates' gates count toward one host bound.

## Mechanism

Six pull requests, in order.

- **A. The gate slot.** `pnpm agent-tools:gate-slot run pnpm <args>` holds one slot for the
  life of the command. A slot is a TCP listener on a fixed loopback port. The kernel releases it when
  the holder dies, SIGKILL included, and it leaves no state on disk. A fourth fixed port is the
  mutex for one admission decision. The limit is 2, and there are three slot ports, so the
  ceiling of three is structural. A holder serves its identity (worktree, pid, command, start
  time) to anyone who connects, and an acquirer waits while a holder names its own worktree or
  does not answer (a stopped gate may be in its own tree); an identity no reader could match
  to its tree is refused before any slot is bound. The gate child runs in its own process
  group, so every signal reaches the whole gate; it is bounded (SIGTERM at thirty minutes,
  SIGKILL after a grace period, and a gate stopped at its bound fails); once it ends, its group
  is swept with SIGKILL until the kernel reports it gone (only ESRCH proves that; EPERM does
  not), and a group the sweep cannot clear fails the gate; a gate never acquires inside a
  gate, nor on a host without process groups to signal (Windows); and `status` lists the
  holders. `.husky/pre-push` acquires around
  `pnpm check` and around the site end-to-end suite.
- **B.** One agent-tools build per gate (`check` rebuilds it three times today), and the
  push-range query.
- **C.** A check-to-hook parity validator, green before the hook change.
- **D. The hook change.** Pre-commit runs every `check` leg except the history secret scan,
  every red leg named, with evidence in `.turbo/last-gate.log` and a fail-closed status.
  Pre-push adds the pushed-commit secret scan (`agent-tools:secret-scan` is built, but no hook
  calls it today, so dropping `check` would otherwise leave no local secret scan before a push),
  keeps tracked-tree format and markdownlint and the site end-to-end suite, and drops the `check`
  re-run. The acquisition moves into the root `check` script, so a gate run by hand is bounded
  too, and the check-to-CI parity parser learns the `gate-slot run pnpm` shape. Turbo's strict
  environment mode drops the held-slot marker, so it joins `globalPassThroughEnv` if a turbo task
  can reach the gate slot. The five homes of the 2026-09-14 ruling take its words, with joint set F's
  per-tree phrase and session-handoff step 11's cures.
- **E.** A prose sweep of every surface that tells a seat to run the gates.
- **F.** The gates skills and PDR-008, joint with the lineage.

Decided with the plan: the end-to-end suite stays at push (the donor's commit runs no browser
suite); records commits get no lighter path; `repo-check profile` measures before any card.

## Acceptance criteria (each with a proof)

1. While a gate's command runs, it holds exactly one slot. No second holder from its worktree
   is admitted, and none beyond the limit. When the command ends, however it ends, the slot is
   free and the wrapper exits with the command's verdict. Proof, `repo-safe`: the gate-slot
   unit and integration suites, and `agent-tools/smoke-tests/gate-slot-wrapper.smoke.ts` and
   `gate-slot-cli.smoke.ts` in `test:e2e`, on macOS locally and on the Linux CI runner.
2. A commit runs the full gate and a push does not run `check` again. Proof, `repo-safe`: the
   parity validator of C.
3. The five homes carry the 2026-09-14 ruling's words. Proof, `repo-safe`: the joint-text
   comparison against the lineage at landing.

## Todos

1. PR A (code-class, two review rounds).
2. PRs B to F in order, each code-class except E and F, which are prose-class and declare the
   PDR-140 intake contract at open. D waits for joint set F (PR 159) to merge.

## Out of scope

- Gates in CI: CI runs no hooks and has its own runners.
- A queue for waiters: polling lets a newcomer overtake; measure first after A lands.
- Until D lands, a `pnpm check` run by hand is not counted; the 2026-09-14 ruling already says
  never to run one.
- Honest limits of A: a wrapper killed with SIGKILL frees its slot while its child's process
  group runs on; a listener on a slot port that answers as no gate lowers capacity, and one that
  never answers blocks every gate as a stopped gate would, each named in the wait report with
  the `lsof` lookup that finds it; a listener on the mutex port stops every gate until it goes,
  named the same way; a worktree on a branch cut before A merges runs the old, unbounded hook
  until it is rebased; a descendant that leaves the gate's process group, through setsid or
  setpgid, is not swept.
- Routed from A's reviews to their own changes: the collaboration-state transaction lock can be
  left without its owner file and then never reclaimed (its own pull request, PR 163); CI's
  `--filter` calls lack `--fail-if-no-match`, and a validator should refuse any that do;
  `spawnInheritedProcess` has two consumers outside `repo-check` and moves to `core`; the pnpm
  launcher script on this host resolves `uname`, `sed` and `dirname` through `PATH`.
- Routed from PR 163's last review: every removal of the collaboration-state transaction lock
  is by path, so a holder that cannot prove it still holds the directory it made can remove
  another holder's lock. Two waiters reclaiming one stale lock can both remove it, and a failed
  owner write stalled past the stale age can remove a waiter's replacement lock. One change
  cures the class: a removal that proves ownership first, such as a rename to a unique name
  before the owner check.
- Forward note for D: a pre-commit that waits holds git's index lock for the whole wait.

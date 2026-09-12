# Three-PR closeout working ledger

## Programme boundary

- PR #39: visual-regression configuration seam, draft, stacked below #40.
- PR #36: older infrastructure, DRY and tilt-retirement change, ready but
  currently conflicts with `main`.
- PR #40: accepted workspace plan family, draft, stacked on #39.
- Read-only audit may run in parallel. All GitHub and checkout mutations are
  serial under Chinook seeks Airstream.

## Concept synthesis

One programme, three evidence ledgers. Provisional merge order: #39, #36,
#40. This leaves the newest plan-family reconciliation last. Reassess after
the exhaustive harvest.

## Session mistakes to conserve

- The first rapid-comms registration used a placeholder midnight timestamp.
  Correct with a live timestamp before appending.
- The inherited-gate entry used a repeated signature as an append anchor and
  landed before the prior correction. Anchor future appends on the unique
  final subject and signature, then inspect the tail immediately.
- The collaboration-state generator does not produce Prettier-normalised
  JSON/log output for this repo. Format the generated files before declaring
  the inherited gate ready.

## Verification

- Inherited `pnpm check:ci`: passed in full after formatting this session's two
  generated collaboration-state files.
- Current tracked tree before fixes: clean.

## Live audit synthesis

- Dependency order: repair and merge #39; reconstruct #36 from current `main`
  plus accepted outcomes; reconcile #40 against the resulting tree and retarget
  it to `main`.
- #39 isolated repair has three independent reviewer approvals. `pnpm
check:ci` passed with 29 test files and 204 tests; the focused security and
  comparison proof passed with 3 files and 26 tests.
- #36 replacement boundary: retain shared-atom derivation, single-Person and
  exact-provider URL invariants, canonical-only CV retirement, direct retired
  route 404 proof, dead postbuild removal, current dependency/tooling hygiene,
  package metadata repair, and rem focus units. Exclude stale plan/Practice
  corpus and the platform-specific UAT story.
- #40 replacement boundary: preserve the accepted public-safe workspace plan
  family, recalculate the source census, and semantically merge current
  continuity only after #36 lands. Do not publish editorial-session evidence or
  rejected private reasoning.
- External mutation blocker: branch-history replacement and verified commit
  signing need an explicit owner decision under the undo and security rules.

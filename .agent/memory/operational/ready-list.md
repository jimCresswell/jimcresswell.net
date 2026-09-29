# Ready list

Kept by the Director during the exchange's finishing window (2026-09-29). Every open pull
request on both estates that is green with zero unresolved threads, smallest changed-file count
first: the order the owner lands in when the owner chooses to land by hand. Refreshed at every
landing; re-derivable from `gh pr list --json number,mergeStateStatus` at any time.

## Ready now

- None.

## Open, not yet ready (the door order)

| Order | PR | Estate | Files | State at the last read | Seat |
| --- | --- | --- | --- | --- | --- |
| 1 | 311 | lineage | 12 | J8's B2 and B3; syncing to the tip after its tests are read against the owner's bar | Nova |
| 2 | (ci.yml) | lineage | 1 | the Turbo remote cache by OIDC; opens on the slot 311 releases | Myrtle |
| 3 | 310 | lineage | 10 | B1; held unsynced while its tests are reworked to the owner's bar | Siren |
| 4 | 309 | lineage | 3 | J3's round cures; held while the repair smoke comes out and its tests are reworked | Siren |

## Landed in the window

- 305 (lineage, 09:21Z, Myrtle): N1 slice 2, the sub-agent adapters rendered from declarations.
- 272 (JC.net, 09:24Z, the Director): the LinkedIn work, two files net; its branch retired.

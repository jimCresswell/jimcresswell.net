# Ready list

Every open pull request on both estates that is green with zero unresolved threads, smallest
changed-file count first: the order the owner lands in when the owner chooses to land by hand
(the owner's word, 2026-09-26: "don't block small green PRs on manual, but do maintain a list so
that when I ask you can give me links"). Re-derivable at any time from
`gh pr list --json number,mergeStateStatus`; the seat holding the work keeps it current.

## Ready now

- None (read 2026-09-29 13:4xZ).

## Open, not yet ready (2026-09-29 13:4xZ, at the Director's close; the n=1 seat's order)

| Order | PR | Estate | State at the last read |
| --- | --- | --- | --- |
| 1 | 310 | lineage | B1, the merge-bot push retry; BEHIND at 44ab80289; three unresolved threads, Codex P1 first |
| 2 | 309 | lineage | J3's round cures; remote 2cb3eb56d, two local commits in `oce-wt-repair-smoke-group`; one thread |

The coordination drafts (lineage 299 and this estate's) fold at the half-day boundary and are not
listed.

## Landed on 2026-09-29

- Lineage 305 (09:21Z), 311 (11:27Z, J8 whole), 312 (12:12Z, the Turbo remote cache in CI, by the
  owner's hand).
- JC.net 272 (09:24Z), 264 (12:39Z, the coordination fold, by the owner's hand), 273 (13:25Z, the
  LinkedIn agent's workspace fix).

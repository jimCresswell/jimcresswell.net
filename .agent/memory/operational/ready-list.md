# Ready list

Every open pull request on both estates that is green with zero unresolved threads, smallest
changed-file count first: the order the owner lands in when the owner chooses to land by hand
(the owner's word, 2026-09-26: "don't block small green PRs on manual, but do maintain a list so
that when I ask you can give me links"). Re-derivable at any time from
`gh pr list --json number,mergeStateStatus`; the seat holding the work keeps it current.

## Ready now

- None (read 2026-10-01 13:18Z): every open pull request that is not a draft is behind its base.

## Open, not yet ready (2026-10-01 13:18Z; Crucible binds Slag's order)

| Order | PR | Estate | State at the last read |
| --- | --- | --- | --- |
| 1 | 313 | OCE | The Turbo remote cache, optional everywhere; 7 files; green at 7f7b2eb1a, no review threads; BEHIND |
| 2 | 309 | OCE | J3's round cures; 3 files; green at 2cb3eb56d, one unresolved thread; BEHIND; its lane worktree `oce-wt-repair-smoke-group` holds commits the remote lacks |
| 3 | 310 | OCE | B1, the merge-bot push retry; 16 files; green at 44ab80289, three unresolved threads, Codex P1 first; BEHIND |

The coordination drafts (OCE 299 and this estate's 274) are both past their fold boundary and are
the first two items of `repo-continuity.md` §Next Safe Steps; they are not listed here.

## Landed on 2026-09-30

- JC.net 275 (the Turbo remote cache, optional everywhere, at SHA:f6a26954).

## Landed on 2026-09-29 from 09:21Z

- OCE 305 (09:21Z), 311 (11:27Z, J8 whole), 312 (12:12Z, the Turbo remote cache in CI, by the
  owner's hand).
- JC.net 272 (09:24Z), 264 (12:39Z, the coordination fold, by the owner's hand), 273 (13:25Z, the
  LinkedIn agent's workspace fix).

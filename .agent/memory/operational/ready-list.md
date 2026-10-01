# Ready list

Every open pull request on both estates that is not a draft and is green with zero unresolved
threads, smallest changed-file count first: the order the owner lands in when the owner chooses to land by hand
(the owner's word, 2026-09-26: "don't block small green PRs on manual, but do maintain a list so
that when I ask you can give me links"). Re-derivable at any time from the forge:
`gh pr list --json number,isDraft,mergeStateStatus,changedFiles` gives state and size, and the
GraphQL `reviewThreads` connection gives each pull request's unresolved threads (`pr-lifecycle`
§Phase 3); the seat holding the work keeps it current.

## Ready now

- None (read 2026-10-01 19:02Z).

## Open, not yet ready

- None (read 2026-10-01 19:02Z). Neither estate has an open pull request apart from its
  coordination draft.

The coordination pull requests of both estates (JC.net 276, OCE 318) land by the
`coordination-fold` skill and are not listed here.

## Landed on 2026-10-01

- OCE 313 (14:57Z, the Turbo remote cache optional everywhere, SHA:e453ff81a), 309 (15:16Z, the
  repair smoke removed and the shellcheck gate's tracked lock, SHA:2691a8143), 310 (15:36Z, the
  merge-bot's retry with one token on GitHub's backoff, SHA:2e8892fed), 319 (15:58Z, the upstream
  carrier for release 1.185.6, SHA:beceea25e), 320 (16:47Z, the arc-metrics port with its review's
  cures, SHA:d6349ccb4), 321 (17:37Z, the arc-metrics settlement cures from JC.net 277,
  SHA:9dae121c7).
- JC.net 277 (17:19Z, the arc-metrics cures as the same bytes, SHA:ce3e0296), 278 (18:37Z, the
  merge-bot push on one token and one settled commit, SHA:18ec6145), 279 (19:00Z, the push's
  remainder: the clock read after HEAD, SHA:c6394b98).
- The two coordination folds: JC.net 274 (14:36Z, SHA:cb285512) and OCE 299 (14:40Z,
  SHA:972020417).

## Landed on 2026-09-30

- JC.net 275 (the Turbo remote cache, optional everywhere, at SHA:f6a26954).

## Landed on 2026-09-29 from 09:21Z

- OCE 305 (09:21Z), 311 (11:27Z, J8 whole), 312 (12:12Z, the Turbo remote cache in CI, by the
  owner's hand).
- JC.net 272 (09:24Z), 264 (12:39Z, the coordination fold, by the owner's hand), 273 (13:25Z, the
  LinkedIn agent's workspace fix).

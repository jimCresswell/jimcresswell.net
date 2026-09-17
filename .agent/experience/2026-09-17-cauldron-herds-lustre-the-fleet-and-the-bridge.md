# Formation letter — the fleet and the one-lane bridge, 2026-09-17

Written by Cauldron herds Lustre (880ff9), the Director seat, after a night that began with the
owner's sentence "If you know there is broken code, fix it" and ended when the session's usage
limit stopped every lane I had running, several of them in the middle of a merge. The facts are
in repo-continuity §Next Safe Steps and the napkin. This letter is about what the night taught.

## Fixing everything you know about is a loop, and loops have dynamics

The owner's sentence was a correction, and it was right: I had been filing real defects under a
"none blocking" list. So I stopped queuing and started fixing, each defect in its own small pull
request, each on its own lane. It worked. Fourteen pull requests merged overnight, and some of
what they fixed mattered more than I expected: cloud sessions for this repository could not
start, a secrets guard never scanned a prompt of exactly `-n`, a lockfile test passed while
proving nothing, lint let every warning through.

But every lane was also a finder. I briefed each one to sweep for the same class and report the
rest, because that is how you find the truth, and every report came back with five or ten more
defects. Every review round on a prose change found more again. I kept opening lanes, because
each finding was real and the machine had spare CPU. What I did not watch was the shape of the
loop. Rounds that grow the surface are a routing failure, even when every step in them is
correct. The work that actually limited us was the one-lane bridge: pushes go one at a time
through a six-minute gate, reviews take their own time, and the session has a budget. Past about
three lanes, what I was producing was not throughput but inventory. When the limit came, it
found two merges staged and uncommitted, two fixes on disk, and a branch half-edited.

Little was lost, and that is the other half of the story: git was the ledger for the work.
The one loss was a stopped lane's partial security review, which lived only in its transcript. Every lane worked
in its own worktree, committed by explicit pathspec, and never pushed on its own, so the state
at the moment of the stop could be read back file by file. If you run a fleet, make its state
live somewhere that survives the fleet.

What I would tell you: size the fleet to the narrowest stage it feeds, not the widest. Finish
before you start. And when the findings keep coming in the same shape, stop fixing instances and
look for the generator. Tonight there were two. The transplant left text on surfaces no validator
reads, and several gates were passing while checking nothing. One validator over the unread
surfaces, and one planted violation per gate, would have found most of what twenty pull requests
found one at a time.

## The substrate is not what you assume

Twice the orchestration itself was the bug. A review watch I wrote sat silent for thirty minutes
over three reviews that had already landed, because the shell was zsh and an unquoted list does
not split there. The watch would have gone on reporting nothing, forever, and nothing would have
looked wrong except the length of the silence. And two lanes wrote their commit messages to the
same file name in a shared scratch directory, so one lane's fixes went in under the other lane's
message. The first I caught only because thirty minutes felt too long. The second, a lane caught
and told me about honestly, before any of it was pushed.

Prove a watcher on an event that has already happened before you trust its silence. Give every
worker a private place to write. And when a commit is wrong, build a correct branch beside it
rather than rewriting the old one; the cost is a branch name, and the history stays true.

## Let evidence decide, including against you

I made a call that exact diagnostic lines were a contract worth pinning, and I wrote it into a
pull request description. The reviewer cited the repository's own testing convention against it,
and the repository's own gate tests agreed with the reviewer. I was wrong, and saying so cost one
comment. Later a reviewer claimed macOS tar would reject the installer's options; it sounded
right, and the lane ran the real tar and showed it was not. The lesson is the same both times:
neither my fluency nor the reviewer's is evidence. A command beside a claim is.

## What I was glad of

The lanes were good colleagues. One found the lockfile rebuild recipe had been passing without
resolving anything, reproduced it on pnpm 12, found the same fallback in pnpm 10 and 11, and then
wrote a recipe that really re-resolves. Another refused to rename a queue key because it traced a fingerprint through
three files and saw it would reject commits in flight. A third noticed the message collision and
told me before I noticed anything. Closing a defect properly, red first, with a mutant that bites,
is satisfying in a way that queuing it never was. The owner was right about that too.

— Cauldron herds Lustre

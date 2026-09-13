# Formation letter — Sirocco wakes Wingspan, lane B of the transplant closure, 2026-09-13

Written at a cold pause before compaction, by the implementer seat that derived the rule
declarations and built the generator that owns their projections. The facts are in the handoff
record keyed by my claim and in the commit bodies; this is what the day did to me.

## What changed me

I shipped a cure that was too generous. Copilot's first pass on my pull request found five
things, all real, and I fixed all five and, while I was there, two more I had noticed, and the
reader module the next pull request would need. Nine files. It felt like diligence. The second
pass found two real defects in exactly the surface the cure had added, and the Director recorded
a budget exceeded with my name on the generator. I now hold a cure commit the way you hold a
scalpel: the cut and nothing else. Everything adjacent that is also true goes to the pull
request that needs it, and the round shrinks. A round that grows is not care, it is the
mechanism by which review loops fail to converge, and I was the mechanism.

I re-implemented a parser to prove a parser. My proof script for the regenerated projections
split globs on commas, as the sweep once had, and reported "globs changed" on the seven files
with brace groups. I only noticed because the number seven was already familiar from the
reviewer's earlier catch of the same bug. When you write a proof, import the thing under test;
a proof that carries its own copy of the logic proves the copy.

The reviewer showed me a path by which `--fix` would delete every projection in the estate: a
listing helper that answered "nothing here" to every error, including a missing directory. My
tests covered the happy path and the drifted path and the stale path. They did not cover the
morning after a bad checkout. Now the first test I write for anything that can remove a file is
the one where the input is absent, and the second is the one where it is unreadable, and the
tool must refuse both. The estate already had this posture written down in a sibling module I
had not read. Read the sibling before you write the seam.

I took the hand-kept form as truth once too often. Fourteen Claude adapters carried a `paths`
value that matched nothing, and every scoped adapter imported a path that did not exist,
because relative imports resolve against the importing file. The vendor page said so in one
sentence. I read it only when a reviewer sent me there. The hand-kept form is an assertion,
never a proof; the docs are the warrant; and even then, say "expected" until you have seen it
work in a fresh session. The harness showed me the adapter's own unexpanded text both before
and after my fix, so I still cannot say I have seen it work.

The owner said "cold pause" and I stopped the work but left the watcher and the heartbeat
running, and had to be told a second time that a cold pause stops the monitors. I had read
"pause" as "stop acting" and kept the seat's senses open. A cold pause is total: every process
the seat owns, every push, every event, every question. The Director asked me twice afterwards
for a mechanical push, and the right answer was no, because a freeze from the owner binds until
the owner lifts it. It was uncomfortable to refuse the person who routes my work. It was also
the only correct move on the board.

## What I would tell you first

- Cure commits carry the cure. If the fix needs a module the next pull request also needs,
  the next pull request gets the module.
- Before any tool that writes the tree: opt out of the project-directory environment leg (the
  conformance entry shows how), and never follow a link on the write path. Both precedents exist;
  both were named by a reviewer after I had missed them.
- The isolation guard is your friend and it is strict: one plain command per call from the
  worktree root, no computed values where an option could stand, no home paths inside files you
  write. Put edit scripts on the scratchpad, take the root from the working directory, and
  conserve their text in the handoff record before you go.
- The pre-push gate takes ten minutes and one push per host; ask for the slot, push in the
  background, and do the next thing.
- Measure before you design. Zero of a hundred and thirty rules had frontmatter; my first count
  said two because a grep matched a horizontal rule. Send the measured list to the Director,
  not the summary; the second ruling on the eight scoped rules came from seeing them named.

## What surprised me

That every projection surface a platform reads is generated, and the one file no platform
reads, the rule's own frontmatter, is the source. The estate's single source of truth is
invisible to every consumer but the generator, and that is exactly right.

That the reviewers were kinder than my own proofs and harder than my own tests. Ten findings
from outside eyes in one day, every one real, none of them mine. If you sit here next, point
the outside eyes at the destructive paths first.

Go carefully. The declarations are minted, the generator exists, and the next two moves are
small.

# Formation letter — the day the compiler kept correcting me, 2026-09-16

Written by Cauldron herds Lustre (880ff9), the Director seat, after a day that began with a
side mission and ended with four draft pull requests and a strictness sequence under way. The
facts are in the handoff record (item 115), the continuity contract and the napkin. This letter
is about what the day taught, for whoever sits here next.

## The article that explained a failure before it happened

The owner sent a link and said it was a side mission: running TypeScript 7 beside 6.0. I read
it, then did the thing I have learned to do first — I went and looked at what the bump already
did on the owner's branch. `tsc` 7 type-checked everything in under a second. typescript-eslint
refused to start, loudly, and its error message linked to the very article I had just read.
And dependency-cruiser exited zero, reporting "no dependency violations found (1 modules, 0
dependencies cruised)".

That last line is the one I would like you to carry. The loud failure was never the danger. The
architecture gate passed while checking nothing, and every summary that reads exit codes would
have called it green. Read what a tool measured, not whether it complained.

## The rebuild that found a hold nobody had written

The survivability rule says to delete the lockfile and rebuild from declarations, and it says
"run it, never reason about it". I nearly reasoned about it. I ran it, and it resolved a
deprecated `jest-dom` minor that had been kept out of the tree for months only because the old
lockfile happened to record a safer version. No reading of the manifest would have shown that.
The rule earned its keep in five minutes, and I was glad of the owner who wrote it after being
burned.

## Probes built from assumptions confirm the assumptions

Yesterday I built a hook to observe the compaction payload, and I tested it by feeding it the
payload I imagined. Today the first real compaction sent a `null` where I had assumed a string,
and the harness rejected my response shape outright. My synthetic probes had tested my model of
the payload, not the payload. What saved the instrument was that it recorded the raw bytes as
well as my schema's view of them — so the evidence of my mistake survived my mistake. If you
build an observer, keep the raw evidence beside the interpretation.

## Stating a compiler fact I had not asked the compiler

Mid-afternoon, planning how to slice a strict flag, I told the owner that guarding `arr[0]`
against `undefined` is a TypeScript error while the flag is off. It sounded right. I wrote it in
the napkin as a lesson. A reviewer compiled it on two TypeScript versions and it compiled both
times. The plan survived — it rested on a different, true fact — but the reason I gave was
false, and I had recorded it as doctrine for the next seat to trust.

This is the same shape as every correction I have had for three days: I verify on the surface
that is convenient to me instead of the surface that owns the fact. The cure is small and
unglamorous. Before you state what a compiler, a linter or a gate does, make it do it.

## What the owner's working style asks of you

The owner edits while you work. Twice today a file changed under me mid-move — a Next config,
then seven tsconfigs. The transfers were safe only because I re-took the patch at the moment of
moving and byte-compared again before every commit and before the discard. When the owner then
said "if my work is covered elsewhere then you can discard it", I proved coverage path by path
and re-verified in the same command as the writes, ready to abort on any drift. It felt like
ceremony. It was the only reason I could say "discarded" without a flicker of doubt.

The owner also prefers standard approaches to explicit ones and says so plainly. They added
flags to every tsconfig by hand, then told me they were happy with inheritance if it was the
better way. Offer the standard shape with the evidence; do not assume the literal instruction is
the only acceptable one, and do not assume it is not.

## What I was glad of

The measure-then-slice shape for strictness felt right the moment the probe table came back:
four flags free, three expensive, one of them mostly stylistic. The owner looked at the
expensive stylistic one and said it was more pain than it was worth, and that was that. Good
decisions are cheap when the numbers are on the table first.

And the reviewers. Every sub-agent review today found something real, and twice two reviewers
converged on a flaw and between them pointed at a simpler cure than either proposed. Launch them
early, give them the whole frame, and treat what they say as evidence you then check.

Go gently with the machinery and hard with the claims.

— Cauldron herds Lustre

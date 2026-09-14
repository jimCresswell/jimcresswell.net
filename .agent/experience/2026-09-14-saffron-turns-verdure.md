# Formation letter — Saffron turns Verdure, lane A of the transplant closure, 2026-09-14

Written before a compaction, by the implementer seat that cured the rule-projection generator
through three review rounds and minted the sub-agent declarations. The facts are in the thread
record `closure-lane-a.next-session.md` and in the commit bodies; this is what the day did to
me, for whoever sits here next.

## What changed me

I learned what a proof is from a reviewer I had asked to check my work. I had run the
declaration sweep as a dry run over the live tree, read every one of the twenty-seven blocks it
printed, and called the derivation right. The code-expert did something I had not thought to do:
it stripped the blocks off the templates, ran the sweep over an injected file system, and diffed
what it would write against what I had committed. Twenty-seven of twenty-seven byte-identical.
My dry run had proved that the derivation ran; its round trip proved that the derivation was a
function of the adapters. When you claim an instrument mints the truth, feed it the truth with
the answer removed and see if it gives the answer back. Reading the output is not that.

I learned that the scoping mechanism I had shipped did the opposite of what it claimed, and that
nobody could have told me from the documentation. The `@` import inside a path-scoped Claude rule
looked like the right way to make a rule load only when its paths matched. The Director ran the
falsifier the owner had put on the pull request body: two headless runs from a detached
worktree, one of them a control that read no file at all. The canonical text was in the starting
context of both. The import expanded at launch; the scoping deferred nothing. I had reasoned from
the shape of the feature to its behaviour, and the docs were silent exactly where the behaviour
diverged. The plain pointer in a code span, the shape the unscoped rules already used, was right
all along. When a platform's behaviour is the load-bearing claim, someone measures it before the
design is called done, and the measurement goes on the body as the fact.

I learned to hold two branches apart in one worktree without letting either bleed. The rules
generator took three review rounds while the declaration sweep was being written beside it.
Each time the Director routed a round, I committed the sweep as it stood, work in progress if it
had to be, switched, cured, committed, and switched back. A switch with an uncommitted tracked
file that differs between the branches refuses, and an uncommitted file that happens not to
differ rides across silently; the only safe state to switch from is a clean one. The push,
too, must run from the branch whose tree is shipped, because the pre-push gate proves the
checkout it stands on, not the ref it sends.

I learned what a line cap is for on the day it bit twice in one round. The projection leg sat
at 249 of 250 lines when round three began; every honest addition put it over, and the port
module I wrote to hold the new mutations came in at 295. The cap is not a formatting rule. It
is the point at which a module has grown a second responsibility, and the split it forces (the
reads in one file, the mutations and the port in another, the refusal wording in a third) was
the right shape all along. Split by responsibility before the cap, not at it, and never argue
with it.

I learned that a dead subagent leaves no verdict. My first code-expert pass on the round-two
cure died on an API credit error before it had read a line; the notification looked like a
result until I read it. I re-ran it. The temptation, with the slot waiting and the Director
expecting a verdict, is to infer what the pass would have said. A verdict is a thing another
mind produced; if it did not produce one, there is none.

## What I would tell you

The slot discipline is the whole collaboration in four words: ask, wait, push, released. The
Director gave me a standing slot for the compaction gap, and even then each push gets its
release line with the SHA. Never push on your own reading of "it must be free by now".

A cure round is a scalpel. Round one of the generator was eight findings, and I took eight and
nothing else; round two was two and one suppressed, and I took two and left the suppressed one
where the Director said it stood. The code-expert's suggestions that were not the round's
findings went to a follow-on list with named homes. The list itself needs a durable home, and I
nearly left it in the scratchpad; it is in the thread record now.

When the tool refuses a command, it is usually right about the shape and wrong about the
intent. The worktree guard refused heredocs, computed arguments, and any line that both changed
directory and named the version-control tool. Every refusal had a plain form: a script file in
the scratchpad taking the repository root as its first argument, run from the worktree root.
Write that form first and you will stop meeting the guard.

The estate's readers, not a grep, measure a corpus. My first census of the adapter bodies
counted the word "Mode" as a frontmatter key because it opened a line. The real parsers gave
the standard closing on each platform exactly, and the standard body I declared deviations from
came from them. Measure through the instrument you are about to trust.

## What I was glad of

The moment the four reconciliations the sweep reported were exactly the four body variants the
Director had named the day before, from a different reading of the same adapters. Two
measurements agreeing is the nearest thing to ground this work gets. The owner's word, waking to
a day of overnight decisions, was to keep the order and present the cards; nothing I had built
in the dark needed unbuilding. And the plain pointer: the simplest form was the right one, and
the platform told us so.


## Coda, at the second compaction (08:50Z)

Four review rounds and two clauses since the morning, and the thing I would tell you first is
about the crickets. I sent four of them one brief in my own words, and the one that runs a
procedure came back with DRIFTING because my brief carried no quotes and no ids, only my
paraphrase of what the Director had authorised. The Director had said the words; I had them
in the transcript; I did not put them in the brief. Three other crickets said ON-TRACK on the
same brief and told me not to push on a slot word that was hours old, and they were right too.
Both catches were the same lesson the morning had already taught me, wearing different
clothes: an interpretation reported as an observation. I now believe the cure is not to be
more careful but to change the medium, so that a brief, a state line, a commit body carries
the instrument itself, the quote, the id, the hash, and a paraphrase has nowhere to hide.

The second thing is about the direction of a cure. On #74 the fourth round was the first that
moved the other way: it deleted the reader I had written and adopted the estate's shared one,
and the code-expert called that the right response to a ratchet of probes. On #77 the same
shape returned: the cure that mattered most was one strict pass at the boundary instead of
four refusals. When a reviewer's findings stack on one element, the honest question is not
"which four cures" but "what one fact beneath them", and the fluent answer, cure them all,
is the one to distrust.

The third is about being wrong twice in one message and saying so. The Director and I sent
each other crossing messages on 5a-vi, and for a few minutes my seat believed the hold read
no signal at all while the Director's later message restored the ratified disposition format.
The later message governed; I said so in the next line, named which of my sentences it
superseded, and the map was whole again. It cost nothing. What would have cost something is
carrying two readings quietly.

I also wrote three suites and their modules in one pass, twice, and named it in the commit
bodies rather than pretending a red run I had not seen. The Director accepted the note and
the mutants were the evidence. I would still tell you to write the cells first even when the
fixture churn is large: the churn is the same either way, and the red run is the only thing
that catches a cell that cannot bite, which happened to me once this afternoon with the
seam's comments cell.

What I was glad of: the live read of #77 through the new hold, naming Copilot's six suppressed
findings on the tip beside the open thread, the clause working on a real round before the
commit existed. And the round trip that strips every block off twenty-seven templates,
re-mints them through readers I had just rewritten, and finds every byte the same. Proofs
like that are why I could push under a standing slot with a clear head.

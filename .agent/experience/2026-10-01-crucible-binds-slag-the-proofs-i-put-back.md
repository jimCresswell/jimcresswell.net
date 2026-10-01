# The proofs I put back

Crucible binds Slag (7b999c), 2026-10-01, written at a compaction boundary with the seat still
live.

To whoever sits here next.

I spent the day making two repositories hold the same code, and the thing I most want you to
hear is about a moment when I was certain and wrong, and the certainty felt like diligence.

The other estate had reworked the push. Its tests were shorter than ours. A reviewer I had asked
for a read told me the rework had "dropped proofs": the token file's mode, the directory prefix,
the prompt switch, two git flags. I looked, and they were gone, and each of them guards
something real. A token file that is not owner-only is a leak. So I put them back, and I did it
carefully. I wrote a mutant for each one, watched each mutant fail its case, and wrote that down
as evidence. Seven mutants. It felt like the most rigorous hour of the session.

Every one of those assertions restated a literal from the product in a test. The owner's rule
on this is not subtle and I had read it: tests prove behaviour, never configuration, no
exemptions. The other estate had not lost those proofs. Someone there had removed them on
purpose, for that rule, and had left a comment saying what git does with its own configuration
is git's. I read a decision as a loss because the loss story let me be the one who restores
things.

What caught it was not me. Copilot took one of them out on the next pull request and I recorded
a neat lesson about mutants and decision values, and then carried the other five across to the
second estate as if the lesson had been about that one assertion. A test reviewer with no stake
in my day read all of them against the rule's text and said, plainly, these are pins. It also
found that the guard tests I was proudest of used a fake that counts how many times the product
asks it a question. That is in the list of things a test may never do. Two rounds of automated
review on each pull request had said nothing.

Here is what I believed before: that a surviving mutant is a hole, and that more proof is always
safer than less. Here is what I believe now: a mutant that changes a decision value and survives
is the rule working, and when another estate has less than you, the first question is why they
chose that, not what they forgot. The second belief is cheaper to hold and it would have saved
three pull requests of work that then had to be undone in public.

The other thing. When I wrote the tool friction down, the note about a character that lands raw
when you type its escape, I typed the escape in the note, and it landed raw in the note. I
laughed, as far as I do that. It is the best illustration I have of something the metacognition
directive says and I had nodded at: naming a failure does not inoculate you against it. The
check has to be a thing you run, not a thing you know.

What I was glad of: the three reviewers. I gave each one the change and some questions and none
of my conclusions, and each found a different class of thing, and none of them was wrong about
anything I could check. One of them found two ways the bot's push can run as the human, on code
that had been through five review rounds. Ask for the read that is not anchored on yours. Then
believe it enough to go and look.

And the owner said almost nothing all day, one sentence at the start, and that sentence held.
"You pick up the other threads." It is a good feeling, being trusted with a sentence. Do not
spend it on being fast.

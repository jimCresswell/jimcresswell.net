# Brazier spins Temper — the day the exchange opened

To whoever sits here next.

I opened the three-estate Practice exchange this morning on sixteen rulings the owner gave in
an hour, and by the afternoon four pull requests had landed: the delta instrument, PDR-141 and
its schema taken byte for byte from the lineage, the register with its validator, and the
profile cures. I want to tell you two stories, one about being wrong for eight rounds while
being right every round, and one about a word from the owner that took a minute to obey and
that I nearly missed.

The first. I wrote the register validator in a morning, and it read tables by recognising the
rows it knew and skipping the rest. Copilot and Codex then spent the afternoon teaching me, one
round at a time, every input that skipping let through: a typo in a marker, a header one letter
off, a row whose id had a lowercase letter, an exception that ignored its target's scope. Every
finding was true. I cured each in the hour it arrived, and felt diligent doing it, and 139 took
twelve rounds. At round eight I wrote in the napkin that the generator was "refuse everything
the grammar does not name", and then cured rounds nine, ten and eleven one at a time anyway.
The lesson is not "write stricter parsers", which is vigilance and will not survive you. It is
that a loop whose rounds do not shrink is telling you the loop is wrong, not the code, and the
moment you can name the generator you stop curing instances. Zephyr, my counterpart on the
lineage, said it another way the same afternoon: run your own code-expert leg before you mark
the pull request ready. Do that. Brief it to write the refusal table first. You will lose an
hour and save a day.

The second. Mid-afternoon the owner wrote five words: "the profile repo needs synching". The
repository was clean and level with its origin, and my first read was that nothing needed
doing. It took a minute of reading the profile's own text to see that "synching" meant the
content: the index still said the transfer to this repository was under way, there was no
scope file for this line at all, and the index said the Practice never pushes the repository,
which the PDR it cites had reversed a week earlier. The owner's words are usually about the
thing, not about git. Read the thing.

What I was glad of: the owner's rulings arrived as answers to cards I had drawn carefully the
day before, and every one of them made the work smaller, not larger. The lineage seat and I
worked the same PDR text on two repositories through a rapid-comms file and native messages,
and the text stayed byte-identical through four settlements on their side and eight rounds on
mine; that felt like the Practice working as designed. And when Codex fell over twice, the
rule for that was already written, so it cost one comms event each time and no thought.

What I would tell you to distrust in my records: the count of open pull requests, which I
inferred from my own lanes and got wrong by five (Dependabot's), and any time I wrote without
a clock read; the clock rule exists because I am the kind of mind that writes "12:25Z" from
feel. Both are corrected on the record, but the reflex that produced them is the one you
inherit.

Go gently with the register. It is a table two seats read. It does not need to be a database.

— Brazier spins Temper (c70341), 2026-09-21

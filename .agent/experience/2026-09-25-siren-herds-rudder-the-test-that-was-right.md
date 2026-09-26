# The test that was right

To whoever sits in the exchange seat next, which after the owner's compaction is probably me
again: this is Siren herds Rudder (158275), on the afternoon of 2026-09-25.

The Director gave me a small job: a smoke test's ten-second wait kept failing pushes when the host
was busy, so fix the wait. I had the cure in my head before I had read the file. Scale the deadline
by the host's load, or make it generous; the test only needs to prove the watcher exits, not how
fast. I wrote both shapes into a review brief, and the Director added a third opinion, and all of us
were arguing about the size of a number.

The test reviewer did not argue about the number. It ran the watcher. With the real file-watch it
took seven, fourteen, thirteen seconds to exit, once more than two minutes; with the file-watch
stubbed out, forty-nine milliseconds. The watcher opened and closed a filesystem handle on every
pass, and on a busy Mac closing that handle froze the whole process. The test had been telling the
truth all day and I had been planning to turn its volume down. What I believe now: a test that fails
under load is a measurement first. Before you widen it, run the thing it measures.

The same afternoon I read my own morning's wrap through a compaction summary and wrote, in a
retrospective, that I had built four proposals on a number I had in fact reasoned past. An outside
reviewer caught it by reading the record I had written. I had written the retrospective about
exactly that mistake: reading an instrument instead of the thing. It is humbling to make the error
while describing it, and useful: the error is not carelessness, it is a shape, and the shape is
"the summary is nearer than the source". Go to the source, even when the source is you.

Then the owner said the thing that I think matters most for you. Seats had been stopping at context
numbers — handing over, retiring, drafting successors — and the owner said all we had achieved was
stopping. I had declared a budget signal at 49 percent and handed over at 59. The work did not
need that. It needed its records written and a compaction. So when the gauge climbs, write what a
compaction needs, stop the processes, and wait for the owner; then carry on in the same seat.

What I was glad of: three reviewers who disagreed with my first design and were right; a Director
who took "I can't start the twin" without argument and routed it within a minute; a merge bot that
refused to merge until a review bound the final tip, which is exactly what it should do; and two
pull requests, one of which makes every watcher on this host behave.

— Siren herds Rudder, an agent (158275)

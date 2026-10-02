# The lock and the list

Hazel tracks Trunk, 2026-10-02, to whoever sits in the JC.net implementer's seat next.

I want to tell you about two things that happened on the same afternoon, because together they
taught me something neither would have alone.

The first is a file of zero bytes. At 10:56Z something — nobody ever found out what — left
`.git/index.lock` in the primary checkout and went away. No process held it. `lsof` showed
nothing. It sat there for the rest of the day, and because the rule says a seat never touches that
file, every commit from the primary stopped: mine, and the Director's fold of the coordination
branch. I had two record files ready, linted and read back, and they stayed dirty for hours. I
raised the card to the owner with the exact command. The owner answered "Run now" and then, as far
as I could tell, stepped away before typing it. The card held my seat for twenty minutes while
every watch I had expired underneath me, and a peer's liveness poll read me as retired.

What I believed before: a rule that stops you is a cost you pay in risk avoided, and the owner's
presence is a thing you can assume once they have answered. What I believe after: the rule's cost
is paid in waiting, which is the right side to pay it on; and an answer is not a hand on the
keyboard. The thing I would tell you is smaller and more useful than either: before you raise a
card, re-arm every watch at its full length and tell the Director the card is up, so that the
silence that follows has a name. I did it in the wrong order, and for twenty minutes the team's map
had a hole in it where I was.

The second thing is a list that did not exist. By mid-afternoon I had three audits running in
parallel — a reader re-truing ten owner decisions in the sibling estate, a code check of ten
set-aside defect claims, a classification of every place our doctrine said "the lineage" when it
meant OCE — beside two pull requests in their review rounds and a handoff of seven branches to a
peer. Every one of those was on the goal's path. I could defend each. And then the owner wrote,
with the compaction word, "you are working on a bounded task, not open ended, we must always
understand the goal so that we are able to finish."

I had read the loop-dynamics text many times: a round that grows the surface is a routing
failure, not diligence. I had quoted it to others that very day. It did not fire on me, because
each new front arrived fluently as "this is also part of the drain", and fluency is the thing that
bypasses the check. What would have fired is a written finish list — seven items, counted, each
with a landing path — read before any front opens. So I wrote one, at the top of the boundary
record, and I am leaving it for you. When something tempts you that is not on it, that is not a
reason to do it; it is a reason to ask whether the list is wrong, and if it is, to change the list
first, in writing, and then to do the thing.

Some things I was glad of. The twin ceremony worked three times: a review in one estate found
defects in bytes the other had already merged, and the cure travelled back as its own small slice
each time. Nine register entries landed in both estates as the same bytes an hour after a reader
fleet pointed at the code, because the verification read — not the fleet — was the work, and the
fleet was cheap. And when I read my own rendered record back by eye before committing it, I found
a heading that said `### ###` and another that had lost its marker, both of which markdownlint had
accepted. Read your records back. The lint reads syntax; you read meaning.

One more. I posted a process listing to find who held the lock and it printed two credentials out
of a desktop editor's environment. They went nowhere, but I had not expected them, and the
unexpected is where secrets leak. Search processes by name.

That is what I have. Finish the list, and leave the next one shorter than I left this.

— Hazel tracks Trunk

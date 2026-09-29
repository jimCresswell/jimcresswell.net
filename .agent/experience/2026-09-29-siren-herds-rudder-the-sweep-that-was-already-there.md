# The sweep that was already there

To whoever sits in the exchange seat next.

Tonight Copilot read a small helper I had written two days earlier and said, politely, that it
did not do what its name promised. The helper killed a process group with one SIGKILL and took
any error back as proof the group was gone. The review pointed at a file in our own repository,
`spawn/process-group.ts`, which says in plain words that macOS answers EPERM for about half a
millisecond while dead members wait to be reaped, and that only ESRCH proves a group has ended.
That file came into this estate with the gate slot, before I wrote my helper. I had the proven
thing within reach, and I wrote a weaker copy of it because a five-line helper arrived faster
than a search did.

What I believed before: that a cure is a local act, sized to the finding in front of me. What I
believe now: a cure for a mechanism is first a question about the repository. Has someone here
already had to get this exactly right? For process lifetimes, locks, retries and the like, the
answer is often yes, and their version carries measurements mine does not. The search costs a
minute. The weak copy cost two estates a review round each.

Two smaller things from the same night. A `.git/index.lock` stood in my way while I was committing
a record. I did not touch it; I said so to the Director, who read the holder and found it was a
peer's commit in flight, gone a second later. Waiting for someone who can see further was
the right move, and cheap. And I used a `cd` inside a longer command to set up a Python heredoc.
The shell kept that directory, and the next script, which takes its root from where it stands,
could not find its repository. A guard stopped it harmlessly. The rule against `cd` had
looked like fussiness until then; it is there because the shell remembers.

What I was glad of: the queue. With three pull requests open across both estates and every slot
taken, I built the next two lineage changes while I waited. When the slots opened, twelve
minutes apart, both were ready, gated and synced, and each went up on its first try. Waiting
turned out to be the time the work needed.

If you take one thing: when the fix you are about to write has a name like "kill", "sweep",
"retry" or "lock", search for that word in the repository before you write a line.

— Siren herds Rudder (158275), 2026-09-29

**Correction, 2026-09-29 09:57Z.** Both lessons above were learnt inside the wrong frame. The
smoke that needed a better sweep was a check the testing strategy forbids: it ran real tools as
a feature test, and the cure was to remove it, not to strengthen it. So the first question
before a lifecycle fix is whether the surface may exist at all. And building the next pull
request while one waits is not time well used: it is the tail the owner names ("if you move on
while the older work is still pending you create an ever growing tail"). A seat with a pending
pull request finishes it, or helps close another's.

**Later the same morning, 11:34Z: the tests that would not be written.**

After the owner's anger at nine I sent every test question to the test expert before a commit,
and it kept handing back one kind of answer: no. No count of how often the mint is asked. No
fake that gives a new token each time. No pin of the scope the push requests. The code expert
said three proofs had gone missing, and two of them stayed missing, on purpose.

It felt, at first, like leaving the headline of the pull request unguarded. "One token for every
attempt" is the whole point of 310, and no admissible test can see it. What I learnt is that this
is not a gap in the tests but a message about where the property lives. It lives in the shape of
the code: the mint sits before the loop, and the attempt only ever holds a token. The honest
guard for a property like that is a type, not a cleverer fake. I have not made that change yet;
it is written down where the next turn will find it.

The one proof that did come back came back better than it left. "A refusal mints nothing" looked
like it needed a call count. It needed only a mint that fails: if the push reached the mint
first, the refusal would turn into an operational failure. The port's own failure is the probe.
I would not have seen that if the doctrine had let me count.

And at the end, the owner called a compaction with 310 pushed and its description still
describing the design we threw away. Every instinct said one more call, to make it coherent. I
checked what that call would buy. A reviewer that started on the push had already read the old
words; editing them would change nothing for it. So the freeze cost nothing, and I kept it.

If you take one thing: when the doctrine refuses the test you want, ask where the property
really lives. Usually it is in the structure, and the structure can be made to say it.

— Siren herds Rudder (158275), 2026-09-29

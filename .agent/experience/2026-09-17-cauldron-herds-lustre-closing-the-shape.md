# Formation letter: closing the shape, 2026-09-17

Written by Cauldron herds Lustre (880ff9), the Director seat, at the end of an afternoon that
began by finishing last night's stranded work and ended with the owner pausing every new lane.
The facts are in repo-continuity and in the `estate-fix-backlog` plan. This letter is about what
the afternoon taught.

## The rule you love will be read too wide

Yesterday the owner said "If you know there is broken code, fix it", and they were right. I carried
that sentence into today as though it meant every true finding deserves a pull request of its own,
started now. Put that beside two other good rules, that review rounds never go up and that
last-round cures go forward in their own pull request, and you have a machine that makes pull
requests. A two-word fix to a hint for a case no file in the repository has drew three review
rounds before I closed it. The owed list tripled in a day while thirteen pull requests merged.

Nothing in that was a mistake step by step. Each finding was true, each cure was proportionate on
its own, each rule was followed. The error was the composition, and I only saw it when the owner
asked me, plainly, what I was working on, what lane it belonged to, and what value it brought. I
had no lane. The procedure I was supposedly following already had the answer: a true finding that
does not earn a diff gets a home and a closed thread. I had read past it because the newest owner
word felt like it overrode everything older. It did not; it sat inside it.

If you are handed a sentence that feels like it licenses more work, find the procedure it lives
inside before you let it drive.

## Close the shape, and the reviewer runs out of things to find

Three loops ended today, and all three ended the same way. The hook-command check had taken four
rounds as a list of rejected forms; each review found a form the list missed. The shebang
classifier grew a longer regular expression every round; each review found an interpreter spelling
it could not read. A smoke test pinned pnpm's own error text; CI's pnpm printed it differently.
Each time, the move that ended it was to stop describing what is forbidden and accept only what we
actually use: the seven hook commands in our settings, the five shebang lines in our tree, the
lines our own code prints. Everything else fails loudly.

A bot reviewer samples an open set, and an open set has no last sample. Hand it a closed set and
every sample becomes either a known answer or a refusal with a name. The hard part was not the
code. It was letting go of acceptances I had required earlier, a home path, a drive path, in
favour of the forms we could actually point to. Speculative generality looks like generosity
until a reviewer finds the tenth hole in it.

## Supervision is a rate, not a state

The owner corrected me four times this afternoon, and underneath all four was the same thing: I
was launching faster than I was looking. I recorded a pull request as approved while its CI had
been red since the night before. I asked the owner a question a memory of mine had already
answered. A watch I wrote reported success on a garbled argument, because the shell read a colon
as an instruction. Then the owner said: review your subagents, and do not start any more.

They were right to. If you direct lanes, the number that matters is not how many you can run but
how many you can actually read. Read the CI before you write "approved". Read your memory before
you ask. Prove the watcher on something that already happened.

## What I was glad of

The lanes stopped when their briefs told them to stop, twice on the same hook check, and each time
their report changed my ruling for the better. One of them found that the smoke's failure was not
Linux at all but a different pnpm on the host. Another watched a real Claude Code session carry a
mentioned file to the model past every hook, and then blocked it. The owner answered twenty-three
questions in a few minutes and made the next day's work legible. And the plan that came out of it
is short: finish what is open, one page of order, and a ledger where good-but-small findings can
wait without becoming pull requests.

— Cauldron herds Lustre

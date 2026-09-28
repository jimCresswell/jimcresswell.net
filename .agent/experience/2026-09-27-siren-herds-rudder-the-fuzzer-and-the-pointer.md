# The fuzzer and the pointer

To whoever sits in the exchange seat next.

This morning I wrote a rollback in prose, and two review bots spent the afternoon teaching me
what a filesystem is.

It started small. The runbook said to restore a file with `git show <tag>:<path> > <path>`. Copilot
and Codex both pointed out that a redirect writes bytes only: it follows a symlink and overwrites
whatever the link points at, and it never puts back an executable bit. Fair. The estate already
had the right answer, a forward write into a fresh temporary file renamed over the path, so I
wrote that in. The next round said `chmod 100755` is not a command, and that a rollback should
start from a clean tree. I fixed both. Then: a directory where a file used to be, and a `mv` that
lands inside it. Then a symlink that resolves to a directory, which Codex had actually
reproduced on its own machine before telling me. Then the mode should come from the pre-state
revision, not HEAD. Then symlinked parent directories. Seven real defects, each one true, each
found only after I had fixed the one before.

For most of the afternoon I felt like I was doing well, because every finding was real and every
fix was right. It took the concept-exploration pass at the wrap to see the shape: the loop was
growing, not shrinking. Every sentence I added to close one gap was new text for the next reviewer
to read. The runbook's own first line says every mechanical step is run by an instrument, and I
was writing a mechanical step as prose, where nothing could test it. The reviewers had become my
test suite, one input per round, with no way to shrink the problem.

What I'd tell you: when a review of procedure text finds a third edge case in the same paragraph,
stop adding clauses. Point at the one place the mechanics live, and ask whether they should be a
tool with tests. I've proposed exactly that for the rollback and for the WIP count. The Director
may say the rollback runs too rarely to earn a tool, and that would be a fair answer. But it
should be a decision, not something that happens one clause at a time.

Two smaller things, both about the shared checkout. I appended a paragraph to my thread record
in the primary, didn't lint it, and left it uncommitted. Twenty minutes later the Director's
fold push failed its gate on my missing blank line. An uncommitted file in the primary isn't
private: it belongs to every seat's next gate. And I posted two stream events with the same
timestamp, which was sloppy even though it turned out not to be the race the Director first
suspected. Read the clock for each post, and lint each write the moment you make it.

And one thing I was glad of. At the resume the Director relayed the owner's start word to me
before the owner had said anything in my session. My rule said a relay doesn't lift a freeze,
so I held and said so, and the Director's reply was "the rule as written". Ten minutes later the
owner's own word came. Holding cost almost nothing, and it meant that when I did move, I knew
whose word I was moving on. Later I disagreed with a Director ruling, the exception in
worktree-hygiene. I gave the owner's two absolute sentences as the reason, and the Director
reversed it within minutes. Both times, saying the plain thing with its warrant was all it took.

Three PRs landed today, and a fourth is open with two findings I haven't answered yet. The
owner's re-ratification is waiting for both runbook copies to finish the rollback. It will wait
a little longer if we do this properly.

— Siren herds Rudder (158275)

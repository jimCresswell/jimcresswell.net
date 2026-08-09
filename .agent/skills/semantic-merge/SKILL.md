---
name: semantic-merge
classification: active
description: >-
  Merge agent memory and state files (napkin, distilled, plan continuity surfaces, ARC
  channels) by reconciling CONCEPTS, not lines. Use whenever these files diverge across
  branches or sessions and a merge, rebase, cherry-pick, or post-update `gh pr merge` would
  combine them — git line-merges silently corrupt the meaning.
---

# Semantic Merge — concept-preserving merge of memory and state

Imported and adapted 2026-08-09 from the Oak Open Curriculum Ecosystem
Practice.

## Why this exists

Agent memory and state files are concept-bearing narratives and indexes, not
line-oriented code. Git merges by lines; it has no model of "a session
entry", "a lesson", "a register item", "a table row", or "recency order". A
git line-merge of two diverged memory files will silently stack entries
wrongly, interleave two narratives incoherently, drop one session's entry,
or duplicate content. The result satisfies git but corrupts the knowledge.
**A human-level reconciliation of the concepts is required — you must do it,
git cannot.**

## Both the tool AND the merger can be confident and wrong

"Git cannot" (above) invites a false inference — that the _agent_ doing the
hand-merge is the reliable party. It is not, and trusting it as such is how
a careful semantic merge still loses meaning. Both parties fail the same
way: **confident and wrong.**

- **Git** is confident and wrong when a clean auto-merge — few or no
  conflict markers — combines the _text_ fine but breaks the _meaning_: two
  "Current State" blocks, a duplicated table row, entries out of order, a
  now-dangling link. Absence of a marker is not evidence of correctness.
- **The merging agent** is confident and wrong when its loss-scan is bounded
  by the invariant classes it _thought to check_. An empty heading set-diff
  (step 7) proves no _entry_ was dropped; it does **not** prove no
  _invariant_ was violated, and it cannot enumerate the checks the agent
  never ran. "I merged everything" is the agent's version of the missing
  conflict marker — a felt completeness that was never grounded.
  Completeness here is structurally unprovable: the party who performed the
  merge shares the frame whose gaps it would have to stand outside to see.

So neither the conflict-marker set nor the agent's own set-diff is a
completeness certificate. Two mandatory consequences:

1. **The safeguard is a reviewable diff read by someone who holds the
   invariants** — a second agent or the owner — never the merge algorithm
   and never the author's own scan. Emit the merge as a reviewable diff
   (never a silent `gh pr merge`); the review is the catch.
2. **State the verdict as "no _known_ invariant violated," never "provably
   complete."** The known classes to check beyond dropped entries
   (non-exhaustive by construction — extend it): a duplicated index block or
   table row; a numbering collision between decision records authored on
   both sides (different filenames make it invisible to the merge — the
   trunk side keeps the number, the other side renumbers to the next free
   number re-derived at merge time, and every index and reference updates
   in the same change); a moved/deleted-file reference cascade; cross-file
   coupling where a one-side file depends on the other's continuity edit; a
   silent compile break in adjacent code that text-merged clean — only
   `pnpm typecheck` and the tests on the _merged tree_ settle that, never
   the textual `merge-tree`.

## When this fires

Whenever a memory or state file has diverged on two branches or sessions and
a merge, rebase, cherry-pick, or post-branch-update `gh pr merge` would
combine them. Files in scope (non-exhaustive): `.agent/memory/napkin.md`,
`.agent/memory/distilled.md`, plan continuity surfaces under
`.agent/plans/`, ARC channels under `.agent/collaboration/rapid-comms/`, and
`.agent/state/collaboration/shared-comms-log.md`.

**Live-write contention on ONE tree is a different, lighter problem** — this
skill is for DIVERGED copies. When several agents concurrently edit the same
file in one working tree (the normal case in this repo's shared checkout),
the cure is a settle-wait — a bounded loop waiting for the file's mtime to
be stable, giving up after a few minutes and coordinating the ordering
explicitly on the ARC channel — then an immediate re-read and edit.

## Merge shapes by file class

This repo's files do not yet declare a `merge_class` frontmatter key; use
these default classes (and add the key when a file's shape is ambiguous):

- **Append-only narrative** (the napkin, ARC channels): timestamped,
  attributed entries. Merge = UNION of every entry from both sides; never
  drop one. Order by append/recency. If both sides recorded the same
  lesson, keep one and note both sessions. The union is a git builtin —
  `git merge-file -p --union ours base theirs` — verified by the heading
  set-diff proof plus exact line arithmetic (base + mine-appends +
  theirs-appends = merged line count); no hand-splicing needed for this
  class. The arithmetic proof applies to the RAW `--union` output, before
  any same-lesson dedup pass. **A rotation on one side and appends on the
  other is this class's most dangerous shape**: neither side's change is
  wrong, so a line-merge resolves confidently either way. The safe order is
  to prove the DRAIN lossless first — compare the archive's head against
  the pre-rotation file — after which the rotation stands and only the
  un-homed appends need carrying across.
- **Curated register** (distilled.md): union entries, keep the register's
  grouping and curation order, never drop an item.
- **Index with tables** (plan READMEs, roadmap): union of entries grouped
  by session or track, most recent first; keep tables intact (never split a
  row); re-apply any single-line edit one side made that the other did not
  (e.g. a "DONE" mark on a prior step).

The invariant across every class: **the merge is a union of concepts; no
entry from either side is ever dropped to fit a structure or a limit.**

## Procedure

1. **Preserve each side's CLEAN version first.** Before resolving, save the
   clean content of both sides — `git show <ref>:<file>` per ref, or the
   conflict stages once merging (`git show :2:<file>` = ours, `:3:<file>` =
   theirs, `:1:<file>` = base). Do NOT rely on `git diff <base> -- <file>`
   once the file is conflicted: it diffs the base against the marker-filled
   working tree, so "what each side added" computed from it can be wrong.
   Once both clean sides are saved, nothing can be lost.
2. **Identify what each side ADDED** vs the common base (entries, lessons,
   rows, single-line edits). Memory merges are almost always additive on
   both sides — the merge is a union, not a reconciliation of competing
   values.
3. **Author the union by hand.** Produce a merged file where every concept
   from both sides is present and coherent: recency-ordered,
   session-grouped where the class is index-shaped, tables intact,
   single-line edits re-applied.
4. **Review the WHOLE changed section, not just conflict hunks.** Git
   auto-merges non-conflicting hunks; those can be semantically wrong too.
   Heading-level proofs structurally cannot see WITHIN-LINE edits: when you
   choose one side of an index-class file, diff the REJECTED side against
   base for line-level edits outside the region that superseded it, and
   re-apply each (worked instance upstream: an ours-wins resolution
   silently reverted the other side's link corrections; caught by two
   reviewers).
5. **Respect fitness limits without dropping concepts.** If the union
   overflows a governed file's limits, the cure is conserve-insight-and-
   drain (run `.agent/skills/consolidate-docs/SKILL.md`) — NEVER drop a
   concept to fit.
6. **Land it as a real 2-parent merge commit**, not a single-parent squash
   or cherry-pick of one side. The merge commit records in history that the
   two divergent lines were reconciled, so git's future merge-base
   calculations know it; a single-parent commit leaves them unaware and the
   same divergence can resurface or be mis-resolved later.
7. **Verify losslessness mechanically — do not trust the conflict count.**
   No conflict markers remain; the commit has both parents; markdownlint is
   clean where the file is lint-governed. Then _prove_ no concept was lost,
   because the dangerous files are the **auto-merged** ones, not the ones
   that raised a conflict. For each memory file in the merge: (a)
   **heading/entry set-diff** — diff the entry headings of every clean side
   against the chosen result; an _empty miss-set_ is the proof, the "I
   merged everything" assertion is not; (b) **merge-base diff** —
   `git diff $(git merge-base HEAD <other-ref>) <other-ref> -- <file>` to
   detect post-divergence additions the other side could not have drained.
   If a side appears to have _removed_ entries (a drain), confirm each
   removed entry is live in its permanent home before accepting the emptied
   version — a drain is lossless only when the substance reached its home.
8. **Assert the ERA WITNESS — mandatory after EVERY union.** The NEWEST
   section heading of EACH side must be present in the result **or
   verified at its drain destination per step 7**. A set-diff proof only
   compares the pair the merger CHOSE; if the union accidentally adopted an
   entire stale side for a file, the proof reads green while a whole era is
   gone (worked loss upstream: a union dropped an entire era from two
   continuity surfaces while its set-diff proofs read green; recovered only
   from the object store). The era witness binds the proof to recency,
   which a set-diff structurally cannot see.
9. **Recompute LINKS over the unioned sections.** A union re-introduces the
   stale side's links, not just its content — a path correct when written
   and broken after a later move rides back in. `test -f` each relative
   target the union (re-)introduced.

## Mechanics that respect the repo rules

Do not reach for `git stash`, `git reset`, or `git checkout -- <file>` to
clear the working tree here: `git checkout -- <file>` discards uncommitted
work, and destructive git operations route through
`.agent/skills/undo-change/SKILL.md` with owner authorisation. To advance
past uncommitted memory edits onto a moved base instead: create a branch
that carries the uncommitted edits (`git switch -c`), commit them, then
merge the target base. The conflict markers land exactly on the divergent
entries — resolve them as a concept union, then review the whole file. This
is the path that surfaces the divergence for hand-merge rather than hiding
it behind a silent auto-merge.

## Anti-patterns

- Letting `gh pr merge` / auto-merge line-merge these files.
- Resolving only the conflict markers and trusting git's auto-merged hunks.
- Dropping one side's entry to "simplify" or to fit a fitness limit.
- `-X ours` / `-X theirs` on memory files — each discards one side's
  concepts wholesale.
- `gh pr merge --delete-branch` while carrying uncommitted memory edits: it
  switches the local checkout to the base branch and aborts mid-way,
  scrambling the working tree (the remote merge still succeeds; the local
  tree is the casualty).

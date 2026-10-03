# Thread: two-estate-consolidation — the first dedicated consolidation across both estates

**Thread identity.** The next session is a dedicated consolidation session across both
estates, jimcresswell.net (JC.net, the home repository) and the Open Curriculum Ecosystem (OCE),
triggered by `.agent/prompts/dedicated-consolidation-session.md` (a trigger, never a state
store: the owner's word 2026-09-30). The owner's words: "the next session will run a dedicated
consolidation session across both estates"; "JC.net will be the home repo, where the relevant
skills differ, 1. they shouldn't and that needs fixing, and 2. the next agent can be instructed
to read the OCE skills". **Participating agent identities:** none yet; this record was written by Galaxy binds
Gravity (46de68, claude-code, claude-fable-5-1) at its session close, 2026-09-30T14:3xZ.
**Landing target for the next session:** the completion contract of `consolidate-until-done`
met in BOTH estates — every live curation buffer empty or explicitly owner-decision-gated, its
insight in permanent homes, no memory file worse than soft at rest — with the two estates' counts
said first in every report. **Grounding order:** JC.net's `AGENT.md` and `start-right-quick`,
this record, then `consolidate-until-done` and `consolidate-docs` read from OCE's copies where
the two estates' copies differ (the owner's instruction for the opening statement).

## Current Continuation

- **Read first, in this order:** this section; the report
  `.agent/reports/agentic-engineering/2026-09-30-two-estate-consolidation-retrospective.md`
  (§Decided 2026-10-01 and §What the next session inherits; identical bytes in both estates); OCE's
  comms decision table §H with `consolidation-2026-09-25/dispositions-2026-09-30/`; the rule
  `cross-estate-work-must-reduce-divergence`. The owner's brief for the next dedicated consolidation
  is `.agent/prompts/dedicated-consolidation-session.md`; the owner was rewriting it on 2026-10-01
  and settled the draft that day before the push (last bullet).
- **The owner's standing words, verbatim.** 2026-09-30: "The goal is knowledge curation, never
  fitness numbers. Done means empty pending graduations and empty buffers: say those counts first in
  every report." "Where a consolidation skill differs between the estates … read OCE's copy; the
  divergence itself is a defect to fix in both estates." "it's not 'the lineage', it's OCE." "All
  activities involving both estates MUST leave them more aligned and less divergent than they were
  before those activities." 2026-10-01: "we are not here to tidy things away or hit numerical goals,
  we are here to make sure that knowledge is preserved, discoverable and accessible. Where there is
  ceremony it is only permitted to exist where it serves practical purpose, the ceremony is there as
  a sometime required enabler, it has no value in its own right, but it does have cost." "This
  shouldn't be a question, we are bringing both estates to the same level of capability, anything
  useful that one has must make it to the other." The owner's cards of 2026-10-01: only
  owner-ratified text changes on the owner's word; for a bulk archive, proof (byte-identical,
  pointer-linked, lessons at their homes) replaces the word; the next session is capability parity,
  both ways; the prompt draft adds "if you need to ask questions then ask them".
- **State at this close.** JC.net `coordination/2026-09-29-b6232c` (draft pull request 274):
  dc0de0d7 the retrospective, 15e29421 the owner's frame, d6ee1ae0 the owner's cards and the settled
  moves, then the handoff commit; d6ee1ae0, fd9a4f1a and the adapters commit were pushed at the
  close; `git status --branch` first. OCE `coordination/2026-09-29-76974c` (draft pull request 299):
  cedad5e54 the retrospective, 5d00e2930 the owner's frame, a54898b39 the settled moves, then the
  handoff commit; a54898b39's push was refused once on skill-adapter drift and relaunched with the
  handoff commit at the close; `git status --branch` tells whether it landed. A new day cuts a new
  coordination branch in each estate.
- **Counts.** JC.net pending graduations 0 live entries (the register keeps one slow-lane row with a
  2026-12-15 review, not decision-debt); OCE pending graduations 0; distilled empty in both; OCE's
  frictions register 44 live under §Friction Entries and 86 unread under §Routing Notes (F-119 to
  F-217); the per-user memory directories are audit trails and carry no count (the owner's frame).
  Alignment over 389 shared paths: 156 files and 7,444 lines differed at 2026-09-30's open, 147
  files and 7,142 lines now; three shared files remain more divergent by nature
  (`build-system.md`, the commit skill's host ceremony, `validation-strategy`'s negative-control
  section), named in the report with reasons, and two smaller ones the measure found on
  2026-10-01 (`testing-strategy`, the cross-platform surface matrix); the measure is the script
  in the report.
- **Next session: capability parity, both ways** (the owner's word, 2026-10-01), inside the wider
  programme the prompt names. First steps: (1) inventory what each estate holds that the other
  lacks: the exchange register's rows L7 (review-cost push gate) and L8 (pr-tally) are already
  "bring" into JC.net (`.agent/reports/practice-transplant/exchange-register.md`, validator `pnpm
  exchange-register:check`, `--write-counts` on an intended change); OCE's commit queue; JC.net's
  `pnpm check:docs` pre-flight; the divergence measure as an `agent-tools` command unit-tested on
  injected file maps; the visual-regression harness where it applies; (2) one lane per capability,
  small pull requests, twinned per PDR-125 and PDR-142, measured by the rule at open and close; (2a)
  the agent-tools smoke suites (53 smokes in JC.net, 40 in OCE, each spawning processes, worktrees
  and servers on every pre-push) become real tests with no IO and with dependency injection, in both
  estates (owner, 2026-10-01, on the suite's output: "is not acceptable, make a note that we need to
  move those into real tests with no IO and with DI"; the standing word of 2026-09-29 in
  testing-strategy §Rules is the contract); (3) as they are met: decide each of the 51 deferred rows
  of OCE's §H (do, drop, or the owner's call; "owed" is the parked shape the owner forbade on
  2026-09-28), read the 86 unread frictions for lessons without homes, sample JC.net's comms stream
  (4,304 events, about 840 substantive) before any pass is sized, re-true the three shared files,
  cure the OCE lockstep test that reads `.agent/` files (testing-strategy §Rules), and re-true the
  event-cited paragraphs in place (what happened, who decided, when, one instance).
- **Working both estates from one session.** OCE is worked non-resident: absolute paths, `cd <oce>
  && <command>` or `git -C <oce> …` per command (a bare `cd` resets each call; `EnterWorktree`
  enters only the session's own repository). OCE commits carry `--author "Jim Cresswell
  <git@jimcresswell.net>"` with the bot as committer; strict commitlint in OCE refuses a header over
  100 characters, a body line over 100, a body line opening `word:` (read as a footer) and a
  sentence-case subject; JC.net checks with `pnpm agent-tools:check-commit-message -F <file>`, OCE
  with the same script name. Stage by explicit pathspec and commit with `git commit -F <msg> --
  <paths>` (a chain that staged every dirty file staged the owner's open edit, 2026-10-01). Run
  `pnpm check:docs` after staging new files (its link validator refuses a tracked file linking an
  untracked one). OCE's pre-commit runs the full turbo gate under a host slot; its pre-push runs
  markdownlint, the secret scan, the review-cost gate and `pnpm skills:check` (a changed canonical
  skill needs `pnpm skills:generate` first in BOTH estates, `pnpm portability:fix` regenerates only
  the rule and sub-agent adapters, and `pnpm skills:check` is in both pre-push gates). Both pre-push
  gates read the working tree, so an unrelated dirty tracked file (a machine-local path, a
  repository slug) fails a push whoever made the edit. The JC.net hook policy blocks writing the OCE
  repository slug into any file, scratchpad included, and blocks `git restore`, `git reset` and
  force pushes; pass a repository root as an argument and move forward with filesystem edits. zsh:
  quote globs (`--include='*.md'`), avoid words starting `=`, split file lists with `xargs` (BSD
  xargs has no `-a`). The fitness reader is `pnpm practice:fitness:informational` (a noticer, never
  a goal). Push with `pnpm agent-tools merge-bot push` from the estate root.
- **Standing constraints.** The owner's fork is never named on OCE surfaces; owner-private strands
  stay in per-user memory; the LinkedIn top-card location observation and the biographical detail
  never enter version control; every GitHub write runs as the bot with the seat's signature;
  `.git/index.lock` is never touched; a buffer file is never deleted without the owner's word; the
  three napkins under `unconsolidated/` archive after full processing, no privacy review (the
  owner's card of 2026-09-14); the owner's stop and freeze words bind as freezes.
- **Nothing waits on the owner at this close.** The owner's draft of
  `.agent/prompts/dedicated-consolidation-session.md`, which had held the JC.net push for an hour
  (two machine-local paths; the OCE repository slug on a JC.net surface, which the lineage-names
  gate refuses outside the records), was settled by the owner on 2026-10-01 before the push; the
  primary tree was clean of it at the close. The owner-act rows among the 51 are brought as they are
  met.

### 2026-10-03T07:1xZ — the step 2 carry and the twin clauses landed; cold pause at the owner's compaction word (Hazel tracks Trunk, 7d8b9d)

- **Landed since the sixteenth entry**: 304 merged (the last rotation slice), 300 folded with the
  successor `coordination/2026-10-02-24fc05` (draft 305); 306 (the Director's parity ledger over
  384 items) opened from `docs/parity-measure` and held at its door for the owner's row reading;
  307 merged at SHA:e394fcea4, the parity node's step 2 carry (PDR-008's and PDR-132's host-tagged
  amendment entries moved verbatim to ADR-023, the host-side adoption record, paired in the
  bridge index; PDR-005, PDR-082 and PDR-132 with headings of date and subject alone; the Core
  gate `validate-no-host-names-in-core-headings`, needles derived from the Core's provenance repo
  fields and changelog tags plus the tree's origin, demonstrated on both trees: seven findings
  here before the edits, none after, two in OCE for its twin); 308 merged at SHA:691b93198, six
  one-clause cures from the review of OCE's twins of 302 to 304. Review intake across 307 and
  308: eight Copilot findings, all correct, cured in one settlement push each, threads replied and
  resolved. This estate's step 1 and step 2 of the parity node are landed.
- **Held**: 306 at its door, MERGEABLE after the Director merged main into it (the exchange node's
  plan renamed to the archive by 300; the host's check does not follow renames); its six Copilot
  threads carry this seat's assessments and the Director's dispositions under the spent
  settlement budgets, and read as still unresolved on the host at 07:1xZ (the Director's own
  broadcast said resolved; the successor reads it again before the door). No carry starts before
  the owner's word on row O10 (the node's Mechanism item 3); the Director recommends carrying the
  thirteen text and small-code carries and deferring the four large ones to the entity's design.
- **OCE**: Efreet's 345 (the twins of 302 to 304) merged at SHA:c1a2d1ade; 346 (the carry's copy,
  ADR-232) open at 00:20Z; the twin of 308 follows it.
- **Records**: the notebook's blocks of the carry, of 308 and of the compaction freeze, and F-296
  (two authored-surface validators read the disk) on this branch; the per-user memory holds the
  Director's ruling that a pull request held at its door is a review surface, not work in progress.
  Candidates, not work: one Markdown fence reader for its two consumers; F-296's code cure; a row
  for the extraction's definition naming where the Core is edited.
- **Seat state**: cold pause on the Director's word (00:3xZ), confirmed by the owner's compaction
  word; both claims held with handoff pointers; every process stopped; the heartbeat-end on both
  streams. The successor resumes on the Director's message, re-arms by the recipe in the
  notebook's compaction block, reads this record and the stream since 00:37Z, and takes the first
  carry the Director names.

### 2026-10-02T22:42Z — the resume after the usage limit: 302 and 303 landed, the rotation archived, the three old notebooks moved (Hazel tracks Trunk, 7d8b9d)

The seat stopped at its usage limit at 20:49Z (stop line 04255eb9) and resumed at 22:1xZ at the
Director's word (resume at 302's door; then 2y, 2z, the notebooks' move and the rotation's records
commit; then the fold of 300 as the day's second fold here). Done since, each read back: 302
merged as SHA:27de48fd6 at 22:22Z after one settlement push curing Copilot's five findings (the
merge-tree proof is the tree equality; the fold's door is exactly the rules' contexts; the lock
route conditional on the surfacing step; the owner's word on the work-in-progress limit
superseding `worktree-hygiene` §1 and `no-parallel-long-lived-branches`' first-push timing with
the same dated clause in each; the no-push rationale conditional); 303 (slice 2y, seven files,
the knowledge and planning lessons with Efreet lifts Scorch's two twin clauses from OCE 341)
opened at SHA:41567611; slice 2z (eight files, the seats and tooling lessons, the owner's words on
heartbeats and monitors verbatim) committed locally on `docs/consolidation-2z-seats-tooling`,
opening after 303 merges under the limit; the rotation's archive by byte proof and the three
old notebooks' moves in this records commit (the notebook's rotation note names the blob and the
archive; the 2026-03-08 copy omits one line, named in the commit, never quoted).

The write list's last rows, re-trued: the twelfth entry's table marked W112 to W116 NOT-AN-ITEM
because the record's lists end at W111, yet their texts stand in the three old notebooks
themselves (2026-08-12 lines 44 to 48 and 520 to 522; 2026-03-09 lines 257 to 259), read at the
session's analyses. W112 (upgrade before working around) is in `dependency-currency` §Ground
rules; W113 (the exact local invariant) in `inter-practice-collaboration`; W116 (the
current-state audit before a rewrite) in the plan skill §Before Writing; W115 (a dated FAIL on a
boundary test is a disposition) landed in the plan skill §Completion by 303; W114 is a read in
OCE (whether its commits are signed), the one row left to that estate. Counts: pending
graduations 0 in both registers; the write list 97 items with its residue landed by 301, 302, 303
and the 2z slice; the live notebook rotated to its note.

Still to do in this estate after 2z: the fold of 300 (the day's second fold here, the owner's
twice-a-day word), the successor cut, the rotation broadcast; then the step 2 carry (the
host-tagged amendment entries of PDR-008, PDR-082 and PDR-132 to a host record with the Core
validator), then OCE's twins of the three slices as one pull request. For the owner's hand:
`records/2026-10-02-7d8b9d` at SHA:3802b36a (content on main but for a superseded citation;
the forced delete is denied to seats).

### 2026-10-02T20:12Z — the fold of 299 finished at the Director's word; the successor cut; cold pause (Hazel tracks Trunk, 7d8b9d)

The owner's word at 20:0xZ, verbatim: "the pause is lifted, ask the Director for direction. Go
slow, reflect, take your time". Asked (directed event 313f63fa); the Director's word at 20:0xZ:
merge the fold as it stands, the one Copilot finding correct and routed to the parity records pull
request (the node's step 5), not cured on the fold; the lane commit SHA:92644157 is the measure's
input, branched by the Director from that tip and landed under the measure pull request by merge,
the branch retired by proof afterwards, nothing for this seat to push; then cold pause.

Done, each read back: the thread resolved with the Director's text; 299 merged as the bot at
SHA:f19bed6d5 at 20:08Z, the door recomputed from the default branch's rules (the script's
hand-carried check names were another estate's and refused a green pull request once; cured to
read the rules); the successor `coordination/2026-10-02-f19bed` cut in the primary from that tip
and read back on the remote at the base; `coordination/2026-10-02-9f4d89` retired locally and on
the remote, both tips proved in main; this fold's entry in the continuity record, the notebook's
block and this entry committed as the successor's first records commit with the three freeze
files, its draft pull request opened as the bot; the rotation broadcast posted. Counts
unchanged: pending graduations 0 in both registers; the write list 97 items with its residue
sized in `write-list-residue-and-notebook-close`.

Left for the Director's measure step: the lane's `docs/consolidation-2j-inventory-cures` at
SHA:92644157 (theirs to branch from); the old `records/2026-10-02-7d8b9d` at SHA:3802b36a
(content on main; delete on the content proof's zero, `run/branch_content_proof.py`). The cold
pause this entry planned did not happen: the Director's direction of 20:1xZ, at the owner's word
"ask the Director for direction", kept the seat on the node's step 1 (the next entry).

### 2026-10-02T19:59Z — the second compaction freeze: the fold of 299 half-run, the cures withdrawn at the owner's word, how the resume finishes it (Hazel tracks Trunk, 7d8b9d)

The owner's words this window, verbatim: "finish the fold then go into cold pause" (19:27Z, with the
team and fold skills, and again at 19:5xZ); "you are cold paused, stay that way" (19:5xZ, every
process of this seat stopped by the owner's hand); then "Please prepare compaction ultrathink
/jc-metacognition /jc-free-play /jc-concept-exploration /jc-reason /jc-wrap then stop all
processes". The freeze binds from the last line: this entry and the notebook's block are the last
writes, uncommitted in the primary; nothing is pushed, replied, edited or requested until the
owner's word after the compaction.

Counts first: unchanged (pending graduations 0 in both registers; the write list 97 items with its
residue sized in `write-list-residue-and-notebook-close`; the notebooks as there).

What the window found at seating, read first-hand: 298 merged at 19:14Z as SHA:a35b5f32 by the
owner's hand with its five Copilot threads uncured; 286 folded at 19:20Z as SHA:ba5ad39a and the
remote branch deleted at the merge; the Director's records push of 19:32Z recreated
`coordination/2026-10-02-9f4d89` one commit beyond the fold merge, so the branch read folded on the
pull request and live on the remote; this estate held no open pull request; the primary's index lock
of the morning was gone (ls). OCE: 332 open at full checks with fourteen threads, every one on this
seat's inventory and census scripts.

What landed. In OCE, Efreet lifts Scorch ran the fold at the owner's routing: 332 merged as
SHA:2b25ced1b at 19:40Z, the fourteen findings absorbed into the parity node's measure step by the
owner's word of 20:0xZ (per finding by risk, cost and value), the successor
`coordination/2026-10-02-2b25ce` cut with its first records commit SHA:b4205aebb and the Director's
compaction records SHA:d3d67f3d8. In this estate, the fold's remaining legs are this seat's and are
half-run: pull request 299 opened at 19:4xZ from the recreated branch (records-class, the merge of
main in proved content-free by `git merge-tree`, so not made), now at SHA:8940b7e7 after the
Director's two records pushes (the parity node's size table trued to the owner's two-hour bound;
their compaction block and the measure scripts), Copilot requested at the ready-mark as the fold
skill's step 7 now says, the body re-trued; one unresolved Copilot thread stands on it, on the
parity node (its copy-based carries read against `best-of-each-practice` line 74, which lists
copying code between estates as deliberately not done), which is the Director's to decide, not this
seat's. The primary was fast-forwarded to the branch tip in place after the Director's settled files
were staged by pathspec (byte-identical to the tip, read by cmp), its tree clean, its tooling
rebuilt; the Director then committed in it and pushed. Not done: the merge, the successor cut, the
fold entry, the successor's draft pull request, the rotation broadcast, the folded branch's
retirement.

The cures for 332's fourteen threads (298's twin findings) were authored in full in the first
fifteen minutes and then withdrawn from landing at the owner's word of 19:5xZ, relayed by the
Director: "the point of the PR response budgets is to reduce time spent on PR ceremony; cutting a
new branch and a separate PR does not serve that goal". The bytes stay named once: OCE's synced
session directory under `cures-332/` (the four scripts, the inventory regenerated at main
SHA:ba5ad39a and engraph SHA:d51669d2f reading 16 landed, 15 declined, 48 difference rows, 26
measured, 22 on cells; the census reading 514 files and 81 offenders here, 732 and 93 in OCE), and
this estate's lane worktree `.claude/worktrees/consolidation-2` as the local, unpushed commit
SHA:92644157 on `docs/consolidation-2j-inventory-cures`, with the register's closing paragraph and
the exchange plan's dated line re-trued. The Director reads them at the measure step's generator
extension; no pull request carries them on their own.

How the resume finishes the fold (the scripts are in the session scratchpad's `coord/` directory,
synced to the session directory under `.agent/state/collaboration/` in both estates; each is one
plain call):

1. Read the task list (expect nothing running) and `git status --branch` in the primary and the
lane; fetch; read 299's head, checks and threads. If the branch moved past SHA:8940b7e7, the three
uncommitted files of this freeze in the primary (the notebook, this record, the formation letter)
are committed by pathspec on the coordination branch and pushed under a hold line before the merge,
since a fast-forward refuses over them; otherwise they ride step 6. 2. The Copilot thread is the
Director's; the merge waits for its disposition (one settlement push at most, or a decline in the
thread) and for CLEAN. 3. `fold-merge.sh <primary> jimCresswell jimcresswell.net 299 main`: the door
recomputed by name, the bot's merge at the fetched head, the ancestor proved. 4. Post
`cut-announce.tmpl.md` with `@MSHA@` filled; then `successor-cut.sh <primary>` in the primary (the
name minted from the post-fold main by the tool, the cut tree-preserving, the push as the bot, the
remote read back at the base). 5. `retire-folded.sh <primary> coordination/2026-10-02-9f4d89
<base-sha> jimCresswell jimcresswell.net` (both tips proved in main; a tip reading unmerged is
surfaced, never deleted). 6. Fill `fold2-entry.tmpl.md` and `fold2-napkin.tmpl.md` (`@TIME@`,
`@MSHA@`, `@SUCC@`, `@BASE@`), place them with `insert_fold_entry.py` and the notebook append tool,
commit by pathspec with `msg-succ-records.txt` (naming the three freeze files if they ride), push as
the bot to the successor under a hold line, open the successor's draft pull request as the bot from
`split/succ-body-jc.md` filled, post `rotation-broadcast.tmpl.md` filled, re-read whole first. 7.
Re-arm by id only what is absent: the two watchers (`run/comms-watch.sh <root> "$PPID"`), the
registry heartbeats (`run/heartbeat-registry.sh <root> <claim>`; the owner's word: never the stream
leg, never paused), a 299 watch until the merge. 8. The lane's `records/2026-10-02-7d8b9d` at
SHA:3802b36a has its content on main (the notebook there is a superset): delete it after
`run/branch_content_proof.py` reads zero. `docs/consolidation-2j-inventory-cures` stays until the
Director has read the batch.

The finish for this seat: 299 merged, the successor cut and announced, the lane branches proved and
retired, then cold pause.

### 2026-10-02T18:53Z — compaction freeze at the owner's word: the residue node authored, what stands, how the resume re-arms (Hazel tracks Trunk, 7d8b9d)

The owner's words, 18:4xZ, verbatim: "Please prepare compaction ultrathink /jc-metacognition
/jc-free-play /jc-concept-exploration /jc-reason /jc-wrap then stop all processes -- and remember,
you are working on a bounded task, not open ended, we must always understand the goal so that we are
able to finish". The freeze binds from that line: this records commit is the last outward act;
nothing is started until the compaction lands.

Counts first: unchanged from the twelfth entry (pending graduations 0 in both registers; the write
list 97 items with the residue sized below; the notebooks as there). What landed since: the twelfth
entry in both records and OCE's F-295 (the link validator walking the gitignored session directory);
and the delivery node `write-list-residue-and-notebook-close` in both repositories as the same bytes
(validated: 15 plan files conformant in this estate, 142 in OCE), serving `best-of-each-practice`
beside the finish node: five JC.net sentences in slice 2w, five OCE Practice twins in OCE's 2w, four
OCE product-docs items in 2x, the notebook rotation (four readers over the day's blocks, every claim
verified first-hand), the three notebooks' move by the 6b proof, the directive clauses after a
compaction under the floor, the omnibus branches on the content script's zero with the script
tracked; about five seat-hours; every sentence to write is in the node verbatim, so a fresh seat
implements it without this context. The node carries one promoted clause for
`validators-must-recompute-not-just-record` in both estates: a count stands only where a reader at
the default tip can recompute it (three instances today: the generator, the write list's count line,
the content proof).

What stands at the freeze. 298 (the inventory) is at its second round on SHA:6425f0d81 with five
Copilot threads open and unanswered, the budget's last settlement push unspent; the resume reads
them first. Their substance, read at 18:4xZ: the closer settles a row on landing rows from either
estate (J11 reads LANDED on two old jcnet rows while every lineage row is PARTIAL), so the 17/15/47
line is unstable until the closer reads the receiving estate's rows only; L34's landing row carries
`lineage` where the register's rule has L rows received in `jcnet`; `practice-lineage.md` is
classified as a repo-local adoption record where the bootstrap calls it part of the portable Core
trinity; the exchange plan's dated line still says all 47 difference rows were measured; the
closer's docstring still describes every open row as measured. The cure is one commit: the closer's
state function filtered to the receiving estate, L34's row in the jcnet column, the override for
`practice-lineage.md` removed (Practice-wide, by directory), the report regenerated, the plan's line
and the docstring re-trued, the replies, the merge at CLEAN. OCE's copy of the report then takes the
same regeneration as a records commit (its first copy is at SHA:8e2b84150). 297 landed
(SHA:f4a1c7496). OCE: 338 landed, 339 at its settlement round (Efreet lifts Scorch), s, 2fb, y to
come; a149 waits in the synced session directory for 2fb. The Director's heartbeat is the registry
leg only from 18:46Z in both estates (read their liveness from the claims registry, never the
stream).

Seat state. this estate: the primary on coordination/2026-10-02-9f4d89 at SHA:c232b740 local,
trailing the remote (the Director's SHA:84ec0680 and this seat's records commits sit on the remote;
the primary's index lock of 10:56Z holds nothing and stays); the built lane worktree on
docs/consolidation-2i-practice-inventory at SHA:6425f0d81, clean; the Director's detached worktree
at SHA:84ec0680. OCE: the primary on coordination/2026-10-02-9fd05e level with the remote before
this commit; the lane worktrees are Efreet lifts Scorch's. The local branch
docs/consolidation-2-routed-cures stays until the directive clause lands (the node's todo 7).

Re-arm recipe, as if nothing survives; the resume verifies by id first (the task list) and re-arms
only what is absent. Every process of this seat is a Monitor, thirty minutes, re-armed at expiry:
the two comms watchers (`run/comms-watch.sh <estate-root> "$PPID"`, one per estate); the two
heartbeats (`run/heartbeat.sh <estate-root> <claim> consolidation-2 <coordination-branch>
"<label>"`, claims 009bbaea-1956-44bf-a78a-59a509579e7a here and
08f94e2a-0068-45d0-a62a-8aaac7da2aa5 in OCE, stopped during any push window, this seat's or a
peer's, and re-armed at the push-done); the lock watch (`run/wait-gone.sh <primary>/.git/index.lock
2`); one pull-request watch at a time (`run/pr-terminal.sh <root> jimCresswell jimcresswell.net 298
<head9>`). The scripts are in the session state directory synced into both estates' gitignored
`comms-analysis-2026-10-01/session-7d8b9d/`. The first reads at the resume: the task list; `git
status --branch` in the primary and the lane of each estate; 298's threads; the claims registry for
the Director's and Efreet lifts Scorch's heartbeats; then slice 2w is cut from origin/main after 298
merges.

Promises sweep: the a149 note to Efreet lifts Scorch (posted, acknowledged); the census's JC.net
commit (this commit, as answered to the Director at 18:43Z); the residue node (this commit); 298's
round (the resume's first act); the directive clauses (the node's todo 6); nothing else was promised
on either stream. Attribution: every "landed" above is read from a merge ceremony's output or a
fetch; "Efreet lifts Scorch's order" for s, 2fb and y is their stated plan, not an observation of
the cuts. Blind-spot bounds: the comms watchers delivered events to 18:4xZ; anything after this
commit's push is unread; the four readers' reports are conserved only as the verified lines in the
twelfth entry and the sentences in the node. Fence sweep: no tracked line of this window quotes the
one owner-private phrase; the archived copy's omission is named, never quoted. A further pass would
re-find only the session directory's buffer, named above and in the node; the recursion closes here.

### 2026-10-02T18:45Z — the write list as one numbered table; the inventory open and its copy landed; the census in both estates; 297 landed (Hazel tracks Trunk, 7d8b9d)

Counts first. Pending graduations: 0 inline in either register (this estate's §Entries holds the
session-2 batch drained on 2026-10-01 as a comment and nothing live; OCE's register has no entries
section), slow-lane rows this estate 1 and OCE 6, unchanged, none due before 2026-10-10. Buffers:
the three unconsolidated napkins in this estate move to the archive when the write list reads zero
in this estate, which is the residue slice 2w below; this estate's live napkin is 967 lines and
rotates by consolidate-docs step 6 after that slice, each block's lessons read against their homes
first (the owner, 17:1xZ: "we don't archive napkins, we fully process them"); OCE's is 240 lines.
Write list: the table at the end of this entry is the cure the eleventh entry promised, every number
W1 to W116 with its home, its pull request in each estate and its state. Of 116 numbers, 19 were
never attached to an item (W45 to W58, because the 01:10Z entry holds 44 bullets and the record used
W59 and W60 beyond them; W112 to W116, which appear in two later sentences only, read by one of the
four readers against every entry and the git history of the record), so the list is 97 items: 34
landed in both estates; 39 landed in JC.net, of which 34 have their OCE copies riding Efreet lifts
Scorch's slices (ten in 339, q, open at 18:2xZ; twenty-two in s; the liveness rule in y; the fold
clause in 2fb) and 5 are closed because the home is JC.net-only (the four directives, ADR-015) or
OCE already holds the clause; 5 landed in OCE with the JC.net port owed; 14 closed on reading; 1 on
a memory surface; 2 sequenced into the extraction plan with the mechanism named (W33's two ports are
difference rows of the register and the inventory; W44's port form is PDR-143 §4's materialisation
question); 2 with no home in either estate (W35, the author-skills skill's evaluation re-run; W43,
three OCE docs lessons, two of them homed in a plan and a register today). The residue is two
slices: this estate 2w (W13, W26, W35, W39, W84: the pull-request skill's two transports, bare-list
rule and Copilot clause, the surface matrix's bounded-poll challenge and import-path sentence, the
author-skills clause; about 25 lines, one pull request after 298) and OCE's residue after y (W12,
W31's two Clerk facts, W32, W37, W43, W84's Copilot clause: two rules, the pull-request skill,
ADR-053, ADR-168 and the safety doc; one pull request, Efreet lifts Scorch's or this seat's by the
Director's order).

How the table was made. The reader's table of 116 rows (the session state directory) gave home, pull
requests and evidence; four Sonnet readers, read-only, took the 22 items it left unmapped, five or
six each, quoting the record's bullet and the home's lines in both estates; every presence claim
that closes an item in this table was then verified first-hand by grep on the named line before it
was written (W12, W13, W26, W31, W32, W36, W39, W40, W41, W84 in the estate that holds each). The
reader's "different home" cells were wrong by phrase for four of six and right by lesson for three;
the readers found two lessons the table had called absent (W40 in the executive memory, W41 in the
accessibility reference, both estates), and two items closed on evidence already in hand (W27, the
pattern file on both tips by the content proof; W104, the fold skill's own-state clause in 297's
diff).

End state 3. Pull request 298 (docs/consolidation-2i-practice-inventory) opened at SHA:45a6e0314
with three files and took its settlement push at SHA:6425f0d81 (push one of two) with four cures in
one commit: the Director's finding of 18:29Z, that the generator lived in the gitignored session
directory so no reader at a default tip could recompute the 3,555 rows (the three scripts now sit
beside the report, and the report's first paragraph names them and their invocations), and Copilot's
three threads, all holding: the register's closure said every difference row was measured against
the inventory where 26 of the 47 are and 21 close on their cells alone (17 with globs outside the
inventory's directories, 4 with no globs; the closer counts the three cases now); PDR-143 is
Proposed on the coordination branches and on neither default tip, so the report restates its §1
scopes and §2 membership tests; and the runbook index, one of the four capabilities the plan's
carried paragraph names, is under OCE's docs/operations/ and outside the inventory's directories,
which the paragraph now says. The report at the current heads (main SHA:f4a1c7496 after 297, engraph
SHA:38342e038 after OCE's 338): 3,555 rows, 975 same bytes, 794 different, 343 JC.net only, 1,443
OCE only; the register 79 of 79 (17 landed, 15 declined, 47 difference rows). OCE's copy, the same
bytes, with the four scripts, is on its coordination branch at SHA:8e2b84150 (one records commit;
its first run was refused by OCE's link validator, which scans the gitignored session directory and
found two scratch copies of the exchange plan carrying a relative link; the copies are removed in
both estates and the scratchpad).

End state 4. The IO census, both estates in one file with io_census.py beside it: JC.net at
SHA:f4a1c7496, 500 files in scope, 70 offenders (filesystem 53, process 33, network 2, clock 18);
OCE at SHA:38342e038, 719 in scope, 83 offenders (filesystem 67, process 34, network 2, clock 16);
the same numbers as at the earlier heads. In OCE at SHA:8e2b84150; in this estate with this records
commit.

End states 1 and 2. 297 (the first-batch skills residue, two files) landed at SHA:f4a1c7496 at
18:16Z after two Copilot rounds, the one thread cured by a149 and the second round empty; seven
slices of this estate landed today. OCE's 338 (u, Practice Core) landed at SHA:38342e038 and 339 (q,
rules) is open; s, 2fb and y follow. The omnibus branch here, read against SHA:f4a1c7496: 62 added
lines absent, every one read: the continuity directive's archive clause (7 lines, PDR-052's floor),
the exchange plan's capabilities paragraph (9 lines, landed in 298), and the rest superseded
(PDR-075's Accepted lines, PDR-130's, the changelog and README rows, two record lines, the fold's
rebuild clause that a149 replaced) or carried in later words that the proof's line match cannot see
(the commit skill's header check at its line 753, the inter-practice skill's removal search,
start-right-team's two-moments clause, consolidate-docs 6b's non-contiguous ranges, F-219 and F-224
under reworded headings); the branch is deleted on the script's reading once the directive clause
lands, and OCE's by Efreet lifts Scorch on the same reading before 2fb's cut.

Lessons of the window. A count stands only where the reader at the tip can recompute it: the
generator beside the report, the closer beside the closure, the census script beside the census (the
Director's finding; the same lesson the eleventh entry drew from the write list's count line). A
line the proof calls missing is carried when the home's text holds the lesson in fuller words, and
only a reading of the home says so; the earlier "the other four carried" was right for two files by
that reading and unproven for three until this window read them. OCE's pre-commit link validator
walks the gitignored session directory: scratch copies of tracked files with relative links refuse a
records commit (OCE's register, F-295, with this entry). The record's "116 numbered" counted
numbers, not items, for nineteen of them.

Next, in order. 298's door (the second round; the budget's last push if a cure is needed). This
records commit by the worktree route (this estate) with the census and its script. The residue slice
2w in this estate's slot after 298. The napkin rotation and the three napkins' move after 2w. OCE's
residue after y. The directive edits (the continuity-practice archive clause, the privacy clause of
W32, the two directive lines) under PDR-052's floor, read twice after a compaction. The two omnibus
branches on the proof's zero.

#### The write list, numbered (state at 18:4xZ on 2026-10-02)

Reader's keys: the W number and the home surface are stable; "L" in the evidence is a line of this
record as read before the eleventh entry was prepended. JC 290 and OCE 335 name pull requests.
States: LANDED-BOTH; LANDED-JC and LANDED-OCE with the other estate's copy or port named;
CLOSED-ON-READING; MEMORY; SEQUENCED with its mechanism; OPEN with its slice; NOT-AN-ITEM.

| W | Home surface | JC.net | OCE | State at 18:4xZ | Evidence |
|---|---|---|---|---|---|
| W1 | testing recipes; six rules; dependency-currency skill | 289 | 331 | LANDED-BOTH | L738; JC 289 and OCE 331 both carry testing-tdd-recipes.md, validators/consolidate-at-second-consumer/loop-exit/respect-claims/pr-comments/use-built-agent-tools-cli rules, dependency-currency (JC skill file in 289; OCE 331 same) |
| W2 | rule verify-dont-trust | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W3 | rule design-work-for-small-prs | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W4 | rule fleet-design-review-before-expensive-fleets | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W5 | napkin skill | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W6 | coordination-fold skill (fold reviewed) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W7 | pull-request skill (docs-only per path) | 292 | none | CLOSED-ON-READING | L756; record L347 and L361 list W7 as closed on reading its home; note JC 292 .agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md also carries the sentence (record and PR body disagree on whether JC needed the write) |
| W8 | start-right-team skill (paired seats) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W9 | consolidate-until-done skill (orchestration is not curation) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W10 | four directives, JC.net only | 288 | none | LANDED-JC | a JC.net-only home (four directives marked JC.net only); closed |
| W11 | pull-request skill (branch order, heartbeat, cloud PR, invariant) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W12 | rule review-feedback-defaults-to-triage | none | none | LANDED-JC | JC pr-lifecycle skill L499; the named rule lacks it in both estates and OCE holds it nowhere: OCE copy in OCE residue slice after y |
| W13 | JC.net pull-request skill (Codex zero-findings comment) | none | none | LANDED-OCE | OCE pr-lifecycle skill L1137; JC port in JC.net slice 2w (the write list's residue) |
| W14 | inter-practice skill (port cut from destination text) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W15 | rule use-monitor-for-event-driven-wake | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W16 | start-right-team skill (crossed broadcasts) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W17 | plan skill (actors on shared state) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W18 | fleet rule (shared mutable resource) | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W19 | rule owner-attention-at-action-moments | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W20 | rule precedence-is-not-approval (question not a grant) | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W21 | wrap skill and liveness rule | 292, 294 | none | LANDED-JC | the wrap skill's OCE copy in OCE slice s (Efreet lifts Scorch's order); the liveness rule's in OCE slice y (Efreet lifts Scorch's order) |
| W22 | consolidate-until-done skill (appends are a buffer) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W23 | ticket-management skill (retired seat's tickets) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W24 | session-handoff against wrap skill | none | none | CLOSED-ON-READING | L813; record L347 and L361 list W24 as closed on reading its home; no PR touches the session-handoff skill |
| W25 | JC.net cricket skill (git show quotes) | 294 | none | LANDED-JC | 294's description says OCE already holds the cricket clause; not read first-hand |
| W26 | surface matrix, Codex section (bounded-poll) | none | none | LANDED-OCE | OCE surface matrix L329; JC port in JC.net slice 2w (the write list's residue) |
| W27 | pattern cli-writer-boundary-discipline | none | none | LANDED-BOTH | the pattern file is on both default tips (the content proof's EQUAL; OCE ls-tree) |
| W28 | gotchas reference (comms --body, patch -N, %aI, fsmonitor, zsh status) | 289 | 331 | LANDED-BOTH | L820; JC 289 and OCE 331 .agent/reference/shell-and-tooling-gotchas.md carry body-file, %aI, fsmonitor, zsh and --model entries (diffs grep-positive) |
| W29 | TypeScript gotchas (S7765, strict, refine) | 289 | 331 | LANDED-BOTH | L834; JC 289 .agent/reference/typescript-gotchas.md and OCE 331 docs/governance/typescript-gotchas.md (S7765 and additionalProperties entries in both diffs) |
| W30 | decision record PDR-009 adapter clause | none | none | CLOSED-ON-READING | L838; record L282-284 (03:51Z) 'the adapter clause, held by PDR-009 in both estates' closed on reading; the entry gives no W number, so the number is matched by content |
| W31 | OCE docs (Clerk facts, ADR-213 note, exploration report) | none | none | LANDED-OCE | ADR-213 L149 and the exploration report of 2026-08-01 hold two of three; the two Clerk facts (MCP-67 live state; one application, two instances) land in ADR-053 by OCE residue slice after y |
| W32 | privacy directive (review request carries metadata only) | none | none | LANDED-JC | JC verify-dont-trust L294; the privacy directive's clause waits for PDR-052's floor; OCE's verify-dont-trust lacks it: OCE residue slice after y |
| W33 | Sonar disposition policy port; author-skills and deslop ports to OCE | none | none | SEQUENCED | the Sonar policy (OCE docs/governance) and the author-skills and deslop skills (JC.net only) are difference rows of the register and the inventory; the extraction plan's |
| W34 | pull-request skill (no draft waits; no merge on own diff's authority) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W35 | skill authoring (evaluation suite re-run) | none | none | OPEN | the author-skills skill lacks it: JC.net slice 2w (the write list's residue) |
| W36 | rule precedence-is-not-approval (standing grant limits) | none | none | LANDED-BOTH | confident-seats-proceed-and-report L50 in both estates (not the named rule) |
| W37 | rule invoke-test-expert | none | none | LANDED-JC | JC invoke-code-experts L17; OCE's copy lacks it: OCE residue slice after y |
| W38 | rule no-warning-toleration | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W39 | surface matrix (rule adapter import path) | none | none | LANDED-OCE | OCE surface matrix L355; JC port in JC.net slice 2w (the write list's residue) |
| W40 | executive memory owner-signal-interpretation | none | none | LANDED-BOTH | owner-signal-interpretation L116 in both estates |
| W41 | accessibility reference (axe forced colours) | none | none | LANDED-BOTH | accessibility-practice L75 in both estates (OCE's under docs/governance) |
| W42 | gotchas reference (profile a gate, outside sandbox, skip notice, gh draft) | 289 | 331 | LANDED-BOTH | L889; JC 289 and OCE 331 shell-and-tooling-gotchas.md carry summarize, billing and no-commit-beyond-base entries |
| W43 | OCE docs (tsconfig base, security families, S7764) | none | none | OPEN | OCE: the tsconfig ruling is in a plan, the security families in the deferred-controls register, S7764 nowhere; the docs homes by OCE residue slice after y |
| W44 | capability inventory (ADR port form) | none | none | SEQUENCED | the form of the ADR-187 port is PDR-143 §4's materialisation question (a Practice-wide decision becomes a Core record at the entity); the extraction plan's |
| W45 to W58 | no item | none | none | NOT-AN-ITEM | the 01:10Z entry has 44 bullets; the record used W59 and W60 beyond them and never attached text to these |
| W59 | not named | none | none | CLOSED-ON-READING | L406 'one (W59) closed as already homed'; also L347 and L361 |
| W60 | not named | none | none | CLOSED-ON-READING | L347 and L361 list W60 as closed on reading |
| W61 | rule scope-from-goal | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W62 | PDR-052 | 296 | none | LANDED-BOTH | OCE 338 (u) merged 18:20Z carries PDR-052 |
| W63 | JC docs: ADR-015 and surface matrix | 294 | none | LANDED-JC | a JC.net-only home (ADR-015); closed |
| W64 | Core: PDR-081 | 296 | none | LANDED-BOTH | OCE 338 (u) carries PDR-081 |
| W65 | Cricket skill frame clause (hold, sensor, last read) | none | none | CLOSED-ON-READING | L699; record L347 and L361 list W65 as closed on reading; JC 294 cricket diff is the git-ref lesson, a different one |
| W66 | tool facts (gotchas reference) | 289 | 331 | LANDED-BOTH | L559; JC 289 and OCE 331 shell-and-tooling-gotchas.md (merge-commit-tip, empty reads under .agent/memory, origin/<default> entries all in both diffs) |
| W67 | tool facts (gotchas reference) | 289 | 331 | LANDED-BOTH | L559; JC 289 and OCE 331 shell-and-tooling-gotchas.md (merge-commit-tip, empty reads under .agent/memory, origin/<default> entries all in both diffs) |
| W68 | validators rule | 289 | 331, 334 | LANDED-BOTH | L562; JC 289 and OCE 331 validators-must-recompute-not-just-record.md (diff: evidence taken at the moment and on the bytes); OCE 334 cures a nearby instance |
| W69 | fleet design review rule | 290 | none | LANDED-JC | OCE copy in OCE 339 (q, open) |
| W70 | rule worktree-hygiene | 291 | 335 | LANDED-BOTH | L566; .agent/rules/worktree-hygiene.md in JC 291 and OCE 335 (.DS_Store residue) |
| W71 | rule present-verdicts-not-menus | 291 | 335 | LANDED-BOTH | L568; .agent/rules/present-verdicts-not-menus.md in JC 291 and OCE 335 (mobilisation verdict) |
| W72 | tool facts (gotchas reference) | 289 | 331 | LANDED-BOTH | L570; JC 289 and OCE 331 shell-and-tooling-gotchas.md (webhook drop and shared scratchpad entries in both diffs) |
| W73 | tool facts (gotchas reference) | 289 | 331 | LANDED-BOTH | L570; JC 289 and OCE 331 shell-and-tooling-gotchas.md (webhook drop and shared scratchpad entries in both diffs) |
| W74 | rule handoff-messages-self-contained | 291 | 335 | LANDED-BOTH | L573; .agent/rules/handoff-messages-self-contained.md in JC 291 and OCE 335 |
| W75 | rule source-is-typescript-esm-only | 291 | 335 | LANDED-BOTH | L575; .agent/rules/source-is-typescript-esm-only.md in JC 291 and OCE 335 (recorded exemption) |
| W76 | config-expert template | 291 | 335 | LANDED-BOTH | L577 and L351; .agent/sub-agents/templates/config-expert.md in JC 291 and OCE 335 (additions never silently subtract) |
| W77 | ticket-management skill (linked ticket across two projects) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W78 | not named | none | none | CLOSED-ON-READING | L597 'opened and closed in the same pass: homed or released on a second probe' |
| W79 | not named | none | none | CLOSED-ON-READING | L597 same parenthetical |
| W80 | tool facts (gotchas reference) | 289 | 331 | LANDED-BOTH | L582; JC 289 and OCE 331 shell-and-tooling-gotchas.md (Download external data once) |
| W81 | napkin skill (resolution annotation) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W82 | not named | none | none | CLOSED-ON-READING | L597 same parenthetical |
| W83 | pull-request lifecycle skill (superseded PR) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W84 | pull-request lifecycle skill (bare list, Copilot request) | none | none | LANDED-OCE | the bare-list rule: OCE pr-lifecycle L415, JC port in JC.net slice 2w (the write list's residue); the Copilot-request clause is absent in both: JC.net slice 2w (the write list's residue) and OCE residue slice after y |
| W85 | not named | none | none | CLOSED-ON-READING | L597 same parenthetical |
| W86 | ticket-management skill (milestones, themes as labels) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W87 | plan skill ('do not assume the plan is correct') | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W88 | Cricket skill (in pairs) | none | none | CLOSED-ON-READING | L589; record L347 and L361 list W88 as closed on reading |
| W89 | not named | none | none | CLOSED-ON-READING | L597 same parenthetical |
| W90 | not named | none | none | CLOSED-ON-READING | L597 same parenthetical |
| W91 | rule cross-estate-work-must-reduce-divergence (importers) | 291 | 335 | LANDED-BOTH | L592; .agent/rules/cross-estate-work-must-reduce-divergence.md in JC 291 and OCE 335 (importer search before a port) |
| W92 | testing recipes (fake in sequence) | 289 | 331 | LANDED-BOTH | L594; docs/engineering/testing-tdd-recipes.md in JC 289 and OCE 331 (diff: a fake never answers in sequence) |
| W93 | tool facts (gotchas reference) | 289 | 331 | LANDED-BOTH | L443; JC 289 and OCE 331 shell-and-tooling-gotchas.md (ps %cpu is an average, not the load now) |
| W94 | rule ping-before-escalate | 291 | 335 | LANDED-BOTH | L444; .agent/rules/ping-before-escalate.md in JC 291 and OCE 335 |
| W95 | comms-channels skill (moved from rule channel-by-audience) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W96 | testing recipes (doctrine refuses the test) | 289 | 331 | LANDED-BOTH | L448; docs/engineering/testing-tdd-recipes.md in JC 289 and OCE 331 (diff: ask where the property lives) |
| W97 | rule consolidate-at-second-consumer | 289 | 331 | LANDED-BOTH | L450; .agent/rules/consolidate-at-second-consumer.md in JC 289 and OCE 331 (body: search the estate for a one-consumer premise) |
| W98 | testing recipes (failing under load) | 289 | 331 | LANDED-BOTH | L452; docs/engineering/testing-tdd-recipes.md in JC 289 and OCE 331 (diff: a test that fails under load is a measurement first) |
| W99 | rule handoff-messages-self-contained | 291 | 335 | LANDED-BOTH | L453; .agent/rules/handoff-messages-self-contained.md in JC 291 and OCE 335 (body: a recorded decision names who will do it) |
| W100 | inter-practice skill (open your own home first) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W101 | inter-practice skill (hold the twin's door) | 292, 293 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W102 | rule important-state-not-in-temp-files | 291 | 335 | LANDED-BOTH | L456; .agent/rules/important-state-not-in-temp-files.md in JC 291 and OCE 335 (JC 296 also touches it for a different lesson) |
| W103 | pr-lifecycle skill (scope a change causes) | 292 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W104 | coordination-fold skill, JC.net (own state) | none | none | LANDED-JC | 297 (the fold skill's own-state clause, read in its diff); OCE copy in 2fb |
| W105 | commit skill, JC.net (git merge --author) | none | none | CLOSED-ON-READING | L462; record L347 and L361 list W105 as closed on reading |
| W106 | consolidate-docs step 7 (moved to PDR-130) | 296 | none | LANDED-BOTH | OCE 338 (u) carries PDR-130 |
| W107 | tool facts (gotchas reference) | 289 | 331 | LANDED-BOTH | L465; JC 289 and OCE 331 shell-and-tooling-gotchas.md (open(p,'w').write(compute()) truncates) |
| W108 | tool facts (gotchas reference) | 289 | 331 | LANDED-BOTH | L466; JC 289 and OCE 331 shell-and-tooling-gotchas.md (computed listing gets a bound) |
| W109 | inter-practice skill (second reading) | 292, 293 | none | LANDED-JC | OCE copy in OCE slice s (Efreet lifts Scorch's order) |
| W110 | frictions register how-to | none | none | MEMORY | L469 'landed with this record' |
| W111 | rule cross-estate-work-must-reduce-divergence (three kinds) | 291 | 335 | LANDED-BOTH | L470; .agent/rules/cross-estate-work-must-reduce-divergence.md in JC 291 and OCE 335 (body: three kinds of small difference) |
| W112 to W116 | no item | none | none | NOT-AN-ITEM | the record's lists end at W111; these numbers appear only in two later sentences with no text |

Numbers: 116. Items: 97. LANDED-BOTH 34; LANDED-JC 39; LANDED-OCE 5; CLOSED-ON-READING 14; MEMORY 1;
SEQUENCED 2; OPEN 2; NOT-AN-ITEM 19.

### 2026-10-02T17:42Z — the owner's three rulings and the finish node; the last slice of this estate landed; the records by the worktree route; the omnibus branch's residue (Hazel tracks Trunk, 7d8b9d)

Counts first. Pending graduations: 0 inline in either register; slow-lane rows this estate 1, OCE 6,
each read against the Director's test of 17:2xZ (a prediction, a falsifier and a dated review
trigger) and each carrying all three, none due before 2026-10-10. Buffers: the three unconsolidated
napkins in this estate are fully processed by the write list and move to the archive when the list
reads zero open items (the owner, 17:1xZ, relayed by the Director: "we don't archive napkins, we
fully process them, and once all knowledge is safe we move them to an archive"), the one phrase the
privacy directive keeps out of version control omitted from the archived copy; this estate's live
napkin rotates with this records commit; OCE's is 232 lines. Write list: the count line of the
earlier entries (116 numbered, 83 open) is not recomputable, and this entry retires it: the record
numbers only W61 to W116 explicitly, and the 01:10Z entry's 44 bullets bundle the items counted as
W1 to W60. Of W61 to W116, read by home file against every consolidation pull request in both
estates (this estate 287 to 296, OCE 328 to 337; the table is in the session state directory, three
rows verified first-hand): 23 merged in both estates, 16 merged in this estate only with their OCE
copies in the unopened u, q, s and y slices, 9 closed on reading, 1 on a memory surface, 7 not
mapped by home (W84; W104, which is the omnibus residue below; W112 to W116, whose text the record
never attached to the numbers). The cure, in the next records entry, is one numbered table of every
item from the 01:10Z entry onward with its home, its slice in each estate and its status, so that
criterion 1's count is one a reader recomputes.

The owner's words of the window, verbatim, 17:0xZ in this seat's session: "NOTHING should be worked
on without clear completion criteria, sizing, and an unambiguous and provable statement of how it
provides ratified value. Run a fully Cricket suite"; in the Director's session, 17:0xZ: "NOTHING is
blocked on me", and 17:1xZ: "ALL of this work is bounded, ALL of it must have a known, reachable,
measurable end state, and ALL of it must be finished soon." The Director answered with the delivery
node `practice-work-finish` (five end states, sized from the day's measured rate, finished within
one day), the same bytes in both estates; it replaces the definition of done of 15:1xZ. This seat's
todo under it: land the last slice; recount the exchange register at the current heads and compute
the port delta; close the open rows into the generated inventory of every Practice artefact with its
PDR-143 scope class and byte-sameness; run the census here; move the notebooks after the write list
closes; rotate the notebook.

The Cricket suite ran on every lane's three statements (four variants, two adversarial): the work
ON-TRACK by three and DRIFTING by one on proportion; the frame CONTRADICTED by three on one reading,
that the ten re-trued OCE owner items' retirement was the Director's to write, where the Director's
words were "your next OCE records commit". Corrected: the retirement is this seat's, each item with
one verb of the owner's triage taxonomy, in OCE's continuity record with the next records commit
there; items 5, 9 and 10, still open in the verdict column, take DELETE because none carries
criteria, a size or a value line on record (the Director's confirmation, 17:2xZ).

The last slice of this estate, 296 (Practice Core, ten files), landed at SHA:c44edc837: a second
Copilot round found three things in the review body, none an inline thread, all holding (PDR-052's
report clause said a compaction releases a held edit where the record requires the repeated reading;
PDR-055 named this host's tooling package and plan files while claiming every clause portable; the
temp-files rule still prescribed the curator's per-pass log PDR-081 retired on 2026-06-14, in five
places); one script (a144) cured all three and travels to OCE's copy of u after a143. The two-push
budget was spent on the slice; no third request; the door at CLEAN. The pattern files' naming (a133)
needed no run: zero lines in the ten files still say "the lineage" on the primary.
Six slices of this estate landed today, 291 to 296.

The omnibus branch `docs/consolidation-2-routed-cures` (SHA:767c05a9) failed its content proof: a
script that checks every line the branch added against main's copy of each file found 73 absent (113
against the coordination branch). Read by content, PDR-075's "Accepted" lines, PDR-130's line and
the changelog and README rows are superseded by 281's review (PDR-075 is Proposed), F-219 is in the
register under a reworded heading, the commit skill's header check is carried in substance, and the
shell-gotchas lines are on main; the real residue is the first batch's skills split, which was never
cut (281, 282 and 283 landed; no skills pull request of that batch exists): `coordination-fold`,
`inter-practice-collaboration`, `consolidate-docs` step 6b, `pr-lifecycle`, `start-right-team` and
`tooling.md`, about 30 lines; the exchange plan's paragraph on capabilities found 2026-10-01 with no
register row and the retrospective's measure rerun of 2026-10-01 (the records channel); and
`continuity-practice`'s archive clause (20 lines, a directive, PDR-052's floor). The Director
approved it as the lane `docs/consolidation-2fb-first-batch-skills` in both estates (criterion the
script's zero against main plus the passages landed; size one six-file pull request per estate, one
records commit, one directive edit per estate; value the fold reviews' contradiction cures decided
at the owner's review of 2026-10-01 and end states 1 and 2); OCE's copy is Efreet lifts Scorch's own
pull request after s and before y, and both omnibus branches are deleted on the script's zero. The
record's earlier sentence that the branch's content had landed by other slices was wrong in part; a
claim about a branch is proved by its content, never by memory of the split.

What stands. The zero-byte index lock in this estate's primary (10:56Z) holds nothing: by the
Director's route the dirty records (this record's eighth to eleventh entries, the napkin with the
seats' blocks, the memory README, the WS-8 synthesis header, three patterns, the register's nine
entries, two formation letters, the finish node) are committed from this seat's built lane worktree
on a branch cut from the coordination branch's remote tip and pushed to that branch's ref; the fold
of 286 is the Director's by the same route. Next for this seat, in the Director's order: the remote
retirement of `docs/consolidation-2a-decision-records` (merged as 281, never retired); OCE's records
commit (the ten retirements, this entry); the first-batch skills lane in this estate's slot; then
the inventory lane (the recount is its sizing act; its value line is the owner's word of 2026-09-29
in the exchange plan's §Finish: "I want the Practice exchange finished"; "a means to an end, not an
endless horizon"), then the census here. The two directive lines and the archive clause wait for a
context reading under the floor, read twice after a compaction (PDR-052 §2); this window's reading
is not taken.

### 2026-10-02T16:47Z — five of this estate's slices landed in one afternoon; the sixth open with main merged in; what remains of the list (Hazel tracks Trunk, 7d8b9d)

Counts first. Pending graduations: none inline in either register; the slow-lane rows (this estate
1, OCE 6) are gated on their review dates. Buffers: the three unconsolidated napkins in this estate
are read whole and archive by proof once the skills slice merges in both estates (this estate's did
at 15:41Z; OCE's is last in the implementer's order) and the owner rules on one line (owner-private,
chat only); this estate's live napkin carries four seats' blocks and rotates after the records
commit; OCE's is 232 lines. Write list: 116 numbered, 26 closed on reading, 7 on memory surfaces, 83
open, of which 19 were merged in both estates at the day's start, and since then every lane slice of
this estate but one has merged (291 rules and templates, 292 skills, 293 the method and twin, 294
plans and ports, 295 the lineage wording) with the Practice Core slice open, while OCE's implementer
has merged the retire port and three slices (nb, r with 291's cures, and v at its door) with w, u,
q, s and y to go.

The afternoon's shape, by the Director's definition of done (15:1xZ): one open pull request per
estate, the door read at CLEAN by name, every review finding dispositioned within a budget of two
settlement pushes, the branch retired on proof. Twelve findings over five slices, every one holding
in whole or in part, every one cured: seven in-file contradictions on the skills slice, one on the
method (a control term proves reach, not absence), two frontmatter dates, four wrapped articles.
Three cures found by this seat's own pre-open read in the merged tree (a clause on y; a wrapped
phrase in PDR-132; the plans-and-ports description re-trued) cost no round. The cure scripts for
OCE's copies (a135, a136 for s; a137, a138 for y) are in the synced session directory and announced
on OCE's stream.

What stands. The Practice Core slice took main by merge, never a rebase, before it opened, its one
collision (two changelog entries at the head) kept newest first; it runs its round now. The
zero-byte index lock in this estate's primary (10:56Z) still stands, so the records commit (the
thread record's eighth, ninth and this tenth entry, the napkin with four seats' blocks, the memory
README, the WS-8 synthesis header, three patterns, the register's nine entries, two formation
letters) and the fold of 286 wait on it; the Director routed the slices around it so the fix slot
never idled. The two directive lines wait for a window under the context meter's floor (the meter
read 60 % at 16:45Z); the pattern files take the same naming by the records channel. After the list:
Goal 1 item 3, the exchange register's recount at the current heads and the computed path delta
between the two default tips.

### 2026-10-02T15:15Z — the resume at the owner's routing word: the Director's definition of done, 291 landed, 292 open (Hazel tracks Trunk, 7d8b9d)

Counts first. Pending graduations: none inline in either register; the slow-lane rows (this estate
1, OCE 6) are gated on their review dates. Buffers: the three unconsolidated napkins in this estate
are read whole and archive by proof once the skills slice merges in both estates and the owner rules
on one line (owner-private, chat only); this estate's live napkin carries three seats' blocks since
the freeze and rotates at the list's seventh item; OCE's is 232 lines. Write list: 116 numbered, 26
closed on reading, 7 on memory surfaces, 83 open, of which 19 are merged in both estates, the
rules-and-templates lessons are merged in this estate (pull request 291) and committed in OCE (slice
r, with the estate's implementer), the skills lessons are open in this estate (292) and committed in
OCE (slice s), and the rest are committed on lane branches in both estates.

The owner's word at the resume, verbatim: "The Director will tell you what needs doing, prepare a
report for them." The seat re-armed first (two watchers, two heartbeats, a lock watch, every one a
Monitor, verified by id: nothing had survived the compaction), recomputed every figure, and wrote
the report (`coord/report-director-1500.md` in the session's state directory, synced to both
estates) before any act on the finish list. The Director's routing followed by session message: this
seat's definition of done is the finish list of the eighth entry, this estate's side, with two
reassignments: the seven OCE slices (item 2) are the estate's implementer's by the PDR-063 record,
and the three OCE owner cards (item 5) are the Director's to raise. After the list: the exchange
register's recount at the current heads, then twin lanes in this estate's fix slot as the Director
routes them. The order after 291 is s, y, x, u, z (u after the fold of 286, or with main merged in,
never rebased, because its changelog and catalogue rows collide with PDR-143's; z last so the
"lineage" rewrite does not race u's text). Rules of the window: one open pull request per estate; a
seat with a pending pull request builds nothing new; "parked" is refused as indefinite-deferral
vocabulary, a lane names its gate.

What landed. Pull request 291 (eight rules, three reviewer templates) merged by this seat's door at
CLEAN at 15:06Z as SHA:54a219d50: eleven checks green, zero unresolved threads, one review round of
five findings, all cured; the head proved an ancestor of main; the branch retired remote and local.
Pull request 292 (slice s: eleven skills in two commits, the ten skills' lessons twinned from OCE's
merged slice and the three napkin writes of a122) opened at SHA:ba67b4704 behind a hold line, its
description re-trued to the second commit before it opened; Copilot requested at 15:12Z; a dry-run
merge against main after 291 produced one tree and no conflict. The PDR-063 step-4 directed event
for the OCE slices hand-off went to the implementer on OCE's stream and was absorbed within a
minute; OCE's resume line carries the eighth entry's rendering for the next records commit there and
names slice y as opening in this estate first.

What stands. The zero-byte index lock in this estate's primary (10:56Z, no holder) still stands; the
records commit (the thread record's eighth and this ninth entry, the napkin with three seats'
blocks, the memory README, the WS-8 synthesis header, three patterns, the register's nine entries,
two formation letters) and the fold of 286 wait on it, the fold with the rotation. Two lessons of
the resume: a push-window hold line whose holder has stopped is honoured on the line alone until its
push-done or release (the Director's window of 14:47Z closed by their line at 15:01Z after the push
ran post-compaction), and a report for a live peer is recomputed at the moment of posting, not of
drafting; and every commit SHA in a collaboration surface is written with the `SHA:` prefix the
gitleaks allowlist reads (the rule surfaced on this resume; earlier lines of this seat carry bare
SHAs).

### 2026-10-02T14:48Z — compaction freeze at the owner's word: what finishes this pass, what stands, how the resume re-arms (Hazel tracks Trunk, 7d8b9d)

Counts first. Pending graduations: none inline in either register; the slow-lane rows (this estate
1, OCE 6) are gated on their review dates. Buffers: the three unconsolidated napkins in this estate
are read whole and archive by proof once the skills slice merges in both estates and the owner rules
on one line (owner-private, chat only); this estate's live napkin is 582 lines and rotates at the
next drain step; OCE's is 232. Write list: 116 numbered, 26 closed on reading, 7 on memory surfaces,
83 open, of which 19 are merged in both estates (two slices), 64 are committed on lane branches
(five in this estate after this window, seven in OCE, handed to the estate's implementer by a
PDR-063 record), and none is unscripted.

The owner's words this window, verbatim: "prepare compaction … then stop all processes — and
remember, you are working on a bounded task, not open ended, we must always understand the goal so
that we are able to finish." The correction absorbed: a drain pass has a finish list, and a front
not on the list does not open. This afternoon three audits ran in parallel (the owner-decision
items, the set-aside defects, the "lineage" wording) beside the slice work; each is on the list
below, and each was also the shape by which a loop grows its surface.

What finishes this pass (the finish list, counted): (1) six slices of this estate land by pull request,
one at a time in the estate's fix slot (the rules-and-templates slice is open at its first
settlement push, 0 threads; then skills, Practice Core, plans, the method and twin, the "lineage"
wording); (2) seven OCE slices land by the estate's implementer in the order nb, r, v, w, u, q, s,
with the two prepared cure scripts (a125 for q, a132 for r) and the napkin-writes script (a122 for
s) applied first; (3) one records commit lands on this estate's coordination branch once the stale
index lock in its primary is cleared (eight dirty, linted files: the thread record with its seventh
and this eighth entry, the napkin, the memory README, the WS-8 synthesis header, three patterns'
scope rename, the register's nine entries); (4) the three unconsolidated napkins archive by proof
after (1) and the owner's word on the one line; (5) three owner cards on OCE's re-trued decision
items are raised by the Director; (6) two directive lines and the monitor rule's one-shot carve-out
are edited in a window under the context meter's floor; (7) this estate's napkin rotates. Nothing
else is in this pass.

What stands. Both default branches hold the first two lessons slices and PDR-143. This estate's pull
request 291 is at its first settlement push with its five findings cured and replied to; its door
opens on green and the merge ceremony is the resume's first act. OCE's coordination branch carries
this seat's seventh record, the ten owner-decision items re-trued against the estate (verified line
by line), and frictions entries F-286 to F-294 with a dated note on F-174 — the same entries sit in
this estate's register awaiting its records commit. Divergence at the default branches: 144 files
and 7,154 lines on the comparable prefixes (from 146 and 7,167 at the day's start); 157 and 7,508
with the pattern files now in the instrument. The scripts, slice definitions, replies, analyses and
verification reads are in the session's state directory, synced into both estates.

The resume re-arms as if nothing survived, verifying by id first: the two comms watchers
(`run/comms-watch.sh <estate-root> "$PPID"`, one per estate), the two heartbeats (`run/heartbeat.sh
<estate-root> <claim-id> consolidation-2 <branch> <label>`), the lock watch (`run/wait-gone.sh
<primary>/.git/index.lock 2`) while the lock stands, and the pull-request watch (`run/pr-terminal.sh
<root> jimCresswell jimcresswell.net 291 <head>`); then reads the Director's stream lines since
14:4xZ before any write. Claims this estate 009bbaea and OCE 08f94e2a stay this seat's with handoff
pointers; the one open pull request's claim is retained until it merges.

### 2026-10-02T11:03Z — the owner's review and the resume: every slice committed, 289 landed, the three napkins read (Hazel tracks Trunk, 7d8b9d)

Counts first. Pending graduations: no inline entry in either register; the slow-lane rows (this
estate 1, OCE 6) are gated on their review dates and none is due. Write list: 116 numbered; 25
closed on reading; 7 landed on memory surfaces; 84 open: 10 merged in both estates (the first
lessons slice, this estate 289 and OCE 331, with the four cures the second review found travelling
back to OCE); 66 committed on local lane branches in both estates (five slices in this estate, six
in OCE, and the four-file back-port); 5 unscripted, plus four new from the napkins. Buffers: the
three unconsolidated napkins are read whole (about 200 lessons; every one homed, superseded, tracked
or released except the four writes and one line that is the owner's); the live napkins carry this
window's entries; the per-user memory is dispositioned by marker.

The owner's review (10:1xZ). Asked what was done, what remains and what was missed, the seat
recomputed every figure from its source. Missed: the three napkins had been held behind a privacy
review the owner lifted on 2026-09-14; a record imported from OCE sits uninventoried in this
estate's active memory; the divergence measure excludes the pattern port and reads the merged state
as more divergent than at the open (7,167 lines against 7,142; 7,081 with every prepared slice
landed); three ported patterns carry the upstream package scope the port's plan said it would
rename; eleven set-aside code defects were never filed; OCE's ten owner-decision items were not
re-trued; the method lives only in buffers and scripts; the sixty-six applied lessons were
git-durable nowhere. The owner agreed the ten proposals.

Done since. Every prepared slice is a local commit, because nothing is safe until it is merged (the
owner's word of this morning), and each opens by pull request in turn under one fix pull request per
estate. 289 merged after one settlement push curing four findings on bytes OCE had merged first; the
cures are committed for OCE. 290, this estate's nine-rule slice, is open. The seat's own misreadings
this window: the work-in-progress word forbids open pull requests, not local commits; three records
claimed code "names none" where the code exists and the policy does not wire it (a code claim has
two parts). The owner's words of the day: "always use monitors, not ad-hoc shell processes"; the
Practice is to be extracted as a standalone entity (PDR-143, the Director's record).

Resume. Open the slices one pull request at a time per estate (290, then r, s, u and x in this
estate; the back-port, then q, r, s, u, v and w in OCE, by the seat the owner names); write W112,
W113, W115 and W116 as second commits on the slices that carry their files; archive the three
napkins by proof after the owner's word on the one line; wave 4 stands as listed in the plan.

### 2026-10-02T03:51Z — the hold ended; two directive pull requests landed and the slices are opening (Hazel tracks Trunk, 7d8b9d)

Counts first. Write list: 111 numbered; 19 closed on reading their homes (five more this window: the
adapter clause, held by PDR-009 in both estates; two directive-bound follow-ups the registers show
already graduated; the content boundary for a private lane, held by the privacy directive's rules 5
and 7; the Sonar policy port, a host difference); 7 landed on memory surfaces; 85 open. Of the open,
74 are scripted and applied in the estates' lane working trees, the twins' added lines compared file
by file and equal; 11 are not yet scripted (product documents in OCE, two documents in this estate,
two product ideas for OCE's backlog, two whole-file ports, the convergence of the pull-request
skill, the capability inventory). Pending graduations: no inline entry in either register; the
slow-lane rows (this estate 1, OCE 6) are gated on their review dates and none is due (PDR-130,
decision 3). Buffers named at the open: none unread, three read by scan only.

The hold. The harness compacted and the meter read 0 %, then 8.4 %. The directive cure for this
estate's pull request 288 was re-read in full at that figure and three of its five texts were
rewritten there. 288 merged with one settlement push. OCE's pull request 330 carried the same cure;
its review made one claim in the body and no thread (the archive proof relied on HEAD and never
checked the surface was clean), which held, and 330 merged with one settlement push. This estate
still holds the first form of that step: the back-port is in its lane working tree and rides its
next slice. The meter reached 29.4 % with one more directive edit made at that reading (OCE's stale
orientation row); directive edits wait again from there.

Open now: OCE's pull request 331, the first lessons slice (ten files). Two vendor reviews raised six
findings, five distinct, all holding in part or whole; the cures are committed as settlement push
one and are in this estate's lane working tree too.

Prepared and waiting, one pull request at a time, OCE first and its twin after each: rules two (nine
files); rules three with three reviewer templates (eleven); skills (ten); Practice Core (seven
decision records, the decision-record README, the changelog, the context-budget rule, and in OCE two
one-line convergence ports and the orientation row); plans (fifteen files in OCE, two in this
estate). Each slice's branch, paths, message and description are files in the session's scratchpad
state directory, with the order of the apply scripts in the plan note beside them.

Decided this window: the lessons of the agent-tools architecture exploration stay homed in OCE's
ratified strategic node; in this estate they are routed into the exchange plan with the question
that is the owner's, because the owner's rulings give its Practice stream one strategic node. The
Sonar disposition policy is not ported to this estate, which runs no Sonar analysis: a host
difference, recorded for the capability inventory.

Resume. Read the open pull request's reviews in full (bodies as well as threads); cure by script in
both lane trees; one settlement push; replies after the push is read back; merge by the scripted
door; then the twin. Directive and decision-record edits only under 30 %.

### 2026-10-02T03:08Z — the hold stands; what was prepared and landed while it does (Hazel tracks Trunk, 7d8b9d)

**Counts.** Write list: 111 numbered; 14 closed on a second reading; 7 landed on memory
surfaces; **90 open**, 62 of them scripted and applied in OCE's lane working tree (40 files in
five slices: tool facts with the first rules batch, two more rules batches, one skills batch,
three templates), 28 still to script (Practice Core, the directive items, docs and plans, the
pull-request skill's convergence, whole-file ports).

**The hold.** JC.net pull request 288 waits for its three-finding directive cure, and the cure
waits for this seat's context to fall under 30 % (PDR-052; the meter read 63.6 % at the last
read). A turn boundary brought no compaction, so the earlier guess that one would is refuted.
The seat cannot compact itself and has not woken the owner for it: the state and the ask are
in the turn's report. Cricket suite 15 (both legs ON-TRACK, frame NARROWED) judged the wait
right and a second open slice wrong. The resume steps are in the fourth entry above this one
in time, and in the gitignored plan's note of 02:51Z.

**Landed on memory surfaces since the fourth entry.** The frictions registers: one sentence
saying an entry with no Status line is open (about forty such entries in each estate, none
recording a cure); three groups of entries that record one friction, each member now naming the
others; F-282 (the context meter's first read after a compaction, read against its parser) and
F-283 (nothing sizes a file before a seat reads it whole). In OCE, the slack-watcher review's
thread record is retired with its banner: its pull request merged on 2026-08-25 and its one
remaining probe is carried by the skill's own liveness table.

**Closed on reading their homes.** W7, W24, W59, W60, W65, W88, W105, and the strictness
method (tracked in OCE's thread record). Moved: W106 to the Practice Core slice (PDR-130 holds
the slow lane); W34 and W84 into the convergence of the pull-request skill, which differs
between the estates by about 500 added and 220 removed lines; W95 into the comms-channels skill
both estates hold; W76 into the config-expert template.

**Measured for the closing wave.** "The lineage" stands in 91 JC.net files; about 55 instances
are in live doctrine (Practice Core, hooks, runbooks, strategic plans, skills) and the rest
are dated records, which stay as written. The previous seat's lockstep-test item (F-229) is
routed to the partner seat's code lanes, and that seat is frozen: it has no live receiver.

### 2026-10-02T02:52Z — landing begins: one slice merged, one open with a queued cure, five prepared (Hazel tracks Trunk, 7d8b9d)

**Counts.** Pending graduations: no entry of the counted shape in either register. Write list:
111 numbered; 13 closed on a second reading (the six earlier, W7, W24, W59, W60, W65, W88, and
the strictness method as tracked); 5 landed on memory surfaces; **93 open, of which 55 are
scripted and applied in OCE's lane working tree** awaiting their slices.

**Landed.** OCE's directive slice merged as `091d24825` (pull request 329, two settlement
pushes, the bot's REST merge at the pinned head, the door recomputed by name). The
memory-surface group is on both coordination branches.

**Open.** JC.net pull request 288 is the directive twin (six files, head `595ab3af2`). Copilot's
first review raised four findings. One was a citation it resolved to another repository: the
description now says the citation is provenance only, and the thread is answered and resolved.
Three are true and over the bar, and all three also hold for the text OCE merged:

1. The archive proof names "the move commit's parent" at a step that runs before the commit
   exists. The pre-move blob is the surface as committed at `HEAD` when the proof runs.
2. The surviving-mutant sentence covered any literal. A literal that is observable behaviour (a
   status code, a retry limit) is not configuration, and its surviving mutant is a gap.
3. "Order is never itself the claim" contradicts the output-port sentences before it; it is
   true of the queries of input ports only.

**Queued, and why.** The cure edits two directives. This seat's context read 49 % when the
review arrived, and a directive is edited only under 30 % (PDR-052), so the cure is drafted
(anchors proven by dry run in both lanes) and is the first act after the seat's next
compaction: apply, settlement push one of two, replies after the read-back, merge at the door.
OCE takes the same three-file cure as its own slice straight after.

**Prepared, not yet a pull request** (one open at a time across both estates). In OCE's lane
working tree, lint-clean, with no branch and no commit: tool facts and the first rules batch
(ten files); the second rules batch (nine); the third (eight); the first skills batch (five).
JC.net takes each as a twin after OCE's review, so the twin carries OCE's cures.

**Still to script.** The second skills batch; six JC.net-only ports; Practice Core; the
remaining directive items (under 30 %); docs, plans and templates; whole-file ports (the channel
rule to OCE among them); register curation (four duplicate groups, 43 entries without a Status
line); then the capability inventory, the audits, the divergence measure and the closeout.

**One lesson of this hour for the next seat.** Two estates' vendor reviews of the same bytes
found different true defects: OCE's found two threads and three contradictions behind one
overview sentence; JC.net's found three more. A twin is a second reading, and it is worth
having before either copy is called settled.

### 2026-10-02T02:32Z — the buffer stage, third record: the experience files, and the write list closed and grouped (Hazel tracks Trunk, 7d8b9d)

**Counts.** Pending graduations: no entry of the counted shape in either register; slow-lane rows
1 (JC.net) and 6 (OCE), none at its review date. Write list: W1 to W111, six closed on a second
probe, one (W59) closed as already homed; **104 open, none landed in doctrine**; the
memory-surface group lands with this record. The list is itself a buffer until it lands (Cricket
suite 14, both legs).

**Drains since the second record, with their true labels.**

- Experience files dated from 2026-09-14: 55 read whole at the seat (JC.net 27, OCE 28). 48
  lessons were probed in both estates' doctrine; 13 had no home and are W93 to W105.
- This seat's own napkin entries of this session: each line mapped to a home, a prepared script or
  a write (W106 to W111).
- Scans, not whole reads: the handoff archives (seven files, read by a scan for owner words);
  the ported patterns (each file's `use_this_when` line; ten files and the twelve that differed
  read whole); the three unconsolidated napkins were extracted by an earlier seat on 2026-09-13
  and 14 and were not re-read; their archive waits on the owner's privacy review.

**Shapes that recur across seats in the experience files** (each already a pattern, a rule or a
decision record; the count is the evidence that the home does not fire by being read):

1. A lesson its author has just written does not fire for that author; a gate or a script step
   does (at least twelve letters, six seats).
2. The nearest surface read as the thing: a summary, a label, a count, a seat's line, a field
   whose name resembles the concept (at least fifteen letters).
3. After a compaction a seat is fluent, not informed: numbers are written that no file holds, and
   the first context-meter read describes another moment (four seats, and this seat twice today:
   63.9 % and 0 %).
4. A review loop whose rounds do not shrink names a generator, not instances (five seats).
5. Stopping is not safety: a seat that cannot trigger its own compaction achieves nothing by
   waiting for it (the owner, twice).
6. Under a work-in-progress limit "then" means "after this one lands" (the owner, 2026-09-29).
7. Agreement among readers of one model is weak evidence; a reader from outside the frame, not
   told which line worries the author, finds what five same-frame checks pass (three seats).
8. A hold with a condition and no sensor waits forever looking healthy (two seats, and this seat
   today: a monitor that needed "no review request pending" beside the owner's standing request).
9. A count whose unit the counter can slice is a story (one seat). It bears on this list's count.

**The write list, W93 to W111.**

- W93 tool facts: a process's lifetime CPU average is not its load now; sample over a few seconds.
- W94 rule `ping-before-escalate`: when the routing seat is the silent one, send the owner one
  notice, a plain state report and not a question.
- W95 rule `channel-by-audience-lifetime-and-consumer`: a ruling another seat must cite is an
  event on the stream, not a direct message.
- W96 testing recipes: when the doctrine refuses the test you want, the property lives in the
  structure (a type, the place of a call); a port's own failure is the probe.
- W97 rule `consolidate-at-second-consumer`: before writing a parser, matcher, validator, kill,
  sweep, retry or lock, ask what in the repository already does it, on the stream.
- W98 testing recipes: a test that fails under load is a measurement first.
- W99 handoff rule: a recorded decision names who will do it; if nobody, it says "nobody".
- W100, W101 inter-practice skill: open your own estate's home for the concept before amending a
  peer's joint text; hold the twin's door until both copies' review legs have settled.
- W102 rule `important-state-not-in-temp-files`: when a placement feels easy under a sensitivity
  constraint, search the tree for the thing being protected first.
- W103 pr-lifecycle skill: the scope a change causes is in scope whatever the description
  declares; each "counted", "never" or "only" in a description is held by an assertion.
- W104 coordination-fold skill, JC.net: a change never describes its own state in the files it
  merges (OCE's skill holds it).
- W105 commit skill, JC.net: `git merge` takes no `--author` (OCE's skill holds it).
- W106 consolidate-docs step 7: before a record's status changes, find every condition the record
  puts on that status and answer each.
- W107 tool facts: `open(p, 'w').write(compute())` truncates before `compute()` runs.
- W108 tool facts: a computed listing printed into a seat's context gets a bound.
- W109 inter-practice skill: the second estate's review is a second reading of the first estate's
  merged bytes; plan the first estate's follow-up before opening the twin.
- W110 frictions register how-to: landed with this record.
- W111 cross-estate rule: small differences are of three kinds (host anchors; wording one estate
  holds host-neutral; content one estate lacks, which is knowledge at risk); measure divergence at
  the close of a pair.
- Two more from the record items: a property test for a renderer that prints by allowlist (a
  nonce at every position never appears unless its token is in the closed vocabulary) goes to the
  testing recipes; the strictness method (flags measured per target, zero-cost flags in one pull
  request, costly ones in ten-file slices fixed by meaning) goes to the TypeScript tool facts.

**How the list lands, grouped by home surface.** A: memory surfaces on the coordination branches,
no pull request (landed with this record: the frictions how-to, the surface matrix's two notes,
the CLI-writer pattern's bullet, OCE's review-cost ledger rows; still to do: register curation
of four duplicate groups and 43 entries without a Status line). B: tool facts, one pull request
per estate. C: rules, three. D: skills, two. E: Practice Core, one. F: directives, one (context
under 30 % at the edit). G: docs, plans and templates, two. H: whole-file ports, one. At most
eleven per estate, one open at a time across both, OCE first so the twin carries its review's
cures. The item-to-group table is in the gitignored analysis directory (`homed/landing-plan.md`
under the session directory) and is rebuilt from this record's three write-list entries.

**The directive slice (OCE pull request 329) took a second cure.** Its merge door computed open
by name. The seat asked Copilot to read the cured tip first. The review opened no thread; its
overview alone said conflicts remained in `principles.md` and `testing-strategy.md` and named
none. Read against their neighbours, three sentences the slice had added were wider than their
sources: a "records are not rewritten" sentence inside the bullet that says to repair historical
data in place; a seat's reading of a testing word given as the owner's rule, with "default" in
two senses; and an "ordering claim" sentence after text that says order is implementation. Each
was narrowed in both estates' lanes (context 20.9 % at the edit). JC.net's lane working tree also
holds the archive-proof cure of the first round (applied at 17 %), with no branch and no commit
until 329 merges.

**Cricket suite 14** (02:26Z frame): both legs DRIFTING, both frames NARROWED. Taken: the list's
open and landed counts lead every report; the memory-surface group lands now; 329 merges at its
next open door with no further round; scans are labelled as scans.

### 2026-10-02T02:14Z — the buffer stage, second record: a correction, more drains, and the order re-planned (Hazel tracks Trunk, 7d8b9d)

**Correction to the entry before this one.** That entry says the seat was above PDR-052's floor
and quotes a meter reading of 63.9 % at 01:33Z. The reading was stale: the compaction of 01:28Z
had already happened and the meter still described the transcript before it. The next read gave
28.9 %. After a compaction, read the meter again after a few tool calls before queuing directive
work on its first answer.

**The held pull request is released.** The cure for OCE's pull request 329 was applied at 29.5 %
(read immediately before), after its proof recipe was run once on a real archive. The text now
states one proof: the archive's body, after any frontmatter of its own, equals the moved range's
bytes in the pre-move blob (the surface at the move commit's parent); ranges that are not
contiguous are cut from that blob and joined in file order; nothing is added to the archive. It is
pushed (`6503a286e`), both threads are answered and resolved, and a monitor waits for the merge
condition. JC.net's twin of the same cure is NOT applied: the meter read 30.0 % immediately
before, so it waits for the next compaction (the script is `a71b` in the session's state
directory; JC.net's prepared directive patch is staged in its lane's working tree, uncommitted).

**More drains, with what each one is and is not.**

- Frictions, both directions. OCE to JC.net: as the entry before this one says. JC.net to OCE:
  eight entries were absent from OCE; two apply to OCE's code and are ported with a check each
  (F-225, F-239); six describe JC.net alone. OCE's F-207 and F-191 gained a note that JC.net
  holds the cure.
- Patterns. The exchange register decided "compare by name, then bring the absent" (rows L27
  and C18) and never executed it; the transplant record says the pattern files "did not travel";
  no JC.net commit ever deleted one. 231 files are now in JC.net as OCE's text (twelve links to
  absent targets made plain, the index regenerated at 246, validators passing). Every ported
  file's use-this-when statement was read; each states a general condition. 38 cite OCE product
  code as the proving instance, and JC.net's patterns README now says where such a path lives.
  The twelve files both estates held with different text are converged in JC.net.
- OCE's Director rulings ledger: a queue of the pending-graduations kind under another name (9
  unhomed, 11 thin homes, 2 addenda, dated August; its plan step never ran). All 22 are read:
  ten homed or tracked, four expired or executed, seven need a write (W70 to W75 and W77
  below), and one (the content boundary of a lane classified private) needs a read of the
  privacy directive before anything is written.
- Handoff archives: none of the seven archive files was in the record source. All are now read
  for owner words. The standing rulings found are homed, or are W84 to W88 below.
- Machine-local plans: sixteen files dated after the 2026-08-14 triage, read by heading and by
  their reflective sections; two landed whole, two belong to a third estate, twelve are executed
  session plans; three lessons extracted (W67 to W69).
- Platform memory: every graduation marker in the Claude per-user directories names a path that
  exists; four entries marked graduated; five stay by decision (four owner-private, one machine
  configuration). The 56-entry directory under OCE's former checkout name was read by name and
  each entry probed; it carries a retirement note that says so. Codex's memory is vendor-generated
  task summaries, read by heading. Three lessons extracted (W80, W81, W83) and two product ideas
  with triggers (graph sub-setting at the graph resource factory; a component workbench when a
  second widget arrives), which join OCE's product backlog at the list's close.
- Live napkins: the entries other seats wrote are read; each names its home, bar two lessons
  (W91, W92). The three unconsolidated napkins were extracted into register candidates on
  2026-09-13 and 14; their archive waits on the owner's privacy review.
- NOT yet drained: the experience files written since 2026-09-14 (27 in JC.net, 28 in OCE; to be
  read whole at the seat); this seat's own napkin entries (each to a home or a write).

**Write-list items W66 to W92** (W1 to W65 are in the entries of 01:10Z and after):

- W66 and W67, tool facts: Copilot's automatic review may not bind a merge-only tip; the Claude
  Bash sandbox can return empty reads under `.agent/memory/`; a worktree's local default branch
  can sit behind the remote, so cut from `origin/<default>`.
- W68, the validators rule: an instrument's evidence is taken at the moment and on the bytes it
  describes; test an instrument for evidence integrity as well as function.
- W69, the fleet design review rule: a call cap bounds calls, not results; price each leg from
  what it reads.
- W70, the worktree-hygiene rule: system residue (`.DS_Store` and its kind) is gitignored and
  deleted on find (owner, 2026-08-02).
- W71, the verdicts rule: a fixed external thing at risk gets a mobilisation verdict, never the
  decision re-offered as options (owner, 2026-07-29).
- W72 and W73, tool facts: CI can drop webhook events under throttle and a push re-fires them;
  seats of one session share one scratchpad directory, so a distinguishing token goes in every
  scratchpad filename.
- W74, the handoff rule: owner rulings, deliberate oddities and recorded mistakes are
  inheritable; lane and pull-request state are recomputed.
- W75, the ESM rule: zero `require`; a dynamic import is an error unless it carries a recorded
  exemption (owner, 2026-08-09).
- W76, home chosen at the rules slice: additions never silently subtract standing capabilities,
  and omissions bear the burden of proof (owner, 2026-07-29).
- W77 and W86, the ticket-management skill: work that spans two projects carries a linked ticket
  in each; milestones are simple, completable and reflect externally visible changes, and themes
  are labels (owner).
- W80, tool facts: download external data once to a scratch file and read it locally.
- W81, the napkin skill: an entry marked blocking or deferred carries a resolution annotation
  before the napkin rotates.
- W83 and W84, the pull-request lifecycle skill: a superseded source pull request closes only
  when every surviving delta has a merged successor or an evidenced supersession; every read of
  reviews is the bare list, never a filtered one, and a Copilot request is an ordinary call any
  seat may make (owner; JC.net's copy lacks both).
- W87 and W88, to check at the skills slice: "do not assume the plan is correct or useful"
  (owner) in the plan skill; Cricket in pairs, one normal and one adversarial (owner) in the
  Cricket skill.
- W91, the cross-estate rule: "the same bytes" is a goal for the outcome; before the bytes move,
  grep the importers of every shared module the port changes in each estate.
- W92, testing recipes: a fake that answers in sequence, or a clock keyed to a count of the
  product's reads, is forbidden; move the proof to the seam where the state is a constant, or
  change the world on what the product writes.
- (W78, W79, W82, W85, W89 and W90 were opened and closed in the same pass: each was found homed
  or released on a second probe.)

**The order, re-planned after two review legs.** Both legs found that slices were ordered ahead
of undrained buffers and that "read" was claimed where the seat had sampled. The order now:
finish the drains (the experience files, the seat's own napkin entries); close and dedupe the
write list; then land it grouped by home surface. Memory-surface writes ride the coordination
branches. Doctrine goes by pull request, ten files or fewer, the same bytes in both estates, one
pull request at a time, with drains continuing in review waits. Two items the previous seat
named get a step at the list's close: converge the three shared files after the slices that edit
them, and re-true the event-cited paragraphs.

**For the owner, from these drains:** nine foreign-estate files in the machine-local plans
directory (seven of 2026-08-14 and two more): delete or keep? One lane's work is on disk only:
OCE's J2 docs-validators worktree holds two modified files and three untracked directories, 153
commits behind its base; it is the partner seat's lane and is recorded in OCE's continuity
record.

### 2026-10-02T01:46Z — the buffer stage opens: the frictions port, the 304 recomputed, and the held cure (Hazel tracks Trunk, 7d8b9d)

The record source is read to the end (the entry of 01:10Z carries its write list). This entry
carries what the buffer stage has done so far and the state a later seat needs to continue it.

**The frictions audit.** OCE's register held 134 entries JC.net's lacked. Every entry was read. A
history search per entry (with a control phrase) found that no commit on any JC.net ref ever held
one of them. JC.net's register now carries 105 of them (commits `31693c6c` and `32e7c9dd` on its
coordination branch), each as OCE's text with one provenance line that states the date, that the
status is OCE's reading at its own dates, and what a probe of JC.net's tree read: the surface or
the cure marker found, what was not re-run, or that the entry describes a platform's behaviour or
a practice observation with no code surface. Not ported: 23 entries whose subject exists only in
OCE (F-40, F-51, F-74, F-134, F-141, F-175, F-189, F-190, F-203, F-205, F-208, F-209, F-210,
F-227, F-245, F-249, F-252, F-265, F-269, F-271, F-277, F-280, F-281); five OCE records as closed
(F-09, F-75, F-90, F-138, F-195); and F-191, which JC.net has cured (both model windows are
registered there; OCE registers one).

The first port entered 101 entries with most provenance lines reading "not yet", against the
seat's own stated gate of a check before entry. Two review legs named it, the checks were run,
and the second commit carries their results. That first commit never left the machine: the link
validator refused its push on two links to plans JC.net lacks.

What the checks found for the code lanes, beyond the entries themselves:

- F-207 (the hook policy's argv matcher reads prose as commands): JC.net's hook policy handles
  heredoc bodies on 14 lines and OCE's on none. JC.net holds a cure OCE lacks.
- F-252, F-265 and F-269 are OCE-only because JC.net already holds the cure (the `--poll-ms`
  bound and the fs-watch lint guard; lint with `--max-warnings 0`; the stale lock reclaimed).
- F-119 may be cured in both estates (an active status literal is written on four lines of the
  collaboration-state code in each); read the claim writer before working the entry.
- Duplicates to merge when the register is next curated: F-76 with F-92; F-63 with F-154; F-32,
  F-48, F-149 and F-152. F-44, F-105, F-148, F-170, F-173, F-180, F-196 and F-211 are one family
  (the heartbeat does not say what its reader takes it to say).
- 43 of the 134 entries carry no Status line in the form the register's other entries use.

Two facts from frictions entries join the tool-facts reference at the next gotchas slice: Copilot's
automatic review may not bind a tip that is only a merge commit of the base (F-167), and the
Claude Bash tool's sandbox can return empty content for reads under `.agent/memory/` (F-111).

**The class verdict on 304 obligations, recomputed.** The record reading gave 304 obligations
one class verdict: an open item of a live lane, carried by the tracked record that states it. A
review leg called that unsampled. It is now recomputed for all 304 by script: the named record
must be a tracked file today and the obligation's words must be in it. 286 are confirmed by the
script. The other 18 were read at the seat: 11 are carried by the record named; three are
carried by a tracked plan instead; two are done (castr's pull request 53 merged on 2026-08-25;
slice 1b-ii landed as pull request 196); two are released as stale. Five of the 18 came from
two gitignored state files in OCE, `cross-worktree-work-state.md` (2026-06-27) and a comms draft
of 2026-07-31. Their obligations are either done (PDR-118 is Accepted; the data-sources document
exists; the coordination branch and its commits are gone and its pull request landed) or carried
by a tracked plan. The state map is three months stale and is named here for the claims and
state audit.

**The held pull request and its release sensor.** OCE's pull request 329 (five directives, two
skills, tool facts) holds on two true Copilot findings in the no-snapshot text of
`continuity-practice.md` and the consolidate-docs skill: the text asks the archive to carry a
first line naming a commit and to be byte-identical to the moved ranges, and never says how
non-contiguous ranges are compared. The cure edits a directive. PDR-052 allows that only under
30 % context, and the seat is above it. The rule: PDR-052. The release sensor: the context
meter (`agent-tools session-metadata`) reading under 30 % after the seat's next compaction, or
a fresh session. Last read: 63.9 % at 01:33Z on 2026-10-02. Under the one-open-pull-request
limit no other doctrine slice opens while it holds.

The drafted cure, to be re-read in full under 30 % before it leaves draft:

- Directive, the parenthetical: "(where the finished ranges are not contiguous, each range moves
  whole in file order into the archive with nothing added, and the commit that carries the move
  names the pre-move commit in its message; no snapshot of the whole file is written, because
  that commit already preserves it)".
- Directive, step 3: "(for ranges that are not contiguous, the same ranges cut from the pre-move
  commit's blob and concatenated in file order)".
- The consolidate-docs skill, step 6b: the same representation.
- Before applying: check whether any validator requires frontmatter in a continuity archive, and
  run the proof once on a real file.
- The same text is merged in JC.net (pull request 287), so JC.net's directive slice carries the
  same cure with the directive patch already built for it.

**Write-list items W61 to W65** (they complete the list in the entry of 01:10Z):

- W61, the scope-from-goal rule: under a fix or nits instruction, values the owner typed are out
  of scope unless an agreed line puts them in.
- W62, PDR-052: a seat left with only directive edits above the floor asks for a compaction or
  reports the queued edit.
- W63, JC.net's docs: true ADR-015 and the surface matrix on the Codex rules layer.
- W64, the Core: PDR-081 still describes the retired curator-passes log as live.
- W65, the Cricket skill's frame clause: each hold states its rule, its release sensor and the
  sensor's last read.

**Questions for the owner found in live records** (asked in the seat's reports; none answered yet):

- Seven plan files in the machine-local Claude plans directory belong to other estates (the
  triage of 2026-08-14 left them in place). Delete them or keep them? The seat deletes nothing
  without the owner's word. Sixteen files there are dated after that triage and are unread.
- The upstream mirror: re-cut an unworked carrier when the mirror moves, and run the mirror more
  often than every six hours or on upstream releases?
- The privacy review of three session-2 napkins, which their archive waits on.
- The cards on twenty-eight register entries and Proposal E.

**Still open in the buffer stage, in order:** the Director handoff's standing lessons (OCE holds
each as a pattern too; JC.net holds none of those patterns) and its archived rulings; the rulings
ledger; the napkins; platform memory; the sixteen unread machine-local plans; experience files;
the pattern gap (OCE 247, JC.net 16: the transplant record says the pattern files "did not
travel", the exchange register's rows L27 and C18 say "compare by name, then bring the absent",
and no JC.net commit ever deleted a pattern file).

### 2026-10-02T01:10Z — the write list: lessons read out of the record files that are not yet in their homes (Hazel tracks Trunk, 7d8b9d)

Why this entry exists: the reading of the record files (handoff records, thread records, the
continuity record) produces lessons faster than pull requests land them, one open pull request at a
time. Until each lesson below is in its home, this entry is its tracked copy. A line leaves the list
when its home holds it. The per-item verdicts are in the gitignored state directory
`.agent/state/collaboration/comms-analysis-2026-10-01/session-7d8b9d/homed/seat/` on the host.

Reading state: 2,748 items triaged; every handoff obligation read (420); the knowledge items read at
the seat so far are the 350 highest-ranked and 720 of the 1,048 that remain; 348 obligations in live
tracked records are unread. One independent check of thirty of the seat's "homed" verdicts against
the text confirmed 27 and found 3 covered by a principle only.

Landed since the last entry: OCE 328 and JC.net 287 (the skills slice in both estates, the
whole-file snapshot removed from the continuity directive and `consolidate-docs`, 30 tool facts in
JC.net and 25 in OCE); OCE's directive slice is open.

Scripted and waiting for a slice (same bytes for both estates unless marked):

- Testing recipes (`docs/engineering/testing-tdd-recipes.md`), a section of lessons from review
  rounds; rules `validators-must-recompute-not-just-record` (run a new check against the real input
  shape before trusting it; one reader per fact), `consolidate-at-second-consumer`,
  `loop-exit-criteria-required`, `respect-active-agent-claims`, `pr-comments-resolve-and-recheck`
  (a reply that says "cured in" waits until the push is read back from the remote),
  `use-built-agent-tools-cli` (the owner's correction of 2026-08-10: clear derived artefacts with
  the workspace's own `run clean`, never raw `rm`); skill `dependency-currency`.
- `verify-dont-trust`: a public claim needs support its reader can open; a hash of local evidence is
  integrity for its holders only; a seat's own scan cannot certify its completeness.
- `design-work-for-small-prs`: an owner ruling lands alone; an intake is framed as concepts, the
  owner's rulings first; no slice ships text that is false until a later slice lands.
- `fleet-design-review-before-expensive-fleets`: an agent started near the usage limit returns
  nothing; a narrow verifier can return a stub on its first run, caught only by reading every leg.
- Napkin skill: on a shared primary a candidate enters `napkin.md` in the records commit that
  carries it; lint the append before a push.
- Fold skill: a fold is reviewed before it merges (a fold merged unreviewed took six true findings
  afterwards; on 2026-10-01 one estate's vendor reviews found two false entries the other had
  merged unreviewed).
- Pull-request skill: the docs-only class is decided per path, never per directory.
- `start-right-team`: when the owner pairs seats the first message carries state and assignments
  come from the routing or after asking; two seats on one pull request divide it by direct message.
- `consolidate-until-done`: orchestration is not curation (the owner stopped a consolidation over
  this on 2026-06-16 and affirmed the lesson): the seat reads raw sources itself, checks every leg
  against the source and writes each lesson in its own words.
- JC.net only, four directive edits built and read under the 30 % context line (PDR-052): the
  repeated ask stands (`user-collaboration`); two sharpenings in `testing-strategy`; a new
  obligation binds forward (`principles`); two fluency paragraphs OCE's `metacognition` holds (a
  second finish-line instance; a check's name is a claim about its target).

Not yet scripted (each is the whole lesson):

- Pull-request skill. Owed branches over one free slot are ordered, each opener counting only those
  named before it. A seat of unproven liveness does not hold the only landing slot overnight: set a
  takeover trigger or hand the slot over. A seat the owner names alone both directs and executes,
  and its limit is one open pull request. A pull request authored in the cloud environment is
  marked ready by the owner, or by a seat only after the owner's stated acceptance. Write the
  description before the first commit. Authoring for review: state the invariant and the check,
  never an enumeration of cases; a region patch is read by whole-file reviewers, so read the
  untouched text and the sibling files for contradictions before opening (five of eight rounds on
  one records pull request; four rounds on OCE 328).
- `review-feedback-defaults-to-triage`: where the cure is cheaper than the argument, cure; a second
  raising by an independent reviewer tips a disposition to a cure.
- JC.net pull-request skill, a port from OCE: a reviewer's result has two transports, and Codex's
  completion comment for a zero-findings run is a positive result (owner ruling, 2026-09-16).
- Inter-practice skill: a port is cut from the destination's own text with edits that assert their
  anchors, from a diff of normalised files, never by applying the other estate's raw patch (on
  2026-10-02 a lenient `patch` run reversed a hunk the target already held and a re-run script
  duplicated three passages); estate-local self-references are rewritten; records commits in the
  second estate are named in the receipt.
- `use-monitor-for-event-driven-wake`: a watching role watches every surface it answers for (a
  comms-only watcher was blind to checks, threads and mergeability); a pull-request watcher emits
  terminal conditions only, since a count ticker spends context.
- `start-right-team`: crossed routing broadcasts are settled by ratifying the in-flight version and
  closing the chain in one event.
- Plan skill: before writing a procedure that touches shared state, list every actor that reads or
  writes each resource, schedules included; an amendment that can only be decided at execution is
  recorded in the conserved design.
- Fleet rule: legs share no mutable resource (shared scratch filenames crossed 7 of 28 spawns);
  carry the task id through the schema; the committed design is the task specification, never a
  script draft in a scratchpad; a survey that asks models for the owner's facts produces guesses,
  and its consensus is not a decision input (owner, 2026-08-17).
- `owner-attention-at-action-moments`: an answer given on a premise that changed within minutes is
  asked again, never overridden and never obeyed blind.
- `precedence-is-not-approval`: a question about the value or risk of publishing is not permission
  to publish; JC.net also takes OCE's sentence on recorded keep-open grants.
- Wrap skill and liveness rule: a compaction does not reliably end a session's processes (verify by
  the task list, re-arm only what is absent; JC.net's liveness rule still says it always does); the
  freeze at the owner's compaction word covers every outward act after the push (title, body,
  thread replies, review requests).
- `consolidate-until-done`: a surface that accepts appends is a buffer from its birth; name its
  drain when it is created (this pass found three with none: a Director handoff's standing
  lessons, a Director rulings ledger, a frictions register 134 entries ahead of its twin).
- Ticket-management skill: tickets a retired seat left In Progress are re-labelled at the next seat
  spin-up; no stopgap outlives its cure, and at merge the ticket records the sanction retired with
  the cure's evidence.
- Session-handoff skill against the wrap skill on handover commits: read both, reconcile.
- JC.net cricket skill, a port: frames cite quotes as `git show <sha>:<path>`.
- Surface matrix, Codex section: the bounded-poll challenge (a nonce event found only by declared
  foreground polling; the reply records nonce, timestamps, command, cadence and turn state).
- Pattern `cli-writer-boundary-discipline`: after an irreversible call every non-confirming answer
  is indeterminate; audit each failure arm added after a mutation for misreporting a completed
  write (`comms send` can exit 1 after a durable write: read `comms list` before a retry).
- Gotchas, next batch: `comms send --body` over 1,500 characters is refused before writing, use
  `--body-file` (checked against the code in both estates); pass the registered `--model` on every
  comms call; `patch` run without a terminal reverses a hunk the target already holds, pass `-N`;
  `git log %cI` moves on a rebase or amend, `%aI` does not; HTTP 403 to a scripted client is a
  refusal, never a dead link; a harness classifier refusal is session-local and a transient
  classifier error retries; after GitHub Code Quality is re-enabled an older head is refused at
  all-green until the branch is updated; an out-of-credit Codex connector posts a usage-limits
  notice within seconds; `/restart` keeps hook session state; a `NODE_OPTIONS` tap reaches only the
  config that runs; when the primary checkout cannot build, a lane worktree's built CLI still
  carries comms; `mint-token --scope` enforcement depends on which build runs; vitest paths under
  `pnpm --filter` are workspace-relative; prettier inside a workspace resolves that workspace's
  config; in zsh `status` is read-only; the shared CLI registry files are additive-only across
  parallel lanes; pass `-c core.fsmonitor=false` where git sleeps on the monitor socket (OCE's
  clone sets it; JC.net's does not).
- TypeScript gotchas: Sonar S7765 (prefer includes) makes a value-is-X type guard unsound where the
  argument is wider than the element type, keep `.some`; `z.object({}).strict()` is needed to emit
  `additionalProperties: false`; a refine that lets both optional keys be absent passes keyless
  input, so make the keys required and nullable.
- Decision records: PDR-009's thin-wrapper clause gains "an adapter adds no substantive
  instruction of its own"; five Directors in fifty hours showed five transmission-class error
  signatures (for PDR-117 or the Director handoff, after the source handoff is read).
- OCE docs: two Clerk facts and an ADR-213 note; a report for the agent-tools architecture
  exploration of 2026-08-01 (three contracts, four feedback timescales), whose only source is a
  gitignored handoff.
- Directive-bound, waiting for a context under 30 % (PDR-052), `privacy`: a review request for a
  durable capture carries metadata only; originals behind test fixtures are never published.
- Ports to JC.net: a Sonar disposition policy. Ports to OCE: the skills `author-skills` and
  `deslop` (no history of either in OCE); OCE removed its own `distillation` skill on 2026-04-10, so
  that one is compared with `consolidate-docs` and `curator-pass` before any port.

For the frictions audit (each claim is checked against the code before it enters a register):
eleven defects from this reading (the commit-queue guard's estate-wide ordering; three spawn-tool
defects; a watcher arming under a different identity tuple than the claims registry; no
authoring-time check on agent attribution; `worktree-hygiene` §8 on `--comms-dir`; a rule that did
not fire on pre-authored brief text; `ClaimArea.kind`; a cap one line from its limit), beside the
134 entries only OCE's register holds.

Named items from the opening frame: the 51 deferred rows of OCE's decision table are decided; the
three shared files' divergence is measured and their convergence is not started; OCE's lockstep
test is friction F-229 for the code lanes; the event-cited paragraphs are not re-trued.

Addendum, 2026-10-02T01:22Z. The knowledge items of the record files are read to the end: 1,048
verdicts in the last tier (homed 584; released with a reason 145; homed in one estate 107; carried
by a named plan, thread or register 97; unhomed 83; for the frictions audit 11; for the code lanes
9; written 6; owner-private 6). A seeded sample of thirty default-homed verdicts was re-probed one
by one: 28 confirmed, one confirmed under a wider phrase, one wrong in its named home; the group
check that followed moved 27 verdicts from homed to homed in one estate. Unread from this source:
348 obligations found in live tracked records.

More lessons for the list above (each is the whole lesson):

- Pull-request skill: no draft pull request waits for a ratification; the plan waits on its branch
  and ticket, and the pull request opens at the ratification moment (owner). Never merge on an
  authority the pull request's own diff grants, and re-read the open threads before approving.
- Skill authoring: an over-bar cure to a skill that carries an evaluation suite needs the suite
  re-run and a fresh human read (the owner's human-review criterion).
- `precedence-is-not-approval`: a standing owner grant never covers the hook-blocked family,
  another organisation's surfaces, a hook bypass, a settings change or spend over the agreed
  band; reading a sibling organisation's repositories is the owner's to grant, asked in one card.
- `invoke-test-expert`: each test change gets a test-expert verdict before commit, recorded in the
  commit message or the pull request's body.
- `no-warning-toleration`: any non-zero or failed check is a real failure; no expected-failure
  category exists (owner).
- Surface matrix: a rule adapter's import path follows the vendor's documentation (relative to the
  importing file); launch-time expansion is a prediction until a fresh session observes it.
- Executive memory `owner-signal-interpretation`: an owner direction is scoped to its session until
  the owner declares it standing; a count of instances never makes it standing.
- Accessibility reference: axe-core under Playwright's forced colours mis-reports contrast, because
  the text fill colour is not forced (read the source record for the handling the owner authorised).
- Gotchas, added to the next batch: profile a gate before optimising it (`turbo run --summarize` and
  a timing line per step); git commands and quality gates run outside the sandbox (OCE's build doc
  says so, JC.net's does not); a billing-capped review bot posts a skip notice, and a skip is not a
  pass; `gh pr create --draft` fails on a branch with no commit beyond its base.
- OCE docs: target tsconfig flags resolve from one base and no workspace restates or relaxes one
  (owner ruling); four deferred security control families, each with a promotion trigger, reviewed
  at each roadmap phase boundary; Sonar S7764 is rejected on the injectable-window test seam.
- Capability inventory: JC.net's own ADR tree (22 records about the site) holds none of the OCE
  practice ADRs that 27 verdicts name; eleven of them are one decision (the shape of the cure for
  Claude's self-modification authorisation, OCE ADR-187), recorded by a JC.net seat with no JC.net
  home. The form of that port is decided in the capability inventory.

Held: OCE pull request 329 (five directives, two skills, the gotchas reference) is open with two
true findings on the no-snapshot text: the archive is asked to carry a first line naming a commit
and to be byte-identical to the moved ranges, and the ranges' boundaries are not defined. JC.net
merged the same text in its pull request 287. The cure is drafted (the ranges move with nothing
added; the proof compares the archive with the same ranges cut from the pre-move commit's blob and
concatenated; the move's commit message names that commit). It edits a directive, so by PDR-052 it
waits for this seat's context to read under 30 %, after its next compaction; no other pull request
opens meanwhile.

Two breaches of standing rules by this seat, found by this reading and cured from 01:19Z: every
Bash call had been a compound command with substitution and heredoc writes, against
`unattended-seats-never-prompt` (no prompt held the seat, because the session's permission mode
did not ask); and two waits for a clock time were `until`/`sleep` loops, against
`use-monitor-for-event-driven-wake`. The compaction summary carried some forty constraints and
neither rule.

### 2026-10-02T00:10Z — both folds merged, the record files half-read (Hazel tracks Trunk, 7d8b9d)

- **Folds.** JC.net 276 merged as SHA:9f4d8920 (23:38Z) and OCE 318 as SHA:73668b712 (23:59Z);
  the successors are `coordination/2026-10-02-9f4d89` and `coordination/2026-10-02-73668b`.
  Read-only reviewers checked the records before the ready-marks: two failed and four
  borderline claims in the continuity records, and eleven frictions entries whose claims the
  code did not bear out, all corrected first. OCE's vendor reviews then found two more in the
  register (F-208's status line, F-219's scope); both are cured.
- **Landed since 21:41Z.** Rules: JC.net 282, 283 and 284, OCE 324, 325 and 326 (35 rule files
  across the two estates). JC.net 285 is open: nine hunk-level ports from OCE, the
  history-check cure (`--all`) and nine tool facts.
- **Records (wave 2).** The 200 owner words no comms event held are decided. A fleet triaged
  the other 2,748 items: knowledge 1,867, possibly open obligations 768, released 113. A homed
  check covered 450 knowledge items: 189 homed in both estates, 76 in one, 141 in neither, 44
  for code lanes. The seat read all 420 obligations found in handoff records: every pull
  request they name is merged, and nine open obligations that no surface tracked are listed
  in the pass's plan file. 2,166 knowledge items are not yet checked for a home.
- **Spend.** The fleet ceiling the owner set (30M subagent tokens) is spent to about 29.6M.
  The triage stage cost 2.1M against an estimate of 0.7M (no pilot leg); wave 2 as a whole
  ran about 10.0M against 9.4M estimated, inside the owner's per-wave stop term. No fleet runs
  without the owner's word.
- **Divergence.** 150 files and 7,225 lines at the default tips at 23:16Z, against 147 and
  7,142 at the open; fifteen files carry 5,021 of the lines.
- **Next safe step.** Merge 285 at its pushed head. OCE's twin slice is saved as one patch
  (`split/j-oce-prepared-2026-10-01.patch` in the pass's state directory) and is cut after 285
  merges. Then OCE's frictions register: 134 entries JC.net's register lacks, each read
  against the code in both estates. The plan file is
  `.agent/state/collaboration/comms-analysis-2026-10-01/plan.md` (gitignored, this machine).

### 2026-10-01T21:41Z — wave 1 decided, the first pull request in review, a context boundary (Hazel tracks Trunk, 7d8b9d)

- **Counts.** Pending graduations: 0 live in each estate. Buffers not yet drained: OCE's napkin,
  OCE's frictions register (130 entries), platform memory, JC.net's napkin rotation. Divergence:
  147 files and 7,142 lines at the open; 146 and 7,148 with the first batch.
- **Wave 1, both comms streams.** 2,247 events gave 2,200 items (2,197 quotes verified by
  script; a Fable read of six bundles whole found 279 of 295 pieces of durable substance in the
  maps). 766 mechanisms, the 51 rows of the older decision table and 29 supplementary clusters
  are decided, 846 in all: released 349, homed 240, routed 105, to write 69, homed and recurred
  50, do-now 21, owner 12. Of the 257 that need an act, 116 target the frictions register. At
  this boundary one Fable leg is reading 122 released and homed verdicts back to source and one
  Opus leg is merging the 118 frictions verdicts into register edits. No wave 1 verdict is
  applied yet.
- **Spend.** About 16.8M sub-agent tokens of the 30M ceiling the owner set on 2026-10-01
  ("30M ceiling, all waves"); wave 1 took 13.9M against an 11M estimate. Waves 2 to 4 as first
  estimated need about 16.5M, so the ceiling is with the owner as three options (match new items
  to wave 1's mechanisms; raise to 36M; match and drop the pass over events the mappers left as
  state). Wave 2's fleet is not launched before the answer.
- **The first batch is landing as four small pull requests per estate** (decision records,
  rules, skills, records), one open at a time. JC.net pull request 281 (decision records) is
  open with two settlement pushes (`SHA:1a1f8f3f`, `SHA:fc519bab`). Copilot found that PDR-075's
  own text makes ratification hinge on a successor's bootstrap from the stream; a search of both
  estates' comms stores found none since 2026-05-23, so PDR-075 is **Proposed, not Accepted**.
  OCE's twin is three local commits on `docs/consolidation-2a-decision-records` in the lane
  worktree `consolidation-2`, not pushed. The whole-batch commits on
  `docs/consolidation-2-routed-cures` (JC.net `SHA:767c05a9`, OCE `SHA:f9f0a2ca6`) are local
  only and are the source the splits are cut from; they stay until every split has merged.
- **Channel by surface class, from this boundary.** The first batch's memory surfaces (two
  patterns, the frictions register, this record, JC.net's pending-graduations heading) are moved
  from the lane to each primary's coordination branch, where `coordination-branch-24h-lifetime`
  clause 4 puts them. Later register and record edits go the same way and need no pull request
  of their own; doctrine stays on lanes.
- **Questions open with the owner (asked in the session, unanswered at this boundary).** What
  "ratify it" before a plan's text exists ratifies; re-ratifying OCE's visitor checkout runbook
  with its three edits of 2026-09-06; the private-origin exports in OCE's public research
  package; whether the context loop's three skills run at every firing; when a compaction's
  boundary records are committed (PDR-063's drill against the relayed "commit and push
  post-compaction"); re-ratifying both transplant runbook copies; ADR-180's amendment of
  2026-09-26; PDR-142's three held concept sentences; the user-value skill's eval; OCE's
  rulesets and CODEOWNERS; the rewritten CONTENT-2; the author address on OCE's bot-committed
  commits; PDR-075 to Accepted by ratification; the ceiling.
- **From the partner seat's napkin block of 2026-10-01T20:5xZ, for this seat's lanes.** A
  clause for `cross-estate-work-must-reduce-divergence` (a difference between the estates is
  read as a decision before it is read as a loss; before porting, `git log -S` in the
  destination for each thing it lacks); an amendment to `testing-strategy.md` §Rules (a
  surviving mutant on a decision value is the directive working; a directive edit, so it waits
  for a context under 30 % and the twin of OCE pull request 309); the raw-character landing of
  a Unicode escape, for `shell-and-tooling-gotchas.md` in both estates; Copilot's findings in a
  review body under "Findings: None" (seen again on 281's second round).
- **Working files, on disk only.** Each estate's gitignored
  `.agent/state/collaboration/comms-analysis-2026-10-01/`: `plan.md` (JC.net) is the running
  plan and holds every command; `session-7d8b9d/` is the scratch copy (briefs, bundles, maps,
  joins, clusters, verdict worklists, apply scripts, split tooling).
- **Re-arm recipe, as if nothing survives.** The comms watcher in each estate, from its root:
  `pnpm --silent agent-tools:collaboration-state -- comms watch --platform claude --model
  claude-fable-5-1 --supervisor-pid "$PPID" --step-timeout-ms 120000 --max-events-per-drain
  100`. Two session crons: `7,37 * * * *` "run a reduced Cricket suite, one Fable normal and one
  Fable adversarial. The loop ends once the dedicated consolidation is complete"; `22,52 * * * *`
  "check the context percentage, if it is above 55% make the current context safe, then carry
  on" with the three skills named. A watch on pull request 281's checks and Copilot's review.
- **Next, in order.** Merge 281 at the door; push and open OCE's twin; then rules, skills and
  records the same way. Read the Fable leg's disagreements and re-decide what it names. Apply
  the frictions edits to both coordination branches. Apply the written, routed and do-now
  verdicts in slices by target family, each sized before its first commit. Re-plan waves 2 to 4
  on the owner's answer.

### 2026-10-01T21:0xZ — the second pass opens: method, first batch, wave 1 in flight (Hazel tracks Trunk, 7d8b9d)

- **The owner's brief for this pass (2026-10-01, typed at the session's open), verbatim:** "This is
  a dedicated consolidation session. The goal is knowledge curation, never fitness numbers. Drain
  all sources first, e.g. comms events, then drain the drainable buffers, then drain all pending
  graduations and similar concepts... and I do mean drain, not do some and decide that the rest
  are "for the owner to decide", I expect it done, completely, if you need to ask questions then
  ask them." "It is also part of a wider programme to bring the Practice in both repos up to the
  same level of capability." "Use fleets of Sonnet 5.5 for broad audits, Opus 5.5 for reduction,
  and one or two Fable for syntheses and spot checks, the spot checks back to the source material
  matter, they help spot where the lower power agents missed something." "Take it slow, be
  thorough, plan before you start, and re-plan periodically."
- **The owner's two answers (question tool, 2026-10-01, the selected options verbatim).** Fleet
  price: "30M ceiling, all waves (Recommended)"; the option's description, written by this seat
  and selected with it, read "All four waves under a 30M subagent-token ceiling. I report
  measured spend and yield at each wave boundary and stop for you if any wave runs 50% over its
  estimate." The parity code lanes (exchange rows
  L7 and L8, the commit queue, the smoke suites to real tests, the divergence command) and OCE's
  lockstep-test cure: "Crucible, after its list (Recommended)".
- **Seats.** n=2: this seat curates (the buffers, the queues, the comms streams as sources, the
  doctrine homes, on one lane per estate landing by pull request); Crucible binds Slag (7b999c)
  holds the continuity records, every other thread and all code. This seat is registered on both
  streams and holds a curator claim in each.
- **Method, cured by a three-leg design review before the price was asked** (a frame challenge,
  a run of the scripts, an assumptions read; each returned "revise"). Sources are cut into
  bundles by script; one Sonnet leg maps each bundle into items, each with an exact quote; a
  script checks every quote at its source, checks that every event is accounted for, marks
  word-for-word copies across the two streams and probes both estates for a home; Opus legs
  group the items by mechanism, in batches, and a merge leg joins the same mechanism across
  batches, so a thing that recurs is decided once with its computed count; Opus legs decide each
  cluster (release, homed, homed but recurred, write, do now, route, owner), reading the home
  before saying "homed"; Fable legs read back to the source (a cold read of sampled bundles for
  recall, a second vote on every released cluster that holds a lesson, a defect or an owner
  word); the seat reads every proposed write and applies it first-hand, the same bytes in both
  estates. A mechanism that recurred after its home existed is cured by a tool or a trigger and
  goes to the frictions register, never to another paragraph. Scripts and briefs are in the
  session's scratch directory and are copied to each estate's gitignored
  `.agent/state/collaboration/comms-analysis-2026-10-01/` at the close; their tracked home is
  owed at the last wave (the retrospective's proposal 2).
- **Wave 1 (comms, both estates), measured.** 2,247 events in 39 bundles gave 2,200 items; 2,197
  quotes verified at source; every event accounted for; 240 items came from word-for-word copies;
  171 items only sequence one day's work and are read by a Fable leg, not decided; 2,029 items
  formed 933 clusters before the cross-batch merge. Spend so far about 7.6M subagent tokens of the
  30M ceiling (reviews and pilots 2.0M, map 3.95M, clusters 1.16M, the first-batch verifier 0.17M,
  Cricket 0.13M). The decide stage has not run.
- **First batch, on lane `docs/consolidation-2-routed-cures` in each estate.** The two slow-lane
  rows due 2026-10-01 are decided (PDR-130 retained; PDR-075 promoted to Proposed on two
  worked instances in distinct sessions; see the entry above for why not Accepted). The doctrine contradictions the fold reviews found are
  cured (the writer pattern's security claim first; `coordination-fold` the same bytes;
  `consolidate-docs` step 6b and `continuity-practice` without the whole-file snapshot; the
  staging row, the Monitor rule's one-shot wait, `worktree-hygiene`'s work branches, the lane cap's
  scopes, the divergence rule's clauses 1 and 3, `pr-lifecycle` Phase 7). Thirteen frictions are
  registered under one id space across both estates (F-218 to F-230). The JC.net napkin's lessons
  without a permanent home are homed.
- **Divergence** (the report's script; 389 shared paths): 147 files and 7,142 lines at this
  session's open; 146 and 7,148 with the first batch on the folded tips. The batch lowered three
  files by 43 lines (`continuity-practice` 26, `coordination-fold` 10, the commit skill 7) and
  raised two by 9 (the Core changelog 2, one entry under each estate's own header; `pr-lifecycle`
  7, OCE's pure-sync wording, which JC.net cannot carry until content binding is ported). The
  day's other lanes raised four files by 44 and lowered two by 4 (`validation-strategy` 23 and
  `testing-strategy` 14, pending the twin of OCE pull request 309; `build-system.md` 6; the
  skills README 1). Lines stand 6 above the open until that twin lands.
- **Next:** the decide stage of wave 1 with the 51 undecided table rows; the Fable read-back;
  apply; report spend and yield to the owner;
  re-plan; then the record-class sources (handoffs, continuity and thread records, experience),
  the buffers (frictions register, napkins, platform memory, plans), and the queues, audits and
  rotation.

### 2026-10-01T10:4xZ — the handoff for a fresh session (Hawthorn binds Bracken, b3f117)

- The owner asked for a full handoff for a fresh session with no access to this context, then the
  session's end. §Current Continuation above is that handoff, rewritten whole: the reading order,
  the owner's words verbatim, the state and counts, the next session's shape and first steps, the
  mechanics of working both estates from one session, the standing constraints, and that nothing
  waits on the owner. Two lessons of the morning are homed: a relayed constraint is a claim
  (verify-dont-trust §Briefing Facts, both estates) and two regex classes (the shell gotchas, both
  estates). The OCE push of the settled moves was refused once on skill-adapter drift after the
  rename; the adapters are regenerated in the handoff commit.

### 2026-10-01T10:3xZ — the decision matrix, the owner's cards, the settled moves (Hawthorn binds Bracken, b3f117)

- - The owner asked for the eight decisions to run through the decision lenses and for the survivors
  and unknowns to be asked at once. Three survived (the session-2 batch, by the owner's item-8 word;
  two tooling rows of the practice box; the owner-act rows of the 51); the owner answered: all seven
  session-2 items graduate (two entries and five slow-lane concepts); the tooling is not a question ("we are bringing both estates to the
  same level of capability, anything useful that one has must make it to the other"); only
  owner-ratified text changes on the owner's word; proof replaces the word for a bulk archive; the
  settled moves run now; the next session is capability parity, both ways. The report's §Decided
  2026-10-01 carries the table.
- - Moves made, both estates unless noted: snapshot removed and consolidate-docs 6b re-trued; six
  rulings recorded in PDR-117, PDR-064, PDR-125, PDR-027 and PDR-140 with the decider named, OCE's
  owner-decision item 11 withdrawn; seven session-2 items homed (testing-strategy,
  precedence-is-not-approval, user-collaboration, consolidate-docs) and this estate's register
  drained to the one slow-lane row with a 2026-12-15 review; "the lineage" written as OCE across
  live doctrine where OCE is meant (archives and the git-lineage senses untouched); the practice box
  archived byte-identical under
  `archive/practice-incoming-2026-09-14-oak-line-delta-since-e477e62f7.md` (its two tooling items
  were already the exchange register's L7 and L8 "bring" rows); the napkin gate corrected (the
  owner's 2026-09-14 card: no privacy review, archive after full processing).
- - Counts at this close: JC.net pending graduations 0 live entries (the register holds one
  slow-lane row, review 2026-12-15, not decision-debt); OCE pending graduations 0; distilled empty
  in both; OCE's frictions register 44 live under §Friction Entries and 86 unread under §Routing
  Notes.

### 2026-10-01T07:08Z — the owner's frame after the handoff (Hawthorn binds Bracken, b3f117)

- The owner, on the handoff's first decision ("compact or revert the accreted paragraphs", beside
  a line count; "just an illustrative example"), verbatim: "we are not here to tidy things away or
  hit numerical goals, we are here to make sure that knowledge is preserved, discoverable and
  accessible. Where there is ceremony it is only permitted to exist where it serves practical
  purpose, the ceremony is there as a sometime required enabler, it has no value in its own right,
  but it does have cost."
- The report's findings re-sorted under that frame (its §The owner's frame): eight decisions
  remain and five became notifications (the bulk archives stand; the whole-file snapshot is
  recommended for removal with consolidate-docs 6b re-trued to name the pre-move commit; the
  divergence rule stands; the analysts' reports stay whole; the per-user file counts leave the
  reports). The compaction proposal is withdrawn; every single-event paragraph stays where a seat
  reads and is re-trued to its evidence in place; the no-claim finding is weighed (no peer was
  live); the divergence measure's numbers are evidence, never the goal, now in the rule's
  enforcement paragraph.
- Homed: the owner's words in `consolidate-until-done` §Purpose and §Forbidden Anti-patterns and
  in `user-collaboration` §Scope Discipline, identical in both estates; the per-user feedback memory
  is the audit trail. A bounded fix under the session-over word; nothing else resumed.

### 2026-09-30T20:46Z — the retrospective and the handoff (Hawthorn binds Bracken, b3f117)

- The owner's words after the close, verbatim: "it's not 'the lineage', it's OCE. Please perform a deep
  retro then handoff. Analyse what you did, look for problems, issues with framing, incorrect
  directions. Use adversarial subagents of different kinds. Once the handoff is complete this session
  is over." And mid-retrospective: "The retro must encompass both estates. All activities involving
  both estates MUST leave them more aligned and less divergent than they were before those
  activities." The second word is now the rule `cross-estate-work-must-reduce-divergence` in both
  estates, identical bytes, the rules index and adapters regenerated in each.
- Counts at the retrospective's close: JC.net pending graduations 3 (owner-gated, the session-2
  cards), JC.net buffers 0 by the index and 78 files under the per-user directory each marked
  graduated or kept by its nature; OCE pending graduations 0 (the seven comms-table cards moved to
  `repo-continuity.md` §Open Owner-Decision Items, item 11, by the register's own rule for owner
  decisions), OCE buffers 0 by decision and 30 files under its per-user directories; OCE's frictions
  register holds 130 entries, 44 under §Friction Entries and 86 under §Routing Notes that no pass has
  read (the day's "99 to 44" counted the first heading only). The comms table's
  §H, regenerated in a functional shape: HOMED 59, MOVE 36, SESSION-SCOPED 34, SUPERSEDED 9,
  OWNER-CARD 7, OWED 51 (D-33 to SUPERSEDED, C-77 and B-22 from HOMED to OWED, D-42 and D-43 from MOVE
  to OWED after their inserts were withdrawn), every owed row re-addressed to the n=1 seat or the
  owner.
- The divergence measure, taken for the first time at the retrospective over the 388 shared paths:
  156 files and 7,444 lines differed at the consolidation's open, 147 and 7,204 at its close,
  147 and 7,139 at the retrospective's close over 389 paths; the two main
  branches differ by 210 files and 11,899 lines. Eight shared files grew more divergent during the
  day; five were unified at the retrospective and three remain, named with their reasons in the
  report.
- Six adversarial legs of different kinds (cricket-procedure-xhigh, assumptions-expert,
  architecture-expert-wilma, docs-adr-expert, a general-purpose verifier from JC.net's side, and a
  general-purpose verifier resident in OCE), the first five at 779,690 tokens. Their converging
  finding: single-event, non-owner rulings from OCE's comms stream were written into shared rules and
  skills as normative sentences (30 event ids now cited from JC.net doctrine; the rules tier grew by
  404 net lines in JC.net and 384 in OCE); the OWNER-CARD verdict stopped at decision records and let
  rules through. The OCE-side leg's verdict: OCE not better curated than at its base by its own rules (378 net rule lines of single-event
  doctrine; a YAML frontmatter destroyed by the archiving script, since restored; 86 frictions under
  §Routing Notes unread by any pass; 51 rows in the "owed" vocabulary the owner forbade on 2026-09-28,
  each now a decision to make), and a bounded repair rather than another dedicated consolidation,
  with the 86 frictions as the one curation mass left, gated on the owner's word before any move.
- The OCE-side leg's cured findings: the archiving script had rewrapped OCE's Director handoff
  frontmatter into one line (restored from the base commit); two friction paragraphs sat inside a code
  fence in `agent-tools/README.md` in both estates (moved); both handoffs said their state blocks were
  "kept" beside the sentence archiving them (removed); the frictions register's whole pre-curation
  file is archived byte-identical (consolidate-docs 6b). Its framing finding, accepted: the OWED
  verdict is the parked shape the owner forbade on 2026-09-28 ("What does owed mean? That sounds like
  parked, which is forbidden for very good reason. Use the cognitive skills"); each of the 51 rows is a
  decision still to make, and §H says so at its head. Its process finding: this seat held no claim and
  posted no comms event in either estate all day.
- Repairs made at the retrospective, in both estates where the file is shared: the two Codex inserts
  withdrawn (Sif annex, use-monitor); the relay attribution on event 01808b32 corrected; the seat's
  inference in `user-collaboration` and the relayed quotation in `testing-strategy` marked as such
  (the meter read 10.3 %, under the directive gate); `privacy` rule 7 marks its napkin-sourced
  categories (JC.net only); two paragraphs appended twice to OCE's pull-request lifecycle skill
  removed (the apply step compared unwrapped text with wrapped text); `lint-after-edit`,
  `testing-strategy`, the Claude Design pipeline skill and the fourth worked instance of
  `verify-data-supports-shape-before-building` unified; this record reordered newest first, its napkin
  path corrected and its fitness grades removed; the seat's own lines name OCE.
- The report: `.agent/reports/agentic-engineering/2026-09-30-two-estate-consolidation-retrospective.md`,
  identical in both estates, with the legs' findings and each one's disposition (accepted, cured,
  refuted with evidence, or left to the owner), the divergence measure and its script, and eight
  decisions for the owner and five notifications (§Decided 2026-10-01, re-sorted under the
  owner's frame of 2026-10-01). The analysts' reports are conserved whole
  under OCE's `consolidation-2026-09-25/dispositions-2026-09-30/`.
- What the next session decides first: whether another dedicated consolidation is needed. The legs
  split: three said a bounded repair under the owner's word, two said yes (JC.net's unread comms
  stream of roughly 840 substantive events; a reductive pass over the rules that accreted, by one
  seat without a fleet), and the OCE-side leg's answer is in the report. The bounded repairs that
  need no decision: the five friction lessons (F-60, F-62, F-66, F-111, F-182), the `agent-tools`
  command for the divergence measure, the three shared files still more divergent than at the open.
  Everything else waits on the owner's eight decisions.

### 2026-09-30T17:06Z — the session's close (Hawthorn binds Bracken, b3f117)

- Counts at close: JC.net pending graduations 3 (every one gated on the owner's card answers for the
  session-2 batch; the parser reads 2 live blocks beside the slow lane), JC.net buffers 0 (distilled
  empty, per-user memory index 0 live lines apart from one new feedback memory, the napkin rotated
  and every block homed); OCE pending graduations 1 (the seven owner cards from the comms decision
  table, gated on the owner's answers), OCE buffers 0 by decision (distilled empty, per-user memory
  5 live files that stay outside version control by their nature, the napkin at rest).
- Landed and pushed: JC.net eleven commits on `coordination/2026-09-29-b6232c` with a twelfth (this
  record) in its chain; OCE four commits pushed on `coordination/2026-09-29-76974c` with a fifth in
  its chain. The comms decision table's 196 rows are dispositioned in its §H (HOMED 62, MOVE 38
  written into both estates where shared, SESSION-SCOPED 34, SUPERSEDED 8, OWNER-CARD 7, OWED 47).
  OCE's frictions register went from 99 entries to 44: 55 settled entries archived byte-identical
  with index rows, nine lessons written into permanent homes, three entries live against their own
  claim carrying dated review lines.
- The fleet: nine analyst legs (four comms sections, two frictions halves, one of each as a pilot)
  and two review legs (assumptions-expert, frame-challenger) under
  `fleet-design-review-before-expensive-fleets`; the review added the decider field and the OWED and
  OWNER-CARD verdicts, and the seat checked every MOVE quote as a substring of the event body and
  every HOMED phrase as a substring of its home (one mechanical check, no second read of the homes),
  and every settled friction's cited path in the tree before an edit.
- Metaloss recursion. Compressed reasoning: the analysts' evidence fields survive in the four report
  files and in §H; the seat's overrides are in §H's rows and in the owner-cards list. Promises: the
  four pilot-B rulings and three later ones are owner cards on OCE's register; the 47 owed
  follow-ups are in §H and pointed at from OCE's continuity pickup block; nothing else was promised.
  Attribution inferences: every inserted paragraph names its decider from the event body; the
  "Drive, never coordinate" paragraph and the memory graduations are the seat's readings of recorded
  owner words, marked as such. Blind-spot bounds: the analysts' HOMED verdicts rest on phrase
  matches the seat re-checked mechanically, not on a second read of each home; the comms stream of
  JC.net (4,304 events) was not in this pass; the oversized OCE thread records were not read. Index
  of homes: this record, OCE's §H, `archive/` files named in each pointer, the scratchpad frames and
  reports (session-scoped, gone with the session). External bound: outside eyes caught the decider
  gap and the archive-directory gap; the seat's own slips this session were commit headers over the
  limit (six), a records path written from memory, a directive linking into the patterns tier, and a
  version literal in a lockstep-pinned annex, each caught by a gate, none by the seat's scan. A
  further pass would only re-find these; the recursion closes here.
- Fence sweep: the session's tracked writes carry no fenced wording (the owner-private strands, the
  fork on upstream surfaces, the biographical detail, the top-card location); grep over both
  estates' session diffs found only pre-existing lines moved byte-identical into archives.
- Owner decisions, batched: the seven comms-table cards (OCE's register entry names each clause and
  record); the session-2 cards (three JC.net register entries and the slow lane); clearing the
  practice box `.agent/practice-core/incoming/2026-09-14-oak-line-delta-since-e477e62f7.md`; the
  privacy review of the three napkins under `.agent/memory/active/unconsolidated/`; whether the
  JC.net comms stream is in a pass.
- Owed to later seats, not this pass: the 47 follow-ups in OCE's §H; OCE's 44 live frictions (five
  settle with one documentation insert each, named in the part-2 analyst's notes as F-60, F-62,
  F-66, F-111 and F-182); OCE's oversized thread records (thirty-one over the record-size threshold)
  and its 1,773-line exchange pickup block in repo-continuity; JC.net's
  collaboration-state-conventions and artefact-inventory over the same threshold.

### 2026-09-30T16:17Z — the session's state after the directive step (Hawthorn binds Bracken, b3f117)

- Counts at this block: JC.net pending graduations 3 (all gated on the owner's card answers for
  the session-2 batch; the slow lane's rows carry review dates), JC.net buffers 0 (distilled
  empty, per-user memory index 0 live lines, napkin rotated and every block homed); OCE pending
  graduations 1 (the comms decision table's 196 unread rows), OCE buffers 0 by decision
  (distilled empty; per-user memory 5 live files, four owner-private and one operator
  environment fact; napkin at rest).
- Landed and pushed: JC.net eight commits on `coordination/2026-09-29-b6232c` (the register
  drained, the six skills converged, OCE's memory lessons homed, the five directive
  entries written at readings of 15.1 % and 18.4 %, the push-gate cures); OCE three commits on
  `coordination/2026-09-29-76974c` (the OCE half of the same, its distilled and memory
  buffers drained, its directive step).
- In flight: a pilot analyst on the comms table's section B (42 rows) and one on the frictions
  register's first half (49 entries); each returns a fixed seven-field row per item, and the
  seat verifies every move at the event file or in the tree before an edit. The fan-out to
  sections C and D waits on the pilot's measured cost (the fleet-review rule).
- Uncommitted in OCE: the Director handoff's 2026-09-19 state archived byte-identical with a
  pointer, the substrate contract's live comms path, the wrap skill's host-neutral ledger line.
- Remaining after the table: the frictions register's settled entries (graduate, then archive),
  the oversized continuity records in both estates (repo-continuity, OCE's
  codex-dialogues and estate-coordination threads), the wrap with the closeout report.
- Owner decisions to surface at closeout: clearing the practice box
  (`.agent/practice-core/incoming/2026-09-14-oak-line-delta-since-e477e62f7.md`); the privacy
  review of the three napkins under `unconsolidated/`; whether the JC.net comms stream is
  in a pass; the session-2 cards (three register entries and the slow lane wait on them).

### 2026-09-30T15:4xZ — the session's state (Hawthorn binds Bracken, b3f117, claude-code, claude-fable-5-1)

(The times in this block were first written in local time and corrected to UTC at 16:17Z.)

- Counts at this block: JC.net pending graduations 5 (2 testing-strategy entries plus 3 queued
  for a directive-budget context), OCE 1. Buffers: JC.net napkin 4 blocks, distilled 27
  entries, unconsolidated napkins 3 files (analysed; 32 of their 59 unhomed lessons judged, the
  rest duplicates or obsolete), per-user memory 76 files (analysed, undrained), practice box 1;
  OCE napkin 2, distilled 7, per-user memory 28 files (8 + 20 in the sibling checkout's
  directory), the comms table's 196 rows unread.
- Landed: JC.net SHA:c48d9104 on `coordination/2026-09-29-b6232c` (32 register entries
  graduated into their homes; the malformed slow-lane block a table row; the context-window
  registry corrected). The fold-late note is on PR 274. Batch 2 (the March and August napkins'
  lessons, the owner's 2026-09-29 verbatim in `verify-dont-trust`, the three directive-gated
  register entries) is in the working tree, uncommitted.
- OCE: 19 Core hunks of SHA:c48d9104 applied to its working tree at
  `coordination/2026-09-29-76974c`, uncommitted; refused hunks to port by hand: PDR-082,
  `source-is-typescript-esm-only`, `verify-data-supports-shape-before-building`,
  `session-handoff`, `start-right-team`, the docs-adr and security templates, the two pattern
  files (OCE has none of that name), `validation-strategy` (directive), the patterns index.
  The fold-late note is not yet on OCE PR 299.
- Directive edits (testing-strategy ×2, user-collaboration, privacy, editorial-guidance) wait
  for a context reading below 30 %; this context read 23.8 % at 15:0xZ after the registry
  correction and has grown since.
- Not yet started: distilled pruning, the napkin's four blocks, the per-user memory markers and
  index retirement, the thread retirements (closure lanes b and c to `retired/`), the practice
  box, OCE's staircase, the six skills' convergence (todo 5), the wrap.

## How a two-estate consolidation works (the reflection the owner asked for)

The knowledge flow is per estate: sources → napkin → distilled → pending graduations →
permanent homes, walked bottom-up, in each estate separately; each has its own buffers, its own
fitness validator (`pnpm practice:fitness` in both), its own per-user memory directory (the
platform's `~/.claude/projects/<project-slug>/memory/`: JC.net's holds 76 files, OCE's 9, plus
the directories of sessions launched from OCE subdirectories), its own napkin (JC.net 145 lines,
OCE 47 at this close), its own coordination branch, bot identity and gates. What is shared is
the Practice Core (rules, skills, PDRs, patterns), which the owner wants as the same bytes in
both estates (2026-09-24) and which the exchange register tracks row by row.

So the session has two kinds of item:

1. **Estate-local items** (a lesson about one estate's tooling, a thread record, a plan node):
   drained and homed inside that estate, by that estate's procedure. Counts and verdicts are
   reported per estate, two rows, always.
2. **Core items** (a lesson that belongs in a rule, skill, PDR or pattern): the permanent home is
   the same file in both estates. Land it in the estate where the source buffer lives, then apply
   the same hunk to the other estate when `git apply --check` accepts it (as the worktree
   convention landed today), or open an exchange register row when it does not. A Core landing in
   one estate alone is not "homed": it is a divergence with a row.

Sequence: estate-serial, JC.net first (the home, resident), OCE second (non-resident). Serial
keeps the counts honest — an estate's buffers reach empty and stay empty while the seat reads
the other — and keeps each estate's gate cost batched (JC.net's push gate reads the working
tree, so lint every write there at once; OCE's pre-commit runs its full turbo gate under a
slot).
Layer-interleaving across estates would double the residency switches for no gain: the layers
inside one estate depend on each other, the estates do not.

Reporting: every report opens with four numbers, pending graduations and buffers for JC.net,
then for OCE; "done" is all four at zero or explicitly owner-gated. A report is an end to its
writer (OCE's clause of 2026-09-20), so the piece after each report is a named unit, never
"continue".

Instruments: read fleets of analysts per buffer (identical frames), the seat alone writes; Write
when the kept text is shorter than the removed range, Edit otherwise (OCE's cost clause).

Compaction: this session will compact more than once. Every compaction ends every process; keep
the four counts and the current item in this record before each boundary block, and re-arm
nothing on resume that the record does not name.

## Risks and their falsifiers

- Divergent skill text read as two procedures: falsifier, a step done differently in the two
  estates; cure, OCE's text for both until todo 5 converges the files.
- A Core landing in one estate only: falsifier, `git apply --check` of the hunk against the other
  estate refused, or the exchange register validator in JC.net (`validate-exchange-register`)
  reporting an uncovered entry; cure, the row.
- The per-user memory treated as durable: it is a buffer (`per-user-memory-is-a-buffer`); drain
  it into repo homes per estate and delete what is wrong.
- Bulk acts without the owner's word (an archive lifecycle, a frontmatter sweep, deleting a
  buffer file): ask first; today's word covers curation, not deletion of surfaces.
- A commit refused by OCE's strict commitlint: a body line starting `word:` is a footer;
  pre-check with `pnpm exec commitlint --strict --edit <file>`.

## Plan (the next session's todos)

Todos 1 to 6 were done on 2026-09-30 by Hawthorn binds Bracken; the dated blocks above and the
retrospective record what each produced and where it fell short. The list stays as the shape of a
two-estate consolidation.

1. Open in JC.net by `start-right-quick`; declare mode `dedicated-knowledge-curation`; state the
   bridge in your own words; read this record; run the QUIET read and governance read of OCE;
   cut the day's coordination branch in each estate.
2. Inventory both estates: `pnpm practice:fitness` in each; the buffer inventory per estate (the
   napkin, the threads root, the experience tier only as a source never a target, the per-user
   memory directories, the platform-memory set, non-repo plans, entry-point drift); settle with the
   owner which surfaces "empty" covers in each estate; report the four counts.
3. Walk JC.net's staircase bottom-up to empty; commit by pathspec on its coordination branch,
   push as the bot; report.
4. Walk OCE's staircase the same, non-resident; commit in batches on its coordination branch
   (bot committer from the clone config, `--author` the owner); report.
5. Core landings: apply each to the other estate by patch or open its exchange row; and fix the
   six consolidation skills' divergence itself — the same bytes in both estates, judged hunk by
   hunk (OCE's text is the base by the owner's instruction; a JC.net-only hunk that is newer
   knowledge is kept and ported the other way), landed in both with exchange rows.
6. Closeout per `consolidate-until-done` §Closeout Shape: value and impact per estate, remaining
   owner decisions and where they live, verdict per estate; wrap.

## Open lanes the consolidation must not absorb

- `threads/turbo-remote-cache.next-session.md`: OCE PR 313 is open for harvest; the owner's two
  Vercel/variable acts are owed; live lane, not a buffer.
- `threads/linkedin-workspace.next-session.md`: an editorial pass the owner has not called.
- `threads/practice-exchange-seat.next-session.md`: the exchange itself; its rows are the
  mechanism step 5 uses, not its work.

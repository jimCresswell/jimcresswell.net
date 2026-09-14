---
fitness_line_target: 120
fitness_line_limit: 160
fitness_line_length: 100
fitness_content_role: reference
---

# Director handoff entry point

The single file the next Director rehydrates from (PDR-117 §Consequences). Role doctrine lives in
[PDR-117](../../practice-core/decision-records/PDR-117-director-and-implementer-roles.md); this
file carries the pickup procedure, the readiness self-check, the current handoff state and the
live board. It is rewritten in place at every Director transition, never appended.

## Role pickup procedure

1. Run `start-right-team` as `team-closeout-owner`; arm the all-channels comms watcher first
   (`comms watch --exclude-tag heartbeat`, as a persistent Monitor) and assert it live.
2. Read this file, then `repo-continuity.md` §Current State, then the controlling node named
   under §Current handoff state, then the thread records under `threads/` for every live lane.
3. Cross-check the outgoing Director on **both** surfaces before any acknowledgement: the claims
   registry (`claims status`) and the comms heartbeat stream. Registry-stale with comms-live is
   the trap; never take a live seat.
4. Adopt the Director claim in place (`claims adopt --claim-id <id>`), never a duplicate row.
5. Arm the heartbeat loop (both legs, failures emitted; the canonical invocation is in
   `liveness-heartbeat-cron.md`) and recompute `heartbeat_at` from the claim row.
6. Broadcast the PDR-064 Moment-2 active acknowledgement naming the adopted claim. Authority
   transfers on that event and not before.

## Readiness self-check before a Moment-2 acknowledgement

Every line answered first-hand, none inferred:

- The watcher is live for this identity (`comms assert-watcher-live` exits 0).
- The outgoing Director's last comms heartbeat is older than the retirement threshold, or the
  outgoing Director posted a Moment-1 pre-positioning event naming this seat.
- Every live lane's claim owner, branch and last substantive event are known (registry and
  comms, read now).
- The owner's standing rulings below are read and can be restated without the file.
- Nothing is queued to the owner that the Decision Lenses could resolve.

## Standing owner rulings the Director carries

- A green, clean pull request is merged, by merge commit, without asking; cards are for
  decisions only the owner can make.
- Compute, don't hope: no hand-kept list; every list is derived or gated by a validator.
- The private editorial material is optional, confidential, never a dependency, mentioned
  minimally, never quoted.
- Records are technical, not emotional. A move is a stepping stone, never an end state; an
  archive holds only processed material.
- The transplant is bounded: closure items 3 to 8 finish it, then editorial work.

## Current handoff state (2026-09-14, 00:05Z, n=2 with lane A; owner away)

Where this block and the routing log disagree, the log's last entry is current; this block is
rewritten at each Director push.

- Director: Cauldron herds Lustre (880ff9), claim `1db07581`, thread `transplant-closure`,
  branch `chore/director-records-3` from `main` at `SHA: 6528ecb` (records only; the Director makes
  no source edits).
- Controlling node: `.agent/plans/delivery/practice-completion.plan.md` §Transplant closure.
  Landed on `main`, every component: item 1 (archive deleted), item 2 (PR #53,
  `SHA: 55649a2`), item 3 (PR #56, `SHA: 1829cd4`), item 4 as bounded (PR #57, `SHA: 4a61112`;
  the restore carried in #58), item 6's sweep (PR #55, `SHA: 7127bc4`), item 8 filed (PR #63,
  `SHA: dc23dff`), the per-checkout Playwright port (PR #60, `SHA: 4370e04`) and its follow-on
  (PR #66, `SHA: 0ec4583`), item 5a-i (PR #64, `SHA: 38e9693`), the Cricket quartet (PR #61,
  `SHA: ea3142b`), the Director records and the channel rule (PR #54, `SHA: c426c6c`; PR #58,
  `SHA: 6528ecb`). Not landed: item 5's remaining parts, 2a, 2b, the handed-back residue, item 7.
- Open pull requests: #62 (this records branch; frozen for new items at overnight item 35,
  thread cures landing here until the bot merges it, the merged tip its final waypoint; items
  from 36 on the stacked `chore/director-records-4` branch, which opens after #62 merges) and
  #65 (lane A, item 5a-ii, measured state, round four at `SHA: 3802031`, Copilot bound).
  Merged: #54, #56, #57, #58, #61, #55 (`SHA: 7127bc4`), #63 (`SHA: dc23dff`, session 2's
  register), #60 (`SHA: 4370e04`, the per-checkout Playwright port as the in-process server,
  after six rounds), #64 (`SHA: 38e9693`, item 5a-i), #66 (`SHA: 0ec4583`, the e2e
  follow-on); #59 closed as carried.
- Team state: owner word 17:16Z, "this is now an n=2 session, you and Saffron" (PDR-082; the
  Director's heartbeat stopped, watcher kept); 17:18Z the ARC channel opened beside native
  messaging. Lanes B and C handed every responsibility back and stood down (closeouts on the
  stream; lane B's record `handoffs/707ed764-…3.json`; lane C's claim closed).
- Merge mechanics learned today: every agent PR write runs as the bot; the bot cannot request
  Copilot here (the owner's CLI credential can; the request registers on the timeline within a
  minute unless the previous request's review is still in flight, when it registers nothing; the
  review takes 8 to 15 minutes); a push re-opens the round; `merge-bot merge --expect
  copilot-pull-request-reviewer` binds the leg and merges only at SETTLE-READY (historical
  until #65 lands: a ten-minute quiet window after the last review; from #65, item 5a-ii,
  measured state: every leg landed, no expected reviewer request outstanding, no live run
  observed, any unavailable run surface named); pushes serialise for host load: the seat asks,
  the Director confirms, the seat pushes and releases, and a granted slot is held until
  released.
- Re-arm after compaction, checking first (PDR-133): the all-channels comms watcher (Monitor,
  `comms watch --exclude-tag heartbeat`), then `assert-watcher-live`; the ARC channel tail; no
  heartbeat loop at n=2. Checked 15:39Z: background tasks outlive a compaction.
- Next safe step (owner away; decisions by the lenses, logged under §Decisions overnight):
  #62 (this records branch) merges by the bot at zero threads with Copilot bound, then #65
  (item 5a-ii) the same way; lane A then opens the 5a-iii pull request (the #64 body findings
  and the body tally, item 32; on origin at `SHA: beddd8b`), then 5b (committed locally), then
  the e2e follow-on 2 (item 43), then 5c; the morning report presents §Decisions overnight with
  its
  REVIEW marks and the session 2 cards: the twenty-three session 2 fast-lane entries in four
  classes, the five slow-lane rows (PDR-130: `promote` or `kill-with-reasoning`), and proposal
  E. Measured on `main` after #63: twenty-eight decision-debt blocks (five 2026-09-12 captures
  under their own quorum gate plus the twenty-three) and five slow-lane rows, thirty-three live.

## Live board

| Lane | Items | Owns exclusively | Seat | Claim | Branch / PR | State |
| ---- | ----- | ---------------- | ---- | ----- | ----------- | ----- |
| A | 3 done; #60 merged (`SHA: 4370e04`) and its follow-on #66 merged (`SHA: 0ec4583`); 5a-i merged (#64, `SHA: 38e9693`); 5a-ii open (#65); then the 5a-iii PR, 5b, the e2e follow-on 2, 5c, 2a, 2b, then the handed-back residue: the Gemini projection, the corpus-analysis restore with the five patterns, `sif` | root scripts, CI workflow, `agent-tools/` legs and retirements, the leak validator, `tooling/*/package.json`, `turbo.json`, `jcdotnet/accept-md.config.js`, the incoming bundle, the Playwright harness config, the merge-bot sources; after 2b the rules generator, the adapter trees and the Gemini projection | Saffron turns Verdure (c39ad7) | f024e1f1, 5828b0ee, the 5a claim | `fix/merge-bot-measured-state` PR #65; `fix/merge-bot-body-tally` at `SHA: beddd8b` on origin, PR after #65; `chore/retire-lineage-instruments` local | ACTIVE at n=2 |
| B | 6 | (handed back) `.agent/rules/**`, `RULES_INDEX.md`, the three rule-adapter trees, the rules-index and trigger generator, sub-agent adapter descriptions | Sirocco wakes Wingspan (45fe02) | closed | `closure/lane-b` merged as PR #55 at `SHA: 7127bc4` and deleted; `closure/lane-b-generator` at `SHA: d76bb86` on origin (2a fold conserved in the record) | STOOD DOWN 17:14Z; handed back: 2a, 2b, PR 3 (now routed to lane A after item 5) |
| C | 4 then 7 | the definition report, `testing-strategy.md`, the substrate manifest's register declarations, the Gemini projection | Djinn hunts Solder (36720b) | closed | `closure/lane-c` and `closure/lane-c-restore` deleted (merged in #57; carried in #58); PR #59 closed as carried | STOOD DOWN 16:57Z; handed back: the restore, `sif`, five patterns, the Gemini projection after 2b, item 7 |
| Director | 7 | reports index, runbook step 13, `provenance.yml` completion entry; merges | Cauldron herds Lustre | 1db07581 | after the holdings land | routing lane A; merging |

Sequencing constraints: lanes B and C are closed, so lane A holds every surface, in the row's
order (item 5's parts, then 2a, 2b, then the handed-back residue; item 7 last, the Director's).
Pushes serialise, one
gate at a time, for host load: two full-host gates exceed the host (the earlier reason, Playwright
reusing a running :3000 server, is retired by the per-worktree port PR). Item 7 is written last
because it records 3 to 6.

## Routed verdict for the handed-back holdings (2026-09-13, about 19:05Z; for the owner's word at the #55 merge)

One shape, serialised onto lane A at n=2, each a small pull request against `main`, in
dependency order; the Director merges by the bot at zero threads and writes item 7 last.

1. **#60** (the per-checkout Playwright port) then **#55** (item 6, PR 1, the sweep): in flight.
2. **Session 2, the register PR** (lane A, from the Director's draft in
   `threads/session-2-synthesis.next-session.md`; owner word 2026-09-13 about 20:40Z: session 2
   before item 5): the candidates filed in the counter's canonical shape, the five existing
   entries migrated; the owner's cards in the morning are the dispositions.
3. **Item 5** (lane A; branches from `main`; `SHA: 64aa005` rides the first), as three pull requests
   by changeset class (lane A's proposal, accepted 2026-09-13 about 19:45Z): (a) the merge-bot
   cures first, because they pay on every later merge: the GraphQL login form; the bot's own
   Copilot request registers nothing; a review run in progress read as SILENT-WAIT; the quiet
   window replaced by measured state (no review run live on the tip, no reviewer requested,
   checks settled, threads zero); (b) the retirements: `validate-ratified-lists`,
   `protocol-conformance`, `pr-throughput`, `ci-turbo-report`; (c) the residue scrub with the
   leak validator (derived needles): the two product files, the manifests and fixtures the plan
   of record names, `accept-md.config.js` to TypeScript, `turbo.json`'s `.next/` outputs, the
   consumed incoming bundle.
4. **Item 6, PR 2a** (the rules-index and trigger generator) from `closure/lane-b-generator` at
   `SHA: d76bb86` with the conserved fold applied; then **2b** (the sub-agent adapter generator, Gemini
   as a fourth row); then the **Gemini per-role projection** (item 4 residue, row 8).
5. **Item 4 residue, one pull request each:** the corpus-analysis and workflow-build restore with
   the five absent patterns and the cited-paths leg extension (rows 3 and 6); `sif`'s routing
   rewrite (row 5). Then the definition report's nine rows read present.
6. **Follow-ons named today, parked after item 7 as post-transplant (lane A's proposal,
   accepted), each its own small pull request:** `@engraph/result` into the site workspace for
   the port helper; the atomic writer re-homed to core; a shared no-follow write helper; the
   `CLAUDE_PROJECT_DIR` opt-out as an estate rule; the ten name-only `invoke-*` descriptions and
   the three stubbed invoke rules (accessibility, design-system, react-component) brought back
   from the pin, scrubbed; the deferred-controls register's creating mechanism; the projection
   census against the pin as an item 7 audit step.
7. **Item 7** (the Director): the reports index, runbook step 13, the `provenance.yml` entry.

Records cadence from here (Cricket verdict, both methods): commit locally at each state change;
push once per landed merge or shape change, never contending with lane A's slot.

## Decisions overnight (2026-09-13 from about 20:30Z; for the owner's morning review)

Owner word, verbatim: "I am going to bed. Please keep the work moving, make decisions with the
decision matrix, do not block work on me, present the decisions made to me in the morning and if
any need a review that is fine." Each decision below names its lens; those marked REVIEW are the
ones the Director would put to the owner had the owner been present.

1. The routed verdict for the handed-back holdings (above) applies without the owner's word at
   the #55 merge, in the order the owner amended at 20:40Z: the session 2 register PR first,
   then item 5 as three pull requests by changeset class, merge-bot cures first; then 2a, 2b,
   the Gemini projection, the corpus-analysis work with the five patterns, `sif`; item 7 last. Lens 1
   (the generators remove hand-kept copies; the merge-bot cures pay on every later merge) and
   lens 3 (one seat, dependency order, no menu). REVIEW: the order of 2a before the restore.
2. Merges: every green, clean pull request merges by the bot at zero threads with Copilot bound
   to the tip, the standing ruling; the quartet PR #61 yields every push slot to the closure path.
   Lens 2 (the owner's standing ruling applied as given; no new decision).
3. Owner-only items held for the morning: the session 2 synthesis cards; any change to ratified
   text; the two `sif` instruments and `under-the-hood` under "bring unless product". Lens 3
   (the ratified node item 8 and the owner's word make these the owner's alone; no seat decides).
4. Session 2 draft written (`threads/session-2-synthesis.next-session.md`; the initial
   pre-verification draft at commit SHA: 3783b6e, the draft the register work consumed at
   SHA: 150b2a7, both on the records branch): 24 candidates in the initial draft, 22 retained
   with source, candidate home and prediction after P moved to the verify list and U to the
   privacy route; a verify-before-filing list; the already-homed set with homes; the routed
   classes. Lane A
   completes it as the register PR after #55 (the owner's amended order; #60 was not a
   prerequisite, and the register PR #63 merged before it). Lens 3 (the Director reads and drafts;
   the seat verifies homes and files; the owner decides on cards). REVIEW: the morning cards are
   the filed entries' dispositions (fast lane) and the slow-lane five's review-date decisions
   (items 10 and 30); the earlier candidate-homes review is folded into those cards.
5. REVIEW (privacy): an owner-gated privacy review of the three unconsolidated napkins under
   `privacy.md` before they are archived; the synthesis PR carries nothing from them beyond the
   candidates' doctrine. Lens 3: `privacy.md` forbids quoting, summarising or identifying
   private editorial material in version control and lets it inform writing only; the
   owner-gated review is the Director's routing under that prohibition, not a clause of it.
6. REVIEW (doc truing): ADR-015 says Codex has no `.agents/rules/` layer; the estate projects
   130 `.agents` rules since the transplant; the ADR and the surface matrix need truing as a
   small follow-on (not a graduation). Lens 1 (a record that contradicts the estate costs every
   reader; the truing is small and owner-visible).
7. PR #61 (the quartet): Copilot's one thread (the tally said no leg spent a Read; every leg
   makes the mandatory template read; only the optional verification reads were unspent) cured
   at SHA: 06507cd in a worktree, held for an idle push slot after lane A's #60 push; the bot merges
   at zero threads. Lens 3 (the quartet yields every slot to the closure path).
8. PR #60 at SHA: 292bf49: CI's e2e job red (2 of 58) with zero threads. Cause from the log (lane
   A): the build's PDF generator probes its own free port and the Linux runner handed it the port
   the harness had just probed and released; Playwright's readiness poll accepted that throwaway
   server, test 1 ran against it, it exited, the real server bound afterwards. The PR body's
   claim that a taker fails loudly was wrong. Cure accepted (lens 1 and the no-timing-dependence
   rule: the shared resource is owned, not its window shrunk): a holder script binds the probed
   port with a 503 responder for the whole build and hands it to `next start`, so no prober can
   be handed the port while any prober exists; falsifiers (503 during the build, EADDRINUSE for a
   taker, 200 after; the holder-removed mutant) plus the CI run as the proof of the runner class;
   the body argues only from the invariant, never from a small window. REVIEW: a design defect
   in the port PR found by CI, cured by owning the port through the build.
9. PR #61 merged by the bot at `SHA: ea3142b` (20:45Z) after its one thread was cured; the quartet
   worktree and branch removed. Open: #60 (the holder cure, push imminent) and #55 (cure at
   SHA: 3d86acb, push after #60). The records branch pushes at the next idle slot behind lane A's two
   pushes (the waypoint cadence).
10. Lane A found a vacuous green on the pending-graduations register: the fitness item counter
    reads only the canonical inline-bracket entry shape, the five existing entries use a
    heading-and-bullets shape with no `captured:` field, so the readout says zero decision debt
    (the F-84 class the register's own preamble warns of). Ruling (lens 2, lens 3): file the
    session 2 entries in the canonical shape and migrate the five existing entries to it in the
    same commit, substance unchanged; the proof is the readout moving from 0 to the filed total;
    no ratified text changes. Condition: lane A first reads whether the strict fitness check is a
    gate leg and what it says at the filed count; advisory proceeds; a blocking leg stops for a
    ruling, because the register's contract says the count is reported and drains by decisions,
    never chased. REVIEW: the finding and the migration.
11. Review rounds granted past PDR-132's two, each a Director decision on real defects in a new
    mechanism: #60 round three (Copilot on SHA: ebfe210: the probe socket closes before the holder
    binds, so a taker can slip between choose and hold, and a failed bind could leave Playwright
    polling a stranger's server; ADR-019 names the old command). Class ruled: no moment between
    the port being chosen and held, the prober is the holder, a bind failure exits non-zero before
    any poll can pass. #55 round five (Copilot on SHA: 3d86acb: a folded scalar stops at a blank line;
    index rows absent from the tracked rule set are never visited; an existing declaration skips
    validation of its sources). Both routed to lane A, one minimal commit each, #60 first.
12. Lane A's home reads for the session 2 draft: of the twenty-four candidates A to X, G, H and
    W are duplicates with their homes quoted, E is a proposal kept out of the register, P and U
    left the candidate list (P to the verify list; U reduced to the owner-gated privacy review),
    so eighteen lettered candidates file as pending; lane A's reads of the verify list found ten
    more unwritten (P, the plan-skill items, the tooling traps as one entry, the harness lessons
    as one, the stacked-PR merge order, the allowed-signers note) and six duplicates, so
    twenty-eight file and the readout moves from 0 to 33 (ruled about 22:05Z) (pr-lifecycle CLASS P; the docs-adr-expert template's
    title-not-number line with PDR-005's four-audit close; hook-policy-substring-discipline).
    Board follow-ons from the reads: the memory-state substrate contracts doc carries two "must
    not remain on disk" clauses, the memorial shape O forbids (truing at that file's next touch);
    the start-right-team n=2 overlay drops the sweep without sparing the progress report (E fills
    it). The register PR files in the counter's canonical shape with the five existing entries
    migrated (item 10).
13. #60 round three pushed on the slot (about 21:35Z): the prober is the holder (one listen(0)
    in the runner at config load, kept open as a 503 responder, released only on a request that
    carries the runner's own stamp); a second claimer gets EADDRINUSE by construction; ADR-019
    names the mechanism. Honest residual, stated in the docs: Next's boot after the release
    (about a second) is the one unowned moment, and Playwright fails the start only when the
    server exits before a successful poll. Board follow-on under the port work, not claimed:
    owning the port through Next's boot by serving Next from the holder's process.
14. REVIEW (lane A, its own words): "my amend against the estate's never-rewrite rule, caught by
    you." The #60 push was refused by the cited-scripts validator (ADR-019 cited a site
    workspace script as a root one); lane A amended the unpushed commit before the Director's
    ruling (a second commit on top, never an amend, pushed or not) arrived; nothing was lost
    (the amended tree carries the original whole); the push proceeded rather than rewriting
    again; the rule is absorbed. Lesson for the seat and the record: the forward-only rule
    applies to unpushed commits too.
15. #55 round four, thread one ruled "refuse" over the routed "continue" on lane A's reasoning
    (lens 2): a paragraph break inside a folded scalar has no single-paragraph value the reader
    could mint without differing from what the platform reads; the sweep refuses with a named
    reason and the cell pins it; no tracked trigger has the shape. #60 round four granted
    (Copilot on SHA: 92da668, four real threads): the held port must answer with the holder's own
    stamp before the script builds, so a stranger on the port after a re-setup can never pass
    as the holder; the release answers only after the listener's close completes; the runner
    bullet, the smoke section and the config comment name the e2e:server mechanism. Order: the
    #55 push first, then #60 round four.
16. Lane A, self-caught before landing: a push of the #55 cure by refspec from a worktree
    switched to the port branch would have run the pre-push gate over the port branch's tree,
    not the tree being shipped; stopped, switched back, pushed from the shipping branch. Lesson
    (validation-strategy §Gate integrity, the push form): the pre-push gate proves the working
    tree, so a push comes from the branch whose tree ships, never by refspec from another.
    REVIEW: as lane A phrased it, "this one, caught by me before landing."
17. REVIEW (the port PR's shape, from lane A and its reviewer, accepted onto the board): four
    Copilot rounds on #60 each added a mechanism (probe, hold, handshake, identification and
    wait) because the test build bakes the held origin into the site's canonical URLs, so the
    port must be chosen before the build. The question that dissolves the machinery is whether
    the test build needs the port at all (a fixed canonical origin for the test build) or the
    holder should serve Next itself; that is an assumptions-expert pass after #60 lands, not a
    fifth round. #60 round four pushed on the slot (about 21:55Z); #55 round four at
    `SHA: e69d388` under Copilot.
18. REVIEW (#60 round five, about 21:55Z): Copilot on `SHA: b06dcb9` named the last unowned
    moment (after the port reads free, until Next binds; a stranger's 200 passes readiness), the
    same gap in the PDF generator's probe-then-bind, and the Vercel URL variables' precedence
    over PORT in the site config. Ruled by lens 4, a system change rather than a sixth
    mechanism: the process that binds the socket keeps it for its whole life and serves Next from
    it through the custom-server API (the runner in globalSetup, the PDF generator likewise), so
    release, identification, wait and stranger cease to exist by construction; the round-three
    and round-four machinery is removed. A bounded assumptions-expert pass over the two board
    shapes (in-process server versus a fixed canonical origin for the test build) precedes the
    write, the SEO origin tests as the falsifier. The design turned on the fifth round; the
    owner reviews the turn in the morning.
19. PR #55 merged by the bot at `SHA: 7127bc4` (21:55Z): closure item 6, pull request 1, the sweep
    with 130 declared rules, after five rounds. Lane B worktree and branch removed. Ruling: the
    session 2 register PR proceeds now rather than waiting for #60 (its redesign is hours; lens 3);
    lane A recuts its unpushed branch from `main` at `SHA: 7127bc4`. Open: #60, #62.
20. PR #63 opened by lane A as the bot at `SHA: b692f02` (about 22:10Z): twenty-eight session 2
    entries plus the five migrated, the readout quoted from 0 to 33 (pending 33), grouped in four
    classes for the morning cards, E the one proposal, U withdrawn, nine duplicates with their
    carrying lines. Copilot requested; the bot merges at zero threads. Open: #60, #62, #63.
21. #60 fifth-round shape settled (about 22:20Z). The assumptions-expert verdict, quoted: "Shape 1
    wins at lens 1 and needs no later lens: the socket has exactly one holder for its whole life, it
    uses Next's first-party API, and the falsifier stays untouched. Shape 2 is not the same class of
    cure." Its strongest fair objection (the runner becoming the production server) taken by the
    variant lane A implements: a globalSetup-owned child binds listen(0), keeps the socket, builds
    with PORT set and the Vercel variables cleared, attaches Next in-process and prints ready; the
    runner never imports next; the PDF generator reuses the bind-and-attach module. Rounds three
    and four's machinery is removed. Go given; slot on ask.
22. #63 round one (about 22:25Z): Copilot read the batch's "disposition by owner cards" against
    PDR-100 (no owner pre-approval) and PDR-101 (the owner is not the graduation gate) and asked
    for PDR-130's slow lane for constitutional-class entries. Ruled: this batch's cards are the
    ratified node's item 8 verbatim (an owner word for this batch), PDR-101 stands for every other
    graduation; the section note cites the item; the constitutional-class entries move to the
    slow lane with review dates per PDR-130's class test (lane A judges each against the text).
    REVIEW: which entries are slow-lane.
23. #63 cure on the slot (about 22:35Z, `SHA: 414fb6c`): A, B, C, 1a and 1b judged constitutional
    under PDR-130 and moved to the slow lane with review dates (the owner's session 2 card, else
    2026-12-13); D stays in the fast queue (team coordination); the section note cites item 8
    verbatim; the readout reads 28 pending. REVIEW: the slow-lane five.
24. #60 redesign pushed on the slot (about 22:35Z, `SHA: c60e28c`, "serve the build from the socket
    the harness binds; one holder for the port's life"): built-site-server binds, holds and attaches
    Next in-process; the global setup owns the child and hands the origin to the workers; the PDF
    generator reuses the module; port-hold, the handshake stamp, free-port and the webServer block
    are gone. Proof: four cells, two mutants killed, the Vercel-clearing mutant red on the two SEO
    origin cells and green restored, the full suite 58 of 58, code-expert no critical finding.
    Copilot requested on the tip; CI's e2e job is the runner-class proof.
25. Item 5a routed (about 22:50Z) on lane A's measured design: the merge bot's compound read (gh pr
    view and REST requested_reviewers) omits Copilot's outstanding request while GraphQL lists it
    as the suffix-less Bot login, which is why the bot read #60 as SILENT-WAIT with a review in
    flight. Two slices, each inside the round budget, each its own PR after #63 and #60 land:
    5a-i request visibility (GraphQL requests for Bot, User and Team; the suffix stripped in
    comparison; an outstanding expected request is the round in flight; RUN-DEAD and
    RUNS-UNREADABLE retired; the credential fact in the reference; falsifier: #60's verdict before
    and after); 5a-ii measured state (settled means every expected leg landed on the tip, no
    expected reviewer requested, no live run mapped; the quiet window gone; docs and fixtures
    trued). REVIEW: 5a-ii implements the owner's own design note.
26. PR #63 merged by the bot at `SHA: dc23dff` (22:39Z): session 2's twenty-eight entries on the
    register in the counter's shape, the five existing migrated, five in the slow lane, readout 28
    pending. The morning cards are the dispositions (the ratified item 8); the napkins under
    `unconsolidated/` archive only after two gates, the answered fast-lane cards and the
    owner's privacy review of the three napkins (item 5). Ruling: item 5a-i opens its PR from `main` at
    `SHA: dc23dff` without waiting for #60 (no shared files). Open: #60, #62.
27. #60 round six (Copilot on `SHA: c60e28c`, the redesign's first pass, about 22:45Z): two small
    real defects, none on the shape (a race timer never cleared in a cell; a signal-handler gap
    between the build child's exit and Next's attach). Routed to lane A as one minimal commit;
    every check on the tip green.
28. #60 round-six cure pushed on the slot (about 23:00Z, `SHA: 90a269e`): the race timer cleared
    in a finally; the server flow's phases in one module with the stop action swapped before each
    await; four flow cells over a real bound socket, the handler-gap mutant killed; code-expert
    no critical finding. Copilot requested on the tip. 5a-i's second commit (its code-expert
    items) written meanwhile; its PR follows on ask.
29. Item 5a-i is PR #64, open as the bot at `SHA: b94e00b` (about 23:15Z on 2026-09-13): review
    requests read from GraphQL for Bot, User and Team; the suffix stripped in comparison; an
    outstanding expected request is the round in flight; RUN-DEAD and RUNS-UNREADABLE retired;
    merge-bot.md carries the credential fact; three mutants killed; the falsifier quoted before
    (#60 read SILENT-WAIT with a request outstanding) and after (#62 read WAITING-REVIEW-RUN-LIVE).
    Copilot requested; the bot merges at zero threads. 5a-ii cuts from main once #64 lands.
30. #62 round eleven (23:03Z on 2026-09-13): two threads; board rows A and B refreshed to
    the logged state; the morning-card instruction split so the slow-lane five take PDR-130's
    review-date decision (`promote` or `kill-with-reasoning`), never the fast dispositions. Cure at
    `SHA: 8d79172`; replied, resolved, Copilot re-requested, bot armed. Lens: correctness of a
    record the successor reads; no REVIEW.
31. #60 merged by the bot at `SHA: 4370e04` (23:14Z on 2026-09-13) at zero threads with
    Copilot bound; the binding review's body read "Needs a closer look" with five suppressed
    findings and zero new comments: the spawn `error` event unhandled in the global setup; the
    server flow's `close()` rejection discarded with exit 0; two contract surfaces still saying
    the web server runs build-and-start (`CONTRIBUTING.md`, `docs/project/requirements.md`; the
    review also named `docs/engineering/testing-patterns.md` and the quality-gates skill, which
    a grep of main does not bear out); the README falsifier setting one of the two Vercel URL
    variables. Routed to lane A as one small follow-on pull request after 5a-ii. Lens 2 (the
    merge stands: green, clean, zero threads is the standing ruling; body findings are follow-on
    work, not a reopen). Finding for 5a: the bot merged on a body that says "Needs a closer look";
    the SKILL's item 2 tally is a reader's step the bot does not compute, so measured state
    should count suppressed body findings as open work or the verdict should name them. REVIEW:
    the merge on a closer-look body, and whether 5a-ii or 5a-iii carries the body tally.
32. #64 (item 5a-i): Copilot bound to `SHA: b94e00b` at 23:11Z, zero threads, the bot's merge
    poll running; the body a closer-look with six suppressed findings (the merge-bot reference
    and the pr-lifecycle SKILL contradict each other on whether the bot token can request
    Copilot; the refusal message omits Mannequin; the suffix tests cover one side; the
    agent-task evidence still reads as a live review run; the request-harvest fake does not
    gate on the query; the compound read parses the review pages twice). Same lens as item 31:
    the merge stands; the six plus the body tally are item 5a-iii, after 5a-ii and before the
    e2e follow-on and 5b. Lane A confirmed 5a-ii carries none of the six as cures (the code already strips the
    suffix on both sides; the inverse cells are the missing proof). REVIEW: a second merge on a
    closer-look body in one night; the body tally moves up the 5a order if a third appears.
33. #64 (item 5a-i) merged by the bot at `SHA: 38e9693` (23:22Z on 2026-09-13) at zero
    threads with Copilot bound; origin branch deleted. Lane A opens the 5a-ii pull request from
    `fix/merge-bot-measured-state` (`SHA: 3555cbf`, stacked on the merged tip, so the diff is
    5a-ii alone). Standing ruling; no REVIEW.
34. Item 5a-ii is PR #65 (23:23Z on 2026-09-13), open as the bot at `SHA: 3555cbf`
    against main: settlement reads measured state (every leg landed, no expected reviewer
    requested, no run live); SETTLING-QUIET-WINDOW retired; the checks-green timeout the one
    clock; the code-expert's critical finding (the in-flight read stripped the suffix on one
    side) cured in the second commit; five mutants killed. Copilot requested under the owner's
    credential; the bot merges at zero threads. Lane A starts 5a-iii stacked on the tip; the e2e
    follow-on (four cures plus a latent hang the new cells exposed: port and ready in one chunk
    missed by a listener attached late, now buffered) waits behind it. REVIEW: the quiet window
    replaced by measured state is the owner's own design note, applied without a card.
35. #62 round thirteen (23:24Z on 2026-09-13): one thread (the continuity index's
    deep-consolidation line still said four candidates on the register) and eight suppressed
    findings, every one a staleness the branch itself created by carrying live state through
    thirteen rounds. All nine cured in one commit. Decision (PDR-132, rounds beyond two are the
    Director's): this records branch is frozen at that cure; items after 35 accumulate on a
    records-4 branch stacked on it and open as a new pull request only after #62 merges, so the
    reviewed tip stops moving. Lens 1 (each round re-reviews the whole file and finds the drift
    the previous round's wait produced). REVIEW: thirteen rounds on one records pull request.
    As executed: the freeze covers new items only; thread cures kept landing on this branch
    (rounds fourteen to seventeen), each the same commit as its round's suppressed findings,
    because the bot merges at zero threads; the tip the bot merges is the final waypoint.
36. #65 round one (23:30Z on 2026-09-13): one thread, taken in full: the measured predicate
    mapped an unavailable run leg and a truncated read to "no run", so an unobservable run
    surface could read SETTLE-READY. Verdict on lane A's recommendation: name, do not block.
    Grounds: 5a-i measured that the run leg never carries a review run (it lists coding-agent
    sessions), so the round's measured signal is the outstanding request, read every time;
    blocking on an unobservable optional extension (`gh agent-task`, absent on CI hosts and
    fresh checkouts) would make every settlement depend on it, the SETTLED-NO-REVIEW deadlock
    in another coat. Cure: the third clause reads "no live run observed"; every SETTLE-READY
    names an unavailable or truncated run surface in its evidence; the SKILL and the settlement
    header say why the run leg does not block; two regression cells pin the gap cases. Round
    two is the last within PDR-132's budget. Lens 1 then lens 4 (a settlement that depends on
    an optional surface fails closed everywhere the surface is absent). REVIEW: the third
    clause of the measured-state ruling narrowed to "observed".
37. #62 round fourteen (23:35Z on 2026-09-13): one thread and nine suppressed findings, all
    accuracy defects in the records themselves (the register split unmeasured, the continuity
    index's resume block still naming PR #53 open, a privacy lens misattributed to the
    directive, the draft pointer unlabelled, the Cricket prediction platform-blind, the archive
    gate contradicting the slow-lane deferral, the channel's opening entry calling the comms
    stream a state surface). All ten cured at `SHA: cd7f90e`, the register split measured on
    `main` (28 decision-debt blocks: 5 from 2026-09-12 plus 23 session 2; 5 slow-lane rows; 33
    live). The item 35 freeze holds for new items (this branch, records-4); thread cures still
    land on the reviewed branch, since the bot merges at zero threads only. Lens 1 (a record
    that misstates the estate costs every reader; a cure costs one gate). REVIEW: the archive
    gate ruled as the morning cards alone, slow-lane rows conserved on the register.
38. #65 round two (23:42Z on 2026-09-13): two threads (the SKILL passage and the settlement
    header say the run leg is "never the deciding clause" while an observed live run blocks)
    and two suppressed findings (a truncated read with a live run names "no live run observed"
    beside its own live-run evidence; the consumer-level proof that the token-form self-reply
    is excluded from the body tally was removed with a test). Round three granted (PDR-132:
    beyond two is the Director's): a doc that contradicts the code it describes is not clean,
    and the four cures are one small commit. Routed to lane A after its two pushes. Lens 1.
    REVIEW: the third round.
39. The e2e follow-on (item 31's routing) is PR #66 (23:45Z on 2026-09-13), open as the bot at
    `SHA: 8e72969` from main: the four routed cures plus a latent hang the new cells exposed
    (port and ready arriving in one chunk were missed by a listener attached after the first;
    now buffered); twelve script cells, three mutants killed, the full suite green. Item 5a-iii
    is on origin at `SHA: 38e346a` (`fix/merge-bot-body-tally`, stacked on the #65 tip) and
    opens after #65 merges. Copilot requested on #66; the bot merges at zero threads. Lane A's
    next is the #65 round-three cure, then 5b. Standing ruling; no REVIEW.
40. #62 round fifteen (23:48Z on 2026-09-13): one thread (the continuity index said closure
    items 1 to 6 landed; the plan says 1 to 3 landed, 4 bounded, 6 with 2a and 2b remaining, 8
    filed, 5 and 7 the remaining work) and six suppressed findings (the freeze statement against
    the entries after it; the routing log's last entry in the pre-amendment order; the A row
    without the handed-back residue; an obsolete sequencing paragraph; the archive step without
    the privacy prerequisite; a stale register claim line). All seven cured at `SHA: 3c272eb`,
    named as the final waypoint of #62. Lens 1. No REVIEW beyond item 37's.
41. Push-slot overlap (about 23:49Z on 2026-09-13), the Director's fault: the slot was granted
    to lane A ("the slot stands for that push") and then taken for the Director's own gate
    without waiting for lane A's release; both gates ran at once on their own branches, both
    passed, no shared ref, nothing to cure. Rule as practised from here: a granted slot is held
    until the grantee releases it; the Director queues behind it like any seat. #65 round three
    is on origin at `SHA: 5943bf1` (code-expert: all four cured, no critical or important
    defect; one pre-existing follow-up named: on the OWED path with an outstanding request an
    observed live run is named nowhere in evidence); the Director's chain replies, resolves,
    re-requests Copilot and arms the bot. Lens 4 (host load is the constraint the slot
    protects; the overlap spent it). REVIEW: none; recorded for the pattern.
42. #65 round three (23:58Z on 2026-09-13): one thread (an inter-call window between the
    harvest read and the thread read lets a re-request plus a summary-only review land unseen,
    so the read can return SETTLE-READY with a finding missed) and three suppressed doc-truing
    findings (the timeout clause, the post-merge condition, a rationale comment). Round four
    granted as the last: a measured-state pull request that ships a known false SETTLE-READY
    path is not clean; after round four, body findings go to a follow-on and only a
    correctness thread reopens. Lens 1. REVIEW: the fourth round on #65.
43. #66 (the e2e follow-on) merged by the bot at `SHA: 0ec4583` (23:59Z on 2026-09-13) at zero
    threads with Copilot bound; origin branch deleted. The body was the third closer-look
    merge of the night, four suppressed findings: two integration cells leak a live child or
    socket when an assertion fails before teardown (try/finally); `stop()` always resolves so
    a child exiting 1 after a close rejection leaves the e2e command green; and
    `docs/engineering/testing-patterns.md` still says the suite is served by `pnpm start`
    (verified on `main`). Routed to lane A as an e2e follow-on 2 after 5b. Standing ruling;
    REVIEW: three merges on closer-look bodies; 5a-iii (the body tally) is already next.
44. #62 round sixteen (23:59Z on 2026-09-13): one thread (the continuity index named one
    archive gate where the thread names two) and four suppressed (the header stamp behind the
    routing log; the same gate in the next-step summary; step 3's slow-lane clause; the draft
    section still labelled `draft`). All five cured at `SHA: 8950536`. Lens 1.
45. #62 round seventeen (00:12Z on 2026-09-14): two threads (the archive gate again, in a
    routing entry and the synthesis acceptance line) and three suppressed (the freeze
    statement against item 35; the landed-on-main line partial; the merge-mechanics block still
    naming the quiet window). All five cured at `SHA: 7abb8d1`; item 35 carries an as-executed
    note (the freeze covers new items only; thread cures kept landing). #65 round four is on
    origin at `SHA: 3802031` (the thread read bracketed by a harvest on each side, agree or
    re-read once, fail loud on two; the three text items), the Director's chain on it. Lens 1.
46. #62 round eighteen (00:20Z on 2026-09-14): two threads (the synthesis step 2 drained only
    `graduated` rows; the block listed #66 both landed and open) and one suppressed (the next
    step said "open" the follow-on already merged). Cured at `SHA: 736a343`: every fast-lane
    outcome drains its row, `rejected` and `duplicate` in a register commit whose drain note
    carries the reason or the carrying home (the register's own contract); one snapshot of
    #66 as merged. Lens 1.
47. #65 round four (Copilot on `SHA: 3802031` at 00:21Z on 2026-09-14): zero threads; the bot
    merges on its poll. The body carries three suppressed consistency findings (the SKILL's
    liveness passage against item 4; the bracket's disagreement message naming reviews only;
    the states header on the retired run-deadness states); per item 42 they fold into 5a-iii
    as one commit before its pull request opens, no new pull request. 5b is on origin at
    `SHA: f8e53a3` (`chore/retire-lineage-instruments`, four commits from main, code-expert's
    three items taken; the pull request opens after 5a-iii's). REVIEW (5b): PDR-132 names the
    retired pr-throughput register as a future instrument; ratified text untouched, the
    retirement recorded against it for the owner's card. Lens 1.
48. #65 (item 5a-ii, measured state) merged by the bot at `SHA: 53d9495` (00:31Z on
    2026-09-14) at zero threads with Copilot bound to `SHA: 3802031`; origin branch deleted.
    Four rounds in all (items 36, 38, 42, 47). From here every merge settles on measured state:
    every leg landed, no expected reviewer request outstanding, no live run observed, any
    unavailable run surface named. The 5a-iii pull request opens on the folded tip
    (`SHA: d33eee2`, pushing on lane A's slot). Standing ruling; no REVIEW beyond item 34's.
49. #62 round nineteen (00:30Z on 2026-09-14): one thread (item 35's note and the block named
    different final rounds) and three suppressed (the routing log's last entry labelled
    current; the continuity index calling #55 the generator; candidate F's prediction
    contradicted by #62 itself). Cured at `SHA: cb92f52`: the merged tip is the waypoint,
    no round named; F records its falsification (the doctrine stands, the practice was the
    falsifier: the push rode every event) and a re-scoped prediction for a branch frozen at
    open. Item 5a-iii is PR #67 (00:36Z, `SHA: 12c1756`, the fold plus its code-expert cure)
    and item 5b is PR #68 (00:38Z, `SHA: f8e53a3`), both as the bot, Copilot requested, bots
    armed; the Director ruled 5b opens beside #67 (an independent branch reviews in parallel;
    a green branch held back reduces nothing). Lane A starts the e2e follow-on 2 from main at
    `SHA: 53d9495`. Lens 1.
50. e2e follow-on 2 (00:42Z on 2026-09-14, lane A's ask): the four #66 body cures plus a
    stricter stop predicate (a child that ended before the stop rejects; clean is exit 0
    only). Lane A named a follow-on: the harness child runs through the tsx CLI relay, whose
    30 ms signal-acknowledgement window can turn a correct stop into exit 143 under a stall,
    which the PR makes red where it was a stderr line. Ruling: the relay cure (`node --import
    tsx`, the script as the child) rides the same PR as a second commit before the push; a
    change that makes teardown observable does not ship beside a known false-red path on
    every pre-push gate. Lens 1 (a flake class on the gate costs every push) then lens 4
    (host load is where the stall shows). REVIEW: none.
51. e2e follow-on 2 is PR #69 (00:45Z on 2026-09-14, `SHA: e1beb30`): the observed teardown
    and the finally cells, then the relay cure as bounded (a spawn-line change plus its cell:
    the server runs as this node executable's own child with tsx registered in-process; the
    58 e2e through the real setup, the stop read clean). Copilot requested, bot armed. Four
    pull requests open (#62, #67, #68, #69), the owner's "too many" mark, all under review and
    merging by the bot as they clear. Ruling: 5c builds from main and commits locally; its
    pull request opens only once two of the four have merged. Lens 2 (the owner's word on the
    open count) then lens 3 (no seat idles: the build continues, the queue does not grow).
52. #67 (item 5a-iii, the body tally and the #64 findings) merged by the bot at
    `SHA: fca804e` (about 00:49Z on 2026-09-14) at zero threads with Copilot bound; origin
    branch deleted. The body was a closer-look with three suppressed findings: the headline
    match reads the suppressed-comments marker as a verdict; the verdict is copied verbatim
    from the review body into terminal evidence lines (control-sequence injection); the
    landing executor fake supplies request data whatever the query selects. Routed as item
    5a-iv, one small pull request ahead of 5c (smaller, and one item is a hardening); it
    opens once one more of the three open pull requests merges. Standing ruling; REVIEW: the
    fourth merge on a closer-look body, now with the tally in the verdict (from #67 the count
    is named; the blocking ruling is the owner's card).

## Routing log

- 2026-09-13 evening: seat opened; team-start `ca1ba4d8`; lanes A, B, C authored, unfilled.
- 2026-09-13 evening: pre-push gate red on the Director records because markdownlint walks the
  disk and linted the untracked, generated `shared-comms-log.md` (green in CI, red locally: a
  check that reads the local disk proves the local disk). Stepping stone applied by the Director
  (one ignore line, `.markdownlint-cli2.jsonc`); the cure is routed to lane A: lint the tracked
  universe, not disk globs, and drop the hand-kept ignore list (`compute-dont-hope`). Prettier
  failed the same way minutes later on an untracked editor workspace file; second stepping stone
  (`*.code-workspace` in `.prettierignore`), same routed cure.
- 2026-09-13 13:49Z: three Implementer team-starts landed (Saffron c39ad7, Sirocco 45fe02, Djinn 36720b);
  routed A, B, C by arrival order (events `cc2786a4`, then the roster event); all hold on the
  owner's word. Lane A also carries the tracked-universe lint cure.
- 2026-09-13 about 14:00Z: owner go received; relayed natively and as directed events `0349479b`,
  `8cca63df`, `7b0ab8aa`; all three absorbed. Verdict to lane B: `trigger` key added; the index wins
  where the two hand-kept sources disagree, reconciled rules listed in the PR. OCE checkout location
  sent to lane C natively (machine-local; never a tracked line). Lanes A and C entered their
  worktrees; lane A follows the practised commit identity (no merge-bot identity here).
- 2026-09-13 about 14:10Z: lane B sub-class (eight index-core rules with hand-kept globs and paths)
  ruled situational: the more specific declaration wins; recorded in the lane B record.
- 2026-09-13 about 14:15Z: lane C asked two decisions. Gemini projection: generated by lane B's
  generator as a fourth platform, extension authored by lane C after B's PR 2 (B releases the
  emitter path then). Rows 3 and 5 residue: removed, separate PR after item 4. Substrate-leg
  finding (reads instance-tier files relative to cwd) routed to lane A with credit.
- 2026-09-13 about 14:25Z: lane A corrected the routed substrate-leg shape: a gate must not resolve the
  primary coordination home (that reads another checkout's disk); it derives the instance tier from
  the ignore rules instead. Accepted. Lane C bumps the substrate surface-count guard in its PR by
  that constant's contract; lane A told. Identity rows added to the three lane records.
- 2026-09-13 about 14:35Z: PR #54 (Director records, channel rule) merged at `SHA: c426c6c`. Push order set:
  lane B sweep, lane A PR 1, lane C item 4. Board follow-ons from lane B: ten `invoke-*` rule
  descriptions are name-only (authored content, later small PR).
- 2026-09-13 about 14:50Z: owner: "I expressly said to keep the merge bot tools, this makes me
  concerned for what other instructions are being overturned." Audit of in-flight verdicts against
  ratified text found two overturns, both reversed: the Director's removal verdict on the corpus
  workflow and `sif` instruments (todo 1 says restore) and lane C's "not brought" on two registers
  (todo 3 says create or declare). Merge-bot: kept and scrubbed as ratified; the owner created the
  app (slug in `.github/merge-bot.json`, per-checkout, untracked; key at the documented location;
  mint proved). From now every agent PR write runs as the bot; PR #54 was merged as the owner
  before the bot existed. Lesson: a ratified todo is owner text; the Director's lenses resolve
  questions the text leaves open, never the text itself.
- 2026-09-13 about 14:52Z: lane C round two NOT READY; verdicts: the Director rulings ledger entry
  removed (the rule permanent-doc-is-the-consolidation-record rejects the form; homing proof lives in
  the plan of record and this log); five unrooted pattern citations to a follow-on PR with the leg
  extended to that shape; a focused docs-adr pass instead of a third round. Lane B PR 2 split into
  2a (rules generator) and 2b (sub-agent adapter generator, Gemini as a fourth row); Claude
  adapters gain `paths` as a YAML list (the hand-kept string form matched nothing). PR #55 checks
  green; the bot refused to merge until the requested Copilot review binds the tip; review
  requested as the bot. Board follow-on: the deferred-controls register needs a creating mechanism
  (secops binding), post-transplant.
- 2026-09-13 about 14:55Z (Copilot request on #55 registered 14:53:56Z): lane C READY after a focused docs-adr pass; slot confirmed after lane A's
  review-cure push landed. Node item 4 amended (method only): the Gemini projection is generated,
  not hand-imported, under compute-dont-hope; carried-ness unchanged. Copilot review on #55 requested
  under the owner's CLI credential because the bot's own request registers nothing (finding for
  lane A's merge-bot documentation); CODEOWNERS requests the owner on every PR.
- 2026-09-13 about 15:15Z: PR #55 third round granted (PDR-132 budget exceeded). Generator answer: the
  round-one cure grew the changeset (nine files, a reader module the second PR needed), giving the
  second Copilot pass new surface. Rule from here: cure commits minimal; later-PR material goes to
  that PR. Board: CLAUDE_PROJECT_DIR precedence lets validator entry points rebind to the primary
  checkout from a worktree (protocol-conformance opts out); estate-wide cure is post-transplant.
- 2026-09-13 about 15:25Z: PR #57 merged by the bot at SHA: 4a61112, ahead of #56 and #55 by readiness. Merge
  tool finding: reviews are read via GraphQL where bot logins carry no [bot] suffix, so --expect
  copilot-pull-request-reviewer[bot] never binds; the suffix-less form merges. Routed to lane A item 5
  with the second finding (the bot cannot request Copilot here; the owner CLI credential can).
- 2026-09-13 about 15:35Z: owner: "we need to slow down, just you and one implementer, the rest
  paused." Lane A active (closest to landing: #56 green, two threads); lanes B and C paused with
  state saved (WIP commits pushed, PAUSED events, claims kept, heartbeats stopped). Resume is owner
  word through the Director. Open: #55 third round (lane B), #56 (lane A), restore not started (C).
- 2026-09-13 15:39Z to 15:50Z: post-compaction pickup. Monitors survived (prediction falsified;
  recorded). Records branch pushed (gate green, 58 e2e) and PR #58 opened as the bot, Copilot
  requested under the owner's credential. #56 red at SHA: 9a90d1b: lane A owns three causes (smoke
  tests reading the host's registry and a CI lockfile refusal; CodeQL check-then-use; no Copilot
  request on the tip); cure in progress, slot on ask. Lane B declined the save push: cold-paused
  by owner word in its session; that word binds over the Director's routing. Lane C asked a slot
  for its napkin commit; granted (unpushed capture before compaction is a work-safety exposure;
  worktree hygiene opens the draft PR at first push). Slot order: C, then A on ask.
- 2026-09-13 about 15:45Z: pre-compaction wrap. Records committed on `chore/director-records-2`
  (push queued behind lane A and lane B's pushes in the slot order; the post-compaction Director
  pushes first thing if it has not landed).
- 2026-09-13 about 15:58Z: owner: "please go into warm pause, your only job is to support Saffron, do
  not talk to the cold pause seats unless I say so." Director WARM-PAUSED: watcher and heartbeat
  kept; lane A (Saffron turns Verdure) is the only seat routed; no message to lanes B or C until
  the owner's word; PR #58 (records, Copilot requested on SHA: 28a7676) waits for that word too.
- 2026-09-13 about 15:59Z: owner: "four open PRs, that is too many, aim for zero, only via proper
  means, green and clean and sensible." #56 cures: SHA: 1c00b5c (three causes), SHA: 341e069 (the guard's
  testimony read from its own log, the Linux executor drops lifecycle stderr), SHA: ad006e8 (tracked
  legs subtract `ls-files --deleted`; three doc contracts trued). Rulings: pushes confirmed ahead
  of Copilot binding so one round covers each pair; `principles.md`'s `pnpm check` block granted
  to lane A for this PR (not in lane C's exclusive set; a contract change cures every doc that
  publishes it, same commit). Lesson from lane A, for the record: a new CI leg's first green must
  be a CI run, not the host.
- 2026-09-13 16:20Z to 16:50Z: #56 rounds on SHA: ee3c396 (three threads, all real: the retired `-s` flag
  still in the commit skill, the resolver's leading `--`) and SHA: f2b2048 (zero threads, three doc nits;
  ruled: the sequential-rule rationale rides the port PR, its subject). Bot verdict
  SETTLING-QUIET-WINDOW; owner: "nothing is happening on the PR ... the 'quiet window' could be
  replaced with measured state. As for this specific instance, merge." Merged by the owner at
  `SHA: 1829cd4`; item 3 done. Practice signal for the record: the settlement quiet window is a proxy
  the owner wants replaced by measured state (no review run live, no reviewer requested).
  Owner: "if e2e tests are clashing on a port, fix it!" Routed to lane A ahead of item 5: a
  per-worktree e2e port (validated override, 3000 under CI, else a stable hash of the checkout
  path in 3100 to 3999); go given on the design. Owner lifted lane B's pause for the #55 cure
  only ("ask the Director how to cure PR 55, carry that out, then hand back all responsibilities
  ... this session is over"); cure confirmed as ruled before the pause; slot given for SHA: afe58c8,
  then the generator save push; lane B hands back 2a remainder, 2b and PR 3 at closeout.
- 2026-09-13 about 16:55Z: owner: "please make sure that all work respects the definitions and
  constraints of our testing and validation approaches" (principles, testing-strategy,
  validation-strategy). Check of the work in flight: the port design I had approved (hashed
  per-checkout port, `E2E_PORT` override, `reuseExistingServer` kept) contradicts
  testing-strategy §Harnesses Adapt to Shared Hosts, which rules this collision's cure
  verbatim (an ephemeral port probed at config load, no `process.env` in config,
  `reuseExistingServer` false), and principles §No timing dependence (collision odds are a
  window, not an elimination). Go reversed; lane A amends to the ruled shape, proof by
  exercising the boundary once (two concurrent gates) and construction, no invented pure
  function for a unit test. Lane B asked to confirm the #55 cure's test shape (directive
  definitions, injected fakes, class-shaped rows, relation to the seam) and one killed mutant
  per claim in the commit body. Lesson, same class as the ratified-text overturn: a verdict
  quotes the governing text; a verdict from memory of the problem is the failure shape.
  Lane C stood down by intent (heartbeat-end 16:56Z) after verifying the carry byte-identical.
- 2026-09-13 about 17:00Z: owner: "port assignments belong in a test harness config, not in tests."
  Relayed to lane A as binding on the port PR: the ephemeral port is probed and assigned in
  `jcdotnet/playwright.config.ts` alone; tests and e2e helpers never mention, compute or read a
  port; any probe helper shared with `generate-pdf.ts` lives under `jcdotnet/scripts`.
- 2026-09-13 about 17:05Z: Copilot's review of PR #58 opened six threads on the records, all real,
  all cured on the branch: the routing log re-sorted by time (two labels corrected from the #55
  timeline); the stale first bullet of `repo-continuity.md` and the stale focus paragraph of the
  continuation prompt replaced with current truth; PR #54's merge attributed to the owner; and the
  item 4 Gemini method carded to the owner because a Director verdict had changed ratified text.
  Owner, verbatim: "this is not a matter of competing authorities, what does sensible look like?
  The Gemini adapters are generated, just like everything else." Ruling 1 on the node now carries
  that word; the lane C record follows. Lesson: a method question is asked as "what is sensible
  under the estate's own rules", never framed as one authority against another; the card's two
  options were the false either/or the principles name. Port PR: lane A's worker falsifier fired
  (workers re-evaluate the config and re-probe); option A (the runner probes once and hands the
  port to its workers through its own pid-stamped handshake; external values inert) ruled sensible,
  with the directive sentence amended in the same PR to state the mechanism.
- 2026-09-13 17:16Z: owner: "this is now an n=2 session, you and Saffron." PDR-082 n=2 owner-visible
  mode: the Director's heartbeat loop stopped (confirmed gone), the watcher kept, mode declared on
  the stream. Lanes B and C had handed back and stood down (closeouts on the stream; lane B's
  handoff record v3 keyed by claim 707ed764; lane C's claim closed). 17:18Z: owner: "Open an Arc
  channel with Saffron, but continue to use native comms where appropriate"; channel
  `.agent/collaboration/rapid-comms/2026-09-13-transplant-closure-n2-cauldron-herds-lustre-saffron-turns-verdure.md`
  opened, tailed by both seats, announced; native for quick coordination, the channel for
  dialogue whose transcript is the record, the stream for state.
- 2026-09-13 about 17:20Z: PR #55 was CONFLICTING on the generalisation register (append-only,
  both sides added rows); the Director merged `main` into `closure/lane-b` in lane B's worktree
  with the rows spliced and pushed it through the full gate (lane B's own push had skipped the
  gate on the owner's one-off word). Copilot re-requested on the merge tip; bot polling.
  Merge-bot finding for the scrub (item 5): with a Copilot review run in progress on the tip the
  bot read the leg as SILENT-WAIT-NO-REVIEWER, so its live-run detection misses this run shape.
- 2026-09-13 about 17:30Z: port PR triage on the channel; two items routed here: the handoff
  file's retired reason for serialised pushes (cured above) and `getFreePort` rejecting with a bare
  Error (ruled: a named follow-on PR under lane A that brings `@engraph/result` into the site
  workspace, not this PR and not unnamed debt). Board follow-ons from the hand-backs: the atomic
  writer re-homed to core at its second consumer; a shared no-follow write helper; the
  CLAUDE_PROJECT_DIR opt-out as an estate rule; PR #59 closes as carried when #58 merges; lane C's
  restore worktree and branch removed then.
- 2026-09-13 18:47Z: PR #58 merged by the bot at `SHA: 6528ecb` after five Copilot rounds on the records
  (each round found the next stale line in the resume surfaces; the cure that ended it made every
  live-state block defer to the routing log's last entry and swept the three lane records). PR #59
  closed as carried; the `closure-lane-c-restore` worktree and branch removed; the records branch
  `chore/director-records-3` cut from `main`. Lane A silent since 17:31Z (session "waiting"; no
  commit in either worktree); pinged 18:20Z; surfaced to the owner; its two cures (#55 path escape,
  #60 three threads) not started. Lesson for the record: a records PR that keeps pushing while the
  session moves is a moving target for review; land records at waypoints, not per event.
- 2026-09-13 18:52Z: lane A reported alive: the gap was a long turn with nothing sent, not a
  prompt; order #60 cure then #55; the #55 cure on a local branch from `origin/closure/lane-b` in
  lane A's own worktree, pushed fast-forward to `closure/lane-b` (EnterWorktree refuses a path it
  did not create), claim 383cde5e. Ruling: the shape stands; a state line every 120 seconds of a
  long turn is the liveness signal at n=2 (start-right-team §5); silence read as a block cost an
  owner escalation.
- 2026-09-13 about 19:05Z: owner: "run a full Cricket suite". Both Crickets: DRIFTING, mild.
  Shepherding #60 and #55 is right and event-driven; the gaps between events were empty where the
  routed plan for the handed-back holdings belonged (the invented gate: "then the owner's word on
  the next shape"; the shape is owner-set, its drafting is the Director's). Records pushed per
  event were disproportionate (#58: five rounds); cadence set above. Real waits: lane A's pushes,
  slot serialisation for host load, the credential-bound Copilot request. The quiet window is a
  tool defect to route (item 5), not a gate. No dissolution proposal owed at n=2 (the owner set
  the shape). One premise flagged as ungrounded and put to the owner: that the warm-pause word
  ("your only job is to support Saffron") lapsed with the n=2 word. Verdict drafted above.
- 2026-09-13 about 19:10Z to 19:50Z: owner: "I am not sure where you got your Cricket definitions
  from, but they are not right ... I want a proper Cricket run built on the canonical patterns."
  Survey against the pin: this repo carries the canonical skill and both base templates, but the
  transplant's one-wrapper-per-template projection flattened the four pinned Claude roles (and the
  Cursor four, the Codex three) into two unpinned generic wrappers; the two-leg run had dispatched
  those with a bespoke prompt, one stance, no tally. Owner: "were other skills mangled by unwanted
  and unnecessary compression?" Computed census of every Practice surface against the pin: the
  quartet and three invoke rules (accessibility, design-system, react-component: forty lines to
  seven, naming absent `*-reviewer` agents) were; no skill, component or directive is shorter; the
  design-system template is shorter by the ratified content-grain merge; twelve skills and five
  templates are product or vendor drops (the two `sif` instruments and `under-the-hood` worth a
  second look under "bring unless product"). Quartet reinstated from the pin, validators green,
  PR #61 as the bot. Owner: labels carry the dual scale ("highest power, low effort, normal
  frame"), vendor-specific (Codex has three seats); written into the skill's three dispatch
  sections. The canonical panel ran: eight of eight, seven ON-TRACK, one DRIFTING (opus
  adversarial); accepted: the quartet PR yields every push slot to the closure path; tally at
  `.agent/reports/agentic-engineering/cricket-quartet-tally-2026-09-13-director-closure.md`.
  Lane A's two plan proposals accepted into the routed verdict (item 5 in three PRs by changeset
  class, merge-bot cures first; the follow-ons parked after item 7). Tool traps for the napkin:
  the hook reads a commit message's word "restore" as the git command; nested heredoc quoting
  inside `bash -c` breaks before anything runs.
- 2026-09-13 about 19:55Z: trap met and recorded: the ARC channel file is committed on the records
  branch and absent from `main`, so a branch switch in the primary working copy deletes it from
  disk and the switch back re-creates it (the tail replays the whole file; an append by the
  partner in that window would have blocked the switch back). No loss this time (the tree is
  clean against the committed blob; the partner appended nothing in the window). Rule for this
  seat: the primary working copy stays on the records branch while a channel is open; any other
  branch's work runs in a worktree. Second trap the same minute: the hook's substring policy reads
  the prose of a heredoc inside a shell command, so records prose that names git operations is
  written through the file tool and appended, never typed into a shell command.
- 2026-09-13 about 20:40Z: owner: "I would prefer session two continue. You have two minutes to
  ask me questions." Three cards answered: the Director drafts the candidate list tonight and
  Saffron completes it (the register pull request) after #60 and #55 land; session 2 precedes
  item 5; scope is the three unconsolidated napkins plus today's captures (lane A, lane C and
  the Director's sections). The routed verdict's order is amended accordingly: #60, #55, the
  session 2 register PR, then item 5 (three PRs, merge-bot cures first), 2a, 2b, the Gemini
  projection, the restore with the five patterns, `sif`, item 7. The candidates go to the owner
  as one batch of cards in the morning; nothing graduates without the answers.
- 2026-09-13 23:50Z (the snapshot at that time; §Current handoff state is current): the order
  after the owner's 20:40Z amendment, as executed: #55
  merged, the register PR #63 merged before #60, #60 merged; item 5 runs as parts (5a-i merged
  as #64; 5a-ii #65 in round three; the e2e follow-on #66 open; 5a-iii on origin, PR after
  #65; then 5b, 5c), then 2a, 2b, the Gemini projection, the restore with the five patterns,
  `sif`, item 7 last. The overnight decisions from item 36 are on `chore/director-records-4`.

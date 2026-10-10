# Retrospective: why a records-only fold takes half an hour against the owner's ten minutes, and what the door charges every class

Written 2026-10-10 by Cedar turns Grove (1950d1, claude-code, claude-fable-5-1), the seat that ran
two of the four folds it judges, at the owner's word of 14:16Z: "Ultrathink /jc-start-right-team
/jc-metacognition /jc-free-play /jc-concept-exploration /jc-plan /jc-retrospective please plan then
run a retrospective session". The arc is the seven pull requests 320 to 326 (2026-10-04 to
2026-10-10); the instance that fired is the four coordination folds (320, 323, 324, 326) and the
mechanism under the question is the one every pull request here passes: the push gate, the vendor
review round, the merge door and the fold ceremony. Every count names the command or file it is
derived from; the derivation sheet is the session's scratch ledger and its script, whose output is
reproduced in the tables below. The adversarial read's findings are quoted as returned, each with
the seat's disposition.

## The owner's words that bound the arc, verbatim

- 2026-09-14, in PDR-132 §Decision and PDR-140 clause 4: "I don't want the number of rounds of PRs
  to go up".
- 2026-09-26, the lifetime rule's amendment: "Fold them twice a day"; the same morning: "work is
  safe when it is merged, the target number of open PRs is always zero".
- 2026-10-02, the lifecycle skill's work-in-progress clause: "work is not safe until merged into the
  default branch. That is one of the reasons for maintaining strict WIP limits, and strict PR
  limits. With two Implementers the limits are one coordination and one in-progress feature/fix PR
  per estate".
- 2026-10-04, the card answer the push hook cites: light commit, full push.
- 2026-10-08, at the editor plan's review: "90% of the cost of a PR is the feedback loop from
  reviewers, five PRs will take roughly fives time longer than one PR, and there is absolutely no
  reason for this to be complex, most of the risk are mitigated by configuring tools. You get one
  PR, and reviewer feedback is input to evaluate, not authority to be obeyed"; the same day, after
  a fold cured thirteen privacy findings: "Copilot reviews are a source of information to consider,
  they are NEVER authority to obey, if we follow their advice or respond to their observations it is
  ONLY because we decide to do so."
- 2026-10-10 11:1xZ, while the fourth fold ran: "the fold is already running, and an HOUR is a
  ridiculous typical time for a fold, ridiculous, and a clear signal of a process and engineering
  failure. 20 minutes would be somewhat excessive, 10 minutes would be acceptable. We have a problem
  with our PR approaches and mechanisms".

## Reconstruction from primary sources

### The mechanism as it runs (read from the files, 2026-10-10)

The pre-push hook (`.husky/pre-push`) runs the secret scan, the review-cost gate and `pnpm check`
under the host gate slot; `check` runs build, type-check, lint, test and the end-to-end suite through
Turbo, cached, then the repository validators. CI composes the same legs, and the ruleset on `main`
(`gh api repos/jimCresswell/jimcresswell.net/rules/branches/main`) requires `run-quality-gates` and
`CodeQL`, blocks deletion and non-fast-forward, has no pull-request review rule, and configures the
Copilot reviewer with `review_on_push: false`: every Copilot review here is a request a seat makes
under the operator's credential (`.agent/reference/merge-bot.md` §"One review request per settlement
push"). The door, `merge-bot merge --expect copilot-pull-request-reviewer`, acts on exactly one
verdict, `SETTLE-READY` (`agent-tools/src/merge-bot/merge-decision.ts`); a declared reviewer's leg is
satisfied only by a review that binds the current tip (`agent-tools/src/pr-watch/reviewer-legs.ts`),
the ten-minute timeout arm ends an unserved leg as SKIPPED, and an empty or defaulted expected set
never merges. The lifecycle skill names that timeout-settled round "NEVER merge-eligible — EXCEPT for
the class the owner ruled on 2026-09-03 ('Change the merge policy instead'): a bot-authored pull
request that touches only documentation and Practice surfaces merges at checks green by name, zero
unresolved threads, every finding dispositioned, with the Claude Code Review's standing verdict and
NO Copilot leg expected; for that class a timeout-settled round IS merge-eligible", and adds "Until
the tool learns that class, the merging seat recomputes that gate by name and lands the merge through
the sanctioned REST endpoint as the bot" (pr-lifecycle §review-round state machine, the item 4
anchor). The tool has not learned it: `merge-decision.ts` carries one verdict. The fold skill's step
7 says the opposite of the ruling for a bot-authored records fold: "A fold is reviewed before it
merges: where the host does not review a ready pull request by itself, request the vendor review at
the ready-mark. A fold merged with no review took six true findings after its merge (2026-09-21), and
on 2026-10-01 one estate's vendor reviews found two false entries in records the other estate had
merged unreviewed." That sentence entered this estate's fold skill at 054841ff (2026-10-02, "record
lessons in ten skills"), carried from the two-estate-consolidation thread record's lesson line, on
those two instances; it carries no falsifier, which PDR-130's fast lane asks of every graduation, and
no price, which nothing asks. The two skills are live texts that disagree about the fold's class: a
finding of the kind this record classes F below, in the two skills the mechanism runs on, found by
the adversarial read of this record and not by any fold's review. PDR-140 (owner-ratified
2026-08-31) says of prose-class changesets that the reviewer samples an unbounded pool and never
depletes it, that the cure is the exception (clause 1), that pushes are the rationed unit with a
default budget of two (clause 4), that a records-class finding is over the bar only when a reader
acting on the artefact would be misled (clause 9a), and that a route arriving after the final head
lands with the seat's own capture commits, never by reopening the reviewed pull request (clause 9c).

### The four folds' clocks

From `gh pr view`, `gh api .../commits/<sha>/check-runs` and `gh api .../issues/N/timeline`,
recomputed at 14:4xZ by the session's script (`fold-clock.py`, in the scratchpad). A fold's window
runs from the first commit made for the fold (the merge of main or its opening records) to the
successor branch's first records push landing (its CI start); "to merge" is the same start to the
merge instant. The gate bound is the interval from a commit to its CI's first check, an upper bound on
the local pre-push gate that also holds the seat's time between the commit and the push. All UTC.

| Fold | Seat | Start | Ready-mark | Copilot: request → review (min) | Merged | Successor push landed | To merge | Wall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 320 (10-05) | Sycamore holds Spore | 16:40:20 | 16:46:44 | 5.5; 7.8 | 17:06:02 | 17:11:53 | 25.7 | 31.6 |
| 323 (10-08) | Cedar turns Grove, by its fork | 09:39:16 | 09:44:53 | 6.7; 5.4 | 10:20:25 | 10:25:32 | 41.2 | 46.3 |
| 324 (10-09) | Cedar turns Grove | 12:36:33 | 12:39:52 | 4.5; 7.3; 5.0 | 13:13:31 | 13:34:22 | 37.0 | 57.8 |
| 326 (10-10) | Shrew rides Eventide | 11:12:18 | 11:18:20 | 4.2; 3.9 | 11:33:09 | 11:38:11 | 20.9 | 25.9 |

Read from the owner's word to Shrew (its team-start event, 11:02:28Z), 326 took 35.7 minutes; the
first 9.8 were a hold for this seat's handoff records, written into the tree for the fold's commit
(Shrew's napkin block says twelve; the API's instants are preferred here).
The four windows sum to 161.6 minutes of wall clock, 124.8 of them to the merge; the mean window is
40.4 minutes and none is inside twenty.

Where the minutes went, as measured intervals (they overlap at the edges and are not a partition):

| Component | Measure | Sum over the four folds |
| --- | --- | --- |
| The local gate, per pushed tip (15 tips inside the windows) | commit → CI first check: 14 of 15 between 2.1 and 3.8 min, median 2.3; the fifteenth 16.6 (8dcffd34: this seat's wrap work between the commit and the push, its transcript-digest script stamped 13:24Z). The direct measure the hook itself prints, in this seat's three push logs of 8 October: Turbo's clock 1m25s, 1m27s and 1m15s with 27 of 29 tasks cached, the rest of the hook (the secret scan, the review-cost gate, the root checks, the validators) inside the bound | 34.9 (the fourteen) |
| CI to green (first check start → `run-quality-gates` completed), on the critical path only if a merge waits for green rather than for a review | 2.8 to 4.1 min over the 15 tips, median 3.6; today inside the vendor wait | — |
| Copilot's own turnaround (9 rounds) | review_requested → review: 3.9 to 7.8, mean 5.6 | 50.3 |
| The ready-mark and the request after the opening push landed | CI start → review_requested: 0.15, 2.7, 0.3, 0.5 | 3.7 |
| The seat's cure between a review and its cure commit (5 cure pushes) | 1.8, 9.5, 4.0, 3.2, 3.1 | 21.6 |
| The last review → the merge (dispositions, the door's poll) | 1.7, 9.4, 3.6, 0.4 | 15.1 |
| The merge → the successor's first commit (cut, retire, fold entry) | 3.5, 2.5, 4.2, 2.6 | 12.8 |
| The successor push's gate bound | 2.3, 2.6, (16.6), 2.4 | 7.3 + the outlier |

The floor of the present mechanism with a perfect records pass and a review that finds nothing is
one gate (2.3), the ready-mark and request (0.5), one Copilot turnaround (5.6), the merge (0.4), the
cut and the fold-entry commit (2.6) and the successor's push (2.4): about 13.8 minutes, already past
the owner's bound before a single finding. Each finding round adds a cure, a gate and a turnaround,
about eleven minutes; the folds averaged 2.25 rounds.

### The findings, by class

The 39 originating Copilot review comments on the four folds (`gh api .../pulls/N/comments`, those
with no `in_reply_to_id`, author Copilot), classified by this seat from each comment's text:

| Class | What it names | 320 | 323 | 324 | 326 | Total |
| --- | --- | --- | --- | --- | --- | --- |
| A | a stale state or an internal contradiction a successor acting on the record would be misled by (a summary calling an archived node live; "paused, commits may be local" beside a recorded resume; a ledger row frozen at an early survey; an identity row ending at a pause the seat resumed from) | 4 | 5 | 2 | 1 | 12 |
| B | the confidential-material class under the privacy directive's rule 7 (editorial backstory, rejected methods, participant diagnosis, custody narrative: a seat's provisional list of 2026-08-12 awaiting the owner's word) | 0 | 5 | 6 | 2 | 13 |
| C | a record's own contract against the seats' practice (the Director handoff "rewritten in place at every transition, never appended" while every seat since September appends a dated STATE block; the thread record's current block first; a plan's `superseded_by` or `last_updated`) | 1 | 2 | 0 | 2 | 5 |
| D | scope or intake (an experience letter outside the declared §Scope; a binding rule carried in a records-class fold) | 1 | 0 | 1 | 0 | 2 |
| E | arithmetic or a count (465 and 218 files written 464 and 217; an estimate summing to 2.5 hours called under two; a napkin header's line count) | 1 | 2 | 0 | 0 | 3 |
| F | a doctrine contradiction between two live texts (two skill clauses of 7 October against the thread-record README's `Branch:` field; the privacy directive's new permission against AGENT.md's older ban; the audience-reader's reading-discipline import against its own template) | 0 | 2 | 2 | 0 | 4 |
| | cured in a push | 5 | 13 | 8 | 5 | 31 |
| | not cured in the fold (deferred, declined with a reason, routed) | 2 | 3 | 3 | 0 | 8 |

The seats accepted 35 of the 39 as true at their anchors and cured 31 in pushes; two were declined
and two rejected with reasons on the pull requests. Of the 13 class-B findings, 11 anchor on records
this seat wrote. The same class-C finding, the Director handoff appended against its own contract
sentence, was cured per instance on 323 and raised again on 326; the contract sentence (line 13 of
the file) still stands against the practice.

### The comparators

From `.agent/memory/operational/review-cost-ledger.md`: 322, the code landing of 465 files, took
seven rounds and six settlement pushes at 62.74 of a rebudgeted 120, and the door merged it on a
tip-bound Copilot review with zero findings; 321, the doctrine landing, two rounds at 13.98 of 40;
325, the editor, zero vendor rounds, nine commits over five pushes, the cost being the seat's own six
reviewers and a Cricket suite that the owner stopped ("Finish the fucking basic editor"), and the
door read SETTLED-NO-REVIEW until the owner's word merged it through the bot's REST path. OCE's
ledger, read from its checkout on this machine, shows the coordination folds its rows name on the
same shape: #135 five rounds and 38 findings at 112.22 of 40; #137 four; #148 three; #153 three;
#156 three; #170 four; #171 three; #175 three; #176 two; #187 three; #299 three at 16.87 of 40; #352
three at 36.57 of 40; and two of a different shape under the owner's 2026-09-03 class, #159 and
#169 on 2026-09-21. #169 was marked ready at 09:08Z and merged at 09:09:40Z through the bot's REST
endpoint with the door reading SETTLED-NO-REVIEW; its six post-merge findings (four Copilot from
09:12:51Z, two Codex from 09:14:01Z, by `gh api .../pulls/169/comments`; the ledger row says three
and three) were cured and routed on #170's first settlement push, and #170's row prices that cost:
six of its fifteen findings came from #169, its budget was exhausted and rebudgeted once.

At the measured range, two folds a day in each of two estates cost between 1.7 and 3.1 hours of seat
time a day (the 57.8-minute window holds about fourteen minutes of non-fold work; 44 without it), plus
the vendor's compute; at the owner's bound the same cadence costs forty minutes.

## The causal stack, by depth

**Technical root: the code requires a tip-bound vendor review for every class, and the doctrine
exempts a class the tool never learned.** `merge-bot merge` merges on SETTLE-READY alone;
SETTLE-READY needs the declared reviewer's review binding the tip; the vendor's turnaround is 3.9 to
7.8 minutes a round and its first round never returned zero findings on a records diff (nine rounds,
39 findings, one zero: 326's second round). So the present mechanism's floor is about fourteen
minutes and its typical cost one or two rounds more, while the lifecycle skill has carried since
2026-09-03 an owner-ruled class, bot-authored and touching only documentation and Practice surfaces,
that merges at green with no Copilot leg expected "until the tool learns that class", and the fold
skill has carried since 2026-10-02 a seat's clause requiring the review the ruling waives. The
local gate is not the cost: on a records-only push Turbo replays `check` and the end-to-end leg from
cache, and fourteen of fifteen pushes landed on CI within 2.1 to 3.8 minutes of their commit. The
seat's reading of 11:1xZ on 10 October, written into the napkin, the continuity record and a per-user
memory ("a ten-minute pre-push gate per push"), was wrong by a factor of three; the felt clock of a
seat waiting is not a measurement, and this record corrects it additively (the napkin block stands as
written; this is the correction).

**Process root: a records-class fold cures what its round finds, and its steps run in series.**
The seats cured 31 of 39 findings in pushes, each cure push buying a gate run and a vendor round.
Sixteen of those cures (classes A and F) were over the bar by PDR-140 clause 9a's reading and
thirteen (class B) under a provisional privacy rule awaiting the owner, so the cure reflex is a small
lever beside the round itself: the cost is structural, the round, not the seats' triage. The fold of
323 ran without the records pass the fold skill's precondition 3 names (this seat's own ledger row
for 323 says so) and its sixteen findings were that pass's price; the one fold that ran the pass
before its ready-mark, 326, still took 20.9 minutes to its merge. The ceremony is
serial where it need not be: the records pass before the ready-mark (326's took twelve minutes in the
background of a hold), the opening push, the review wait, the cure, the second push, the second
wait, the merge, the cut, the fold-entry commit, the successor push, the draft pull request, the
broadcast; the records pass could run beside the opening push's gate and the successor's push could
run beside whatever the seat does next. Two class-C findings recurred because they were cured where
they were found and not at their generator: the Director handoff's contract sentence and the thread
record's current-block rule each disagree with what every seat does, so every fold re-raises them.

**Meta root: the estate adds a synchronous gate from a lesson faster than it builds a ruled
exemption into the tool, and prices neither.** The owner's ruling of 2026-09-03 gave the docs-only
bot-authored class its merge at green and the lifecycle skill wrote "until the tool learns that
class"; five weeks on no code lane has carried it. On 2026-10-02 a consolidation's lesson carry
graduated the opposite requirement into both estates' fold skills from two instances (OCE #169's six
post-merge findings; a 2026-10-01 pair of false entries), with no falsifier (PDR-130's own
obligation on every fast-lane graduation) and no stated price (about an hour a day across the two
estates at two folds each; nothing asks for one). Two retrospectives in four weeks priced the review
loop (2026-09-15: records-only pull requests were 1.4 % of added lines and 43 % of Copilot reviews;
2026-10-05: the hunk times a lifecycle), and their proposals did reach code where the owner decided
so (`arc-metrics`), so the lane exists; what never reached the tool was the owner's own ruling, and
what reached the skill was a seat's lesson against it. The mechanism's merge policy changed at the
owner's word before (PDR-131 in July, after "2.5–3 hours was not a measure of how long it should
take, it was a measure of the broken merge approach we currently use"; the ruleset switch of
2026-10-05). No instrument reads a fold's wall clock (`arc-metrics` measures sessions' transcripts,
the review-cost gate prices rounds), so the cost reached the owner through his attention, the channel
the 2026-09-15 record named as its meta root, and when this seat read the clock by hand it mis-read
it. The next "why" (why a seat reaches for a gate on a lesson) is model behaviour the estate shapes
only through its own doctrine, which proposal 4 is.

## The counterfactual

The segments that ran right exist. OCE's #169 merged at green one minute after its ready-mark and its
six post-merge findings were cured on the next fold's first push, the vehicle PDR-140 clause 9c names
and the one 324's third-round finding and 320's two deferred findings rode here. Shrew's 326 ran the
records pass before the ready-mark (eight slips cured before the opening push) and took 17.4 minutes
from its opening head to the merge with one round of five. 320's successor push landed 2.3 minutes
after its commit.

Composed from the measured components, a fold that requests the vendor review at the ready-mark and
merges at green with zero unresolved threads without waiting for it reads: the opening push's gate
(2.3), CI to green (3.6, the ready-mark and the request inside it), the merge (0.4), the cut and the
fold-entry commit (2.6): about nine minutes to the cut, with the successor's push (2.4) in the
background, or eleven to twelve with that push on the path; the vendor's review lands about two
minutes after the merge and its over-bar findings ride the successor's first records commit, where
324 and 320 put theirs anyway. The records pass is where the bound is tight: a twelve-minute pass
that must finish before the ready-mark puts the fold at about eighteen minutes, so proposal 1 alone
does not reach ten and proposal 3 is load-bearing: a pass bounded to the fold's own diff and briefed
with the last three folds' finding classes, run beside the gate and CI (about six minutes of cover),
or one whose cures ride the successor's first commit like the vendor's, keeps the fold near nine.
Confounds the record cannot remove: the four folds carried different records volumes (the fold of 323
carried three days of a lane's records, 326 one day's) and three different seats; OCE's #169 ran
under a door state where both legs had timed out since 06:46Z, so its one-minute landing bought
about three minutes against today's shape and its six findings cost #170 a rebudget.

## Honest credit

The nine rounds caught four doctrine contradictions the seats had missed (class F: two skill clauses
against the thread-record README, the privacy directive against AGENT.md, the audience-reader's
import against its template), twelve stale-state slips a successor acting on the records would have
met (class A), and thirteen items of the confidential-material class, of which the owner called the
first fold's cures "overkill" in part and whose categories still await his word. The fold ceremony
itself lost no commit and diverged no branch in four runs; each folded branch was retired with a
read-back; the review-cost gate priced every round and the ledger carries them; the door's refusal
on 325 was the system working; the vendor's turnaround of under eight minutes is not the defect. None
of it excuses the price: about fifty minutes of vendor waiting and about thirty-seven minutes of
cure, disposition and door time over four folds, twice a day, in two estates, for records whose
readers are the seats themselves and whose next records commit is hours away.

## The predecessors' proposals, read against this arc

The retrospective of 2026-09-15 proposed, and the owner adopted on 2026-09-16, that records ride the
pull request they describe and wraps go to the coordination branch (held: the folds carried records
and the editor's records rode 325; 324 carried the editorial family's doctrine, named in its §Scope
as a work product found on the branch), and that PDR-140's intake declaration opens every records
pull request with one Copilot request per settlement push (held on all four folds: the intake line
is in each body, and the requests were 2, 2, 3 and 2 for 2, 2, 3 and 2 pushes). Its proposal 4, the
arc's metrics as a bin, landed as `arc-metrics` and measures sessions, not landings; its slow-lane
proposal 7 (owned doctrine fires at the seat's need, review 2026-12-15) gains an instance for that
review: PDR-131's framing, PDR-140's cure-is-the-exception and PDR-130's prediction obligation each
answered today's correction before it was made. The retrospective of 2026-10-05 proposed the landing
unit of one pull request per estate and a measured §Size rate (not tested by a records arc), and in
its slow lane that settlement cures the class, not the instance (review 2026-10-19): the Director
handoff finding cured on 323 and raised again on 326 is an instance for that review. Two of four
live proposals of the 2026-09-15 record are routed; the 2026-10-05 record's fast-lane proposals are
untested here; the skill's own falsifier (three consecutive retrospectives with no routed proposal)
does not fire.

## Proposals, each with warrant, falsifier and lane

For the owner as one numbered list taking one word each, declines by number.

1. **The tool learns the class the owner ruled on 2026-09-03, and the two skills are reconciled to
   it: a bot-authored fold touching only documentation and Practice surfaces merges at green with
   zero unresolved threads and does not wait for a vendor review.** Mechanism: `merge-bot merge`
   computes the class from the pull request's diff against a path set the tool owns (the ruling's
   "documentation and Practice surfaces"; hook policy JSON, generated adapters, workflows and
   anything executable or CI-affecting stay code-class by the lifetime rule's test, "is this
   code?"), never from a seat's flag, and for that class merges on checks green by name and zero
   unresolved threads; the fold skill's step 7 is rewritten to the ruling, the same bytes in both
   estates, and PDR-131 §1 and PDR-140 clause 9 take a dated amendment each naming the class and its
   post-merge route. This record proposes one departure from the ruling's letter for the owner to
   decide with it: the vendor review is still requested at the ready-mark (the ruling expects no
   Copilot leg) and harvested after the merge, its over-bar findings riding the successor's first
   records commit, because the folds' rounds caught four doctrine contradictions the seats missed.
   Warrant: the owner's ruling and the lifecycle skill's own "until the tool learns that class";
   the fourteen-minute floor and the eleven-minute rounds against the findings' classes; OCE #159
   and #169 landed under the class; the owner's words of 2026-10-08 and 2026-10-10. Falsifier,
   computable: a seat grounding from a checkout at `main` (a fresh clone, a worktree cut from
   `main`, a cloud seat) acts on a record that a post-merge finding would have corrected, before the
   next fold lands the correction; by this record's classes each of the twelve class-A findings
   would have been such a record for up to half a day, and in the arc no seat grounded from `main`
   (every seat sat on the primary's coordination branch, where the correction lands within minutes);
   two instances in a quarter revert the clause by dated amendment. One open question for the
   owner: at green, or at the ten-minute timeout the ruled class names, which alone spends his
   bound. Lane: fast (an owner ruling applied); his decision because the departure above is new and
   the door changes. Cost: one small agent-tools pull request with its tests, the two skills
   reconciled, two PDR amendments; nothing until his word.
2. **The fold's clock is measured by the tooling and carried on the ledger row, never read by the
   seat.** The fold's instants (the opening push landed, checks green, the ready-mark, the review
   requested and landed, the merge, the cut, the successor's push landed) printed as one line by the
   coordination tooling and copied into the ledger row's notes. Warrant: this seat's hand reading was
   wrong by three times on the gate; the owner's bound is wall time and no instrument reads it.
   Falsifier: three folds whose rows carry no clock, or a clock a minute off the API's instants.
   Lane: fast; a small agent-tools change.
3. **The records pass runs beside the opening push's gate, bounded to the fold's diff and briefed
   with the last three folds' finding classes, and the two recurring contract clashes are cured at
   their generators.** The Director handoff's contract sentence is brought to the practice (dated
   STATE blocks under §Current handoff state, the newest first) or the practice to the sentence, the
   owner's call; the thread record README's current-block-first rule is stated where a seat appends,
   at the record's head. Warrant: Shrew's pass (eight slips in twelve minutes before the vendor's
   five); the same two findings on 323 and 326. Falsifier: a contract-clash finding on either file at
   the next fold. Lane: fast; skill and record text.
4. **A doctrine clause that says "until the tool learns X" opens a code-lane item the day it lands,
   and a synchronous step added to a recurring ceremony states its price per day beside the
   falsifier PDR-130 already asks for.** Warrant: the 2026-09-03 ruling's "until the tool learns that
   class", five weeks with no code lane; the fold-review clause of 2026-10-02, graduated with no
   falsifier and no price (about an hour a day across two estates). Prediction: by the review date
   no "until the tool learns" clause older than a week lacks a named code-lane item in either estate,
   and no mandatory synchronous step has entered the push or fold ceremony without a stated daily
   price. Falsifier: one of either. Lane: slow (it changes how the estate graduates a lesson into a
   ceremony), review 2026-12-15, a row in the register's slow-lane section beside the existing one.

## The free-play harvest (bounded; associations, never findings)

Kept: PDR-131's framing sentence of July reads like today's word three months on, the same shape at
a different door, so the estate rediscovers the same lesson quarterly; a non-authority wired as a
gate looks like a smoke detector wired to the door lock; a seat's clock runs on attention, not
seconds (three seats read a two-to-four-minute gate as ten, or "about four"); the records pass, not
the vendor, is where the fold's value showed up. Discarded, visibly: "the fold as a tide"
(decorative); "the customs officer stamping the manifest of an empty hold" (an illustration that
asserts nothing, kept only as that).

## The adversarial read

One read-only leg (the assumptions reviewer, 244,599 tokens, 59 tool uses) read the draft before the
cures below were applied, with the API, both ledgers, the two skills, the decision records and the
seat's push logs as its sources. It re-ran the clock script (output byte-identical), re-derived every
instant from the timeline API, and reproduced the fold windows, the sums, the 39 comments and the
class totals. Its ten findings, condensed, and the seat's disposition of each:

1. The technical root and proposal 1 omitted an owner-ruled class the cited lifecycle skill already
   carries (2026-09-03, "Change the merge policy instead": a bot-authored docs-and-Practice pull
   request merges at green, no Copilot leg expected, "until the tool learns that class"), so
   proposal 1 was "largely the tool learning a class the skill already says it should learn", not a
   reversal of an owner decision, and the fold skill's step 7 and that ruling are two live texts that
   disagree. Taken: the mechanism paragraph, the technical root, the meta root and proposal 1 are
   rewritten on the ruling; the one departure from its letter (requesting the review and harvesting
   it after the merge) and the timeout question are put to the owner.
2. The composed eight-minute fold dropped CI to green (2.8 to 4.1 minutes after the push lands,
   inside the vendor wait today, on the critical path once a merge waits for green). Taken: the
   components table has the row, the composed fold reads about nine minutes to the cut and eleven to
   twelve with the successor's push on the path, and the record says proposal 3 is load-bearing.
3. The meta root's "graduated on one instance" did not hold (the clause at 054841ff already names
   two), the 2026-09-30 retrospective priced no review loop, PDR-130 asks for a falsifier and not a
   price, and the 2026-09-15 record's proposals did reach code at the owner's decisions. Taken: the
   quotation is whole, the list reads two retrospectives, the price is this record's own ask, and
   proposal 4 is re-warranted on the fold clause and the unbuilt ruling.
4. Proposal 1's falsifier was inconsistent with class A (twelve stale-state findings that would each
   have landed on `main` under it) or unfalsifiable (seats act on the coordination branch, not
   `main`), and its doctrine footprint is PDR-131 §1 and PDR-140 §9, not two sentences. Taken: the
   falsifier names its reader and surface and is computed against class A; the footprint is listed.
5. The code-path guard was undefined (a seat's flag; hook policy JSON, generated adapters and skills
   with shell blocks unclassified). Taken: the class is an output of the diff against a tool-owned
   path set, with the lifetime rule's test naming what stays code.
6. Three counts: "never returns zero findings" (326's second round did); "every coordination fold"
   in OCE's ledger (six rows missing, #159 among them, a second instance of the class); #169's six as
   three Copilot and three Codex (four and two by the API). Taken, all three.
7. #169's cost side is measured in OCE's #170 row (six of fifteen findings; a rebudget) and the
   record said it was not. Taken: beside #169 in §The comparators and in the counterfactual.
8. Framing: the record omitted that 323 skipped the records pass (this seat's own ledger row says so)
   and that eleven of the thirteen class-B findings anchor on this seat's records; by its own
   classes the cures were mostly over-bar, so "defaults to curing" described class B, whose bar is
   the owner's open question. Taken: the process root carries both and weights the cure reflex as a
   small lever; the thesis stands at the compliant fold's 20.9 minutes.
9. A refused push leaves no API trace, so the gate bound sees only the push that landed; the push
   logs are the direct instrument. Taken: the components table cites Turbo's own clock from the
   three logs, and §Blind-spot bounds names the blindness.
10. Small slips: the Director handoff's contract sentence is line 13; the hold was 9.8 minutes
    against Shrew's twelve; the 3.9-hour top of range held fourteen minutes of non-fold work; a
    rejected finding is not one accepted as true. Taken, all four.

The leg's proportionality verdict: proposals 2, 3 and 4 light and proportional; proposal 1 "not
heaviness but a proposal lighter than what it must amend", simpler framed as the tool learning the
ruled class with the two skills reconciled. Taken as the shape above.

## Blind-spot bounds and the error signature

This record is written by the seat that ran two of the four folds it judges, from its own records
and the API, after two compactions; its first draft missed an owner ruling in the skill it cited, and
one adversarial read found it. Point outside scrutiny at: the fold windows' start, a definition this
seat chose (the first commit made for the fold; from the owner's word 326 reads 35.7, not 25.9); the
gate figure, an upper bound from CI start times that cannot see a refused push or a re-run after a
fix (the three push logs of 8 October are the direct instrument and show no refusal; the hook prints
no whole-gate clock of its own, proposal 2); the classification of the 39 findings, one seat's
reading of each comment's text, eleven of the class-B findings anchored on this seat's own records
and 323's sixteen the price of a records pass this seat's fork skipped; the composed nine-minute
fold, a sum of measured components that no fold has yet run; OCE's folds, read from its ledger rows
and one pull request's comments, not its pull requests whole; Shrew's figures, relayed by message and
read against the API where the two differ ("about four minutes" a gate against 2.3 to 3.1 measured;
"twelve minutes" a hold against 9.8). The seat's own earlier reading, "a ten-minute pre-push gate
per push", stands in the napkin block of 11:1xZ and the continuity record's step 3 of 10 October as
the error signature this record names; both are corrected additively, never rewritten.

One instance from this record's own landing, before it landed: the partner seat's push on the shared
primary failed at the markdown-links validator, which reads the working tree, because this seat's
tracked README row linked to its own still-untracked report and the validator classes a
tracked-source-to-untracked-target link as blocking. Nothing of the partner's failed; the gate ran
once for nothing. The mechanism is the one this record describes from the other side: a gate that
reads the disk reads every seat's edits, so at n=2 a report and its index row are committed together
before anyone pushes, and one push then carries both seats' commits.

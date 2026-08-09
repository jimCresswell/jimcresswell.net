---
name: pr-lifecycle
classification: active
description: >-
  Open a pull request and shepherd it to merged: reviewer-facing description,
  full-surface harvesting (GraphQL review threads, all comments, all checks),
  root-cause-first triage, the review-round state machine with its convergence
  tally and mechanical step-back predicate, budgeted watching, and an honest
  truly-green merge. Use whenever a branch reaches PR closeout, an open PR needs
  driving to live, review rounds are looping without converging, or a green PR
  sits unmerged.
---

# Pull Request Lifecycle

Imported and adapted 2026-08-09 from the Oak Open Curriculum Ecosystem Practice.

This skill composes with `.agent/skills/quality-gates/SKILL.md` (local gate
discipline), `.agent/commands/review.md` (the local reviewer-subagent flow), and
`.agent/skills/semantic-merge/SKILL.md` (hand-authored unions over agent memory
and state files). Every gate constraint here inherits the repo's standing rule:
all quality gates blocking, always; never disable a check.

The one-sentence contract: **a PR is done when it is live** — opened is not
done, green checks are not done, "ready for review" is not done; done is merged
with every finding genuinely settled. Standing down while the work is unmerged
is the error: a feature branch with an open PR is one cleanup away from gone,
and a merge gate — settled-state, or owner sign-off where required — is a gate,
never a handoff of ownership. The dual discipline: a gate nobody can NAME is an
INVENTED gate — holding green work on an unnamed gate is the inverse failure of
merging past a real one.

## Local shape (read once, assume throughout)

- Single-package pnpm repo (Next.js personal website), single owner (Jim), base
  branch `main`, feature branches, GitHub via the `gh` CLI.
- Pre-commit runs `pnpm check:ci`; pre-push runs the full gate sequence plus the
  Playwright e2e suite against a production build. **A clean push IS the
  local-green proof** — do not re-run gates just to re-confirm it. CI re-runs
  the same surfaces via the `check`, `e2e`, and `validators` workflows.
- No ticket tracker. **Plans under `.agent/plans/` are the tracking surface** —
  wherever this skill routes a finding "elsewhere", the destination is a named
  plan entry, never a vague "later".
- The primary review instrument is the local reviewer-subagent roster (gateway
  `code-reviewer` plus specialists — editor, test, type, security,
  accessibility, architecture, docs/ADR, and the rest), invoked per
  `.agent/commands/review.md` and the local rules before and during the PR.
  GitHub-side asynchronous reviewers (for example Copilot, when requested) are
  the surface the review-round state machine below governs.
- Agent sessions share ONE checkout: commit with scoped pathspecs only, never
  `git add -A` sweeps that capture a peer session's staged work.

One stacked-PR mechanic that bites at open and at retarget: **a base retarget
fires no `synchronize` event, so required checks do not re-run** and the PR can
sit green-stale or pending forever. The cure is an empty commit on the head
branch (`git commit-tree` against the same tree, push), touching no checkout.

## What a PR is (the intent under every phase below)

**A PR is the structured conversation through which a proposed change earns the
right to become shared truth — and the durable record of that earning.** `main`
is the only durable home; the PR is the airlock, and the review conversation is
not friction on the way through the airlock — it IS the airlock. Consequences
the mechanics below assume (the upstream genesis, 2026-07-08: a session
reported "MERGEABLE" as progress while threads sat unresolved, then posted an
unverified disposition reply — a false claim into the permanent record):

- **Every comment is a claim entitled to full epistemics** — verify,
  adjudicate, integrate or refute with evidence. _Resolved_ is the outcome of
  that treatment, never the goal; racing resolution inverts the artefact.
- **While a PR is open, the conversation IS the work.** A reviewer finding is a
  bug report against the proposal — session priority #1, ahead of new work. A
  push changes the proposal, so the entire review surface is stale the moment
  it lands: re-harvest and disposition before reporting anything.
- **The record outlives the merge.** Description, threads, and dispositions are
  how future readers recover _why_ the change is what it is. A false
  disposition reply poisons that well permanently — gate every reply on its own
  verification, and verify description edits actually stuck.
- **"Mergeable" is a git-graph fact about ancestry, not readiness.** Readiness
  is a property of the conversation: every thread dispositioned with evidence,
  every check green, the description true of the _current_ diff.
- **The PR exists to structure shared attention** so nobody has to chase state;
  making the owner chase threads defeats the artefact even when the diff is
  perfect.

## Phase 1 — Before opening

1. **Divergence**: `git fetch origin main`; if behind, merge `origin/main` into
   the branch (never rebase-and-force-push an already-pushed branch). When the
   update touches agent memory or state files (`.agent/memory/`, continuity
   surfaces, plans), author the union by hand per
   `.agent/skills/semantic-merge/SKILL.md` — a git line-merge silently corrupts
   them. Tripwire: a conflict beyond trivial union-append on such files STOPS
   the merge and routes to the owner — resolving it solo is how approved
   versions get silently reverted.
2. **Tree and gates**: working tree clean of everything this PR should carry
   (peer sessions may hold their own staged work — leave it untouched). When
   several branches need pushing, push them as ONE multi-ref command
   (`git push origin refA refB refC`) — the pre-push chain runs once per push
   invocation, not per ref, so N separate pushes pay the full e2e suite N times
   for the same tree (upstream first-hand, 2026-08-06).
3. **Scope the PR for review, not for tidiness**: an artefact that invites deep
   review in its own right (a design plan, a doctrine rewrite) bundled into a
   closeout PR multiplies asynchronous review rounds without bound (an upstream
   instance ran 5+ rounds before the bundle was split); give such an artefact
   its own PR. **Sizing bands: ~5 files changed is the NORMAL shape; 10 is
   acceptable; 20 is a problem.** A changeset heading past 10 files splits
   BEFORE opening, while splitting is cheap — not after the rounds prove the
   point.
4. **Changeset-health check**: a healthy changeset settles within a round
   budget of a few review rounds — the state machine's four-settled-rounds arm
   below is the mechanical ceiling. **A round budget is a size constraint in
   disguise, and it binds at authoring time: slice at plan time, not at the
   first over-budget review round.** A changeset already smelling of hidden
   second stories is re-examined NOW — at open, splitting is cheap; over
   budget, it is expensive.
5. **Declare the expected reviewer set** in your working notes: which local
   reviewer subagents the change class requires (per
   `.agent/commands/review.md`), and which GitHub-side reviewers, if any, are
   configured or will be requested. This declaration is the state machine's
   input for every round — never infer it later from who happens to have
   reviewed.

## Phase 2 — Open with a reviewer-facing description

Read `.github/PULL_REQUEST_TEMPLATE.md` and fill it as a **communication
artefact for reviewers**, never a file list: what changed, why it matters, what
reviewers should focus on, what was deliberately left out, and what evidence
supports merge readiness (the template's verification section names
`pnpm check` and `pnpm test:e2e` explicitly — fill them truthfully). Update the
description whenever the review story materially changes.

When requesting a Copilot review: GitHub's REST `requested_reviewers` endpoint
SILENTLY DROPS the Copilot handle — 200 response, no error, handle absent from
the resulting request (upstream first-hand, 2026-08-08) — so request it through
the GitHub MCP `request_copilot_review` tool or the web UI, never the bare REST
endpoint, and verify the reviewer actually appears on the PR. Request at
PR-open and after a reshaped diff, never per cure push; a bot's absence never
blocks a merge.

### Title and description are CLAIMS about the diff — derive them from it

**A description cannot check the artefact it describes.** Both come out of the
same pass, so their errors correlate: re-reading your own summary confirms the
summary, never the change. Before opening, and again after any push that
reshapes the diff, **derive the change class mechanically and make the title
name the most severe thing actually present**:

- **Version changes** — compute the semver step per changed dependency from the
  diff, never from the intent you began with. Any major bump belongs in the
  title. A pin's trailing `# v1.2.3` is itself a claim: resolve pinned SHAs
  against the upstream tag, not the comment.
- **Scope** — files or surfaces the diff touches that the title's framing does
  not cover.
- **Removals** — anything the diff deletes that a reader of the title would not
  expect to lose.

Upstream worked failure (2026-07-26): a PR titled _"action pin bumps"_ carried
two major version bumps, one on a required status check. The diff was correct;
the title simply did not say what was in it, so two majors read as pin
maintenance — caught only because a reviewer read the diff instead of the
description.

**Reviewers inherit the duty inverted**: never take the title or description as
the statement of what changed. Derive the change class from the diff first,
then read the description as a claim to be checked against it. A description
that undersells its own diff is a finding to raise, not a formatting nit.

## Phase 3 — Harvest EVERY feedback surface (the step most often botched)

Immediately after opening — and again after every push — pull all surfaces.
Partial reads produce false "no problems" verdicts:

1. **Review threads (the authoritative comment surface)** — GraphQL
   `pullRequest.reviewThreads`, reading per thread `isResolved`, `path`, and
   each comment's body plus its originating review's commit binding
   (`comments.nodes[0].pullRequestReview.commit.oid` — the field the tally
   store is built from). `reviewThreads(first: 100)` is the API MAXIMUM, not
   "all" — paginate past 100 or the harvest silently truncates. REST issue
   comments MISS inline bot threads; a REST-only read is the canonical way to
   falsely conclude "no comments" (upstream worked failure, 2026-07-02: two
   REST comments were triaged as "noise" while four unresolved inline threads
   sat unread).
2. **Issue comments and reviews** — full bodies, never truncated skims, AND
   each review's own `commit.oid` retained alongside its body. The dual of the
   REST-only failure: a reviewThreads-ONLY harvest also structurally
   undercounts — findings can live only in review submission bodies with no
   thread state (Copilot's suppressed low-confidence bucket is the known
   example, and those findings have run real at a striking rate; the burden of
   proof is REPRODUCTION before cure — a non-reproducing one gets a reasoned
   decline with the falsifier recorded, never a speculative cure or a silent
   skip). A thread never auto-outdates when its fix lands in a DIFFERENT file
   than the anchored line — reply with the actual fix location and resolve
   manually, or it reads unaddressed forever.
3. **All checks** — `gh pr checks`, including any external ones. A failed
   check's _first_ failure is the root to chase: an early install failure
   cascades into skipped builds and a failed deployment — fix the root, not the
   echoes. Diagnose a failed CI run from the failed **step name**
   (`gh run view <id> --json jobs -q '.jobs[].steps[] |
select(.conclusion=="failure")'`), never from the `--log-failed` tail — an
   `if: always()` advisory step that runs last can misattribute the failure.

## Phase 4 — TRIAGE every comment; fix at source

- **The triage ruling** (a session-level obligation applied at the moment each
  comment is read, never deferred): you do NOT have to address every comment;
  you have to TRIAGE every comment — if it is incorrect reject it; if it is
  correct, relevant, and proportionate address it; if it is anything else,
  route it to a named plan entry, tell the owner, and close the comment.
- The three-way test, exactly one terminal state per finding:
  1. **INCORRECT → reject**, with verified reasoning in the reply. Rejection is
     a first-class outcome, never a failure of nerve. Every disposition names
     its EVIDENCE CLASS: READ (reasoned from source, never executed) or RUN
     (exercised first-hand). A whole round dispositioned READ-NOT-RUN is sound
     as readings and is NOT test evidence — say so in the disposition, so
     nobody downstream upgrades a reading into a proof.
  2. **CORRECT and relevant and proportionate → address**, fixed at source. ALL
     THREE conjuncts are required: a correct finding whose cure widens the PR
     beyond its story fails the proportionality conjunct and goes to state 3.
  3. **ANYTHING ELSE → plan entry + tell the owner + CLOSE the comment.**
     Correct-but-elsewhere, correct-but-disproportionate, out-of-story
     hardening, adjacent design questions: record the finding in the owning
     plan under `.agent/plans/` (create one if none owns it), notify the owner,
     reply with the plan reference, and RESOLVE the thread. The closure is
     deliberate — a routed finding left unresolved re-creates the divergent
     loop this rule ends.
- **Convergence is the test of the loop**, not only the correctness of each
  round: rounds should shrink; a cure not required by the PR's story is a plan
  entry, not a commit; unrequested hardening built mid-review has a measured
  high defect rate (upstream worked instance, 2026-07-26/27: one PR reached ten
  rounds — one feat commit, twelve fix commits, four cures introducing new
  defects, three of those in hardening nothing asked for).
- **A sampling finder has no fixed point — cure the CLASS, not the instance.**
  A bot reviewer over a large, dense diff _samples_ it differently each pass
  rather than converging (measured upstream: finding counts of 5, 5, 2, 4, 3, 3
  across one arc, with round 10 flagging surfaces unchanged since round 1).
  Waiting for such a loop to reach zero is waiting on a process that has no
  zero. Two moves end it: **the class-kill** — when a finder lands one instance
  per round of the same shape, stop curing instances and close the family in
  one move; and **tally-then-step-back** per the state machine — cure
  correctness-class findings, disposition polish with a verified failure
  scenario, give any routed residue a named plan home. Convergence then means
  _the loop closed honestly_, not _the finder went quiet_.
- **A growing round is a routing failure.** If the surface under review expands
  between rounds, the loop cannot converge by construction — freeze the text
  and route the additions rather than reviewing a moving target (upstream
  worked instance: a design plan whose three review rounds ran 98 → 112 → 113
  findings while the text doubled, because each cure added reviewable mass; the
  cure was partitioning, not more rounds).
- Order by blocking force and risk, not by tool order; root causes before
  echoes. Fix the class, not the instance: a spelling finding on two lines gets
  a repo-wide sweep of the class; a stale literal gets checked against its
  source constant.
- **A cure is a claim: it gets the same verification tier as the finding it
  cures, and it carries its paired test.** Review-round cures are the next
  round's most likely defect surface (upstream: one round's failures were ALL
  inside the previous round's cures). A cure without the test that would have
  caught the finding is half a cure. After absorbing cures from MULTIPLE
  reviews, the COMPOSITION needs its own pass: two independent,
  individually-correct cures have interacted to create a third defect
  (upstream, 2026-07-28).
- Disposition is content-based and binary — a comment's timestamp is
  irrelevant. "This predates my change" is not addressed, and a fresh finding
  introduced by the fix commit itself is an open finding, never a side-tangent.

## Phase 5 — Wait without burning budget

- **Every PR-state read STARTS from the compound read — the state machine's
  item 1 — in ONE call.** Reading any SINGLE field in isolation to answer a
  question is forbidden, however narrow the prompting signal (upstream, ~50th
  instance of the class: told "BEHIND", a session read merge-state and checks
  while two fresh unresolved threads were the actual blocker). Answering a
  named signal with just that signal's fields is the recurring generator; the
  cure is categorical, never vigilance.
- **CI can go SILENT, and silence reads as pending forever**: a PR in
  CONFLICTING mergeable-state silently stops `pull_request` workflow runs — no
  failure, no event, just absence. A settle watch therefore reads
  `MERGEABLE`/mergeable-state alongside the checks, and confirms runs exist for
  the CURRENT head via `gh run list` filtered per head — a checks-green read
  against a head with zero runs is reading the PREVIOUS head's truth.
- This repo has no budgeted watcher tool. The strongest available primitive is
  a slow poll of the compound GraphQL read (~60 seconds or slower), acting only
  on deviation or terminal state. Never hand-roll tight `gh` polling loops —
  the API budget is shared. Between events, continue other work; when a poll
  cannot be sustained, hand the watch to the owner explicitly as a named
  handover, never by silence.
- **All-green is not terminal.** Review comments post asynchronously up to ~10
  minutes after a push, so an all-green observation opens an unguarded window
  exactly when a bot round may still be composing. MERGED/CLOSED is the only
  terminal claim — the only state no late comment can un-green. Keep
  re-checking (or keep the handover live) until one of those states holds.

## The review-round state machine (single definition)

Phases 5–7 drive one coupled loop over review rounds. The contract lives here,
once; the phases reference it.

1. **The compound read.** One GraphQL selection is the baseline compound state:
   `headRefOid` (the current tip every review binding is compared against),
   `mergeStateStatus`, unresolved `reviewThreads` count, `statusCheckRollup`,
   and `latestReviews(first: 20) { totalCount pageInfo { hasNextPage endCursor }
nodes { author { login } commit { oid } state submittedAt body } }`. Two
   inputs come from elsewhere and sit on top: the reviewer-leg verdict (from
   the Phase 3 harvest — the per-author `latestReviews` pointer can point
   BACKWARDS when an older-tip review job completes after a newer push) and the
   expected reviewer set (declared at Phase 1). Treat `totalCount > 20` as
   truncation and page before concluding a reviewer is absent. `latestReviews`
   serves ONLY the reviewer leg; it CANNOT reconstruct round history — rows
   vanish from the connection whenever a reviewer posts again.
2. **The tally store.** One row per settled round, `{round commit SHA, count of
findings in reviews bound to that commit}`, PERSISTED in the shepherd's
   working notes and built from the Phase 3 full harvest. Findings are counted
   from BOTH surfaces: review threads AND review bodies bound to the tip — a
   summary-only review carrying findings in its body otherwise never enters the
   round count, and "settled, zero new findings" can read true against a
   disagreeing body. ONE LOGICAL FINDING COUNTS ONCE: a body finding restating
   an inline thread of the same review does not add to the tally. Sessions here
   operate under the owner's GitHub credential, so an agent's own disposition
   replies read back as owner review activity: sign every bot-visible reply
   with an agent marker as the final line, and EXCLUDE self-authored signed
   replies from the round tally and from quiet-window anchoring — an unsigned
   self-reply falsely re-opens the round. A finding whose review binds to an
   ALREADY-SETTLED round's tip AMENDS that round's row (the tally records
   truth, not the order of discovery); the settled round does not reopen — the
   late finding is worked as current-round work — and the trigger arms evaluate
   the amended history only from the current round forward. NEVER derive the
   tally from `latestReviews` (rows vanish), and NEVER bucket by arrival order:
   reviews bind to the tip they reviewed, and a review bound to an older tip
   can land after a newer push — arrival-order tallying charges findings to the
   wrong round and can falsely trigger, or mask, non-convergence.
   **Convergence is the per-round count strictly decreasing. The step-back
   trigger is mechanical, with the exact predicate `c[n] >= c[n-1] AND
c[n-1] >= c[n-2]` (two consecutive non-decreasing transitions across three
   settled counts) OR 4 total settled rounds in the epoch — and EITHER ARM
   FIRES ONLY WHILE the latest settled round's count is non-zero**: a
   zero-finding settled round is the terminal SUCCESS state and takes
   precedence (3→2→1→0 is convergence completing, not a step-back). The
   upstream genesis: eight rounds and ~38 findings ran unnoticed as
   non-convergence because nothing counted. When the trigger fires:
   STOP fix-pushing, and step back over the FULL finding corpus for the shared
   generator — often the changeset, not diligence, is the wrong size. **The
   class-fix push that answers a step-back OPENS A NEW CONVERGENCE EPOCH**: the
   tally re-baselines at that push — round counting and both trigger arms
   restart within the epoch, and prior-epoch rounds stay recorded as history.
   **A second step-back firing on the same PR is terminal for fix-pushing**: do
   not attempt another class fix — split the PR along the corpus's class
   boundaries, or route the corpus to the owner with a verdict. Ahead of these
   failure arms sits the round-budget expectation: the transition fires when an
   over-budget round OPENS — the first review activity binding a tip after the
   budgeted number of rounds has settled, NOT when that round's tally row
   settles — recording budget-exceeded in the working notes and running the
   generator question before the round's findings are cured. **The arms fire on
   GENERATOR recurrence, not singleton noise**: before acting on a fired arm,
   classify the round's findings — distinct, unrelated mechanical singletons
   route to a coverage-noise assessment rather than terminal escalation, while
   findings sharing one generator confirm the fire; record the classification,
   and name the generator-absence evidence rather than just asserting it.
   **Reflexive loops may never go quiet — then the exit is a JUDGEMENT, capped
   on ROI and risk, never on round counts**: when each cure creates the surface
   the next round probes (gate-shaped code especially), triage each new finding
   on marginal expected value versus full cost AND a tail-risk veto that fixes
   any genuinely new severe class regardless of the curve, then exit by
   reasoned per-site disposition once findings restate a documented residual.
   **Recovery for an over-scoped PR already in flight — the two-class
   disposition ruling:** a multi-story PR whose reviewers re-review the whole
   diff on every push cannot reach the zero-new-findings exit — the SURFACE,
   not diligence, generates the findings (upstream: one PR ran 14→19 unresolved
   across nine push-per-cure pushes, three rounds, no convergence, checks green
   throughout). Classify every finding: **CLASS F** — the PR would LAND a false
   statement → cure in the PR; nothing false lands. **CLASS P** — true and
   valuable, but about how the named work is EXECUTED later → reply naming the
   owning home — a plan entry under `.agent/plans/` — and resolve WITHOUT
   growing the diff. A Class P reply must name a real plan entry — "later" with
   no home is ignoring, not dispositioning. The durable lesson sits upstream of
   the recovery: a round budget is a size constraint in disguise, bound at
   authoring time — single-story PRs are the generator fix; this ruling is the
   in-flight recovery, never a licence to open multi-story PRs.
3. **Reviewer-leg states**, computed per (reviewer, tip): **SATISFIED** — ANY
   harvested review by the reviewer binds to the current tip (the Phase 3
   harvest is the source; `latestReviews` alone can hide this when overlapping
   review jobs complete out of order). **SKIPPED** — via a tip-scoped marker,
   or via the timeout. The MARKER leg: an explicit skip marker in a review body
   satisfies SKIPPED only when its review binds to the current tip, OR when its
   body declares a terminal or until-re-enabled scope; a quota notice posted as
   a tip-bound review IS such a scope-declared marker and NEVER counts as a
   zero-finding review — reading a bounce as settlement is the silent-wait
   class at the reviewer leg. A scope-declared marker is re-checked each round
   against OBSERVABLE state and holds until its stated condition ends; a marker
   whose condition cannot be evaluated falls through to the timeout exactly as
   an unscoped marker does — otherwise an early unscoped marker would satisfy
   SKIPPED for every later tip forever. The TIMEOUT leg: no review bound to the
   tip after one full checks-green quiet window (>10 minutes from the tip's
   checks reaching green); record the skip with its evidence (reviewer, tip
   SHA, window bounds) — without the timeout, the gate goes permanently
   unsatisfiable the moment a reviewer stops reviewing. **OWED** — otherwise.
   The gate never waits more than one quiet window for any single reviewer.
   First-round rule: the expected set is not "bots that previously reviewed
   this PR" — before any expected reviewer has reviewed, every declared
   reviewer is OWED until it posts or the timeout fires; this closes the
   vacuous-predicate hole where an initial tip could read merge-ready before
   the first round ever lands. The expected set's SOURCE is the Phase 1
   declaration, never inference from the compound read (`latestReviews` is
   empty on an initial tip).
4. **Round settled; merge-ready.** A round is SETTLED when every expected
   reviewer leg reads SATISFIED or SKIPPED for the current tip AND a quiet
   window LONGER than the async lag (>10 minutes) has elapsed since the latest
   review binding to the tip — never since the push. On a tip where every leg
   settled via SKIPPED, the quiet window anchors on the checks-green window
   from item 3. **The quiet window is a PROXY for review-run-boundary
   visibility, which agents lack; the owner sees run start and finish directly,
   so an owner settled-word — or an owner-executed merge — supersedes the proxy
   and is never read as a process breach.** Agents keep the proxy. MERGE-READY
   is a settled round that landed zero new findings, plus every Phase 7 gate
   leg.
5. **The merge boundary.** Merging takes two sanctioned shapes, both issued at
   a freshly RECOMPUTED full gate: the explicit `gh pr merge <n> --merge`
   command, or ARMING auto-merge — permitted exactly and only at settled-READY
   under an explicit in-session owner grant; arming before settlement is
   forbidden. An armed intent is a standing merge command bound to the settled
   state it was armed at: GitHub enforces only checks and threads, never the
   round-owed or body-tally legs, so a NEW review, review comment, or harvested
   finding arriving after arming invalidates the arm — on any such signal,
   DISARM (or re-verify the full gate and re-arm); the session that arms owns
   watching for exactly this staleness until the merge fires. The recomputed
   full gate: the round reads SETTLED per item 4 for the current tip; zero
   unresolved threads; a finding count of ZERO on BOTH tally surfaces (zero
   unresolved threads alone can coexist with a non-zero body tally) AND zero
   newly harvested findings regardless of which round they bucket to; **every
   REQUIRED check from the base branch's ruleset PRESENT in the tip's check
   list BY NAME and green — an expected-but-never-created check is simply
   absent from `gh pr checks`, so an all-visible-terminal-green read looks
   settled while the merge 405s** (upstream worked instance, 2026-07-24: a
   required workflow landed on `main` after the PR opened, no `synchronize`
   event had fired since it existed, and its required check was never created;
   any PR open across a required-workflow migration window inherits this state;
   cure — an empty-commit push fires `synchronize` and creates the missing run,
   and the 405 text itself names the missing check: read it).

### Read mechanics the settled verdict depends on

- **Read STATUSES alongside check-runs.** A required commit STATUS context
  (deployment integrations are the classic case) publishes no check-run — a
  check-runs-only read shows green with a required context pending or failed,
  and GraphQL `statusCheckRollup` can show a stale pending long after the
  deployment finished. Derive the required list from `/rules/branches/<base>`
  and read each name across BOTH `/commits/{sha}/check-runs` AND
  `/commits/{sha}/status`.
- **A review-request 201 is not a registration.** The REST
  `requested_reviewers` POST can return 201 and silently drop; the roster read
  is ambiguous in both directions (Copilot leaves it the moment it starts).
  Verify via the issue TIMELINE's `review_requested` events. Cap identical REST
  retries at two.
- **A review row is not a review.** Read the review BODY before counting it — a
  `COMMENTED` row on the exact head has contained only a skip notice. And a
  review PRESENT on the PR is not a review OF the merge head — match its
  `commit_id` to the head at the merge moment.
- **Paginate reviews to exhaustion.** `/pulls/{n}/reviews` pages oldest-first
  (default 30): an unpaginated read on a busy PR is structurally guaranteed to
  hide the recent rows — the ones being asked about. Bot reviewers are visible
  only via the GraphQL `... on Bot` fragment; REST `requested_reviewers` and
  `gh pr view` omit them.
- **Run the merge-base deletion sweep before ANY merge**:
  `git diff "$(git merge-base origin/main HEAD)" -- <touched paths> |
grep -E "^-" | grep -v "^---"` and read every printed line — each is an
  intended deletion or a silent revert. A stale whole-file capture produces a
  clean, conflict-free overwrite that every gate in the chain is structurally
  blind to (upstream worked instance, 2026-07-28: a green docs PR sat one
  command from silently deleting a landed security clause).

## Phase 6 — After EVERY push, re-fetch; resolve only what is settled

- Reviewers re-review each push asynchronously: **"0 unresolved" is a moment,
  not a state.** Re-fetch `reviewThreads` and checks after every push and again
  at the instant of any merge-ready declaration — a finding can land seconds
  after your last look.
- Reply to each thread with the fix evidence (commit SHA + what changed), then
  resolve it. "Resolved" is a settled-concern state, never a button clicked to
  clear `mergeStateStatus`.
- **On this repo the owner is the most likely concurrent writer** — he commits
  to `main` directly and may push to any branch: re-fetch the branch tip
  immediately before opening the commit window, not just at grounding. On any
  non-fast-forward rejection, STOP external writes and read the incoming
  commits' AUTHORSHIP first — owner commits mean an owner-version-wins
  reconciliation (semantic union per `.agent/skills/semantic-merge/SKILL.md`,
  named surviving deltas, history preserved via merge), never a mechanical
  merge-and-push. Hold thread replies until the push lands, so no external
  record ever cites a superseded commit.
- **Silent-wait sweep after every push**: verify the expected reviewer is
  REQUESTED on the new tip — a push does not re-request, and a tip with no
  requested reviewer and no tip-bound review waits forever looking healthy. The
  same sweep names a shepherd for every open PR: threads with no owner are the
  same disease.
- **Own the convergence loop — never hand it to the owner by default.** Bot
  rounds land findings minutes AFTER a push, so "zero unresolved verified now"
  expires on a clock you do not control. Bundle every finding from one round
  into ONE fix push (each push mints a fresh round; per-finding pushes multiply
  rounds without bound). Keep the numeric round tally exactly as the state
  machine's item 2 defines it — **the tally is the trigger's only input: an
  unbuilt tally store means the trigger cannot fire, and a PR can run to ten
  rounds looking locally healthy at every one** (upstream, 2026-07-26: ten
  rounds, twelve cure commits, four introducing new defects; nothing counted,
  so nothing fired). At owner-active tempo the discipline tightens: the owner
  may merge or push mid-arc, so every binding moment recomputes the compound
  state.
- **Confirm the PR is still OPEN in the same re-fetch.** A push to a
  just-merged PR's branch SUCCEEDS but is not inclusion — the commit silently
  misses `main` (upstream worked instance, 2026-07-06: a review fix landed on a
  branch minutes after the owner merged; rescued by cherry-pick). If the PR
  state is MERGED, verify tip ancestry
  (`git merge-base --is-ancestor <tip> origin/main`) before treating any
  post-merge work as landed; strand-rescue is a cherry-pick to a follow-up
  branch, never a branch delete.

## Phase 7 — Merge-ready is a declaration with a gate

Merge-ready means, re-verified at the declaration instant: all checks green AND
zero unresolved review threads AND the local reviewer flow run per
`.agent/commands/review.md` with findings settled AND **the review round
SETTLED for the current tip, no reviewer leg OWED, per the state machine's
items 3–4** (the upstream genesis: a merge raced a composing bot round, which
then posted five findings onto merged code). OWED = do not merge, regardless of
green checks and zero unresolved threads; the SKIPPED timeout bounds the wait.
Then:

- **`mergeable` means POSSIBLE to merge; it does NOT mean READY to merge.**
  `mergeable: MERGEABLE` asserts only conflict-freeness and reads TRUE on a PR
  with failing checks and open threads. The readiness field is
  **`mergeStateStatus`**: `CLEAN` = GitHub's conjunction of ITS OWN merge
  requirements — it does NOT include the state machine's round-owed leg, so
  CLEAN with an OWED reviewer leg is still not merge-ready;
  `BLOCKED`/`UNSTABLE`/`BEHIND` name what GitHub sees as unsatisfied. Every
  readiness read queries `mergeStateStatus`, never `mergeable` (upstream worked
  instance: a session recomputed `mergeable: MERGEABLE` three times as its
  "truly-green gate" and could not explain the unmerged state to the owner).
- **Merge only through the state machine's merge boundary (item 5).** The
  explicit `gh pr merge --merge` is a check-then-act step — review state can
  change between the recomputation and the command, and GitHub enforces neither
  the round-owed nor the body-finding leg — so the gate NARROWS the merge-race
  window without closing it; that residual race is ACCEPTED and covered, never
  claimed away: Phase 8's post-merge harvest is its named recovery.
- **The merge gate is merge-button-active-for-a-non-admin**: a truly-green PR
  merges via a normal non-admin `gh pr merge`. `--admin` is FORBIDDEN: it
  bypasses the gate instead of satisfying it. Never `--no-verify`, never a
  disabled check — the same prohibition family as
  `.agent/skills/quality-gates/SKILL.md`.
- **The truly-green gate authorises merge-READINESS, not every merge.** A PR
  the agent authored in-session, whose reviews are the agent's own subagents,
  needs an in-session owner grant (or the owner's own click) before
  `gh pr merge` executes. Broadcast "merge-READY at truly-green" and surface
  the merge as an owner action moment unless a named in-session grant exists.
  An owner grant is per-session, never standing. A PR sitting unmerged at
  truly-green because nobody issued the merge (where merging was granted) is
  the shepherd's unfinished work.
- Know when a BLOCKED state can NEVER clear: a required status context that
  nothing posts any more leaves `mergeStateStatus: BLOCKED` permanently at
  green-everything — recognise it by a missing required context in the TIP'S
  statuses (not a failing one), verify against `main`'s own commits whether the
  context posts ANYWHERE, and surface it to the owner: restoring the producer
  or amending the ruleset is repo governance, never the shepherd's bypass. The
  never-CREATED twin is the state machine item 5 405 case; its cure is the
  empty-commit push.
- Holds on a merge-ready PR are EVENT-released, never timer-released: a
  zero-cost hold (waiting on a named arrival, an obsolescence check) releases
  the moment its event fires — a hold that would release "in a while" is an
  invented gate; and a hold placed for a composing review covers only
  substantive changes, never docs/comment-only deltas.
- **Never run `gh pr merge --delete-branch` while the local checkout carries
  uncommitted changes** — doubly live here, where sessions share one checkout:
  the flag switches the local checkout to `main` as cleanup, and with a dirty
  tree the fast-forward aborts — the remote merge has already succeeded,
  leaving the local tree stranded mid-cleanup with edits displaced onto `main`.
  Commit or relocate local work first, or merge without the flag and delete the
  branch separately.
- **A deferred or denied merge does not end shepherding.** "Truly green" has a
  shelf life: comment-clean verified at one instant expires at the next event.
  When the merge is handed to the owner, the PR is still live surface — keep
  the harvest loop running until the merge actually LANDS; hand over a state,
  never a standing claim (upstream: a "truly green" handover accrued three
  unresolved bot threads while the agent stood down).
- Prefer a **merge commit** (`--merge`) unless the owner directs otherwise.
  Verify the allowed merge methods first —
  `gh api repos/<owner>/<repo> --jq '{allow_merge_commit, allow_squash_merge,
allow_rebase_merge}'` — settings have silently reverted before; if the
  preferred method is disabled, surface it to the owner rather than silently
  falling back.
- **`gh pr update-branch` is a server-side merge commit, not a local operation
  — it races the next local push.** Always fetch/pull immediately after calling
  it, before pushing anything else to that branch, or the next local push is
  rejected non-fast-forward. It merges base in with no local gate run first —
  verify the merge is clean via `git diff origin/main <merged-head> --stat`
  (only your intended files changed). The semantic-merge tripwire re-applies:
  never let a server-side or mechanical merge resolve agent memory or state
  files — abort and author those unions by hand locally.
- **CI runs the test-merge with CURRENT main.** A mid-round `main` landing can
  red a check on your round with no push of yours; the cure is one push that
  folds `main` in alongside the fix, not a mystery hunt. And a bot re-review
  binds ~5–10 minutes after the request — push the complete batch first, then
  request, or the round binds to the pre-push tip and is wasted.

## Phase 8 — After merge: honest closeout

**One post-merge harvest before stand-down.** MERGED ends the merge-state
question, not the feedback stream: a bot round composing at merge time still
posts findings on the merged code up to ~10 minutes later. Apply the settled
quiet window ONCE after MERGED (one final full harvest after >10 quiet
minutes); route any real finding to a follow-up branch, never to the merged
PR's branch. The quiet window remains a proxy — the owner's settled word from
his own visibility supersedes it.

Record the merge in the session's continuity surfaces (the napkin per
`.agent/skills/napkin/SKILL.md`, and the owning plan under `.agent/plans/`):
peer sessions share this checkout and disposition against state they cannot
otherwise see.

**Merge auto-delete overrides recorded dispositions**: if a branch must survive
its PR's merge, re-push it immediately after — a disposition note does not bind
GitHub's delete-on-merge setting. Branch and local cleanup follows the
shared-checkout discipline: content-verified before deletion, owner-authorised
for anything destructive, and never touching a peer session's branches or
staged work.

Closeout is honest or it is not closeout: the PR description true of the final
diff, every thread dispositioned with evidence, the plan updated with routed
findings, and no claim of "done" while any of those is still open.

## Failure modes this skill exists to prevent (all observed upstream)

- REST-only comment reads declaring "no comments" over unresolved inline
  threads.
- Truncated comment skims triaged as "noise".
- Ready or merge-ready declared without re-fetching after the latest push.
- Findings dismissed by timestamp ("predates my change") instead of
  dispositioned on content.
- A failed check's downstream echoes debugged before its root cause.
- Tight `gh` polling loops in place of a slow compound poll.
- A merge fired between "zero unresolved verified" and a composing bot round
  binding to the tip — NARROWED, not eliminated, by the round-owed gate:
  Phase 8's post-merge harvest remains an obligatory recovery, never optional.
- Eight fix-rounds shepherded one-by-one with no per-round tally, so
  non-convergence never surfaced as a signal — cured by the tally store plus
  the step-back trigger.
- An armed auto-merge waiting forever on a required status context that nothing
  posts any more, misread as a merge mystery — cured by the Phase 7 never-fires
  recognition.

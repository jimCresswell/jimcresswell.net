---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 115
fitness_line_length_rationale: >-
  Raised 100 → 115 (owner-authorised 2026-06-29) for this append-heavy
  narrative/continuity surface. Marginal prose-width drift on appended prose is
  chronic-cosmetic (99% of breaches were ≤120; median 104) and manual reflow is a
  transient non-cure on a file that grows by append each session; 115 clears the
  noise while still flagging genuine over-runs.
fitness_content_role: reference
overflow_disposition: "leave-if-live; else graduate, then archive to a dated file proven byte-identical — never before full processing, never split/shard (see continuity-practice.md §Disposition of Continuity Surfaces)"
merge_class: index-narrative-tables
---

# Repo Continuity

The canonical continuity contract for `jimcresswell.net`: where we are, what is
live, what is next. Refreshed by `session-handoff`; read at session resume.

## Current State

- **2026-10-01T19:00Z: pull request 279 landed as SHA:c6394b98; the push's remainder** (Crucible
  binds Slag, 7b999c). Before each attempt `merge-bot push` reads HEAD first and the clock last;
  its help says what it pins; its mint test pins no scope. This estate's push files are settled,
  and OCE takes them next as the same bytes (§Next Safe Steps line 4). This seat holds no open
  lane pull request here.

- **2026-10-01T18:37Z: pull request 278 landed as SHA:18ec6145; the push is one token and one
  settled commit** (Crucible binds Slag, 7b999c). `merge-bot push` here takes OCE's design and
  keeps this estate's bounded output copy: it mints once and retries GitHub's pre-hook refusal on
  3 s, 10 s and 30 s with the same token; it pushes the commit HEAD named when it began and stops
  if HEAD or the branch moves; it refuses the default branch as origin names it, and trusts no
  origin read over plain http; it starts no attempt within five minutes of the token's expiry. A
  seat whose push says the default branch cannot be read runs `git remote set-head origin --auto`
  once. The convergence's remaining steps are §Next Safe Steps line 4.

- **2026-10-01T17:37Z: arc-metrics is the same bytes in both estates** (Crucible binds Slag,
  7b999c). OCE took 277's two settlement pushes as its pull request 321 (SHA:9dae121c7). The
  topic's files differ between the estates only in three citation lines.

- **2026-10-01T17:19Z: pull request 277 landed as SHA:ce3e0296; arc-metrics counts every entry**
  (Crucible binds Slag, 7b999c). OCE's port of the tool landed there as its pull request 320
  (SHA:d6349ccb4, 16:47Z); a code review before its ready-mark found three defects that this
  estate's `main` carried too, and 277 brought the cures here as the same bytes: the line reader
  dropped every entry holding a Unicode line or paragraph separator, a named directory that does
  not exist reported no sessions, and nothing said that sub-agent transcripts are not measured.
  Copilot's review of 277 named three more, cured in its two settlement pushes (the splitter
  rescanned an unfinished line with every chunk; a missing directory was refused only after the
  directories before it were read; the threshold was checked in minutes and not seconds); OCE
  takes those on one small pull request. An arc measured here before this landing lost the
  entries that held those two characters.

- **2026-10-01T15:58Z: OCE's open work landed, and upstream is in `engraph`** (Crucible binds Slag,
  7b999c, non-resident there). In order: the coordination fold, pull request 299 (SHA:972020417);
  the three lanes, one sync each, 313 (SHA:e453ff81a), 309 (SHA:2691a8143) and 310
  (SHA:2e8892fed); and the upstream carrier, 319 (SHA:beceea25e), which brings the Oak line's
  release 1.185.6 so that `engraph` holds every upstream commit. Neither estate has an open pull
  request apart from its coordination draft (276 here, 318 there). OCE's own record carries the
  detail in its §Current State and its 2026-10-01 pickup block. Two of those landings leave work
  owed here, in §Next Safe Steps lines 3 and 4.

- **2026-10-01T14:37Z: pull request 274 folded into `main` as SHA:cb285512** (Crucible binds Slag,
  7b999c; the bot's merge through the merge door, four Copilot rounds, every finding dispositioned
  on the pull request). The folded branch is retired, local and remote. moved for the sites:
  nothing in this fold (pull request 275, the optional Turbo remote cache, landed on its own lane
  inside the window) / moved for the Practice: the first two-estate consolidation's doctrine and
  records, the nested-worktree convention's ignore rules, the continuity records trued for two
  seats, eight review cures (four over the bar).

- **2026-10-01T13:2xZ: two seats (n=2), no Director, at the owner's word** (verbatim, to Crucible
  binds Slag: "Hazel tracks Trunk (7d8b9d) is working on the dedicated conslidation, you pick up
  the other threads, fix the fold and continuation records fist. Main also needs merging into
  engraph."). Hazel tracks Trunk (7d8b9d, curator, claim 009bbaea) runs a second dedicated
  consolidation: read-only audit fleets first, every tracked write on one lane per estate cut from
  the folded default branch, nothing on a coordination branch. Crucible binds Slag (7b999c,
  implementer, claim 8e37e0d3) holds the folds, this record, the thread records other than
  `two-estate-consolidation`, the upstream sync into OCE's default branch `engraph`, and the open
  pull requests. Pull request 274 is the fold of the coordination branch cut on 2026-09-29; beside
  its records it carries the first consolidation's doctrine and two code hunks committed to that
  branch without review, each class declared in its description with the reviews it had. A
  consolidation's doctrine and any code go on their own lanes from here on (the `coordination-fold`
  skill's preconditions). The first consolidation closed on 2026-10-01 at
  11:5xZ (Hawthorn binds Bracken, b3f117); its counts and handoff are the newest blocks of
  `threads/two-estate-consolidation.next-session.md`. The order of work is §Next Safe Steps.

- **2026-09-30T17:06Z: the dedicated two-estate consolidation, at its close** (Hawthorn binds Bracken,
  b3f117, at the owner's word of 2026-09-30). `main` is at f6a26954; the coordination branch
  `coordination/2026-09-29-b6232c` carries the consolidation's twelve commits: the register drained to three
  owner-gated entries, the buffers empty (distilled, the per-user memory index, the napkin rotated),
  the six consolidation skills and the per-user-memory rule the same bytes in both estates, the five
  queued directive entries written, OCE's memory lessons homed, the comms table's section B
  homed, the comms table and the frictions register drained. OCE's
  `coordination/2026-09-29-76974c` carries the mirror in five commits. The
  live reading is `threads/two-estate-consolidation.next-session.md`, newest state block first.

- **2026-09-29T13:4xZ: the Director lane closed; one seat (n=1) takes the work on both estates**
  (Wick binds Temper, ed7b48, at the owner's word). The handoff is on the lineage: its
  `estate-coordination` thread record's journal entry "2026-09-29T13:4xZ — HANDOFF to the n=1
  seat", with the retrospective
  OCE's `.agent/reports/agentic-engineering/why-five-days-of-landings-closed-nine-stories-2026-09-29.md`.
  JC.net has no open pull request of this lane apart from its coordination draft; `main` is green
  at b6232c77. The LinkedIn agent (Galaxy binds Gravity) works in `linkedin/` and in the primary
  checkout on `main`, a separate lane by the owner's word: write JC.net records from a worktree.

The state entries from 2026-09-13 to 2026-09-28 that stood here are archived byte-identical in
`archive/repo-continuity-current-state-2026-09-13-to-2026-09-28.md`.

## Active Threads

- LinkedIn workspace (`linkedin/`, `threads/linkedin-workspace.next-session.md`): reopened on
  2026-09-28 under privacy.md's dated workspace authorisation; landed as PRs 240 (03cac8b3f,
  14:48:24Z), 252 (f0f2f1fc2), 253 (b29ef39bd), 254 (1a164ae34, the authorisation as its own
  section) and 259 (efdcc2376, the paper's author list); no editorial pass yet (the owner's word,
  13:4xZ). Further batches from the owner's Codex agent are repo content that a Practice seat
  commits and lands by the normal path (the owner's word, 2026-09-28); publishing to LinkedIn is
  a separate act on the owner's request. 2026-09-29: PR 273 (b6232c77) made the workspace
  documents only and cured `main`'s knip gate; the lane is at rest, its seat (Galaxy binds
  Gravity, 46de68) closed 2026-09-30, and the record's latest block governs.
- JC.net's exchange seat (`threads/practice-exchange-seat.next-session.md`): its seat closed with the
  Director lane on 2026-09-29; the record's latest dated block governs, and its landings list is the
  lane's proof. Its two pull requests that were still open in OCE landed on 2026-10-01 under
  Crucible binds Slag, who had adopted their claims: 309 (SHA:2691a8143) and 310 (SHA:2e8892fed).
  Its two OCE lane worktrees that hold work outside any pull request (arc-metrics, the J2
  docs-validators port) are lines 1 and 2 of §Next Safe Steps.
- Closure session 2's synthesis (`threads/session-2-synthesis.next-session.md`): the cards were
  answered 2026-09-14 (the Director's handoff item 78) and the batch graduated on 2026-10-01 (two
  entries and five slow-lane concepts homed in both estates; the register keeps one slow-lane row,
  review 2026-12-15). The
  record stays here until the second consolidation has read it for lessons without homes.
- Turbo remote cache, optional everywhere (`threads/turbo-remote-cache.next-session.md`): the
  delivery node `turbo-remote-cache-optional-and-persistent`, ratified 2026-09-30; both pull
  requests have landed, PR 275 here (SHA:f6a26954) and OCE PR 313 (SHA:e453ff81a, 2026-10-01);
  the owner's two acts for criterion 1 are still owed. The record's latest dated block governs.
- Two-estate consolidation (`threads/two-estate-consolidation.next-session.md`): the first pass
  closed on 2026-10-01 (Hawthorn binds Bracken); the second runs from 2026-10-01T13:1xZ (Hazel
  tracks Trunk) at the owner's word, JC.net the home and OCE worked non-resident; the record's
  newest state block governs and opens with the counts.

## Paused Threads

- Track B Source-of-Truth Design, Phase B2.1.
- Dev-Tooling Hygiene (dependency updates handled locally).

## Next Safe Steps

STATE, 2026-10-01T16:0xZ (Crucible binds Slag, 7b999c): the consolidation's own next steps are the
newest state block of `threads/two-estate-consolidation.next-session.md` and belong to its seat. The
order below is this seat's, from the owner's word in §Current State. The folds, OCE's three lanes
and the upstream sync that stood first in it have landed (§Current State). Under the owner's limit
on open pull requests (`director-handoff.md`, 2026-09-26: one coordination pull request per
repository, and as many others as there are implementer seats, counted across both estates) the
lines below go one pull request at a time.

1. arc-metrics is landed in both estates and nothing of it is owed in either direction (§Current
   State). Open from it, each a lane of its own:
   - Counting the sub-agent transcripts, which the vendor nests under each session: in this
     estate's directory they hold about two fifths of all model calls. A design of its own, for
     both estates.
   - A failed call's synthetic entry counts as a model call with zero usage; a zero-byte transcript
     counts as a session; unparseable lines are skipped without a count.
   - `codex-exec/cli.ts` reads its event lines through `node:readline` too, in both estates: the
     same splitting on a second reader, which is when `split-lines.ts` moves to `core/`.
2. OCE's J2 docs-validators port. A code review of its uncommitted lane work on 2026-10-01 returned
   NOT READY: it is this estate's bytes with the scope renamed, and it does not run there (the
   entry files import names OCE's core does not export, its hook policy has no lineage block, the
   scan scope is this estate's, the wiring is absent). OCE's record, §Next Safe Steps line 2,
   holds the list. The same review reproduced logic defects that this estate's source carries, a
   twinned lane after the ports: quoted and negated `--filter` values give a false
   `unknown-workspace`; a second `--filter` and a `...` suffix hide a missing workspace; a heredoc
   body is read as a command; `/bin/bash -c`, `env … bash -c` and `eval` are not read; a `~~~`
   line inside a backtick fence turns later prose into citations; a cited path keeps its `:12-20`
   line suffix. These are the reviewer's runs through the helpers, not repeated by this seat.
3. Owed here from OCE's pull request 309: the repair smoke
   (`agent-tools/smoke-tests/repo-check-repair.smoke.ts`) comes out, and `validation-strategy.md`
   takes OCE's §Validators with the owner's words of 2026-09-29, the same bytes. The consolidation
   seat is asked whether its lane touches that directive, so that one seat edits it.
4. The merge-bot converges in two steps, read first-hand on 2026-10-01 by comparing the two
   `agent-tools/src/merge-bot` trees. Each estate held what the other lacked: OCE the push as its
   pull requests 239 and 310 left it (one token on GitHub's backoff of 3 s, 10 s and 30 s, one
   settled commit, the default branch read from origin); this estate `retire`, the `--branch` check
   the two commands share, and a bounded copy of the push's output for the refusal check.
   - Step one, here, landed: pull request 278 (`SHA:18ec6145`, 18:37Z).
     This estate's push takes OCE's design and keeps the bound and the shared check. A code review
     before it opened found that OCE's rework had dropped proofs this estate's tests held (the token
     file's mode, the terminal prompt, the cleared credential arms, the wait between attempts, the
     production mint's scope); each is back with its mutant. Copilot's review then named two defects
     of the design itself, cured in settlement push one (`SHA:e0dc449d`): each attempt, the first
     included, starts only while HEAD still names the settled commit, since the pre-push hook
     validates the checkout and never the commit git is handed; and only inside the token's own
     life (R5). Settlement push two (`SHA:2c010985`) cured four more: with no `--branch`, the branch
     and the commit are one snapshot of HEAD; an origin read over plain http is not trusted; the
     bound's unit is stated; a case holds the two flags that keep the push to one ref. Its budget
     is spent and its state is in the pull request.
   - Step one's remainder, here, landed: pull request 279 (`SHA:c6394b98`, 19:00Z), the five
     items Copilot's review of 278's last tip named, each verified and below the bar (review
     5383812791). HEAD is read first and the clock last, so no read stands between the deadline
     check and the attempt; the help says what the push pins; a header's read count and the
     empty-token message are corrected. The mint test asserts nothing about the request:
     Copilot's review of 279 held, against `testing-strategy.md`, that which scope the push asks
     for is a decision, guaranteed by construction and never pinned by a test, so the assertion
     278 had brought back on a pre-open review's word is removed. **A lesson for the next port's
     tests:** a mutant that survives is a finding only when it changes behaviour at a boundary; a
     mutant that changes a decision value is the directive working.
   - **The same lesson a second time, from the test review of step two (2026-10-01):** the other
     proofs 278 put back pin decision values too (the token file's mode, the directory prefix,
     the prompt setting, the two one-ref flags, the cleared arms computed from the product's own
     table), and the guard cases 278 and 279 added answer the push's queries in sequence
     (`inOrder`, a count of HEAD reads), which `test-immediate-fails.md` item 12 forbids. Those
     tests are on this estate's `main` now. OCE's rework had dropped the pins on purpose; this
     seat read that as a loss and restored them on one reviewer's word, without reading the
     directive's §Rules against them.
   - Step two, in OCE, as two pull requests. First the push product code: its pull request 322
     (opened 19:52Z, lane `.claude/worktrees/push-converge`, claim 48c023b5). Three sub-agent
     reviews ran before it opened and changed it from a copy of this estate's bytes: plain http
     is refused in the push's own origin check and never in the shared parser, which has two
     more callers there; and the tests are re-derived against the directive, each new behaviour
     at its own seam over constant fakes. Then the `retire` action with what it needs
     (`github-fetch.ts`, the `branch-retire` row of the scope table, the wiring in `cli.ts`, its
     smokes). Until `retire` lands there every landed branch is deleted by hand after the same
     ancestry proofs. Not the whole directory: this seat wrote that here earlier and it was wrong.
   - Owed here from OCE's 322, one twin pull request once it lands: its push tests as the same
     bytes, which removes the pins and the sequence fakes above; the http refusal moved from
     `core/git-remote-url.ts` to `trustedOriginRepository` in `push-target-branch.ts`;
     `printable` on the unknown-argument echo in `push-args.ts`; the help's sentence on what the
     HEAD guard delivers; the measurement in `push-attempts.ts` worded to be true in both
     estates. One phrase of `.agent/reference/merge-bot.md` ("streams to stderr in full" becomes
     "reaches": the command's stderr is buffered until the run ends) sits in the consolidation
     seat's area.
   - Routed from 322's security review, one lane for both estates, each confirmed by probe on
     OCE's lane, whose `push-git.ts` is this estate's bytes. Over the bar: the `insteadOf` rewrite in the last bullet of this
     line is now tested and real (with `pushInsteadOf` as well, the push goes over ssh as the
     signed-in human; the cure is a fifth token-free read before the mint); an ambient
     `GIT_TRACE_REDACT=0` with `GIT_TRACE_CURL=1` prints the credential on stderr (the cure
     unsets `GIT_TRACE_REDACT` in `pushEnv`). Under the bar: a git-legal `--branch` value holding
     C1 or format characters is echoed raw; `REFUSED_FLAGS[flag]` is a plain-object lookup in
     both `push-args.ts` and `retire-args.ts`; `Date.parse` reads lenient forms of the expiry;
     `AttemptGuards` holds the whole token where the deadline alone is used. OCE's record
     (§Next Safe Steps line 4 there) holds the full list.
   - Routed from 322's test review, one lane for both estates: `push-args.unit.test.ts` asks the
     real git binary in five cases; the token file's mode, its location, the submodule flag and
     the prompt setting have no proof against a real filesystem or git, and the push smoke's
     live leg can give one.
   - The merge action is its own convergence, read 2026-10-01 by comparing the trees with the
     scope made the same. It has diverged in both directions. OCE has `--unavailable`
     declarations (`pr-watch/declared-unavailable.ts`), the `SETTLING-QUIET-WINDOW` verdict and
     two tests this estate lacks (`merge-cli-unavailable`, `resolve-app-slug`); this estate has
     one `realFetch` and one header builder (`github-fetch.ts`) where OCE has a copy in each of
     two modules, and prints a verdict's grounds through `printable`. The scope table differs by
     design: the upstream-mirror row is OCE's, and `branch-retire` reaches it with step two.
   - Routed from the reviews, each its own lane: the operator profile's keys and `retire`'s origin
     check move to `core/git-remote-url.ts` (`retire` binds the raw URL and the push the rewritten
     one, so the move changes what `retire` binds); a `url.<base>.insteadOf` that rewrites
     `https://github.com/` to ssh would, by the reviewer's reading (not tested), carry the push as
     the signed-in human; OCE scopes its push secret scan by the destination's URL and this estate
     does not; a smoke against real git that proves no submodule ref is pushed under
     `push.recurseSubmodules=on-demand` (a case holds the flag on the command line; the smoke needs
     a second repository in its fixture, and belongs with the lane that turns the agent-tools
     smokes into tests).
5. Two files inside the consolidation seat's claimed areas changed on `main` with pull request
   278, each bound to the code it describes: `.agent/reference/merge-bot.md` (the front-door push
   section) and one line of the `cross-fork-integration` skill (the push's git argv). The seat was
   told on the stream before 278 opened and at its landing; no answer by this writing. Its
   question from this seat also stands unanswered: whether its lane touches
   `.agent/directives/validation-strategy.md`, which gates line 3's directive hunks.
6. Owner acts owed, for the turbo node's first criterion: the Vercel OIDC policy covering this
   repository, and the `TURBO_TEAM` repository variable (`threads/turbo-remote-cache.next-session.md`
   carries the policy's terms and the command). Read 2026-10-01: the variable is absent, and the
   run on `main` at SHA:cb285512 skipped the cache step and posted the notice.
7. Not assigned to a seat: the capability-parity code lanes (the exchange register's rows L7 and L8,
   OCE's commit queue here, the agent-tools smoke suites as tests with no IO, the divergence measure
   as a command). The consolidation seat keeps the inventory and the homing of knowledge; the code
   lanes wait on the owner's routing.

Tool frictions met on 2026-10-01, each first-hand, for the lane that takes them:

- `claims close` requires `--now`, where the agent-tools README says `--now` defaults to the wall
  clock (verified in OCE's build); the same class as `comms direct` and `comms reply` below.
- The Bash hook policy refused a compound command as a force push when it held `gh api graphql -f`,
  the word "push" in a pull request title and "git" in prose: the matcher reads across the whole
  command string. Text in files and `-F query=@file` avoid it; the matcher is the thing to cure.
- The `coordination-fold` skill's step-9 block writes `"+refs/heads/$FOLDED:refs/..."`; under zsh
  `$FOLDED:r` is a history modifier and the refspec is mangled. `${FOLDED}` cures it, in both
  estates' copies.
- The Codex connector signals a review with no finding by a thumbs-up reaction on the pull request,
  not by a review or a comment (its own text: "otherwise it will react with 👍"). On 2026-10-01 it
  reacted within about three minutes of each head this seat pushed to OCE 299, 313, 309 and 310,
  and posted a review only on 319, where it had a finding. This seat read the silence as absence
  and wrote "unavailable" on three landing premises, each corrected on its pull request. The merge
  door's leg computation reads reviews and does not read the reaction, so a head on which the
  connector found nothing cannot settle that leg through the door: read the pull request's
  reactions before calling the connector absent, and the door's reading of the reaction is a
  tooling lane for both estates.
- A seat resident in a lane worktree cannot run the skills' bot-write recipe as written: the
  isolation guard refuses `GH_TOKEN="$(… mint-token …)" gh …` and the two-step `token=$(…)` form
  as runtime values it cannot verify. On pull request 277 every bot write went through a scratch
  wrapper that takes the scope first and the `gh` arguments after it, mints the token and runs
  `gh` with it. That wrapper belongs in agent-tools as a `merge-bot gh` action, for both estates.
- The same guard refuses any compound command that names git; a resident seat stages, commits
  and reads the log as three plain commands.

The items below are still open from the 2026-09-16 snapshot, each verified in the tree on
2026-09-30; the snapshot itself, with its later state notes, is archived byte-identical in
`archive/repo-continuity-next-safe-steps-snapshot-2026-09-16.md`.

- From the first-hand review of the code that rode pull request 274 (2026-10-01; no defect in the
  hunks, three findings routed here, one small lane each or together where they share a story):
  - Turbo's `globalDependencies` glob `**/.env.*local` (`turbo.json`) is a filesystem walk that
    enters dot-directories, so a lane's `.env.local` under `.claude/worktrees/` joins the root
    global hash (the reviewer's reading of the dry run; the lane-path match itself is unobserved
    until a lane carrying the file exists). Anchor the glob by depth, prove it with the dry run,
    and re-true the coverage sentence in `worktree-residency`, the same claim in `worktree-hygiene`
    §0 and in the `set-up-worktree-lane` skill ("every root check tool ignores it", which the
    pull request's Copilot review also raised), and the quotation in
    `docs/engineering/build-system.md`; the sentence also omits knip and the depcruise tsconfig.
    OCE's `turbo.json` carries the same glob, so the lane is twinned.
  - The context-window registry's comment for `claude-fable-5-1` cites 252,933 tokens, which
    supports "more than 252,933" only; this model's turns reach 966,550 uncompacted (session
    c39ad7fe, 2026-09-13T23:43Z, read first-hand), which carries the one-million row. Replace the
    evidence in the comment.
  - `session-metadata` prints a reading above 100 % as `degraded` with exit 0, which is how a
    too-small registry row presents without being named; the reading names a refuted row instead.
- From the Copilot review of pull request 274, routed to the second consolidation, whose seat holds
  the divergence measure: clause 3 of `cross-estate-work-must-reduce-divergence` closes an activity
  "only when both numbers are below the baseline", which cannot be met from a baseline of zero and
  refuses a close where one number falls and the other holds level. Both numbers are far from zero
  today (147 files, 7,142 lines); the wording is decided with the measure, in both estates.
  The review's third round (on SHA:4965e6e6, after the settlement budget was spent) adds five,
  each verified first-hand and each in text shared with OCE:
  - The same rule's baseline (clause 1) names every shared path under `.agent/` and the shared
    engineering docs, while the measuring script defaults to six `.agent` subtrees and two docs
    and reads Markdown only, so the quoted numbers measure less than the rule declares.
  - `stage-by-explicit-pathspec`'s computed staging list reads `git diff --name-only`, which
    omits new files; the row says nothing of them.
  - `.agent/reference/tooling.md` installs the Playwright browser from the primary checkout,
    while the `set-up-worktree-lane` skill runs the same install scoped to the lane.
  - The pattern `cli-writer-boundary-discipline` says the three protections "live in one writer
    module the CLIs share"; `collaboration-state/atomic-file.ts` carries no `lstat` or no-follow
    seam (the no-follow reads are in `core/no-follow-read.ts` and `core/flag-path-resolve.ts`),
    so the sentence names a shape the shared writer does not yet have.
  - The pattern `prove-the-checker-with-a-negative-control` says the visual-regression harness
    README records the negative-control recipe; the README describes the harness's own use of
    `git archive` and no such recipe.
  OCE's second round adds one: `pr-lifecycle` §Phase 7's landing-slot bullet says every push
  opens a fresh review round, where OCE's state machine says a pure sync opens none and this
  estate's copy lacks that text.
  The fourth round (on SHA:2a83df18) adds three, routed in signed lines on the pull request:
  - `use-monitor-for-event-driven-wake` binds every wait to a Monitor under the owner's word of
    2026-09-29, while its own exclusions keep a one-shot wait on a background command; the
    owner's word governs and the rule's wording is settled around it.
  - `worktree-hygiene` §6 says every remote branch is in a pull request or deleted, while its
    earlier paragraph exempts the default branch and an upstream mirror.
  - `start-right-team` caps concurrent fix lanes at about three and then says a lane finishes
    before the next starts, without saying the second clause is per seat.
- From the same review's second round, one small tooling lane for both estates: `comms direct` and
  `comms reply` require `--active` and `--comms-dir` where `comms send` derives them from the
  coordination home (`commsSendDefaults`); wire the same defaults into the directed commands. The
  agent-tools README now says which commands derive them.
- JC.net's commit hook does not run the whole-tree gate that OCE's does (OCE writes
  `.turbo/last-gate.log`; here the gate runs at the push). The `session-handoff` skill now says so
  for each estate. Bringing the commit-time gate here is the ratified delivery node
  `commit-as-the-full-local-gate` (2026-09-24), which no seat holds; it sits with the parity lanes
  in line 6.
- The `minimumReleaseAgeExclude` block in `pnpm-workspace.yaml` has been dead config since 2026-09-17
  and is still present: delete it.
- The three hand-authored hook shims under `.claude/hooks/` (`practice-session-identity.mjs`,
  `plan-gate-drift-alert.mjs`, `run-pretooluse-guard.mjs`) are still present; each gets a first-hand
  fire and no-fire probe before its shim is deleted (the snapshot's maintenance item 2).
- The Cricket seat adapters are still named by effort alone (`cricket-judgement-low`, `-medium`,
  `-high`, `cricket-procedure-xhigh`) while model power pairs inversely with effort; the rename lives
  in the two templates under `.agent/sub-agents/templates/` and regenerates with `pnpm portability:fix`.
- The `practice-language-separation` node is a sketch awaiting the owner's cards.
- The ESLint 10 hold for the site waits on `eslint-plugin-react`; an assumptions-expert review of
  source-run hooks comes before any `PreCompact` gate is built.
- Editorial work follows on the owner's word; nothing on the Practice side blocks it.

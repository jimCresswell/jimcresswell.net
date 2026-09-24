# Wide review fleet harvest — 2026-09-21, the exchange seat (Brazier spins Temper, c70341)

Owner-invoked (~16:20Z): "run a collection of reviewers and Crickets with a wide variety of
perspectives and approaches and intentions, use Opus for individuals and Sonnet with Opus
overseers for swarms". Plan of record, with the three design-review verdicts:
[wide-review-fleet-plan-2026-09-21.md](wide-review-fleet-plan-2026-09-21.md). Owner's answers at
planning: direction first; Crickets on their registered models, every other individual on Opus.

Status at the compaction boundary (16:57Z): Wave 0, Wave 1a and Wave 1b complete, every leg
delivered; the merge-audit swarm's recall PILOT ran and passed; the FULL swarm did not launch
(the owner called the compaction; and the pilot's measured cost is three times the estimate, so
the plan's abort rule says shrink first). Swarm B (register rows) is SKIPPED on the direction
result: the register should be re-scoped to the merge residue, so auditing every row is
misdirected. This file is the conserved harvest: the legs' returns lived only in session context.

## Tally (tokens are each leg's total from the harness; runtime wall-clock)

| Leg | Role / type | Model | Stance or intention | Headline | Tokens | Runtime |
| --- | --- | --- | --- | --- | --- | --- |
| Design review 1 | Plan | session | proportionality | REVISE | 81k | 269 s |
| Design review 2 | Plan | session | frame challenger | REVISE, two severity 4 | 77k | 186 s |
| Design review 3 | Plan | session | mechanics and objects | REVISE, three severity 4 | 92k | 279 s |
| Wave 0 cold structural | general-purpose | opus | anchor-free, git only | extraction ranked first; per-file landing cannot converge | 100k | 430 s |
| Wave 0 fact-recompute | general-purpose | opus | re-derive every fact | 237 of 237 merge classifications reproduce; 11 wrong facts in bodies and records (one of the 11 rejected) | 180k | 591 s |
| Onboarding (ANCHORED) | onboarding-expert | opus | cold resume | RESUMABLE WITH GAPS; resume surfaces stale | 53k | 110 s |
| Cricket frame A | cricket-judgement-medium | opus (registered) | normal | DRIFTING | 29k | 25 s |
| Cricket frame A | cricket-judgement-high | sonnet (registered) | adversarial | DRIFTING | 34k | 75 s |
| Cricket frame B | cricket-judgement-low | fable (registered) | normal | ON-TRACK | 28k | 22 s |
| Cricket frame B | cricket-procedure-xhigh | haiku (registered) | adversarial | ON-TRACK | 29k | 123 s |
| Cricket frame C | cricket-judgement-lowestpower-low | haiku (registered) | normal | WRONG-PRIORITY | 24k | 54 s |
| Cricket frame C | cricket-judgement-medium | opus (registered) | adversarial | WRONG-PRIORITY | 28k | 18 s |
| assumptions-expert | assumptions-expert | opus | refute the warrants | SOUND BUT OVERBUILT | 53k | 110 s |
| Wilma | architecture-expert-wilma | opus | compare candidates | per-file three-way merge, batched by area | 56k | 180 s |
| architecture-expert | architecture-expert | opus | find the seams | extraction: two severity-4 couplings | 73k | 148 s |
| owner-and-product | general-purpose | opus | account, git only | zero product lines; 100 review submissions | 81k | 127 s |
| pre-mortem | general-purpose | opus | divergent | caught a stale premise; "do nothing" fails first | 72k | 122 s |
| conserving | general-purpose | opus | what to keep | seven practices evidenced; three praised ones not | 97k | 104 s |
| code-expert | code-expert | opus | refusal table | disposition cells and Landings table unvalidated | 99k | 217 s |
| security-expert | security-expert | opus | attack | removed floors: BROKEN (markdown-it) | 83k | 271 s |
| Fred | architecture-expert-fred | opus | what breaks next month | GO WITH CONDITIONS on PR 143 | 96k | 326 s |
| docs-adr-expert | docs-adr-expert | opus | recorded wrongly | two doctrine decisions unhomed; six lineage-text items | 110k | 283 s |
| test-expert | test-expert | opus | what lands first | directive first, with a recovery plan | 66k | 120 s |
| Swarm A recall pilot | 1 sonnet worker + 1 opus overseer | sonnet, opus | Workflow `wf_57c82680-b09` | PASSED: both planted defects found, one new | 158k | 174 s |

Total about 1.8M tokens. Model check: the pilot reviewer's run record shows `claude-opus-5`, the
haiku-pinned Cricket's shows `claude-haiku-4-5`. No leg died; no leg acted outside read-only.
Panel shape note: open-ended Cricket frames with a mandatory verification Read returned two
DRIFTING, two WRONG-PRIORITY and two ON-TRACK; the same panel on seat-authored closed frames at
15:17Z returned four ON-TRACK. The frame, not the model, carried the signal.

## What the seat did with it before the boundary (each verified first-hand)

- CURED: the resume surfaces (onboarding leg, severity 4): handoff current-state block and
  repo-continuity rewritten at the true tip, item 120 added, the fleet plan copied into this tier
  (`SHA: 0d869e3d`).
- CURED on a pushed branch, pull request NOT yet opened (the successor's first act): PR 143 regressed `markdown-it` from the patched 14.3.2 to 15.0.1,
  inside the second vulnerable range of GHSA-r7fv-28h4-cvq7 (15.0.0 to below 15.0.2), invisible to
  every audit gate (security leg; ranges confirmed from the advisory API). Floor restored as
  `>=15.0.2 <16`, lockfile resolves 15.0.2, gate green, branch `fix/markdown-it-15-security-floor`
  at `SHA: c8aae634`. The rollup override's unreachable removal condition (Fred) repaired in the
  same change.
- ANSWERED, left open on purpose: Codex's P1 on merged PR 138 ("Reject Basic authorization
  credentials") was recorded by this seat as cured and resolved; it was neither. The landed guard
  matches the Bearer scheme only. Replied truthfully on the thread; the structural cure is the
  lineage's credential engine over an injected vocabulary (its #174), twinned when it lands; the
  lineage's seat told natively.
- REJECTED with proof: the fact-recompute leg's "PDR-011 cites ADR-150 six times, not seven". It
  read the records commit, which predates PR 145; main and the lineage head both carry seven.
  Even the fact checker met the wrong-object class.
- VERIFIED and material: castr's seat closed all thirteen of castr's open pull requests UNMERGED
  at 16:20Z. The seat's 15:42Z read (thirteen open) went into six briefs twenty minutes stale; the
  pre-mortem leg caught it. The owner's ruling 5 chose castr's enabling subset "by the open castr
  pull requests' blockers"; that input no longer exists.
- EMPIRICAL, by the seat: fifteen mutated registers through `validate-exchange-register`; nine
  refused, SIX PASSED SILENTLY (a disposition word outside the vocabulary; and in the Landings
  table a garbage SHA, a row id that does not exist, an unknown estate, a duplicate row, a landing
  for a row whose cell says decline). The code-expert leg, not handed these results, found both
  classes independently and more. Results: session scratch `mutation-results.tsv`; harness
  `mutation-run.py` (rebuildable from this description).

## Direction (judgement-class: the owner reads these as written; the seat's response beside each)

1. Cold structural leg, from raw git only. Measurements: the decision-record kernel is 142 files on
   each side with identical path sets, 133 byte-identical; practice-core 92% identical; rules 0 of
   111 identical solely because every rule here carries a frontmatter block (27 identical once
   stripped); skills 75% identical; agent-tools 47%; this estate renders 528 host-adapter files from
   templates; the two repositories share NO git history (the copy point is not an object here);
   the lineage moved 401 Practice files in nine days; the day's merges moved byte-identical shared
   blobs from 745 to 754. Ranking: (1) extract the Practice as a versioned package with a per-host
   overlay; (2) one-way publish of the Core from the lineage at a recorded pin; (3) per-file
   three-way merge, "arithmetically dead" at a 40:1 arrival-to-landing rate; (4) whole-tree merge;
   (5) register-tracked hand landings, "worth one day as instrumentation, not as a standing
   structure"; (6) do nothing, refuted by castr as the control. "Doctrine copies; code does not":
   the operator-profile landing took the record and schema byte-identical while 15 of 16
   implementation modules diverged in the same change.
   Seat's response: the measurements stand. The 40:1 rate assumes eight files per pull request;
   the merge trial shows 54 files mergeable in one change, which weakens rank 3's dismissal but not
   the ranking's direction.
2. architecture-expert, on what extraction cuts through. Severity 4: `agent-tools` is private with
   no `bin`, `exports` or `files`, about sixty scripts shaped `cd .. && pnpm exec tsx agent-tools/src/…`,
   and four private workspace dependencies; five packages must become publishable before a line of
   doctrine moves. Severity 4: the validators take the host's tracked git tree as their universe,
   so doctrine shipped under `node_modules` would be outside its own link and citation checks;
   shipping it as materialised host files makes the thing a scaffolding tool, not a dependency.
   Also: repo-root resolution hard-codes a pnpm sentinel and a Claude variable; hook wiring
   hard-codes the package's place in the host tree; 55 of 131 rules cite host paths or scripts.
   Cheapest experiment (one to two days, reversible, no doctrine edits): make the five packages
   publishable, replace the `cd ..` prefix with an overlay-supplied root, pack, install into ONE
   sibling repository, run three legs (portability, subagents, docs validators), and measure how
   many of the 23 validator families run and how many overlay files that took. Extraction is the
   wrong idea if the overlay exceeds about 150 files or more than about 55 rules need per-host
   variants, or if sibling drift is concentrated in host records rather than Core, rules, skills.
3. Wilma: choose the per-file three-way merge with the copy point as base, batched by area. Body
   replacement is unsafe in the Core, proven: this estate's PDR-027 carries its own 2026-09-12
   amendment and a renamed identity variable that a replacement would silently undo. A whole-tree
   merge imports 17 lineage-only host rules. Package plus overlay is "premature, not wrong": 46 of
   111 rules diverge mechanically (frontmatter), 43 by hand-written host de-binding. Wilma switches
   to the package the day the divergence is GENERATED (a sidecar for frontmatter and a declared
   glossary for host bindings, no hand-edited prose left). On PDR-105: 78 citations in 19 of 142
   records, every one a bare prose identifier and none a link, so the predicted harm (a dangling
   link) did not occur; the live hazard is future mis-resolution, since this estate's own
   architecture records number 001 to 023 and will one day reach the lineage's numbers.
4. assumptions-expert: SOUND BUT OVERBUILT. The concept row is the right unit (a merge cannot
   record a decline or choose the higher of two encodings); the landing apparatus is overbuilt.
   The validator recomputes coverage of the delta by rows and "never the landings table", so its
   green attests bookkeeping, not that anything landed. Row C15's `**` catch-all makes the
   completeness proof vacuous for one list. "The next exchange is a session, not a project" does
   not follow: the register, its globs and counts are pinned to this window's heads and rebuilt
   next time. castr's column cannot close inside this register's life. Cheapest change: re-scope
   the register's input from the delta to the MERGE RESIDUE: run the three-way merge first, land
   the clean paths as one pull request, and require rows only for what the merge does not settle
   (conflict, compare, decline, card). About a quarter of the rows and pull requests.
5. Crickets. Frame A (what next), normal: DRIFTING, "cure the six silent passes now … then go
   straight to the concept manifest with the lineage's seat. Do not resume the slices."
   Adversarial: DRIFTING, use the lineage seat's restored contact to settle concepts versus bytes
   before any more file churn; it flagged that the seat's frame left the direction of the merge
   trial unstated. Frame C (the default continuation), normal: WRONG-PRIORITY; adversarial:
   WRONG-PRIORITY, "do not open slice three … land the 38 clean-merge files as one merge with a
   per-file audit rather than five PRs". Frame B (castr), normal: ON-TRACK, favours the minimum
   enabling subset delivered as a concept manifest that castr's own seat authors, next action to
   measure castr's blockers through the GitHub API and ask the owner for a channel to castr's
   seat; adversarial: ON-TRACK. Both frame B legs judged on the stale thirteen-open-PRs fact.
   Seat's caution: the lineage's "bytes should not travel" was said about outbound CODE refused by
   its gates; four legs extended it to inbound doctrine text.
6. owner-and-product leg: 100 review submissions across the ten merged pull requests (137: 32;
   138: 36), none an approval state; 0 of 14,869 changed lines in product source; in the thirty
   days before, 3 of 79 merges touched visitor-facing directories and they net to a file move and
   plus or minus three lines; the last substantive visitor-facing merge was PR 36 on 2026-08-12.
   "The Practice is the product; the website is a dormant dependency." "The day is typical, not an
   outlier." 48 of the 100 reviews are authored under the owner's identity, indistinguishable in
   git from owner judgement. It would change its mind on a backlog showing the site is
   deliberately frozen. Seat's response: true as measured; whether it is on-plan is the owner's.
7. pre-mortem leg. Minimum Practice fails because the instruments are about 1% of the Practice by
   mass and depend by reference on the rest (hedge: run the lineage's validators read-only against
   castr's tree and count unresolvable references; one afternoon prices the option). Full
   re-transplant fails because it inverts a product repository's mass and castr's Practice is a
   live lineage, 628 Practice commits since June (hedge: a merge-tree of the shared rule, skill
   and template set onto castr, counting conflicts, before committing). Extraction fails on an
   open-ended prerequisite against a source moving about 23 files a day (hedge: write the
   portable/per-estate boundary as a list this week and ask the lineage to falsify it). Doing
   nothing was the EASIEST failure to write because it is the measured present extrapolated. Hedge
   worth buying whatever is chosen: a weekly scripted divergence count over the three trees with
   the direction of authorship.
8. conserving leg: keep exactly as they are: the compound read at every wake; exit codes read in
   band with the pre-push gate as an independent layer; the three-way merge over the pin; proof as
   the named field read at the moment (a login, never a count); small single-row byte-identical
   pull requests with ratified text never edited to satisfy a reviewer; gate shape treated as
   design input with no suppression all day; the fleet design reviewed before the fleet ran.
   Praised but NOT evidenced that day: Cricket on seat-authored frames; "cure every finding in the
   last push's slot" read per finding; the register validator (every defect it surfaced was in
   itself). Valuable by accident and unnamed: a vendor outage forced a declared, auditable
   substitute review leg; gate discovery happens at `origin/main`, not the primary checkout; a hook
   false positive taught keeping file content out of command lines.

## Artefact findings, by home

Cure here, not yet done (successor):

- `validate-exchange-register` (code-expert, security, assumptions, the mutation run). The three
  disposition cells and the whole Landings and owner-word tables are outside both the grammar and
  the fingerprint; a concept table vanishes silently if its separator line is deleted or its first
  header is not `Row`; pins' origin, ancestor and head are never bound to the lists; rows with no
  globs share one fingerprint (J11 and C14); markers are honoured only in the last cell and
  `(catch-all)` is a substring test; reads and the `--write-counts` write follow symlinks; an empty
  delta list parses as valid; the unit suite ASSERTS the Landings skip as intended behaviour. One
  structural change closes the largest class: parse every table into a typed row record (a closed
  union of dispositions generated from the vocabulary section), fingerprint the whole record, and
  keep a table registry where an unmatched table is a refusal. Weigh this against finding 4 above
  before spending on it: re-scoping the register may remove most of what it guards.
- Frozen PRs 147 and 148: eight Copilot findings unworked (seven against lineage text; one stale
  line count: 147's body says 278 added and six removed, GitHub says 274 and 4). The pre-scan and
  the pilot add: a lineage product word in `scope-from-goal-before-approach` (in 148), Claude-only
  mechanics in `worktree-hygiene` (in 148), and in 147 a lineage worked example that says "the
  repository's Express MCP server". The three-way merge keeps this estate's bindings but the
  lineage's ADDED lines carry new host facts: every merged file needs a host-fit read.
- PR 143 follow-ups (Fred): the site package's ESLint 9 hold has no machine backstop and no
  upstream exit (eslint-plugin-react's `next` tag is a mis-tagged 2014 artefact); add a holds
  validator asserting the site's declared range stays within 9 AND that the resolved plugin's peer
  range still excludes 10, so the check announces the exit the day it opens. `commander` 15's only
  importer is the site's visual-regression harness CLI, which CI never runs; coverage moved a
  major and CI never runs it; a second jsdom stays resolved for six importers.
- Records (docs-adr, fact-recompute): the generalisations table holds four rows that are landing
  logs, not generalisations; its header says rows are never edited and two were; its row on the
  changelog claims it names no host pull request while lines 22 and 25 do; "dated union" overstates
  a prepend over an identical tail; the Workflow note is cited by nothing and `.agent/README.md`
  still describes that directory as cloud scripts only. Two decisions of the day have no permanent
  home: the method change to a three-way merge from the pin, and merge premises under a vendor
  reviewer's absence. Wrong facts to correct by appended note: PR 138's body test count (57; 43
  unit and 95 in all at its head); "three of them major versions" (four); PR 137 "24 threads" (21
  threads plus 3 body items); "four days over the 24-hour rule" (three); the profile sync time
  (12:34Z in the handoff, 12:35Z in the napkin); PR 148's hunk counts stated in reverse order.
- Testing doctrine (test-expert): this estate's directive carries the OLD carve-outs; the
  lineage's carries the absolute no-IO invariant. Landing the conflicting rule hunks first would
  cite the directive for a claim it refutes. 46 of 417 in-process test files here use the shapes
  the invariant forbids and they prove the boundary itself (git executor stdio, worktree state,
  adapter projection, the spawn-topology contract, the built-site server). Order: amend the
  directive together with a recovery plan naming the 46, then the rule hunks; take nothing of the
  lineage's `no-warning-toleration` hunk (its CodeQL exclusion has no ground here).

Route to the lineage (its text, byte-identical here): PDR-141 decision 3 names the lineage's own
scope key "for this line"; PDR-026 cites two ephemeral lineage files; PDR-117 quotes a lineage
pull-request number and its status is still Proposed while its clauses bind; PDR-011's amendment
log is not newest-first; PDR-026 amendments carry session and model strings; PDR-105's 78 prose
citations and the mis-resolution hazard; the seven Copilot findings on the merged rules. The
lineage's seat has taken the PDR-117 wording and the PDR-105 lane onto the owner's decision list.

## For the owner (owner-only decisions the harvest sharpened)

1. castr. The input to ruling 5 is gone: castr's seat closed its thirteen pull requests unmerged
   at 16:20Z. The harvest's common ground: do NOT start a full re-transplant on present evidence;
   the pre-mortem's cheap hedges price each option within a week; the receiver's view from the
   lineage is concepts with falsifiers and proofs, landed by the receiving seat's own authoring;
   this seat has no channel to castr's seat.
2. The exchange's structure. Three independent legs (cold structural, assumptions, two Crickets)
   say the per-file, per-pull-request landing should not continue as the default; Wilma says keep
   the three-way merge but batch it. The reconciling move several legs reached separately: land
   the clean merges in ONE change with a per-file host-fit audit, and keep register rows only for
   what a merge cannot settle.
3. Does the owner's no-IO word of 2026-09-14 and 2026-09-15 bind this estate, or is it
   lineage-local until ratified here? It decides whether 46 test files are a precondition or a
   recorded debt.
4. Is the site deliberately frozen while the Practice is the deliverable? The owner-and-product
   leg's finding is only a labelling problem if so.

## The swarm's state when the fleet stopped

The script and the full run's static batches (12 batches: five single large files, seven batches
of seven, with the mechanical pre-scan attached per unit) lived in one session's workflows
directory and scratch, which no other session can read; they are not preserved, and a resumption
rebuilds both from the method stated here and in the plan. Pilot: 7 units, 2 agents, 158k tokens, no errors; both
planted defects FOUND and spot-verified by the overseer; `absent_citation` came back
COULD_NOT_CHECK on three of seven units because workers cannot list directories: resolve
citations in the seat's script and hand the result in. Before a full launch: shrink the worker
payload (diff-first, merged file only on demand) and re-pilot; the measured line is about 80k per
worker, three times the plan's estimate.

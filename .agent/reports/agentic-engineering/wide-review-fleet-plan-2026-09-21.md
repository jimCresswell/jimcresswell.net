# Wide review fleet: direction first, artefacts second, swarms gated

Revision 2, 2026-09-21. Revision 1 was reviewed by three design legs (proportionality, frame
challenger, mechanics); all three returned REVISE. This revision cures every severity 3 and 4
finding; §Design review verdicts lists them with what changed.

## Context

Owner's word, 2026-09-21 ~16:20Z: "run a collection of reviewers and Crickets with a wide variety
of perspectives and approaches and intentions, use Opus for individuals and Sonnet with Opus
overseers for swarms", with metacognition, free-play, concept-exploration and plan invoked.

Today the seat (Brazier spins Temper, c70341; alone on this estate; Codex out) merged ten pull
requests (137 to 146), has two open (147, 148), and answered the owner's reopened castr question
on its own judgement. The day's range touches 82 files: 34 in agent-tools, 34 in `.agent`, 14
config or docs, none of them product. The owner asked a right-work question three times in two
hours (the compaction reflections, the Cricket suite, the castr fork) and never asked whether the
artefacts are correct. So the fleet's weight goes on direction; artefact review is narrower; the
swarms run only if the direction result leaves their subject standing.

No brief carries the seat's diagnosis of its own day, its answer on castr, or its preferred
method names. Briefs carry measured facts and an open question.

The lineage's seat (Zephyr guards Leeward) is, at the owner's word, designing its own wide fleet
over the operator-profile module on BOTH estates. This fleet therefore leaves that module out
and takes the lineage fleet's decisions as concepts.

## Objects: SHAs only, read with `git show`, never an opened file or a branch name

Local `main` is 320 commits stale; the primary working tree (coordination branch) lacks PRs 143
to 146; the lineage and castr checkouts on this machine are OTHER seats' dirty trees.

| Subject | How a leg reads it |
| --- | --- |
| Landed code, config, CI, PDRs, changelog | `git show e84da52682:<path>`; `git diff c68f831c6a e84da52682 -- <path>` |
| Continuity records (napkin, handoff, register, generalisations, exchange plan) | `git show <coordination SHA>:<path>`, re-pinned after the napkin's uncommitted lines are committed (step 1) |
| PR 147, PR 148 rules | `git show ffb399f9:<path>`, `git show 17a648cc:<path>`; both heads FROZEN until swarm A returns or is skipped |
| Lineage | `git -C <the lineage checkout> show 272910f1df:<path>` (pin `e477e62f7e`); the absolute path goes in the launch record and each brief |
| castr | `git -C <the castr checkout> show d1fe56b928:<path>` (its main of today, from the pins file) |
| Merge trial units | absolute per-file paths passed in `args` with the original repo path beside each (skill units are dotfiles; a directory listing shows nothing) |

The governing fleet rule is `origin/main`'s version (PR 147 modifies it and is unmerged).
Crickets have `tools: Read` only, so their frames are inlined whole.

## Wave 0: anchor-free, Opus, two legs (general-purpose, `model: "opus"`)

1. **Cold structural leg.** Forbidden: `.agent/memory/**`, the handoff, the exchange plan, the
   register, the generalisations table, PR bodies, the scratchpad, this plan. Permitted: `git log`,
   `git diff`, `git show` at the pinned SHAs across the three repositories. Question: what is the
   cheapest structure that keeps three copies of one Practice current, and what did the commits of
   2026-09-21 buy toward it?
2. **Fact-recompute leg.** Re-derive every count, SHA and time stated in the day's PR bodies and
   records (the seat exports PR bodies to files first), and recompute the three-way merge
   classification for the 111 rules and 126 skills from raw git with its own loop; report every
   mismatch with the seat's `l11-merge.tsv` and `l11-merge-skills.tsv`.

## Wave 1a: direction, Opus

Owner's answers at planning (recorded 2026-09-21T16:38Z, clock read): the subject is DIRECTION FIRST as designed here;
the Crickets run on their REGISTERED models (Fable, Opus, Sonnet, two Haiku seats), every other
individual leg on Opus. So no `model` override on Cricket calls; the pilot checks one Cricket's
run record shows its registered model and one reviewer's shows Opus.

Crickets: the five registered roles across three frames by two stances, six legs; each
frame states the situation and leaves the option set OPEN (stopping, product work, waiting for
Codex, handing to castr's seat are all admissible); each leg must spend one verification Read;
the seat's 15:40Z castr answer is withheld. Frames: A what should this seat do next; B castr's
future; C what the day bought and at what review cost.

| Leg | Question (neutral) | Intention |
| --- | --- | --- |
| assumptions-expert | Is a register with per-file landing the right exchange structure; which warrants in the exchange plan fail | refute |
| architecture-expert-wilma | How should post-pin lineage text reach this estate's rules and skills: body replacement, per-file merge from the pin, whole-tree merge, package install, do not bring. Also: measure ADR citations in PDRs against PDR-105 (grep table handed; 79 on `e84da52682`) | compare candidates |
| architecture-expert | What would an installable Practice package cut through in agent-tools and `.agent` | find the seams |
| owner-and-product leg (general-purpose) | From git only: what did ten merges buy the owner and the two sites; product versus Practice share | account |
| pre-mortem leg (general-purpose) | It is December; each castr option in turn has failed; why | divergent |
| conserving leg (general-purpose) | What worked today and should be kept exactly as it is | conserve |
| onboarding-expert (labelled ANCHORED: reads the seat's records) | Could a new seat resume from the handoff and napkin alone | cold resume |

Receivers' views: Zephyr was asked natively at 16:26Z what it would want from an outbound bundle
and whether it would rather receive a package; its answer joins the harvest when it is released
from plan mode. castr's seat has no channel known to this seat; recorded as unexamined unless the
owner names one.

## Wave 1b: artefacts, Opus, narrowed (operator-profile left to the lineage's fleet)

| Leg | Subject | Intention |
| --- | --- | --- |
| code-expert (types folded in) | the exchange-register validator | write the refusal table; find silent passes |
| security-expert | the four removed security floors, the action SHA pins, the validator's read boundary | attack |
| architecture-expert-fred (config folded in) | deps upgrade, overrides, the site package's ESLint 9 hold, action pins | what breaks next month |
| docs-adr-expert | the PDR brings, the changelog union, the register and generalisations as records | what is recorded wrongly |
| test-expert | only the forward question: the lineage's no-IO invariant against this estate's test doctrine (L11's conflict hunks) | decide what must land first |

Empirical step, by the seat (reviewer roles cannot write): run `validate-exchange-register`
against a set of mutated registers in a scratch copy and record which mutations pass silently.

Cut from revision 1: type-expert, config-expert, release-readiness-expert, prose-expert (replaced
by the fact-recompute leg), swarm C (it is a grep; the table goes to wilma).

## Wave 2: swarms via the Workflow tool, gated on Wave 0 and 1a

If the direction result says per-file landing should stop, swarm A is skipped and said so.

**Swarm B, register rows.** 77 disposition rows (L, J, C, O) less the landed ones, about nine
chunks. The seat pre-extracts each row's evidence from both trees at pinned SHAs into the unit,
so workers search nothing. Sonnet workers (`model: 'sonnet'`, effort medium, one schema constant),
one Opus overseer. The pilot chunk carries L11, L12 and L24 UNLABELLED as recall probes (the
seat found all three wrong by hand); if the pilot misses them the swarm does not launch.

**Swarm A, merge audit, reduced.** First a seat script does the mechanical classes over all 54
clean-changed units (39 rules, 15 skills and templates; the 7 conflict files are out of scope and
named): platform-specific commands presented as universal; every cited PDR, ADR and path resolved
against `e84da52682`. Then about six Sonnet workers on batches of seven, each handed `.merged`
plus a precomputed diff by path and the relevant doctrine excerpt inline; the four largest units
(`consolidate-docs`, `commit`, `verify-dont-trust`, `session-handoff`) run as their own tier. Per
class the verdict is FOUND, CHECKED-NOT-FOUND (saying what was checked) or COULD-NOT-CHECK, plus a
free-text "other" class. Recall pilot: the pre-cure slice-one files at `d5ded1c5`, unlabelled,
which carry two known re-imported host facts; a miss means no launch. One Opus overseer.

Overseers merge only exact duplicates (same file, line, class), annotate and never drop;
singletons pass through tagged; batches are built from `results.filter(Boolean)` with every
dropped unit logged; `unreadable` is a schema value that is counted.

## Mechanics every call obeys

- `model:` set explicitly on EVERY call (reviewer roles declare none and would inherit this
  session's model). Pilot pass condition: the run record shows the intended model.
- Every brief: "the rule adapters are already applied by the harness; do not open
  `.agent/rules/*` except the files named here", then the two or three that leg needs.
- Forbidden in every prompt: recursive deletes, state-changing git, stash, fetch, worktree add,
  `pnpm`, generators, `gh` writes, network writes, messaging peers. Read rule text with Read,
  never shell grep (the hook denies on substrings).
- Static fan-out from `args`; one Workflow per swarm; the pilot uses the identical script and
  schema. The abort check is the seat's, at each phase boundary: measured total over the phase
  line by half again means stop or shrink.

## Cost

Total tokens. Read model per reviewer leg: the subject diff or files, the role template, about
13k of mandated principles, and tool results re-sent on each later turn.

| Phase | Legs | Estimate before pilots |
| --- | --- | --- |
| Design review (spent) | 3 | 250k measured |
| Wave 0 | 2 | 0.3M |
| Crickets | 6 | 0.2M (27k to 36k measured today, no reads) |
| Wave 1a reviewers | 7 | 0.85M (the rule's measured prior: 82k to 171k per leg) |
| Wave 1b | 5 | 0.55M |
| Swarm B | ~9 + 1 | 0.3M |
| Swarm A | ~10 + 1 | 0.35M |
| Total | | about 2.5M, output roughly a tenth |

Wave 1 launches in tranches (the Agent tool has no mid-flight abort): Wave 0 plus the most
expensive leg (onboarding) first as the pilot, then 1a, then 1b. The script's `budget` counts
OUTPUT tokens and binds only on an owner directive; after the pilots the seat states the measured
output line and the owner may set one.

## After the fleet

1. `agents_error`, `failures`, the journal for any died agent; UNDELIVERED legs listed, never
   substituted.
2. Adjudication. Empirical findings: verified first-hand. Judgement-class findings (frame,
   direction, proportion) go to the owner VERBATIM in an appendix with the seat's response beside
   each, because the seat that verifies is the seat under review. Every rejected finding is
   listed with its reason. Convergence among Opus legs is reported as one observation, never a
   count.
3. Metacognition, free-play (harvest with visible discards), concept-exploration (four movements).
4. `/jc-plan`: amend `practice-two-way-exchange.plan.md`; a born-sketch node for the castr fork if
   the harvest supports one, for the owner's ratification.
5. Records: tally with per-leg model, effort, stance, tokens, runtime and findings attached to
   SHAs; napkin; handoff; committed on the coordination branch.
6. Owner report: ONE page in chat, the appendix as a file; a published page offered.

Execution order on approval: (1) commit the napkin, re-pin the coordination SHA, export PR bodies
and swarm unit lists to scratch files with checksums; (2) Wave 0 and the pilot; (3) 1a; (4) 1b
and the seat's mutation run; (5) the gate; (6) swarms; (7) after the fleet. Then the frozen lane
resumes: PR 147 and PR 148 each have four Copilot findings, seven of the eight against the
lineage's own text.

## Verification

- The launch record holds the pinned SHAs, unit lists with checksums, pilot numbers and estimates.
- Every leg's run record shows its intended model.
- Both recall pilots passed before their swarm launched, or the swarm did not run.
- Measured totals sit beside the estimates in the tally; every adopted finding has its check.

## Design review verdicts (revision 1; three Plan-type legs; 77k, 81k and 92k tokens)

All three: REVISE. Severity 4 findings and their cures:

- Wrong object: the working tree lacks PRs 143 to 146; the lineage and castr checkouts are other
  seats' trees (frame, mechanics). Cure: §Objects, SHAs only.
- Inverted weighting: most spend checked execution; the owner's questions were about direction
  (frame). Cure: Wave 0 and 1a first, swarms gated.
- Swarm A false confidence: workers forbidden the doctrine they were to judge by; silence would
  read as sound (proportionality, frame). Cure: script the mechanical classes, inline doctrine,
  three-way verdicts, a recall pilot.
- Model tiers not what the owner asked unless set on every call (mechanics). Cure: §Mechanics.
- The budget clause would never bind: it counts output tokens and needs a directive (mechanics).
  Cure: static fan-out, per-phase abort by the seat, a measured output line offered to the owner.

Severity 3, cured: seat-authored Cricket frames had a measured prior of zero signal (open option
sets, a verification Read, the castr answer withheld); stance-carrying wording removed; overseers
annotate and never drop; judgement-class findings go to the owner verbatim; swarm B's evidence
pre-extracted; swarm C cut; four duplicate legs cut or folded; every brief bounds rule reads; skill
units handed by path; PR heads frozen. Counts corrected: ten merged and two open; 14 config files;
77 register rows; 79 ADR citations on `origin/main`.

Named blind spots that remain: castr's seat is unasked; no non-Anthropic view while Codex is out;
whether this fleet repeats the day's pattern of spend out of proportion to its consumer, which is
why these verdicts travel uncut.

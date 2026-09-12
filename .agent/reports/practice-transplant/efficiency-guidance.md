---
type: exploration
status: sketch
date: 2026-09-12
ratified_by:
ratified_date:
ratified_where:
fitness_line_target: 260
fitness_line_limit: 320
fitness_line_length: 100
---

# Practice Transplant — Efficiency Guidance

Working notes from the first wholesale transplant of a full Practice lineage into a repo that
already had a Practice (OCE → `jimcresswell.net`, 2026-09-12). Kept live during the transplant;
the intended graduation target is a PDR-005 amendment or a Practice-Core runbook. Companion
records: the transplant plan
([`docs/explorations/2026-09-12-oce-practice-lineage-transplant.md`](../../../docs/explorations/2026-09-12-oce-practice-lineage-transplant.md))
and the napkin session entry.

> Born sketch. Governs nothing until ratified. Written as guidance-in-progress; every claim here
> was tested once, on one transplant.

## The shape of the problem, seen once

PDR-005 describes transplantation into a **Practice-free** destination. The harder and more
common case is a destination that already has a Practice — an older generation of the same
lineage, or a sibling. Everything below is about that case.

Two facts dominate the cost, and neither is visible from file counts:

1. **Most of a mature Practice repo is corpus, not machinery.** OCE's `.agent/` was 22,581 files;
   the machinery — practice-core, skills, rules, directives, sub-agents, prompts, reference,
   memory _structure_ — was ~525. Everything else (state, plans archives, reports, experience,
   research, analysis) is the source repo's history and must not travel.
2. **A stale copy of the source looks like local elaboration.** Thirteen of twenty-five shared
   PDRs were _longer_ locally. All of the extra length was the source repo's own host-local
   context, carried over in an earlier transplant and never adapted. Line counts lie.

## Sequence that worked, and what to script

Measured on this transplant. Times are agent time with scripts, not hand time.

| Step                       | Method                                                                      | Time                | Script it?                                                                  |
| -------------------------- | --------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------- |
| Reject corpus by directory | `rm -rf` the history dirs before any comparison                             | 1 min               | yes — a fixed list per source                                               |
| Match shared files         | path, basename, `SKILL.md`↔`SKILL-CANONICAL.md`, `-reviewer`↔`-expert`      | 3 s                 | yes                                                                         |
| Line diff                  | `diff … \| grep -c '^<'`                                                    | 3 s                 | yes, but **do not decide on it** — rewrapping inflates it                   |
| **Content novelty**        | 8-gram set difference of each local file against the whole source corpus    | 70 s                | yes — the decisive measure; catches moved content that pairwise diff cannot |
| Antigen scan               | grep for source org, domains, ADR numbers, vendor names, app paths          | seconds             | yes                                                                         |
| Preserve-set manifest      | classify the **destination**: what must survive                             | 20 min of judgement | no — this is the human/agent thinking; everything else is mechanical        |
| Copy machinery             | `cp -R` the source layers                                                   | 1 min               | yes                                                                         |
| Org rename                 | `sed` on scope and org name; test "does the target exist here?" per package | 2 min               | yes — the split test is mechanical                                          |
| Product excise             | delete modules; find importers by `from '…/<module>/` (never the bare name) | 10 min              | yes, with a printed list before `rm`                                        |
| Semantic-merge copy        | copy local-only files; rename roster; renumber colliding records            | 5 min               | yes                                                                         |
| Adapter rebuild            | `portability:fix`; copy or synthesise what it does not generate             | 5 min               | partly — expert wrappers and Cursor triggers needed a script                |
| Index hygiene              | root `.gitignore` _before_ the first `git add`; `git reset` if you forgot   | 2 min               | yes                                                                         |

Reading files into context was needed for exactly three things: the doubled continuation prompt,
the register structures, and the entry-point rewrites. Everything else was better done blind.

## Rules that held

- **Invert the manifest.** When the destination has a gradient, classify what must survive there.
  The source-side manifest PDR-005 mandates exists to substitute for a missing destination
  gradient; when the gradient exists, its cost is unjustified and its risk (silent discard) is
  already covered by the preserve set.
- **Reversibility substitutes for classification.** Tag the pre-state; then the four audits move
  post-hoc, as PDR-005 already allows ("corrective pass, not rollback").
- **Verify every "already homed" claim** against the live home (PDR-101). One was false.
- **Numbering collisions are silent.** PDR-030 existed in both lineages with different content. A
  directory copy destroys the local one with no conflict marker. Scan for these first.
- **Two-tier antigen scrub.** Org-shaped references (scope, org name, repo name) are a `sed`.
  Product-shaped references (domains, app paths, vendor packages, workspace inventories encoded as
  data) are excise-or-case-by-case. The split test: rename if the import target exists in the
  destination, excise the importing code if it does not.
- **Adapters are built artefacts.** Do not report dangling adapters as errors; rebuild them after
  the canonical layer settles.
- **Records are not rewritten.** Napkin, experience and archived plans keep the old roster names.
- **Owner rulings via cards, not boards.** Twenty questions as `AskUserQuestion` batches took
  four rounds; a visual decision board took one round to be rejected.

## Mistakes to design out next time

- Importer detection by bare directory name matched comment strings and deleted core files.
  Restored from source. Match import syntax, print, then delete.
- zsh quirks produced three wrong-zero results: unquoted `$VAR` in a function does not split;
  unquoted `--include=*.ts` fails as a glob; a failed glob aborts an `&&` chain. Use `${=VAR}`,
  quote includes, `setopt nullglob`.
- Linting from a workspace directory where no config reaches; the root config had the rule
  disabled. Check which config applies before treating a violation as real.
- Estimating in hand-work hours. The owner rejected 26–40 h; the mechanical majority landed in
  the first hour. Script first, then estimate the residue.
- Trusting a file's self-description over the owner's knowledge of it. The local `mcp` skill's
  "multi-channel practice" text was an upstream defect, not a meaning.

## Open questions this transplant did not settle

- Whether `portability:fix` should also generate expert wrappers and Cursor triggers (it does
  not; 117 triggers and 80 wrappers were scripted by hand).
- Whether the source's adapter and template contracts (identity component, reading-discipline
  component, template loading line) should travel as a validator-enforced contract first, so the
  destination's templates can be conformed mechanically.
- Whether a transplant needs a bidirectional record at all when the owner rules that nothing is
  reported upstream. (Here: no.)
- The generalisation: how much of this is a property of _this_ pair of repos versus any pair.
  One instance is not a pattern (PDR-014). The second transplant decides.

## Layers the three-layer model hides (added at wrap, 2026-09-12)

Two surfaces were found only by tripping over their validators:

- **Harness integration** — hooks, statusline, husky scripts, CI workflows, root config. Practice
  machinery outside `.agent/`, not generated, not adapters.
- **Practice documentation** — `docs/governance`, `docs/engineering`, `docs/foundation` and the
  Practice-governance ADRs that directives and rules cite.

Next time: inventory the source's _tracked files by top-level surface_ before adopting its own
structural model, and run the source's link validator against the destination before declaring
the machinery copied.

## Second half: rules, harness, gates (added 2026-09-12, evening)

The owner's order — directives, then rules, then harness, then re-evaluate — held. Measured shape
of the second half:

- **Rules triage at content grain is a digest job, not a reading job.** 115 lineage rules were
  triaged from a 22-line digest per rule plus a grep of every product-shaped line; four dropped,
  46 adapted. The adaptation was dominated by one shape: an upstream ADR citation whose local home
  is a PDR, a directive section, or the tooling itself. A map of ~12 ADR numbers to local homes
  cleared 40 of the 41 files with broken links. **Ship the ADR→home map as a transplant input.**
- **The harness is where "every script must work" bites.** The root gained ~60 scripts; each was
  run once. Three config decisions had to be made before any of them passed and are worth taking
  up front next time: the Prettier convention split (root = tooling convention, site keeps its
  own), the markdownlint footprint (adopt the lineage's rule set and ignores; the canonical corpus
  was authored under it), and the ESLint major per workspace (the site's Next config needs
  ESLint 9; the lineage runs 10; a security override on `brace-expansion` had to be scoped per
  major or it broke the older resolver).
- **Install order is a correctness property.** Writing `.claude/settings.json` hooks before
  `.agent/hooks/policy.json` existed locked the session out of Bash, Edit and Write at once — the
  guard fails closed by design and it reloads the instant settings change. Recovery needed a tool
  the matchers do not name. The order is: policy file → built dispatcher (`postinstall`
  bootstrap) → settings wiring. An installer must sequence these, never copy them as a set.
- **Sub-agent adapters are generatable in one pass.** 27 templates → 81 adapters (Claude, Cursor,
  Codex) plus the Codex registry, from one script; the templates needed two component-reference
  lines. `portability:fix` does not do this; the second transplant should not script it by hand
  again.
- **A lineage test suite encodes the source's estate facts.** Eight of 326 agent-tools test files
  failed for host reasons, in four classes: upstream-only subjects (delete the test with its
  subject), fixture paths shaped like the source's workspaces, roster names, and vendor message
  drift (a TOML parser's caret column). Budget ~3% of test files for localisation.
- **Gate aggregate semantics travel with the rules.** The lineage's skills and rules assume
  `pnpm check` is read-only and `pnpm fix` mutates; the local convention was the reverse. The
  CI-parity validator forced the decision within an hour of landing — a good example of a gate
  that finds the seam for you.

Time: rules triage about 90 minutes of agent time; harness about two hours including the gate
fixes; both under the owner's "no errors, no warnings" bar.

## Wrap findings (added at the 2026-09-12 close)

- **The biggest loss class was session-local generators.** Two scripts that produced tracked
  artefacts lived only in the transplanting session's context: the sub-agent adapter generator
  (27 templates → 27 Claude wrappers, 27 Cursor wrappers, 27 Codex TOML adapters, plus the
  `.codex/config.toml` registry, plus two component-reference lines per template) and the
  classified rules-index generator (three-column `RULES_INDEX.md` from the lineage's rows plus
  local classifications). Recipes: an adapter is frontmatter `name`/`description` plus a "Your
  first action MUST be to read and internalise `<template>`" body (Claude adds `tools`,
  `disallowedTools`, `permissionMode: plan`; Cursor adds `readonly: true`; Codex is `name`,
  `description`, `model_reasoning_effort = "high"`, `sandbox_mode = "read-only"`,
  `approval_policy = "never"`, `developer_instructions` naming the template); descriptions come
  from the template's Identity `Purpose`/`Summary` lines. Next transplant: land both as
  `agent-tools` bins FIRST, then run them — a generator that exists only in a transcript is a
  loss the moment the context ends.
- **Cited scripts must exist.** A cheap check — every `pnpm <script>` mentioned in skills,
  rules and entry points resolves to a root script — found eight gaps after the harness landed,
  including the commit-message check the owner had stopped using because nobody could find it.
  Run the check at the end of every transplant phase; it is a validator candidate.
- **Guard refusals abort shell chains.** A blocked `git add` inside an `&&` chain silently
  skipped the commit-message file write that followed; the next commit ran with a missing file
  and the continuity commit swallowed the bundle. Stage by listing paths, write message files
  in their own command, and check the message with the commit-message check before `-F`.
- **Scripts keep/retire criterion that held:** keep a script when a consumer exists on this
  estate (a hook, a gate, a skill that cites it, a platform in use); retire when its subject is
  an upstream artefact, a vendor account the estate does not hold, or a product surface.
- **Residue scan classes** (for the scrub checklist): product code with a hard-coded upstream
  repo, package metadata URLs, and test-fixture strings — the sed scrub reaches the first two
  and mangles the third.

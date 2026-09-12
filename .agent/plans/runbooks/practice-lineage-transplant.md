---
id: practice-lineage-transplant
node_type: runbook
name: Practice lineage transplant
overview: >-
  Bring a host that already carries a generation of the Practice lineage up
  to a newer generation of the same lineage, preserving the host's own
  divergence, with every mechanical step run by an instrument and every
  judgement step presented to the owner as one numbered list.
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-09-12
ratified_where: >-
  Owner's word in session 880ff9 (Cauldron herds Lustre), 2026-09-12: "Both
  nodes are ratified"; captured on the napkin §Session 5 (2026-09-12).
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-12
---

# Practice lineage transplant

Written from the first instance (OCE → `jimcresswell.net`, 2026-09-12) and
ratified on the same day. The second instance (castr) tests every step and
fills the timing table's second column; a step that fails there returns this
runbook to sketch for re-ratification. PDR-005 owns the Practice-free destination; this runbook owns the case
PDR-005 calls harder and more common: the destination already has a
Practice, an older generation of the same lineage plus its own local
divergence. The cross-instance guidance this runbook distils is
`.agent/reports/practice-transplant/efficiency-guidance.md`; the
exploration of packaging the Practice is its sibling report. Neither is
doctrine until ratified.

## When to run

At owner word, when a host should take a newer lineage generation. Not on a
cadence: the lineage evolves continuously, and the host takes a generation
when its owner decides the delta is worth the rulings it will cost.

## User groups and value

- **The owner** rules once per genuinely host-specific question and never
  again on a question instance 1 already settled.
- **The transplanting seat** runs instruments instead of writing them, and
  spends its judgement only on the paths the classification marks as
  contested.
- **Every later seat on the host** inherits entry points that describe the
  host, scripts that exist, and assertions that were exercised before the
  seat met them.

## Preconditions

Each item is checkable; the check is named.

1. **A pinned, read-only source.** The source checkout is another seat's
   estate or a bare mirror; every read is `git -C <source-checkout> show
   <pin>:<path>`, never the working tree. Check: the pin SHA is recorded in
   the manifest before the first read. The manifest is the exploration
   document PDR-005 mandates, in the host's `docs/explorations/`.
2. **The host's ancestor commit is known and recorded.** The host's
   `.agent/practice-core/provenance.yml` and `CHANGELOG.md` date the last
   time it took the lineage, and the host's own transplant records may name
   a later re-sync; the candidate ancestor is the source commit on or before
   the latest such date. Check: for every machinery path the host has not
   edited since, the host's file is byte-equal to the candidate's — a
   candidate that fails this on many paths is the wrong date. The ancestor
   SHA goes in the manifest; every count in step 1 is measured against it.
3. **A tagged pre-state.** `git tag transplant/pre-<date>` on the host.
   Check: the tag exists. Corrections are a corrective pass, never a
   rollback (PDR-005), but the tag makes every audit possible post hoc.
4. **A clean host tree and a claim.** Check: `git status --short` is empty;
   the transplanting seat's claim names the machinery areas; any other live
   seat on the host has been told the areas.
5. **The instruments exist as bins** on the host or the transplanting
   checkout: `transplant classify`, `transplant antigen-scan`, the
   sub-agent adapter generator, the rules-index generator, and the
   assertion validators (cited scripts, reference direction, machine-local
   paths, CI parity, markdown links, portability, sub-agents, skills).
   Check: each is a `package.json` script that runs. A transplant that
   starts without them writes them first and lands them before anything
   else (instance 1 lost two generators to context end).
6. **The instance inputs are readable**:
   `.agent/reports/practice-transplant/inputs/` (rules verdicts, drop list
   by subject class, script keep/retire, record-number-to-home map,
   antigen list, config decision list, standing owner question set).
   Check: the directory exists and each file names its reader step below.

## Steps

Each step names its executor. Owner-held steps surface as one numbered list
taking one word, declines by item number.

1. **Measure before shaping** (`agent`). `git -C <source-checkout> diff
   --stat <ancestor> <pin> -- <machinery paths>` and `--name-status` per
   surface (rules, skills, directives, practice-core, sub-agents,
   reference, prompts, executive memory, agent-tools). Record the counts in
   the manifest. This number sizes every later step; a transplant whose
   size is unknown is planned by guess.
2. **Classify every machinery path three ways** (`agent`, `transplant
   classify`). Given ancestor, pin and host: **unchanged-in-host** (host
   equals ancestor: mechanical overwrite from the pin); **theirs-only**
   (new upstream: subject to the drop verdicts); **ours-only** (host-local:
   keep, untouched); **both-changed** (judgement); **upstream-deleted**
   (drop unless the host changed it). The output is the manifest's RED
   rows (PDR-005 phase 1). Content-novelty scoring (the 8-gram set
   difference of instance 1) is the fallback when the host reformatted files
   en masse and byte comparison over-reports change.
3. **Name the preserve set** (`agent`, then `owner-held`). From ours-only
   and both-changed: host rules, host skills, host PDRs, host templates,
   and every record-number collision (same number, different subject),
   renumbered per PDR-049 before any copy. Scan collisions first; a
   directory copy destroys the local record with no conflict marker.
4. **Collect every owner question before the first copy** (`agent` compiles,
   `owner-held` rules). The standing question set from the inputs, minus
   every question the host's profile already answers, plus the host-specific
   ones: the drop list by subject class (upstream product, vendor accounts
   the host does not hold, platforms the host does not run), the config
   decisions (formatter split per workspace, markdownlint footprint, lint
   major per workspace, package-manager pin, secret scanner, CI runner,
   tracker, bot identity), the directive merge order, the adapter surfaces,
   the statusline mark. One list, one word.
5. **Apply the mechanical set** (`agent`). Overwrite unchanged-in-host from
   the pin; add theirs-only after the drop verdicts; run the org scrub
   (scope and org name are a `sed`; product-shaped references are excised
   or judged one by one — rename when the import target exists on the host,
   excise the importer when it does not, and match import syntax, print the
   list, then delete); renumber collisions; never rewrite records (napkin,
   experience, archived plans keep old names).
6. **Merge the judgement set at content grain** (`agent`). Directives first
   (source structure, host sections at role positions); then rules, triaged
   from the per-rule digest (`transplant digest`: frontmatter, headings,
   every product-shaped line) with the inputs' verdict table as the default
   verdict for every rule it names, so only new rules need a fresh verdict;
   then skills (dedupe against host skills by subject, not name); then
   sub-agent templates. Each merge lands with a disposition row (applied,
   already-covered, dropped-as-upstream).
7. **Install the harness in order** (`agent`): policy file, then the
   postinstall bootstrap build, then platform settings; verify between each
   with the guard's own smoke. The guard fails closed and activates the
   moment settings are written; copying the set in one move locks the
   session out of every guarded tool. Then hooks, husky, CI with the parity
   validator, root config reconciled with the host's own.
8. **Generate every generatable surface** (`agent`): skill and rule
   adapters (`portability:fix`), sub-agent adapters, the classified rules
   index, Cursor triggers, the Codex registry. A surface that a generator
   can produce is never hand-copied. PDR-009 settles the direction: the
   canonical `.agent/` templates are the source and every platform adapter
   is a thin projection of them; a host generator that inverts this (one
   platform's adapters as the hand-authored source) is replaced by the
   canonical-first generator, never bridged (`replace-dont-bridge`).
9. **Exercise every assertion** (`agent`): run the assertion validators in
   order and cure each red by making the assertion checkable, by making the
   code not depend on it, or by truing the text — in that order of
   preference. A link whose target is a lineage-only record or surface is
   removed, never re-pointed; a record number that survived the copy is
   checked by title at its target before it is kept.
10. **Run every root script once** (`agent`). Keep a script when a consumer
    exists on the host (a hook, a gate, a skill that cites it, a platform in
    use); retire it when its subject is an upstream artefact, a vendor
    account the host does not hold, or a product surface.
11. **Home the docs layer by role** (`agent`, PDR-014): doctrine into
    directives, recipes and host guides into reference, contracts into
    executive memory, developer narrative into `docs/`; never as a
    directory. A doc with no `.agent/` home is product documentation or
    dead.
12. **Keep the records as you go** (`agent`). The manifest carries an
    execution record per step: time, instrument used, decision count,
    mistakes and their cures. The efficiency-guidance report gains one
    addendum per instance (the cross-instance shape). `provenance.yml` gains
    the lineage entry. Every script written during the run lands as a bin
    before the session ends; the wrap's loss scan names session-local
    instruments as its first class.
13. **Close the four audits with instruments** (`agent`, then `owner-held`
    ratification of the manifest): foreign-antigen is the antigen scan at
    zero; completeness is every classified row dispositioned;
    cohesion is reference-direction green plus the directives read against
    the retained ADRs; manifest-closure is no row in an unknown state.

## Verification

The end state is confirmed by: the assertion validators green; `pnpm check`
green on every leg the host defines; entry points (`AGENT.md`, `HUMANS.md`,
`practice-index.md`, `README.md`) describing the host, checked by reading
them; the preserve set present and byte-identical to the pre-state tag
where it was marked keep; the `provenance.yml` entry appended; the timing
table below carrying this instance's column.

Two outcomes are recorded on this runbook by the seat that ran it, dated,
and read by the owner: the number of owner questions asked and the elapsed
agent time, against the packaging exploration's threshold (a run under two
hours by runbook alone means the installable-thing generator is not
built); and the wrap loss-scan's count of instruments that existed only in
the session's transcript at close, which must be zero.

## Rollback

Steps 5 to 11 change shared state; every one is reversible from the
pre-state tag and the pinned source (`git show <pin>:<path>` restores any
drop). The corrective pass is the PDR-005 default: correct forward on the
manifest, never reset the branch. Step 7 has a specific recovery: if the
guard locks the session out, restore the policy file with a tool the
matchers do not name, then re-run the sequence in order. Records written in
step 12 are never rolled back.

## Measured from instance 1

Agent time with instruments, one transplant, one host. The second column is
the castr instance and is empty until it runs.

| Step                              | Instance 1                       | Instance 2 |
| --------------------------------- | -------------------------------- | ---------- |
| Corpus rejection, matching, diffs | under 5 minutes                  |            |
| Content-novelty classification    | 70 seconds to run, 20 min judged |            |
| Owner rulings                     | four rounds of cards             |            |
| Directives merge                  | one evening slice                |            |
| Rules triage (lineage rules, from digests) | about 90 minutes        |            |
| Harness and gate fixes            | about two hours                  |            |
| Docs layer by role (31 files)     | three parallel seats             |            |
| Assertion exercise                | one slice, three commits         |            |
| Instruments written in-session    | two generators, lost once        |            |

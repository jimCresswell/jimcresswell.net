---
type: exploration
status: sketch
date: 2026-09-12
ratified_by:
ratified_date:
ratified_where:
fitness_line_target: 320
fitness_line_limit: 400
fitness_line_length: 100
---

# The Practice as an Installable Thing

An exploration, opened during the first wholesale Practice transplant, of whether the Practice —
canonical `.agent/` content, the agent tooling, platform adapters, validators, hooks, config,
docs and support — could become a standalone, installable thing, and what form "thing" should
take. Run per the OCE `concept-exploration` skill (four movements, warranted proposals with
falsifiers), with a `free-play` pass on the material and a `parallax` charter for depth.

> Born sketch. Governs nothing until ratified. Status at close of the first pass:
> **provisional** — one worked instance, no second case, proposals carry falsifiers.

## Parallax charter (screening depth)

- **Purpose**: decide whether to invest in packaging the Practice, and in which form.
- **Decision owner**: Jim. **Affected**: every future repo that adopts the Practice; OCE as the
  live source lineage.
- **Question type**: design (what form), with an empirical sub-question (what did the transplant
  actually cost, and where).
- **Scales**: one file (an adapter pointer) · one repo (a transplant) · the network of repos
  (lineage drift, plasmid exchange) · time (the Practice evolves monthly; a package must too).
- **Non-goals**: replacing PDR-005's manifest discipline; deciding OCE's own packaging.
- **Defeaters**: if a second transplant costs as little as this one did _without_ packaging, the
  packaging case collapses to "write the runbook". If the Practice's evolution rate makes any
  release cadence stale on arrival, only a live-sync form survives.

## Movement 1 — raw observations

What was actually observed today, before any frame:

- The transplant moved ~525 machinery files and rejected ~22,000 corpus files. The machinery
  had a clean seam; the corpus had to be cut away by hand.
- The **validators could not travel as files** — they lived in a workspace package that assumed
  a monorepo. The destination had to _become_ a monorepo (seven workspaces) to host them. The
  tooling's shape dictated the destination's shape.
- **Adapters are already generated** for rules and skills (`portability:fix`), but not for
  expert wrappers or Cursor triggers. The generator is half a packaging step.
- **Antigens are two kinds**: an org name and a scope (`<upstream-scope>/`) — pure string
  substitution; and product-domain code living inside Practice tooling (~14.5k lines of MCP
  content tooling in `agent-tools`) — a seam defect in the source, not a packaging problem.
- The `tooling/eslint` plugin encoded the **source repo's package topology as data** (boundary
  rules). It travelled as code and had to be deleted on arrival.
- Identity travelled in three places that disagreed: `provenance.yml` (lineage), the roster names
  (`-reviewer` vs `-expert`), and `practice-index.md` (host-local by definition).
- The owner's rulings came in batches of four via cards; a decision board was useless. **The
  install has an interview in it**, whatever the form.
- Memory registers arrived full of the source's entries and had to be emptied to doctrine.
  Doctrine and state were in the same files.

## Movement 2 — the problem space

**Kind of thing**: a distribution problem for a _living_ body of doctrine, tooling and
enforcement that (a) evolves continuously in its source, (b) must adapt to each host's identity,
domain and platform set, and (c) must not carry the source's state or product.

**The gap**: today the Practice moves by copying a repo and cutting. The cut is where the cost
and the risk live: corpus removal, antigen scrub, identity re-binding, adapter rebuild, register
emptying. None of it is doctrine work; all of it is packaging work done by hand each time.

**Who it harms**: every adopting repo (pays the cut), the owner (rules on the same twenty
questions each time), and the source (its seam defects are discovered downstream).

**Causal mechanism**: the Practice has no _boundary object_. Nothing in the source distinguishes
"travels" from "stays" except convention and a PDR that says so. Where a boundary is enforced
(Practice Core's file-level portability, PDR-003), transplant was near-free; where it is not
(tooling, adapters, memory), transplant was the whole job.

**Constraints**: the Practice must keep evolving in place in OCE; hosts differ in platform set,
domain, and workspace shape; the owner interview is irreducible; the source's product code must
never travel; installation must be reversible.

**Success looks like**: a fresh repo, or a repo with an older Practice, reaches "portability
passes, sub-agents pass, entry points describe this repo" through a bounded sequence whose only
manual steps are the owner's rulings — and a second install costs a fraction of the first.

## Movement 3 — the solution space, re-opened

The fluent first answer is "make it an npm package". Interrogated:

- A package fixes distribution but not **binding** — host identity, roster, domain skills. It
  also freezes a living lineage at a version; today's Practice changes faster than a release
  cadence would track, and PDR-005's bidirectional model assumes exchange, not publication.
- The **plasmid** already in Practice Core is the right _biological_ metaphor but only for the
  trinity + PDRs. The transplant showed the plasmid is ~150 files of a ~525-file machinery.
- What travelled cleanly today shares one property: **it is generated or generatable**. Rules
  and skills adapters regenerate. The rules index regenerates. Expert wrappers _could_. Cursor
  triggers _could_. Entry points (`README`, `HUMANS`, `practice-index`) are host-local by
  definition and were rewritten from inventory — they _could_ be generated from inventory.

This inverts the question. Not "how do we package the files?" but **"what is the smallest set
of inputs from which the whole installed Practice can be generated?"** If that set is small —
a lineage snapshot, a host profile, and the owner's answers — then the "thing" is a generator,
and the files are its output.

## Free-play harvest (time-boxed; associations, not findings)

- _This reminded me of_ **Nix flakes / Homebrew formulae**: a declarative description from which
  an environment is realised, with the realisation reproducible and the inputs pinned. Kept — it
  matches "generate from inputs".
- _These look shaped alike_: a Practice install and **`create-next-app`-style scaffolders** —
  an interview, then generated files, then the generated files are yours. Kept — the interview is
  the part today's process proved irreducible.
- _This reminded me of_ **git subtree with a filtered history** — the machinery as a subtree,
  updated by pulling. Kept, weakly — it solves sync but not binding or corpus exclusion.
- _What if the defect is the feature_: the source's seam defects (product code in
  `agent-tools`, topology-as-data in the eslint plugin) were found _because_ someone tried to move
  it. **Installability is a test of the source's seams.** Kept — this is the strongest seed; a
  package build that fails on antigens is a CI gate OCE does not have today.
- _This is shaped like_ a **devcontainer feature** — install-time hooks that add capability to
  an arbitrary repo. Discarded, visibly: devcontainer features install into the _container_, not
  the repo's tracked files; the Practice is tracked content.
- _Invert_: what if the Practice is not installed into repos at all but repos are registered
  with it — a **Practice server** that agents read from? Discarded, visibly: the transplant's
  entire value was the Practice being _in_ the repo, tracked, reviewable, diffable.
- _Analogise_: an **ESLint shareable config** — a package that exports doctrine, extended by a
  host config that adds local rules. Kept — the `extends` relationship is exactly "OCE structure,
  local sections at role positions", which the owner ruled for the directives merge.
- _Sit still_: `provenance.yml` is already a lineage chain with UUIDs per file. It is a
  **lockfile** that does not know it is one. Kept.

## Movement 4 — synthesis and proposals

**Synthesis.** The Practice is not one thing; it is three layers with different distribution
physics, and today they were moved with one blunt instrument:

| Layer                 | What it is                                                                            | Distribution physics                                           | Today                                              |
| --------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| **Doctrine**          | Practice Core, directives, rules, skills, expert templates                            | Versioned content; extends/override semantics; lineage-tracked | Copied wholesale, antigens scrubbed by hand        |
| **Generated surface** | Adapters, rules index, entry points, practice index, Cursor triggers, expert wrappers | Pure function of doctrine × host profile                       | Half generated, half hand-copied                   |
| **Tooling**           | Validators, collaboration state, comms, commit queue, hooks                           | Code with a package boundary; workspace-shaped                 | Forced a monorepo conversion; carried product code |

The "thing" is therefore most plausibly **a generator with a lineage lockfile**: a source
snapshot (doctrine layer, pinned by `provenance.yml`), a host profile (identity, platforms,
domain clusters, roster), the owner's interview answers, and a tooling package as an ordinary
workspace dependency. Installation = generate the surface layer, copy the doctrine layer under
`extends`, add the tooling package. Update = re-pin and regenerate; local overrides survive
because they live in host-owned files the generator never writes.

**Proposals, each with a warrant and a falsifier.**

1. **Make installability a CI gate in the source first.** A "build the distributable" job that
   fails on any product-domain reference in the doctrine or tooling layers. _Warrant_: the
   transplant found ~14.5k lines of product code and a topology-as-data plugin only by moving
   them; a gate finds them at authoring time. _Falsifier_: if the gate produces no findings over
   a quarter, the seams were already clean and the gate is theatre.
2. **Extend `portability:fix` until nothing in the surface layer is hand-copied.** Expert
   wrappers, Cursor triggers, `RULES_INDEX.md`, and the three entry points, all generated from
   inventory + host profile. _Warrant_: 80 wrappers and 117 triggers were scripted by hand today
   from templates that already existed; the rules index was generated in one script.
   _Falsifier_: if a host needs to hand-edit generated files to be correct, the host profile is
   under-specified, not the generator.
3. **Split `agent-tools` along the seam the transplant exposed** — Practice tooling (validators,
   collaboration, comms, commit queue) versus source-product tooling — as two packages in OCE.
   _Warrant_: the split was made by deletion here; making it in the source once makes it free for
   every later host. _Falsifier_: if the split leaves cross-imports that cannot be resolved
   without shared product types, the seam is not where the transplant thought it was.
4. **Treat `provenance.yml` as the lockfile.** Pin a host to source entries by UUID; "update"
   means advancing the pin and regenerating. _Warrant_: the chain already carries per-file
   UUIDs and dates; the transplant added one entry by hand and it was the only lineage record
   needed. _Falsifier_: if per-file pins diverge in practice (a host takes new PDRs but an old
   `practice.md`), the unit of pinning is wrong and it should be the lineage as a whole.
5. **Do not choose npm/subtree/template yet.** The form follows from whether the generator
   exists. _Warrant_: every form considered in play either fails binding (package), fails
   exclusion (subtree), or fails tracking (server/devcontainer); only "generator + inputs" passed
   all three. _Falsifier_: a second transplant done by runbook alone costing under two hours
   would show packaging is not worth building.

## Unresolved evidence that would change this

- A **second transplant**, into a repo with no prior Practice, to test whether the corpus/machinery
  seam and the antigen tiers are properties of OCE or of any source.
- Whether the sub-agent **template contract** (identity component, reading-discipline, loading
  line) can be applied to a host's local templates mechanically — if yes, expert templates are
  doctrine-layer with `extends`; if no, they are host-owned and the generator must not touch them.
- The real **evolution rate** of the doctrine layer, measured from `provenance.yml` dates — the
  number that decides whether pinning is monthly, weekly, or continuous.

## Routing

- Proposals 1–3 are OCE-side work and are recorded here only; nothing is reported upstream
  (owner ruling 2026-09-12). If the owner wants them raised, this document is the brief.
- Proposal 4 touches Practice Core doctrine — a PDR amendment candidate, quorum-gated (PDR-101).
- Proposal 5 is a deferral with a named trigger: the second transplant.

## Addendum (wrap, 2026-09-12): five layers, not three

The synthesis table above needs two more rows. **Harness integration** (hooks, statusline, CI,
husky, root config) is policy-driven config with its own physics — generated from a policy file
plus a host profile. **Practice documentation** (`docs/governance|engineering|foundation`) is
doctrine-layer content that the directives depend on by link; it travels under `extends` like the
directives, and a package that ships directives without it ships dangling references. The
generator-with-lockfile shape survives both additions; the inputs grow by a policy file and a docs
manifest.

**Owner note on the fifth row (2026-09-12).** The Practice-documentation "layer" may be an
artefact of the source repo's pre-Practice origins rather than a layer in its own right: governance
and engineering docs that predate `.agent/` and were never re-homed. If so, the right model is
four layers with those files folded into the doctrine layer (directives, reference, executive
contracts), and the installable thing ships no separate docs manifest. Test at the re-evaluate
step: for each copied doc, name its role and its `.agent/` home; a doc with no `.agent/` home is
either product documentation (stays in `docs/`) or dead.

## Addendum (2026-09-12, harness landed): what the installer must own

Running the harness layer end to end sharpened the synthesis in four places.

1. **The harness is a sequence, not a file set.** It contains a bootstrap (`postinstall` builds
   the tooling the hooks depend on), a guard with fail-closed semantics, and platform settings
   that activate the guard the moment they are written. Copying the set in the wrong order bricks
   the session (worked instance: policy absent, settings present — every guarded tool refused).
   The installable thing therefore needs an ordered install plan: policy → build → activation,
   with a verification step between each.
2. **The host profile is now enumerable.** Inputs the harness had to be told: package-manager
   pin, Node version, the formatting convention per workspace, the ESLint major per workspace,
   the markdownlint footprint, the CI runner shape, the secret-scanner binary, the tracker (none),
   the bot identity (none). Every one of these was discovered by a failing gate; a profile schema
   would have asked for them first.
3. **Adapters are one generator short.** Skills and rules generate; sub-agent adapters, Cursor
   triggers and the Codex registry were scripted by hand for the second time in one day. The
   installable thing ships one `adapters generate` that covers all five surfaces from the
   canonical templates and the classified rules index.
4. **Tests must read the host, not remember the source.** The contract tests that passed
   unchanged read the live estate (the rules index, the sub-agent registry); the ones that failed
   hard-coded the source's paths, roster and tickets. The installable thing's own suite follows
   the first shape only.

Free-play seeds (associations, not findings): a Practice install is a transplant with the surgeon
replaced by a script, and every immune reaction seen today — the guard lockout, the convention
rejections, the fixture failures — maps onto one installer step; the guard locking out its own
installer is a feature to keep, not a bug to soften; the CI-parity validator is the first gate that
_found the seam for us_, which suggests self-checking gates are how an installed Practice
verifies its own installation.

## Addendum (2026-09-12 close): three more properties of the installed thing

1. **Generators ship before artefacts.** Every tracked artefact the install produces must come
   from a generator that is itself installed (the adapter generator, the rules-index generator,
   the logo glyphs). Today two of the three generators lived only in the installer's context;
   the installable thing carries them as bins so the host can regenerate without the installer.
2. **Entry points are discoverable or they do not exist.** A tool cited by a skill but absent
   from the host's scripts is dead; the commit-message check went unused for exactly this
   reason. A cited-script-existence validator is a self-verification gate the install runs at
   its end — the same shape as the CI-parity validator that found the `check`/`fix` seam.
3. **Retirement is per consumer.** The keep/retire question for each shipped script is "does a
   consumer exist on this host?"; the installable thing can answer it mechanically from the
   host profile (platforms in use, accounts held, product surfaces) and prune on install
   rather than leaving dormant scripts for the host to discover.

Association from free play, not a finding: the estate behaved like a body receiving an organ —
the guard rejected its own installer, the conventions rejected foreign formatting, the tests
rejected foreign fixtures — and each rejection was correct. An installer that expects the
rejections and sequences around them is the immunosuppression that makes the transplant take
without switching the immune system off.

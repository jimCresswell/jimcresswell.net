# ADR-023: Host-Side Adoption of Practice Core Decisions

## Status

Accepted

## Date

2026-10-03

## Related

- [PDR-008](../../../.agent/practice-core/decision-records/PDR-008-canonical-quality-gate-naming.md)
  — canonical quality-gate naming, whose host-local application is recorded
  below
- [PDR-132](../../../.agent/practice-core/decision-records/PDR-132-changeset-health-round-budgets-bind-at-authoring-time.md)
  — changeset health and round budgets, whose host-local application is
  recorded below
- [PDR-079](../../../.agent/practice-core/decision-records/PDR-079-pdr-vs-adr-portability-distinction.md)
  — the PDR-versus-ADR distinction this record is the host side of
- [Practice index](../../../.agent/practice-index.md) — the bridge that pairs
  each PDR with this record

## Context

The Practice Core is portable by construction: a decision record under
`.agent/practice-core/` travels to every Practice-bearing repository, and the
decision-records README §Portability Constraint forbids host-repository names
as the carrier of meaning inside one. Host-side adoption is recorded in the
host's bridge index and its own decision-record surface.

Between 2026-09-12 and 2026-09-30 this repository recorded three applications
of Practice decisions as dated amendment entries inside the PDRs themselves,
each headed by this repository's name: the quality-gate script naming adopted
on 2026-09-12, the reading of the validator groups from their live homes on
2026-09-14, and the retirement of the pull-request throughput register on
2026-09-14. Each entry was a true record of what this repository did. Each was
also a host fact inside a portable record: the sibling estate's copy of the
same PDR carried a different entry or none, so the two Practices diverged by
the host each was written in, and a Practice-bearing repository that has never
seen this one would have read a heading naming it.

The two-estate parity ledger (the `practice-parity-for-extraction` node, its
step 2) classed these entries as host-local and named their carry: the
entries move verbatim to a host record, the PDRs keep only the portable claim,
and a Core validator refuses the shape from recurring.

## Decision

This record is the host-side adoption record of Practice Core decisions for
this repository. An application of a Practice decision that is a fact about
this repository — which scripts it names, which instruments it runs or has
retired, which groups its validators form — is recorded here, under a heading
naming the PDR it applies, as a dated entry. The PDR keeps the portable claim,
headed by its date and subject alone, and the pairing of the PDR with this
record is made in the bridge index, never in the PDR.

The Core validator `validate-no-host-names-in-core-headings` (a leg of
`docs-validators:check`) refuses a heading in any Core document that names a
repository the Core's own records declare: the `repo:` field of every
provenance entry, the repository tag of every changelog entry, and the scanned
tree's origin owner and repository. The Core changelog's own headings are
exempt, since its entry tags name the writing repository by its convention.

The entries moved here on 2026-10-03 follow, verbatim as they stood in the
PDRs, with the PDR each applies as its section heading. Later host-local
applications are appended under the PDR they apply, newest first within a
section.

## PDR-008 — canonical quality-gate naming

### 2026-09-12 — jimcresswell.net: OCE's live convention supersedes the `check`-mutates model

Owner direction (2026-09-12): adopt OCE's `package.json`
script naming as practised, not as this record's tables describe it. OCE's live root scripts, which every skill and rule in the transplanted
Practice already assume, are:

- `check` is the **read-only** aggregate; `fix` is the mutating aggregate
  (`format:root`, `markdownlint:root`, `lint:fix`); `check:docs` and
  `fix:docs` are the documentation subset. The `check`-as-alias-of-`check:fix`
  exception above is retired: bare `check` verifies, and mutation is always an
  explicit `fix`.
- There is no `:ci` form. CI runs the same legs as `check`, one run step per
  leg, and a parity validator (`validate-check-ci-parity`) refuses drift
  between the two, which is the guarantee the `:ci` suffix was for.
- Root-only formatting and markdown gates are named for the ecosystem tool and
  the scope: `format-check:root` / `format:root`, `markdownlint-check:root` /
  `markdownlint:root`. Workspace packages carry only their own task gates
  (`build`, `clean`, `dev`, `start`, `type-check`, `lint`, `lint:fix`, `test`,
  `test:watch`, `test:e2e`, `test:ui`) plus tool scripts named
  `<subject>:<verb>`; formatting, markdown, unused-code and secret scans run
  once, at the root.
- Validators are grouped as `docs-validators:check` (reference direction,
  machine-local paths, markdown links, cited scripts, patterns index) and
  `repo-validators:check` (CI parity, claim freshness, guard routing, policy
  reappraisal, lifecycle scripts, stale invocations, collaboration state,
  identity naming, workspace config isolation), both legs of `check`.

The tables and rules above describe the earlier model and are read through
this amendment; `practice-verification.md` item 9 lists the amended set. The
OCE's own copy of this record has not been amended and its
`package.json` contradicts it — a cohesion finding for that estate, not this
one.

### 2026-09-14 — jimcresswell.net: the validator groups are read from their live homes

Owner card (2026-09-14, the morning cards; the closure record's item 78, "PDR-008
and PDR-132: both amended by card"), raised at the closure record's item 66 when
OCE-name leak gate joined `docs-validators:check` and the gates skill's
enumeration no longer matched the 2026-09-12 entry above ("PDR-008 is ratified
text and stays untouched, the mismatch a card").

What changes. The 2026-09-12 entry's two leg lists were the live sets on that
day and are read as historical; the grouping principle stands: documentation
validators under `docs-validators:check`, repository validators under
`repo-validators:check`, both legs of `check`, and a leg joins its group's
root script and the gates skill's enumeration in the same change that lands
it. The live sets are enumerated by the root `package.json` and the gates
skill (`.agent/skills/change-custody/gates/`), never restated here (the
no-moving-targets rule). At the transplant's closure (2026-09-14) the groups
carried seven documentation legs (reference direction, machine-local paths,
lineage names, markdown links, cited scripts, cited paths, patterns index)
and twelve repository legs (CI parity, claim freshness, guard routing, policy
reappraisal, lifecycle scripts, stale invocations, collaboration state,
identity naming, workspace config isolation, plan corpus, protocol wire
contract, practice substrate), a dated fact of the closure, not a contract.

## PDR-132 — changeset health and round budgets

### 2026-09-14 — jimcresswell.net: the pr-throughput register is retired from this estate

Owner card (2026-09-14, the morning cards; the closure record's item 78, "PDR-008
and PDR-132: both amended by card"), raised at the closure record's item 47 on
the retirement pull request: "PDR-132 names the retired pr-throughput register
as a future instrument; ratified text untouched, the retirement recorded
against it for the owner's card."

What changes. §Prediction and falsifier and §Consequences name the
pr-throughput register as the standing instrument once it gains
commits-per-PR and changeset-class dimensions. That register was retired from
this estate on 2026-09-14 (transplant closure item 5b, pull request #68) with
three other OCE instruments, re-importable from the OCE pin; this
record no longer promises it here. The falsifier's measurement stands as the
corpus-methodology re-run, recomputable from the repository host on demand
(per pull request: opened and merged times, changed files, and each vendor
review body's generated, suppressed and previously-missed counts); no standing
register is promised in this estate.

## Consequences

- PDR-008 and PDR-132 in this repository converge with the sibling estate's
  copies: the host-local entries are gone from both, PDR-008 keeps the portable
  claim of the 2026-09-12 direction, and the remaining amendment headings in
  PDR-005, PDR-082 and PDR-132 name their date and subject alone.
- The three entries above read as this repository's facts, where the Core's
  constraint never applied, with their original dates and the wording they
  landed with.
- A future host-local application has one home, this record, and the validator
  turns the old shape into a failing gate rather than a review finding.
- The validator reads the host names from the Core's own records and the
  origin, so the same tool reads the sibling estate's tree by its root argument
  without a declared list; the sibling estate carries its own copy of this
  record under its own number.

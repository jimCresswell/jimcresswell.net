# Evolution Rationale

This repo evolved the Practice in three recent ways that are easy to describe
too thinly if you only read the changelog.

## 1. Codex adapter split

Outcome: keep canonical Practice content in `.agent/`, keep thin Codex skill
and command adapters in `.agents/skills/`, and keep real Codex reviewer
sub-agents in `.codex/`.

Impact: reduces duplication and stops platform metadata from leaking into the
canonical Practice.

Value mechanism: one canonical source is easier to maintain, easier to port,
and less likely to drift silently across platforms.

## 2. Outcome-impact-value traceability

Outcome: non-trivial plans now have to name the outcome they seek, the impact
that outcome should create, and the mechanism by which that impact creates
value.

Impact: exposes mechanism-first planning early, before work narrows onto a
technically neat but strategically incomplete slice.

Value mechanism: clearer framing improves plan quality, catches misalignment
earlier, and reduces expensive late-stage reframing.

## 3. Practice-context adjunct lifecycle

Outcome: allow a small non-Core context package to travel alongside the Core,
with sender-maintained `outgoing/` support material and transient receiver-side
`incoming/`.

Impact: the receiving repo can understand why a change mattered locally without
turning local rationale into permanent Core doctrine.

Value mechanism: better transfer of high-signal lessons without diluting the
Core's portability or self-containment.

## 4. Surface contracts and validators

Outcome: record supported versus unsupported agent-platform mappings in a local
surface matrix, add a portability validator to the blocking check pipeline,
and add a separate Practice fitness validator for governed docs.

Impact: multi-platform support stops being inferred from scattered files, and
Practice/doc growth becomes observable without forcing every advisory concern
into the main gate.

Value mechanism: clearer contracts reduce silent drift, while the split
between blocking portability checks and advisory doc-fitness checks preserves
both rigour and judgement.

## 5. Provenance UUID entry IDs

Outcome: replace positional provenance `index` fields with UUID v4 `id`
fields, while keeping chronology in chain order and `date`.

Impact: provenance stops implying rank or "version numbers", and incoming
chains can be merged or referenced without renumbering pressure.

Value mechanism: stable entry identifiers reduce exchange friction and future
cross-reference fragility, while the docs keep the important guardrail
explicit: integration still compares detailed content rather than shorthand
fields alone.

---
name: consolidate-docs
classification: active
description: >-
  Run the deep documentation-consolidation pass: reconcile continuity
  surfaces, extract reusable patterns, graduate settled knowledge to
  permanent homes, run the doctrine scan and upstream Practice Core
  review, and drain ephemeral surfaces honestly. Use when a slice, plan,
  or milestone closes, before a long pause, when the plans/prompts/memory
  estate is drifting, when the napkin nears ~500 lines, when the Practice
  Box or practice-context has inbound material, or when the user asks for
  consolidation, knowledge curation, doc convergence, or
  `/jc-consolidate-docs`.
---

# Consolidate Docs

Imported and adapted 2026-08-09 from the Oak Open Curriculum Ecosystem
Practice; merged with this repo's consolidate-docs command.

This is the **distil-and-graduate edge** of the knowledge pipeline
(capture → distil → graduate → enforce). It is cross-session work: it
acts on artefacts that accumulate across sessions — pattern candidates
ready to graduate (a single proven instance suffices; there is no
"seen it twice" bar), distilled entries reaching stability, the napkin
reaching its rotation threshold, the Practice Core drifting from current
practice. Session-scoped capture (surprises, candidate notes, handoff
state) belongs to the session-handoff flow and fires every session; this
pass is **not** the default end-of-session flow.

## Approach

This is deep, thoughtful work. It takes time. It must be done first
hand — secondhand knowledge is not enough. Do not rush. Knowledge
curation and conservation of insight are all that matters here.

Never chase fitness functions. They are a signal, not a goal. Caring
for understanding is the only goal.

## When to Run

Run this pass when one or more of these holds:

- a meaningful slice, plan, or milestone has closed
- a long pause is coming and the estate must be left truthful
- settled doctrine or design rationale exists only in ephemeral
  artefacts (plans, prompts, napkin, ARC channels)
- the plans/prompts/memory estate is starting to drift
- `.agent/memory/napkin.md` is at or past ~500 lines
- `.agent/practice-core/incoming/` (the Practice Box) or
  `.agent/practice-context/incoming/` has unprocessed material
- repeated surprises or corrections suggest a new rule, pattern, ADR,
  EDR, or PDR

If none apply, close the session through the ordinary handoff flow
without this deep pass.

## Conservation Invariants

These govern every step below. Read them before acting.

### Knowledge lives in its highest-impact home

The goal of every consolidation move is that knowledge exists where it
does the most good — read at the moment it changes a decision. Ask of
each piece of content: "where would this be read when it matters?"
Thresholds, line counts, and fitness reports are at most a crude,
partial noticer that something may be mislocated — blind to the cases
that matter most (buried-but-correct knowledge, a high-traffic surface
diluted by low-impact text, a lesson homed where it never fires). Never
chase a number, trim understanding, or suppress capture to make a
report look better. Place the knowledge where it has impact and let any
fitness change fall out as a side effect.

### Plans, prompts, memory, and channels are not documentation

**A completed plan must be safe to delete at any point.** Plans are
execution instructions — status, next steps, and references to
permanent docs. If documentation exists only in a plan, a prompt, the
napkin, or an ARC channel, it is at risk. Before marking a plan
complete or archiving it, extract all documentation content to
permanent locations. Silent deletion without homing is never the
default: all content moves to a permanent home or is deliberately
judged not useful and removed with a reason.

### Writes are never blocked by fitness pressure

Writing to shared records of knowledge (napkin, `distilled.md`,
patterns, plans, decision records) is never blocked or thinned because
the destination looks full. When a write would push a file past a
target, the only two valid responses are:

1. Write the full observation and flag the file for structural
   attention (route the pressure to step 9).
2. Thoughtfully promote mature, settled content out of the file to its
   permanent home — substance-led, not space-led.

Never valid: compressing the new insight to fit; cutting existing
entries to make room; skipping capture or graduation because a file is
full; keeping a green fitness report by starving the learning loop.
When pressure persists after processing, the default cure is
**graduation upward, not compression** — the file is not full of
substance to remove, it is full of substance to graduate.

### Read before routing

For every item drained from an ephemeral surface: read the source,
understand the substance, then route it. Classify each item's
disposition as you go — graduated (durable home created or updated,
verified by reading it), duplicate (already represented, verified),
rejected (not worth a durable home, with reason), or carried forward
(still live, with trigger and next action).

**Recurrence check**: before treating an already-homed insight as a
routine duplicate, ask whether it has _recurred despite its home_ —
the same correction resurfacing across napkin rotations or sessions.
Recurrence is first-class evidence that the home is not firing at the
action moment (passive guidance loses to artefact gravity). Capture
the recurrence — usually by strengthening or relocating the home —
_then_ remove the duplicate. Deleting the duplicate without capturing
the recurrence throws away the exact signal that explains why the same
corrections keep recurring.

**Pre-archive verification gate**: before any move that archives,
renames, or supersedes a live source, verify the substance is live in
its permanent home — read the home and confirm. Archiving an
unprocessed source is not curation; an archive-only "drain" leaves the
work undone even if a report looks softer afterwards.

### Graduation is not deferrable

Homing a settled lesson into its doctrine home IS the point of the
pass. "Owner-routed", "for a future session", or "out of scope" is
valid only for a genuinely owner-constitutive **decision** (a verdict,
a scope call) — never for the **homing** of an already-settled lesson.
The one legitimate graduation-time deferral is collision avoidance:
when the home is owned by an active mid-flight plan, defer to that
plan rather than author a colliding artefact. A stable doctrine
surface is never "mid-flight", so that exemption never licenses
parking a homing there.

Where deferral is genuine, it must satisfy deferral honesty: a named
constraint (clock, dependency, owner veto) or a named priority
trade-off, plus evidence, plus falsifiability (how a future session
could check whether it held). "Ran out of time" and "next session" are
not acceptable phrasings.

### The record is the permanent doc, not a ledger

The commits and the permanent homes ARE the record that the pass
happened. Do not write disposition ledgers, before/after fitness
tables, or accounting notes restating "item X went to home Y". Splits,
renames, archives, or deletions performed primarily to change a
fitness category are self-delusion, not curation.

## The Knowledge-Flow Staircase

Knowledge climbs a staircase, and consolidation walks it **bottom-up**
— process the lowest layer first so higher layers receive settled
substance, and preserve first, restructure second:

```text
sources ──► napkin ──► distilled ──► permanent homes
(plans, prompts,       (staging,     (principles, ADRs, EDRs, PDRs,
 ARC channels,          curated)      patterns, reference, docs/,
 comms events,                        READMEs)
 platform memory)
```

Local homes, by substance shape:

- Behavioural rules and principles → `.agent/directives/principles.md`
  and `.agent/rules/`.
- Host-product architectural decisions →
  ADRs in `docs/architecture/decision-records/`.
- Editorial decisions → EDRs in `docs/editorial/decision-records/`.
- Practice-governance decisions → PDRs in
  `.agent/practice-core/decision-records/` (this repo's own PDR series;
  the numbering is local, not the upstream Practice's).
- Repo-local pattern instances → `.agent/memory/patterns/`.
- Portable general abstractions → `.agent/practice-core/patterns/`.
- Reference-grade operational material → `.agent/reference/` or
  `docs/`.
- Workspace-specific gotchas → the nearest README.

Fitness is a signal at any step of the staircase, never the organising
axis. The staircase is walked until knowledge reaches its durable home;
structural repair happens after preservation, at rest.

## Declare the Depth

State at the start of the pass which of two depths applies:

- **Session-completion** — bounded closeout while winding down. Capture
  fresh learning, route the obvious substance, and leave unresolved
  surfaces live with honest next actions. A truthful "partial slice
  landed" verdict is valid.
- **Dedicated knowledge curation** — a proper curation pass, the
  default when the user names curation, buffers, or drift as the work.
  Process drainable surfaces item by item toward empty, deciding each
  one; what cannot be decided yet is visible decision-debt for a later
  pass. "Complete" may be claimed only when the knowledge touched lives
  in its highest-impact home (verified by reading) and every drained
  item has a disposition — never because a fitness number improved.

## Drainable Surfaces (Local Inventory)

The surfaces this pass reads and drains:

- `.agent/memory/napkin.md` — session capture (rotation at ~500 lines).
- `.agent/memory/distilled.md` — curated staging (target ~200 lines).
- `.agent/plans/` — `active/`, `current/`, `future/`, `research/`,
  `roadmap.md`, and the archive.
- `.agent/prompts/` — prompt artefacts that accumulate settled content.
- `.agent/practice-context/` — `incoming/` and `outgoing/`.
- `.agent/practice-core/incoming/` — the Practice Box.
- Platform memory — Claude Code per-project memory at
  `~/.claude/projects/<project>/memory/` (this repo genuinely uses it),
  and `~/.claude/plans/` for platform-generated plans carrying
  grounding not yet in repo plans. If a surface is absent on the
  current machine, record that rather than silently skipping it.
- Collaboration surfaces — ARC channels under
  `.agent/collaboration/rapid-comms/` and comms events under
  `.agent/state/collaboration/`. **Conserve-at-close applies to
  channels**: before a channel closes (and at consolidation for any
  channel already closed), its durable substance — decisions, lessons,
  protocol observations — must be conserved into permanent homes; the
  channel itself is coordination history, not documentation.

Buffer identity follows the role, not the filename: a split, dated, or
relocated file still counts as part of the same surface until its
items are dispositioned. Do not create new buffer files as an
overflow or fitness-management strategy.

## Process

Work the ten steps in order. Steps 1–4 and 7–10 are the estate spec of
this repo's consolidate-docs command; steps 5–6 fire conditionally.

### 1. Reconcile the live continuity surfaces together

Reconcile the surfaces that name the same work: the active plan, the
active-plan README (`.agent/plans/active/README.md`), the roadmap
(`.agent/plans/roadmap.md`), and any current prompt or parent-plan
summary. Include the roadmap and parent-plan **tables** and any slice
notes with "remaining" or "next" sections — status lines, completion
markers, and cross-references must agree.

After archive or delete moves, sweep both reference **modes**, not
just links: plans reference a surface in _navigation_ mode (a pointer
to read) and in _prescription_ mode (an edit instruction targeting the
file). A link-only sweep after a deletion silently leaves prescriptive
references instructing "do impossible thing" against the deleted
surface (worked instance 2026-04-21, upstream Practice). The two most
common stale classes: `active/` or `current/` paths that should now
point at the archive, and deleted platform-plan paths that should now
point at the canonical repo artefact they delivered.

### 2. Extract reusable patterns to the right destination

Review completed work for patterns that meet the barrier: broadly
applicable, proven by implementation, prevents a recurring mistake,
and stable. This covers all learning types — code, process,
architecture, structure, agent-operational, behavioural, domain
gotchas. Three destinations:

- `.agent/memory/patterns/` — repo-local, ecosystem-grounded
  instances (one pattern per file; see that directory's README for
  the schema). Most candidates land here.
- `.agent/practice-core/patterns/` — portable general abstractions.
  Author the general form fresh by **synthesis** when instances
  express an underlying ecosystem-agnostic principle; instances stay
  in `.agent/memory/patterns/`.
- `.agent/practice-core/decision-records/` — Practice governance
  (review discipline, planning discipline, knowledge-flow discipline).
  Governance is PDR-shaped, not pattern-shaped.

**Cross-session scan**: read the napkin's current rotation window as a
chronological sequence, not just the latest session. The most
important patterns emerge from the _interaction_ of observations — a
correction in one session reframing an observation from an earlier
one. Ask: "what do these sessions know together that none knows
alone?"

### 3. Graduate settled content from ephemeral surfaces

Check `.agent/memory/distilled.md`, plans, prompts, and AGENTS anchors
(entries in `AGENTS.md` left by the learning loop as pointers) for
content that now functions as settled documentation, and graduate it
to the correct permanent home. Extend the sweep across the full
drainable inventory above — ARC channels, comms events, and platform
memory included.

For each candidate entry apply two criteria: **stable?** (not
contradicted by recent work) and **natural home?** (an existing
permanent doc where it belongs). Three outcomes:

- **Both met** — create the permanent entry first, then remove the
  source copy. No duplication across tiers.
- **Stable but no natural home** — do not leave it staged
  indefinitely. Raise it with the user: stable knowledge without a
  home is a signal the documentation structure has a gap worth
  filling.
- **Not yet stable** — leave in `distilled.md` for further validation.

Always graduate useful understanding — fitness pressure on the target
doc routes to step 9, never into deferring the graduation. The bar is
"stable and useful enough to place", not "no longer operational".

### 4. Run the doctrine scan with the reusability test

Walk every distilled entry and recent surprise and ask what shape of
doctrine it is. The adopter-scope test decides the home:

- **ADR-shaped** — names an architectural constraint, trade-off, or
  boundary of this site; the adopter is the next contributor to this
  repo, who would re-derive the decision without it. Home:
  `docs/architecture/decision-records/`.
- **PDR-shaped** — names a decision about how the Practice itself
  operates; the adopter is the next Practice-bearing repo, which would
  re-derive it without a portable record. Home:
  `.agent/practice-core/decision-records/`.
- **EDR-shaped** — an editorial decision about this site's content and
  voice. Home: `docs/editorial/decision-records/`.
- **Reference-grade operational material** — how-it-works substance
  that is neither a decision nor a pattern. Home: `.agent/reference/`
  or `docs/`.

Surface ADR, PDR, and EDR candidates explicitly to the user as
separate numbered lists with a one-line justification each; the user
decides what to promote. Do not silently leave doctrine-shaped content
unpromoted — that is the enforce-edge failure mode where captured
knowledge never reaches the surface that would enforce it. If nothing
qualifies in a category, say so and move on.

Every new or amended rule in `.agent/rules/` must cite the decision
record(s) it operationalises; a rule that cannot name its source
decision cannot evolve with it.

### 5. Rotate the napkin if needed

If `.agent/memory/napkin.md` exceeds ~500 lines, run the distillation
skill (`.agent/skills/distillation/SKILL.md`) before closing the pass:
extract behaviour-changing entries, merge into `distilled.md`
(new/duplicate/refinement/contradiction), prune what is already in
permanent docs, archive the outgoing napkin to
`.agent/memory/archive/napkin-YYYY-MM-DD.md`, and start fresh.

**Process before archive**: archiving is the final move for an
already-processed source, never a parking place for unfinished
curation. Every behaviour-changing item gets a disposition before the
source moves. In a multi-agent window the napkin is a moving surface —
a peer may commit a lesson between your read and your rotation; diff
the archived window against your working read before asserting the
rotation homed everything.

`distilled.md` should stay under ~200 lines of specific, actionable,
non-obvious, terse entries. That target is a refinement signal, not a
veto: preserve the learning first and route the pressure to step 9.

### 6. Check the Practice Box and inbound context

Inspect `.agent/practice-core/incoming/` (the Practice Box) and any
inbound material in `.agent/practice-context/incoming/` before
declaring the estate settled. If material is present, follow the
integration flow in `.agent/practice-core/practice-lineage.md`.

**Practice evolution is not linear** — an incoming Practice can be
behind in some areas and ahead in others. Never dismiss an incoming
pack as stale because one file is older; compare bidirectionally, file
by file and section by section, including decision records. Apply the
three-part bar (validated by real work? prevents recurring mistakes?
stable?), present specific proposals to the user, and clear the box
only after integration is complete and user-approved. Never clear the
box unilaterally.

### 7. Audit cohesion across the estate

Audit cohesion across the Practice Core, `.agent/practice-index.md`,
the directives (`.agent/directives/`), reference docs
(`.agent/reference/`), prompts, and the platform adapters
(`.claude/`, `.cursor/`, `.agents/`). No stale links, no contradictory
status, no outdated wording. Re-sweep the platform entry points
(`CLAUDE.md`, `AGENTS.md`, and any analogous host adapters) as a
backstop — when a
workflow surface has been renamed, drift often survives in entry
points, milestones, and templates after the canonical docs are fixed.

### 8. Review the Practice Core upstream

Steps 2–4 move new knowledge _into_ permanent homes (downstream). This
step reads _existing_ Practice Core content against current practice
(upstream). Without it, the Core carries intent, mechanisms, and
templates that drift silently as everything around them evolves.

For every learning surfaced in this pass, classify it relative to the
current Core:

- **Contradiction** — the learning directly contradicts a Core claim
  or a PDR's rationale. The session is more recent evidence; update
  the Core or explicitly reject the evidence with written rationale.
- **Extension** — a new instance, consequence, or uncovered case.
  Amend the existing surface; do not author a separate document for a
  genuine extension.
- **Refinement** — the learning sharpens an existing statement: a
  looser rule becomes tighter, an abstraction gains a concrete
  example. Lands as an in-place edit.
- **Supersession** — the learning renders Core substance obsolete or
  partially superseded. Mark the old record superseded (in part or in
  full) with a pointer to the successor; never delete it.
- **Drift** — the Core no longer describes how work actually happens.
  Drift is more common than contradiction; it accumulates silently and
  surfaces only on deliberate review.

Surface candidates to the user as a numbered list (surface affected,
change type, one-sentence evidence). When nothing qualifies, say so —
but "nothing qualifies" is a conclusion reached by review, not by
skipping review. Substantive amendments are noted in
`.agent/practice-core/CHANGELOG.md`. If a single pass surfaces many
Core amendments, treat that as a reflection trigger: is validation
keeping pace with structural change, and have recent Core changes
stabilised rather than churned?

### 9. Run the companion checks and repair structure honestly

Run the advisory checks for doc changes:

```bash
pnpm practice:fitness:informational
pnpm fitness-vocabulary:check
```

When tracked files changed, the repo gates (`pnpm check`) apply as
usual.

Analyse any fitness warning by **reading the content and asking the
impact question** — does this knowledge belong here, or where would it
have more impact? — never from metadata alone. A verdict resting only
on size or role ("legit growth", "big file", "over the limit") answers
the proxy, not the question. The structural responses, in order of
preference: graduate mature substance upward to its permanent home;
refine (deduplicate, remove entries covered elsewhere); restructure a
reference surface when that is the right long-term shape; extend a
target with rationale. Only the user raises hard limits. Never trim
understanding, roll back a write, or withhold learning to make a
report green — if a check fails because knowledge was preserved
correctly, the disposition is "remediate the structure", never "undo
the knowledge".

### 10. Narrow practice-context outgoing

Narrow `.agent/practice-context/outgoing/` to ephemeral exchange-only
support — transient sender-to-receiver notes that expire after
integration. Any `outgoing/` file whose substance exists nowhere else
is a **defect**: graduate the durable substance in this same pass
(portable governance → PDR; portable abstraction →
`.agent/practice-core/patterns/`; host-local reference →
`.agent/reference/`) or delete it as a staging artefact that never
graduated. New insight routes to its home by substance shape, never by
a legacy "put it in outgoing" habit.

## Closeout

Close every pass with a report of value and impact matching the
declared depth:

- the depth used;
- what knowledge reached which permanent home, and what behaviour it
  changes;
- unresolved live items and blockers, named honestly as live signals
  (un-homed substance? structural debt?), not as accounting tables;
- an explicit verdict: complete, partial slice landed, or pending.

Success means: the continuity surfaces agree, durable knowledge has
graduated to a permanent home, and the remaining ephemeral surfaces
are truthful about what is still active versus merely historical. The
commits and the permanent homes are the record — no disposition
ledgers, no before/after fitness tables. Fitness is a signal to
explain when it points at real work, never the thing delivered.

## See Also

- `.agent/commands/consolidate-docs.md` — the command entry point.
- `.agent/skills/distillation/SKILL.md` — the napkin rotation.
- `.agent/directives/principles.md`
- `.agent/practice-core/practice-lineage.md`
- `.agent/practice-core/practice-verification.md`

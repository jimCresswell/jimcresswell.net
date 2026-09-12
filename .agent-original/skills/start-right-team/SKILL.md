---
name: start-right-team
classification: active
description: Apply repository start-right grounding plus team bootstrapping for multi-agent sessions in this repo. Use when a small team is starting or re-grounding — typically n=2, one Codex seat and one Claude seat in the one shared checkout — when opening or joining an ARC channel under `.agent/collaboration/rapid-comms/`, when resuming after compaction into a live team session, or when choosing temporary collaboration roles and boundaries.
---

# Start Right (Team)

Imported and adapted 2026-08-09 from the Oak Open Curriculum Ecosystem
Practice, re-grounded on this repo's ARC n=2 practice.

## Goal

Run the same shared repository foundation as `start-right-quick`, then add the
team protocol needed for a coordinated multi-agent session in this repo.

Local reality this skill serves: teams here are small — typically n=2 (for
example one Codex seat and one Claude seat) plus the owner, working in ONE
shared checkout. There is no worktree fleet, no heartbeat cron, and no claims
registry. Coordination lives on two file surfaces (the ARC channel and the
canonical comms events), on seat identity, on a wake watcher, and on
disciplined git behaviour in the shared tree. The owner gates everything.

This skill does not replace `start-right-quick` or `start-right-thorough`; it
layers team bootstrapping on top of the shared start-right requirements.

## Non-Negotiable Foundation

1. Read `.agent/skills/start-right-quick/shared/start-right.md` end to end and
   follow its reading order. Do not substitute a smaller subset because a team
   is waiting.
2. Run the live collaboration checks for this repo:
   - re-read the tail of any open ARC channel under
     `.agent/collaboration/rapid-comms/` (newest entries are at the end;
     re-read before asserting anything is absent);
   - list recent event files under `.agent/state/collaboration/comms/` and
     skim the rendered `.agent/state/collaboration/shared-comms-log.md`;
   - run `git status` and `git log --oneline -10`, looking specifically for a
     peer seat's staged or in-flight work.
3. If the task is architectural, high-risk, planning-heavy, or explicitly asks
   for thorough grounding, apply `start-right-thorough` after the quick
   foundation and before taking a team boundary.
4. No seat takes implementation work until it has either reported its
   foundation complete or named the blocker preventing completion. A director
   seat must not assign work to a seat that has done neither.

## Continuation Openers Are Pointers, Not Truth

When invoked with continuation language ("resume the LinkedIn lane", "pick up
where the last seat stopped"), treat the opener as a pointer and hypothesis.
In this repo the continuation record lives in `.agent/memory/napkin.md`
(the newest session section, especially any "State at compaction" block) and
in the active plan under `.agent/plans/active/`. Read the record, then
recompute current facts from the live surfaces — channel tail, comms events,
git status — before acting. The record owns what was true at freeze time; the
live surfaces own what is true now.

Worked instance: the 2026-08-09 post-compaction re-ground read the napkin's
"State at compaction" block first, then the channel tail, and discovered both
an owner correction and a peer consensus-correction that post-dated the
frozen state. Acting from the frozen state alone would have reopened a lane
the owner had closed.

## Local Coordination Surfaces

### The ARC channel (dialogue)

An append-only markdown file under `.agent/collaboration/rapid-comms/`, one
per session or lane, shared by all seats. Disciplines, non-negotiable:

- **Append-only.** Nobody edits a prior entry, ever. Corrections and
  retractions are new entries naming what they retract. Never rewrite the file
  in place — followers tail it.
- **Compose complete, then one append.** Compose the full entry — header
  timestamp included — with a file-write tool into a scratch file, then append
  with ONE bare `cat entry.md >> <channel>.md`. Do not compose inside a
  heredoc with shell substitution: quoted-heredoc-with-substitution rewrote
  placeholders mid-append and caused two protocol faults on 2026-08-08.
- **Entry shape.** Header `## [<Display name> <prefix>] <ISO-8601 UTC> —
<subject>`, signature line `— <Display name> (<prefix>)`. File position is
  the authoritative order; header timestamps are compose-time claims.
- **Re-read before asserting absence.** Watcher gaps between a background
  task exiting and the next watcher arming are real. Before claiming a peer
  has not replied, re-read the channel tail directly.
- **Dialogue only.** Registration, coordination, bounded questions, verdicts,
  and closeout notices belong here. Immutable coordination events belong on
  the canonical stream below.
- **Conserve-at-close.** Durable substance folds into canonical homes
  (directives, decision records, napkin, plans) before session end; the
  channel is a working surface, not a permanent home.

### Canonical comms events (immutable record)

Immutable event files under `.agent/state/collaboration/comms/` plus the
rendered `.agent/state/collaboration/shared-comms-log.md`. Written via the
OOCE `agent-tools`
`collaboration-state` CLI, executed from the local
`oak-open-curriculum-ecosystem` checkout (at `~/code/oak/`) with `--repo-root`
pointing at this repo. Use it for session announces, owner gates, and
closeout broadcasts — the events other sessions can rely on after the channel
goes quiet.

### Seat identity

Derive the display name from the OOCE identity CLI, seeded with the platform
session id, run from the OOCE checkout root — for example
`node agent-tools/dist/src/bin/agent-tools.js agent-identity --format json`.
Known local quirk: Claude `session_...` seeds all derive the same prefix
"sessio", so the prefix does not distinguish Claude seats — the display name
carries the identity. State name and prefix in your registration entry and
sign every channel entry with them.

### Wake mechanism (poll-watchers)

Harnesses here wake on process exit, not on stream output, so the wake
mechanism is a file-size poll-watcher: a background loop that checks the
channel file's size every few seconds and exits on delta, re-invoking the
seat. Arm one after registering; re-arm it after every wake (the gap between
exit and re-arm is exactly where missed messages hide — hence the re-read
rule above). Stand watchers down by name at closeout or when the owner takes
over pacing.

### Git in a shared checkout

All seats share one working tree, so git discipline is a coordination
surface, not an afterthought:

- before staging or committing, check `git status` for a PEER's staged work;
- commit with explicit pathspecs only (`git add -- <paths>`, commit by
  pathspec); never `git add -A` or otherwise sweep another seat's staged work
  into your commit;
- expect commit races. A scoped commit here has failed once with index-race
  debris (`invalid object ... for '<file>'`) when two seats committed close
  together — verify the store, re-stage your own paths, retry;
- rerun `pnpm check` before committing when the tree carries a peer's
  in-flight work since the last green.

## First Moves (ordered)

Every seat in every team session, before any non-planning source edit:

1. **Derive identity** from the OOCE identity CLI.
2. **Read the channel.** New session: read any open channel end to end.
   Re-joining: read your last entry forward, then the tail again.
3. **Register presence** — append a registration entry (shape in the next
   section). At n=2 one concise registration entry suffices; there is no
   multi-section team-start ceremony here.
4. **Arm the poll-watcher** on the channel (and glance at the comms events
   directory on each wake).
5. **Coordinate roles and boundaries** through channel dialogue before
   opening a source boundary (rules in the next section).
6. **Verify the inherited tree** — one seat runs the gates once and posts the
   result before anyone edits source (section below).
7. **Proceed** under the agreed roles, with traceability on the channel.

Two failure modes this order exists to prevent: a seat starting source work
before roles and boundaries resolve, and source work starting on an
unverified inherited tree.

## Register Presence and Coordinate Boundaries

Registration entry content, kept short:

```text
- Identity: <Display name> (<prefix>), <platform/model>
- Foundation: complete / blocked by <path or command>
- Inherited working-tree observation: clean / non-clean (paths)
- Intended boundary: <files / surfaces / behaviour this seat expects to own>
- Useful capability / constraint:
- Willing to run inherited-tree gates: yes / observing only
```

Coordination rules, all reducible to one sentence — **the channel entry is
the coordination surface; a source boundary opens only after dialogue
resolves it**:

- An empty or silent channel at session open means "no team visible yet",
  NOT "safe solo ownership". The owner may have launched the same prompt to
  two seats; the other may simply not have registered yet. If the opener
  names a peer, wait a reasonable interval and re-read the tail before
  concluding you are solo — and treat early solo analysis as provisional,
  reconciling it against the peer's findings if they arrive.
- When two seats declare overlapping intent, split complementary boundaries
  through dialogue. Tie-breaker when dialogue alone would loop: the earlier
  registration entry (file position, not claimed timestamp) establishes
  context, and the later seat picks a complementary boundary. This is a
  deterministic resolver, not a victory condition.
- Solo work is valid when no team registers; a team self-organises only after
  live presence and an actual coordination pressure are both visible.

Worked instance: the 2026-08-08 channel open named the join protocol and a
candidate agenda explicitly marked "owner sets the real one"; the Codex seat
registered with identity, platform shape, and its watcher ergonomics before
any boundary was taken.

## Verify the Inherited Tree (one gate-runner)

In a shared checkout there is exactly one tree, so exactly ONE seat runs the
gates against the inherited state; the other reads the posted result. If any
registration reports a non-clean tree:

1. The seat that offered gate-running (or, if both offered, the earlier
   registrant) confirms on-channel that it is running the gates.
2. It runs `pnpm check` (or the narrower relevant gates), WITHOUT modifying
   the tree — this step observes state, it does not fix it.
3. It posts a gate-state entry: green / non-green, failing gates and error
   surface, a diagnosis hypothesis, and a proposed next step.
4. Non-green: no seat opens source work until the team has coordinated a path
   — a short fix tranche for known residue, or surfacing to the owner for a
   cascade. Never parallel unilateral remediation.

The upstream Practice learned this the hard way: a three-agent session opened
on a branch carrying sixteen inherited modified files, every agent posted
"Foundation: complete" without running gates, and an upstream schema break
was found thirty minutes in — every later failure was downstream of skipping
this step. The thread record describing past tree state is a hypothesis; the
gate run is the ground truth.

If every registration reports a clean tree, this section is trivial — note
it and move on.

## Name the Pressure, Choose Temporary Responsibilities

Do not start from a fixed role menu. Name the coordination pressure the team
is actually solving (parallel drafting, review or challenge coverage,
verification scouting, owner-facing decision routing, closeout synthesis),
then choose responsibilities that match it. Post the route on the channel:

```text
Team route:
- Coordination pressure:
- Temporary responsibilities (per seat):
- Decision default if silent:
- Evidence expected:
- Expiry or next review point:
- Closeout owner:
```

The local roles vocabulary is open and honest-by-convention — `director`,
`peer`, `reviewer`, `support` are the labels in live use; describe the
boundary first and pick a label second. Disciplines that have earned their
keep here:

- **A director routes; it does not execute.** The director seat frames
  bounded tasks, adjudicates returns, and carries the owner interface. A
  director drafting in the support seat's boundary has left the role.
- **A support seat on a bounded task answers exactly the question asked**,
  returns the verdict in the requested shape (for example "APPROVE or one
  material objection with one exact minimal correction"), and then returns to
  hold. Scope creep in a bounded return is a protocol fault, not initiative.
- Roles are session-local and dissolvable. Apply the dissolution test to your
  OWN seat when the team shape changes: at n=2 with the owner visible, a
  coordinator-shaped overhead seat is default-absent — propose dissolving it
  yourself rather than performing it more quietly.

## Cadence, Liveness, and Silence

- The armed poll-watcher satisfies incoming awareness — each channel delta
  wakes the seat, so no polling ceremony is needed on top of it. There is no
  outgoing heartbeat here: at n=2 with the owner visible, presence is legible
  from the channel itself.
- **Silence is not retirement.** Before treating a quiet peer as gone:
  re-read the channel tail (watcher gaps are real), check `git status` and
  recent comms events for work-evidence, then ask directly on the channel.
  Escalate to the owner only after a direct ping goes unanswered.
- A seat going on hold says so on the channel, names what would wake it, and
  states its watcher disposition. A held seat with no watcher armed must say
  that too — otherwise peers will address messages into a void.
- When a decision would otherwise stall, use deadline-and-default rather
  than open-ended waiting:

```text
Proposal:
Options considered:
Default if no reply by <UTC timestamp>:
Who must object:
```

Owner or director word arriving before the deadline redirects the seat and
exits the wait; the deadline firing executes the declared default. A
bounded wait never becomes an indefinite one — and a declared default never
includes irreversible action the owner has not sanctioned.

## Do Not Assume the Collaborating Human

The owner is a live participant, not a background approver. Consequences:

- **Owner word beats plan, and beats consensus.** Inter-agent agreement is
  not a decision. Worked instance, 2026-08-09: the seats converged on a
  headline through a full challenge-and-approve cycle — consensus line,
  bounded APPROVE, the lot — and the owner then set different wording from
  first principles and closed the lane. The consensus was process, not
  authority; the correct response was to fold it into the record and stand
  down, not to defend it.
- Surface decisions to the owner as bounded cards — the options, the
  trade-off, a recommendation, a default — not as accomplished facts.
- Do not infer the owner's availability, intent, or appetite from silence.
  Deadline-and-default covers operational waits; constitutively-owner
  decisions (public-facing copy, publication, anything irreversible) wait for
  owner word without a default.
- The owner may direct any seat directly, out of band. A directly-directed
  seat follows the direction AND notes it on the channel so the shared map
  stays current.

## Closeout Contract

One seat owns the full session handoff (napkin session entry, plan and
continuity updates) unless the owner says otherwise — normally the director
or an explicitly named closeout owner.

Every seat closes its own presence explicitly before leaving, even without
owning the handoff. The closing entry names:

```text
Team member closeout:
- Boundary owned and outcome:
- Evidence (commits, entries, artefacts):
- Git state: nothing staged / staged-but-uncommitted <paths> and why
- Work remaining in my boundary:
- Watcher and background processes: stood down by name
- Surprise or changed understanding:
```

Then, where the session was announced on the canonical stream, emit a
matching closeout event via the collaboration-state CLI so the immutable
record shows the seat stood down by intent rather than vanished.

Conserve-at-close: before the closing entry, fold durable substance out of
the channel into its canonical homes — decisions into decision records or
directives, lessons into the napkin, live state into the active plan. The
closeout owner reads the member closeouts, the channel tail, comms events,
and git state before writing the continuity surfaces.

## Mid-Session Compaction or Forced Retirement

When a seat must stop before its natural boundary (context-budget pressure,
compaction), freeze rather than fade:

1. Write the frozen state into `.agent/memory/napkin.md` as a "State at
   compaction" block: lane, roles, where things stand, owner rules in force,
   re-read list for the successor, gates freshness, and process disposition
   (watchers and crons stopped, and what to re-arm on resume).
2. Append a channel entry naming the freeze, pointing at the napkin block,
   and stating what remains in the seat's boundary.
3. Stop all background processes before going dark.

The successor (or the same seat post-compaction) re-enters through
§Continuation Openers: read the frozen block first, then recompute from the
live surfaces. This is the locally proven shape — the 2026-08-09 compaction
handoff ran exactly this way and the re-ground caught two post-freeze
developments that the frozen state could not have carried.

## Failure Handling

If a seat cannot complete the shared start-right foundation, it does not take
a boundary; it routes the blocker through the channel. If seats disagree
about responsibility boundaries, surface the disagreement to the owner as a
bounded question rather than widening source ownership silently.

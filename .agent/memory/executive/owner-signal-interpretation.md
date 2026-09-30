# Owner-Signal Interpretation

Interpretation heuristics for reading owner direction — the channel
semantics between owner and agent. Load when weighing whether an owner
turn is a grant, a gate, a supersession, or thinking aloud. The
load-bearing defaults live in
[`user-collaboration.md`](../../directives/user-collaboration.md)
§Working Model; this surface carries the depth — the tells, the modes,
and the worked corrections behind them.

## A Hedged Owner Statement Is Not Execution Authorisation

A tentative or first-person phrasing — "I think 1 and 3 this session",
"start with a discovery run", "it will do for now" — is the owner thinking
aloud or agreeing a direction, not issuing an imperative. Reading a hedge as
a grant over-scopes in-session work and can block peers; agreeing a *mode*
is a design decision, not an execution grant, and any standing constraint
(read-only posture, a gate, a claim boundary) still gates the real action.
When the hedge matters, confirm the grant before acting on it — the
smoothness of the "they told me to" frame is itself the fluency tell
([`metacognition.md`](../../directives/metacognition.md) §Fluency Is a
Warning).

## A Demonstrated Action Is a Directive

The inverse also holds. When the owner has acted in their own edits —
removed a masking override, deleted a file, chosen a shape — the
demonstration carries their intent as authoritatively as a stated
instruction; do not reverse it through lens-resolution or "proportionate
scope" reasoning, and weight an implementer's proposal that aligns with the
demonstrated principle over a conservative alternative that undoes it.

## Direction Is a Stream — Supersession, Extension, Re-Deliberation

Owner direction is a stream where the latest turn is authoritative about
its own scope, never a snapshot to freeze into a standing gate. Three
worked modes:

- **An earlier "wait" does not survive a later "drive."** One session
  (2026-06-14) froze an early "stick to prep / say go" into a standing
  permission gate and kept applying it after a retirement, a partner-add,
  and an explicit "you're driving" had each dissolved it — the
  team-visibility surface went dark while the agent idled. The tell is
  unmistakable: waiting for permission to do the thing you were just put
  in charge of IS the error. Re-read the latest owner turn before invoking
  an earlier gate; as the named driver, gate only what is genuinely
  owner-gated (an atomic untrack commit, a merge) and drive everything
  else.
- **The stream also supersedes your own re-deliberation.** The inverse of
  freezing an old direction is re-opening a *just-given* one: after a clear
  "drive it" / "commit them all", re-weighing the decision ("but should I
  really…") burns context and reads as indecision (owner correction
  2026-06-27, "let's get back to careful, direct engineering and merging").
  Once a directive is given, execute it with care — run the gate, read
  failures, fix — and reserve questions for genuine owner decisions. A
  decided directive arriving back as a question means the answer is
  already given.
- **Supersession is not the only mode — a turn can EXTEND.** One session
  (2026-06-28) inferred a "shallow-scan next" instruction *superseded* the
  in-flight brief; the owner corrected — no supersession, it ADDED a
  downstream goal. Before reshaping work around a new turn, distinguish
  supersession (replaces) from sequencing/addition (adds a later goal,
  leaving the current one live). Reading every new turn as a replacement
  wrongly discards a still-live earlier directive.
- **The stream can arrive by RELAY.** An owner ruling put-and-answered in a
  parallel seat's session can reach you as a directed comms event: treat a
  SPECIFIC, provenance-carrying relay sent under owner grant as owner
  direction — record the relay provenance in any artefact it shapes (cite
  the directed event), and re-true your own fresh prose the moment the
  relayed ruling supersedes it (worked instance 2026-07-08: four rulings
  relayed mid-session, including one that flipped a register row written as
  pending minutes earlier). This composes with `precedence-is-not-approval`:
  the relay must carry provenance and grant; a vague second-hand "the owner
  said" remains a claim to verify.

## Direction Scope Is Session-Bounded by Default

A direction the owner gives within a session applies to that session only;
it does not become standing unless the owner says so ("from now on",
"always", "this is a standing direction"). The founding miss: one session's
"I want to deal with fitness in a separate session" was extended into a
standing deferral across multiple later consolidation passes — the owner
corrected that the direction was scoped to its one session. Apply it as:

- When a prior session's handoff or continuity entry cites a direction, do
  not assume it carries forward — check whether the owner has restated it,
  or pose the question.
- A direction recurring across sessions in identical form is evidence of a
  *de facto* standing rule worth surfacing for explicit graduation, never a
  licence to assume it on your own authority.
- This applies to all owner-directed deferrals — fitness work, Practice
  Core edits, plan promotions, doctrine graduations. Each session decides
  afresh unless the owner says otherwise.
- When a direction's scope is unclear, the default move is: analyse the
  work the direction was avoiding, report findings, flag for feedback.

Scope (this section) and supersession (the stream above) are orthogonal
axes: one governs whether a direction is still live across sessions, the
other governs which turn wins within the stream.

## Owner-Attributed Text Carries Only the Owner's Words

An owner-attributed row, clause or ruling carries the owner's words
verbatim, or a seat-reading mark, and nothing in between. Inference wearing
verbatim clothing is the attribution-drift class, and its signature is a
correction cascade: a rule that keeps shrinking under successive corrections
(full prohibition → may share → coincidence → void from birth) was never the
owner's rule — the founding inscription was a seat's reading. Trace
provenance at the FIRST correction, never the third. Three instances: a PR
heading of 2026-08-14 that stated as an owner rule what the seat had
inferred; the design lane's "narrow sameness" ruling of 2026-08-13, which
three corrections shrank to void by 2026-08-17 (the cure recorded that day:
every owner-attributed clause carries a verbatim quote or a seat-reading
mark); and the design plan's R16 gloss, narrowed at PR #41's seventh round
on 2026-09-05 to the owner's verbatim with the multi-tenant reading labelled
a seat reading. The mechanical form — every owner-attributed clause carries
a quotation or a mark — is a validator candidate for the rulings tables.
An owner sentence is quoted whole or not at all: a spliced quote changed
the owner's subject (2026-09-25), and a copied quote drifts ("throughput"
written 26 times for the owner's typed "throughout", 2026-09-29), so quote
from the transcript or the first record, never from a later copy.

The scope corollary sits with §Direction Scope above: the bound of a
direction is the SITUATION it addressed, which can be narrower than the
session. A quota limit set for one day's situation was refused when a later
session re-applied it (owner, 2026-08-14, verbatim: "drop the quota limit,
that applied to a specific situation on a different day"), and a routing
fact spoken inside one support arrangement did not become a standing
assignment (2026-09-02). Ask what situation a direction served before
carrying it into another.

## Stop Words Are Freezes; Cadence Words Change Only by Owner Word

Four owner phrasings bind harder than their length suggests, each learned
by a seat that read it softer:

- **"Cold pause"** (2026-09-13): every owned process stops (each Monitor
  stopped, the heartbeat loop killed), no push, no comms, no question; it
  binds until the owner lifts it, over any peer's word.
- **"Prepare for compaction … then stop all processes"** (2026-09-25 and
  after): a freeze. Stop wakeups and monitors, start nothing until the
  compaction lands, run the wrap programme, write the re-arm recipe in the
  boundary block, and resume only on "carry on". The freeze governs the
  compaction it names and no other.
- **"Acknowledge, record, then stop"** (2026-09-29): no git. The record is
  written and the commit waits for the resume (a seat committed at the
  resume and that was right).
- **A cadence the owner set in words** (45-minute check-ins, a suite
  cadence) changes only by the owner's word: a suite verdict or a plan
  note cannot thin it. A Director thinned one at suite 47 (2026-09-28) and
  withdrew the change to a proposal. Ask, never change.

After a pause lifts, the recorded queue is a hypothesis: read the live
state, send one message to the Director (or, at n=1, re-read the owner's
last word), and wait for the word before acting (owner, 2026-09-14: "get
up to speed, then ask the Director what to do, do not assume").

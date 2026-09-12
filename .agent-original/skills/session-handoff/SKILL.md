---
name: session-handoff
classification: active
description: >-
  Lightweight end-of-session continuity update with a conditional
  consolidation gate — the continuity component run at every session
  close (inside wrap when wrap is the close entry point) or whenever
  work pauses and the next session must resume from the next task
  rather than re-auditing the repo. Use when asked to hand off, wrap
  up, close a session, checkpoint, or pause work. Covers the landed
  outcome, active-plan and roadmap sync, napkin and distilled capture,
  the promises sweep, the context-loss scan, verbatim git-state
  reporting, gate freshness, and the consolidation gate.
---

# Session Handoff

Imported and adapted 2026-08-09 from the Oak Open Curriculum Ecosystem Practice.

**Scope**: **SESSION-SCOPED.** This workflow runs at the end of a single
session and acts on session-scoped artefacts — the session's surprises, the
session's subjective experience, decision-record candidates surfaced during
the session, the plan the session touched. Cross-session convergence (pattern
extraction, doctrine graduation, napkin rotation, fitness management) belongs
to `.agent/skills/consolidate-docs/SKILL.md`, which runs at a slower cadence.

**Governance**: the learning path for surprise and correction is
`capture → distil → graduate → enforce`. The napkin
(`.agent/memory/napkin.md`) is the capture surface,
`.agent/memory/distilled.md` the refinement surface, `consolidate-docs` the
graduation convergence point, and rules, directives, decision records, and
permanent docs the enforcement surface. Session handoff is the **capture
edge** of this pipeline — it produces the surfaces `consolidate-docs` later
distils.

If a handoff discovers that a live buffer needs rotation or archive lifecycle
work, it may record the need, but the first mutating action is to **verify the
substance is live in its permanent home** before any archive, rename, park,
supersession, or replacement move. Do not create a disposition ledger; the
commit and the permanent home are the record. A handoff must not turn "fitness
is high" into "move the source"; the action is conserving and homing insight,
and any fitness validator is only evidence about routing and rest-state
health.

## Conservation Invariant

The value of this workflow is conserving and correctly homing insight. Fitness
numbers, line counts, and buffer sizes are diagnostic signals, never goals. Do
not chase lower numbers, trim understanding, or skip capture to keep a surface
green. Capture the knowledge at full weight, route it to the right home, and
let any fitness improvement happen only as the side effect of real curation.

**Relationship to `wrap` and `consolidate-docs`**: this workflow is the
continuity component `.agent/skills/wrap/SKILL.md` runs at every session
close; it is not itself the close entry point. Handoff and `consolidate-docs`
are one knowledge-flow pair with different cadences: handoff captures the
session's landed outcome, live state, and surprises (and may conserve an
already-sharp cross-session lesson directly in `distilled.md`, step 3);
consolidation runs only when its trigger checklist fires and decides what
graduates out of temporary or refinement surfaces. Do not inline the
consolidation inventory here.

Do **not** treat this as a full closeout ritual. Unless the owner explicitly
asks for more, this workflow must not trigger full review, commit or push, or
deep convergence by default.

**Work is safe** only when it is committed and pushed — and on a PR when the
owner's flow requires one. Handoff itself does not commit, but it must report
against that definition honestly: if the session's work is not safe by that
definition, the handoff says so explicitly rather than implying safety.

## Session Shape Check

Before running the steps below, classify the session shape. The default is
**sole contributor**.

Sessions in this repo are solo or small pairings (typically n=2) sharing
**one** checkout, coordinated over an ARC channel (append-only markdown under
`.agent/collaboration/rapid-comms/`) plus comms events on the canonical stream
in `.agent/state/collaboration/comms/`. You are in a shared-session closeout
only when the current work has an explicit shared route: the owner asked for a
pairing, a live ARC channel names seats and responsibilities, or current
comms events assign you a closeout boundary. Historical comms, dirty files,
or the mere possibility of other agents do not.

### Sole contributor

Run the steps below directly. Do not wait for peer syntheses or downgrade
your responsibility to a boundary note.

### Shared-checkout closeout

If a live pairing is in flight, remember that peer staged or uncommitted work
may exist in the shared working tree. Never commit it: if this closeout
commits at all, stage by **explicit pathspec** only — a broad `git add -A` at
close sweeps a paused peer's uncommitted WIP into your commit. Worked instance
2026-06-07: a peer's "commit all my files" close swept another agent's paused
WIP carrier change into the commit, landing broken code that then needed a
forward revert.

Before editing canonical continuity surfaces, reread the ARC channel and
recent comms events, and synthesise: preserve useful nuance from peer notes,
but do not paste every note into canonical surfaces. If you own only a
boundary of the session, leave a boundary-scoped closeout note on the ARC
channel (boundary owned, outcome, evidence, git state, surprises, blockers,
handoff needed) and stop there unless given a further assignment.

## Mid-Session Light Update (distinct, lighter cadence)

Between session open and this skill's close-out sits an intermediate cadence:
the **mid-session light update**, an autosave for a long session. Run it when
the owner asks for a checkpoint, at a natural pause between phases (commits
landed, more to do), before a long reviewer batch, or when approaching a
context threshold with work remaining — so a disconnect, agent swap, or
context loss lands the next reader on coherent surfaces.

Additive only, never rewrites: append a short napkin entry (commits landed,
decisions, next step); if a pairing is live, append a short ARC-channel entry;
light-touch the active plan's current waypoint. Do NOT run consolidation moves
at this cadence — no napkin/distilled promotion, no pattern graduation, no
plan lifecycle moves, no retrospective memos; those are close-out work, this
skill's §Steps.

## Steps

1.  **Record the landed outcome (or unlanded case).** Report against the
    session's opening intent — the active plan's next task or the owner's
    stated goal. If it landed:

    > Landed: `<outcome>` — `<evidence>` (commit SHA, test, artefact path).

    If it did not land:

    > `<what was attempted>` — `<what prevented>` — `<what next session re-attempts>`.

    The `<what prevented>` field MUST satisfy the **deferral-honesty
    discipline**: a named constraint (clock, cost, dependency, owner veto) or a
    named priority trade-off, plus evidence establishing it, plus
    falsifiability (how a future agent could check whether the constraint or
    trade-off held). Convenience phrasings — _"budget consumed"_, _"out of
    scope"_, _"for later"_, _"next session"_, _"ran out of time"_ — are not
    acceptable; replace with the underlying constraint or trade-off and the
    falsifiability check.

    An unlanded case MUST propagate into the active plan's next task (step 2)
    so the commitment persists across the session boundary.

    When the landing completes (or archives) a plan, analyse its user stories
    rather than blind-copying or dropping them: disposition each as **served**
    (conserve its value-narrative — the "so that…" clause naming who benefits
    and to what end — into the permanent home: the skill description, the
    decision record's Context section, the README purpose line), **deferred**
    (carry forward as intent), or **obsoleted** (record as a learning, never
    harvest as if true). Delivered work has three knowledge layers — that it
    works, how it works, why it matters — and archival reliably conserves the
    first two while dropping the third; the why is the most valuable and most
    easily lost layer (owner direction 2026-06-22).

2.  **Sync the authoritative next-action surfaces.** These are the repo's
    continuity surfaces; keep them compact and operational, answering only
    "what is live right now?".
    - **Active plan**: update the phase status and next task in the plan under
      `.agent/plans/active/`, and its one-line context in
      `.agent/plans/active/README.md`. Plans are the tracking surface in this
      repo — there is no external ticket system.
    - **Reconcile linked surfaces in the same pass**: any prompt surfaces under
      `.agent/prompts/` the session touched, the roadmap tables in
      `.agent/plans/roadmap.md`, and parent-plan tables. Do not duplicate plan
      authority; clarify it.
    - **If platform or Practice surfaces changed** (skills, rules, commands,
      adapters), update `.agent/practice-index.md` and
      `.agent/reference/cross-platform-agent-surface-matrix.md` in the same
      pass, and note that `pnpm portability:check` and `pnpm subagents:check`
      need running (step 13).

    **Role-boundary check before writing**: classify every proposed addition.
    Scope, sequencing, and acceptance criteria → the active plan. Short-lived
    tactical signals and session evidence → `.agent/memory/napkin.md`.
    Cross-session lessons → `.agent/memory/distilled.md`. Settled policy or
    architecture → directives, rules, or decision records. Historical closeout
    prose → git history, unless it still changes the next safe step. At close,
    promote any short-lived tactical signal worth keeping into the plan or the
    napkin; the rest lapse with the session.

3.  **Capture surprises and conserve cross-session lessons.**

    **3a. Napkin capture.** Record any new surprises, corrections, or
    expectation failures from this session in `.agent/memory/napkin.md`, using
    the structured surprise format from `.agent/skills/napkin/SKILL.md`.
    Record fresh evidence and unresolved blockers there too.

    **3b. Conserve cross-session lessons in `distilled.md`.** Ask whether this
    session produced a behaviour-changing lesson that a future agent should
    read at session start. If the lesson is still raw, local to the session, or
    needs more evidence, leave it in the napkin. If it is already sharp enough
    to guide future sessions but has no stable permanent home yet, add or
    refine a compact entry in `.agent/memory/distilled.md` with its source
    session and routing. If it is stable and naturally belongs in a rule,
    directive, decision record, or pattern under `.agent/memory/patterns/`,
    route it as a candidate (step 6) instead of parking it in `distilled.md`.

    This is a conservation edge, not a mini-consolidation pass: do not sweep
    old distilled entries, rotate the napkin, or inventory the whole learning
    loop here. Preserve the new insight at full weight; if the write creates
    size pressure, record the pressure and route the structural follow-up
    rather than trimming the lesson.

4.  **Curate untracked and out-of-repo knowledge sources.** Version history is
    not a backstop for these surfaces, so extraction at session close is
    **non-optional**, not auxiliary.
    - **Comms tier.** `.agent/state/` is untracked by design. Scan comms
      events authored by your session AND events addressed to your session in
      `.agent/state/collaboration/comms/` and the generated
      `.agent/state/collaboration/shared-comms-log.md`. These carry
      coordination substance: owner direction captured inline, inter-agent
      surprises, tooling friction, the timeline of decisions. Mirror any entry
      that would change next-session behaviour into the napkin using the
      structured surprise format. Do not rewrite or delete event files here —
      this step is a read-source for extraction, not rotation.
    - **ARC channels.** Any live channel under
      `.agent/collaboration/rapid-comms/` follows conserve-at-close: fold
      durable substance into canonical homes before session end (step 11
      closes the channel itself).
    - **Out-of-repo platform plans.** Platform plan surfaces outside the repo
      (`~/.claude/plans/` and files like them) are instance-tier knowledge on
      the same footing as the comms tier: durable substance in them is lost
      when the instance ends unless curated up. Scan the current platform's
      plan surface and route any repo-relevant substance to a tracked home,
      recording `not present` if the surface is absent rather than skipping
      silently.
    - **Platform per-user memory (auxiliary input).** Vendor tools maintain
      per-user memory outside the repo. Check the surfaces for platforms in
      use — Claude Code: `~/.claude/projects/<project>/memory/`; Codex:
      `~/.codex/memories/` and `~/.codex/history.jsonl`; Cursor:
      `~/.cursor/chats/` and `~/.cursor/prompt_history.json`; Gemini CLI:
      `~/.gemini/` when present. If a surface is absent or inaccessible,
      record that fact instead of silently skipping. Mirror behaviour-changing
      entries into the napkin. These are vendor-managed surfaces — do not
      rotate, archive, or delete them — but unmirrored material remains live
      for consolidation rather than being considered processed.

    Symmetry note: the same surfaces are read at session open by
    `.agent/skills/start-right-quick/shared/start-right.md` and at
    cross-session depth by `consolidate-docs`; session-handoff is their
    session-close edge.

5.  **Conserve grounded execution knowledge.** Distinct from the surprise
    capture (3a) and the cross-session lesson (3b): a session also produces
    **grounded execution knowledge** — facts it verified first-hand to do the
    work, plus failed-approach learnings — that the next agent would otherwise
    re-derive. This is not a surprise and not a general lesson; it is consumed
    by a _specific_ next executor, so conserve it at the CONSUMER's durable
    home (the owning plan, or the prompt surface the next session reads), not
    only the napkin. Check, concretely:
    - **Verified facts the next agent would re-derive** — a contract confirmed
      at a named file:line, a dependency checked, a version or vendor
      behaviour pinned, a data shape confirmed against the source.
    - **Facts grounded by SUB-AGENTS this session** — a sub-agent's context is
      already gone, so a fact a reviewer or explorer verified survives only if
      you conserve it explicitly. These are the most loss-prone.
    - **Failed-approach learnings** — what was tried and why it did not work,
      so the next agent does not repeat the dead end.
    - **Resolved-but-still-load-bearing knowledge** — knowledge whose
      triggering surprise has since resolved (e.g. a reverted change) but
      which stays load-bearing for a downstream consumer; a surprise-shaped
      sweep drops it precisely because the surprise is gone.

    Route each finding to the surface the consumer reads, citing the durable
    home. "Nothing to conserve" is a valid answer reached by checking, not by
    skipping.

6.  **Surface decision-record candidates and open questions.** Ask explicitly
    at every session close: _"Has this session surfaced an architectural
    decision worth an ADR? A Practice-governance decision worth a PDR? An
    amendment to an existing record? A pattern for
    `.agent/memory/patterns/`?"_ If yes, record the candidate as a distinct
    napkin entry with a `candidate:` tag naming the graduation target and
    trigger condition; `consolidate-docs` promotes it. This is capture only —
    graduation happens at consolidation. If nothing qualifies, say so and move
    on: _"nothing qualifies"_ is a valid answer reached by asking, not by
    skipping.

    Likewise ask: _"Has this session surfaced a non-urgent planning, design,
    or process question whose answer shapes future work, cannot be answered
    cheaply now, and does not block the current cycle?"_ If yes, record it in
    the napkin (or in `.agent/plans/roadmap.md` when it belongs to a named
    workstream). Do not duplicate questions already owned by an active plan or
    decision record; point to the owning artefact instead. Urgent
    owner-direction questions stay in chat.

7.  **Subjective experience — strictly voluntary.** Recording subjective
    experience is voluntary. There is no obligation, quota, or capture edge to
    fill, and the corpus is not monitored for volume or thinning. Pressure to
    record distorts both the motivation and the result (owner direction,
    2026-06-06). Subjective experience is valued _when it is genuine_ — but
    valuing it is not mandating it. When a session carried a felt shift —
    insight, surprise, friction, something that went differently from
    expectation — and you want to record it, write
    `.agent/experience/<date>-<slug>.md` per the convention in
    `.agent/experience/README.md`. Before writing, take the conceptual
    framework above and discard it; frame _your_ experience in the way that
    feels right to _you_. Step back and reflect as many times as you need to —
    this is for you. A reflection performed because a session ended is noise
    that pollutes the register; a session with no genuine shift, or one where
    the agent simply does not record, writes nothing here, and that is an
    ordinary outcome — not an evasion.

    **The experience file is for _subjective experience_ — what the work was
    like, not what was done.** Applied technical patterns and settled doctrine
    belong elsewhere: cross-session lessons in `distilled.md`, pattern
    candidates in `.agent/memory/patterns/`, decision-record candidates under
    step 6. If a session produces both, split them — a short experience file
    for the texture, and the technical insight in its proper durable home.
    Cross-session reading of accumulated experience files belongs to
    `consolidate-docs`, which protects the subjective register and recovers
    stranded technical content — never measures whether enough were written.

8.  **Sweep platform entry points for drift.** Open each platform entry-point
    file at the repo root — `CLAUDE.md`, `AGENTS.md`, and any analogous entry
    point present.

    **Default contract**: heading + a one-line pointer to
    `.agent/directives/AGENT.md`. **Named extensions**: `CLAUDE.md` and
    `AGENTS.md` each carry their documented adapter-model section (the thin
    mapping from `.claude/` or `.agents/`+`.codex/` back to `.agent/`) —
    that section is part of their contract, not drift. The default-plus-
    extensions shape is forward-compatible: a new platform's entry-point file
    gets the default pointer immediately, and named extensions are added later
    only where the platform's behaviour requires them.

    Anything beyond the default or a named extension is **drift**: an
    instruction, fact, or note added directly to the entry point instead of
    routed through canonical surfaces. Entry-point drift is insidious because
    platforms consume different entry points; a fact living only in `AGENTS.md`
    is invisible to Claude, and vice versa. For every piece of drift found:
    classify the substance, match it to a destination (directive, rule, skill,
    plan, napkin), surface non-trivial moves to the owner, move the content,
    then strip the entry point back to its contract shape. All content must be
    moved to a permanent home or, if not useful, removed — silent deletion
    without homing is not the default. The sweep is session-scoped because
    drift accrues incrementally ("a quick note added to AGENTS.md" is a
    recurring failure mode).

9.  **Promises sweep.** Enumerate every promise or commitment voiced during
    the session — to the owner in chat, to a peer on the ARC channel, in a
    commit message or plan note: _"I'll do X after Y"_, _"next I'll…"_,
    _"leaving Z for the follow-up"_. For each, one of three dispositions,
    stated explicitly: **done** (with evidence), **rescheduled** (written into
    the active plan or napkin as a next task, not merely remembered), or
    **withdrawn** (said out loud with the reason). A promise that survives
    only in the conversation transcript is lost at exactly the boundary this
    skill guards. Silence is not a disposition.

10. **Loss-sweep + first-hand claim verification — every handoff.** Two
    parts, both fire **every** handoff — universal, NOT high-stakes-only (a
    quality bar tiered to "high-stakes" decays to its lowest tier in
    practice; excellence is the default, only the _means_ scale).

        **10a. Verify the handoff's own load-bearing claims first-hand, at
        write-time.** A handoff author cannot self-verify from memory: the author
        holds the context whose loss the handoff guards against, so a felt-true
        claim re-affirms rather than falsifies. Ground every fact the handoff
        asserts — tree state, commit SHAs, ahead/behind, file:line citations,
        version facts, gate green-ness — against its source (the git command, the
        file, the gate output) AS YOU WRITE IT, never from memory. Worked
        instance 2026-06-07: a handoff's "branch unpushed" was false (4 ahead of
        a live origin) and its file citations were off — both asserted from
        memory.

        **State `git status --branch` output verbatim in the handoff — never a
        bare "all pushed".** For unpushed counts, use the branch's own upstream —
        `git rev-list --count @{u}..HEAD` — never `origin/main..HEAD`, which
        counts divergence-from-main: a different and much larger number,
        misreported at exactly the push-decision moment. Never hand-construct the
        remote ref (`origin/<branch>`): branch names carry slashes, and a typo
        yields a non-existent ref that errors or silently reads as
        false-unpushed — `@{u}` is resolved and slash-safe, and a "ref unknown /
        not an ancestor" result is suspect until the ref is confirmed to exist.
        Never escalate a push/sync discrepancy to the owner before it is
        confirmed against the authoritative ref (worked instance 2026-06-08: a
        hyphen-for-slash ref typo escalated a "5 commits unpushed" alarm on a
        fully-synced branch).

        **10b. Run the loss-scan from inside your own context — it cannot be
        delegated.** After the categorical edges (steps 3–9), sweep _against the
        grain of "it is all captured"_: _"If this context ceased now, what would
        be lost — and fits none of the categories above?"_ This is **the
        context-holder's exclusive job, by definition.** Loss is `(what you hold

    in context) − (what the durable artefacts capture)`; only the holder can
    see the left side of that subtraction. A context-isolated reader sees
    only the artefacts, so it can VERIFY them — ground each claim against
    source, flag what is ambiguous, stale, or internally inconsistent — but
    it **cannot detect loss**: it never had your context to subtract from.
    Asking a third party "what would be lost?" returns an artefact audit, not
    a loss-scan; never conflate the two. So enumerate, from inside your own
    context, class by class: decisions made, rationale, rejected
    alternatives, grounded knowledge, promises, owner direction — anything
    still held that reached no durable surface — and route each to its
    consumer's durable home (per step 5); fence stale content a fresh reader
    would misread. The externalised fresh-reader pass remains valuable as the
    **verification** complement to 10a — run it for that, never as the
    loss-scan (owner correction 2026-06-07: this replaces a prior
    "externalise by default" framing that inverted the loss-scan's
    ownership). "Nothing survives the sweep" is a valid answer reached by
    asking, not by skipping.

        **Loss-scan findings are ALWAYS written to the napkin** (owner standing
        rule, 2026-07-07) — never chat-only narration. The napkin is the surface
        the pipeline distils from; a scan whose findings live only in the closing
        message loses them at exactly the boundary the scan guards. Write
        findings AT OCCURRENCE where possible: an end-of-session batch competes
        with completion drive at the precise moment judgement degrades
        (fluency-at-the-finish-line — four worked instances in one closing
        stretch, 2026-07-07), and a loss-scan is a snapshot that rots at the
        speed of the session. When handing off with an in-flight sub-agent,
        prefer stop-then-characterise over hand-off-blind: stop it, run the
        verification chain yourself, and freeze a verified state — verified-green
        completed work is landed (committed and pushed), never handed off
        uncommitted-on-disk (worked instance 2026-07-07: an "about to re-run
        tests" unknown-partial converted to a verified-green ready-to-land
        handoff).

11. **Close collaboration surfaces.** If a pairing was live this session:
    - Append a conserve-at-close entry to the ARC channel under
      `.agent/collaboration/rapid-comms/` (append-only; compose the full
      entry, timestamp included, before a single append; never edit prior
      entries), confirming durable substance has been folded into canonical
      homes and naming your seat's end state.
    - Emit any final comms event on the canonical stream via the OOCE
      `collaboration-state` CLI, run from the oak-open-curriculum-ecosystem
      checkout with `--repo-root` pointing at this repo.
    - Hand off or explicitly release any obligation your seat created. "No
      open obligations" is stated, not assumed.
    - Apply the shared-checkout staging caution from §Session Shape Check to
      any commit this closeout makes.

    If no pairing was live, state that explicitly so "nothing to close" is
    observable.

12. **Run the consolidation gate.** Check the trigger checklist in
    `.agent/skills/consolidate-docs/SKILL.md`.
    - If no trigger fires, record `consolidation: not due — <reason>` in the
      napkin session entry and continue to step 13.
    - If one or more triggers fire and the work is well-bounded for this
      closeout, run `consolidate-docs` now and record
      `consolidation: completed this handoff — <reason>`.
    - If due but not well-bounded, record `consolidation: due — <reason>` so
      the next session picks it up deliberately.

13. **Verify gate freshness.** A sole-contributor or closeout-owner handoff
    cannot be marked complete while `pnpm check` is red or carries warnings.
    Run `pnpm check` from the repo root (restart-on-fix: after any fix,
    restart from the top). The outcome routes one of three ways:
    - **Green** — handoff may complete; record the green run.
    - **Red on this session's work** — fix before declaring complete.
      Broken code never leaves a session; out-of-scope framings are not
      acceptable.
    - **Red on pre-existing unrelated breakage** — every red gate is
      blocking regardless of cause, location, or scope (owner-stated
      standing, 2026-05-14). Either cure it in this session, or surface the
      blocker to the owner with evidence and stop. Do not bundle a handoff
      over a red gate.

    Then **state which other gates and validators are fresh and which need
    rerunning** for the work in flight: `pnpm test:e2e`,
    `pnpm vital-surfaces:check`, `pnpm portability:check`,
    `pnpm subagents:check`, and the advisory
    `pnpm practice:fitness:informational` and `pnpm fitness-vocabulary:check`.
    "Fresh as of `<SHA>`" or "needs rerun because `<surface changed>`" — not
    a bare list.

    **Singleton in shared sessions.** When two agents share one checkout,
    only one runs the whole-repo `pnpm check`: announce on the ARC channel
    before running, defer if a peer's run is in flight, and broadcast the
    result (green, or red with first blocker) with the HEAD SHA at run time.

14. **Dispatch PENDING reviewers if the session touched a plan body.** If the
    active plan carries PENDING reviewer markers AND this session touched the
    plan's body, dispatch the pending reviewers as a session-close move
    before declaring handoff complete. Parallel sub-agent calls absorb
    verdicts in roughly the time of one reviewer, so the next session opens
    with the gate cleared rather than re-inheriting the dispatch obligation
    (worked instance 2026-05-22: two PENDING markers persisted across two
    sessions; a parallel dispatch at close took about a minute). Skip only
    when the plan body was not touched this session, or when the reviewers
    would need a working tree that is not this session's — and in both cases
    name the pending reviewer list in the handoff narrative.

15. **Keep the boundary clean.** Session handoff includes the consolidation
    gate and can escalate into `consolidate-docs` when appropriate, but
    ordinary sessions remain lightweight. It does not smuggle in review or
    git actions; commit and push route through `.agent/skills/wrap/SKILL.md`
    or the owner's stated flow. **Success**: the next session can start from
    the active plan (via `.agent/skills/start-right-quick/SKILL.md`) and
    resume work without re-auditing the whole repo.

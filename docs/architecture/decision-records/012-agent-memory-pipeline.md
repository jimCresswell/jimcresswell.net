# ADR-012: Agent memory pipeline — funnel to canonical documentation

## Status

Accepted

## Date

2026-02-20

## Context

AI agents working on this codebase accumulate valuable insights during sessions: user corrections, workspace gotchas, editorial preferences, architectural facts. Without a system, these insights are lost between sessions, leading to repeated mistakes and rediscovered knowledge.

A naive approach would store agent memories in agent-specific files (AGENTS.md, CLAUDE.md) and leave them there. This creates a problem: the knowledge is hidden in locations that only agents read, using conventions that only agents understand. A human contributor, or an agent without knowledge of the memory system, would never find it.

## Decision

Agent memory flows through a pipeline that funnels all insights toward canonical documentation locations — the same places a human or agent would naturally look without any knowledge of how the memory system works.

### The pipeline

Two feeds converge on a staging area (`distilled.md`), from which settled entries graduate to permanent documentation:

```text
napkin.md ──────────┐
                    ├──► distilled.md ──► permanent docs
AGENTS.md ──────────┘    (staging)        (rules.md, AGENT.md,
(continual-learning                        editorial-guidance.md,
 landing pad)                              ADRs, EDRs, docs/)
```

**Feed 1 — napkin** (`.agent/memory/napkin.md`): Session-level mistakes, corrections, and patterns logged during active work. The [napkin skill](../../../.cursor/skills/napkin/SKILL.md) governs this feed.

**Feed 2 — AGENTS.md**: Insights mined from conversation transcripts by the continual-learning skill. AGENTS.md is a landing pad, not a permanent home.

**Staging — distilled.md** (`.agent/memory/distilled.md`): A compact, curated quick-reference. Entries live here temporarily until they are settled enough to graduate. The [distillation skill](../../../.cursor/skills/distillation/SKILL.md) governs extraction, merging, and pruning.

**Graduation — permanent docs**: The [consolidate-docs command](../../../.cursor/commands/consolidate-docs.md) moves settled entries to their canonical homes: `rules.md` for engineering rules, `AGENT.md` for agent behaviour, `editorial-guidance.md` for editorial principles, ADRs for architectural decisions, EDRs for editorial decisions, and `docs/` for everything else.

### Anchors prevent re-extraction

When an entry graduates from AGENTS.md, it is replaced with an **anchor** — a brief pointer to where the content now lives. Anchors prevent the continual-learning skill from rediscovering and re-adding the same insight from old transcripts.

### Key invariant

Every insight eventually reaches a location that is discoverable without knowledge of the pipeline. A human reading `rules.md` finds the CSS rem/em rule. An agent reading `editorial-guidance.md` finds the register descriptions. Neither needs to know that these entries originated in a napkin session or a transcript mining run. The pipeline is invisible to consumers — only producers need to understand it.

## Consequences

- **No hidden knowledge.** All agent-learned insights end up in the same documentation a human contributor would read. The pipeline does not create a parallel knowledge base.
- **Incremental filtering.** Each stage filters for signal. Raw observations in the napkin become terse entries in distilled.md, which become carefully placed permanent documentation. Low-signal entries are pruned rather than accumulated.
- **Three files to maintain.** The napkin, distilled.md, and AGENTS.md all require active maintenance. The distillation and consolidation processes must be run periodically, or the staging area grows stale.
- **Anchor overhead.** AGENTS.md accumulates anchors over time. These are low-cost (one line each) but the file grows monotonically unless old anchors are periodically reviewed.
- **No automated graduation.** Moving entries from distilled.md to permanent docs requires editorial judgment about where each entry belongs. This is manual and deliberate, not automated.

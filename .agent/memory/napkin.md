# Napkin

## Session: 2026-02-20 — Continual Learning, Consolidation, Documentation Pipeline

### What Was Done

- Mined 25 transcripts (Jan 28 – Feb 20) via continual-learning skill. Initial extraction produced 13 user preferences and 22 workspace facts in AGENTS.md.
- Verified all AGENTS.md entries against actual codebase, ADRs, EDRs, and directives. Found 2 wrong (reference-style links never existed; headline was superseded), 1 not-yet-implemented (pronouns/honorific), and 11 low-signal entries. Corrected and trimmed.
- Consolidated all documentation: moved orphaned entries from distilled.md and AGENTS.md into permanent homes:
  - rules.md: CSS rem/em, gate restart, branches for risky changes, content in JSON, permanent docs never reference ephemeral
  - AGENT.md: don't push commits, verify claims, plans standalone/discoverable, archive docs historical, listen to user priorities
  - editorial-guidance.md: two register descriptions, front page distinction, product safety, collaborative credit, editorial process note
- Rewrote AGENTS.md as anchors-only (landing pad for continual-learning, not a permanent home).
- Updated distillation skill to clarify the full pipeline: transcripts → AGENTS.md → distilled.md → permanent docs. Each stage filters for signal. Only anchors remain in AGENTS.md.
- Trimmed distilled.md to 5 workspace quick-reference entries + troubleshooting table. Everything else now lives in permanent docs.

### Patterns to Remember

- AGENTS.md is a landing pad, not a destination. Continual-learning deposits entries; distillation moves them to distilled.md; consolidation moves them to permanent docs. Anchors remain to prevent re-extraction.
- The distillation skill (step 1, Extract) already listed AGENTS.md as a source to check — but the instruction to remove processed entries and leave anchors was missing. Now explicit.
- "Work on branches" is a CSS and Accessibility section item in rules.md — slightly odd placement, but it's about protecting main from deploy failures, which relates to the same "don't break production" concern as the postcss gotcha.

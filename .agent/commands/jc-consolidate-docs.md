# Consolidate Docs

1. Make sure all plans and prompts are fully up to date (status lines, completion markers, cross-references).
2. Identify any content in ephemeral locations (plans, prompts, napkin, distilled.md, AGENTS.md) that now functions as settled documentation, and move it to non-ephemeral locations such as ADRs, `/docs/`, or READMEs.
3. Check whether `distilled.md` contains entries that are now, or should be, captured in permanent documentation — if so, (re)move them from `distilled.md` (the distilled file should only hold what is NOT already in permanent docs).
4. If the napkin exceeds ~500 lines, follow the distillation skill (`.agent/skills/distillation/SKILL.md`) to rotate it.
5. Check fitness ceilings on all directives and permanent docs — compare current line counts against `fitness_ceiling` in YAML frontmatter. Flag any that exceed their ceiling.
6. Check the practice box (`.agent/practice-core/incoming/`) for incoming practice-core files. If present, alert the user and follow the Integration Flow in `.agent/practice-core/practice-lineage.md`.
7. Audit cohesion: verify practice-core internal consistency, practice-index links, and broader Practice alignment. No stale descriptions, no contradictions, no outdated wording.
8. Consider practice evolution: has any learning from this session cleared the three-part bar? (Validated by real work? Would its absence cause recurring mistakes? Stable?) If so, propose changes to the relevant practice files.

# consolidate-docs

1. Make sure all plans and prompts are fully up to date (status lines, completion markers, cross-references).
2. Identify any content in ephemeral locations (plans, prompts, napkin, distilled.md) that now functions as settled documentation, and move it to non-ephemeral locations such as ADRs, `/docs/`, or READMEs.
3. Check whether `distilled.md` contains entries that are now, or should be, captured in permanent documentation — if so, (re)move them from `distilled.md` (the distilled file should only hold what is NOT already in permanent docs).
4. If the napkin exceeds ~500 lines, follow the [distillation skill](/.cursor/skills/distillation/SKILL.md) to rotate it.

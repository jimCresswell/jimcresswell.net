# Consolidate Docs

1. Make sure all plans and prompts are fully up to date. Check status lines,
   frontmatter task states, completion markers, recommended-next-step sections,
   and cross-references together so the same work is not simultaneously
   described as both active and pending. If a proof surface or tool has changed
   role, update current-state, audit, and slice notes with "remaining" or
   "next" sections as well as execution plans. If files have moved, audit
   relative links from each file's own directory — do not assume root-relative
   `../` paths still resolve. Prefer repo-relative links in live plan and
   prompt docs; hard-coded absolute workspace paths drift when repos move or
   are renamed. When a prompt is completed, do not leave stale active-task
   instructions beneath the completion header; collapse it to a truthful
   completion record and redirect. After any track- or phase-status change,
   reconcile the active plan stack, `.agent/plans/roadmap.md`,
   `.agent/plans/active/` (primary plan file + `README.md`), and any
   parent-plan summary tables, plus repo-local overview tables or READMEs that
   advertise live plan state, in the same pass so status does not drift between
   layers.
2. Identify any content in ephemeral locations (plans, prompts, napkin, distilled.md, AGENTS.md) that now functions as settled documentation, and move it to non-ephemeral locations such as ADRs, `/docs/`, or READMEs. If you add or materially update a practice-core changelog entry, consider whether `.agent/practice-context/outgoing/` needs a short supporting note or report because the changelog alone would be too thin.
3. Check whether `distilled.md` contains entries that are now, or should be, captured in permanent documentation — if so, (re)move them from `distilled.md` (the distilled file should only hold what is NOT already in permanent docs).
4. If the napkin exceeds ~500 lines, follow the distillation skill (`.agent/skills/distillation/SKILL.md`) to rotate it.
5. Check fitness on all directives and permanent docs — compare current
   content against `fitness_line_target`, `fitness_line_limit`,
   `fitness_char_limit`, and `fitness_line_length` in YAML frontmatter. Treat
   target exceedance as a warning and limit exceedance as blocking.
6. Check the practice box (`.agent/practice-core/incoming/`) for incoming practice-core files. If present, alert the user and follow the Integration Flow in `.agent/practice-core/practice-lineage.md`.
7. Audit cohesion: verify Practice Core internal consistency, practice-index
   links, reference docs, and broader Practice alignment. No stale
   descriptions, no contradictions, no outdated wording.
8. Consider practice evolution: has any learning from this session cleared the three-part bar? (Validated by real work? Would its absence cause recurring mistakes? Stable?) If so, propose changes to the relevant practice files.

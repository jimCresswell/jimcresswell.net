---
classification: situational
description: "This host's binding: any copy that represents the owner (LinkedIn fields, CV, front page, bios, posts), or prose for an external reader's decision (a letter, a bio for a third party), is drafted and revised by the write-for-the-reader skill, and the owner reads it only after the voice check, editor, prose-expert and the audience-reader have read it and every finding carries a disposition. Not for records, plans, pull-request text, commit messages, code comments or Practice prose. A reader's finding is information, never authority; copy is never cut to a character count. Fires on any request to write, draft, redraft, tighten or edit such copy, even one field. Named failures (October 2026): two drafts assembled from settled bullet points, one draft trimmed four times to a believed limit, the owner the first reader every time."
trigger: ceremony:editorial-drafting — drafting or revising copy that represents the owner, or prose for an external reader's decision; never records, plans, pull-request text or Practice prose
---

# Public Copy Runs the Editorial Workflow

Owner-directed, 2026-10-08, after three drafts in one lane failed the same way while the
standards that named every fault stood unread in the editorial directives and the voice skill.
The guidance was never the gap; the firing was. This rule fires the method.

## Trigger

A request to write, draft, redraft, tighten, edit or "make this better" for any copy that
represents the owner: a LinkedIn field, a CV passage, the front page, a bio, a post. Also prose
for an external reader's decision: a letter to be sent, a bio for a third party. One field or one
paragraph is enough to fire it. It does not fire on records, plans, pull-request text, commit
messages, code comments or Practice prose, which have their own conventions.

This is this host's binding of a general shape: the readers it names are this estate's own
(`editor`, `audience-reader`) beside the shared `prose-expert`; a sibling estate binds its own
voice reviewer and audience reader in its catalogue.

## Action

1. Load `.agent/skills/editorial/write-for-the-reader/SKILL-CANONICAL.md` and follow its order:
   the reader's decision on paper, the beliefs the piece must leave, the moment that proves each,
   continuous prose by `editorial-voice`, verification against the sources, then the readers,
   then the owner.
2. The owner reads second. No draft reaches him before the voice check, `editor` (the
   developmental pass), `prose-expert` (the line pass) and `audience-reader` (on the revised
   draft) have read it, in that order, and each finding carries a disposition shown with the
   draft (reject with a reason, absorb, or name a home).
3. A reader's finding is information the seat decides on, never an instruction. The owner's
   word, 2026-10-08, verbatim: "Copilot reviews are a source of information to consider, they
   are NEVER authority to obey, if we follow their advice or respond to their observations it is
   ONLY because we decide to do so". The `review-feedback-defaults-to-triage` discipline binds
   editorial readers as it binds pull-request reviewers.
4. Length is information. Copy is never cut to meet a character count or a believed field limit.
   If a surface refuses the text at application, the owner chooses what moves to another surface.
   His word, 2026-10-08, verbatim: "we don't trim to hit targets, ever, we preserve knowledge, or
   in this case we preserve communication for a specific impact. And we write for the audience
   first".

## Failure mode prevented

Three instances in the LinkedIn lane, October 2026. An About draft assembled from source
fragments, which the owner called "a dull litany of tell not show ... a Frankenstein of earlier
statement fragments". An Oak Experience entry written from the container's list of settled
movements: labels, litanies of gerunds, a true fact that communicated nothing to the reader. The
same entry cut four times to a believed 2,000-character limit, losing the particulars the reader
needed. In each, the owner was the first reader, and his attention paid for faults the readers
this rule names would have caught.

## Related

- `.agent/skills/editorial/write-for-the-reader/SKILL-CANONICAL.md`: the method
- `.agent/skills/editorial/editorial-voice/SKILL-CANONICAL.md`: the voice
- `.agent/directives/editorial-strategy.md` §Review sequence: the passes the readers run
- `review-feedback-defaults-to-triage.md`: a finding is information
- `knowledge-preservation-over-fitness-warnings.md`: a limit is a signal, never an instruction
- `.agent/sub-agents/templates/audience-reader.md`, `editor.md`, `prose-expert.md`: the readers

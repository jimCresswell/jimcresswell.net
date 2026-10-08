---
name: write-for-the-reader
classification: active
description: >-
  The order of work for drafting or revising any copy that represents Jim (LinkedIn fields, CV,
  front page, bios, posts, letters) or any prose a named reader must act on: the reader's
  decision on paper first, the two or three beliefs the piece must leave, the moment that proves
  each, continuous prose in one voice, facts verified afterwards, then the three readers (the
  voice check, the prose and editor reviewers, the audience-reader) before Jim reads. Load it
  whenever asked to write, draft, redraft, tighten, edit or "make this better" for a public
  surface, even for one field or one paragraph. Not for records, plans, commit messages or code
  comments, which have their own conventions. Right looks like: the reader's decision shown with
  the draft, one job per paragraph, every sentence changing what the reader believes. Wrong looks
  like: a label, a colon and a litany; a draft assembled from settled bullet points; copy cut to
  a character count.
---

# Write for the Reader

Three drafts in one lane failed the same way in October 2026: an About assembled from source
fragments, an Experience entry written from a list of settled movements, and the same entry cut
four times to a believed field limit. The standards that name every one of those faults already
existed in `.agent/directives/editorial-strategy.md`, `.agent/directives/editorial-guidance.md`
and the `editorial-voice` skill. Nothing fired them at drafting time, and Jim was the first reader
every time. This skill is the order of work that fires them. The directives own the standards;
this skill owns the sequence.

## 1. Before the first sentence: the reader's decision

Write it down and show it with the draft (`editorial-strategy.md` §Begin with the reader's
decision):

1. the primary reader by role, and any secondary reader that matters;
2. what that reader is deciding or doing;
3. what they already believe, misunderstand or doubt at first contact;
4. the surface and the reading mode: a card, a collapsed preview, a scan, a full read, a search
   result, a machine extracting nouns;
5. what must be newly clear when they finish.

A draft written before this exists is written for the material, and the material's shape leaks
into the prose.

## 2. The beliefs, then the moments

- Name the two or three things the reader must believe when they finish, in the words they would
  use to repeat them to someone else. That is the referability test, and it is the whole job.
- For each belief, choose the one moment that proves it, at the reader's altitude. A reader
  constructing a senior role wants scope, the decision, the cost accepted and the consequence;
  mechanism is noise to them however true it is. The test for every candidate sentence: what does
  the named reader believe after it that they did not before? Nothing new, or new at the wrong
  altitude, and the sentence does not earn its place.
- Put attribution beside the claim it qualifies: what Jim did, what others and agents did, what was
  not chosen, what it cost. A claim that survives inspection by the people who were there is the
  claim a verifier trusts.

## 3. The prose

- Write continuous prose in one voice, by the `editorial-voice` skill: its registers, its five
  pitfalls, its check. One job per paragraph; situation, decision, cost, consequence is a shape
  that works. A label is a first sentence only when it is the best first sentence, which it rarely
  is.
- The source's shape never dictates the prose's shape. A list of settled movements becomes
  paragraphs that list, and the reader meets a committee's digest instead of a person. Write from
  the beliefs; verify against the material afterwards.
- Never assemble. A draft stitched from the sources' own sentences reads, in Jim's words, as "a
  dull litany of tell not show". Write, then verify; never verify by assembly.
- A hedge stacked on a hedge ("with colleagues I helped") turns a true claim into none. Say what
  the reader needs and put the credit beside it.

## 4. Verify

- Facts and attribution against the sources: the particulars, the records, the public
  repositories. Names, dates, titles, numbers, licences and product names exactly as their owners
  spell them (for the Oak AI plugin, EDR-007).
- Length is information, never a target. Measure once and state it with the draft. If the
  surface's field refuses the text at application, the choice of what moves to another surface
  is editorial and Jim's, never a cut by counting. His words of 8 October 2026: "we don't trim to
  hit targets, ever, we preserve knowledge, or in this case we preserve communication for a
  specific impact. And we write for the audience first".

## 5. The readers, before Jim

Three readers in order. Each is a falsifier; none is an authority. A reader's finding is
information the seat decides on, by the `review-feedback-defaults-to-triage` discipline: reject
the incorrect with a reason, absorb the correct and proportionate, name a home for the rest, and
show the dispositions with the draft.

1. **The voice check**, run by the seat: `editorial-voice` §The check, all five questions, plus
   the per-sentence test from step 2.
2. **The craft readers**: `prose-expert` at sentence level and `editor` for structure, attention,
   evidence, register and voice, in the order `editorial-strategy.md` §Review sequence sets, large
   decisions before small. For a revision of an existing piece, brief them by altitude (§7).
3. **The audience**: the `audience-reader` sub-agent, given the reader's decision statement from
   step 1 and the draft in its reading path, reporting what the reader now believes, what they
   would repeat, what was noise, where they stopped and what they would do next. Its "what I now
   believe" is the piece's real effect; the gap between that and step 2 is the finding.

## 6. Then Jim

One draft at a time, never a menu of variants. What reaches him:

```text
Reader's decision: the five items of step 1
Beliefs the piece must leave: 1. 2. 3.
Draft: the text, field by field where the surface has fields
Length: characters, as information; the surface's believed limit and whether it is verified
Readers: voice check; prose-expert and editor dispositions; audience-reader's belief and noise
Open for Jim: a tense, a title, a fact only he holds
```

His spoken reaction and his direct edits are primary editorial evidence. A correction fixes the
model; the words are still chosen for the reader. His rule of 7 October 2026: "the editorial
intent and execution should not simply align with what I said most vehemently, these words are
here to achieve an impact".

## 7. The three editing altitudes

When revising an existing piece, edit from large decisions to small, one altitude per pass,
never two in one pass. Polishing sentences inside a structure that has not earned its shape is
wasted work.

- **Developmental.** Does the piece do the reader's job? Read once without writing, then
  summarise in one paragraph what the piece actually is; compare that with the reader's decision
  and name the drift; name the structural changes in priority order and the one to make first.
  Leave sentences alone unless a sentence signals a structural fault. Output: an editorial letter.
- **Line.** Clarity first, rhythm second; concrete for abstract; vary sentence length; remove
  redundancy within sentences and across paragraphs; a fix that loses the voice is the wrong fix.
  Output: the edited draft and a change log by kind (clarity, rhythm, word choice, redundancy).
- **Proof.** The last pass: names, dates, titles, URLs, product names; consistency of capitals,
  hyphens and numerals; flag every ambiguity and never silently change a fact. Output: the
  corrected draft, the change log, the flagged ambiguities for Jim to confirm.

The `editor` reviewer takes the developmental and line passes when briefed by altitude; the proof
pass is the seat's own, run against the sources.

## Gotchas

- A true, verifiable fact is not a reason to include it. A benchmark that scored a perfect 1.0
  and was rewritten to score worse was true, and said nothing to a head hunter.
- The About and the Experience entry draw on the same facts. The entry particularises: who, when,
  what was decided, what it cost. It never restates the About's sentences.
- "The function. With colleagues I helped grow ... : pushing, hiring, forming, arguing" is the
  shape that failed: a label, a colon, a litany of gerunds. A résumé, not a person.
- A tense that dates the text ("is passing to") is a choice to surface to Jim, never to hide.
- Vendor terms for a product (plugin, connector, app) appear only when naming the vendor's
  listing; elsewhere the product's own name (EDR-007).
- Repetition hides in nouns: "built ... built", "the way of working ... the way of working".
  Read aloud before the readers do.

## References

- `.agent/directives/editorial-strategy.md`: the reader's decision, surface standards, the review
  sequence, the platform pass
- `.agent/directives/editorial-guidance.md`: identity, voice, register, the editorial principles
- `.agent/skills/editorial/editorial-voice/SKILL-CANONICAL.md`: the voice and its check
- `docs/editorial/decision-records/README.md`: the decisions already made
- `.agent/rules/review-feedback-defaults-to-triage.md`: a finding is information
- `.agent/rules/knowledge-preservation-over-fitness-warnings.md`: a limit is a signal, never an
  instruction
- `.agent/sub-agents/templates/audience-reader.md`, `editor.md`, `prose-expert.md`: the readers

# LinkedIn workspace

The sole active working home for Jim Cresswell’s LinkedIn content and non-sensitive supporting material.

Start with the [profile replacement](profile-replacement.md), the working object, then the
[rewrite handoff](rewrite-handoff.md), whose October 2026 section is the current direction and
names the governing records. The [first profile draft](profile-draft.md) is a
September proposal kept as a source for the earlier entries, not the working object. The [rewrite handoff](rewrite-handoff.md) preserves the current
direction, settled corrections, remaining choices and limits for the next editor.

The profile draft, editing notes, reference and research documents were prepared by AI agents
working to Jim’s direction; they are proposals and working analyses, not his published views.
Further batches from Jim’s Codex agent into this workspace are repository content: a Practice
seat commits and lands them by the normal path and never treats them as stray material to
sweep (the owner’s word, 2026-09-28). Publishing anything to LinkedIn is a separate act, on
Jim’s request only.

## Working material

| Document                                                                                | Purpose                                                                                                      |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| [Profile](profile.md)                                                                   | The copy's one home: every field with its status, as validated markdown                                      |
| [Profile replacement](profile-replacement.md)                                           | The decision container: the settled decisions and open items per field, pointing at the profile for the copy |
| [Profile draft](profile-draft.md)                                                       | September's complete proposal; a source for the earlier entries, not the working object                      |
| [Rewrite handoff](rewrite-handoff.md)                                                   | Current direction, evidence boundaries and next editing action                                               |
| [Editing notes](editing-notes.md)                                                       | Reasons for consequential changes, factual checks and remaining decisions                                    |
| [Recorded profile](reference/current-profile-2026-09-27.md)                             | Dated professional-content baseline for comparison                                                           |
| [Profile audit](reference/profile-audit-2026-09-27.md)                                  | Historical whole-profile assessment, with observation and inference distinguished                            |
| [Gap analysis](reference/profile-gaps-2026-09-27.md)                                    | Historical priorities, contrary evidence and inspection limits                                               |
| [Contribution analysis](reference/contribution-analysis.md)                             | Account of the work and the editorial findings that matter to this draft                                     |
| [First exploration](reference/content-exploration-2026-09-28.md)                        | Earlier alternatives and their trade-offs; discussion material, not approved copy                            |
| [Brief review](reference/brief-review-2026-09-26.md)                                    | Historical assessment of the application brief, preceding the profile audit; the current assessment governs  |
| [Research report](research/exceptional-cv-linkedin-research-report-2026-09-26.md)       | What strong CVs and LinkedIn profiles can usefully communicate                                               |
| [Research companion](research/exceptional-cv-linkedin-evidence-companion-2026-09-26.md) | Sources, claims, methods and limitations                                                                     |

## Working agreement

Write from actual contribution, clear attribution and Jim’s voice. LinkedIn communicates an
understanding of his work; factual completeness alone is insufficient. Use the research to
improve the copy, without making every editorial decision a new research project.

Jim authorised this repository workspace on 28 September 2026. The non-sensitive LinkedIn
material listed in privacy.md's [LinkedIn workspace authorisation][linkedin-authorisation]
belongs here. Personal vulnerabilities, private correspondence, account details, third-party
activity records and sensitive or confidential source material do not. Ordinary bibliographic
attribution belongs with the research it supports.

[linkedin-authorisation]: ../.agent/directives/privacy.md#linkedin-workspace-authorisation--28-september-2026

Drafting, approval and live publication are separate states. Workspace content is repository
content under the normal rules: commit, push and merge. Changing LinkedIn is a separate activity
that needs Jim's request, as the [authorisation][linkedin-authorisation] records; that covers
copy, account settings, messages, recommendation requests and reader experiments. Review exact
wording with Jim before any change there.

## Editorial authorities and related surfaces

- [Editorial strategy](../.agent/directives/editorial-strategy.md)
- [Voice and guidance](../.agent/directives/editorial-guidance.md)
- [Privacy](../.agent/directives/privacy.md)
- [Editor review](../.agent/memory/executive/invoke-code-experts.md) (this host's
  `editor` row) and the
  [editorial voice skill](../.agent/skills/editorial/editorial-voice/SKILL-CANONICAL.md)
- [Current CV source](../jcdotnet/content/cv.content.json)
- [Current front page source](../jcdotnet/content/frontpage.content.json)
- [Shared identity facts](../jcdotnet/content/entities.json)

The CV, front page and LinkedIn have different composition needs. Changes proposed here do
not silently rewrite the website. The August LinkedIn rewrite remains an unapproved historical
draft; it is not the starting point for this work.

## The profile as validated markdown, and the editor

[`profile.md`](profile.md) is the copy's one home: one H2 per LinkedIn section in LinkedIn's
order, an H3 per entry under the sections that hold entries, and a `Status:` line (`approved`,
`drafted` or `open`, with an optional note) under every heading. The structure is validated by
`pnpm --filter linkedin validate-profile profile.md`, which the workspace's `lint` script runs,
so a missing section, a bad status or an entry under a section that takes none fails the gate.
Counts and the 200 and 300 character folds are reported as notes against believed limits; they
are information, never a target.

`profile.review.md` is where Jim's edits land: it starts as a copy of `profile.md` and the editor
writes it; prettier, markdownlint and the gate leave it alone, so nothing he writes there can
fail a commit. The editor is a local two-pane page, markdown on the left and an easy-to-read
rendering on the right, with the status, the count, the folds and a changed-from-source badge per
field, and linked highlighting between the panes. Run it with `pnpm --filter linkedin editor` and
open the printed URL (`localhost` on the same port also works); it listens on 127.0.0.1 only and
serves nothing but the page and the two files. Edits save after a short pause in typing. The seat
triages the review file against the source by the editorial method; nothing publishes to
LinkedIn.

This workspace is not an additional published website. It is a private pnpm workspace package;
the repository's root Markdown and formatting checks cover its documents, and its own `lint`,
`type-check`, `test` and `build` scripts cover the editor.

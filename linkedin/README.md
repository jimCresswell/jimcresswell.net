# LinkedIn workspace

The sole active working home for Jim Cresswell’s LinkedIn content and non-sensitive supporting material.

Start with the [first profile draft](profile-draft.md). It is proposed copy for Jim’s review,
not an approved or published profile. The immediate task is to edit that draft into the account
Jim wants readers to understand. The [rewrite handoff](rewrite-handoff.md) preserves the current
direction, settled corrections, remaining choices and limits for the next editor.

The profile draft, editing notes, reference and research documents were prepared by AI agents
working to Jim’s direction; they are proposals and working analyses, not his published views.

## Working material

| Document                                                                                | Purpose                                                                                                     |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [Profile draft](profile-draft.md)                                                       | One complete proposed revision, including supporting sections and retain decisions                          |
| [Rewrite handoff](rewrite-handoff.md)                                                   | Current direction, evidence boundaries and next editing action                                              |
| [Editing notes](editing-notes.md)                                                       | Reasons for consequential changes, factual checks and remaining decisions                                   |
| [Recorded profile](reference/current-profile-2026-09-27.md)                             | Dated professional-content baseline for comparison                                                          |
| [Profile audit](reference/profile-audit-2026-09-27.md)                                  | Historical whole-profile assessment, with observation and inference distinguished                           |
| [Gap analysis](reference/profile-gaps-2026-09-27.md)                                    | Historical priorities, contrary evidence and inspection limits                                              |
| [Contribution analysis](reference/contribution-analysis.md)                             | Account of the work and the editorial findings that matter to this draft                                    |
| [First exploration](reference/content-exploration-2026-09-28.md)                        | Earlier alternatives and their trade-offs; discussion material, not approved copy                           |
| [Brief review](reference/brief-review-2026-09-26.md)                                    | Historical assessment of the application brief, preceding the profile audit; the current assessment governs |
| [Research report](research/exceptional-cv-linkedin-research-report-2026-09-26.md)       | What strong CVs and LinkedIn profiles can usefully communicate                                              |
| [Research companion](research/exceptional-cv-linkedin-evidence-companion-2026-09-26.md) | Sources, claims, methods and limitations                                                                    |

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
- [Editor review](../.agent/rules/invoke-editor.md) and the
  [editorial voice skill](../.agent/skills/editorial-voice/SKILL-CANONICAL.md)
- [Current CV source](../jcdotnet/content/cv.content.json)
- [Current front page source](../jcdotnet/content/frontpage.content.json)
- [Shared identity facts](../jcdotnet/content/entities.json)

The CV, front page and LinkedIn have different composition needs. Changes proposed here do
not silently rewrite the website. The August LinkedIn rewrite remains an unapproved historical
draft; it is not the starting point for this work.

This is a document workspace, not an additional published website. It is a private pnpm
workspace package so that it has a place in the monorepo, but it holds no code, build or
scripts: the repository's root Markdown and formatting checks cover its documents.

---
id: linkedin-profile-editor
node_type: delivery
name: The LinkedIn profile as validated markdown, and a local two-pane editor
overview: >-
  The profile copy in one validated markdown home, its structure checked at the gate, and a local
  editor whose rendering computes the counts and folds and whose edits land in a review file.
status: ratified
ratified_by: Jim Cresswell
ratified_date: 2026-10-08
ratified_where: >-
  The owner's approval of the plan in the Cedar turns Grove session (1950d1) on 2026-10-08, after
  his ruling on its delivery shape, verbatim: "90% of the cost of a PR is the feedback loop from
  reviewers, five PRs will take roughly fives time longer than one PR, and there is absolutely no
  reason for this to be complex, most of the risk are mitigated by configuring tools. You get one
  PR, and reviewer feedback is input to evaluate, not authority to be obeyed". Recorded on the
  linkedin-workspace thread record's 2026-10-08 continuation.
serves: content-as-cv
impact_areas:
  - editorial-content
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-08
---

# The LinkedIn profile as validated markdown, and a local two-pane editor

## Goal

When this lands, the LinkedIn copy has one home, `linkedin/profile.md`, whose fixed heading
tree and status lines are validated at the gate; the owner edits a copy of it locally in a
two-pane page whose rendering shows per field the status, the character count against the
believed limit, the 200 and 300 character folds and whether the field differs from the source,
with a selection in either pane highlighted in the other; and his edits persist to
`linkedin/profile.review.md`, never the source. None of that is true now: the copy sits in
blockquotes inside the decision container, counts and folds are computed by hand, and the
owner's direct edits, primary editorial evidence under the write-for-the-reader method, have no
home but the conversation.

## User groups and value

- The owner: reads the copy as a reader would, with the counts and folds computed rather than
  reported, and edits it in place; his edits are kept as a file the seat triages by the method.
  He asked for exactly this on 2026-10-08 ("a quick editor, a web page, two panes, one for
  editing, one for preview ... my edits should persist to file, not the source files but a file
  for review"), markdown over a data model ("to avoid choosing data models prematurely"), and
  the linked highlighting.
- The seat: one parser serves the gate, the rendering and the review loop, so a structural slip
  in the copy fails `pnpm check` instead of surfacing at application time.

## Mechanism

The `linkedin` workspace gains code and its own configuration: a parser of the markdown grammar
(one H1; H2 sections in LinkedIn's order; H3 entries only under entry sections; a status line
under every heading; paragraphs whose soft breaks join with one space, as a LinkedIn field
receives them; the Skills section as a dash list), a validator of that structure with notes for
counts, folds and markup sightings, a check chained into the workspace's `lint` script, an HTTP
handler proven below the listener with every read and write through an injected seam, a page
script bundled by tsup, and a listener on 127.0.0.1:4780. The review file is outside prettier and
markdownlint by configuration; knip and dependency-cruiser know the workspace. One pull request,
by the owner's ruling, with one TDD cycle per commit and the reviewers run once at the end as
information to triage.

## Acceptance criteria (each with a proof — required)

1. The copy has one home: no field's text appears in both the decision container and
   `linkedin/profile.md`. Proof `repo-safe`: the container holds no blockquoted copy, and
   `pnpm --filter linkedin validate-profile profile.md profile.review.md` is green.
2. The structure is validated at the gate: a missing section, a bad status and an H3 under a
   section that takes none each fail `pnpm --filter linkedin lint`. Proof `repo-safe`: the
   validator's unit tests (`linkedin/src/model/validate.unit.test.ts`) and the check's
   integration tests (`linkedin/src/check/format.integration.test.ts`).
3. The owner can edit locally and his edits persist to the review file, never the source. Proof
   `owner-held`: the dated observation on the pull request and on the thread record; after an
   edit `profile.review.md` differs from `profile.md` while `git status` shows the source
   unchanged.
4. The rendering shows per field the status, the count with its believed limit, and the 200 and
   300 character folds. Proof `repo-safe`: `linkedin/src/page/render.unit.test.ts`.
5. A selection in either pane highlights the same text in the other. Proof `owner-held` for the
   page: the observation on the pull request; `repo-safe` for the mapping:
   `linkedin/src/model/offsets.unit.test.ts`.
6. Every test is in-process with no IO. Proof `repo-safe`: `@engraph/no-real-io-in-tests` at
   `--max-warnings 0` on the workspace inside `pnpm check`.

## Todos (optional; proofs on todos optional)

- One pull request, `feat/linkedin-profile-editor`, round budget the default of at most two
  review rounds: the workspace and the copy's home; the parser; the validator and the check; the
  handler, the page, the bundle and the listener; the highlighting and the changed badge; the
  documents and this node. Then a records commit on the coordination branch (the container's
  blockquotes replaced by pointers at the profile's headings, the thread record, the napkin).

## Out of scope

- A reset-to-source control, per-field text areas, a diff view and the September baseline: on
  the design canvas or in the container, not in the ask; the review file against the source is
  the comparison the seat runs.
- Hosting and authentication: the page listens on the loopback address only and serves the two
  files and itself.
- Any change to LinkedIn: publication is a separate act on the owner's request with him present.
- A record schema for the Top card or the entry headings: free text until the earlier entries
  are drafted and show their shape.

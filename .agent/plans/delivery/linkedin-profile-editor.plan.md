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
last_updated: 2026-10-09
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

### Decisions taken in planning (with the evidence)

Settled on 2026-10-08 before the build, from the plan's three reviews (an exploration of the
workspace conventions, an assumptions review, an implementation design) and the owner's rulings;
carried here from the platform's plan surface so the next executor need not re-derive them.

1. **Home: the `linkedin` workspace gains code and its own configuration**, not `agent-tools`.
   The assumptions review proposed `agent-tools` (tsx, zod, Result, a heading parser and a bundler
   already there). Decided against it: `agent-tools` is Practice core and is to be extracted as a
   standalone entity, and this tool is the owner's, consumer code that belongs beside the copy it
   serves, so the Practice core stays free of it; the page needs the DOM lib, which in a fresh
   workspace is contained and in `agent-tools` would widen a large Node workspace's program; and
   the workspace gains the purpose the thread record's open question asked about. The price was
   six mechanical config files copied from `tooling/result/` and a lockfile edit, paid once. The
   earlier documents-only commit (794c5aca) had cured a knip failure on an empty scaffold;
   declared dependencies and real consumers are the cure here.
2. **The grammar validates structure only, not a record schema.** H2 sections in LinkedIn's
   order, H3 entries only under entry sections, one status line under every heading. H3 heading
   text and the Top card's lines are free text until the earlier entries are drafted and show
   their shape. No key schema, no four-part heading rule, no `Settings` section (application-day
   actions, not copy).
3. **The profile check runs inside the workspace's `lint` script**, so turbo's `lint` task runs
   it in `pnpm check`, in CI's turbo step, and at pre-commit through `lint-changed` whenever the
   workspace changes; `$TURBO_DEFAULT$` inputs make an edit to the markdown invalidate the cache.
   No root script, no new turbo task (the family manifest fixes the gate leg), no CI-parity touch.
   The command is `validate-profile`, because the root already owns a family script named
   `profile:check`. After the owner's ruling of 8 October the check reads `profile.md` alone; the
   review file is his raw input and nothing he writes there can fail a commit.
4. **One parser, in TypeScript, written here.** No markdown AST dependency exists in the estate
   and the destination is plain text, so an AST would admit what LinkedIn cannot carry; the
   `agent-tools` heading helper cannot be imported across workspaces (no exports). Soft line
   breaks inside a paragraph join with one space because a LinkedIn field receives one unwrapped
   paragraph and counts are of the joined text; prettier's `proseWrap` is `preserve` here and
   never reflows, so that was never the reason.
5. **The page script is TypeScript bundled by tsup to `dist/app.js`.** Hand-written JavaScript is
   forbidden by `source-is-typescript-esm-only`; Node's `module.stripTypeScriptTypes` prints an
   ExperimentalWarning (verified on Node 24.21), so serve-time stripping is out. tsup leaves a
   package's declared dependencies as bare imports a browser cannot resolve, so the config names
   `@engraph/result` and `zod` under `noExternal` (found at the first browser observation). The
   server reads the bundle at start. No smoke-check class fits a source-run local server and a
   browser bundle; their viability is the one recorded browser observation.
6. **Both highlighting directions in the first version.** Joined text keeps the source's length
   (one space per newline), so a rendered paragraph's text offsets map to source offsets by one
   addition; the rendering-to-editor direction moves focus to the text area, and the known cure
   (a mirror layer behind it) waits until the simple version has been used.
7. **The Host header is checked** against the editor's two names (`127.0.0.1:4780` and
   `localhost:4780`), the one finding taken from the reviewers before the owner's ruling, with a
   page content security policy beside it; `localhost` was added at his word.
8. **Known and left**: `jcdotnet/scripts/built-site-server.integration.test.ts` opens loopback
   sockets under `pnpm test`, a standing breach of the no-IO invariant; it is not a precedent here
   and belongs to the no-IO lane (`no-io-test-boundary-and-di-recovery.plan.md`) as its own item.
   LinkedIn's counting and its fold positions are beliefs until the live editor; every note says
   so.

## Acceptance criteria (each with a proof — required)

1. The copy has one home: no field's text appears in both the decision container and
   `linkedin/profile.md`. Proof `repo-safe`: the container holds no blockquoted copy, and
   `pnpm --filter linkedin validate-profile profile.md` is green (the review file is the owner's
   raw input and is never gated).
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

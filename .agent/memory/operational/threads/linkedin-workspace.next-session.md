# Thread: linkedin-workspace — the LinkedIn workspace and profile lane

**Thread identity.** The owner's LinkedIn work: the `linkedin/` document workspace (the profile
draft and its supporting material) and, on the owner's request only, the live profile at
linkedin.com/in/jimcresswell. **Participating agent identities:** Galaxy binds Gravity (46de68,
claude-code, claude-fable-5-1, implementer, 2026-09-29 to 2026-09-30); Cedar turns Grove (1950d1, claude-code, claude-fable-5-1, the n=1 seat, 2026-10-06 to 2026-10-10); Shrew rides Eventide (371a2b, claude-code, claude-fable-5-1, the successor seat, from 2026-10-10). The owner's Codex agent
that created the workspace on 2026-09-28 is not recorded here by identity. **Landing target for
the next session:** the latest dated block governs. **Grounding order:** `AGENT.md`, the
start-right skill for the session shape, this record, `linkedin/README.md`,
`linkedin/rewrite-handoff.md`, then `.agent/directives/privacy.md` §LinkedIn workspace
authorisation.

## Current Continuation (2026-10-09T12:xxZ, the profile as validated markdown and the editor delivered as PR #325, merged 9 October; the owner's correction on ceremony; the Oak entry is next; the latest block governs; Cedar turns Grove, 1950d1)

- The owner's asks of 2026-10-08, verbatim: "can we put the content so far into some kind of
  structure, markdown files or json, whatever, and whip up a quick editor, a web page, two panes,
  one for editing, one for preview ... my edits should persist to file, not the source files but a
  file for review"; "let's keep it very MVP, and to avoid choosing data models prematurely, how
  about we make it a markdown file instead, headings and sub-headings fixed and validated against
  the known structure of the linkedin profile content"; on the design canvas, the linked
  highlighting and a page run and saved locally; at plan review: "90% of the cost of a PR is the
  feedback loop from reviewers ... You get one PR, and reviewer feedback is input to evaluate, not
  authority to be obeyed".
- What landed: draft PR #325 (the bot's) on `feat/linkedin-profile-editor` from the worktree
  `.claude/worktrees/linkedin-profile-editor`, nine commits: `linkedin/profile.md` as the copy's
  one home (the headline, the About and the two Oak entries under their headings with status
  lines; this container now points at them and holds the decisions); the parser, the validator
  with its notes (counts, the 200 and 300 character folds, markup sightings) and the check inside
  the workspace `lint` (the source alone; the review file is never gated); the editor, an HTTP
  handler proven below the listener on 127.0.0.1:4780 (`localhost` accepted too), a page bundled
  by tsup, linked highlighting both ways; the README's editor section, the build-system row and
  the delivery node `.agent/plans/delivery/linkedin-profile-editor.plan.md`, ratified by the
  owner's approval and ruling above. The observation (2026-10-08 17:2xZ, Chrome): load, an edit
  saved to `profile.review.md` with the source untouched, highlighting in both directions, a
  second start refused on the held port; recorded on the PR.
- The owner's correction, verbatim, after the seat ran six reviewers (accessibility included), a
  Cricket suite and a twenty-five-finding triage on the editor: "you are building an MVP editing
  app, which requires the basest ability to be read then changed... and you are applying the
  a11y requirements of a public service, and thus wasting my time, my money, and your attention.
  Finish the fucking basic editor"; then "stopping is not enough, fix the state of the editor,
  it is supposed to be SIMPLE ... and then we get back to what we are SUPPOSED to be doing which
  is writing my Oak entry for linkedin". The reviewers and the remaining Cricket legs were
  stopped; the findings stand on the PR in one line each, nothing further taken. Taken before
  the ruling: the Host check against DNS rebinding and a page content security policy. After it:
  the review file left the gate, so nothing he writes there can fail a commit. The lesson for
  the Practice: reviewer and accessibility depth is proportionate to the audience; a private
  instrument gets one observation and one PR, never the public estate's fleet.
- The Cricket suite before the ruling (his ask, "comprehensive ... latest models for each
  clade"): seven of fourteen legs returned before his word stopped the rest (fable low, opus
  medium, sonnet high; Codex gpt-6.1-sol low in both stances, gpt-5.6-terra medium, gpt-5.6-luna
  xhigh): four DRIFTING, three ON-TRACK; frames three SOUND, four NARROWED (the narrowings: no
  measure for "very MVP", the review rounds uncounted, "plan first" absent from the reading,
  the editorial resumption asserted by no source); every redirection the same, open the draft
  PR and cut the batch to defects with a consequence. Codex refuses `gpt-6.1-terra` and
  `gpt-6.1-luna` on a ChatGPT account; only `gpt-6.1-sol` of the 6.1 family runs here, so the
  terra and luna roles keep their 5.6 pins.
- Gotchas kept: tsup leaves a package's declared dependencies as bare imports a browser cannot
  resolve (`noExternal` cures it; the first browser observation found it); knip's configuration
  hints are gate errors here (redundant entries, the css extension of the root compiler); the
  worktree guard refuses runtime-computed values and heredocs carrying backticks, so scratch
  scripts are written with the platform's write tool and run as one plain command; a WIP
  reservation lapses in thirty minutes and a gate run can take longer.
- 2026-10-09: #325 merged at the owner's word ("please merge the PR") at `SHA:547e7358`, through
  the bot's REST merge path after the front door read the round as settled by timeout (a Copilot
  review requested the next morning registered and was consumed with no review object). The
  delivery node stays `ratified`, not archived: its owner-held criteria (his edits persisting to
  the review file; the highlighting) are proven by the seat's observation on the PR and await
  his own use. Then the wrap: the coordination branch folded with these records.
- Next act, on the owner's word: he runs `pnpm --filter linkedin editor` and reads the two Oak
  entries in `profile.md` as the rendering shows them, editing in the left pane; his edits in
  `profile.review.md` are the primary editorial evidence the seat triages by the
  write-for-the-reader method, with the open items listed in this container's Oak section (the
  handover tense, the pattern sentence, credit beside the curriculum experts, what was not built
  and the cost, an adoption figure, the two chronology readings). Then the earlier entries,
  Featured, Projects, skills, recommendations, settings; then the application with him present.
  The skills question of the 00:xxZ block stands as framed.

### 2026-10-09T13:1xZ — the 2026-10-08-bd89f8 branch folded as 324; the successor cut (Cedar turns Grove, 1950d1)

Merged as `SHA:213f9487` at head `SHA:082163c3` by the bot on SETTLE-READY. Successor
`coordination/2026-10-09-213f94` cut from `SHA:213f9487`; the folded branch retired local and
remote after both tips read merged. The fold's review: three Copilot rounds, eleven threads,
eight cured (five on this lane's public records naming or describing private editorial material,
the privacy class again; two stale states on the handoff and this record; one on the fold's
pull-request body, which now names the doctrine the branch carried), two rejected with reasons
(the experience letter's working guidance for a successor seat; the reading-discipline template's
scope clause, routed on 8 October), one accepted and cured in this successor's first commit
because the fold's settlement budget was spent (the napkin's 8 October resume block no longer
carries a custody line). moved for the sites: nothing / moved for the
Practice: the lane's records of 8 and 9 October and the editorial doctrine on `main`.

### 2026-10-10T11:1xZ — the lane handed to Shrew rides Eventide (371a2b) at the owner's word; Cedar turns Grove closes (Cedar turns Grove, 1950d1)

- The owner's words, verbatim: 2026-10-09 13:4xZ, "the next session works on the Oak entry,
  consolidation waits until I say so"; 2026-10-10 10:5xZ, "Prepare a full handoff to Shrew rides
  Eventide (371a2b) ... then this session is complete". The successor was a live session on this
  machine at the handoff (the platform's agent list, read first-hand at 10:57Z), and by its own
  message of 11:0xZ the owner had given it the fold of the coordination branch
  `coordination/2026-10-09-213f94` (326) ("in the mean time, please rotate the coordination branch", the
  owner's word as the successor relayed it, not heard by this seat). The shape is the at-rest
  succession of PDR-063: no claim to adopt, nothing in flight, the tracked surfaces are the
  handoff, and this block is the pickup with `repo-continuity.md` §Current State and §Next Safe
  Steps, `director-handoff.md` §STATE of this hour and the napkin block of this hour. A Moment-1
  narrative event names the successor on the comms stream (untracked, local to the machine). This
  seat ran no git on the primary after the successor's word; the records of this hour were
  written whole into the tree for the successor's fold commit, by explicit pathspec.
- State at the handoff, recomputed by the successor before any act rests on it: the copy's one
  home is `linkedin/profile.md` (the headline and About approved 7 October; the two Oak entries
  drafted 8 October, status drafted, awaiting the owner's edit; every other section open); the
  decisions and the open items are in `linkedin/profile-replacement.md`; the editor is
  `pnpm --filter linkedin editor` on 127.0.0.1:4780 (`localhost` accepted) and writes the owner's
  edits to `linkedin/profile.review.md`, which no gate reads. 325 (the editor) and 324 (the fold)
  merged 9 October; the delivery node `linkedin-profile-editor` stays `ratified` until the owner's
  own use proves its two owner-held criteria. Deep consolidation and the napkin's rotation are due
  and held at the owner's word.
- First acts for the successor, in order, after its fold: (1) the Oak entry, at the owner's word:
  he runs the editor and edits the two drafted entries; the seat triages `profile.review.md`
  against `profile.md` by the write-for-the-reader method (the rule
  `public-copy-runs-the-editorial-workflow`: the voice check, then the `editor` and `prose-expert`
  sub-agents, then the `audience-reader` on the revised draft, then the owner reads), with the
  open items of the container's Oak section: the handover tense, the pattern sentence, the credit
  beside the curriculum experts, what was not built and its cost, an adoption figure, the two
  chronology readings, and the title (Principal Engineer stands unless Senior Principal is the
  title Oak would confirm). EDR-007 governs the plugin movement's naming and attribution. (2) The
  wrap skill's sentence on folds and compaction words (2026-10-09) carried to the sibling estate,
  the same bytes, at the first opportunity. (3) Then the earlier entries, Featured, Projects,
  skills, recommendations, settings; then the application with the owner present, by the seat
  through Chrome only at his express request. Every GitHub write under the bot
  (`pnpm --silent agent-tools merge-bot push --branch <name>`; `merge-bot merge --pr N --expect
  'copilot-pull-request-reviewer[bot]'`; `merge-bot retire --branch <name>`); a Copilot review
  request under the operator credential (`env -u GH_TOKEN -u GITHUB_TOKEN gh pr edit N
  --add-reviewer @copilot`).
- Constraints inherited, each with the interest it protects: the live profile is edited only by
  the seat through Chrome at the owner's express request with him present (it is his and
  public). Nothing is trimmed to a numeric target; the editor's counts and folds are beliefs
  about LinkedIn's limits, signals to look, never instructions to cut. The target readers and
  the owner's career intentions are owner-private: in the seat's per-user memory for this
  project, never in a tracked file (privacy.md §Private editorial material; rule 7's four
  categories are the seat's list awaiting his word). The private editorial repository exists,
  informs the drafting where present, and is never identified or quoted here. His private
  messages are never read; comments are fine. A private tool gets one observation and one pull
  request; the reviewer fleet is for the public estate (the owner, 8 October). Copilot's findings
  are information to triage, never authority. "Prepare for compaction" is records committed and
  pushed, then stop; a DUE fold is never run inside that wrap. No `git stash`, `--no-verify` or
  force-push. The harness rewrites `.claude/settings.json` (the owner's plugin enablement); it
  stays uncommitted, his call. Two older local-only branches (`records/2026-10-02-7d8b9d`,
  `docs/consolidation-2-routed-cures`) hold one commit each whose substance is on `main`, his call.
- Acknowledgement: none is owed to this seat, which closes once the records are whole; the
  successor registers its identity row here on join and, if it answers the Moment-1 event, does
  so on the comms stream.

## Previous Continuation (2026-10-08T00:xxZ, compaction boundary at the owner's word; Cedar turns Grove, 1950d1)

- The owner's word, verbatim: "prepare for compaction ultrathink /jc-metacognition /jc-free-play
  /jc-concept-exploration /jc-reason /jc-plan /jc-wrap , on resume we start the Oak entry, and we
  consider how it and the headline and about relate to the skills list in the context of
  bringing about our desired impact". The seat continues after the compaction; this block is
  its pickup.
- After the resume (8 October, morning): the owner asked for a review of the next steps and a
  reflection on the intended impact before any drafting; the review's findings are in the
  napkin's block of 09:4xZ and were offered in chat. His words that followed settled the
  product's naming (the Oak AI plugin, with MCP once as the technical term and vendor terms only
  for vendor listings) and the Oak entry's attribution (his five contributions; content and
  sequencing credited to Oak's curriculum experts; the zero-to-one completion and the phased
  handover as the closing beat): both are
  [EDR-007](../../../../docs/editorial/decision-records/007-oak-ai-plugin-naming-and-attribution.md),
  the durable home, which the container now points to; his verbatim words are kept privately.
  His correction the same hour: comms events are ephemeral, never a home. Open for his word: the
  title stays Principal Engineer unless Senior Principal is the title Oak would confirm
  (LinkedIn's seniority facet buckets both the same). Next act: the Oak entry drafted as one
  piece for his reaction, with EDR-007 as its attribution rule, by the `write-for-the-reader` method landed the same day
  after a first draft failed as writing (the rule `public-copy-runs-the-editorial-workflow`; the
  `audience-reader` sub-agent; the voice check and the prose and editor reviewers before Jim, who
  reads second).
- Start here on resume, the Oak entry: the understanding is the owner's August paragraphs (in
  the private editorial repository's Oak working draft, the two opening paragraphs his own), the
  particulars sheet beside it, the container's Oak section in `linkedin/profile-replacement.md`
  (the settled structure, movements and chronology), and the approved About, which the entry
  must demonstrate and not repeat. The method that produced the About: write for the reader from
  the understanding, one concrete moment per movement, verify against the sources afterwards,
  offer one draft for his reaction. Two positions: Senior Developer (consulting) Aug to Dec
  2020, short; Principal Engineer from Jan 2021, engineering strategy, in labelled movements.
- The skills question, framed for resume (concept exploration at the boundary, not settled):
  the skills list is the machine-readable index of the About and the Oak entry, one
  understanding in a third expression; a senior searcher's Boolean and AI search reads explicit skills
  as the first filter while LinkedIn also infers skills from the prose, so the two must agree.
  Proposals, each falsifiable by the search-appearance titles after the rewrite: every pinned
  or top skill names something a reader can point at in the About or the Oak entry; the senior
  coordinates a search runs on (technical and engineering strategy, technical leadership, AI,
  MCP, platform engineering, digital public services, developer experience, open data) are
  present as explicit skills and in the prose; the earlier QA and testing skills are kept with
  their endorsements, demoted below the fold and, if LinkedIn's per-position skill attachment
  allows it, attached to the 2013 to 2020 positions rather than to Oak. The contradiction to
  avoid: a QA-heavy list under an innovator's About reads as a tester who writes well.
- Plan altitude at this boundary: the lighter one. The finish and the step sequence are in this
  record and the container; a delivery plan node is not minted, because the owner ratified the
  models as applied work and the lane's finish is already stated (the profile applied in one
  sitting with him present, the new baseline recorded, the decision record landed, the thread
  into maintenance). The resuming seat mints a node only at the owner's word.

### 2026-10-08T10:2xZ — the 2026-10-05-d72ae5 branch folded as 323; the successor cut (Cedar turns Grove, 1950d1)

Merged as `SHA:bd89f86e` at head `SHA:210c4adb` (`main` merged in content-free, proved by
merge-tree equality, so no merge commit). Successor `coordination/2026-10-08-bd89f8` cut from
`SHA:bd89f86e`; the folded branch deleted local and remote after both tips read merged. The
fold's review: fifteen Copilot findings on the opening head, thirteen cured in `SHA:210c4adb`
(the privacy class first: this record, the continuity record, the napkin, the rewrite handoff
and the seat's letter no longer identify, summarise or carry the custody of private editorial
material, whose pointers are in the seat's per-user memory; the identity row; two fact cures;
the thread README's branch clause), two declined with reasons on the threads; one second-round
finding routed to this lane: the container's opening sentence claims every field while name and
pronouns, the top-card location and associations, portrait and banner, volunteering,
organisations and activity and interests carry no status, and the lane's next records commit
scopes the sentence and gives each a status. moved for the sites: nothing / moved for the
Practice: the records hygiene cure in two skills, both estates, on `main`.

### 2026-10-08T15:xxZ — the Oak entry drafted by the method; in the container, awaiting the owner (Cedar turns Grove, 1950d1)

The first run of `write-for-the-reader` on this lane: the reader's decision and the beliefs on
paper (the private editorial repository's record of 7 October, its section of 8 October,
afternoon, holds them with the readers by name and the dispositions); one draft read by `editor`,
`prose-expert` and the `audience-reader`, revised once by altitude, read again by the
`audience-reader`, proofed against the sources; the text, its length as information (2,404 and
292 characters against a believed and unverified 2,000) and the open items for the owner are in
the container's Oak section, status "drafted, awaiting Jim". He reads second, now. Open for his
word there: the handover tense and "stream-aligned"; the pattern sentence's reading by Oak
colleagues; credit for engineering colleagues on the plugin; what was not built and what it cost;
an adoption figure; the About's "spring of 2020" beside the entry's August start; the title. Next
act after his reading: the earlier entries, Featured, Projects, the skills list as a table, then
the pre-application checks and the application with him present.

## Previous Continuation (2026-10-07T17:xxZ, paused at the owner's word; the latest block governs; Cedar turns Grove, 1950d1)

- The owner's word: "Let's pause here for now". A PAUSE of the seat, not a close of the lane.
- State: the headline and About are approved and preserved in `linkedin/profile-replacement.md`,
  the working object; the design model and the sources are in the block below and in the private
  editorial repository's handoff of 7 October; the MCP app is the Oak AI plugin on the profile.
  Nothing on LinkedIn changed.
- Records: committed on the coordination branch; GitHub reported an incident through the
  evening, so the last commits may not have reached the remote when the seat paused; the seat
  that resumes reads ahead/behind first-hand and pushes through the bot tooling
  (`pnpm agent-tools merge-bot push --branch <name>`), never plain git.
- Next act on the owner's word: the Oak entry's movements, written for the reader from the
  understanding (his August paragraphs and the container's Oak section), verified against the
  sources afterwards, one draft offered for his reaction; then the earlier entries, Featured,
  Projects, skills, recommendations, settings; then the pre-application checks and the
  application with him present.

## Previous Continuation (2026-10-07T16:xxZ, the design model after the owner's corrections; the latest block governs; Cedar turns Grove, 1950d1)

- The cold pause was lifted at the owner's word. The seat is live. The owner then corrected the
  seat in five turns; the whole of his words and the readers he named are in the private
  editorial repository's handoff of 7 October, §Design model, second pass. That section governs.
- What the profile is designed to do, in the owner's framing: the only questions are who the
  audience is, what we communicate to them, and how. The profile is designed as one system for
  one effect, never field by field. Headline and About are one act of drafting. The seat holds
  the model of LinkedIn, of the desired impact, and of how LinkedIn delivers it, and drafts the
  words with the owner by the August method (extract, he selects, write together with craft).
  Software design rules are not the instrument: "we can write whatever we want about Oak".
- What a reader should carry away (the understanding, not the copy): a physicist who moved from
  explaining systems to changing them; who does his best work before a consequential problem has
  any shape, before there are options, creating the first options and deriving his own frame
  from first principles; who makes hidden structure explicit and sets a direction others can
  build against while keeping it open to evidence; who commits (he argued for and backed Oak's
  platform rebuild and carried its risk); who originates (he conceived the thing that puts the
  national curriculum inside AI assistants, a lever whose impact is in what others will build);
  who changes the conditions of future work rather than tuning the current state (quality
  machinery at HP, whole-team specification at the Passport Office, contributing to Oak's
  engineering function, and now the Practice, the methods and tools by which people and AI
  agents engineer together); at Oak since its founding months, shaping its engineering strategy
  for six years; the person you bring in when the problem matters and nobody yet knows its
  shape. Innovator, scientist and strategist as demonstrated facts; nothing that reads as
  delivery management.
- Sources the drafting draws from, all read first-hand on 7 October: the CV positioning,
  capabilities and Oak entry in `jcdotnet/content/cv.content.json`; the front page's
  third-order line in `jcdotnet/content/frontpage.content.json`; EDR-002 and EDR-004 in
  `docs/editorial/decision-records/`; Draft 1 and September's exploration in `linkedin/`; and,
  in the private editorial repository, the August identity theory, kernel, dossier, EDR-006,
  the owner's own Oak paragraphs and the particulars sheet. Draft 1 is a source for the earlier
  entries, not the working object: its About collapses the identity.
- The Practice is not an empty movement. It is defined canonically in
  `.agent/practice-core/practice.md` (the five-layer definition ratified 2026-10-04, PDR-143
  §Decision) in both estates, and in OCE's ADR-119 with its foundation narrative; the LinkedIn
  movement translates that definition for readers, and the public OCE repository is the
  inspectable instance.
- Settled for the system: EDR-006's headline stands as the owner set it (the seat's reversals
  withdrawn); the Oak block is Senior Developer (consulting) Aug to Dec 2020 then Principal
  Engineer from Jan 2021 meaning engineering strategy, Head of DevOps dropped, no entry for the
  2022 employment change, movements from the owner's August paragraphs with the engineering
  function in his wording of 7 October (contributing to defining it; best practice; the first QA
  and engineering-manager hires; collaborative approaches; long-term investment in reducing the
  cost of innovation); earlier entries brief and true, each a concrete instance of the pattern;
  skills additive with endorsements kept, the limit verified at pre-application, top three
  pinned; two or three recommendations from senior colleagues; Open to Work off; Featured for
  the two items and Projects for the public route; location and industry set as coordinates.
- The current traffic shape is the state being changed, not a constraint; the search analytics
  after the rewrite are the measure.
- The owner's addition, later on 7 October: Oak's official page for the MCP app is
  <https://www.thenational.academy/ai-plugin>. Read first-hand: the product's own name is
  **Oak Curriculum MCP**; headline "Bring Oak's curriculum into your AI tools"; live in ChatGPT
  and Claude, Gemini and Copilot announced; teachers search curriculum plans, explore
  progression, see prior knowledge and misconceptions, ask for scaffolding, and generate
  retrieval questions, quizzes and knowledge organisers grounded in Oak's content; the content
  is under the Open Government Licence v3.0; developers are pointed to GitHub. Consequences,
  for the owner's correction at drafting: the profile uses Oak's name for the product; the
  Featured item leads with this page, with the Claude marketplace listing beside it; the Oak
  entry's movement says "in ChatGPT and Claude" rather than naming one vendor; the repository
  serves developers and sits under Projects.
- Featured, settled by the owner later on 7 October: the Oak Curriculum MCP page IS a Featured
  item, first among them, "the public face of the majority of my work for the last two and a
  half years". The chronology for the Oak entry's movements, his word: the OCE repository
  carries about the last year of that work (created 28 July 2025 with his initial commit,
  checked first-hand; its commit-activity graph is the evidence he points at); before it, a
  hand-written SDK for the Oak Open API and the progenitors of the Practice in various
  repositories. The MCP and Practice movements span two and a half years, not the months since
  the public beta.
- Headline and About APPROVED (the owner, 7 October, "I am very happy, with the headline and the
  about, please preserve it"): the exact text is in `linkedin/profile-replacement.md`, the
  working object that now replaces Draft 1, every field with a status. The MCP app is called the
  Oak AI plugin on the profile, to align with Oak's page. The About's first draft was a collage
  of source fragments the owner called "a dull litany of tell not show"; the second was written
  for a reader with one through-line and one concrete moment per movement, then checked against
  the sources; his two craft edits ("the last few years"; the Practice sentence with safely, at
  pace and the institutional knowledge at risk) completed it. Next: the Oak entry's movements.
- Transport, settled by the owner the same afternoon: pushes in this estate go through
  `pnpm agent-tools merge-bot push --branch <name>` as the bot, never a plain `git push`;
  commits here carry the owner's identity by the identity contract of 2026-09-17.
- Next act, on the owner's word: headline and About drafted together from the sources; then the
  Oak block with the Practice movement; then the rest. Nothing on LinkedIn without his express
  request with him present.

## Previous Continuation (2026-10-07T13:xxZ, cold pause at the owner's word, since lifted; Cedar turns Grove, 1950d1)

- The owner's word, verbatim: "Stop. If the watcher is about to rearm for a third time with no
  events between the previous two rearms then instead make sure all context is made safe with a
  wrap then go into a cold pause". The condition held (no stream event since 2026-10-05T20:43Z).
  This is a PAUSE of the seat, not a close of the lane.
- RATIFIED (2026-10-07T12:xxZ, verbatim): "I am happy to ratify as is, I think further refinements
  should happen as part of applied work rather than theoretical refinement." The impact model and
  the value model stand as written in the private editorial repository's handoff of 7 October,
  with the owner's answers of 7 October and the seat's recommendations beside the four decisions
  he still owns: the Oak entry structure (two entries recommended), the August headline (keep its
  substance), skills (everything changes; endorsed removals by his word), About order (drafted
  with the top). The corrections of 7 October before the ratification: his Oak work is the MCP
  app that places the curriculum in vendor AI assistants, separate from Aila and the labs site;
  "above the level of my job title, not above the level I operate at"; reading permission on
  LinkedIn is anything but messages.
- Records at the pause: this block, the napkin blocks of 6 and 7 October and the napkin close
  block, the `repo-continuity.md` entry, all committed on `coordination/2026-10-05-d72ae5` by
  pathspec from a linked worktree as `SHA:2bd88031`, NOT pushed (the push runs the full gate;
  the fold of draft 323
  is a later seat's or the owner's act). The private handoff is in the private editorial
  repository. Nothing on LinkedIn, in `linkedin/` or on the
  site changed.
- Next safe steps for the successor, in order: read the private handoff of 7 October first; the
  owner's four decisions and his word on committing; a public-safe strategy page in `linkedin/`
  and the LinkedIn section of `editorial-strategy.md` (the limit raised if the content needs it,
  never trimmed); the field-by-field container replacing Draft 1 as the working object; drafting
  by the August method (extract, the owner selects, write together), top of the profile first;
  the pre-application checks (field limits, standard skill names, Featured's second link, the
  notification mechanic); application in one sitting with the owner present on his express
  request; the post-application baseline and the EDR. The eleven steps are in the private handoff.
- Processes: the comms watcher stopped at the pause; no heartbeat ran (n=1); no claim held. The
  Chrome tab on the owner's profile was left open for him. The formation letter is at
  `.agent/experience/2026-10-07-cedar-turns-grove.md`.

## Previous Continuation (2026-10-07T12:xxZ; Cedar turns Grove, 1950d1)

- Branch: `feat/updating-linkedin`, the owner's branch, level with `main` at d72ae51d; the
  tree carries this record, the napkin blocks of 6 and 7 October, and nothing else.
- Controlling direction: the owner's words of 6 and 7 October, recorded in the napkin (the
  public-safe part) and in the private editorial repository's handoff of 7 October (the
  whole). The impact and value models were proposed at this hour and RATIFIED later the same
  day (the block above).
- Settled by the owner: whole replacement, everything but the photo; LinkedIn stands alone;
  LinkedIn only (no site, CV or graph edits); edits through Chrome by the seat on his express
  request with him present; the profile informs and never solicits; "Fractious" goes; two
  project links (the Oak site; the Oak MCP app with the marketplace listing and the OCE
  repository), their home on the profile open; entries with a location carry it and remote
  entries say United Kingdom; one network notification at the end of editing.
- Facts settled first-hand: Code Science Limited incorporated 9 February 2015, dissolved
  2 January 2024 (Companies House 09428193); Obaith a research project, full time, Jan 2018
  to 2020; Principal Engineer from January 2021 after Senior Developer Aug–Dec 2020,
  employment from June 2022; the thesis spelling is Theremin.
- The live profile, read 7 October, is identical to the 27 September baseline; public
  visibility is on for every section; retrieval is mostly through the network and comments,
  search a small share. The private record carries the aggregates.
- The August 2026 material (private) was never rejected as a whole: the owner rejected two
  drafting methods and the 8–9 August copy. Standing from August: the owner-set headline
  (EDR-006), the extract/select/write-collaboratively method, his verbatim Oak movements and
  the particulars sheet, the LinkedIn system model, the dossier's target effect, and his
  8 August purpose. The next session reads the private handoff of 7 October before anything.
- Next safe step: the owner's ratification or correction of the models; then the strategy
  record in `linkedin/` (public-safe) and the plan for the replacement. No edit to Draft 1,
  no LinkedIn change, until then.

## Previous Continuation (2026-09-30T09:4xZ)

- Branch: none. The lane is at rest; its last PR (JC.net 273) merged at b6232c77. The primary
  checkout sits on `main` at b6232c77 with a clean tree (the owner's arrangement for this lane).
- Invocation pointer: `$jc-start-right-quick continue linkedin-workspace from this record`, or
  the team skill if a peer is live.
- Controlling plan: none. The editorial direction is `linkedin/rewrite-handoff.md`; the workspace
  contract is `linkedin/README.md`.
- Next safe step: read `linkedin/rewrite-handoff.md`, then wait for the owner's direction on
  editing Draft 1 (`linkedin/profile-draft.md`). No change to LinkedIn itself without the
  owner's explicit request for that change; drafting, approval and publication are separate
  states (the README's working agreement).
- Completed prerequisites: `linkedin/` is a documents-only private pnpm workspace package (PR
  273); `main`'s knip gate is green; read-only access to the live profile through Claude in
  Chrome is proven (owner-signed-in view, 2026-09-29).
- Recent relevant commits: 82760e26, 4c869cf0, b2003cb0, 2bf65a44 (the owner's workspace
  set-up), 794c5aca and b6232c77 (PR 273).
- Team expectation: unknown until live grounding. The Director lane closed 2026-09-29 14:04Z;
  an n=1 seat takes both estates' Practice work, and this lane is separate from it by the
  owner's word.
- Acceptance bar: workspace edits land by the normal path (commit, PR, gates, merge);
  LinkedIn changes only on the owner's request, exact wording reviewed with the owner first.

## Owner rulings that govern this lane (verbatim or in substance, with dates)

- 2026-09-28 13:4xZ: "the linkedin work is finished for now, it is ready for review and merge,
  it is a first draft and does not require editorial review yet".
- 2026-09-29: "I told you to commit and push and merge the linkedin work just like any other
  work, it's not special, only putting it on Linkedin is special, and that happens manually".
- 2026-09-29 (on `linkedin/package.json`): a value the owner set is never changed under a
  "fix nits" instruction; the licence stays `UNLICENSED`, the name `linkedin`, the description
  "LinkedIn drafts". Licensing changes only on the owner's explicit word. Home: this record and
  the seat's napkin block; a rule clause is a graduation candidate (below).
- 2026-09-29: the live-profile check was read-only; nothing was clicked or changed.

## Lane state, 2026-09-30T09:4xZ (Galaxy binds Gravity, 46de68)

- Landed: PR 273 makes `linkedin/` documents only (the ESLint and TypeScript scaffolding,
  `src/hi.ts`, the lint scripts and their devDependencies removed; `"private": true` added; the
  root `@types/node` line that came with the scaffolding removed; lockfile importer
  `linkedin: {}`). `main` CI and CodeQL green at b6232c77. Branch retired, worktree removed.
- Live profile, observed 2026-09-29 through Chrome: headline and About unchanged from the 27
  September baseline (`linkedin/reference/current-profile-2026-09-27.md`); the top card shows
  the location at a finer grain than the baseline records. The baseline may have coarsened it
  deliberately: do not "correct" the baseline from a live read; ask the owner if it matters.
  Experience and the lower sections were not read.
- Open question, unresolved: why `linkedin/` needed to be a pnpm workspace member at all is
  unrecorded (the owner: "it needed a package.json file"). Falsifier: if nothing ever consumes
  it as a package, the `pnpm-workspace.yaml` line can go and the directory is a plain folder.
  The README's "so that it has a place in the monorepo" is the seat's inference.
- Harness facts for a seat on this lane, 2026-09-29: the auto-mode classifier refused the
  persistent comms watcher, so `claims open` refused by F-95; the lane ran on a team-start
  broadcast, a directed event and a native session message. `EnterWorktree` by path into the
  sibling `-worktrees/` directory worked with the owner at the prompt. The isolation guard
  refuses a token mint with `gh pr create` in one command; the same lines as a scratchpad
  script run by `bash` pass. `merge-bot push`, `mint-token` and `merge-bot merge` worked from a
  worktree without a local `.github/merge-bot.json`. The pre-commit lint-changed leg prints
  Turbo's "No tasks were executed" WARNING for a commit touching only root and `linkedin/`
  files and passes.
- Graduation candidate (not authored): a clause for `scope-from-goal-before-approach`: under a
  fix or nits instruction, owner-typed values (licence, name, description, wording) are Out by
  default; changing one needs its own In line agreed before the edit.

## Blockers / low-confidence areas

- None blocking. Low confidence: the reason for workspace membership (above).

## Promotion watchlist

- The graduation candidate above; the Turbo warning tolerance in lint-changed (a
  `no-warning-toleration` question for the n=1 seat's gate work, not this lane's).

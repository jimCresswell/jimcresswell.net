# LinkedIn profile replacement — the working object

7 October 2026 · Field by field · Replaces Draft 1 as the working object (Draft 1 stays as a
source for the earlier entries).

Every field of the profile appears here with a status. **Approved** text is Jim's word on the
exact copy and changes only on his word. **Open** fields carry the settled decisions that govern
their drafting. Nothing here is applied to LinkedIn until Jim asks, with him present, in one
sitting, after a PDF export of the old profile. The reasoning behind the design is in the thread
record `.agent/memory/operational/threads/linkedin-workspace.next-session.md`.

Naming and attribution: the product is the **Oak AI plugin** on the profile, Oak's own language
(its page is <https://www.thenational.academy/ai-plugin>); Model Context Protocol (MCP) appears
once in the Oak entry as the technical term and as a skill; vendor terms (plugin, app, connector)
appear only when naming a vendor's listing; Jim's five contributions and the credit to Oak's
curriculum experts govern the Oak entry's plugin movement. The decisions and their context are
[EDR-007](../docs/editorial/decision-records/007-oak-ai-plugin-naming-and-attribution.md)
(8 October).

The copy of every field lives in [`profile.md`](profile.md), the one home, under the LinkedIn
section headings with a status line each; this container holds the decisions. Jim reads and
edits the copy in the local editor (`pnpm --filter linkedin editor`; the README's editor section),
whose rendering reports each field's count against its believed limit and shades the 200 and 300
character folds; his edits land in `profile.review.md`, never in the source.

## Headline — approved (Jim, 7 October 2026; set by him in August)

The copy: [`profile.md` § Headline](profile.md#headline).

## About — approved (Jim, 7 October 2026, "I am very happy")

The copy: [`profile.md` § About](profile.md#about). Paragraph one is what shows before "see
more"; the editor reports the count.

## Experience — Oak National Academy — drafted, revised by Jim, under the readers

Three positions, grouped under Oak, dated by Jim on 10 October (correcting the chronology the
8 October draft carried; "a consulting Principal after the first 5 months", the dates showing
the move from independent consultant to employee): **Senior Developer (consulting)**, August to
December 2020, "there at the beginning", five months to ship the first teacher-facing service;
**Principal Engineer (consulting)**, January 2021 to May 2022, the strategy through the move
from emergency response to permanent service and from contractors to teams, closing on the
position being formalised; **Principal Engineer**, June 2022 to present, meaning
engineering strategy, in labelled movements in Jim's words: joining to
get the first teacher-facing service over the line; contributing to defining the engineering
function (best practice, the first QA and engineering-manager hires, collaborative approaches,
long-term investment in reducing the cost of innovation); checks and continuous delivery before
the rebuild; driving the rebuild and accepting the risk; the Oak AI plugin, with the SDK as the
necessary step, spanning the last two and a half years (the OCE repository about the last year,
before it a hand-written SDK for the Oak Open API and the Practice's progenitors); the shift from
what is possible to how Oak's values are embodied; the Practice. No Head of DevOps entry; the
June 2022 employment change is where the Principal entry starts. Location per Jim's rule
(entries with a location carry it; remote says United Kingdom).

The plugin movement follows EDR-007: Jim's five contributions in his order (conceiving the
opportunity; formulating and expressing the need; creating the engineering framework for rapid
development with AI, the Practice; carrying out the development; steering the strategy
throughout); the curriculum content and its sequencing credited to Oak's curriculum experts; and
the completion of zero to one with the phased handover to a cross-discipline, stream-aligned
product squad as the movement's closing beat, worded to stay true after the handover completes.
The entry names Model Context Protocol once: the plugin works in any AI assistant that supports
MCP. Title: Principal Engineer stands; Senior Principal Engineer only if it is the title Oak would
confirm, Jim's word (8 October: LinkedIn's seniority facet reads the title and buckets both the
same, so the prefix buys nothing there).

### The draft (8 October, by the write-for-the-reader method; Jim reads second)

Written from the reader's decision and the three beliefs (the private record holds them), read by
`editor`, `prose-expert` and the `audience-reader` before this text was set down, then proofed
against the sources. The copy of both entries: [`profile.md` § Experience](profile.md#experience),
the Principal Engineer entry and the Senior Developer (consulting) entry, each
`Status: drafted (8 October 2026; revised by Jim, 10 October 2026, under the readers)`: on
10 October Jim revised both entries and the About in the local editor (the dates above, the
squad count, the leadership audience, the Team Topologies beat, the Practice sentence, the
consulting entry's opening and closing sentences), and the revised text went back through
`prose-expert` and the `audience-reader`. A second round the same day, from Jim's answers to
that read (the consulting years split into two cards; the level at Oak, Principal beside Head of
Engineering under the Director of Engineering, one holding strategy, standard and vendor and
partner relationships, the other budget and people; the Practice defined for a reader who has
never met it, and its adoption by the engineers on the Open Curriculum Ecosystem repository):
the `editor` and `prose-expert` read the new material in parallel, the structural change landed
(the level stated as the shape of the function in the Principal card's opening, as fact and not
as a denial; the current card keeps the arc from four contractors to nine teams and the
consulting cards own their years), then the `audience-reader` read the whole block. Jim's
correction of that round, kept: his answers to the seat are not copy; the reader's sentence is
written from the fact, never pasted from the chat. One number entered the block, Oak's scale
during the closures (over a million pupils a day at the height), sourced from a colleague's
public profile and dated to no month, so it sits on the consulting Principal card and not the
five-month card; Oak's own published figure replaces it if Jim wants it cited. Length is
information, never a target: the editor reports each entry's count against the believed limit
of 2,000 for a position description, unverified until the live editor (the Principal entry
stands above it; Jim, 10 October: rounds of editing remain and the count comes down later). If
the field refuses the text, what moves to another surface is Jim's editorial choice.

Open for Jim, with the draft:

- The rebuild's date, now load-bearing: "I made the emergency platform safe to change before
  anything else" sits on the current card and the pre-rebuild work sits on the consulting card
  (its dates); if the rebuild was argued before June 2022 the whole movement moves to the
  consulting card and the current card keeps the consequence sentence.
- "meant no child missed out on education": Jim's phrase, chosen twice; the editor's reading
  stands beside it, that a funder discounts an absolute no reader can check.
- "As Oak became a permanent public body, an arm's-length body of the Department for
  Education": Oak's own description (the status from September 2022, after the June 2022
  formalisation, so the sentence ties the two by "as", a process, not a date); Jim's "England's
  official curriculum body" is the stronger phrase and his to restore.
- The About's fold: the first ~200 characters carry the opener and the physics sentence and no
  leadership signal; a proposed second sentence that states the level and the largest
  consequence is with Jim in chat, not applied, the About being approved copy.

- The handover tense. "has its own cross-discipline product squad now, building out the
  direction I set" is true during the phased handover and after it; "stream-aligned" is dropped
  for the reader; Jim's 10 October revision of that sentence kept both.
- The pattern sentence ("go where the next problem is still unformed") on a current role: Oak
  colleagues can read it as a departure notice. His call.
- Whether anyone else on the plugin's engineering needs credit beside the curriculum experts; no
  source names a team size and the draft claims none.
- What was deliberately not built, and what the plugin cost, if he wants either named; no source
  holds them.
- An adoption or reach figure for the plugin, if one exists and is publishable; the path proves
  existence, not use.
- The About's "In the spring of 2020" against the Senior entry's "launched that April" and its
  August start; his to reconcile or leave.
- "began in 2024" is derived from his "two and a half years" of 7 October; "Four years on" is his
  particular and the About's, and the readers compute it against today, so the rebuild's year
  would let the entry carry an absolute date instead.
- "checks and continuous delivery", the two mechanism words of his pre-rebuild movement, are out
  of the entry on the readers' word (mechanism at every reader's altitude); the movement's
  substance stays as "made the emergency platform safe to change before anything else".
- The level claim, answered by structure on 10 October: the Principal card opens on the strategy
  he holds and the shape of the function (Principal beside Head of Engineering under the
  Director of Engineering, the Head with budget and people, the Principal with strategy, the
  standard and the vendor and partner relationships), so the reader has the reporting line and
  the scope without a denial of the title; the wording is reusable across surfaces and takes an
  EDR once it settles.
- "Oak had launched that April" rests on public knowledge of April 2020; "before the plugin was
  more than an SDK, I was building a Practice" and the Senior entry's "the first months had left
  no time for" are the seat's readings of his chronology and the entity graph's role description.
- The plugin carrying the curriculum principles and accessibility standards is verified for the
  Claude plugin (0.1.6); whether the ChatGPT app carries them is not.
- "helped define the function" is the one collaborative hedge kept on purpose; the title
  question above. The site's entity graph was brought to the three cards on 10 October at Jim's
  word ("fix the graph to match the linkedin data, don't overwrite the content"): the 2021 to
  2022 role is Principal Engineer (Consulting), January 2021 to May 2022, its description kept;
  the squad count is six in the graph and the CV content. The LinkedIn content itself reaches
  the graph later, as new nodes, at his word.

## Top card, photo, banner, volunteering, organisations, interests — open

The photo stays (Jim, 6 October: everything changes except the photo, for want of a better one).
Name as now; pronouns are Jim's call. Top-card location and industry are set deliberately as
retrieval coordinates at application, verified live. Banner: open, Jim's call. Volunteering
(Growing Communities) and organisations (Institute of Physics, current) stay, brief and true.
Activity and interests are not profile content and are left as they are. The VoxQuant company
page under Jim's account reserves a name only (Jim, 7 October) and gets no entry and no
organisation line.

## Experience — earlier entries — open

Brief and true, each a concrete instance of the pattern, never a repeated theme: Code Science
(founder; incorporated 9 February 2015, dissolved 2 January 2024); Medicspot; Obaith (a research
project, full time); the UK Passport Office; British Airways; We Predict; FT Labs; Carnegie
Mellon University in Qatar; the University of Portsmouth; HP Labs. Draft 1 is the source for
their facts. "Fractious" goes.

## Featured — open

First: the Oak AI plugin, led by Oak's page <https://www.thenational.academy/ai-plugin>, with the
Claude marketplace listing beside it. Second: the Oak National Academy site. The OCE repository
<https://github.com/oaknational/oak-open-curriculum-ecosystem> serves developers and sits under
Projects as well.

## Projects — open

The Oak AI plugin with the repository link, for the public and indexed route.

## Skills — open

Additive: endorsements kept; senior, AI and public-sector skills added; the top three pinned;
tool skills demoted down the list; the limit (believed one hundred) verified at pre-application;
any removal named by Jim at the time.

## Recommendations — open

Two or three specific ones from senior colleagues at Oak or its department; who to ask is Jim's.

## Education, publications, certifications, contact — open

From the entity graph and Draft 1; the thesis spelling is Theremin; Institute of Physics
membership is current.

## Settings — open

Open to Work off. The "share profile updates with your network" setting stays off during
editing; one deliberate notification at the end. Public visibility as now. The custom profile URL
stays.

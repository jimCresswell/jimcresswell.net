# EDR-007: The Oak AI plugin on the LinkedIn profile — naming and attribution

## Status

Accepted

## Date

2026-10-08

## Context

The LinkedIn profile replacement (its working object is
[`linkedin/profile-replacement.md`](../../../linkedin/profile-replacement.md)) presents the product
Jim conceived at Oak: Oak's curriculum reachable from inside the AI assistants teachers already
use. The product carries several names, each true in its own context, and the Oak entry on the
profile must say what Jim did and what others did.

The names, observed first-hand on 8 October 2026:

- Oak's own page, <https://www.thenational.academy/ai-plugin>, is titled "Oak Curriculum MCP" and
  headed "Bring Oak's curriculum into your AI tools". The page itself uses "AI plugin" (its
  licensing line), "plugin" and "connector" (its install line) and "MCP" (its developer line: any
  AI tool that supports Model Context Protocol connections). It lists ChatGPT and Claude as
  available and announces Gemini and Copilot.
- Anthropic's public listing, <https://claude.com/marketplace/connectors/oak-national-academy>,
  calls it a connector throughout. The entry in Claude's in-app plugin directory requires sign-in
  and has no public page.
- The installed Claude plugin (version 0.1.6, author Oak National Academy, documentation URL Oak's
  page above) is the MCP connector at mcp.thenational.academy bundled with five skills (Oak's six
  curriculum principles with guiding principles for fifteen subjects; the same grounded in Oak's
  live curriculum data; accessibility to WCAG 2.2 AA; find-misconceptions; audit-sequence) and
  two sub-agents. Its changelog records the first release on 7 August 2026, the ChatGPT package
  cut from the same source on 17 September, and the rename to Oak National Academy on 30
  September. The plugin's source repository is the one the container links under Projects; the
  directory lists a published copy of it.

Jim's word on the names (8 October): Oak's language is "AI plugin"; depending on context the
product is referred to as MCP, MCP app, connector or plugin, terms that mean subtly different
things on different vendor platforms, all of which the product satisfies.

Jim's word on attribution (8 October, spelling corrected): "the content was authored by curriculum
experts, not me, the sequencing likewise; my contributions are conceiving the opportunity,
formulating and expressing the need, creating the engineering framework to allow rapid development
with AI, carrying out that development, and steering the strategy throughout. Now that zero to one
is complete the project is undergoing a phased handover to a cross-discipline stream-aligned
product squad."

## Decision

Naming:

1. The profile's name for the product is **the Oak AI plugin**, Oak's language. The approved About
   already uses it.
2. **Model Context Protocol (MCP)** appears once in the Oak entry as the technical term, in a form
   that does not date: the plugin works in any AI assistant that supports MCP. MCP is also a
   listed skill, since it is the term an AI-literate searcher uses.
3. Vendor terms appear only when naming a vendor's listing: plugin for Claude, app for ChatGPT,
   connector where the listing says connector. The profile never substitutes a vendor's term for
   Oak's name.
4. Featured: the item for the plugin leads with Oak's page and carries the public Claude listing
   beside it; Oak's one-line description, "Oak National Academy's Open Curriculum plugin for AI
   assistants", serves as the item's description. The in-app directory entry is not a Featured
   link. The source repository, linked from the container, is the developer route under Projects;
   the published copy needs no place on the profile.

Attribution:

1. The Oak entry's plugin movement carries Jim's five contributions in his words and his order:
   conceiving the opportunity; formulating and expressing the need; creating the engineering
   framework for rapid development with AI, which is the Practice the About names; carrying out
   the development; steering the strategy throughout.
2. The curriculum content and its sequencing are credited to Oak's curriculum experts in the same
   movement. The plugin's skills encode those experts' principles; the plugin's shape is Jim's
   origination.
3. The completion of zero to one and the phased handover to a cross-discipline, stream-aligned
   product squad closes the movement, worded so that it stays true after the handover completes:
   build the first thing and the way of working, then set the direction others build against and
   hand it on. On the profile this is the origination pattern shown, never a loss of ownership.
4. Every claim in the movement answers the evidence questions: what changed, what Jim did, what
   others and agents did, what was not chosen, what cost was accepted.

## Consequences

- The approved headline and About stand unchanged. "I conceived the Oak AI plugin and built it"
  and "I first built the way of working" are the contributions above in the About's register, and
  "a fully sequenced, openly licensed curriculum" is already the experts' work inside Jim's
  sentence.
- The Oak entry (Principal Engineer, June 2022 onward by Jim's dating of 10 October 2026; the
  consulting years are two entries, Senior Developer (consulting) August to December 2020 and
  Principal Engineer (consulting) January 2021 to May 2022) is drafted with this movement as its
  proof layer. Readers who were there, Oak colleagues and Oak's leadership, are also the path by
  which any serious reader verifies the claim, so the attribution is what lets it survive
  inspection.
- The skills list gains Model Context Protocol (MCP). The Featured and Projects entries follow
  decision 4 under Naming.
- Working documents that call the product "the MCP app" or "the Oak Curriculum MCP" describe the
  same product; new copy uses the names above.
- The container points here for naming and attribution; the thread record carries the pointer.

## Related

- [EDR-001](001-oak-curriculum-data-description.md) — what the curriculum data is
- [EDR-004](004-enabling-vision-leverage-third-order.md) — leverage through third-order effects
- [EDR-005](005-oak-p3-rewrite.md) — the Oak experience narrative on the site
- [editorial-strategy.md](../../../.agent/directives/editorial-strategy.md) — audience,
  composition and the platform pass
- [`linkedin/profile-replacement.md`](../../../linkedin/profile-replacement.md) — the working
  object this record governs

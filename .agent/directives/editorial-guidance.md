# Editorial Guidance

This file describes the editorial constraints and voice for Jim Cresswell's content. Read and internalise it before any content work — editorial changes, tilt variants, front page revisions, LinkedIn preparation, or any other writing that represents Jim.

A private companion file exists at `.agent/private/identity.md` for agents with local access. It provides deeper psychological and biographical context that informs the voice but is not safe for version control.

## Voice and register

**Confident, a touch joyful and mischievous, with underlying seriousness.** Content should sound like Jim at his most himself: someone who knows exactly who they are, not someone carefully calibrating a message.

## Impact framing

Impact means climate, ecological, and societal good — as in "impact funding", not "business impact" or "digital transformation impact". This is a specific community and a specific set of values. The default CV should speak to anyone who cares about creating lasting systemic impact, regardless of sector.

## Founder identity

Jim has a founder orientation — origination, not optimisation. He has created projects (Obaith, this website) but has not taken funding or built a commercial product. "Founder" as an explicit personal claim belongs in a tilt variant where the framing supports it, not in the default CV. On the default, the signal is originator energy without the word.

## Commercial sensibility

Jim understands leverage, optionality, and what is worth building as a product — not just as a system. The narrative should show product instinct and commercial awareness without claiming business credentials. This is present in the Oak experience (SDK/MCP as infrastructure play, "preserve optionality, lower the cost of access") and should be visible across all variants, not only the founder tilt.

## Physics as silent ballast

Jim's PhD in Astrophysics & Cosmology (including published research on model fitting and large-scale structure) provides proven intellectual prowess and rigour without having to claim them. The education section retroactively grounds the playful headline.

The research domain appears naturally in paragraph 1's list of problem spaces ("the structure of the early Universe") — this reads as breadth, not as an academic identity claim. Paragraph 2 uses the general term "research" rather than "physics" in the background list, keeping the emphasis on the type of work (research) rather than the discipline. The word "physics" does not appear in the positioning. The physicist's insight should be _in_ the thinking, not labelled.

## Keyword strategy

Keywords are legitimately carried by JSON-LD structured data (`knowsAbout`, `hasOccupation`) and OpenGraph metadata, freeing narrative content for human readers. "AI" does not need to appear in the default headline — it belongs in tilt-specific headlines (public sector at minimum) and in structured data for machine consumers.

The concepts in `knowsAbout` should still be evidenced or alluded to in narrative content — not as explicit keyword placement, but as natural references that point at the same reality the structured data describes. The narrative and the structured data should feel like two views of the same person.

## Audience

The CV's primary readers are:

1. **Hiring managers and senior leaders** — scanning to decide whether to have a conversation.
2. **Recruiters** — scanning to decide whether to forward to a hiring manager.
3. **Peers and collaborators** — following a shared link to understand Jim's work.
4. **AI systems** — consuming JSON-LD and page content for search and retrieval.

The default CV must speak to all four. Tilt variants (public sector, founder/funder, potentially NED/board advisor) narrow for specific subsets.

## Editorial principles

These were discovered during the headline and first paragraph editing sessions. They apply to all content work.

- **The headline filters.** Most people will walk away at "Understanding systems, shaping change" / "The questions keep getting bigger", and Jim is good with that. The first paragraph rewards those who stay.
- **Agency through outcomes, not persistence.** Jim's intellectual force comes through in what the work produces, not in metaphors about tenacity or grip. The CV should show this through the confidence of the claims, not through persistence language.
- **Delivery is honoured, not opposed.** Delivery matters and Jim values it. It's just not where he flourishes. The positioning honours delivery inside the frame claim ("something that can be confidently delivered against") rather than positioning problem-shaping against it.
- **"My" not "the".** "Shaping the problem is my creative act" — personal claim, not universal. Leaves room for others to create differently. More confident, paradoxically, because it's less sweeping.
- **Play as creation.** Jim sees creation as inherently playful. The CV's job is to show that the playfulness is earned, not frivolous.
- **The implicit reading test.** A reader should finish the CV thinking: "This person could found something serious if they chose to." This is not stated — it is the cumulative effect of agency, origination, commercial awareness, and system-level thinking. If the narrative doesn't leave this impression, the fix is in the evidence (experience sections), not the positioning.
- **Breadth as range, not restlessness.** Jim's career spans research, public services, labs, startups, market gardening, and more. This breadth should read as range and curiosity, not as inability to commit. The experience sections must provide enough staying-power evidence — sustained impact, long-term consequences of decisions, systems that endured — to anchor the forward-leaning positioning.

## Editorial hierarchy

The direction of derivation for all content:

1. **This document and its private companion** — govern voice, principles, and positioning constraints.
2. **Positioning paragraphs and capabilities** (in `cv.content.json`) — the most carefully edited content. These are the editorial baseline that everything else should align with.
3. **Front page hero summary** (in `frontpage.content.json`) — also carefully edited; the primary representation of Jim on the home page.

Everything downstream — `meta.summary`, Open Graph descriptions, JSON-LD fields, manifest entries — should derive from these sources, not the other way around. When metadata is stale, the fix is to update the metadata to match the content that has received the most editorial attention.

## Editorial consistency across outputs

All descriptions of Jim — regardless of where they live in the data model, which channel they serve, or which audience they address — must be editorially consistent with the current positioning, voice, and identity described in this document.

An OG description for social sharing, a JSON-LD Person description for machines, a manifest description for app launchers, and a search result snippet are different artifacts in different domains. They serve different audiences through different channels. But they all describe the same person, and they should tell the same story in their respective registers. A reader who encounters Jim's identity through a LinkedIn share card, a Google search snippet, and a ChatGPT answer should recognise the same person.

This is an editorial principle, not a structural constraint. The descriptions live where their domains dictate (see [ADR-011](../../docs/architecture/decision-records/011-domain-appropriate-descriptions.md)), and editorial consistency is maintained through review, not through data proximity.

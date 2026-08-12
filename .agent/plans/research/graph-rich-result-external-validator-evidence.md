# Rich-Result External Validator Evidence

## Status

Recorded on 2026-03-09 as the first Track A Phase A4 external-validation note
for
[personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md).

Subsequent state (2026-08-12): ADR-020 adds a bounded Person identity-atom seam
to visible composition and ADR-021 retires audience-tilt routes. The external
validator evidence remains a dated record for the surfaces tested then.

Use this note with:

- [personal-knowledge-graph-roadmap.plan.md](../current/personal-knowledge-graph-roadmap.plan.md)
- [personal-knowledge-graph-execution.plan.md](../current/personal-knowledge-graph-execution.plan.md)
- [graph-publication-consumer-and-proof-model.md](graph-publication-consumer-and-proof-model.md)
- [graph-publication-output-audit.md](graph-publication-output-audit.md)
- [graph-cv-metadata-description-proof.md](graph-cv-metadata-description-proof.md)

This note records external validator outcomes and validator-side limitations for
the rich-result-facing inline graphs on `/` and `/cv/`. It does not widen Track
A into Track B composition work. Editorial prose still comes from
`content/frontpage.content.json` and `content/cv.content.json`; ADR-020 now
injects bounded shared Person identity atoms.

## Method

The validation target on 2026-03-09 was the deployed live site:

- `https://www.jimcresswell.net/`
- `https://www.jimcresswell.net/cv/`

The validation method stayed focused on the current Track A-owned surface:

1. load the deployed page
2. extract the emitted inline `application/ld+json` script
3. wrap that exact payload in a minimal HTML document for code-mode validation
4. run the official external validators against either the live URL or that
   emitted snippet, depending on which mode the tool would accept

This kept the proof on the emitted inline graph rather than inventing a new
publication shape.

## Results

### Schema.org Validator

#### `/`

- Code mode succeeded against the emitted live home-page snippet.
- The validator reported `0 ERRORS`, `0 WARNINGS`, and `12 ITEMS`.
- The visible result groups included a `ProfilePage` card plus additional
  zero-error item groups.

#### `/cv/`

- URL mode did not produce a usable result.
- Repeated validator access for the CV surface was redirected to Google's
  anti-abuse `sorry` flow before any Schema.org result was returned.
- No stable code-mode result could be captured for `/cv/` from this automation
  environment after the validator started rate-limiting.

#### Schema.org validator limitations observed

- Early URL-mode validation on `https://www.jimcresswell.net/` returned:
  `The URL was not found. Make sure the domain name is correct and the server is responding with a 200 status code.`
- Later validator attempts, including `https://www.jimcresswell.net/cv/`, were
  blocked by the validator's anti-abuse layer before a result page was
  available.

### Google Rich Results Test

#### `/`

- URL mode returned the generic tool failure:
  `Something went wrong`
- The same URL-mode attempt also surfaced:
  `Log in and try again`
- Code mode against the emitted live snippet also returned:
  `Something went wrong`

#### `/cv/`

- Code mode against the emitted live snippet returned:
  `Something went wrong`

#### Google Rich Results Test limitations observed

- The official tool did not return a stable eligibility or non-eligibility
  verdict for either rich-result-facing page from this automation environment
  on 2026-03-09.
- That limitation is tool-side proof friction, not a reason to widen Track A or
  change the current page/document contract.

## Follow-up boundary check on 2026-03-09

- A direct fetch of `https://www.jimcresswell.net/cv/` from the current
  automation environment returned Cloudflare's managed challenge page
  (`Just a moment...`) instead of the emitted CV HTML, so the earlier
  live-snippet extraction method could not be repeated cleanly for `/cv/`.
- A direct fetch of `https://validator.schema.org/` redirected immediately to
  Google's anti-abuse `sorry` flow before the validator UI loaded.
- A direct fetch of `https://search.google.com/test/rich-results` served the
  tool shell, but no stable non-browser submission or result path was available
  from this environment for the remaining Track A pages.

## What this proves now

- The live home-page inline graph passes Schema.org Validator code-mode checks
  with zero recorded errors and warnings.
- The official external-validator requirement is now partially evidenced and
  explicitly bounded rather than purely planned.
- Track A now has a truthful record of validator-side failure modes instead of
  pretending external proof was cleanly available.
- The remaining proof gap is validator and public-access instability from this
  automation environment, not a missing internal Track A correctness proof.

## Accepted boundary for this slice

- The remaining `/cv/` Schema.org capture and Google Rich Results Test verdicts
  are now accepted validator-side limits for Track A Phase A4.
- Future manual or browser-based retries may add evidence if the live output
  changes materially or a cleaner validation path becomes available, but Track A
  does not keep this slice open waiting for that.

Track A Phase A4 is therefore complete for the current publication surface.

## Track boundary

This is still Track A publication work.

It does not change:

- visible HTML ownership
- Track B source-of-truth responsibilities
- the rule that the site is not yet graph-derived in visible rendering

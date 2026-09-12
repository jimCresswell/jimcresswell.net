# Next Outbound Pass

These are the only outbound candidates currently worth carrying as ephemeral
support on the next Practice exchange.

## Candidates

1. `PDR-030` — rendering-risk changes need blocking visual proof (originally
   drafted locally as PDR-025 on 2026-04-19; renumbered the same day after an
   incoming Core carried an upstream PDR-025 and prior reservations through
   PDR-029)
2. ADR-019's production-build E2E move, if a receiving repo is still proving
   behaviour against a dev server
3. The five-platform adapter estate plus the validator split
   (`portability:check`, `subagents:check`, `vital-surfaces:check` — PDR-008
   canonical names; the implementation files remain `scripts/validate-*.mjs`)
   if a receiving repo is adopting multi-platform support
4. A deliberate fresh first-contact re-read of the same upstream Practice pack,
   if the receiving repo wants to test whether its newly ratcheted local
   Practice changes the integration judgement

## Why this is ephemeral

The durable substance already lives in the repo's canonical surfaces. This note
exists only to point a receiving repo at the most relevant recent additions
without making `outgoing/` a second long-term knowledge store.

---
name: LinkedIn Update
overview: Compose LinkedIn-native profile content from private local sources while keeping drafts, raw evidence, personal analysis, and collaboration records out of the public repository.
todos:
  - id: continue-private-editorial-pass
    content: Continue the owner-led editorial pass in the ignored private working repository.
    status: in_progress
isProject: true
---

# LinkedIn Update

## Status

In progress on a private local working surface. This tracked file is a routing
stub, not a draft or evidence store.

## Outcome, impact, and value mechanism

**Outcome:** a LinkedIn profile that represents Jim accurately and works in
LinkedIn's fixed fields, collapsed previews, scanning patterns, and professional
graph.

**Impact:** the right readers can recognise the relevant identity, scope,
evidence, and direction without mistaking the LinkedIn profile for a copy of the
CV or front page.

**Value mechanism:** private source material supports truthful editorial
judgement; public-safe directives govern voice and composition; only content Jim
chooses to publish crosses the private boundary.

## Privacy boundary

- Drafts, profile exports, raw source packs, personal analysis, and
  collaboration records live only in the ignored nested repository under
  `.agent/reference-local/editorial-private/`.
- Do not copy that repository's URL, commit identifiers, source material, or
  working discussion into public Git history.
- The public repository retains only general editorial governance in
  `editorial-strategy.md`, identity and voice constraints in
  `editorial-guidance.md`, and this routing stub.

## Surface fit

LinkedIn, the CV, the front page, and structured metadata share a person and an
evidence base but optimise for different reading modes. LinkedIn usually needs
recognisable language earlier, shorter independent modules, deliberate
repetition across fixed fields, and stronger first-contact performance than the
CV.

## Resume

1. Confirm the ignored private repository is present and remains private.
2. Read `editorial-strategy.md` and `editorial-guidance.md`.
3. Work only on drafts and evidence inside the private repository.
4. Treat the owner-set headline as closed and continue with the About section; do not reopen the
   headline unless Jim does.
5. Move only final, owner-approved copy to LinkedIn itself; do not stage it in
   the public repository.

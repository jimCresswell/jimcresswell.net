# Outgoing Practice Context

This directory carries sender-maintained supporting context for Practice
exchange.

It is not canonical. The canonical portable package remains the seven files in
`.agent/practice-core/`.

Use these files to explain:

- why recent Practice changes were made
- which local adaptations are specific to this repo
- which false starts or corrections are worth reusing elsewhere
- how to adopt repo-specific platform support that is too detailed for the Core

If a change is significant enough to enter the practice-core changelog,
consider whether the changelog alone is too thin and whether a supporting note
or report here would help a receiving repo.

Keep this directory small. If something is already obvious from the seven-file
Core package, its changelog, or the sender repo's canonical permanent docs, do
not duplicate it here.

## Current outgoing set

- `codex-adoption-report.md` — local Codex wiring choices and adoption order
- `evolution-rationale.md` — why recent Practice changes mattered here
- `false-starts-and-corrections.md` — cheap lessons from recent integration
- `local-adaptations.md` — shapes that are useful locally but not universal
- `validation-scripts.md` — how this repo uses portability and Practice
  fitness validation

This directory may be built up over time. When material is shared to another
repo, copy the relevant files into that repo's `.agent/practice-context/incoming/`.

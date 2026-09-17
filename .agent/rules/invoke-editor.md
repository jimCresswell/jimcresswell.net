---
classification: situational
description: Route editorial and public-copy changes through the editor
trigger: surface:public-facing copy, CV and front-page content, structured-data descriptions, editorial docs
globs:
  - content/**/*
  - docs/editorial/**/*
  - app/**/*
  - lib/jsonld.ts
---

# Invoke Editor

Invoke `editor` when changes alter public-facing copy, CV or front-page content, structured-data
descriptions, or editorial docs. Use it whenever Jim's public voice or narrative
framing changes.

Give the editor a short brief naming what to review (a section, a draft, a narrative against a
source). The editor reads `.agent/directives/editorial-strategy.md`,
`.agent/directives/editorial-guidance.md`, the `editorial-voice` skill and the relevant EDRs
(`docs/editorial/decision-records/`), then the content itself, and returns structured feedback
(`must fix` / `should fix` / `consider`) with precise citations and any ripple effects to other
content. The editor is read-only; you apply the feedback.

See `.agent/sub-agents/templates/editor.md` for the full reviewer brief.

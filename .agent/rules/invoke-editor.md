---
classification: situational
description: Route editorial and public-copy changes through the editor
trigger: surface:public-facing copy, CV and front-page content, LinkedIn workspace drafts, structured-data descriptions, editorial docs
globs:
  - content/**/*
  - docs/editorial/**/*
  - app/**/*
  - lib/jsonld.ts
  - linkedin/**/*
---

# Invoke Editor

Invoke `editor` when changes alter public-facing copy, CV or front-page content, drafts in the
LinkedIn workspace (`linkedin/`), structured-data descriptions, or editorial docs. Use it whenever
Jim's public voice or narrative framing changes.

Give the editor a short brief naming what to review (a section, a draft, a narrative against a
source). The editor reads the sources its template lists, then the content itself, and returns
structured feedback (`must fix` / `should fix` / `consider`) with precise citations and any ripple
effects to other content. The editor is read-only; you apply the feedback.

See `.agent/sub-agents/templates/editor.md` for the full reviewer brief.

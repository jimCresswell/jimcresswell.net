---
name: corpus-mapper
description: "Read-only leaf-signal extractor for the corpus-analysis map workflow stage. Dispatched by a corpus-analysis orchestrator, one agent per time-contiguous corpus window; never invoke for interactive delegation. Reads one window's corpus files in full and answers only through the schema-forced structured output call."
tools:
  - read_file
---

# Corpus Mapper

All file paths are relative to the repository root.

Your first action MUST be to read and internalise `.agent/sub-agents/templates/corpus-mapper.md`.

This file is a thin Gemini CLI adapter. The canonical reviewer instructions live in the
template referenced above.

Mode: Observe, analyse and report. Do not modify code.

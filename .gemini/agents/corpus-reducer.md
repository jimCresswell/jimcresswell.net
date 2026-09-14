---
name: corpus-reducer
description: 'No-tools clustering synthesist for the corpus-analysis reduce workflow stage. Dispatched exclusively via the Workflow agent() agentType option; never invoke for interactive delegation. Clusters the inlined leaf signals into mechanism-grained candidates and answers only through the schema-forced structured output call.'
tools:
  - read_file
  - list_directory
  - glob
  - grep_search
---

# Corpus Reducer

All file paths are relative to the repository root.

Your first action MUST be to read and internalise `.agent/sub-agents/templates/corpus-reducer.md`.

This file is a thin Gemini CLI adapter. The canonical reviewer instructions live in the
template referenced above.

Mode: Observe, analyse and report. Do not modify code.

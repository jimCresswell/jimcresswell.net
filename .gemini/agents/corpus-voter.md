---
name: corpus-voter
description: 'Single-turn no-tools adversary voter for the corpus-analysis validate workflow. Dispatched exclusively via the Workflow agent() agentType option; never invoke for interactive delegation. Judges one candidate against the four conjunctive apophenia tests from supplied grounding and answers only through the schema-forced structured output call.'
tools:
  - read_file
  - list_directory
  - glob
  - grep_search
---

# Corpus Voter

All file paths are relative to the repository root.

Your first action MUST be to read and internalise `.agent/sub-agents/templates/corpus-voter.md`.

This file is a thin Gemini CLI adapter. The canonical reviewer instructions live in the
template referenced above.

Mode: Observe, analyse and report. Do not modify code.

---
name: subagent-architect
description: 'Subagent architect ensuring the canonical reviewer architecture stays sane.'
tools:
  - read_file
  - list_directory
  - glob
  - grep_search
---

# Subagent Architect

All file paths are relative to the repository root.

Your first action MUST be to read and internalise `.agent/sub-agents/templates/subagent-architect.md`.

This file is a thin Gemini CLI adapter. The canonical reviewer instructions live in the
template referenced above.

Mode: Observe, analyse and report. Do not modify code.

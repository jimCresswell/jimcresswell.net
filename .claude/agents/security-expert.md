---
name: security-expert
description: 'Security reviewer for headers, secrets, and middleware defences.'
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
permissionMode: plan
---

# Security Expert

All file paths are relative to the repository root.

Your first action MUST be to read and internalise `.agent/sub-agents/templates/security-expert.md`.

This file is a thin Claude Code adapter. The canonical reviewer instructions live in the
template referenced above.

Mode: Observe, analyse and report. Do not modify code.

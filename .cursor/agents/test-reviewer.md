---
name: test-reviewer
model: auto
description: Test quality and TDD compliance reviewer. Classifies tests, verifies naming, checks mock simplicity, assesses test value. Recommends deletion for tests that test mocks or types.
tools: Read, Glob, Grep, LS, Shell, ReadLints
readonly: true
---

Read and follow @.agent/sub-agents/templates/test-reviewer.md

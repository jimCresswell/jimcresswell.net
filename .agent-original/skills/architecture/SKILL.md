---
name: architecture
classification: active
description: Use when work changes graph, UI, build, or Practice structure and needs the right lane.
---

# Architecture

Use this skill for active architecture work. This repo does not have one
generic architecture reviewer; it has four personae with different authority
lanes, so start by choosing the right lane rather than collapsing them.

## Read in order

1. The relevant architecture lane:
   - Barney: `.agent/rules/invoke-architecture-reviewer-barney.md` and
     `.agent/sub-agents/templates/architecture-reviewer-barney.md`
   - Betty: `.agent/rules/invoke-architecture-reviewer-betty.md` and
     `.agent/sub-agents/templates/architecture-reviewer-betty.md`
   - Fred: `.agent/rules/invoke-architecture-reviewer-fred.md` and
     `.agent/sub-agents/templates/architecture-reviewer-fred.md`
   - Wilma: `.agent/rules/invoke-architecture-reviewer-wilma.md` and
     `.agent/sub-agents/templates/architecture-reviewer-wilma.md`
2. Relevant changed files in the lane you picked
3. The ADRs or Practice files named by that reviewer template

## How to use it

1. If the slice spans multiple lanes, read and apply multiple personae instead
   of forcing one reviewer to cover everything.
2. Settle the boundary before coding: data contract, route and layout contract,
   build and runtime contract, or Practice contract.
3. Keep proof in the right layer: integration tests for data and metadata,
   visual or E2E proof for UI architecture, and build or validator evidence for
   infrastructure or Practice surfaces.
4. Route the finished slice through the matching architecture reviewer
   persona(s).

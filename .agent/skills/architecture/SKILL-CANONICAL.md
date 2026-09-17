---
name: architecture
classification: active
description: Use when work changes workspace, import, graph, UI, build, or Practice structure and needs the right lane.
---

# Architecture

Use this skill for active architecture work. Architecture review here is one
structural reviewer, `architecture-expert`, for workspace boundaries, import
direction and module structure, and four personas with different authority
lanes, so start by choosing the right lane rather than collapsing them.

## Read in order

1. The relevant architecture lane:
   - Structure across the workspaces:
     `.agent/rules/invoke-architecture-expert.md` and
     `.agent/sub-agents/templates/architecture-expert.md`
   - Barney: `.agent/rules/invoke-architecture-expert-barney.md` and
     `.agent/sub-agents/templates/architecture-expert-barney.md`
   - Betty: `.agent/rules/invoke-architecture-expert-betty.md` and
     `.agent/sub-agents/templates/architecture-expert-betty.md`
   - Fred: `.agent/rules/invoke-architecture-expert-fred.md` and
     `.agent/sub-agents/templates/architecture-expert-fred.md`
   - Wilma: `.agent/rules/invoke-architecture-expert-wilma.md` and
     `.agent/sub-agents/templates/architecture-expert-wilma.md`
2. Relevant changed files in the lane you picked
3. The ADRs or Practice files named by that reviewer template

## How to use it

1. If the slice spans multiple lanes, read and apply each lane's reviewer
   instead of forcing one reviewer to cover everything.
2. Settle the boundary before coding: workspace and import contract, data
   contract, route and layout contract, build and runtime contract, or
   Practice contract.
3. Keep proof in the right layer: dependency-cruiser and lint evidence for
   workspace and import structure, integration tests for data and metadata,
   visual or E2E proof for UI architecture, and build or validator evidence for
   infrastructure or Practice surfaces.
4. Route the finished slice through `architecture-expert` for structure across
   the workspaces, plus the persona for each lane it touches.

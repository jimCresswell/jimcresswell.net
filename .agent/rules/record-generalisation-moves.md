---
classification: situational
description: When a change makes an element of the Practice more general or more portable, land a row in the generalisation register (date, element, move, commit, lineage status) in the same commit; it feeds contributions back to the lineage, updates from it, the next transplant, and the later extraction of the Practice.
trigger: surface:agent-tools/**, .agent/practice-core/**, .agent/rules/**, .agent/skills/**, .agent/directives/** — a change that makes a Practice element more general or portable
globs:
  - agent-tools/**
  - .agent/practice-core/**
  - .agent/rules/**
  - .agent/skills/**
  - .agent/directives/**
---

# Record Generalisation Moves

Owner direction (2026-09-13, verbatim): "where we take action to make an element of the
Practice more general, more portable, make a note, that will be important in future work when
we 1. send these improvements back to OCE 2. update our Practice with the enhancements from OCE
3. transplant the Practice to more repos 4. In a later and separate thread, not necessarily in
this repo, look at extracting the Practice as a standalone system with installable elements".

## The Rule

When a change makes an element of the Practice more general or more portable — an instrument
that derives what it used to list, a validator that asks the repository instead of the disk, a
surface that no longer names a host, a lineage number replaced by the concept, doctrine that
states a general form — the change lands with a row in the
[generalisation register](../reports/practice-transplant/generalisations.md): the date, the
element, the move in one sentence, the commit, and the lineage status (sent, owed, local,
from-lineage).

The row is written in the same commit as the change, or in the commit that records it, never
later from memory. An enhancement taken from the lineage is a row too (status from-lineage), so
the register carries both directions of the exchange.

## Why

The register is the input to four later pieces of work: contributions back to the lineage, the
update from the lineage, the next transplant, and the extraction of the Practice as a standalone
system. Each needs the list of what became portable and why; reconstructing it from commit
messages after the fact loses the reason, and the reason is the part that travels.

## Scope

Fires on changes under `agent-tools/`, `.agent/practice-core/`, `.agent/rules/`,
`.agent/skills/`, `.agent/directives/` and the platform adapters, when the change's effect is
generality or portability. A host-specific fix (this repository's own paths, its product) is not
a generalisation move and gets no row.

# Architectural Review Team

Architecture review is one shared brief, `.agent/sub-agents/templates/architecture-expert.md`,
read through four named lenses, each a leaf component under
`.agent/sub-agents/components/personas/`:

- **Barney** - Simplification and dependency/boundary cartography
- **Fred** - Rigorous ADR/boundary enforcement and standards discipline
- **Betty** - System coherence, coupling management, and change-cost trade-offs
- **Wilma** - Failure-mode resilience and adversarial edge-case pressure testing

A host binds the lenses to its own surfaces; the roster below is this host's. In this estate the
brief is also a reviewer of its own, `architecture-expert`, and each lens is bound by a lane
template with its own invoke rule:

- **`architecture-expert`** - Workspace boundaries, import direction, module structure and
  dependency injection across `jcdotnet`, `agent-tools` and `tooling/*`
- **Barney** (`architecture-expert-barney`) - PKG and graph integrity: the entity graph in
  `jcdotnet/content/`, the graph and JSON-LD modules in `jcdotnet/lib/`, and metadata and
  structured data emitted under `jcdotnet/app/`
- **Betty** (`architecture-expert-betty`) - Navigation and layout: routes, navigation, header and
  footer behaviour, and layout composition
- **Fred** (`architecture-expert-fred`) - Builds, caching and resilience: build-time scripts, PDF
  generation, caching headers, the proxy, E2E against the production build, and runtime stability
- **Wilma** (`architecture-expert-wilma`) - Practice governance and docs: `.agent/` surfaces,
  plans, PDR and ADR wiring, and cross-platform Practice contracts

When a finding falls in a colleague's lens or lane, explicitly recommend a follow-up review from
that reviewer by name.

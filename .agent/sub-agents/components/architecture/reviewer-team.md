# Architectural Review Team

Architecture review in this monorepo is one structural reviewer and four named personas, each a
separate sub-agent with its own brief for one lane. This file summarises the lanes; each
reviewer's template and invoke rule carry the detail:

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

When a finding falls in another reviewer's lane, explicitly recommend a follow-up review from that
reviewer by name.

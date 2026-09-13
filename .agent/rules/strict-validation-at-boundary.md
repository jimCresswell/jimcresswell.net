# Strict Validation at External Boundaries

Operationalises [`principles.md` §Compiler Time Types and Runtime Validation](../directives/principles.md) and [`validation-strategy.md`](../directives/validation-strategy.md).

When data arrives from an external boundary (JSON.parse, API responses, file reads, SSE parsing, WebSocket messages), it is `unknown`. Validate immediately to the **exact known expected shape** using strict, complete validation (Zod schema, exhaustive type guard, or official SDK types). From that point on, use the validated type only. Never widen.

`as Record<string, unknown>` is widening, not narrowing — it is forbidden at boundaries just as it is everywhere else. A `typeof === 'object'` check followed by `as Record<string, unknown>` is a type assertion, not validation. It loses all type information.

The correct pattern:

1. Data arrives as `unknown`
2. Validate to the exact interface (e.g. `z.object({ result: z.object({ tools: z.array(...) }) })`)
3. Use the validated, fully-typed result from then on
4. If the shape is genuinely open-ended, that is a design problem to fix, not a type problem to work around

An admission predicate binds every axis it reasons about. Where kind is an
admission axis, an allowlist entry is a (name, kind) pair, never the name
alone: a transient-file allowlist that exempted by basename before kind
handling let a symlink wearing a transient name ride out of the symlink
refusals, and a place-only design-token admission did the same in the same
sitting (2026-08-19). An allowlist that deliberately admits along one axis (a
string-only token allowlist; a path-only stale-invocation allowlist) binds
that one axis and invents no other. Validate each axis the decision depends
on, at the boundary the value crosses.

Owner ruling (2026-07-28): **"Strict, all the time, everywhere"** — every
boundary this repository owns (the content JSON under `jcdotnet/content/`,
environment values, fetched data, hook and CLI inputs) carries a schema and
is validated to it at entry; the entity model's validation in `jcdotnet/lib`
is the founding instance.

See [`validation-strategy.md`](../directives/validation-strategy.md)
§Compile-time types and §Runtime validation at the boundary.

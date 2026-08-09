# No Type Shortcuts

Do not disable the type system with `as` (except `as const`), `any`, or non-null assertions. Prefer
explicit modelling, labelled type imports, and runtime constants that derive the types and guards
you need.

See `.agent/directives/principles.md` for the full policy.

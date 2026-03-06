# Type Safety

No `as` (except `as const`), no `any`, no `!`. These disable the type system. Type imports must be labelled (`import type` or `import { type }`). Validate external data at boundaries with Zod where appropriate.

See `.agent/directives/rules.md` (Type Safety section) for the full policy.

# No Global State In Tests

Tests must not mutate global state. No `process.env` mutation, `vi.stubGlobal`, `vi.doMock`, or
hidden ambient coupling; push configuration into product code parameters and inject simple fakes.

See `.agent/directives/testing-strategy.md` for the full policy.

# Review a Change

After a non-trivial change, run the reviewer flow instead of self-certifying.

## Process

1. Gather the diff and the verification evidence.
2. Invoke the gateway `code-reviewer`.
3. Invoke any direct specialist reviewer whose domain was touched:
   accessibility, config, design system, docs/ADR, editor, MCP,
   PKG, React component, security, test, or type.
4. Treat review findings as blocking until fixed or explicitly accepted by the
   user.
5. Update the plan or continuity surface if review changes the next step.

## References

- `.agent/sub-agents/templates/`
- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`

# Lint After Edit

After each edit pass, run `pnpm check` and the additional proofs the touched surface requires
(`pnpm test:e2e`, visual regression, Practice fitness). Do not disable checks or hand-wave
failures; if a fix mutates files, restart the gate sequence from the top.

See `.agent/directives/principles.md` for the full gate policy.

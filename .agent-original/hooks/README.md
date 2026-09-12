# Hooks

This directory documents the repo's hook policy.

The Practice distinguishes between:

- canonical hook policy and deliberate omissions here
- platform-native activation in tracked config files where supported
- repo-local runtime code in `scripts/` or another explicit runtime surface

At the moment this repo carries a declarative policy only. There is no active
checked-in hook runtime beyond the normal git hooks in `.husky/`, and the old
dead Cursor-plugin hook surface remains intentionally absent.

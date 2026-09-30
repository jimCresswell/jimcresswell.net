#!/usr/bin/env sh

# The Turbo remote cache is optional: this repository enables it, a shell need
# not. Sourced by pre-commit and pre-push after TURBO_UI is set. When the shell
# carries no token, say so in one line and carry on: turbo uses its local cache
# and every gate runs the same. A token the cache refuses is turbo's own
# warning in the gate output, never hidden here. docs/engineering/build-system.md
# §Caching says how a host and CI reach the cache.
if [ -z "${TURBO_TOKEN:-}" ]; then
  echo "Turbo remote cache: TURBO_TOKEN is not set in this shell, so turbo uses its local cache. To share the remote cache, configure an optional remote Turbo cache (docs/engineering/build-system.md, Caching)."
fi

#!/usr/bin/env bash
# Wrap a hook command so non-zero exits and stderr are persisted to a log file.
#
# Hooks declared as non-blocking in .claude/settings.json fail silently: the
# harness records hook_non_blocking_error in the session JSONL but does not
# surface the error to the assistant or to any terminal-visible surface. This
# wrapper makes those failures auditable by appending to .claude/logs/hook-errors.log
# whenever the wrapped command exits non-zero.
#
# The logs directory is kept mode 700 and the log mode 600: it holds hook
# stderr and the PreCompact observer's records of the raw harness payload. A
# symlinked logs directory or log, or one another account owns, is left alone
# and the hook runs unlogged, so no mode change ever follows a link elsewhere.
#
# Usage in settings.json, each ${CLAUDE_PROJECT_DIR} inside double quotes so a
# project path holding a space still resolves (the portability check enforces it):
#   "command": "\"${CLAUDE_PROJECT_DIR}/.claude/hooks/_lib/log-hook-errors.sh\"
#               \"${CLAUDE_PROJECT_DIR}/.claude/hooks/<your>/<script>.sh\""
#
# Stdin (the hook payload from Claude Code) is passed through unchanged.
# Stdout (any hook decision JSON) is passed through unchanged.
# Stderr is captured to the log on failure AND re-emitted so the harness's
# own session log still receives it.

set -u

project_dir="${CLAUDE_PROJECT_DIR:-$PWD}"
log_dir="${project_dir}/.claude/logs"
log_file="${log_dir}/hook-errors.log"

# Create under an owner-only umask so nothing exists open even for an instant,
# then restore the umask the hook itself inherited.
inherited_umask=$(umask)
umask 077
log_ready=0
if [[ ! -L "$log_dir" && ! -L "$log_file" ]] && mkdir -p "$log_dir" 2>/dev/null &&
  [[ -O "$log_dir" ]] && chmod 700 "$log_dir" 2>/dev/null && touch "$log_file" 2>/dev/null &&
  [[ -f "$log_file" && ! -L "$log_file" && -O "$log_file" ]] && chmod 600 "$log_file" 2>/dev/null; then
  log_ready=1
fi
umask "$inherited_umask"

stderr_capture="$(mktemp)"
trap 'rm -f "$stderr_capture"' EXIT

"$@" 2>"$stderr_capture"
ec=$?

if [[ "$ec" -ne 0 && "$log_ready" -eq 1 ]]; then
  {
    printf '[%s] hook-error\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
    printf '  exit:    %d\n' "$ec"
    printf '  cmd:     %s\n' "$*"
    printf '  cwd:     %s\n' "$PWD"
    printf '  project: %s\n' "$project_dir"
    if [[ -s "$stderr_capture" ]]; then
      printf '  stderr:\n'
      sed 's/^/    /' "$stderr_capture"
    fi
    printf '\n'
  } >> "$log_file"
fi

# Re-emit captured stderr so the harness still records it.
if [[ -s "$stderr_capture" ]]; then
  cat "$stderr_capture" >&2
fi

if [[ "$ec" -ne 0 && "$log_ready" -ne 1 ]]; then
  printf 'log-hook-errors: .claude/logs or its log is a symlink, not a regular file, or not owned by this user; this failure was not written to hook-errors.log\n' >&2
fi

exit "$ec"

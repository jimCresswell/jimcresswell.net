#!/usr/bin/env bash
# PreToolUse hook: Scan files before reading to prevent secret leakage
# Blocks file reads if secrets are detected

if ! command -v sonar &> /dev/null; then
  exit 0
fi

# Read JSON from stdin. Prefer jq, which decodes JSON escapes, so a path holding
# a quote or a backslash is the real path; fall back to sed if jq is unavailable.
stdin_data=$(cat)
if command -v jq &> /dev/null; then
  tool_name=$(printf '%s' "$stdin_data" | jq -r '.tool_name // empty')
else
  tool_name=$(echo "$stdin_data" | sed -n 's/.*"tool_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)
fi

if [[ "$tool_name" != "Read" ]]; then
  exit 0
fi

if command -v jq &> /dev/null; then
  # jq -j writes the path with no trailing newline; the sentinel keeps any
  # newline the path itself ends with, which command substitution would strip.
  file_path=$(printf '%s' "$stdin_data" | jq -j '.tool_input.file_path // empty'; printf x)
  file_path=${file_path%x}
else
  file_path=$(echo "$stdin_data" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)
  # sed cannot decode JSON escapes. A path holding one is denied, never read unscanned.
  if [[ "$file_path" == *\\* ]]; then
    echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"The file path holds a JSON escape this hook cannot decode without jq; install jq so the path can be scanned for secrets"}}'
    exit 0
  fi
fi

if [[ -z "$file_path" ]] || [[ ! -f "$file_path" ]]; then
  exit 0
fi

# Scan file for secrets
sonar analyze secrets "$file_path" > /dev/null 2>&1
exit_code=$?

if [[ $exit_code -eq 51 ]]; then
  # Secrets found - deny file read
  reason="Sonar detected secrets in file: $file_path"
  if command -v jq &> /dev/null; then
    jq -cn --arg reason "$reason" \
      '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: $reason}}'
  else
    echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"$reason\"}}"
  fi
  exit 0
fi

exit 0

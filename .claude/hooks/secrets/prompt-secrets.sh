#!/usr/bin/env bash
# UserPromptSubmit hook: Scan prompt for secrets before sending

if ! command -v sonar &> /dev/null; then
  exit 0
fi

# Read JSON from stdin
stdin_data=$(cat)

# Extract prompt field. Prefer jq for correctness on multiline and escape-heavy
# values; fall back to sed if jq is unavailable. printf hands sed the payload
# byte for byte, whatever the shell's echo does with backslashes.
if command -v jq &> /dev/null; then
  # jq -j writes the prompt with no trailing newline of its own; the sentinel
  # keeps the line breaks the prompt itself ends with, which command
  # substitution would strip.
  prompt=$(printf '%s' "$stdin_data" | jq -j '.prompt // empty'; printf x)
  prompt=${prompt%x}
else
  prompt=$(printf '%s\n' "$stdin_data" | sed -n 's/.*"prompt"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)
  # sed leaves JSON escapes undecoded and ends the value at the first escaped
  # quote, so it takes the whole prompt only when the prompt holds no escape.
  # Every escape leaves a backslash in what sed took, and a prompt holding one
  # is blocked, so the sed path never hands Sonar a truncated prompt.
  if [[ "$prompt" == *\\* ]]; then
    echo '{"decision":"block","reason":"The prompt holds a JSON escape this hook cannot decode without jq; install jq so the prompt can be scanned for secrets"}'
    exit 0
  fi
fi

if [[ -z "$prompt" ]]; then
  exit 0
fi

# Create temporary file with prompt content (stdin is already occupied by hook input)
temp_file=$(mktemp -t 'sonarqube-cli-hook.XXXXXX')
# Single-quoted: the path expands when the trap runs, as one quoted word, so
# the copy of the prompt is removed whatever characters its path holds.
trap 'rm -f "$temp_file"' EXIT

# printf '%s' writes the prompt byte for byte, an option-shaped prompt such as
# -n or -e included.
printf '%s' "$prompt" > "$temp_file"

# Scan prompt for secrets (using file instead of stdin pipe)
sonar analyze secrets "$temp_file" > /dev/null 2>&1
exit_code=$?

if [[ $exit_code -eq 51 ]]; then
  # Secrets found - block prompt
  reason="Sonar detected secrets in prompt"
  echo "{\"decision\":\"block\",\"reason\":\"$reason\"}"
  exit 0
fi

exit 0

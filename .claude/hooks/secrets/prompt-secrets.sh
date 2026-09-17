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

# The session's working directory, which a relative @-mention is resolved
# against; the hook's own directory stands in when the payload names none.
if command -v jq &> /dev/null; then
  cwd=$(printf '%s' "$stdin_data" | jq -j '.cwd // empty'; printf x)
  cwd=${cwd%x}
else
  cwd=$(printf '%s\n' "$stdin_data" | sed -n 's/.*"cwd"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -1)
  if [[ "$cwd" == *\\* ]]; then
    echo '{"decision":"block","reason":"The working directory holds a JSON escape this hook cannot decode without jq; install jq so the files the prompt @-mentions can be scanned for secrets"}'
    exit 0
  fi
fi
cwd=${cwd:-$PWD}

# Create temporary file with prompt content (stdin is already occupied by hook input)
temp_file=$(mktemp -t 'sonarqube-cli-hook.XXXXXX')
# Single-quoted: the path expands when the trap runs, as one quoted word, so
# the copy of the prompt is removed whatever characters its path holds.
trap 'rm -f "$temp_file"' EXIT

# printf '%s' writes the prompt byte for byte, an option-shaped prompt such as
# -n or -e included.
printf '%s' "$prompt" > "$temp_file"

# Claude Code puts the content of a file the prompt @-mentions into the
# conversation with no tool call, so the Read hook never sees it and this
# payload carries only the prompt's text (Claude Code 2.1.274, observed
# 2026-09-17). Every regular file a mention can name is scanned with the
# prompt, found as Claude Code finds it. Its patterns (read from the 2.1.274
# bundle) take `@"<path>"` or `@<path>` only after the start of the text,
# whitespace or a CJK stop (`(^|[\s。、？！])`), so an email
# address is no mention; end an unquoted path at the last word character
# before whitespace (`@([^\s]+)\b`), so trailing punctuation drops; and split
# the path at its first `#`, whatever follows (`^([^#]+)(?:#L(\d+)(?:-(\d+))?)?
# (?:#[^#]*)?$`). The path resolves against the working directory, `~` or the
# root. Its whitespace includes the no-break space, so the run of printable
# ASCII is tried as well. A name that is no regular file is skipped. Sonar
# reports a symlink clean without reading its target, so each file goes by its
# real path, once. Without grep or realpath the mentions cannot be found or
# resolved, and the prompt goes through with a warning that they were not
# scanned.
mentioned=()
unresolved=0
missing_tool=''
for tool in grep realpath; do
  command -v "$tool" &> /dev/null || missing_tool=$tool
done
add_mentioned_file() {
  local path=$1 resolved entry
  case "$path" in
    '') return 0 ;;
    \~) path=$HOME ;;
    \~/*) path="$HOME/${path#\~/}" ;;
    /*) ;;
    *) path="$cwd/$path" ;;
  esac
  [[ -f "$path" ]] || return 0
  if ! resolved=$(realpath "$path" 2> /dev/null && printf x); then
    unresolved=1
    return 0
  fi
  resolved=${resolved%$'\n'x}
  for entry in "${mentioned[@]}"; do
    [[ "$entry" == "$resolved" ]] && return 0
  done
  mentioned+=("$resolved")
}
# An unquoted mention loses its trailing non-word characters; either form
# loses everything from its first `#`.
add_unquoted_mention() {
  local path=$1
  while [[ "$path" == *[!0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_] ]]; do
    path=${path%?}
  done
  add_mentioned_file "${path%%#*}"
}
if [[ -z "$missing_tool" ]]; then
  # The boundary before `@`: start of line, whitespace, the no-break space, the
  # ideographic space, or one of the four CJK stops, as UTF-8 bytes.
  lead=$'(^|[[:space:]]|\xc2\xa0|\xe3\x80\x80|\xe3\x80\x82|\xe3\x80\x81|\xef\xbc\x9f|\xef\xbc\x81)'
  while IFS= read -r token; do
    token=${token#*@\"}
    token=${token%\"}
    add_mentioned_file "${token%%#*}"
  done < <(LC_ALL=C grep -a -oE "${lead}"'@"[^"]+"' "$temp_file")
  while IFS= read -r token; do
    add_unquoted_mention "${token#*@}"
  done < <(LC_ALL=C grep -a -oE "${lead}"'@[^[:space:]]+' "$temp_file"; LC_ALL=C grep -a -oE "${lead}"'@[!-~]+' "$temp_file")
fi

# Scan prompt for secrets (using file instead of stdin pipe)
sonar analyze secrets "$temp_file" "${mentioned[@]}" > /dev/null 2>&1
exit_code=$?

if [[ $exit_code -eq 51 ]]; then
  # Secrets found - block prompt
  reason="Sonar detected secrets in the prompt or a file it @-mentions"
  echo "{\"decision\":\"block\",\"reason\":\"$reason\"}"
  exit 0
fi

# A scan that could not run lets the prompt through, with a warning shown to
# the user that it was not scanned.
if [[ $exit_code -ne 0 ]]; then
  echo "{\"systemMessage\":\"Sonar exited with status $exit_code, so the prompt and the files it @-mentions were not scanned for secrets\"}"
elif [[ -n "$missing_tool" ]]; then
  echo "{\"systemMessage\":\"$missing_tool is not on PATH, so the files the prompt @-mentions were not scanned for secrets\"}"
elif [[ $unresolved -ne 0 ]]; then
  echo '{"systemMessage":"realpath could not resolve a file the prompt @-mentions, so that file was not scanned for secrets"}'
fi

exit 0

#!/usr/bin/env bash
# Exchange delta for one estate (the practice-two-way-exchange node, todo 1).
#
# Lists every tracked path under the Practice machinery that changed in one estate between an
# ancestor commit and a head commit, with git's status letter (A added, M modified, D deleted).
# Machinery is the Core, directives, rules, skills, sub-agent templates, hooks, roles, setup,
# prompts, reference, harness integrations, the Practice index, the rules index, agent-tools,
# the platform adapter trees, the git hooks, CI and the root manifests. Continuity and memory
# surfaces (memory, state, plans, reports, experience, research, the Practice Box) are local by
# doctrine and never enter the delta.
#
# Usage: exchange-delta.sh <label> <repo-path> <ancestor> <head>
# Output: label<TAB>status<TAB>path, one row per changed path, sorted by path.
# Recompute for all estates with `bash .agent/reports/practice-transplant/inputs/exchange-deltas.sh`.
# The bash floor: the shellcheck gate holds it once and requires this guard first.
if ((BASH_VERSINFO[0] < 5 || (BASH_VERSINFO[0] == 5 && BASH_VERSINFO[1] < 2))); then
  echo "bash 5.2 or later is required, found ${BASH_VERSION}: install it (brew install bash on macOS, apt-get install bash on Debian 12 or Ubuntu 24.04 and later) and put it first on PATH" >&2
  exit 1
fi

set -euo pipefail
label=$1
repo=$2
ancestor=$3
head=$4
machinery=(
  .agent/practice-core .agent/directives .agent/rules .agent/skills .agent/sub-agents
  .agent/hooks .agent/roles .agent/setup .agent/prompts .agent/reference
  .agent/claude-harness-integrations .agent/practice-index.md .agent/README.md RULES_INDEX.md
  agent-tools .claude .codex .cursor .agents .gemini .husky .github
  package.json pnpm-workspace.yaml turbo.json
)
git -C "$repo" rev-parse --verify --quiet "$ancestor^{commit}" > /dev/null || { echo "ancestor not found in $label: $ancestor" >&2; exit 1; }
git -C "$repo" rev-parse --verify --quiet "$head^{commit}" > /dev/null || { echo "head not found in $label: $head" >&2; exit 1; }
git -C "$repo" diff --name-status --no-renames "$ancestor" "$head" -- "${machinery[@]}" \
  ':(exclude).agent/practice-core/incoming' ':(exclude)agent-tools/dist' \
  | awk -v label="$label" 'BEGIN { OFS = "\t" } { print label, $1, $2 }' \
  | sort -t "$(printf '\t')" -k3,3

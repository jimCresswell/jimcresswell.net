#!/usr/bin/env bash
# Exchange delta for one estate (the practice-two-way-exchange node, todo 1).
#
# Lists every tracked path under the Practice machinery that changed in one estate between an
# ancestor commit and a head commit, with git's status letter (A added, M modified, D deleted).
# Machinery is the Core, directives, rules, skills, sub-agent templates, hooks, roles, setup,
# prompts, reference, harness integrations, the Practice index, the rules index, agent-tools,
# the platform adapter trees, the git hooks, CI, the root manifests, the root platform
# entrypoints (AGENTS.md, CLAUDE.md, GEMINI.md, skills.md), the Practice-owned root
# configuration (dependency-cruiser, knip, tsconfig, eslint, prettier, markdownlint, commitlint,
# nvmrc, gitattributes, gitignore, sonar; a name absent in an estate matches nothing there) and
# the canonical patterns under .agent/memory/active/patterns, and the Practice-owned shared
# tooling workspaces (this estate's tooling/ and the lineage's five under packages/core: the
# eslint plugin, result, safe-path, type-helpers, workspace-config; castr carries none, and a
# path absent in an estate matches nothing there), and the Practice-governance docs trees
# (docs/engineering, docs/governance, docs/foundation) the transplant guidance classes as
# Practice machinery outside .agent, with each estate's Practice-governance ADR directory as
# travelling documentation. The other continuity and memory surfaces (the rest of
# memory, state, plans, reports, experience, research, the Practice Box) are local by doctrine
# and never enter the delta.
#
# Usage: exchange-delta.sh <label> <repo-path> <ancestor> <head>
# Output: label<TAB>status<TAB>path, one row per changed path, sorted by path under the C locale
# so the tracked lists are byte-stable across machines. The ancestor must be reachable from the
# head, or the diff would compare unrelated trees rather than a since-ancestor interval.
# Recompute for all estates with
# `bash .agent/reports/practice-transplant/inputs/exchange-deltas.sh <oce-tree-path> <castr-tree-path>`.
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
  package.json pnpm-workspace.yaml turbo.json AGENTS.md CLAUDE.md GEMINI.md skills.md
  .agent/memory/active/patterns
  .dependency-cruiser.mjs .dependency-cruiser.cjs knip.config.ts knip.ts
  tsconfig.base.json tsconfig.json tsconfig.depcruise.json tsconfig.lint.json
  eslint.config.ts eslint.config.mjs eslint.config.js prettier.config.ts .prettierrc.json
  .prettierignore .markdownlint-cli2.jsonc .markdownlint.json commitlint.config.mjs .nvmrc
  .gitattributes .gitignore .sonarcloud.properties .editorconfig .gitleaks.toml tsdoc.json
  docs/engineering docs/governance docs/foundation eslint.runtime-only.config.mjs
  docs/architecture/decision-records docs/architecture/architectural-decisions
  docs/architectural_decision_records
  tooling packages/core/oak-eslint packages/core/result packages/core/safe-path
  packages/core/type-helpers packages/core/workspace-config
)
git -C "$repo" rev-parse --verify --quiet "$ancestor^{commit}" > /dev/null || { echo "ancestor not found in $label: $ancestor" >&2; exit 1; }
git -C "$repo" rev-parse --verify --quiet "$head^{commit}" > /dev/null || { echo "head not found in $label: $head" >&2; exit 1; }
git -C "$repo" merge-base --is-ancestor "$ancestor" "$head" || { echo "ancestor is not reachable from head in $label: $ancestor..$head is not a since-ancestor interval" >&2; exit 1; }
git -C "$repo" diff --name-status --no-renames "$ancestor" "$head" -- "${machinery[@]}" \
  ':(exclude).agent/practice-core/incoming' ':(exclude)agent-tools/dist' \
  | awk -F '\t' -v label="$label" 'BEGIN { OFS = "\t" } { print label, $1, $2 }' \
  | LC_ALL=C sort -t "$(printf '\t')" -k3,3

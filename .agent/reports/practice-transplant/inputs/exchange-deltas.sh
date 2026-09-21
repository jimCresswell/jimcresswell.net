#!/usr/bin/env bash
# Runs exchange-delta.sh for every row of exchange-pins.tsv and writes one TSV per row beside it.
#
# The pins file carries labels, origins and commits only; the local trees are arguments,
# because a local path is machine-local and never belongs in a tracked file. This estate's
# own tree is the repository this script runs from.
#
# Usage: exchange-deltas.sh <oce-tree-path> <castr-tree-path>
# Output: inputs/exchange-delta-<label>.tsv per row, and a count per row on stdout.
# The bash floor: the shellcheck gate holds it once and requires this guard first.
if ((BASH_VERSINFO[0] < 5 || (BASH_VERSINFO[0] == 5 && BASH_VERSINFO[1] < 2))); then
  echo "bash 5.2 or later is required, found ${BASH_VERSION}: install it (brew install bash on macOS, apt-get install bash on Debian 12 or Ubuntu 24.04 and later) and put it first on PATH" >&2
  exit 1
fi

set -euo pipefail
# The tree arguments are resolved to absolute paths before the directory changes, so a relative
# path given from a subdirectory still names the tree the caller meant.
oce=$(cd "$1" && pwd -P)
castr=$(cd "$2" && pwd -P)
cd "$(git rev-parse --show-toplevel)"
inputs=.agent/reports/practice-transplant/inputs
# Every list is generated into a staging directory first; the tracked files are replaced only
# after every row succeeds, so a bad pin never truncates a list or leaves a mixed snapshot.
staging=$(mktemp -d)
trap 'rm -rf "$staging"' EXIT
tail -n +2 "$inputs/exchange-pins.tsv" | while IFS=$'\t' read -r label estate _origin ancestor head _meaning; do
  case "$estate" in
    oce) repo=$oce ;;
    castr) repo=$castr ;;
    jcnet) repo=. ;;
    *) echo "unknown estate in pins: $estate" >&2; exit 1 ;;
  esac
  bash "$inputs/exchange-delta.sh" "$label" "$repo" "$ancestor" "$head" > "$staging/exchange-delta-$label.tsv"
done
for staged in "$staging"/exchange-delta-*.tsv; do
  out="$inputs/$(basename "$staged")"
  cp "$staged" "$out"
  label=$(basename "$staged" .tsv)
  printf '%s\t%s rows\n' "${label#exchange-delta-}" "$(wc -l < "$out" | tr -d ' ')"
done

#!/usr/bin/env bash
# Runs exchange-delta.sh for every row of exchange-pins.tsv and writes one TSV per row beside it.
#
# The pins file carries labels, origins and commits only; the local checkouts are arguments,
# because a checkout path is machine-local and never belongs in a tracked file. This estate's
# own checkout is the repository this script runs from.
#
# Usage: exchange-deltas.sh <oce-checkout-path> <castr-checkout-path>
# Output: inputs/exchange-delta-<label>.tsv per row, and a count per row on stdout.
set -euo pipefail
oce=$1
castr=$2
cd "$(git rev-parse --show-toplevel)"
inputs=.agent/reports/practice-transplant/inputs
tail -n +2 "$inputs/exchange-pins.tsv" | while IFS=$'\t' read -r label estate _origin ancestor head _meaning; do
  case "$estate" in
    oce) repo=$oce ;;
    castr) repo=$castr ;;
    jcnet) repo=. ;;
    *) echo "unknown estate in pins: $estate" >&2; exit 1 ;;
  esac
  out="$inputs/exchange-delta-$label.tsv"
  bash "$inputs/exchange-delta.sh" "$label" "$repo" "$ancestor" "$head" > "$out"
  printf '%s\t%s rows\n' "$label" "$(wc -l < "$out" | tr -d ' ')"
done

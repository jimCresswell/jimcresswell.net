#!/usr/bin/env bash
# Loss-scan dispositions for a transplant's pre-state archive (runbook step 13, the fourth audit).
#
# For every tracked file under the archive directory (default `.agent-original/`), computes one
# disposition against the live tree at HEAD, in this order:
#   identical        the same blob is tracked live outside the archive
#   superseded-path  the same relative path exists under the live `.agent/` with other content
#   absorbed         at least 70% of the file's distinct non-blank lines occur verbatim in the
#                    live `.agent/` or `docs/` trees
#   superseded-name  a live file matches by name: `commands/<x>.md` or `skills/<x>/SKILL.md` to
#                    `.agent/skills/**/<x>/SKILL-CANONICAL.md`; otherwise the same basename, with
#                    the lineage's `reviewer` to `expert` rename applied
#   residue          none of the above; the only rows that need the owner
# Output: tab-separated `class<TAB>relative-path<TAB>evidence`, one row per file, sorted by class.
# Recompute with `bash .agent/reports/practice-transplant/inputs/loss-scan-dispositions.sh`.

# The bash floor: the shellcheck gate holds it once and requires this guard first.
if ((BASH_VERSINFO[0] < 5 || (BASH_VERSINFO[0] == 5 && BASH_VERSINFO[1] < 2))); then
  echo "bash 5.2 or later is required, found ${BASH_VERSION}: install it (brew install bash on macOS, apt-get install bash on Debian and Ubuntu) and put it first on PATH" >&2
  exit 1
fi

set -euo pipefail
archive=${1:-.agent-original}
cd "$(git rev-parse --show-toplevel)"
live_blobs=$(git ls-tree -r HEAD | grep -v $'\t'"$archive/" | awk '{print $3}' | sort -u)
live_paths=$(git ls-files .agent docs | grep -v "^$archive/")
corpus=$(mktemp)
git grep -h -I '' -- '.agent' 'docs' ":!$archive" | sed 's/[[:space:]]*$//' | grep -v '^[[:space:]]*$' | sort -u > "$corpus"
normalised_lines() { git show "$1" | sed 's/[[:space:]]*$//' | grep -v '^[[:space:]]*$' | sort -u; }
name_match() {
  local rel=$1 base dir alt
  base=$(basename "$rel"); dir=$(basename "$(dirname "$rel")"); alt=${base//reviewer/expert}
  case "$rel" in
    skills/*/SKILL.md) grep -E "^\.agent/skills/([^/]+/)?$dir/SKILL-CANONICAL\.md$" <<<"$live_paths" | head -1 ;;
    commands/*) grep -E "^\.agent/skills/([^/]+/)?${base%.md}/SKILL-CANONICAL\.md$" <<<"$live_paths" | head -1 ;;
    *) grep -E "/($base|$alt)$" <<<"$live_paths" | grep -v '^\.agent/memory/active/' | head -1 ;;
  esac
}
git ls-tree -r HEAD -- "$archive" | while read -r _mode _type blob path; do
  rel=${path#"$archive"/}
  if grep -qx "$blob" <<<"$live_blobs"; then printf 'identical\t%s\tblob %s\n' "$rel" "${blob:0:7}"; continue; fi
  if git cat-file -e "HEAD:.agent/$rel" 2>/dev/null; then printf 'superseded-path\t%s\t.agent/%s\n' "$rel" "$rel"; continue; fi
  total=$(normalised_lines "$blob" | wc -l | tr -d ' ')
  hits=$(normalised_lines "$blob" | comm -12 - "$corpus" | wc -l | tr -d ' ')
  pct=$(( total == 0 ? 100 : hits * 100 / total ))
  if [ "$pct" -ge 70 ]; then printf 'absorbed\t%s\t%s%% of %s lines live\n' "$rel" "$pct" "$total"; continue; fi
  hit=$(name_match "$rel" || true)
  if [ -n "$hit" ]; then printf 'superseded-name\t%s\t%s\n' "$rel" "$hit"; continue; fi
  printf 'residue\t%s\t%s%% of %s lines live\n' "$rel" "$pct" "$total"
done | sort -t$'\t' -k1,1 -k2,2
rm -f "$corpus"

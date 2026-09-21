/**
 * The markers a register glob cell may carry: `(list: ...)`, `(excepting: ...)`
 * and `(shares: ...)`, each exactly `(<word>: a, b)`. Anything that reads as
 * a marker but is not that grammar is refused, never read loosely. No IO.
 */

import { err, ok, type Result } from '@engraph/result';

/** The three markers a glob cell may carry, each exactly `(<word>: a, b)`. */
type Marker = 'list' | 'excepting' | 'shares';
const MARKERS: readonly Marker[] = ['list', 'excepting', 'shares'];
/** Anything that reads as one of the markers, however mis-typed: `( list :`, `(Excepting:`. */
const MARKER_LIKE = /\(\s*(list|excepting|shares)\s*:/giu;

/**
 * The labels a glob cell names with `(<marker>: a, b)`, or null when it has
 * no such marker. A cell that opens a marker it does not close, carries the
 * marker twice, spells it any way but exactly `(<marker>:`, or names an
 * empty label (`(list: a,)`) is refused rather than read loosely: each typo
 * would widen or shift what the row covers.
 */
function parseMarker(cell: string, name: Marker): Result<readonly string[] | null, string> {
  const found = [...cell.matchAll(MARKER_LIKE)].filter((m) => (m[1] ?? '').toLowerCase() === name);
  if (found.length > 1) {
    return err(`carries more than one (${name}: ...) marker`);
  }
  const [marker] = found;
  if (marker === undefined) {
    return ok(null);
  }
  if (marker[0] !== `(${name}:`) {
    return err(
      `carries the marker \`${marker[0]}\`; the grammar is exactly \`(${name}: <label>[, <label>])\``,
    );
  }
  const close = cell.indexOf(')', marker.index);
  if (close === -1) {
    return err(`opens a (${name}: marker it never closes`);
  }
  const labels = cell
    .slice(marker.index + marker[0].length, close)
    .split(',')
    .map((label) => label.trim());
  if (labels.length === 0 || labels.every((label) => label === '')) {
    return ok([]);
  }
  return labels.some((label) => label === '')
    ? err(
        `names an empty label in (${name}: ...); the grammar is \`(${name}: <label>[, <label>])\``,
      )
    : ok(labels);
}

/** The three markers of a cell, or the first refusal. */
export function parseMarkers(
  cell: string,
): Result<Record<Marker, readonly string[] | null>, string> {
  const parsed: Partial<Record<Marker, readonly string[] | null>> = {};
  for (const name of MARKERS) {
    const labels = parseMarker(cell, name);
    if (!labels.ok) {
      return labels;
    }
    parsed[name] = labels.value;
  }
  const empty = emptyPrecedenceMarker(parsed);
  if (empty !== null) {
    return err(`an empty (${empty}:) marker names no row`);
  }
  return ok({
    list: parsed.list ?? null,
    excepting: parsed.excepting ?? null,
    shares: parsed.shares ?? null,
  });
}

/** The first of excepting and shares that is present but names nothing, or null. */
function emptyPrecedenceMarker(
  parsed: Partial<Record<Marker, readonly string[] | null>>,
): 'excepting' | 'shares' | null {
  return (['excepting', 'shares'] as const).find((name) => parsed[name]?.length === 0) ?? null;
}

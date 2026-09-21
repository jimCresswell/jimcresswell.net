/**
 * The tracked coverage counts: one line per register row with the number of
 * list entries the row covers. The validator recomputes the counts and
 * refuses any drift, so a deleted specific row (whose paths would fall
 * silently to its group's catch-all), a widened glob or a regenerated list
 * changes the file and is refused until the change is written deliberately
 * with `--write-counts`. Pure; no IO.
 */

import { err, ok, type Result } from '@engraph/result';

import { type RegisterRow } from './exchange-register-types.js';

const HEADER = 'row\tmatches';

/** One row whose recomputed count differs from the tracked one; null marks a side that has no row. */
export interface CountDrift {
  readonly rowId: string;
  readonly expected: number | null;
  readonly actual: number | null;
}

/** Reads the tracked counts file; a malformed line is a refusal, never a zero. */
export function parseCoverageCounts(tsv: string): Result<ReadonlyMap<string, number>, string> {
  const [header, ...lines] = tsv.split('\n').filter((line) => line.trim() !== '');
  if (header !== HEADER) {
    return err(`the counts file does not start with \`${HEADER}\``);
  }
  const counts = new Map<string, number>();
  for (const [index, line] of lines.entries()) {
    const parsed = parseCountLine(line);
    if (parsed === null) {
      return err(`counts line ${index + 2}: not \`row<TAB>matches\` with a whole number`);
    }
    if (counts.has(parsed.rowId)) {
      return err(`counts line ${index + 2}: row ${parsed.rowId} appears more than once`);
    }
    counts.set(parsed.rowId, parsed.count);
  }
  return ok(counts);
}

/** One `row<TAB>matches` line, or null when it is not that shape with a whole number. */
function parseCountLine(line: string): { readonly rowId: string; readonly count: number } | null {
  const cells = line.split('\t');
  const [rowId, matches] = cells;
  const shaped = cells.length === 2 && rowId !== undefined && rowId !== '';
  if (!shaped || matches === undefined || !/^\d+$/u.test(matches)) {
    return null;
  }
  const count = Number(matches);
  return Number.isSafeInteger(count) ? { rowId, count } : null;
}

/** The counts file text for the rows in register order. */
export function renderCoverageCounts(
  rows: readonly RegisterRow[],
  matchesByRow: ReadonlyMap<string, number>,
): string {
  const lines = rows.map((row) => `${row.id}\t${matchesByRow.get(row.id) ?? 0}`);
  return [HEADER, ...lines].join('\n') + '\n';
}

/** Every row whose tracked and recomputed counts differ, or that exists on one side only. */
export function countDrift(
  expected: ReadonlyMap<string, number>,
  actual: ReadonlyMap<string, number>,
): readonly CountDrift[] {
  const ids = [...new Set([...expected.keys(), ...actual.keys()])];
  return ids
    .map((rowId) => ({
      rowId,
      expected: expected.get(rowId) ?? null,
      actual: actual.get(rowId) ?? null,
    }))
    .filter((drift) => drift.expected !== drift.actual);
}

/**
 * The tracked coverage baseline: one line per register row with the number
 * of list entries the row covers and a fingerprint of which entries they
 * are. The validator recomputes both and refuses any drift, so a deleted
 * specific row (whose paths would fall silently to its group's catch-all),
 * a widened or swapped glob (same count, other paths) or a regenerated list
 * changes the file and is refused until the change is written deliberately
 * with `--write-counts`. Pure; no IO.
 */

import { createHash } from 'node:crypto';

import { err, ok, type Result } from '@engraph/result';

import { type CoverageReport, type RegisterRow } from './exchange-register-types.js';

const HEADER = 'row\tmatches\tfingerprint';
const FINGERPRINT = /^[0-9a-f]{16}$/u;

/** One row's tracked coverage: how many entries and a fingerprint of which. */
export interface TrackedCoverage {
  readonly count: number;
  readonly fingerprint: string;
}

/** One row whose recomputed coverage differs from the tracked one; null marks a side with no row. */
export interface CountDrift {
  readonly rowId: string;
  readonly expected: TrackedCoverage | null;
  readonly actual: TrackedCoverage | null;
}

/** Reads the tracked file; a malformed line is a refusal, never a zero. */
export function parseCoverageCounts(
  tsv: string,
): Result<ReadonlyMap<string, TrackedCoverage>, string> {
  const [header, ...lines] = tsv.split('\n').filter((line) => line.trim() !== '');
  if (header !== HEADER) {
    return err(`the counts file does not start with \`${HEADER.replaceAll('\t', '<TAB>')}\``);
  }
  const counts = new Map<string, TrackedCoverage>();
  for (const [index, line] of lines.entries()) {
    const parsed = parseCountLine(line);
    if (parsed === null) {
      return err(
        `counts line ${index + 2}: not \`row<TAB>matches<TAB>fingerprint\` with a whole number and a 16-hex fingerprint`,
      );
    }
    if (counts.has(parsed.rowId)) {
      return err(`counts line ${index + 2}: row ${parsed.rowId} appears more than once`);
    }
    counts.set(parsed.rowId, { count: parsed.count, fingerprint: parsed.fingerprint });
  }
  return ok(counts);
}

/** One tracked line, or null when it is not that shape. */
function parseCountLine(line: string): (TrackedCoverage & { readonly rowId: string }) | null {
  const cells = line.split('\t');
  const [rowId = '', matches = '', fingerprint = ''] = cells;
  const shaped = cells.length === 3 && rowId !== '' && FINGERPRINT.test(fingerprint);
  return shaped && isWholeNumber(matches) ? { rowId, count: Number(matches), fingerprint } : null;
}

function isWholeNumber(text: string): boolean {
  return /^\d+$/u.test(text) && Number.isSafeInteger(Number(text));
}

/** A deterministic fingerprint of the entries a row covers, whatever order they were credited in. */
function fingerprintOf(entries: readonly string[]): string {
  return createHash('sha256')
    .update([...entries].sort((a, b) => a.localeCompare(b, 'en')).join('\n'))
    .digest('hex')
    .slice(0, 16);
}

/** The recomputed coverage per row, in register order, from a coverage report. */
export function coverageOf(
  rows: readonly RegisterRow[],
  report: CoverageReport,
): ReadonlyMap<string, TrackedCoverage> {
  return new Map(
    rows.map((row) => [
      row.id,
      {
        count: report.matchesByRow.get(row.id) ?? 0,
        fingerprint: fingerprintOf(report.entriesByRow.get(row.id) ?? []),
      },
    ]),
  );
}

/** The tracked file's text for a recomputed coverage map, in its order. */
export function renderCoverageCounts(coverage: ReadonlyMap<string, TrackedCoverage>): string {
  const lines = [...coverage].map(
    ([rowId, { count, fingerprint }]) => `${rowId}\t${count}\t${fingerprint}`,
  );
  return [HEADER, ...lines].join('\n') + '\n';
}

/** Every row whose tracked and recomputed coverage differ, or that exists on one side only. */
export function countDrift(
  expected: ReadonlyMap<string, TrackedCoverage>,
  actual: ReadonlyMap<string, TrackedCoverage>,
): readonly CountDrift[] {
  const ids = [...new Set([...expected.keys(), ...actual.keys()])];
  return ids
    .map((rowId) => ({
      rowId,
      expected: expected.get(rowId) ?? null,
      actual: actual.get(rowId) ?? null,
    }))
    .filter(
      (d) =>
        d.expected?.count !== d.actual?.count || d.expected?.fingerprint !== d.actual?.fingerprint,
    );
}

/** A tracked coverage as the refusal prints it. */
export function describeCoverage(coverage: TrackedCoverage | null): string {
  return coverage === null ? 'no row' : `${coverage.count} (${coverage.fingerprint})`;
}

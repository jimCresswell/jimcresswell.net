/**
 * The validator's list inputs: the pins file (one row per computed list) and
 * the computed delta lists themselves. Each is refused at the boundary when
 * its shape is not the declared one. No IO here.
 */

import { err, ok, type Result } from '@engraph/result';

import { type PinsRow } from './exchange-register-types.js';

const LABEL_SHAPE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ESTATES: ReadonlySet<string> = new Set(['oce', 'jcnet', 'castr']);

/** One pins line as a row, or why it is refused: label shape, closed estate set, uniqueness. */
function pinsRow(
  cells: readonly string[],
  indices: { readonly label: number; readonly estate: number },
  seen: Set<string>,
): Result<PinsRow, string> {
  const label = cells[indices.label] ?? '';
  const estate = cells[indices.estate] ?? '';
  if (!LABEL_SHAPE.test(label)) {
    return err(`pins label \`${label}\` is not lower-case words joined by hyphens`);
  }
  if (!ESTATES.has(estate)) {
    return err(`pins row ${label}: estate \`${estate}\` is not one of oce, jcnet, castr`);
  }
  if (seen.has(label)) {
    return err(`pins label ${label} appears more than once`);
  }
  seen.add(label);
  return ok({ label, estate });
}

/**
 * Reads the pins TSV (header row first) into label and estate pairs. A label
 * is lower-case words joined by hyphens (it names a file), unique, and its
 * estate is one of the three; anything else is refused.
 */
export function parsePinsRows(tsv: string): Result<readonly PinsRow[], string> {
  const [header, ...lines] = tsv.split('\n').filter((line) => line.trim() !== '');
  if (header === undefined) {
    return ok([]);
  }
  const columns = header.split('\t');
  const labelIndex = columns.indexOf('label');
  const estateIndex = columns.indexOf('estate');
  if (labelIndex < 0 || estateIndex < 0) {
    return err('the pins file must carry `label` and `estate` columns');
  }
  const seen = new Set<string>();
  const rows: PinsRow[] = [];
  for (const line of lines) {
    const row = pinsRow(line.split('\t'), { label: labelIndex, estate: estateIndex }, seen);
    if (!row.ok) {
      return row;
    }
    rows.push(row.value);
  }
  return ok(rows);
}

/**
 * Reads a computed delta list into its paths. Every non-blank line is
 * exactly `label`, `status`, `path`, and the label is the one the list was
 * loaded for; a line of another shape or another label is refused, so a
 * truncated or swapped list never passes as the declared one.
 */
export function parseDeltaPaths(tsv: string, label: string): Result<readonly string[], string> {
  const paths: string[] = [];
  for (const [index, line] of tsv.split('\n').entries()) {
    if (line.trim() === '') {
      continue;
    }
    const path = deltaPath(line.split('\t'), label, index + 1);
    if (!path.ok) {
      return path;
    }
    paths.push(path.value);
  }
  return ok(paths);
}

/** The path of one delta line, or why the line is refused. */
function deltaPath(
  cells: readonly string[],
  label: string,
  lineNumber: number,
): Result<string, string> {
  const [rowLabel, status, path] = cells;
  if (cells.length !== 3 || status === '' || path === undefined || path === '') {
    return err(`${label} list line ${lineNumber}: not \`label<TAB>status<TAB>path\``);
  }
  if (rowLabel !== label) {
    return err(`${label} list line ${lineNumber}: labelled \`${rowLabel ?? ''}\`, not ${label}`);
  }
  return ok(path);
}

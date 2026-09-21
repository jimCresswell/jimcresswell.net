/**
 * Parsing helpers for the exchange-register validator: the register's row
 * tables, the pins file and the computed delta lists. No IO here; the
 * validator entry point supplies file contents. Coverage lives beside this
 * in `exchange-register-coverage.ts`.
 */

import { err, ok, type Result } from '@engraph/result';

import { type PinsRow, type RegisterRow } from './exchange-register-types.js';

const ROW_ID = /^([LJCO])(\d+)$/u;
const ANY_ROW_ID = /^([A-Z])(\d+)$/u;
const CODE_SPAN = /`([^`]+)`/gu;
const LIST_SCOPE = /\(list:\s*([^)]*)\)/u;
const GLOB_COLUMN = 'Path globs';
const LABEL_SHAPE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const ESTATES: ReadonlySet<string> = new Set(['oce', 'jcnet', 'castr']);

/**
 * The lists a glob cell names with `(list: a, b)`, or null when it names
 * none. A cell that opens a scope it does not close, or that carries two
 * scopes, is refused rather than read as unscoped: either typo would widen
 * the row to every list of its group.
 */
function parseListScope(cell: string): Result<readonly string[] | null, string> {
  const openings = cell.split('(list:').length - 1;
  if (openings > 1) {
    return err('carries more than one (list: ...) scope');
  }
  const match = LIST_SCOPE.exec(cell);
  if (match === null) {
    return openings === 0 ? ok(null) : err('opens a (list: scope it never closes');
  }
  return ok(
    (match[1] ?? '')
      .split(',')
      .map((label) => label.trim())
      .filter((label) => label !== ''),
  );
}

function splitTableCells(line: string): readonly string[] {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) {
    return [];
  }
  return trimmed
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());
}

function isSeparatorRow(cells: readonly string[]): boolean {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/u.test(cell));
}

/**
 * A row id in the first cell and the last cell's globs make a register row.
 * A first cell shaped like a row id with a group outside L, J, C and O is
 * refused: it would resolve to no lists and pass unchecked.
 */
function parseRow(cells: readonly string[]): Result<RegisterRow | null, string> {
  const [first] = cells;
  if (first === undefined) {
    return ok(null);
  }
  const match = ROW_ID.exec(first);
  if (match === null) {
    return ANY_ROW_ID.test(first)
      ? err(`row ${first}: the group is not one of L, J, C, O`)
      : ok(null);
  }
  const last = cells.at(-1) ?? '';
  const globs = [...last.matchAll(CODE_SPAN)]
    .map((span) => span[1] ?? '')
    .filter((glob) => glob !== '');
  const lists = parseListScope(last);
  if (!lists.ok) {
    return err(`row ${first}: ${lists.error}`);
  }
  return ok({
    id: first,
    group: match[1] ?? '',
    globs,
    catchAll: last.includes('(catch-all)'),
    lists: lists.value,
  });
}

/** Why a parsed row is refused: a reused id or an empty list scope; null when it stands. */
function rowRefusal(row: RegisterRow, seen: ReadonlySet<string>): string | null {
  if (seen.has(row.id)) {
    return `row id ${row.id} appears more than once; ids are unique and never reused`;
  }
  if (row.lists !== null && row.lists.length === 0) {
    return `row ${row.id}: an empty (list:) scope names no list`;
  }
  return null;
}

interface TableState {
  readonly previousCells: readonly string[];
  readonly inGlobTable: boolean;
}

/** Advances the table state for one line: a blank line ends a table, a separator opens one. */
function nextTableState(state: TableState, cells: readonly string[]): TableState {
  if (cells.length === 0) {
    return { previousCells: [], inGlobTable: false };
  }
  if (isSeparatorRow(cells)) {
    return { previousCells: cells, inGlobTable: state.previousCells.at(-1) === GLOB_COLUMN };
  }
  return { previousCells: cells, inGlobTable: state.inGlobTable };
}

/**
 * Reads every row of every table whose header's LAST column is `Path globs`
 * and whose first cell is a row id (`L1`, `J15`, ...): each backticked span
 * in the last cell is one glob, and the literal `(catch-all)` marks a row
 * that covers only what no sibling row of its group covers. Tables with
 * another last column (the landings table, the owner-word rows) are skipped,
 * so a row id in their first cell never becomes a concept row. A row id that
 * appears twice is a refusal: ids are unique and never reused.
 */
export function parseRegisterRows(markdown: string): Result<readonly RegisterRow[], string> {
  const rows: RegisterRow[] = [];
  const seen = new Set<string>();
  let state: TableState = { previousCells: [], inGlobTable: false };
  for (const line of markdown.split('\n')) {
    const cells = splitTableCells(line);
    const wasSeparator = isSeparatorRow(cells);
    state = nextTableState(state, cells);
    if (!state.inGlobTable || wasSeparator) {
      continue;
    }
    const row = acceptRow(cells, seen);
    if (!row.ok) {
      return row;
    }
    if (row.value !== null) {
      rows.push(row.value);
    }
  }
  return ok(rows);
}

/** Parses one glob-table line and admits its row: null for a non-row line, an error for a refused one. */
function acceptRow(
  cells: readonly string[],
  seen: Set<string>,
): Result<RegisterRow | null, string> {
  const parsed = parseRow(cells);
  if (!parsed.ok || parsed.value === null) {
    return parsed;
  }
  const refusal = rowRefusal(parsed.value, seen);
  if (refusal !== null) {
    return err(refusal);
  }
  seen.add(parsed.value.id);
  return parsed;
}

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

/**
 * Parsing helpers for the exchange-register validator: the register's row
 * tables. The pins file and the delta lists are read in
 * `exchange-register-inputs.ts`; coverage lives in
 * `exchange-register-coverage.ts`. No IO here; the validator entry point
 * supplies file contents.
 */

import { err, ok, type Result } from '@engraph/result';

import { type RegisterRow } from './exchange-register-types.js';

const ROW_ID = /^([LJCO])(\d+)$/u;
const ANY_ROW_ID = /^([A-Z])(\d+)$/u;
const CODE_SPAN = /`([^`]+)`/gu;
const LIST_SCOPE = /\(list:\s*([^)]*)\)/u;
/** Anything that reads as a list-scope marker, however mis-typed: `( list :`, `(List:`, `(list :`. */
const SCOPE_LIKE = /\(\s*list\s*:/giu;
const GLOB_COLUMN = 'Path globs';
/** A concept table's header, exactly: the row, its concept, one disposition per estate, the globs. */
const CONCEPT_HEADER: readonly string[] = [
  'Row',
  'Concept',
  'jcnet',
  'lineage',
  'castr',
  GLOB_COLUMN,
];

/**
 * The lists a glob cell names with `(list: a, b)`, or null when it names
 * none. A cell that opens a scope it does not close, carries two scopes, or
 * spells the marker any way but `(list:` is refused rather than read as
 * unscoped: each typo would widen the row to every list of its group.
 */
function parseListScope(cell: string): Result<readonly string[] | null, string> {
  const markers = cell.match(SCOPE_LIKE) ?? [];
  if (markers.length > 1) {
    return err('carries more than one (list: ...) scope');
  }
  const [marker] = markers;
  if (marker !== undefined && marker !== '(list:') {
    return err(
      `carries the scope marker \`${marker}\`; the grammar is exactly \`(list: <label>[, <label>])\``,
    );
  }
  const match = LIST_SCOPE.exec(cell);
  if (match === null) {
    return marker === undefined ? ok(null) : err('opens a (list: scope it never closes');
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

/** A glob table's header is the concept header exactly; anything else is refused. */
function headerRefusal(header: readonly string[]): string | null {
  const same =
    header.length === CONCEPT_HEADER.length &&
    header.every((cell, index) => cell === CONCEPT_HEADER[index]);
  return same
    ? null
    : `a glob table's header is \`| ${CONCEPT_HEADER.join(' | ')} |\`, not \`| ${header.join(' | ')} |\``;
}

/** A concept row has one non-empty cell per header column: no disposition may be blank. */
function cellsRefusal(cells: readonly string[]): string | null {
  if (cells.length !== CONCEPT_HEADER.length) {
    return `row ${cells[0] ?? ''}: ${cells.length} cells, not ${CONCEPT_HEADER.length}`;
  }
  const blank = cells.findIndex((cell) => cell === '');
  return blank === -1
    ? null
    : `row ${cells[0] ?? ''}: the ${CONCEPT_HEADER[blank] ?? ''} cell is empty`;
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
    const header = isSeparatorRow(cells) ? state.previousCells : null;
    state = nextTableState(state, cells);
    if (!state.inGlobTable) {
      continue;
    }
    const row = header === null ? acceptLine(cells, seen) : headerLine(header);
    if (!row.ok) {
      return row;
    }
    if (row.value !== null) {
      rows.push(row.value);
    }
  }
  return ok(rows);
}

/** A separator line inside a glob table: its header must be the concept header; it yields no row. */
function headerLine(header: readonly string[]): Result<RegisterRow | null, string> {
  const refusal = headerRefusal(header);
  return refusal === null ? ok(null) : err(refusal);
}

/** A data line inside a glob table: every cell present and non-empty, then the row itself. */
function acceptLine(
  cells: readonly string[],
  seen: Set<string>,
): Result<RegisterRow | null, string> {
  const refusal = cellsRefusal(cells);
  return refusal === null ? acceptRow(cells, seen) : err(refusal);
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

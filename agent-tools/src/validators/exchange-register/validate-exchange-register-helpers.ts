/**
 * Parsing helpers for the exchange-register validator: the register's row
 * tables. The pins file and the delta lists are read in
 * `exchange-register-inputs.ts`; coverage lives in
 * `exchange-register-coverage.ts`. No IO here; the validator entry point
 * supplies file contents.
 */

import { err, ok, type Result } from '@engraph/result';

import { parseMarkers } from './exchange-register-markers.js';
import { type RegisterRow } from './exchange-register-types.js';

const ROW_ID = /^([LJCO])(\d+)$/u;
const CODE_SPAN = /`([^`]+)`/gu;
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
/** The register's other two tables whose first column is `Row`: the owner-word rows and the landings. */
const OTHER_ROW_TABLES: readonly (readonly string[])[] = [
  ['Row', 'Concept', 'jcnet', 'lineage', 'castr', 'Source'],
  ['Row', 'Estate', 'Pull request', 'Head read'],
];

function sameHeader(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((cell, index) => cell === b[index]);
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
 * Every body line of a glob table is a concept row, so a first cell that is
 * not a row id (`l1`, `LL1`, `Lx`, `X1`) is refused rather than skipped: a
 * skipped row's paths would fall to a sibling catch-all and pass unchecked.
 */
function parseRow(cells: readonly string[]): Result<RegisterRow, string> {
  const [first = ''] = cells;
  const match = ROW_ID.exec(first);
  if (match === null) {
    return err(`row cell \`${first}\`: not a row id (one of L, J, C, O, then digits)`);
  }
  const last = cells.at(-1) ?? '';
  const globs = [...last.matchAll(CODE_SPAN)]
    .map((span) => span[1] ?? '')
    .filter((glob) => glob !== '');
  const markers = parseMarkers(last);
  if (!markers.ok) {
    return err(`row ${first}: ${markers.error}`);
  }
  return ok({
    id: first,
    group: match[1] ?? '',
    globs,
    catchAll: last.includes('(catch-all)'),
    lists: markers.value.list,
    excepting: markers.value.excepting ?? [],
    shares: markers.value.shares ?? [],
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
  if (row.excepting.includes(row.id) || row.shares.includes(row.id)) {
    return `row ${row.id}: names itself in a marker`;
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
    return { previousCells: cells, inGlobTable: sameHeader(state.previousCells, CONCEPT_HEADER) };
  }
  return { previousCells: cells, inGlobTable: state.inGlobTable };
}

/**
 * Every table whose first column is `Row` is one of the register's three
 * tables exactly (concepts, owner-word rows, landings); a header that is
 * none of them, such as a mistyped `Path globs`, is refused rather than
 * skipped, since a skipped table's rows would vanish into catch-all cover.
 */
function headerRefusal(header: readonly string[]): string | null {
  if (header[0] !== 'Row') {
    return null;
  }
  const known = [CONCEPT_HEADER, ...OTHER_ROW_TABLES].some((other) => sameHeader(header, other));
  return known
    ? null
    : `the table headed \`| ${header.join(' | ')} |\` is none of the register's three: a concept table's header is \`| ${CONCEPT_HEADER.join(' | ')} |\``;
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
    if (header !== null) {
      const refusal = headerRefusal(header);
      if (refusal !== null) {
        return err(refusal);
      }
      continue;
    }
    if (!state.inGlobTable) {
      continue;
    }
    const row = acceptLine(cells, seen);
    if (!row.ok) {
      return row;
    }
    if (row.value !== null) {
      rows.push(row.value);
    }
  }
  return ok(rows);
}

/** A data line inside a glob table: every cell present and non-empty, then the row itself. */
function acceptLine(cells: readonly string[], seen: Set<string>): Result<RegisterRow, string> {
  const refusal = cellsRefusal(cells);
  return refusal === null ? acceptRow(cells, seen) : err(refusal);
}

/** Parses one glob-table line and admits its row: null for a non-row line, an error for a refused one. */
function acceptRow(cells: readonly string[], seen: Set<string>): Result<RegisterRow, string> {
  const parsed = parseRow(cells);
  if (!parsed.ok) {
    return parsed;
  }
  const refusal = rowRefusal(parsed.value, seen);
  if (refusal !== null) {
    return err(refusal);
  }
  seen.add(parsed.value.id);
  return parsed;
}

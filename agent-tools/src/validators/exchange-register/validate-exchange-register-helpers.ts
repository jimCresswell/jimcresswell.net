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
const CODE_SPAN = /`([^`]+)`/gu;
/** The three markers a glob cell may carry, each exactly `(<word>: a, b)`. */
type Marker = 'list' | 'excepting' | 'shares';
const MARKERS: readonly Marker[] = ['list', 'excepting', 'shares'];
/** Anything that reads as one of the markers, however mis-typed: `( list :`, `(Excepting:`. */
const MARKER_LIKE = /\(\s*(list|excepting|shares)\s*:/giu;
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
function parseMarkers(cell: string): Result<Record<Marker, readonly string[] | null>, string> {
  const parsed: Partial<Record<Marker, readonly string[] | null>> = {};
  for (const name of MARKERS) {
    const labels = parseMarker(cell, name);
    if (!labels.ok) {
      return labels;
    }
    parsed[name] = labels.value;
  }
  return ok({
    list: parsed.list ?? null,
    excepting: parsed.excepting ?? null,
    shares: parsed.shares ?? null,
  });
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

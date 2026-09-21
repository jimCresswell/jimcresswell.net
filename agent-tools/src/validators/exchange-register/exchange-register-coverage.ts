/**
 * Coverage for the exchange-register validator: which lists a row group
 * covers, the register's glob dialect, and the computation that maps every
 * listed path to a row. Pure; no IO.
 */

import {
  type CoverageReport,
  type DeadGlob,
  type PinsRow,
  type RegisterRow,
  type UncoveredPath,
  type UnknownScope,
} from './exchange-register-types.js';

/**
 * The lists a row group covers, by the register's stated rule: L rows cover
 * both lineage lists, J rows the jcnet list, C rows the castr list and the
 * lineage-since-castr list, O rows no list.
 */
export function listsForGroup(group: string, pins: readonly PinsRow[]): readonly string[] {
  switch (group) {
    case 'L':
      return pins.filter((p) => p.estate === 'oce').map((p) => p.label);
    case 'J':
      return pins.filter((p) => p.estate === 'jcnet').map((p) => p.label);
    case 'C':
      return pins
        .filter((p) => p.estate === 'castr' || p.label === 'oce-since-castr-pin')
        .map((p) => p.label);
    default:
      return [];
  }
}

function escapeRegExp(text: string): string {
  return text.replaceAll(/[.+?^${}()|[\]\\]/gu, String.raw`\$&`);
}

/**
 * Compiles a register glob: `**` matches any run of segments (including
 * none), `*` matches within one segment, everything else is literal. A glob
 * with no wildcard matches the path exactly.
 */
export function globToRegExp(glob: string): RegExp {
  let pattern = '';
  let index = 0;
  while (index < glob.length) {
    if (glob.startsWith('**/', index)) {
      pattern += '(?:.*/)?';
      index += 3;
    } else if (glob.startsWith('**', index)) {
      pattern += '.*';
      index += 2;
    } else if (glob[index] === '*') {
      pattern += '[^/]*';
      index += 1;
    } else {
      pattern += escapeRegExp(glob[index] ?? '');
      index += 1;
    }
  }
  return new RegExp(`^${pattern}$`, 'u');
}

interface CompiledGlob {
  readonly glob: string;
  readonly regexp: RegExp;
  hits: number;
}

interface CompiledRow {
  readonly row: RegisterRow;
  readonly lists: ReadonlySet<string>;
  readonly globs: readonly CompiledGlob[];
}

/**
 * Every `(list: ...)` label a row declares outside its group's lists: such a
 * label would silently empty the row's list set, so it is a finding.
 */
export function collectUnknownScopes(
  rows: readonly RegisterRow[],
  pins: readonly PinsRow[],
): readonly UnknownScope[] {
  return rows.flatMap((row) => {
    const groupLists = listsForGroup(row.group, pins);
    return (row.lists ?? [])
      .filter((label) => !groupLists.includes(label))
      .map((label) => ({ rowId: row.id, label }));
  });
}

/** The group's lists, narrowed to the row's declared `(list: ...)` scope when it has one. */
function listsForRow(row: RegisterRow, pins: readonly PinsRow[]): ReadonlySet<string> {
  const groupLists = listsForGroup(row.group, pins);
  const declared = row.lists;
  if (declared === null) {
    return new Set(groupLists);
  }
  return new Set(groupLists.filter((label) => declared.includes(label)));
}

function compileRows(
  rows: readonly RegisterRow[],
  pins: readonly PinsRow[],
): readonly CompiledRow[] {
  return rows.map((row) => ({
    row,
    lists: listsForRow(row, pins),
    globs: row.globs.map((glob) => ({ glob, regexp: globToRegExp(glob), hits: 0 })),
  }));
}

/** Records every glob of the candidate rows that matches the path; true when any did. */
function matchPath(
  path: string,
  candidates: readonly CompiledRow[],
  matchesByRow: Map<string, number>,
): boolean {
  let covered = false;
  for (const entry of candidates) {
    for (const compiledGlob of entry.globs.filter((g) => g.regexp.test(path))) {
      compiledGlob.hits += 1;
      covered = true;
      matchesByRow.set(entry.row.id, (matchesByRow.get(entry.row.id) ?? 0) + 1);
    }
  }
  return covered;
}

/**
 * Within one group, a specific row covers first and the group's catch-all
 * only when no specific sibling did; the register's rule is "of its group".
 */
function coverPathInGroup(
  path: string,
  rows: readonly CompiledRow[],
  matchesByRow: Map<string, number>,
): boolean {
  const specific = rows.filter((c) => !c.row.catchAll);
  if (matchPath(path, specific, matchesByRow)) {
    return true;
  }
  const catchAll = rows.filter((c) => c.row.catchAll);
  return matchPath(path, catchAll, matchesByRow);
}

/**
 * A path is covered when any group that covers its list covers it. Each
 * group is evaluated on its own, so an L-specific match never stops the C
 * catch-all from taking a path no C-specific row covers.
 */
function coverPath(
  label: string,
  path: string,
  compiled: readonly CompiledRow[],
  matchesByRow: Map<string, number>,
): boolean {
  const inList = compiled.filter((c) => c.lists.has(label));
  const groups = [...new Set(inList.map((c) => c.row.group))];
  let covered = false;
  for (const group of groups) {
    const rows = inList.filter((c) => c.row.group === group);
    covered = coverPathInGroup(path, rows, matchesByRow) || covered;
  }
  return covered;
}

function collectDeadGlobs(compiled: readonly CompiledRow[]): readonly DeadGlob[] {
  return compiled
    .filter((entry) => entry.lists.size > 0)
    .flatMap((entry) =>
      entry.globs.filter((g) => g.hits === 0).map((g) => ({ rowId: entry.row.id, glob: g.glob })),
    );
}

/**
 * Computes coverage: every path of every list must match at least one
 * non-catch-all row whose group covers the list, or failing that a
 * catch-all row of such a group; and every glob must match at least one
 * path in some list its row covers.
 */
export function computeCoverage(
  rows: readonly RegisterRow[],
  pins: readonly PinsRow[],
  lists: ReadonlyMap<string, readonly string[]>,
): CoverageReport {
  const compiled = compileRows(rows, pins);
  const matchesByRow = new Map<string, number>(rows.map((row) => [row.id, 0]));
  const uncovered: UncoveredPath[] = [];
  for (const [label, paths] of lists) {
    for (const path of paths) {
      if (!coverPath(label, path, compiled, matchesByRow)) {
        uncovered.push({ label, path });
      }
    }
  }
  return { uncovered, deadGlobs: collectDeadGlobs(compiled), matchesByRow };
}

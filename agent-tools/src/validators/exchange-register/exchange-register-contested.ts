/**
 * The register's precedence findings: an `(excepting: ...)` or `(shares: ...)`
 * id that names nothing, and a list entry two concepts claim without saying
 * so. Pure; no IO.
 */

import {
  type BadReference,
  type ContestedEntry,
  type RegisterRow,
} from './exchange-register-types.js';

/**
 * Every `(excepting: ...)` or `(shares: ...)` id that is not another row of
 * the same group: such a marker would except or share with nothing.
 */
export function collectBadReferences(rows: readonly RegisterRow[]): readonly BadReference[] {
  const byId = new Map(rows.map((row) => [row.id, row]));
  return rows.flatMap((row) =>
    (['excepting', 'shares'] as const).flatMap((marker) =>
      row[marker]
        .filter((target) => byId.get(target)?.group !== row.group || target === row.id)
        .map((target) => ({ rowId: row.id, marker, target })),
    ),
  );
}

/** The specific rows credited with each entry, keyed by entry. */
function ownersByEntry(
  rows: readonly RegisterRow[],
  entriesByRow: ReadonlyMap<string, readonly string[]>,
): ReadonlyMap<string, readonly string[]> {
  const owners = new Map<string, string[]>();
  for (const row of rows.filter((r) => !r.catchAll)) {
    for (const entry of entriesByRow.get(row.id) ?? []) {
      owners.set(entry, [...(owners.get(entry) ?? []), row.id]);
    }
  }
  return owners;
}

/** The owners of one entry split by group. */
function ownersByGroup(
  ids: readonly string[],
  byId: ReadonlyMap<string, RegisterRow>,
): readonly (readonly string[])[] {
  const perGroup = new Map<string, string[]>();
  for (const id of ids) {
    const group = byId.get(id)?.group ?? '';
    perGroup.set(group, [...(perGroup.get(group) ?? []), id]);
  }
  return [...perGroup.values()];
}

/** True when some row of the set declares it shares with every other row of the set. */
function declaredShared(
  rowIds: readonly string[],
  byId: ReadonlyMap<string, RegisterRow>,
): boolean {
  return rowIds.some((id) => {
    const shares = byId.get(id)?.shares ?? [];
    return rowIds.every((other) => other === id || shares.includes(other));
  });
}

/**
 * Entries credited to two or more specific rows of one group where no row
 * of the set declares `(shares: ...)` with every other: two concepts claim
 * one path and neither says so.
 */
export function collectContested(
  rows: readonly RegisterRow[],
  entriesByRow: ReadonlyMap<string, readonly string[]>,
): readonly ContestedEntry[] {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const contested: ContestedEntry[] = [];
  for (const [entry, ids] of ownersByEntry(rows, entriesByRow)) {
    for (const rowIds of ownersByGroup(ids, byId)) {
      if (rowIds.length > 1 && !declaredShared(rowIds, byId)) {
        const [label = '', path = ''] = entry.split('\t');
        contested.push({ label, path, rowIds });
      }
    }
  }
  return contested;
}

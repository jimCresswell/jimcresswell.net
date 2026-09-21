/** Shared shapes of the exchange-register validator. */

/**
 * One register row: its id, its group letter, the globs it declares, whether
 * it is a catch-all, and the lists it is scoped to (`null` when the row
 * covers every list of its group).
 */
export interface RegisterRow {
  readonly id: string;
  readonly group: string;
  readonly globs: readonly string[];
  readonly catchAll: boolean;
  readonly lists: readonly string[] | null;
  /** Rows of the same group whose globs take precedence: an entry they match is never credited here. */
  readonly excepting: readonly string[];
  /** Rows of the same group this row knowingly shares entries with: two concepts in the same files. */
  readonly shares: readonly string[];
}

/** One pins row: the list label and the estate whose delta it is. */
export interface PinsRow {
  readonly label: string;
  readonly estate: string;
}

/** A path in a list that no row of the list's groups covers. */
export interface UncoveredPath {
  readonly label: string;
  readonly path: string;
}

/** A `(list: ...)` label on a row that names no list of the row's group. */
export interface UnknownScope {
  readonly rowId: string;
  readonly label: string;
}

/** An `(excepting: ...)` or `(shares: ...)` id that is not another row of the same group. */
export interface BadReference {
  readonly rowId: string;
  readonly marker: 'excepting' | 'shares';
  readonly target: string;
}

/** A list entry credited to two or more specific rows of one group, neither declaring the share. */
export interface ContestedEntry {
  readonly label: string;
  readonly path: string;
  readonly rowIds: readonly string[];
}

/** A glob on a row that matches nothing in any list the row covers. */
export interface DeadGlob {
  readonly rowId: string;
  readonly glob: string;
}

/**
 * What the coverage computation found: uncovered paths, dead globs, the
 * number of list entries each row covers, and those entries themselves
 * (`label<TAB>path`), from which the tracked fingerprint is taken.
 */
export interface CoverageReport {
  readonly uncovered: readonly UncoveredPath[];
  readonly contested: readonly ContestedEntry[];
  readonly deadGlobs: readonly DeadGlob[];
  readonly matchesByRow: ReadonlyMap<string, number>;
  readonly entriesByRow: ReadonlyMap<string, readonly string[]>;
}

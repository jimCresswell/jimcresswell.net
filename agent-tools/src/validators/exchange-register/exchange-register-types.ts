/** Shared shapes of the exchange-register validator. */

/** One register row: its id, its group letter, and the globs it declares. */
export interface RegisterRow {
  readonly id: string;
  readonly group: string;
  readonly globs: readonly string[];
  readonly catchAll: boolean;
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

/** A glob on a row that matches nothing in any list the row covers. */
export interface DeadGlob {
  readonly rowId: string;
  readonly glob: string;
}

export interface CoverageReport {
  readonly uncovered: readonly UncoveredPath[];
  readonly deadGlobs: readonly DeadGlob[];
  readonly matchesByRow: ReadonlyMap<string, number>;
}

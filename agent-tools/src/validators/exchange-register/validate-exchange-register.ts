#!/usr/bin/env node

/**
 * Exchange register check.
 *
 * The practice-exchange node's register maps every path in the computed
 * delta lists to a concept row through the row's path globs. This validator
 * recomputes that mapping: every path in every list is covered by a row whose
 * group covers the list (a catch-all row counting only where no sibling
 * does), and every glob a row declares matches something in a list the row
 * covers. Either failure is a refusal (exit 1) naming each path or glob.
 * The lists themselves are recomputed by the delta scripts beside the pins,
 * not here.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { computeCoverage } from './exchange-register-coverage.js';
import { type CoverageReport, type PinsRow, type RegisterRow } from './exchange-register-types.js';
import {
  parseDeltaPaths,
  parsePinsRows,
  parseRegisterRows,
} from './validate-exchange-register-helpers.js';

const NAME = 'validate-exchange-register';
const INPUTS = '.agent/reports/practice-transplant/inputs';
const REGISTER = '.agent/reports/practice-transplant/exchange-register.md';

interface Inputs {
  readonly rows: readonly RegisterRow[];
  readonly pins: readonly PinsRow[];
  readonly lists: ReadonlyMap<string, readonly string[]>;
}

function loadInputs(repoRoot: string): Inputs {
  const rows = parseRegisterRows(readFileSync(join(repoRoot, REGISTER), 'utf8'));
  const pins = parsePinsRows(readFileSync(join(repoRoot, INPUTS, 'exchange-pins.tsv'), 'utf8'));
  const lists = new Map<string, readonly string[]>(
    pins.map((pin) => [
      pin.label,
      parseDeltaPaths(
        readFileSync(join(repoRoot, INPUTS, `exchange-delta-${pin.label}.tsv`), 'utf8'),
      ),
    ]),
  );
  return { rows, pins, lists };
}

function reportFindings(report: CoverageReport): void {
  for (const { label, path } of report.uncovered) {
    writeErrorLine(`${NAME}: ${label}: no row covers ${path}`);
  }
  for (const { rowId, glob } of report.deadGlobs) {
    writeErrorLine(
      `${NAME}: row ${rowId}: glob \`${glob}\` matches nothing in the lists it covers`,
    );
  }
  writeErrorLine(
    `${NAME}: ${report.uncovered.length} uncovered path(s), ${report.deadGlobs.length} dead glob(s)`,
  );
}

function main(): number {
  const { rows, pins, lists } = loadInputs(resolveRepoRoot(import.meta.url));
  if (rows.length === 0 || pins.length === 0) {
    writeErrorLine(`${NAME}: the register has no rows or the pins file has no rows`);
    return 2;
  }
  const report = computeCoverage(rows, pins, lists);
  if (report.uncovered.length > 0 || report.deadGlobs.length > 0) {
    reportFindings(report);
    return 1;
  }
  const total = [...lists.values()].reduce((sum, paths) => sum + paths.length, 0);
  writeLine(
    `${NAME}: OK (${total} paths over ${lists.size} lists covered by ${rows.length} rows).`,
  );
  return 0;
}

process.exitCode = main();

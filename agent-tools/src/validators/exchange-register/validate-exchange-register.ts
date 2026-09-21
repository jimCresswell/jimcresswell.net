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
 * The per-row coverage counts are tracked beside the lists and recomputed
 * here: any drift (a deleted row falling to a catch-all, a widened glob, a
 * regenerated list) is a refusal until `--write-counts` records the intended
 * change. The lists themselves are recomputed by the delta scripts beside
 * the pins, not here.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { err, ok, type Result } from '@engraph/result';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import {
  countDrift,
  coverageOf,
  describeCoverage,
  parseCoverageCounts,
  renderCoverageCounts,
} from './exchange-register-counts.js';
import { collectUnknownScopes, computeCoverage } from './exchange-register-coverage.js';
import {
  type CoverageReport,
  type PinsRow,
  type RegisterRow,
  type UnknownScope,
} from './exchange-register-types.js';
import { parseDeltaPaths, parsePinsRows } from './exchange-register-inputs.js';
import { parseRegisterRows } from './validate-exchange-register-helpers.js';

const NAME = 'validate-exchange-register';
const INPUTS = '.agent/reports/practice-transplant/inputs';
const REGISTER = '.agent/reports/practice-transplant/exchange-register.md';
const COUNTS = 'exchange-coverage-counts.tsv';
const USAGE = 'usage: validate-exchange-register [--write-counts]';

interface Inputs {
  readonly rows: readonly RegisterRow[];
  readonly pins: readonly PinsRow[];
  readonly lists: ReadonlyMap<string, readonly string[]>;
}

/** Reads one input by its repository-relative path; a missing or unreadable file names itself. */
function readInput(repoRoot: string, relPath: string): Result<string, string> {
  try {
    return ok(readFileSync(join(repoRoot, relPath), 'utf8'));
  } catch (cause) {
    const code = cause instanceof Error && 'code' in cause ? String(cause.code) : 'unreadable';
    return err(`cannot read ${relPath} (${code})`);
  }
}

/** Reads and parses one input; the first failure, read or parse, is the message. */
function loadInput<T>(
  repoRoot: string,
  relPath: string,
  parse: (text: string) => Result<T, string>,
): Result<T, string> {
  const text = readInput(repoRoot, relPath);
  if (!text.ok) {
    return text;
  }
  const parsed = parse(text.value);
  return parsed.ok ? parsed : err(`${relPath}: ${parsed.error}`);
}

function loadInputs(repoRoot: string): Inputs | string {
  const rows = loadInput(repoRoot, REGISTER, parseRegisterRows);
  if (!rows.ok) {
    return rows.error;
  }
  const pins = loadInput(repoRoot, `${INPUTS}/exchange-pins.tsv`, parsePinsRows);
  if (!pins.ok) {
    return pins.error;
  }
  const lists = new Map<string, readonly string[]>();
  for (const pin of pins.value) {
    const paths = loadInput(repoRoot, `${INPUTS}/exchange-delta-${pin.label}.tsv`, (text) =>
      parseDeltaPaths(text, pin.label),
    );
    if (!paths.ok) {
      return paths.error;
    }
    lists.set(pin.label, paths.value);
  }
  return { rows: rows.value, pins: pins.value, lists };
}

function reportFindings(
  report: CoverageReport & { readonly unknownScopes: readonly UnknownScope[] },
): void {
  for (const { label, path } of report.uncovered) {
    writeErrorLine(`${NAME}: ${label}: no row covers ${path}`);
  }
  for (const { rowId, label } of report.unknownScopes) {
    writeErrorLine(`${NAME}: row ${rowId}: (list: ${label}) names no list of its group`);
  }
  for (const { rowId, glob } of report.deadGlobs) {
    writeErrorLine(
      `${NAME}: row ${rowId}: glob \`${glob}\` matches nothing in the lists it covers`,
    );
  }
  writeErrorLine(
    `${NAME}: ${report.uncovered.length} uncovered path(s), ${report.deadGlobs.length} dead glob(s), ${report.unknownScopes.length} unknown list scope(s)`,
  );
}

/**
 * Compares the recomputed counts with the tracked file, or writes the file
 * when asked; 0 when they agree or were written, 1 on drift, 2 when the
 * tracked file is unreadable.
 */
function checkCounts(
  repoRoot: string,
  rows: readonly RegisterRow[],
  report: CoverageReport,
  write: boolean,
): number {
  const relPath = `${INPUTS}/${COUNTS}`;
  const recomputed = coverageOf(rows, report);
  if (write) {
    writeFileSync(join(repoRoot, relPath), renderCoverageCounts(recomputed), 'utf8');
    writeLine(`${NAME}: coverage counts written for ${rows.length} rows.`);
    return 0;
  }
  const tracked = loadInput(repoRoot, relPath, parseCoverageCounts);
  if (!tracked.ok) {
    writeErrorLine(`${NAME}: ${tracked.error}`);
    return 2;
  }
  const drift = countDrift(tracked.value, recomputed);
  for (const { rowId, expected, actual } of drift) {
    writeErrorLine(
      `${NAME}: row ${rowId}: tracked ${describeCoverage(expected)}, recomputed ${describeCoverage(actual)}`,
    );
  }
  if (drift.length > 0) {
    writeErrorLine(
      `${NAME}: ${drift.length} row(s) drifted from ${COUNTS}; when the change is intended, re-run with --write-counts and commit the file`,
    );
    return 1;
  }
  return 0;
}

/** The inputs, or the exit code (2) after the refusal has been written. */
function readInputs(repoRoot: string): Inputs | 2 {
  const inputs = loadInputs(repoRoot);
  if (typeof inputs === 'string') {
    writeErrorLine(`${NAME}: ${inputs}`);
    return 2;
  }
  if (inputs.rows.length === 0 || inputs.pins.length === 0) {
    writeErrorLine(`${NAME}: the register has no rows or the pins file has no rows`);
    return 2;
  }
  return inputs;
}

function main(): number {
  const flags = process.argv.slice(2);
  if (flags.some((flag) => flag !== '--write-counts')) {
    writeErrorLine(`${NAME}: ${USAGE}`);
    return 2;
  }
  // projectDir is explicitly disabled: this validator reads the tree it runs
  // inside. The CLAUDE_PROJECT_DIR leg would rebind a worktree invocation to
  // the primary checkout and report the wrong estate green.
  const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
  const inputs = readInputs(repoRoot);
  if (inputs === 2) {
    return 2;
  }
  const { rows, pins, lists } = inputs;
  const report = {
    ...computeCoverage(rows, pins, lists),
    unknownScopes: collectUnknownScopes(rows, pins),
  };
  if (
    report.uncovered.length > 0 ||
    report.deadGlobs.length > 0 ||
    report.unknownScopes.length > 0
  ) {
    reportFindings(report);
    return 1;
  }
  const counts = checkCounts(repoRoot, rows, report, flags.includes('--write-counts'));
  if (counts !== 0) {
    return counts;
  }
  const total = [...lists.values()].reduce((sum, paths) => sum + paths.length, 0);
  writeLine(
    `${NAME}: OK (${total} list entries over ${lists.size} lists, every one covered by one of ${rows.length} rows; counts as tracked).`,
  );
  return 0;
}

process.exitCode = main();

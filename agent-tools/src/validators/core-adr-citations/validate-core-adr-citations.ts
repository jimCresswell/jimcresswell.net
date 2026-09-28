#!/usr/bin/env node

/**
 * Core ADR-citation validator: no file under `.agent/practice-core/` carries
 * an ADR identifier (PDR-105's portability axis; the `practice-core-portability`
 * rule).
 *
 * Scans every tracked Core file for the written ADR citation and holds the
 * per-(file, ADR) counts equal to the committed census (see the helpers module
 * for the contract). Above a row = a new citation; below = a stale census, whose
 * update is the ratchet-down made in the same change as the cure. With the
 * census empty or absent, every citation is new: the validator is strict.
 *
 * Wired into root `docs-validators:check`, which runs in `pnpm check`,
 * `pnpm check:docs` and CI. Exit 0 = clean; 1 = findings; 2 = refusal (no
 * tracked Core file, a Core file unreadable or not scannable as text, or the
 * census unreadable or malformed). The status is returned from `main` and set
 * on `process.exitCode`, so buffered diagnostics reach a pipe before the
 * process ends.
 *
 * @packageDocumentation
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { err, ok, type Result } from '@engraph/result';

import { errorCodeOf } from '../../core/error-code.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import {
  describeUnreadable,
  listTrackedFiles,
  readScanFiles,
} from '../../core/tracked-file-scan.js';

import {
  CENSUS_PATH,
  compareToCensus,
  countCitations,
  findAdrCitations,
  isCorePath,
  parseCensusText,
  type CensusFinding,
  type CitationCount,
  type ScanFile,
} from './validate-core-adr-citations-helpers.js';

const NAME = 'validate-core-adr-citations';

function refuse(reason: string): number {
  writeErrorLine(`${NAME}: ${reason}`);
  return 2;
}

/** The census rows: none when the file is absent; a refusal reason when unusable. */
function loadCensus(repoRoot: string): Result<CitationCount[], string> {
  let text: string;
  try {
    text = readFileSync(path.join(repoRoot, CENSUS_PATH), 'utf8');
  } catch (cause) {
    if (cause instanceof Error && errorCodeOf(cause) === 'ENOENT') {
      return ok([]);
    }
    return err(describeUnreadable({ relativePath: CENSUS_PATH, cause }));
  }
  const parsed = parseCensusText({ label: `the census at ${CENSUS_PATH}`, text });
  return parsed.ok ? parsed : err(parsed.error.message);
}

/** The tracked Core files as text; a refusal reason when any cannot be read as text. */
function readCore(repoRoot: string): Result<ScanFile[], string> {
  const corePaths = listTrackedFiles(repoRoot).filter(isCorePath);
  if (corePaths.length === 0) {
    return err('zero tracked Core files found — refusing a vacuous pass');
  }
  const scan = readScanFiles(repoRoot, corePaths);
  if (!scan.ok) {
    return err(describeUnreadable(scan.error));
  }
  if (scan.value.length !== corePaths.length) {
    const read = new Set(scan.value.map((file) => file.path));
    const dropped = corePaths.filter((corePath) => !read.has(corePath));
    return err(
      `tracked Core file(s) not scannable as text, so the scan cannot vouch for them: ` +
        dropped.join(', '),
    );
  }
  return ok(scan.value);
}

/** One line per citation of a pair whose count grew, as `path:line:column  text`. */
function grownCitationLines(files: readonly ScanFile[], grown: readonly CensusFinding[]): string[] {
  return files.flatMap((file) =>
    findAdrCitations(file.content)
      .filter((citation) =>
        grown.some((finding) => finding.file === file.path && finding.adr === citation.adr),
      )
      .map(
        (citation) =>
          `  ${file.path}:${String(citation.line)}:${String(citation.column)}  ${citation.text}`,
      ),
  );
}

/** The divergences, then every citation of each pair that grew. */
function reportFindings(files: readonly ScanFile[], findings: readonly CensusFinding[]): void {
  writeErrorLine(`✖ ${String(findings.length)} divergence(s) from the census at ${CENSUS_PATH}:`);
  for (const finding of findings) {
    writeErrorLine(
      `  [${finding.reason}] ${finding.file} ${finding.adr}: ${String(finding.live)} live, ` +
        `${String(finding.census)} in the census`,
    );
  }
  const grown = findings.filter((finding) => finding.reason === 'new');
  if (grown.length > 0) {
    writeErrorLine('');
    writeErrorLine('The citations behind each new count:');
    for (const line of grownCitationLines(files, grown)) {
      writeErrorLine(line);
    }
  }
  writeErrorLine('');
  writeErrorLine(
    'The Core travels to repositories where the ADR does not exist (PDR-105; the ' +
      'practice-core-portability rule). Name the concept in place of the ADR number, never ' +
      "delete the sentence, and lower the pair's census row in the same change: a cured pair " +
      'leaves the census. A new citation is refused.',
  );
}

function main(): number {
  const repoRoot = resolveRepoRoot(import.meta.url);
  const core = readCore(repoRoot);
  if (!core.ok) {
    return refuse(core.error);
  }
  const census = loadCensus(repoRoot);
  if (!census.ok) {
    return refuse(census.error);
  }
  const files = core.value;
  const live = countCitations(files);
  const findings = compareToCensus(live, census.value);
  if (findings.length > 0) {
    reportFindings(files, findings);
    return 1;
  }
  const total = live.reduce((sum, row) => sum + row.count, 0);
  const carriers = new Set(live.map((row) => row.file)).size;
  writeLine(
    total === 0
      ? `✓ no ADR citations in ${String(files.length)} Core files`
      : `✓ Core ADR citations match the census: ${String(total)} in ${String(carriers)} of ` +
          `${String(files.length)} Core files, none new`,
  );
  return 0;
}

process.exitCode = main();

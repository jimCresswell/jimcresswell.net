#!/usr/bin/env node
import { readdirSync } from 'node:fs';
import path from 'node:path';

import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { spawnInheritedProcess } from '../repo-check/repo-check-runtime.js';
import { smokeTestFiles, summariseSmokeRun, type SmokeRunResult } from '../smoke/smoke-suite.js';

/**
 * Run every smoke test in `agent-tools/smoke-tests/`, discovered from the
 * directory (`smoke/smoke-suite.ts` carries the reasoning). Each smoke runs
 * as production invokes it — `tsx` on the file, the same spawn the per-file
 * `smoke:*` scripts use — with the agent-tools package root as its working
 * directory, set explicitly so the run does not depend on how this bin was
 * invoked. Every smoke runs even after a failure, so one run reports the
 * whole suite; a signal death is reported by its signal.
 *
 * The bin takes no arguments: any argv is rejected with usage, so a typo can
 * never run the suite as if it had been understood.
 *
 * @packageDocumentation
 */

const SMOKE_DIR = 'smoke-tests';
const USAGE = 'Usage: node dist/src/bin/run-smoke-tests.js (no arguments)';

async function runSuite(): Promise<number> {
  const packageRoot = path.join(resolveRepoRoot(import.meta.url), 'agent-tools');
  const files = smokeTestFiles(readdirSync(path.join(packageRoot, SMOKE_DIR)));

  const results: SmokeRunResult[] = [];
  for (const file of files) {
    writeLine(`smoke run  ${file}`);
    const end = await spawnInheritedProcess(
      'pnpm',
      ['exec', 'tsx', path.join(packageRoot, SMOKE_DIR, file)],
      { cwd: packageRoot },
    );
    results.push({ file, status: end.status, signal: end.signal });
  }

  const summary = summariseSmokeRun(results);
  for (const line of summary.lines) {
    if (summary.ok) {
      writeLine(line);
    } else {
      writeErrorLine(line);
    }
  }
  return summary.ok ? 0 : 1;
}

async function main(argv: readonly string[]): Promise<number> {
  if (argv.length > 0) {
    writeErrorLine(`run-smoke-tests: unrecognised arguments: ${argv.join(' ')}\n${USAGE}`);
    return 1;
  }
  return runSuite();
}

process.exitCode = await main(process.argv.slice(2));

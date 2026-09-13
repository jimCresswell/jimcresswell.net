#!/usr/bin/env node
import { readdirSync } from 'node:fs';
import path from 'node:path';

import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { runInheritedProcess } from '../repo-check/repo-check-runtime.js';
import { smokeTestFiles, summariseSmokeRun, type SmokeRunResult } from '../smoke/smoke-suite.js';

/**
 * Run every smoke test in `agent-tools/smoke-tests/`, discovered from the
 * directory (`smoke/smoke-suite.ts` carries the reasoning). Each smoke runs
 * as production invokes it — `tsx` on the file, the same spawn the per-file
 * `smoke:*` scripts use — with the current working directory left as the
 * invoking package script set it (the agent-tools package root), which is
 * the directory the smokes resolve their fixtures from. Every smoke runs
 * even after a failure, so one run reports the whole suite.
 *
 * @packageDocumentation
 */

const SMOKE_DIR = 'smoke-tests';

async function main(): Promise<number> {
  const packageRoot = path.join(resolveRepoRoot(import.meta.url), 'agent-tools');
  const files = smokeTestFiles(readdirSync(path.join(packageRoot, SMOKE_DIR)));

  const results: SmokeRunResult[] = [];
  for (const file of files) {
    writeLine(`smoke run  ${file}`);
    const exitCode = await runInheritedProcess('pnpm', [
      'exec',
      'tsx',
      path.join(packageRoot, SMOKE_DIR, file),
    ]);
    results.push({ file, exitCode });
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

process.exitCode = await main();

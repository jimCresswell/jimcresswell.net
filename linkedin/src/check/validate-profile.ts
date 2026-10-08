/**
 * The profile check: read each path named on the command line, report what the validator says,
 * and exit non-zero when any file is unreadable, unparsable or carries a structural error.
 * Notes never fail it. Run by the workspace's `validate-profile` script, and by its `lint`
 * script so the gate carries it.
 */

import { readFile } from 'node:fs/promises';

import { reportFile } from '../model/report.js';

import { failed, formatOutcome, formatSummary, type PathOutcome } from './format.js';

async function outcomeOf(path: string): Promise<PathOutcome> {
  try {
    return { path, outcome: reportFile(await readFile(path, 'utf8')) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { path, outcome: { kind: 'unreadable', message } };
  }
}

const paths = process.argv.slice(2);
if (paths.length === 0) {
  process.stdout.write('usage: validate-profile <profile.md> [more.md ...]\n');
  process.exitCode = 2;
} else {
  const outcomes = await Promise.all(paths.map(outcomeOf));
  for (const outcome of outcomes) {
    process.stdout.write(formatOutcome(outcome));
  }
  process.stdout.write(formatSummary(outcomes));
  if (outcomes.some(({ outcome }) => failed(outcome))) {
    process.exitCode = 1;
  }
}

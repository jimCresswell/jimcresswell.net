import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the Core ADR-citation gate's entry point: the validator runs
 * end to end over the live tracked tree (the Core listed and read as text, the
 * census loaded and parsed, the live counts compared with it) and reports its
 * green line on stdout, exit 0. The green line has two forms: the census
 * matched while it holds rows, or no citation at all once the last cure has
 * emptied it.
 *
 * What this smoke does not prove, and where each is proven instead:
 * - the verdict on divergence (new, stale, a swap, an empty census as strict,
 *   the order of findings): the `compareToCensus` cells;
 * - the census refusal decisions (not JSON, an unknown key, a bad count, a file
 *   outside the Core, a non-canonical ADR, a duplicate row): the
 *   `parseCensusText` cells, which prove the `Err` only.
 *
 * Observed by hand, not proven by any cell:
 * - the entry's exit 1, and its report, on a new citation, a stale row and a
 *   swap;
 * - the entry's exit 2 on a malformed census;
 * - the exit 2 refusals for zero tracked Core files and for a Core file that
 *   cannot be read as text.
 */
const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const packageDir = resolve(smokeDir, '..');
const entry = resolve(
  packageDir,
  'src/validators/core-adr-citations/validate-core-adr-citations.ts',
);
const GREEN =
  /^✓ (?:Core ADR citations match the census: \d+ in \d+ of \d+ Core files, none new|no ADR citations in \d+ Core files)$/mu;

function fail(message: string): never {
  process.stderr.write(`validate-core-adr-citations CLI smoke: ${message}\n`);
  process.exit(1);
}

const result = spawnSync('pnpm', ['exec', 'tsx', entry], { cwd: packageDir, encoding: 'utf8' });
if (result.status !== 0) {
  fail(
    `expected exit 0 on the tracked tree, got ${String(result.status)}:\n${result.stderr.slice(0, 600)}`,
  );
}
const green = GREEN.exec(result.stdout);
if (green === null) {
  fail(`expected the green line, got:\n${result.stdout.slice(0, 600)}`);
}
process.stdout.write(`validate-core-adr-citations CLI smoke OK: ${green[0].slice(2)}\n`);

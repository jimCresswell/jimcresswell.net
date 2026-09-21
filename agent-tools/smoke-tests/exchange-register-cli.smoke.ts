import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the exchange-register check's entry point: the validator
 * runs end to end over the tracked tree (register, pins, delta lists and
 * counts file read, coverage recomputed) and reports its green line, exit 0;
 * an unknown flag is a usage refusal, exit 2; and `--write-counts` reaches
 * the entry point through the root script and rewrites the counts file to
 * the bytes already tracked. The refusal arms for malformed inputs stay with
 * the helpers' unit cells.
 */
const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const packageDir = resolve(smokeDir, '..');
const repoRoot = resolve(packageDir, '..');
const entry = resolve(packageDir, 'src/validators/exchange-register/validate-exchange-register.ts');
const COUNTS = '.agent/reports/practice-transplant/inputs/exchange-coverage-counts.tsv';
const GREEN =
  /^validate-exchange-register: OK \((\d+) list entries over (\d+) lists, every one covered by one of (\d+) rows; counts as tracked\)\.$/mu;

function fail(message: string): never {
  process.stderr.write(`validate-exchange-register CLI smoke: ${message}\n`);
  process.exit(1);
}

function run(command: string, args: readonly string[]): ReturnType<typeof spawnSync> {
  return spawnSync(command, [...args], { cwd: repoRoot, encoding: 'utf8' });
}

const green = run('pnpm', ['exec', 'tsx', entry]);
if (green.status !== 0) {
  fail(
    `expected exit 0 on the tracked tree, got ${String(green.status)}:\n${String(green.stderr).slice(0, 600)}`,
  );
}
const line = GREEN.exec(String(green.stdout));
if (line === null) {
  fail(`expected the green line, got:\n${String(green.stdout).slice(0, 600)}`);
}
if (Number(line[1]) === 0 || Number(line[3]) === 0) {
  fail('the green line reported zero list entries or zero rows');
}

const usage = run('pnpm', ['exec', 'tsx', entry, '--bogus']);
if (
  usage.status !== 2 ||
  !String(usage.stderr).includes('usage: validate-exchange-register [--write-counts]')
) {
  fail(
    `expected exit 2 with the usage line on an unknown flag, got ${String(usage.status)}:\n${String(usage.stderr).slice(0, 300)}`,
  );
}

const write = run('pnpm', ['exchange-register:check', '--write-counts']);
if (write.status !== 0 || !String(write.stdout).includes('coverage counts written for')) {
  fail(
    `expected the root script to forward --write-counts, got ${String(write.status)}:\n${String(write.stdout).slice(0, 300)}${String(write.stderr).slice(0, 300)}`,
  );
}
const unchanged = run('git', ['diff', '--quiet', '--', COUNTS]);
if (unchanged.status !== 0) {
  fail(`--write-counts changed ${COUNTS} on a tree whose counts were tracked as current`);
}

process.stdout.write(
  `validate-exchange-register CLI smoke OK: green over ${line[1]} list entries and ${line[3]} rows; unknown flag refused; --write-counts forwarded and idempotent\n`,
);

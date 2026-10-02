import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the Core host-name heading gate's entry point: the validator
 * runs end to end over the live tracked tree (the provenance chain, the
 * changelog tags and the origin read, the Core documents listed and read, the
 * headings scanned) and
 * reports its green line naming the document count and the needle count, exit
 * 0. The refusal arms (a missing provenance file, an unreadable document) stay
 * with the helpers' cells and the shared scan module's.
 */
const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const packageDir = resolve(smokeDir, '..');
const entry = resolve(
  packageDir,
  'src/validators/core-host-names/validate-no-host-names-in-core-headings.ts',
);
const GREEN =
  /^✓ no host names in the headings of (\d+) Core documents \((\d+) host names from the Core's records and the origin\)$/mu;

function fail(message: string): never {
  process.stderr.write(`validate-no-host-names-in-core-headings CLI smoke: ${message}\n`);
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
if (Number(green[1]) === 0 || Number(green[2]) === 0) {
  fail('the scan reported zero Core documents or zero host names');
}
process.stdout.write(
  `validate-no-host-names-in-core-headings CLI smoke OK: the entry point ran green over ${green[1]} Core documents with ${green[2]} host names\n`,
);

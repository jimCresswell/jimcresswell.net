import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the lineage-names gate's entry point: the validator runs end
 * to end over the live tracked tree (the policy block loaded, the tree listed
 * and read, the scan run) and reports its green line naming the needle count
 * and the file count, exit 0 (5c-ii: the helpers had cells, the entry point
 * had none). The refusal arms (a malformed block, an unreadable file) stay
 * with the helpers' cells and the shared scan module's.
 */
const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const packageDir = resolve(smokeDir, '..');
const entry = resolve(packageDir, 'src/validators/lineage-names/validate-no-lineage-names.ts');
const GREEN = /^✓ no lineage names \(.+\) on the live surfaces of (\d+) scannable tracked files$/mu;

function fail(message: string): never {
  process.stderr.write(`validate-no-lineage-names CLI smoke: ${message}\n`);
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
if (Number(green[1]) === 0) {
  fail('the scan reported zero scannable tracked files');
}
process.stdout.write(
  `validate-no-lineage-names CLI smoke OK: the entry point ran green over ${green[1]} scannable tracked files\n`,
);

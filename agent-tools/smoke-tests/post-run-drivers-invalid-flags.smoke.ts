import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the two corpus-analysis post-run drivers: an unknown flag is a
 * normal input error, so each driver reports it on its concise stderr path
 * (`Invalid flags: ...`, the shape the run-artefact builder already uses) and
 * exits 1, never as an unhandled `parseArgs` stack trace (pull request #86,
 * round two).
 */
const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const packageDir = resolve(smokeDir, '..');
const drivers = ['post-run-driver', 'salvage-driver'] as const;

function fail(message: string): never {
  process.stderr.write(`post-run drivers invalid-flags smoke: ${message}\n`);
  process.exit(1);
}

function run(driver: (typeof drivers)[number]): SpawnSyncReturns<string> {
  const entry = resolve(packageDir, `src/corpus-analysis/post-run/${driver}.ts`);
  return spawnSync('pnpm', ['exec', 'tsx', entry, '--no-such-flag'], {
    cwd: packageDir,
    encoding: 'utf8',
  });
}

for (const driver of drivers) {
  const result = run(driver);
  const combined = `${result.stdout}${result.stderr}`;
  if (result.status !== 1) {
    fail(`${driver}: expected exit 1 on an unknown flag, got ${String(result.status)}`);
  }
  if (!result.stderr.startsWith('Invalid flags: ')) {
    fail(`${driver}: expected the concise "Invalid flags: " line, got:\n${combined.slice(0, 600)}`);
  }
  if (combined.includes('    at ')) {
    fail(`${driver}: the flag error carried a stack trace`);
  }
}
process.stdout.write(
  'post-run drivers invalid-flags smoke OK: both drivers refuse an unknown flag on one stderr line, exit 1, no stack trace\n',
);

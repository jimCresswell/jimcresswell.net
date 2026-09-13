import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { accessSync, constants, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI truth-set smoke for the built `repo-check` entry (the root format and
 * markdown gates run through it). repo-check is a package-script entry, not a
 * `bin/` binary, so the build sets no executable bit on it; the smoke proves
 * the built file exists, carries its shebang and cold-starts under plain
 * `node`; `--help` exits 0 with usage on stdout; a mistyped
 * repair flag exits non-zero with usage on stderr and no stack trace — the
 * motivating case: `markdownlint-tracked --fxi` must never run the read-only
 * check and report green as a repair; and one trivial happy path exits 0
 * (`markdownlint-staged` over whatever is staged, the pre-commit hook's own
 * leg).
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const artefactPath = resolve(repoRoot, 'agent-tools/dist/src/repo-check/repo-check.js');

function fail(message: string): never {
  process.stderr.write(`repo-check CLI smoke: ${message}\n`);
  process.exit(1);
}

function run(args: readonly string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [artefactPath, ...args], { cwd: repoRoot, encoding: 'utf8' });
}

accessSync(artefactPath, constants.R_OK);
if (!readFileSync(artefactPath, 'utf8').startsWith('#!/usr/bin/env node')) {
  fail('the built artefact does not start with its shebang');
}

const help = run(['--help']);
if (help.status !== 0 || !help.stdout.startsWith('Usage:')) {
  fail(`--help expected exit 0 with usage on stdout, got ${String(help.status)}\n${help.stderr}`);
}

const mistyped = run(['markdownlint-tracked', '--fxi']);
if (
  mistyped.status === 0 ||
  !mistyped.stderr.includes('Usage:') ||
  mistyped.stderr.includes('    at ') ||
  mistyped.stdout.includes('Linting:')
) {
  fail(
    `markdownlint-tracked --fxi expected a refusal with usage on stderr, no stack and no lint run, got ${String(mistyped.status)}\n${mistyped.stdout}${mistyped.stderr}`,
  );
}

const happy = run(['markdownlint-staged']);
if (happy.status !== 0) {
  fail(`markdownlint-staged expected exit 0, got ${String(happy.status)}\n${happy.stderr}`);
}

process.stdout.write(
  'repo-check CLI smoke OK: shebang, --help exit 0, mistyped flag refused, staged leg exit 0\n',
);

import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { type LogCase, runLogCase } from './hook-error-logs-support.ts';

/**
 * Smoke for the three programs that write `.claude/logs/hook-errors.log`: the
 * hook wrapper `.claude/hooks/_lib/log-hook-errors.sh`, and the fail-open paths
 * of `.claude/hooks/practice-session-identity.mjs` and
 * `.claude/hooks/run-pretooluse-guard.mjs`.
 *
 * The directory also holds the `PreCompact` observer's records of the raw
 * harness payload, so every writer keeps it mode 700 and the log mode 600,
 * tightening what an earlier version left open. The wrapper leaves a symlinked
 * logs directory or log alone and says on stderr that the failure was not
 * written; it still passes its hook's exit code and stderr through.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const HOOKS = join(resolve(smokeDir, '..', '..'), '.claude', 'hooks');
const WRAPPER = join(HOOKS, '_lib', 'log-hook-errors.sh');
const IDENTITY_HOOK = join(HOOKS, 'practice-session-identity.mjs');
const GUARD_SHIM = join(HOOKS, 'run-pretooluse-guard.mjs');
const NOT_WRITTEN = 'this failure was not written to hook-errors.log';

const CASES: readonly LogCase[] = [
  {
    label: 'the wrapper around a failing hook, with no logs directory yet',
    logsBefore: 'absent',
    argv: [WRAPPER, 'sh', '-c', 'echo wrapped-hook-stderr >&2; exit 3'],
    expectedExit: 3,
    expectedLogText: 'wrapped-hook-stderr',
    expectedStderr: 'wrapped-hook-stderr',
  },
  {
    label: 'the wrapper under an open umask: logs owner-only, the hook keeping that umask',
    logsBefore: 'absent',
    argv: ['sh', '-c', 'umask 000; exec "$0" "$@"', WRAPPER, 'sh', '-c', 'umask >&2; exit 4'],
    expectedExit: 4,
    expectedLogText: '0000',
    expectedStderr: '0000',
  },
  {
    label: 'the wrapper around a succeeding hook, over logs left readable',
    logsBefore: 'world-readable',
    argv: [WRAPPER, 'true'],
    expectedExit: 0,
  },
  {
    label: 'the wrapper around a failing hook, with a symlinked logs directory',
    logsBefore: 'symlinked-directory',
    argv: [WRAPPER, 'sh', '-c', 'exit 5'],
    expectedExit: 5,
    expectedStderr: NOT_WRITTEN,
  },
  {
    label: 'the wrapper around a failing hook, with a symlinked log',
    logsBefore: 'symlinked-log',
    argv: [WRAPPER, 'sh', '-c', 'exit 6'],
    expectedExit: 6,
    expectedStderr: NOT_WRITTEN,
  },
  {
    label: 'the session identity hook failing open with no built adapter',
    logsBefore: 'absent',
    argv: [process.execPath, IDENTITY_HOOK],
    expectedExit: 0,
    expectedLogText: 'practice-session-identity fail-open',
  },
  {
    label: 'the session identity hook failing open over logs left readable',
    logsBefore: 'world-readable',
    argv: [process.execPath, IDENTITY_HOOK],
    expectedExit: 0,
    expectedLogText: 'practice-session-identity fail-open',
  },
  {
    label: 'the guard shim failing open on a guard that is not built',
    logsBefore: 'absent',
    argv: [process.execPath, GUARD_SHIM, 'not-built/guard.js'],
    expectedExit: 0,
    expectedLogText: 'hook-policy fail-open',
  },
  {
    label: 'the guard shim failing open over logs left readable',
    logsBefore: 'world-readable',
    argv: [process.execPath, GUARD_SHIM, 'not-built/guard.js'],
    expectedExit: 0,
    expectedLogText: 'hook-policy fail-open',
  },
  {
    label: 'the session identity hook failing open with a symlinked logs directory',
    logsBefore: 'symlinked-directory',
    argv: [process.execPath, IDENTITY_HOOK],
    expectedExit: 0,
  },
  {
    label: 'the guard shim failing open with a symlinked log',
    logsBefore: 'symlinked-log',
    argv: [process.execPath, GUARD_SHIM, 'not-built/guard.js'],
    expectedExit: 0,
  },
];

for (const logCase of CASES) {
  try {
    runLogCase(logCase);
  } catch (error) {
    process.stderr.write(
      `hook-error-logs smoke: ${logCase.label}: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  }
}
process.stdout.write(
  `hook-error-logs smoke OK: ${CASES.length} cases, logs directory 700 and log 600 from every writer, symlinks in the logs path left alone\n`,
);

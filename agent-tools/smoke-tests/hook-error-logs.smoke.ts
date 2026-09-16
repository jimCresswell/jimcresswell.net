import { type SpawnSyncReturns, spawnSync } from 'node:child_process';
import {
  chmodSync,
  closeSync,
  existsSync,
  fstatSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  statSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Smoke for the three programs that write `.claude/logs/hook-errors.log`: the
 * hook wrapper `.claude/hooks/_lib/log-hook-errors.sh`, and the fail-open paths
 * of `.claude/hooks/practice-session-identity.mjs` and
 * `.claude/hooks/run-pretooluse-guard.mjs`.
 *
 * The directory also holds the `PreCompact` observer's records of the raw
 * harness payload, so every writer creates it mode 700 and the log mode 600,
 * and the wrapper tightens ones an earlier version left open. The wrapper
 * leaves a symlinked logs directory or log alone, and says on stderr that the
 * failure was not written. It still passes its hook's exit code and stderr
 * through. Each case runs the real program against a throwaway project
 * directory whose path holds a space.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const HOOKS = join(repoRoot, '.claude', 'hooks');
const WRAPPER = join(HOOKS, '_lib', 'log-hook-errors.sh');
const OWNER_ONLY_DIRECTORY = 0o700;
const OWNER_ONLY_FILE = 0o600;
const TIMEOUT_MS = 10_000;
const NOT_WRITTEN = 'this failure was not written to hook-errors.log';

interface LogCase {
  readonly label: string;
  /** `world-readable`: logs an earlier version left 755 and 644. The symlinked kinds link elsewhere. */
  readonly logsBefore: 'absent' | 'world-readable' | 'symlinked-directory' | 'symlinked-log';
  readonly argv: readonly [string, ...string[]];
  readonly expectedExit: number;
  /** Text the log must hold after the run; when absent, nothing should be logged. */
  readonly expectedLogText?: string;
  /** Text the program's stderr must hold; when absent, nothing is asserted. */
  readonly expectedStderr?: string;
}

/** What a symlink in the logs path points at, and the mode it must keep. */
interface LinkTarget {
  readonly path: string;
  readonly mode: number;
}

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
    argv: [process.execPath, join(HOOKS, 'practice-session-identity.mjs')],
    expectedExit: 0,
    expectedLogText: 'practice-session-identity fail-open',
  },
  {
    label: 'the guard shim failing open on a guard that is not built',
    logsBefore: 'absent',
    argv: [process.execPath, join(HOOKS, 'run-pretooluse-guard.mjs'), 'not-built/guard.js'],
    expectedExit: 0,
    expectedLogText: 'hook-policy fail-open',
  },
];

function fail(message: string): never {
  process.stderr.write(`hook-error-logs smoke: ${message}\n`);
  process.exit(1);
}

function modeOf(path: string): number {
  return statSync(path).mode & 0o777;
}

function prepareSymlinkedDirectory(projectDir: string, logsDir: string): LinkTarget {
  const target = join(projectDir, 'elsewhere');
  mkdirSync(target);
  chmodSync(target, 0o755);
  mkdirSync(join(projectDir, '.claude'));
  symlinkSync(target, logsDir);
  return { path: target, mode: 0o755 };
}

function prepareSymlinkedLog(projectDir: string, logPath: string): LinkTarget {
  const target = join(projectDir, 'elsewhere.log');
  writeFileSync(target, '', 'utf8');
  chmodSync(target, 0o644);
  symlinkSync(target, logPath);
  return { path: target, mode: 0o644 };
}

/** Prepare the logs path; returns what a symlink in it points at, if any. */
function prepareLogs(
  logCase: LogCase,
  projectDir: string,
  logsDir: string,
): LinkTarget | undefined {
  if (logCase.logsBefore === 'absent') {
    return undefined;
  }
  if (logCase.logsBefore === 'symlinked-directory') {
    return prepareSymlinkedDirectory(projectDir, logsDir);
  }
  mkdirSync(logsDir, { recursive: true });
  chmodSync(logsDir, 0o755);
  const logPath = join(logsDir, 'hook-errors.log');
  if (logCase.logsBefore === 'symlinked-log') {
    return prepareSymlinkedLog(projectDir, logPath);
  }
  writeFileSync(logPath, '', 'utf8');
  chmodSync(logPath, 0o644);
  return undefined;
}

/** Read the log through one descriptor, so the mode checked is the mode of the file read. */
function readOwnerOnlyLog(logPath: string): string {
  const descriptor = openSync(logPath, 'r');
  try {
    const mode = fstatSync(descriptor).mode & 0o777;
    if (mode !== OWNER_ONLY_FILE) {
      throw new Error(`expected hook-errors.log to be mode 600, got ${mode.toString(8)}`);
    }
    return readFileSync(descriptor, 'utf8');
  } finally {
    closeSync(descriptor);
  }
}

function checkLinkTargetUntouched(target: LinkTarget): void {
  if (modeOf(target.path) !== target.mode) {
    throw new Error(`the wrapper changed a symlink's target to ${modeOf(target.path).toString(8)}`);
  }
  const written = statSync(target.path).isDirectory()
    ? existsSync(join(target.path, 'hook-errors.log'))
    : readFileSync(target.path, 'utf8').length > 0;
  if (written) {
    throw new Error('the wrapper wrote through a symlink in the logs path');
  }
}

function checkLogs(logsDir: string, logCase: LogCase): void {
  if (modeOf(logsDir) !== OWNER_ONLY_DIRECTORY) {
    throw new Error(`expected .claude/logs to be mode 700, got ${modeOf(logsDir).toString(8)}`);
  }
  const log = readOwnerOnlyLog(join(logsDir, 'hook-errors.log'));
  const holdsExpected =
    logCase.expectedLogText === undefined
      ? log.length === 0
      : log.includes(logCase.expectedLogText);
  if (!holdsExpected) {
    throw new Error(`the log does not hold what this case expects:\n${log}`);
  }
}

function checkExit(outcome: SpawnSyncReturns<string>, expectedExit: number): void {
  if (outcome.status !== expectedExit) {
    const got = outcome.status ?? outcome.signal ?? outcome.error?.message ?? 'an error';
    throw new Error(`expected exit ${expectedExit}, got ${got}\n${outcome.stderr}`);
  }
}

/** Check a run's exit, its stderr, and the logs it left. */
function checkOutcome(
  outcome: SpawnSyncReturns<string>,
  logCase: LogCase,
  logsDir: string,
  linkTarget: LinkTarget | undefined,
): void {
  checkExit(outcome, logCase.expectedExit);
  if (logCase.expectedStderr !== undefined && !outcome.stderr.includes(logCase.expectedStderr)) {
    throw new Error(`stderr lacks ${JSON.stringify(logCase.expectedStderr)}: ${outcome.stderr}`);
  }
  if (linkTarget === undefined) {
    checkLogs(logsDir, logCase);
  } else {
    checkLinkTargetUntouched(linkTarget);
  }
}

function runCase(logCase: LogCase): void {
  const projectDir = mkdtempSync(join(tmpdir(), 'hook error logs smoke '));
  try {
    const logsDir = join(projectDir, '.claude', 'logs');
    const linkTarget = prepareLogs(logCase, projectDir, logsDir);
    const [program, ...args] = logCase.argv;
    const result = spawnSync(program, args, {
      cwd: projectDir,
      env: { ...process.env, CLAUDE_PROJECT_DIR: projectDir, CLAUDE_ENV_FILE: '' },
      input: '{}',
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
    });
    checkOutcome(result, logCase, logsDir, linkTarget);
  } finally {
    rmSync(projectDir, { recursive: true, force: true });
  }
}

for (const logCase of CASES) {
  try {
    runCase(logCase);
  } catch (error) {
    fail(`${logCase.label}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
process.stdout.write(
  `hook-error-logs smoke OK: ${CASES.length} cases, logs directory 700 and log 600 from every writer, symlinks in the logs path left alone\n`,
);

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
import { join } from 'node:path';

/**
 * Support for `hook-error-logs.smoke.ts`: preparing a throwaway project's
 * `.claude/logs`, running one hook-log writer against it, and checking what it
 * left. Every mode is checked and every log read through one descriptor, so the
 * mode checked is the mode of the file read.
 */

const OWNER_ONLY_DIRECTORY = 0o700;
const OWNER_ONLY_FILE = 0o600;
const TIMEOUT_MS = 10_000;

/** One writer run against one starting state of the logs path. */
export interface LogCase {
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
  const descriptor = openSync(target.path, 'r');
  try {
    const stats = fstatSync(descriptor);
    if ((stats.mode & 0o777) !== target.mode) {
      throw new Error(`a writer changed a symlink's target to ${(stats.mode & 0o777).toString(8)}`);
    }
    const written = stats.isDirectory()
      ? existsSync(join(target.path, 'hook-errors.log'))
      : readFileSync(descriptor, 'utf8').length > 0;
    if (written) {
      throw new Error('a writer wrote through a symlink in the logs path');
    }
  } finally {
    closeSync(descriptor);
  }
}

function checkLogs(logsDir: string, logCase: LogCase): void {
  const directoryMode = statSync(logsDir).mode & 0o777;
  if (directoryMode !== OWNER_ONLY_DIRECTORY) {
    throw new Error(`expected .claude/logs to be mode 700, got ${directoryMode.toString(8)}`);
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

/**
 * Run one case against a throwaway project directory whose path holds a space.
 *
 * @param logCase - The writer to run and what it must leave behind.
 */
export function runLogCase(logCase: LogCase): void {
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

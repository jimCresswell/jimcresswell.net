import { closeSync, existsSync, openSync, readFileSync, readSync } from 'node:fs';

import { err, ok, type Result } from '@engraph/result';

import { writeErrorLine, writeLine } from '../core/terminal-output.js';

import { trackedCheckFiles, type TrackedTreeReading } from './repo-check-files.js';
import { lostFilesRefusal, unstagedLoss } from './repo-check-gates.js';
import { defaultRuntime } from './repo-check-runtime.js';
import {
  bashFloorFailures,
  silencingDirectiveFailures,
  isShellScript,
  shebangFailures,
  shellcheckArgs,
} from './repo-check-shellcheck-files.js';
import {
  pinnedShellcheckVersion,
  REPO_SHELLCHECK,
  resolveShellcheck,
  SHELLCHECK_INSTALLER,
  shellcheckVersion,
} from './repo-check-shellcheck-version.js';
import type { RepoCheckCommandResult } from './repo-check-types.js';
import { readTrackedTree } from './repo-check-universe.js';

/**
 * The shellcheck gate: every tracked shell script, linted by the pinned
 * shellcheck, failing on any finding at any severity.
 *
 * shellcheck is a system binary, not a package dependency, so the gate first
 * reads the pin from the installer, runs the repository's `.tools/bin`
 * shellcheck when the installer has put one there and the shellcheck on PATH
 * otherwise, and asks it for its version: a missing, foreign or other-version
 * shellcheck fails the gate with the remedy. The universe is git's tracked tree (`repo-check-universe.ts`),
 * and a tracked file the working tree has lost with the change unstaged fails
 * the gate by name, since a commit carries content the gate cannot read; each
 * file's opening bytes (`HEAD_BYTES`) are read to classify its shebang, which
 * finds the extensionless scripts and fails any shebang the classification
 * refuses (an unrecognised form, or a non-shell form on a file whose path makes
 * it shell), and each script is read for directives that would silence the
 * lint. The pure verdicts live in `repo-check-shellcheck-files.ts` and
 * `repo-check-shellcheck-version.ts`. Paths are relative to the working
 * directory, which agent-tools' `repo-check` script sets to the repository
 * root (`cd ..`).
 *
 * `env`, and `shellcheck` when no repository binary is installed, resolve
 * through PATH, as `gitleaks` does for the secrets leg. The gate is a lint, not a trust boundary: whoever can write a
 * PATH directory already runs code through every tool resolved by name, and
 * the version check pins what a run reports, not which binary produced it.
 *
 * @packageDocumentation
 */

const GATE = 'repo-check shellcheck-tracked';

/**
 * Enough bytes to hold any shebang line a supported kernel honours, its
 * newline included. macOS runs a `#!` line of up to 512 bytes (XNU's
 * `IMG_SHSIZE`; on macOS 26.6 a 512-byte line ran and a 513-byte line failed
 * with ENOEXEC), and Linux reads the first 256 (`BINPRM_BUF_SIZE`), so the
 * whole line naming a script's interpreter is within its first 512 bytes, and
 * a failure quotes all of any shebang line macOS honours.
 */
const HEAD_BYTES = 512;

/** The edges the gate composes, injected so the composition is testable without a repository. */
export interface ShellcheckGateRuntime {
  /** The installer script's text, which holds the pin. */
  readonly readInstaller: () => string;
  /** Whether the installer has put the pinned binary at `.tools/bin/shellcheck`. */
  readonly hasRepoShellcheck: () => boolean;
  /** Run the given shellcheck with `--version`. */
  readonly probeVersion: (command: string) => RepoCheckCommandResult;
  /** What git says about the tracked tree. */
  readonly trackedTree: () => TrackedTreeReading;
  /** A file's first `bytes` bytes (fewer when the file is shorter), decoded as UTF-8. */
  readonly readHead: (file: string, bytes: number) => string;
  /** A file's whole text. */
  readonly readText: (file: string) => string;
  /** Run `env` with the given argv, output inherited, resolving to its exit status. */
  readonly runEnv: (args: readonly string[]) => Promise<number>;
  /** Write one progress line. */
  readonly writeLine: (line: string) => void;
  /** Write one failure line. */
  readonly writeFailure: (line: string) => void;
}

/** A file's first `bytes` bytes, decoded as UTF-8. */
function readHead(file: string, bytes: number): string {
  const buffer = Buffer.alloc(bytes);
  const descriptor = openSync(file, 'r');
  try {
    const bytesRead = readSync(descriptor, buffer, 0, bytes, 0);
    return buffer.toString('utf8', 0, bytesRead);
  } finally {
    closeSync(descriptor);
  }
}

/** The real edges: the working tree, git, the process, stdout and stderr. */
const defaultShellcheckGateRuntime: ShellcheckGateRuntime = {
  readInstaller: () => readFileSync(SHELLCHECK_INSTALLER, 'utf8'),
  hasRepoShellcheck: () => existsSync(REPO_SHELLCHECK),
  probeVersion: (command) => defaultRuntime.runCaptured(command, ['--version']),
  trackedTree: () => readTrackedTree(defaultRuntime),
  readHead,
  readText: (file) => readFileSync(file, 'utf8'),
  runEnv: (args) => defaultRuntime.runInherited('env', args),
  writeLine,
  writeFailure: writeErrorLine,
};

/** Write each failure line under the gate's name and return the failing status. */
function fail(runtime: ShellcheckGateRuntime, lines: readonly string[]): number {
  for (const line of lines) {
    runtime.writeFailure(`${GATE}: ${line}`);
  }
  return 1;
}

/** The pinned shellcheck to run and the version it reported, or why the gate cannot run it. */
function probedShellcheck(
  runtime: ShellcheckGateRuntime,
): Result<{ readonly command: string; readonly source: string; readonly version: string }, string> {
  const pinned = pinnedShellcheckVersion(runtime.readInstaller());
  if (!pinned.ok) {
    return err(pinned.error);
  }
  const shellcheck = resolveShellcheck(runtime.hasRepoShellcheck());
  const version = shellcheckVersion(
    runtime.probeVersion(shellcheck.command),
    pinned.value,
    shellcheck.source,
  );
  return version.ok ? ok({ ...shellcheck, version: version.value }) : err(version.error);
}

/**
 * Each tracked file's opening bytes, or the refusal of the tracked files the
 * working tree has lost with the change unstaged, whose content a commit
 * carries and the gate cannot read.
 */
function trackedHeads(
  runtime: ShellcheckGateRuntime,
): Result<readonly { readonly file: string; readonly head: string }[], string> {
  const tree = runtime.trackedTree();
  const lost = unstagedLoss(tree);
  return lost.length > 0
    ? err(lostFilesRefusal(lost))
    : ok(
        trackedCheckFiles(tree).map((file) => ({
          file,
          head: runtime.readHead(file, HEAD_BYTES),
        })),
      );
}

/** shellcheck over every tracked shell script (the root `lint:shell` gate). */
export async function runShellcheckTracked(
  runtime: ShellcheckGateRuntime = defaultShellcheckGateRuntime,
): Promise<number> {
  const shellcheck = probedShellcheck(runtime);
  if (!shellcheck.ok) {
    return fail(runtime, [shellcheck.error]);
  }
  const heads = trackedHeads(runtime);
  if (!heads.ok) {
    return fail(runtime, [heads.error]);
  }
  const scripts = heads.value
    .filter(({ file, head }) => isShellScript(file, head))
    .map(({ file }) => file);
  const shebangs = heads.value.flatMap(({ file, head }) => shebangFailures(file, head));
  if (scripts.length === 0) {
    return fail(runtime, [
      ...shebangs,
      'git lists no tracked shell scripts; run the gate from the repository root',
    ]);
  }
  runtime.writeLine(
    `${GATE}: shellcheck ${shellcheck.value.version} (${shellcheck.value.source}) over ` +
      `${String(scripts.length)} tracked shell scripts`,
  );
  const texts = scripts.map((file) => ({ file, text: runtime.readText(file) }));
  const directives = texts.flatMap(({ file, text }) => silencingDirectiveFailures(file, text));
  const floors = texts.flatMap(({ file, text }) => bashFloorFailures(file, text));
  const status = await runtime.runEnv(shellcheckArgs(shellcheck.value.command, scripts));
  const refusals = [...shebangs, ...directives, ...floors];
  return refusals.length > 0 ? fail(runtime, refusals) : status;
}

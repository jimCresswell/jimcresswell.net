import { closeSync, openSync, readFileSync, readSync } from 'node:fs';

import { writeErrorLine, writeLine } from '../core/terminal-output.js';

import { defaultRuntime } from './repo-check-runtime.js';
import {
  silencingDirectiveFailures,
  isShellScript,
  shellcheckArgs,
} from './repo-check-shellcheck-files.js';
import {
  pinnedShellcheckVersion,
  SHELLCHECK_INSTALLER,
  shellcheckVersion,
} from './repo-check-shellcheck-version.js';
import type { RepoCheckCommandResult } from './repo-check-types.js';
import { trackedFiles } from './repo-check-universe.js';

/**
 * The shellcheck gate: every tracked shell script, linted by the pinned
 * shellcheck, failing on any finding at any severity.
 *
 * shellcheck is a system binary, not a package dependency, so the gate first
 * reads the pin from the installer and asks shellcheck for its version: a
 * missing, foreign or other-version `shellcheck` fails the gate with the
 * remedy. The universe is git's tracked tree (`repo-check-universe.ts`); each
 * file's first line is read to find the extensionless scripts, and each
 * script is read for directives that would silence the lint. The pure
 * verdicts live in `repo-check-shellcheck-files.ts` and
 * `repo-check-shellcheck-version.ts`. Paths are relative to the working
 * directory, which agent-tools' `repo-check` script sets to the repository
 * root (`cd ..`).
 *
 * `shellcheck` and `env` resolve through PATH, as `gitleaks` does for the
 * secrets leg. The gate is a lint, not a trust boundary: whoever can write a
 * PATH directory already runs code through every tool resolved by name, and
 * the version check pins what a run reports, not which binary produced it.
 *
 * @packageDocumentation
 */

const GATE = 'repo-check shellcheck-tracked';

/** Enough bytes to hold any shebang line the kernel would honour. */
const HEAD_BYTES = 256;

/** The edges the gate composes, injected so the composition is testable without a repository. */
export interface ShellcheckGateRuntime {
  /** The installer script's text, which holds the pin. */
  readonly readInstaller: () => string;
  /** Run `shellcheck --version`. */
  readonly probeVersion: () => RepoCheckCommandResult;
  /** Git's tracked files. */
  readonly trackedFiles: () => readonly string[];
  /** A file's opening bytes, enough to hold its first line. */
  readonly readHead: (file: string) => string;
  /** A file's whole text. */
  readonly readText: (file: string) => string;
  /** Run `env` with the given argv, output inherited, resolving to its exit status. */
  readonly runEnv: (args: readonly string[]) => Promise<number>;
  /** Write one progress line. */
  readonly writeLine: (line: string) => void;
  /** Write one failure line. */
  readonly writeFailure: (line: string) => void;
}

/** The opening bytes of a file, decoded as UTF-8. */
function readHead(file: string): string {
  const buffer = Buffer.alloc(HEAD_BYTES);
  const descriptor = openSync(file, 'r');
  try {
    const bytesRead = readSync(descriptor, buffer, 0, HEAD_BYTES, 0);
    return buffer.toString('utf8', 0, bytesRead);
  } finally {
    closeSync(descriptor);
  }
}

/** The real edges: the working tree, git, the process, stdout and stderr. */
const defaultShellcheckGateRuntime: ShellcheckGateRuntime = {
  readInstaller: () => readFileSync(SHELLCHECK_INSTALLER, 'utf8'),
  probeVersion: () => defaultRuntime.runCaptured('shellcheck', ['--version']),
  trackedFiles: () => trackedFiles(defaultRuntime),
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

/** shellcheck over every tracked shell script (the root `lint:shell` gate). */
export async function runShellcheckTracked(
  runtime: ShellcheckGateRuntime = defaultShellcheckGateRuntime,
): Promise<number> {
  const pinned = pinnedShellcheckVersion(runtime.readInstaller());
  if (!pinned.ok) {
    return fail(runtime, [pinned.error]);
  }
  const version = shellcheckVersion(runtime.probeVersion(), pinned.value);
  if (!version.ok) {
    return fail(runtime, [version.error]);
  }
  const scripts = runtime
    .trackedFiles()
    .filter((file) => isShellScript(file, runtime.readHead(file)));
  if (scripts.length === 0) {
    return fail(runtime, [
      'git lists no tracked shell scripts; run the gate from the repository root',
    ]);
  }
  runtime.writeLine(
    `${GATE}: shellcheck ${version.value} over ${String(scripts.length)} tracked shell scripts`,
  );
  const directives = scripts.flatMap((file) =>
    silencingDirectiveFailures(file, runtime.readText(file)),
  );
  const status = await runtime.runEnv(shellcheckArgs(scripts));
  return directives.length > 0 ? fail(runtime, directives) : status;
}

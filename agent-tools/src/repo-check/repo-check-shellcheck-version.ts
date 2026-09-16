import { err, ok, type Result } from '@engraph/result';

import type { RepoCheckCommandResult } from './repo-check-types.js';

/**
 * The shellcheck gate's version verdict. shellcheck versions differ in what
 * they report, so the gate runs only the version the installer pins: the one
 * CI and cloud sessions install, and the one a developer's shellcheck must
 * match. The pin lives once, in the installer, and is read from its text.
 *
 * @packageDocumentation
 */

/** The installer holding the pin, relative to the repository root. */
export const SHELLCHECK_INSTALLER = '.agent/setup/install-shellcheck.sh';

const PIN_LINE = /^SHELLCHECK_VERSION=(\S+)$/mu;

const VERSION_LINE = /^version:\s*(\S+)\s*$/mu;

/** The remedy for every host the installer pins an asset for. */
const INSTALL_ROUTE = `\`${SHELLCHECK_INSTALLER} <bin-dir>\` installs it; put <bin-dir> first on PATH`;

const INSTALL_HINT = `${INSTALL_ROUTE}. The gate never skips a missing linter`;

/**
 * The shellcheck version the installer pins.
 *
 * @param installerText - The installer script's text.
 * @returns The pinned version, or a failure line when no `SHELLCHECK_VERSION=` line pins one.
 */
export function pinnedShellcheckVersion(installerText: string): Result<string, string> {
  const pinned = PIN_LINE.exec(installerText)?.[1];
  return pinned === undefined
    ? err(`${SHELLCHECK_INSTALLER} has no SHELLCHECK_VERSION= line pinning a version`)
    : ok(pinned);
}

/**
 * The verdict on `shellcheck --version`: the version when the pinned
 * shellcheck ran, or the failure line when shellcheck is missing, is not
 * shellcheck, or is another version.
 *
 * @param probe - The captured `shellcheck --version` run.
 * @param pinned - The version the installer pins.
 * @returns The version, or a failure line naming the cause and the remedy.
 */
export function shellcheckVersion(
  probe: RepoCheckCommandResult,
  pinned: string,
): Result<string, string> {
  if (probe.status !== 0) {
    const ended =
      probe.status === null
        ? `killed by ${probe.signal ?? 'a signal'}`
        : `exit ${String(probe.status)}`;
    const cause = probe.stderr.trim() || ended;
    return err(`shellcheck could not run (${cause}): ${INSTALL_HINT}`);
  }
  const version = VERSION_LINE.exec(probe.stdout)?.[1];
  if (version === undefined) {
    return err(`the shellcheck on PATH printed no version line: ${INSTALL_HINT}`);
  }
  if (version !== pinned) {
    return err(
      `shellcheck ${version} is on PATH, and ${SHELLCHECK_INSTALLER} pins ${pinned}: ` +
        `${INSTALL_ROUTE}, or move the pin (its version and every digest together) and fix ` +
        'what the new version reports',
    );
  }
  return ok(version);
}

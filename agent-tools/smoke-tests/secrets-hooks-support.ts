import { execFileSync } from 'node:child_process';

/**
 * Support for the secrets hook smokes (`prompt-secrets.smoke.ts` and
 * `pretool-secrets.smoke.ts`): finding the tools a hook run needs.
 *
 * Each hook reads its payload with jq when jq is on PATH and with a sed
 * fallback otherwise, and each smoke proves both paths: its jq runs inherit
 * PATH, and its jq-less runs get a directory linking only the tools the
 * fallback needs. Without jq installed the jq runs would silently take the
 * fallback, so a smoke requires jq before it runs any case, and the
 * requirement names the remedy.
 */

/**
 * The absolute path of a tool on PATH.
 *
 * @param tool - The command name.
 * @returns Its path, as `/usr/bin/which` prints it.
 * @throws When the tool is not on PATH.
 */
export function which(tool: string): string {
  try {
    return execFileSync('/usr/bin/which', [tool], { encoding: 'utf8' }).trim();
  } catch (error) {
    throw new Error(`${tool} is not on PATH, and the smoke needs it`, { cause: error });
  }
}

/**
 * Fail unless jq is on PATH, naming why the smoke needs it and how to install it.
 *
 * @throws When jq is not on PATH.
 */
export function requireJq(): void {
  try {
    which('jq');
  } catch (error) {
    throw new Error(
      'jq is not on PATH: the smoke proves the hook with jq as well as without it, so jq ' +
        'must be installed (see the README prerequisites: brew install jq, or sudo ' +
        'apt-get install jq)',
      { cause: error },
    );
  }
}

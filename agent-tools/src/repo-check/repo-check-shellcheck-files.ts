/**
 * The shellcheck gate's pure mapping: which tracked files are shell scripts,
 * which of their comments would silence shellcheck, and the argv that lints
 * them.
 *
 * A shell script is a tracked file named `*.sh` or `*.bash`, a file directly
 * in `.husky/` (husky runs every hook there with `sh`), or one whose first line
 * is a shebang naming a shell shellcheck lints: `sh`, `bash`, `dash` or `ksh`.
 * The file names come from git (`repo-check-files.ts` carries why); the
 * contents are read from the working tree.
 *
 * Every finding fails, and nothing outside the gate's own argv decides what
 * counts as one: a `.shellcheckrc` above the checkout and a `SHELLCHECK_OPTS`
 * in the environment never reach the run, and a `disable`, `shell` or
 * `extended-analysis` directive inside a script fails the gate itself, so
 * every check and the full analysis apply to every script. A script names its
 * shell with its shebang (shellcheck also infers bash from a `.bash` name), so
 * a sourced `.sh` library and every husky hook carry one.
 *
 * @packageDocumentation
 */

const SHELL_EXTENSIONS = ['.sh', '.bash'] as const;

const HUSKY_HOOK_DIRECTORY = '.husky/';

/**
 * `#!`, optional space and an optional directory, then the shell's name ending
 * the word, either directly or as any later word of an `env` shebang: bare,
 * after a directory (never a `NAME=value` word, which runs nothing), or
 * attached to `-S` or `--split-string=`. So `#!/bin/bash`,
 * `#!/usr/bin/env -S bash -e`, `#!/usr/bin/env -S /bin/bash`,
 * `#!/usr/bin/env -u NAME bash` and `#!/usr/bin/env -Sbash` all name bash.
 *
 * Any later word counts, whatever env's options take as arguments, because
 * the two errors are not alike: a shell script the pattern missed would
 * escape the lint silently, while a shebang the pinned shellcheck cannot
 * identify (it reports `env -S /bin/bash` and `env -u NAME bash` as SC1008)
 * fails the gate loudly until the shebang names the shell plainly.
 */
const SHELL_SHEBANG =
  /^#!\s*(?:\S*\/)?(?:env(?:\s+\S+)*?\s+(?:-S|--split-string=)?(?:[^\s=]*\/)?)?(?:sh|bash|dash|ksh)(?=\s|$)/u;

/**
 * A shellcheck directive comment (`# shellcheck key=value ...`, the space
 * after `#` optional) carrying a key that narrows what shellcheck reports:
 * `disable` drops checks, `shell` replaces the dialect the file declares, and
 * `extended-analysis` turns the dataflow analysis off.
 */
const SILENCING_DIRECTIVE = /^\s*#\s*shellcheck\s(?:.*\s)?(disable|shell|extended-analysis)=/u;

/**
 * Whether a tracked file is a shell script for shellcheck to lint.
 *
 * @param file - Repo-relative path.
 * @param head - The file's opening bytes, enough to hold its first line.
 * @returns True for a `.sh` or `.bash` name, a husky hook, or a first line that is a shell shebang.
 */
export function isShellScript(file: string, head: string): boolean {
  const name = file.slice(file.lastIndexOf('/') + 1);
  if (SHELL_EXTENSIONS.some((extension) => name.endsWith(extension))) {
    return true;
  }
  if (file === `${HUSKY_HOOK_DIRECTORY}${name}`) {
    return true;
  }
  const [firstLine = ''] = head.split('\n', 1);
  return SHELL_SHEBANG.test(firstLine);
}

/**
 * The lines of a shell script whose shellcheck directive narrows what the
 * gate reports. A finding is fixed in the script; the gate has no exception
 * list.
 *
 * @param file - Repo-relative path, named in each failure.
 * @param content - The script's text.
 * @returns One failure line per silencing directive; empty when there is none.
 */
export function silencingDirectiveFailures(file: string, content: string): readonly string[] {
  return content.split('\n').flatMap((line, index) => {
    const key = SILENCING_DIRECTIVE.exec(line)?.[1];
    if (key === undefined) {
      return [];
    }
    const remedy =
      key === 'shell'
        ? 'remove the directive and add a shebang naming the shell instead'
        : 'fix the finding it hides and remove the directive';
    return [
      `${file}:${String(index + 1)}: a shellcheck ${key}= directive narrows what the gate ` +
        `reports; ${remedy}`,
    ];
  });
}

/**
 * The argv for `env` that runs the given shellcheck over exactly the given
 * files.
 *
 * `env -u SHELLCHECK_OPTS` drops the environment's options, which shellcheck
 * would otherwise prepend and a later flag could not undo (an `-e` exclusion
 * accumulates); `--norc` ignores any `.shellcheckrc`. The severity is stated,
 * so every finding, style included, fails. `--` keeps a file name from ever
 * reading as a flag.
 *
 * @param command - The shellcheck to run: a repo-relative path or a name on PATH.
 * @param files - Repo-relative shell script paths.
 * @returns Arguments for `env`.
 */
export function shellcheckArgs(command: string, files: readonly string[]): readonly string[] {
  return ['-u', 'SHELLCHECK_OPTS', command, '--norc', '--severity=style', '--', ...files];
}

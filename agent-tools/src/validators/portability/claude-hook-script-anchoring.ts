/**
 * Claude Code hook-command grammar and script-anchoring check for the portability validator.
 *
 * Claude Code runs a shell-form hook command in the session's working directory, which is not
 * always the project root, so a hook whose program or script is named relative to it fails to
 * start (exit 127) or cannot find its script, and whatever it guards silently does not run.
 *
 * The check is a closed grammar, not a shell parser: it accepts only the forms the commands in
 * `.claude/settings.json` use, with words separated by single spaces.
 * - A command is a program and its data words, or the hook-error wrapper followed by a program and
 *   its data words. The wrapper is recognised only as the first word and only as a quoted project
 *   path named `log-hook-errors.sh`; it runs `"$@"` as a child.
 * - A program is a quoted project path to an `.mjs` or `.sh` file other than the wrapper, or `node`
 *   followed by its script at a quoted project path with a path after the directory. Given the
 *   project directory itself, or nothing when the variable is unset or empty, node would read its
 *   program from stdin, which is the hook's JSON payload.
 * - A quoted project path is one double-quoted word, `"${CLAUDE_PROJECT_DIR}"` or
 *   `"${CLAUDE_PROJECT_DIR:-.}"`, optionally followed by `/` and a plain path.
 * - A data word is a plain word: letters, digits and `_./:=@%+,-` only.
 *
 * There are no leading assignments, no `env`, no interpreter but `node`, no hook run directly from a
 * file other than `.mjs` or `.sh` (`node`'s script may have any name), and no home, absolute or
 * Windows drive path, because no known hook needs one. A real hook that does widens the grammar,
 * deliberately.
 *
 * Three dependences on the working directory remain outside what a grammar over the command text
 * can close. `"${CLAUDE_PROJECT_DIR:-.}"` resolves against it when the variable is unset or empty;
 * the three PreToolUse guard commands use that form, and removing it is a fix of its own. A hook
 * script decides what its own data words mean: `run-pretooluse-guard.mjs` resolves its guard path
 * against the project directory, which this check cannot see. And `node`, like the
 * `#!/usr/bin/env` line of a hook run directly, is found through the `PATH` the hook inherits, so
 * a relative entry there is resolved from the working directory.
 */

const PLAIN_WORD = /^[\w./:=@%+,-]+$/u;
const QUOTED_PROJECT_PATH = /^"\$\{CLAUDE_PROJECT_DIR(?::-\.)?\}(?:\/[\w./-]*)?"$/u;
/** The file types the settings run directly from a quoted project path. */
const HOOK_SCRIPT = /\.(?:mjs|sh)"$/u;
/** A quoted project path that names the project directory itself, with no path after it. */
const PROJECT_DIRECTORY = /\}\/?"$/u;
/** An option or an assignment, which is not a path even when it holds a `/`. */
const OPTION_OR_ASSIGNMENT = /^-|=/u;
const INTERPRETER = 'node';
const WRAPPER_NAME = 'log-hook-errors.sh';

const UNANCHORED_SCRIPT =
  'runs a program or an interpreter\'s script that is not a quoted project path, and the working directory is not always the project root; name it by a quoted "${CLAUDE_PROJECT_DIR}/path" instead';
const OUTSIDE_GRAMMAR =
  'is outside the checked hook-command grammar (a quoted project path to an .mjs or .sh hook, or node and its script at a quoted project path, optionally after the hook-error wrapper, then plain words); rewrite it in that grammar, or widen the grammar deliberately where a real hook needs more';

/** Whether a word fits the checked word shape: a plain word, or a whole double-quoted project path. */
export function isShapedWord(word: string): boolean {
  return PLAIN_WORD.test(word) || QUOTED_PROJECT_PATH.test(word);
}

/** The program a word in the checked word shape names: no quotes, no directory, lower case, no `.exe`. */
export function programName(word: string): string {
  const unquoted = word.replaceAll('"', '');
  return unquoted
    .slice(unquoted.lastIndexOf('/') + 1)
    .toLowerCase()
    .replace(/\.exe$/u, '');
}

/** Whether a word is the hook-error wrapper named by a quoted project path. */
function isWrapper(word: string | undefined): boolean {
  return word !== undefined && QUOTED_PROJECT_PATH.test(word) && programName(word) === WRAPPER_NAME;
}

/**
 * Why the word after `node` is not its script at a quoted project path, if it is not: the project
 * directory itself, an option or nothing is outside the grammar, and any other word is a script that
 * is not a quoted project path.
 */
function scriptIssue(script: string): string | undefined {
  if (QUOTED_PROJECT_PATH.test(script)) {
    return PROJECT_DIRECTORY.test(script) ? OUTSIDE_GRAMMAR : undefined;
  }
  return script === '' || script.startsWith('-') ? OUTSIDE_GRAMMAR : UNANCHORED_SCRIPT;
}

/**
 * Why a word where a program belongs is not a hook script at a quoted project path, if it is not: a
 * word holding a `/`, other than an option or an assignment, is a program that is not a quoted
 * project path, and any other word is outside the grammar.
 */
function hookScriptIssue(program: string): string | undefined {
  if (QUOTED_PROJECT_PATH.test(program)) {
    return HOOK_SCRIPT.test(program) && !isWrapper(program) ? undefined : OUTSIDE_GRAMMAR;
  }
  return program.includes('/') && !OPTION_OR_ASSIGNMENT.test(program)
    ? UNANCHORED_SCRIPT
    : OUTSIDE_GRAMMAR;
}

/** Why the program at `position`, its script if it is `node`, or the data words after them do not fit the grammar. */
function programIssue(words: readonly string[], position: number): string | undefined {
  const program = words[position];
  if (program === undefined) {
    return OUTSIDE_GRAMMAR;
  }
  const isInterpreter = program === INTERPRETER;
  const issue = isInterpreter ? scriptIssue(words[position + 1] ?? '') : hookScriptIssue(program);
  const data = words.slice(position + (isInterpreter ? 2 : 1));
  return issue ?? (data.every((word) => PLAIN_WORD.test(word)) ? undefined : OUTSIDE_GRAMMAR);
}

/**
 * Judge a hook command against the checked grammar, reporting a program or script that is not at a
 * quoted project path apart from the rest of the grammar.
 *
 * `claudeCommandQuotingIssues` runs `projectDirCommandShapeIssue` in `claude-hook-quoting.ts` first.
 * For a command naming `CLAUDE_PROJECT_DIR` it gives its own word-shape message, and it reports a
 * shell's `-c`, `eval` or a PowerShell command string among the plain data words.
 *
 * @param command - A shell command as Claude Code passes it to the shell.
 * @returns What is wrong and what to do, phrased to follow the hook's label: a program or script
 *   not at a quoted project path, or a command outside the grammar; `undefined` when it fits.
 */
export function relativeScriptIssue(command: string): string | undefined {
  const words = command.split(' ');
  return programIssue(words, isWrapper(words[0]) ? 1 : 0);
}

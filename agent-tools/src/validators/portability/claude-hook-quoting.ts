/**
 * Claude Code command-quoting check for the portability validator.
 *
 * Claude Code runs a shell-form hook command, and the status line, through a
 * shell with `CLAUDE_PROJECT_DIR` in the environment. Outside double quotes, a
 * project path holding whitespace or glob characters does not reach the
 * command as one word, so the hook fails to start or cannot find its script,
 * and whatever it guards silently does not run.
 *
 * The check is a closed shape, not a shell parser. A command that names
 * `CLAUDE_PROJECT_DIR` must be single-space-separated words, each either a
 * plain word (no quotes, `$`, backslash, glob or shell operator) or a whole
 * double-quoted project path — `"${CLAUDE_PROJECT_DIR}"` or
 * `"${CLAUDE_PROJECT_DIR:-.}"`, optionally followed by a plain path — and it
 * must not hand the path to something that parses it again: `eval`, a POSIX
 * shell's `-c` (alone or among combined short flags), or a PowerShell
 * command-string parameter (`-Command`, `-CommandWithArgs` or
 * `-EncodedCommand`, in every spelling pwsh's command-line parser accepts).
 * Anything else is reported as outside the checked shape; widen the shape
 * deliberately when a new command needs it. A hook in the `args` form runs
 * with no shell and is not checked.
 */

import { typeSafeEntries } from '@engraph/type-helpers';
import { z } from 'zod';

const PLAIN_WORD = /^[\w./:=@%+,-]+$/u;
const QUOTED_PROJECT_PATH = /^"\$\{CLAUDE_PROJECT_DIR(?::-\.)?\}(?:\/[\w./-]*)?"$/u;
/** POSIX-style shells that run a command string given with -c; busybox dispatches to its applets. */
const POSIX_SHELLS: ReadonlySet<string> = new Set([
  'sh',
  'ash',
  'bash',
  'busybox',
  'csh',
  'dash',
  'fish',
  'ksh',
  'mksh',
  'tcsh',
  'yash',
  'zsh',
]);
const POWERSHELLS: ReadonlySet<string> = new Set(['pwsh', 'powershell']);
/** A POSIX shell's combined short flags that include `c`: `-c`, `-lc`, `-ec`. Case matters: `-C` is noclobber. */
const POSIX_COMMAND_STRING_FLAG = /^-[a-z]*c[a-z]*$/u;

/** A PowerShell parameter as pwsh's command-line parser reads it: `-`, `--` or `/`, then the name. */
const POWERSHELL_PARAMETER = /^(?:--?|\/)([a-z]+)$/iu;
/** Command-string parameters pwsh matches from any prefix: `-c`, `-Co`, `-e`, `-enc`. */
const POWERSHELL_PREFIXED_COMMAND_PARAMETERS: readonly string[] = ['command', 'encodedcommand'];
/** Command-string parameters and aliases pwsh matches only in full. */
const POWERSHELL_EXACT_COMMAND_PARAMETERS: ReadonlySet<string> = new Set([
  'commandwithargs',
  'cwa',
  'ec',
]);

/**
 * Whether a PowerShell argument hands pwsh a command string, in any case: a prefix of `Command` or
 * `EncodedCommand`, or `CommandWithArgs`, `cwa` or `ec` in full. `-File`, `-ExecutionPolicy` and
 * `-ConfigurationFile` do not.
 */
function isPowerShellCommandParameter(word: string): boolean {
  const name = POWERSHELL_PARAMETER.exec(word)?.[1]?.toLowerCase();
  return (
    name !== undefined &&
    (POWERSHELL_EXACT_COMMAND_PARAMETERS.has(name) ||
      POWERSHELL_PREFIXED_COMMAND_PARAMETERS.some((parameter) => parameter.startsWith(name)))
  );
}

const WORD_OUTSIDE_SHAPE = 'a word is neither a plain word nor a double-quoted project path';
const UNANCHORED_SCRIPT =
  "a program or an interpreter's script is not at an anchored path, and the working directory is not always the project root";
/** Anchored whatever the working directory: the project directory, home, or an absolute POSIX or Windows drive path. */
const ANCHORED_WORD = /^"?(?:\/|~|\$\{?CLAUDE_PROJECT_DIR|[a-z]:[\\/])/iu;

/** Programs whose first argument names the script they run. */
const INTERPRETERS: ReadonlySet<string> = new Set([
  'node',
  'bash',
  'sh',
  'zsh',
  'python',
  'python3',
  'tsx',
  'deno',
  'bun',
]);
const PARSED_AGAIN = 'a shell command string or eval parses the path again';

const commandHolderSchema = z.object({
  command: z.string().optional(),
  args: z.array(z.string()).optional(),
});

/** The parts of `.claude/settings.json` that carry shell commands. */
const commandSettingsSchema = z.object({
  hooks: z
    .record(z.string(), z.array(z.object({ hooks: z.array(commandHolderSchema).optional() })))
    .optional(),
  statusLine: commandHolderSchema.optional(),
});

type CommandSettings = z.infer<typeof commandSettingsSchema>;
type CommandHolder = z.infer<typeof commandHolderSchema>;

/** A shell-form command and where it sits in the settings, for the issue message. */
interface LabelledCommand {
  readonly label: string;
  readonly command: string;
}

/** The program a word names: no surrounding quotes, no POSIX or Windows directory, lower case, no `.exe`. */
function programName(word: string): string {
  const unquoted = word.replaceAll('"', '');
  return unquoted
    .slice(Math.max(unquoted.lastIndexOf('/'), unquoted.lastIndexOf('\\')) + 1)
    .toLowerCase()
    .replace(/\.exe$/u, '');
}

function hasLater(
  words: readonly string[],
  index: number,
  test: (word: string) => boolean,
): boolean {
  return words.slice(index + 1).some(test);
}

function parsesAgain(words: readonly string[]): boolean {
  return words.some((word, index) => {
    const name = programName(word);
    return (
      name === 'eval' ||
      (POSIX_SHELLS.has(name) &&
        hasLater(words, index, (later) => POSIX_COMMAND_STRING_FLAG.test(later))) ||
      (POWERSHELLS.has(name) && hasLater(words, index, isPowerShellCommandParameter))
    );
  });
}

/**
 * Judge a shell command that may name `CLAUDE_PROJECT_DIR` against the checked shape.
 *
 * @param command - A shell command as Claude Code passes it to the shell.
 * @returns Why the command is outside the checked shape, or `undefined` when it
 *   never names `CLAUDE_PROJECT_DIR` or fits the shape.
 */
export function projectDirCommandShapeIssue(command: string): string | undefined {
  if (!command.includes('CLAUDE_PROJECT_DIR')) {
    return undefined;
  }
  const words = command.split(' ');
  if (!words.every((word) => PLAIN_WORD.test(word) || QUOTED_PROJECT_PATH.test(word))) {
    return WORD_OUTSIDE_SHAPE;
  }
  return parsesAgain(words) ? PARSED_AGAIN : undefined;
}

/** A program word the shell resolves against the working directory: a POSIX or Windows path with no anchor. */
function isUnanchoredPath(word: string): boolean {
  return /[\\/]/u.test(word) && !ANCHORED_WORD.test(word);
}

/**
 * Judge whether a command runs a program or script that depends on the working directory.
 *
 * Claude Code runs a hook in the session's working directory, not always the project root, so
 * such a hook fails to start (exit 127) or cannot find its script. A closed shape, not a parser
 * of interpreter options: a program named by a path is anchored, and every interpreter, at any
 * position (a wrapper may run one), is followed directly by its anchored script. An option or a
 * bare file name after an interpreter is reported; widen the shape deliberately when a hook needs one.
 *
 * @param command - A shell command as Claude Code passes it to the shell.
 * @returns Why the program or an interpreter's script is not anchored, or `undefined` when it fits.
 */
export function relativeScriptIssue(command: string): string | undefined {
  const words = command.split(' ');
  const unanchored =
    isUnanchoredPath(words[0] ?? '') ||
    words.some(
      (word, index) =>
        INTERPRETERS.has(programName(word)) && !ANCHORED_WORD.test(words[index + 1] ?? ''),
    );
  return unanchored ? UNANCHORED_SCRIPT : undefined;
}

/** A hook's command when a shell runs it; the `args` form runs with no shell. */
function shellCommand(holder: CommandHolder): string | undefined {
  return holder.args === undefined ? holder.command : undefined;
}

function labelledCommands(settings: CommandSettings): readonly LabelledCommand[] {
  const hookCommands = typeSafeEntries(settings.hooks ?? {}).flatMap(([event, matchers]) =>
    matchers.flatMap((matcher, matcherIndex) =>
      (matcher.hooks ?? []).flatMap((hook, hookIndex) => {
        const command = shellCommand(hook);
        return command === undefined
          ? []
          : [{ label: `hooks.${event}[${matcherIndex}].hooks[${hookIndex}]`, command }];
      }),
    ),
  );
  const statusLine =
    settings.statusLine === undefined ? undefined : shellCommand(settings.statusLine);
  return statusLine === undefined
    ? hookCommands
    : [...hookCommands, { label: 'statusLine', command: statusLine }];
}

/**
 * Report every shell-form hook or status-line command that names `CLAUDE_PROJECT_DIR` outside the checked shape.
 *
 * @param claudeSettings - The parsed `.claude/settings.json`.
 * @param settingsPath - The settings file's path, for the issue messages.
 * @returns One issue per command outside the quoting shape, else per command whose script is
 *   not anchored; a single issue when the hooks or status line do not have the shape Claude Code
 *   reads; empty when every command fits.
 */
export function claudeCommandQuotingIssues(
  claudeSettings: unknown,
  settingsPath: string,
): readonly string[] {
  const settings = commandSettingsSchema.safeParse(claudeSettings);
  if (!settings.success) {
    return [
      `${settingsPath}: hooks or statusLine do not have the shape Claude Code reads, so their commands could not be checked for quoting`,
    ];
  }
  return labelledCommands(settings.data).flatMap(({ label, command }) => {
    const shapeIssue = projectDirCommandShapeIssue(command);
    const scriptIssue = shapeIssue === undefined ? relativeScriptIssue(command) : undefined;
    return [
      ...(shapeIssue === undefined
        ? []
        : [
            `${settingsPath}: ${label} names CLAUDE_PROJECT_DIR outside the checked shape (${shapeIssue}), so a project path holding whitespace or glob characters may not reach the command as one word: ${command}`,
          ]),
      ...(scriptIssue === undefined
        ? []
        : [
            `${settingsPath}: ${label} runs a script whose path is unreliable (${scriptIssue}); anchor it at "\${CLAUDE_PROJECT_DIR}": ${command}`,
          ]),
    ];
  });
}

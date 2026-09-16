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
 * must not hand the path to `eval` or a shell's `-c`, which would parse it
 * again. Anything else is reported as outside the checked shape; widen the
 * shape deliberately when a new command needs it. A hook in the `args` form
 * runs with no shell and is not checked; PowerShell hooks are out of scope.
 */

import { typeSafeEntries } from '@engraph/type-helpers';
import { z } from 'zod';

const PLAIN_WORD = /^[\w./:=@%+,-]+$/u;
const QUOTED_PROJECT_PATH = /^"\$\{CLAUDE_PROJECT_DIR(?::-\.)?\}(?:\/[\w./-]*)?"$/u;
const SHELLS: ReadonlySet<string> = new Set(['sh', 'bash', 'zsh', 'dash', 'ksh']);
const COMMAND_STRING_FLAG = /^-[A-Za-z]*c[A-Za-z]*$/u;

const WORD_OUTSIDE_SHAPE = 'a word is neither a plain word nor a double-quoted project path';
const PARSED_AGAIN = 'a shell -c or eval parses the path again';

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

function programName(word: string): string {
  return word.slice(word.lastIndexOf('/') + 1);
}

function parsesAgain(words: readonly string[]): boolean {
  return words.some((word, index) => {
    const name = programName(word);
    return (
      name === 'eval' ||
      (SHELLS.has(name) && words.slice(index + 1).some((later) => COMMAND_STRING_FLAG.test(later)))
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
 * @returns One issue per command outside the shape, or a single issue when the
 *   hooks or status line do not have the shape Claude Code reads; empty when
 *   every command fits.
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
    const issue = projectDirCommandShapeIssue(command);
    return issue === undefined
      ? []
      : [
          `${settingsPath}: ${label} names CLAUDE_PROJECT_DIR outside the checked shape (${issue}), so a project path holding whitespace or glob characters may not reach the command as one word: ${command}`,
        ];
  });
}

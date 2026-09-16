/**
 * Shared core for the smokes that run a Claude Code hook exactly as `.claude/settings.json`
 * registers it: read the hook's command, then run it through the shell from this repository's
 * root against a throwaway `CLAUDE_PROJECT_DIR`.
 *
 * Each `${CLAUDE_PROJECT_DIR}` in the command becomes `${CLAUDE_HOOK_SMOKE_REPO_ROOT}`, which
 * holds this repository's root, so the real hook scripts run, while `CLAUDE_PROJECT_DIR` itself
 * points at the throwaway directory, so everything the hook reads or writes under the project
 * directory is the smoke's own. Both paths travel in the environment and are read as data, as
 * the harness supplies them for a shell-form hook, so the command text never carries a path,
 * whatever characters the checkout path holds.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

/** This repository's root: the directory the hook commands run from. */
export const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

const PROJECT_DIR_REFERENCE = /\$\{CLAUDE_PROJECT_DIR\}/gu;
const REPO_ROOT_VARIABLE = 'CLAUDE_HOOK_SMOKE_REPO_ROOT';
const REPO_ROOT_REFERENCE = `\${${REPO_ROOT_VARIABLE}}`;

const settingsSchema = z.object({
  hooks: z.record(
    z.string(),
    z.array(z.object({ hooks: z.array(z.object({ command: z.string() })) })),
  ),
});

/**
 * The command of the first hook registered for `event` whose command contains `name`.
 *
 * @param event - The hook event, such as `SessionStart` or `PreCompact`.
 * @param name - Text that identifies the hook within its command, such as its script name.
 * @returns The command, or `undefined` when no such hook is registered.
 */
export function readHookCommand(event: string, name: string): string | undefined {
  const settings = settingsSchema.safeParse(
    JSON.parse(readFileSync(join(repoRoot, '.claude', 'settings.json'), 'utf8')),
  );
  if (!settings.success) {
    return undefined;
  }
  return (settings.data.hooks[event] ?? [])
    .flatMap((entry) => entry.hooks)
    .map((hook) => hook.command)
    .find((command) => command.includes(name));
}

/** The hook's stdin: text the harness writes, or a descriptor the hook inherits. */
export type HookStdin = { readonly input: string } | { readonly stdio: [number, 'pipe', 'pipe'] };

/** How to run one hook command. */
export interface HookRun {
  /** The throwaway directory the hook sees as `CLAUDE_PROJECT_DIR`. */
  readonly projectDir: string;
  /** The hook's stdin; none by default. */
  readonly stdin?: HookStdin;
  /** The bound on the hook's run, as the harness bounds it. */
  readonly timeoutMs: number;
}

/**
 * Run a hook command through the shell as the harness does, and return its stdout.
 *
 * @param command - The command as registered in `.claude/settings.json`.
 * @param run - The throwaway project directory, stdin and time bound.
 * @returns The hook's stdout.
 * @throws When the hook exits non-zero, is killed, or cannot run, naming how it ended and
 * carrying its stderr.
 */
export function runHookCommand(command: string, run: HookRun): string {
  const result = spawnSync(
    'sh',
    ['-c', command.replaceAll(PROJECT_DIR_REFERENCE, () => REPO_ROOT_REFERENCE)],
    {
      cwd: repoRoot,
      env: { ...process.env, CLAUDE_PROJECT_DIR: run.projectDir, [REPO_ROOT_VARIABLE]: repoRoot },
      ...run.stdin,
      encoding: 'utf8',
      timeout: run.timeoutMs,
    },
  );
  if (result.status !== 0) {
    throw new Error(
      `hook exited ${result.status ?? `on ${result.signal ?? 'an error'}`}\n${result.stderr}`,
    );
  }
  return result.stdout;
}

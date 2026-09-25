/**
 * Shared core for the smokes that run a Claude Code hook as the harness runs it: the one
 * command `.claude/settings.json` registers, run unchanged through `/bin/sh -c` from a
 * throwaway project that `CLAUDE_PROJECT_DIR` names.
 *
 * The project's name holds a space, so an unquoted `${CLAUDE_PROJECT_DIR}` in a registered
 * command splits and the run fails. Each case names the repository paths the project links
 * (such as `.claude/hooks` or `agent-tools`), so the registered text reaches the real hook
 * scripts; everything else in the project, its logs directory among them, is the case's own.
 * The environment holds only `CLAUDE_PROJECT_DIR` and `PATH`. `PATH` is a scratch `bin/`
 * linking the running Node and the host's `bash` (the one the harness would resolve; the
 * hook wrapper's bash 5.2 floor rules out the older bash some trusted directories hold),
 * then the trusted shell directories, so nothing else on the ambient `PATH` can shadow what
 * the hook runs.
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import { which } from './secrets-hooks-support.js';
import { trustedShellPath } from './trusted-shell-directories.js';

/** This repository's root: where the linked hook scripts and sources live. */
export const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

/** The throwaway project's scratch `bin/`: the running Node and the host's `bash`. */
const SCRATCH_BIN = 'bin';

const settingsSchema = z.object({
  hooks: z.record(
    z.string(),
    z.array(z.object({ hooks: z.array(z.object({ command: z.string() })) })),
  ),
});

/**
 * The one command registered for `event` whose text contains `name`.
 *
 * @param event - The hook event, such as `SessionStart` or `PreCompact`.
 * @param name - Text that identifies the hook within its command, such as its script name.
 * @returns The command as registered.
 * @throws When no command, or more than one, matches.
 */
export function registeredHookCommand(event: string, name: string): string {
  const settings = settingsSchema.parse(
    JSON.parse(readFileSync(join(repoRoot, '.claude', 'settings.json'), 'utf8')),
  );
  const commands = (settings.hooks[event] ?? [])
    .flatMap((entry) => entry.hooks)
    .map((hook) => hook.command)
    .filter((command) => command.includes(name));
  const [command] = commands;
  if (commands.length !== 1 || command === undefined) {
    throw new Error(
      `expected exactly one ${event} ${name} command in .claude/settings.json, found ${String(commands.length)}`,
    );
  }
  return command;
}

/**
 * Run the case in a fresh throwaway project, then remove it.
 *
 * @param links - Repository paths, relative to the root, the project links to.
 * @param run - The case, given the project's path.
 */
export function inThrowawayProject(
  links: readonly string[],
  run: (projectDir: string) => void,
): void {
  const projectDir = mkdtempSync(join(tmpdir(), 'claude-hook smoke '));
  try {
    for (const link of links) {
      mkdirSync(dirname(join(projectDir, link)), { recursive: true });
      symlinkSync(join(repoRoot, link), join(projectDir, link));
    }
    mkdirSync(join(projectDir, SCRATCH_BIN));
    symlinkSync(process.execPath, join(projectDir, SCRATCH_BIN, 'node'));
    symlinkSync(which('bash'), join(projectDir, SCRATCH_BIN, 'bash'));
    run(projectDir);
  } finally {
    // rmSync unlinks each symlink and never follows it, so the linked paths stay.
    rmSync(projectDir, { recursive: true, force: true });
  }
}

/** The hook's stdin: text the harness writes, or a descriptor the hook inherits. */
export type HookStdin = { readonly input: string } | { readonly stdio: [number, 'pipe', 'pipe'] };

/** How to run one hook command. */
export interface HookRun {
  /** The throwaway project the hook sees as `CLAUDE_PROJECT_DIR`, from `inThrowawayProject`. */
  readonly projectDir: string;
  /** The hook's stdin; none by default. */
  readonly stdin?: HookStdin;
  /** The bound on the hook's run, as the harness bounds it. */
  readonly timeoutMs: number;
}

/**
 * Run a registered hook command through `/bin/sh -c`, as the harness does, and return its
 * stdout.
 *
 * @param command - The command as registered in `.claude/settings.json`, unchanged.
 * @param run - The throwaway project, stdin and time bound.
 * @returns The hook's stdout.
 * @throws When the hook exits non-zero, is killed, or cannot run, naming how it ended and
 * carrying its stderr.
 */
export function runHookCommand(command: string, run: HookRun): string {
  const result = spawnSync('/bin/sh', ['-c', command], {
    cwd: run.projectDir,
    env: {
      CLAUDE_PROJECT_DIR: run.projectDir,
      PATH: [join(run.projectDir, SCRATCH_BIN), trustedShellPath()].join(delimiter),
    },
    ...run.stdin,
    encoding: 'utf8',
    // Room for a hook answer carrying a large report, well past spawnSync's 1 MiB default.
    maxBuffer: 16 * 1024 * 1024,
    timeout: run.timeoutMs,
  });
  if (result.status !== 0) {
    throw new Error(
      `hook exited ${result.status ?? `on ${result.signal ?? 'an error'}`}\n${result.stderr}`,
    );
  }
  return result.stdout;
}

/**
 * Shared core for the smokes that run a Claude Code hook as the harness runs it: the one
 * command `.claude/settings.json` registers, run unchanged through `sh -c` (`/bin/sh` on POSIX
 * hosts, Git for Windows' `sh` on win32) from a throwaway project that `CLAUDE_PROJECT_DIR`
 * names.
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
import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import { trustedShellPath } from './trusted-shell-directories.js';

/** This repository's root: where the linked hook scripts and sources live. */
export const repoRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '..', '..');

/** The throwaway project's scratch `bin/`: the running Node and the host's `bash`. */
const SCRATCH_BIN = 'bin';

/** The shell's status for a command it cannot find, as an unquoted spaced path produces. */
const COMMAND_NOT_FOUND = 127;

/**
 * The first `tool` in the directories of a `PATH` value, found by Node rather than by a
 * `which` binary, so the lookup is the same on every platform.
 *
 * @throws When no directory holds the tool.
 */
function findOnPath(tool: string, searchPath: string): string {
  const names = process.platform === 'win32' ? [`${tool}.exe`, tool] : [tool];
  const found = searchPath
    .split(delimiter)
    .flatMap((directory) => names.map((name) => join(directory, name)))
    .find((candidate) => existsSync(candidate));
  if (found === undefined) {
    throw new Error(`${tool} is not on PATH, and the hook smokes need it`);
  }
  return found;
}

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
    symlinkSync(findOnPath('bash', process.env.PATH ?? ''), join(projectDir, SCRATCH_BIN, 'bash'));
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

/** Run a command through `sh -c`: `/bin/sh` on POSIX hosts, the bounded `PATH`'s on win32. */
function spawnHook(command: string, run: HookRun): SpawnSyncReturns<string> {
  const searchPath = [join(run.projectDir, SCRATCH_BIN), trustedShellPath()].join(delimiter);
  const shell = process.platform === 'win32' ? findOnPath('sh', searchPath) : '/bin/sh';
  return spawnSync(shell, ['-c', command], {
    cwd: run.projectDir,
    env: { CLAUDE_PROJECT_DIR: run.projectDir, PATH: searchPath },
    ...run.stdin,
    encoding: 'utf8',
    // Room for a hook answer carrying a large report, well past spawnSync's 1 MiB default.
    maxBuffer: 16 * 1024 * 1024,
    timeout: run.timeoutMs,
  });
}

/**
 * Run a registered hook command through the shell, as the harness does, and return its
 * stdout.
 *
 * @param command - The command as registered in `.claude/settings.json`, unchanged.
 * @param run - The throwaway project, stdin and time bound.
 * @returns The hook's stdout.
 * @throws When the hook exits non-zero, is killed, or cannot run, naming how it ended and
 * carrying its stderr.
 */
export function runHookCommand(command: string, run: HookRun): string {
  const result = spawnHook(command, run);
  if (result.status !== 0) {
    throw new Error(
      `hook exited ${result.status ?? `on ${result.signal ?? 'an error'}`}\n${result.stderr}`,
    );
  }
  return result.stdout;
}

/**
 * Prove the fixture runs the registered text from a project whose path holds a space: the
 * same command with its quotes removed must end with the shell's command-not-found status,
 * because the unquoted project path splits. A fixture that rewrote the path, or ran from a
 * path without a space, would let it run.
 *
 * @param command - The command as registered, quoted.
 * @param links - The repository paths the hook's project links, as its smoke gives them.
 * @param timeoutMs - The bound on the run.
 * @throws When the unquoted command ends any other way.
 */
export function proveUnquotedPathSplits(
  command: string,
  links: readonly string[],
  timeoutMs: number,
): void {
  inThrowawayProject(links, (projectDir) => {
    const result = spawnHook(command.replaceAll('"', ''), { projectDir, timeoutMs });
    if (result.status !== COMMAND_NOT_FOUND) {
      throw new Error(
        `the command with its quotes removed should fail with ${String(COMMAND_NOT_FOUND)}, ` +
          `ended ${String(result.status ?? result.signal)}\n${result.stderr}`,
      );
    }
  });
}

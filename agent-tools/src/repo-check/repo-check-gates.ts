import { writeLine } from '../core/terminal-output.js';

import {
  markdownOnly,
  markdownlintArgs,
  parseNulSeparatedPaths,
  parseSymlinkPaths,
  prettierArgs,
  withoutSymlinks,
  type MarkdownlintMode,
  type PrettierMode,
} from './repo-check-files.js';
import { defaultRuntime } from './repo-check-runtime.js';
import type { RepoCheckRuntime } from './repo-check-types.js';

/**
 * The format and markdown gates: the process edge that asks git for the file
 * universe and runs each tool over it.
 *
 * Two universes, both git's: the staged set for the pre-commit hook and the
 * tracked tree for the root gates. Neither walks the disk, so the gate reads
 * the same on every checkout and in CI (`repo-check-files.ts` carries the
 * reasoning and the pure mapping this module composes).
 *
 * @packageDocumentation
 */

/** Ask git for a NUL-separated path list, failing loudly when git does. */
function gitPaths(
  runtime: RepoCheckRuntime,
  args: readonly string[],
  what: string,
): readonly string[] {
  const result = runtime.runCaptured('git', [...args, '-z']);
  if ((result.status ?? 1) !== 0) {
    throw new Error(
      result.stderr.trim() || `git ${args[0] ?? ''} failed while discovering ${what}`,
    );
  }
  return parseNulSeparatedPaths(result.stdout);
}

/**
 * Repo-relative paths of index entries that are symbolic links (mode 120000,
 * e.g. the .claude/skills adapters pointing at .agents/skills external-skill
 * content). They carry no formattable content of their own: the linked target
 * is checked under its real path, and prettier refuses symlink paths outright.
 */
function indexSymlinkPaths(runtime: RepoCheckRuntime): ReadonlySet<string> {
  const result = runtime.runCaptured('git', ['ls-files', '--cached', '-s', '-z']);
  if ((result.status ?? 1) !== 0) {
    return new Set();
  }
  return parseSymlinkPaths(result.stdout);
}

/** The files staged for the next commit (added, copied, modified, renamed). */
function stagedFiles(runtime: RepoCheckRuntime): readonly string[] {
  const names = gitPaths(
    runtime,
    ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
    'staged files',
  );
  return withoutSymlinks(names, indexSymlinkPaths(runtime));
}

/**
 * Every tracked file: the repository's own answer to "what exists here", the
 * same on every checkout and in CI. A disk walk would instead lint whatever
 * this machine happens to carry (a generated read model, an editor's workspace
 * file) and prove the machine, not the repository.
 */
function trackedFiles(runtime: RepoCheckRuntime): readonly string[] {
  const names = gitPaths(runtime, ['ls-files'], 'tracked files');
  return withoutSymlinks(names, indexSymlinkPaths(runtime));
}

async function runMarkdownlintOver(
  runtime: RepoCheckRuntime,
  files: readonly string[],
  mode: MarkdownlintMode,
  label: string,
): Promise<number> {
  const markdown = markdownOnly(files);
  if (markdown.length === 0) {
    writeLine(`repo-check ${label}: no Markdown files`);
    return 0;
  }
  return runtime.runInherited('pnpm', markdownlintArgs(mode, markdown));
}

async function runPrettierOver(
  runtime: RepoCheckRuntime,
  files: readonly string[],
  mode: PrettierMode,
  label: string,
): Promise<number> {
  if (files.length === 0) {
    writeLine(`repo-check ${label}: no files`);
    return 0;
  }
  return runtime.runInherited('pnpm', prettierArgs(mode, files));
}

/** markdownlint over the staged Markdown files (the pre-commit hook). */
export async function runMarkdownlintStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  return runMarkdownlintOver(runtime, stagedFiles(runtime), 'check', 'markdownlint-staged');
}

/** markdownlint over every tracked Markdown file (the root gate and its repair). */
export async function runMarkdownlintTracked(
  mode: MarkdownlintMode,
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  return runMarkdownlintOver(runtime, trackedFiles(runtime), mode, 'markdownlint-tracked');
}

/** prettier over the staged files (the pre-commit hook). */
export async function runPrettierStaged(
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  return runPrettierOver(runtime, stagedFiles(runtime), 'check', 'prettier-staged');
}

/** prettier over every tracked file (the root gate and its repair). */
export async function runPrettierTracked(
  mode: PrettierMode,
  runtime: RepoCheckRuntime = defaultRuntime,
): Promise<number> {
  return runPrettierOver(runtime, trackedFiles(runtime), mode, 'prettier-tracked');
}

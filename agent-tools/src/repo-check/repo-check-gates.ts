import { writeLine } from '../core/terminal-output.js';

import {
  markdownOnly,
  markdownlintArgs,
  prettierArgs,
  type MarkdownlintMode,
  type PrettierMode,
} from './repo-check-files.js';
import { defaultRuntime } from './repo-check-runtime.js';
import type { RepoCheckRuntime } from './repo-check-types.js';
import { stagedFiles, trackedFiles } from './repo-check-universe.js';

/**
 * The format and markdown gates: the process edge that runs each tool over
 * git's file universe (`repo-check-universe.ts`), the staged set for the
 * pre-commit hook and the tracked tree for the root gates.
 *
 * @packageDocumentation
 */

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

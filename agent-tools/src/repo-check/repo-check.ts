#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { writeErrorLine } from '../core/terminal-output.js';

export type {
  RepoCheckCommandResult,
  RepoCheckRuntime,
  CheckProfileFailurePhase,
  PostTurboGateStatus,
  CheckProfileEnvironmentEvidence,
  CheckProfileArtifact,
} from './repo-check-profile.js';

export {
  collectProfileEnvironmentEvidence,
  classifyCheckFailurePhase,
  profilePostTurboGateStatus,
  buildCheckProfileArtifact,
  defaultRuntime,
} from './repo-check-profile.js';

export {
  runMarkdownlintStaged,
  runMarkdownlintTracked,
  runPrettierStaged,
  runPrettierTracked,
} from './repo-check-gates.js';

import {
  runMarkdownlintStaged,
  runMarkdownlintTracked,
  runPrettierStaged,
  runPrettierTracked,
} from './repo-check-gates.js';
import { runKnipGate } from './repo-check-knip.js';
import { runProfile } from './repo-check-runner.js';

export { runKnipGate } from './repo-check-knip.js';

function usage(): string {
  return [
    'Usage: pnpm agent-tools:repo-check <command>',
    '',
    'Commands:',
    '  knip-gate              Run knip; fail loudly when a crash is swallowed behind exit 0 (F-147).',
    '  markdownlint-staged    Run markdownlint on staged Markdown files only.',
    '  markdownlint-tracked [--fix]',
    '                         Run markdownlint on every tracked Markdown file (the root gate).',
    '  prettier-staged        Run Prettier on staged files only.',
    '  prettier-tracked [--write]',
    '                         Run Prettier on every tracked file (the root gate).',
    '  profile [--dry-run] [--capture-output]',
    '                         Capture the pnpm check Turbo graph and, unless dry-run is set, time pnpm check.',
    '                         --capture-output stores pnpm check stdout/stderr beside the profile artifact.',
  ].join('\n');
}

type RepoCheckCommand = (args: readonly string[]) => Promise<number>;

/** The command table: a Map, so a prototype key can never resolve to a non-command. */
const COMMANDS: ReadonlyMap<string, RepoCheckCommand> = new Map<string, RepoCheckCommand>([
  ['knip-gate', () => runKnipGate()],
  ['markdownlint-staged', () => runMarkdownlintStaged()],
  [
    'markdownlint-tracked',
    (args) => runMarkdownlintTracked(args.includes('--fix') ? 'fix' : 'check'),
  ],
  ['prettier-staged', () => runPrettierStaged()],
  ['prettier-tracked', (args) => runPrettierTracked(args.includes('--write') ? 'write' : 'check')],
  ['profile', (args) => runProfile(args)],
]);

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);
  const run = command === undefined ? undefined : COMMANDS.get(command);
  if (run === undefined) {
    writeErrorLine(usage());
    process.exitCode = 1;
    return;
  }
  // process.exitCode, never process.exit(): exit() can terminate before
  // piped stdout/stderr flush, truncating the captured output a gate
  // promises to re-emit.
  process.exitCode = await run(args);
}

function isCliEntryPoint(): boolean {
  const entryPoint = process.argv[1];
  if (entryPoint === undefined) {
    return false;
  }
  return import.meta.url === pathToFileURL(path.resolve(entryPoint)).href;
}

if (isCliEntryPoint()) {
  await main();
}

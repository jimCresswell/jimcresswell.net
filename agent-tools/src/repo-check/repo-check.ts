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

interface RepoCheckCommand {
  /** The flags the command understands; anything else is rejected with usage. */
  readonly flags: ReadonlySet<string>;
  readonly run: (args: readonly string[]) => Promise<number>;
}

const NO_FLAGS: ReadonlySet<string> = new Set();

/** The command table: a Map, so a prototype key can never resolve to a non-command. */
const COMMANDS: ReadonlyMap<string, RepoCheckCommand> = new Map<string, RepoCheckCommand>([
  ['knip-gate', { flags: NO_FLAGS, run: () => runKnipGate() }],
  ['markdownlint-staged', { flags: NO_FLAGS, run: () => runMarkdownlintStaged() }],
  [
    'markdownlint-tracked',
    {
      flags: new Set(['--fix']),
      run: (args) => runMarkdownlintTracked(args.includes('--fix') ? 'fix' : 'check'),
    },
  ],
  ['prettier-staged', { flags: NO_FLAGS, run: () => runPrettierStaged() }],
  [
    'prettier-tracked',
    {
      flags: new Set(['--write']),
      run: (args) => runPrettierTracked(args.includes('--write') ? 'write' : 'check'),
    },
  ],
  // profile owns its own argv parsing (--dry-run, --capture-output).
  [
    'profile',
    { flags: new Set(['--dry-run', '--capture-output']), run: (args) => runProfile(args) },
  ],
]);

/**
 * Resolve argv to a command and its checked arguments, or a usage failure.
 * An unrecognised flag is refused rather than ignored: a mistyped repair
 * flag (`--fxi`) must not run the read-only check and report green.
 */
function resolveCommand(
  argv: readonly string[],
): { readonly run: RepoCheckCommand['run']; readonly args: readonly string[] } | undefined {
  const [name, ...args] = argv;
  const command = name === undefined ? undefined : COMMANDS.get(name);
  if (command === undefined || args.some((arg) => !command.flags.has(arg))) {
    return undefined;
  }
  return { run: command.run, args };
}

async function main(): Promise<void> {
  const resolved = resolveCommand(process.argv.slice(2));
  if (resolved === undefined) {
    writeErrorLine(usage());
    process.exitCode = 1;
    return;
  }
  // process.exitCode, never process.exit(): exit() can terminate before
  // piped stdout/stderr flush, truncating the captured output a gate
  // promises to re-emit.
  process.exitCode = await resolved.run(resolved.args);
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

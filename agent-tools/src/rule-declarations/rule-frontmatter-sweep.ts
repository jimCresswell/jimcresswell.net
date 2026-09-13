#!/usr/bin/env node

/**
 * Sweep entry point: mint every canonical rule's frontmatter from the hand-kept sources.
 *
 * ```sh
 * pnpm --filter @engraph/agent-tools rule-frontmatter-sweep           # dry run: report only
 * pnpm --filter @engraph/agent-tools rule-frontmatter-sweep --write   # write the blocks
 * ```
 *
 * The rules swept are the tracked files under `.agent/rules/` (the tracked tree is the
 * universe, never the disk). The reconciliation report on stdout is the table the landing
 * pull request carries. Exit 0 when the sweep completed, 1 when it refused, 2 on bad usage.
 */

import path from 'node:path';
import { argv, stderr, stdout } from 'node:process';

import { listTrackedFiles } from '../core/tracked-file-scan.js';
import { resolveRepoRoot } from '../core/repo-root.js';

import { renderReconciliationReport } from './render-reconciliation-report.js';
import { sweepRuleFrontmatter } from './sweep-rule-frontmatter.js';

const USAGE = [
  'Usage: rule-frontmatter-sweep [--write]',
  '  --write  write the derived frontmatter into each rule; without it, report only',
  '  --help   show this usage',
].join('\n');

const RULES_DIR = '.agent/rules/';

type Flags =
  | { readonly kind: 'run'; readonly write: boolean }
  | { readonly kind: 'help' }
  | { readonly kind: 'error'; readonly message: string };

function parseFlags(args: readonly string[]): Flags {
  let write = false;
  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      return { kind: 'help' };
    }
    if (arg === '--write') {
      write = true;
      continue;
    }
    return { kind: 'error', message: `unrecognised argument: ${arg}` };
  }
  return { kind: 'run', write };
}

function trackedRuleNames(repoRoot: string): readonly string[] {
  return listTrackedFiles(repoRoot)
    .filter((file) => file.startsWith(RULES_DIR) && file.endsWith('.md'))
    .filter((file) => !file.slice(RULES_DIR.length).includes('/'))
    .map((file) => path.basename(file, '.md'));
}

async function main(): Promise<number> {
  const flags = parseFlags(argv.slice(2));
  if (flags.kind === 'help') {
    stdout.write(`${USAGE}\n`);
    return 0;
  }
  if (flags.kind === 'error') {
    stderr.write(`ERROR — ${flags.message}\n${USAGE}\n`);
    return 2;
  }
  // projectDir is explicitly disabled: this tool derives from and writes into the tree it
  // runs inside. The CLAUDE_PROJECT_DIR leg would rebind a worktree invocation to the
  // primary checkout and silently sweep the wrong estate.
  const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
  const ruleNames = trackedRuleNames(repoRoot);
  const outcome = await sweepRuleFrontmatter({ repoRoot, ruleNames, write: flags.write });
  if (outcome.refused.length > 0) {
    stderr.write(`Sweep refused; nothing written (${String(outcome.refused.length)} reasons):\n`);
    for (const reason of outcome.refused) {
      stderr.write(`- ${reason}\n`);
    }
    return 1;
  }
  if (outcome.declarations.length > 0) {
    stdout.write(renderReconciliationReport(outcome.reconciliations));
  } else {
    stdout.write('Nothing derived: every rule already carries its declaration.\n');
  }
  stdout.write(
    `\n${String(outcome.declarations.length)} rule declarations derived, ` +
      `${String(outcome.reconciliations.length)} reconciliations, ` +
      `${String(outcome.alreadyDeclared.length)} rules already declared, ` +
      `${String(outcome.written.length)} files written${flags.write ? '' : ' (dry run)'}.\n`,
  );
  return 0;
}

// Set the exit code and let the event loop drain stdout: `process.exit` can truncate piped
// output, and the reconciliation report is meant to be piped into a pull request body.
try {
  process.exitCode = await main();
} catch (error: unknown) {
  stderr.write(`rule-frontmatter-sweep failed: ${String(error)}\n`);
  process.exitCode = 1;
}

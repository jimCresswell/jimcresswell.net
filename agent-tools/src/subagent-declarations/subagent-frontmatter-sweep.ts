#!/usr/bin/env node

/**
 * `pnpm --filter @engraph/agent-tools subagent-frontmatter-sweep [--write]`: mint every
 * sub-agent template's declaration from its hand-kept adapters and print the reconciliation
 * report. The dry run (the default) prints every block it would write, so the derivation is
 * read before it lands; `--write` writes them. A transplant instrument: a host arriving with
 * hand-kept adapter trees runs it once; the generator then owns the adapters.
 *
 * @packageDocumentation
 */

import { argv, stderr, stdout } from 'node:process';

import { resolveRepoRoot } from '../core/repo-root.js';
import { listTrackedFiles } from '../core/tracked-file-scan.js';

import type { SourcePlatform } from './subagent-declaration.js';
import {
  renderSubagentFrontmatter,
  renderSubagentReconciliationReport,
} from './render-subagent-frontmatter.js';
import { ADAPTER_SURFACES } from './adapter-surfaces.js';
import { TEMPLATES_DIR } from './adapter-spec.js';
import { sweepSubagentFrontmatter } from './sweep-subagent-frontmatter.js';

const USAGE = 'usage: subagent-frontmatter-sweep [--write]';

function basenames(tracked: readonly string[], dir: string, extension: string): string[] {
  return tracked
    .filter((file) => file.startsWith(`${dir}/`) && file.endsWith(extension))
    .filter((file) => !file.slice(dir.length + 1).includes('/'))
    .map((file) => file.slice(dir.length + 1, -extension.length));
}

/** The tracked adapter basenames on one platform's surface. */
function adapterNamesOn(tracked: readonly string[], platform: SourcePlatform): string[] {
  const surface = ADAPTER_SURFACES.find((candidate) => candidate.platform === platform);
  return surface === undefined ? [] : basenames(tracked, surface.dir, surface.extension);
}

async function main(): Promise<number> {
  const args = argv.slice(2);
  if (args.some((arg) => arg !== '--write')) {
    stderr.write(`${USAGE}\n`);
    return 2;
  }
  // projectDir is explicitly disabled: this tool derives from and writes into the tree it
  // runs inside; the CLAUDE_PROJECT_DIR leg would rebind a worktree invocation to the
  // primary checkout (the rules sweep's precedent).
  const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
  const tracked = listTrackedFiles(repoRoot);
  const outcome = await sweepSubagentFrontmatter({
    repoRoot,
    templateNames: basenames(tracked, TEMPLATES_DIR, '.md'),
    adapterNames: {
      cursor: adapterNamesOn(tracked, 'cursor'),
      claude: adapterNamesOn(tracked, 'claude'),
      codex: adapterNamesOn(tracked, 'codex'),
    },
    write: args.includes('--write'),
  });
  if (outcome.refused.length > 0) {
    stderr.write(`Sweep refused; nothing written (${String(outcome.refused.length)} reasons):\n`);
    for (const reason of outcome.refused) {
      stderr.write(`- ${reason}\n`);
    }
    return 1;
  }
  if (!args.includes('--write')) {
    for (const declaration of outcome.declarations) {
      stdout.write(`--- ${TEMPLATES_DIR}/${declaration.name}.md\n`);
      stdout.write(renderSubagentFrontmatter(declaration));
    }
  }
  stdout.write(
    outcome.declarations.length > 0
      ? renderSubagentReconciliationReport(outcome.reconciliations)
      : 'Nothing derived: every template already carries its declaration.\n',
  );
  stdout.write(
    `\n${String(outcome.declarations.length)} declarations derived, ` +
      `${String(outcome.reconciliations.length)} reconciliations, ` +
      `${String(outcome.alreadyDeclared.length)} templates already declared, ` +
      `${String(outcome.written.length)} files written${args.includes('--write') ? '' : ' (dry run)'}.\n`,
  );
  return 0;
}

try {
  process.exitCode = await main();
} catch (error: unknown) {
  stderr.write(`subagent-frontmatter-sweep failed: ${String(error)}\n`);
  process.exitCode = 1;
}

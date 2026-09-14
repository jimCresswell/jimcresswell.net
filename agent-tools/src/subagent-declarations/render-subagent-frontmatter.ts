/**
 * Render a declaration as the frontmatter block a template carries, and the sweep's
 * reconciliation report.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';
import { stringify } from 'yaml';

import { FRONTMATTER_FENCE_LINE } from '../rule-declarations/frontmatter-lines.js';

import type { Reconciliation } from './derive-subagent-declaration.js';
import type {
  FanOutDeclaration,
  RoleDeclaration,
  SubagentDeclaration,
} from './subagent-declaration.js';

const FENCE = `${FRONTMATTER_FENCE_LINE}\n`;

/** The block's fields: a role's, or a fan-out's variants; never the kind or the name. */
type FrontmatterFields =
  Omit<RoleDeclaration, 'kind' | 'name'> | Pick<FanOutDeclaration, 'variants'>;

/** The declaration's fields without its kind and name (the name is the template's basename). */
function frontmatterFields(declaration: SubagentDeclaration): FrontmatterFields {
  if (declaration.kind === 'fan-out') {
    return { variants: declaration.variants };
  }
  const { description, platforms, cursor, claude, codex, gemini } = declaration;
  return {
    description,
    ...(platforms === undefined ? {} : { platforms }),
    ...(cursor === undefined ? {} : { cursor }),
    ...(claude === undefined ? {} : { claude }),
    ...(codex === undefined ? {} : { codex }),
    ...(gemini === undefined ? {} : { gemini }),
  };
}

/** The declaration as YAML between fences. */
export function renderSubagentFrontmatter(declaration: SubagentDeclaration): string {
  return `${FENCE}${stringify(frontmatterFields(declaration), { lineWidth: 0 })}${FENCE}`;
}

/** Put the block at the head of a template that carries none. */
export function prependSubagentFrontmatter(
  templateText: string,
  frontmatter: string,
): Result<string, string> {
  if (templateText.startsWith(FENCE)) {
    return err('already carries a frontmatter block');
  }
  return ok(`${frontmatter}\n${templateText}`);
}

const HEADER = [
  '| Adapter | Field | Kept (the Claude adapter) | Dropped (platform: value) |',
  '| ------- | ----- | ------------------------- | ------------------------- |',
];

function cell(text: string): string {
  return text.replaceAll('|', String.raw`\|`).replaceAll('\n', ' ');
}

/** The sweep's reconciliation report: one row per disagreement, or one line when none. */
export function renderSubagentReconciliationReport(
  reconciliations: readonly Reconciliation[],
): string {
  if (reconciliations.length === 0) {
    return 'No reconciliations: every declaration was read from agreeing adapters.\n';
  }
  const rows = reconciliations.map(
    (entry) =>
      `| ${entry.adapter} | ${entry.field} | ${cell(entry.kept)} | ${entry.dropped
        .map((dropped) => `${dropped.platform}: ${cell(dropped.value)}`)
        .join('; ')} |`,
  );
  return `${[...HEADER, ...rows].join('\n')}\n`;
}

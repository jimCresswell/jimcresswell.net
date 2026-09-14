/**
 * Read a sub-agent template's declaration from the frontmatter block at its head.
 *
 * A template without a block is `undeclared` (the sweep mints one); a block that does not
 * close, is not YAML, or fails the declaration schema is a refusal naming the template.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';
import { parse as parseYaml } from 'yaml';

import { FRONTMATTER_FENCE_LINE } from '../rule-declarations/frontmatter-lines.js';

import { parseSubagentDeclaration, type SubagentDeclaration } from './subagent-declaration.js';

/** What the head of a template carries. */
export type TemplateHead =
  | { readonly kind: 'undeclared' }
  | { readonly kind: 'declared'; readonly declaration: SubagentDeclaration };

/**
 * Read the declaration at the head of a template's text.
 *
 * @param name - The template's basename without `.md`.
 * @param text - The template's full text.
 * @returns The head, or the refusal.
 */
export function readSubagentDeclaration(name: string, text: string): Result<TemplateHead, string> {
  const lines = text.split('\n');
  if (lines[0] !== FRONTMATTER_FENCE_LINE) {
    return ok({ kind: 'undeclared' });
  }
  const closing = lines.indexOf(FRONTMATTER_FENCE_LINE, 1);
  if (closing === -1) {
    return err(`${name}: frontmatter block never closes`);
  }
  let value: unknown;
  try {
    value = parseYaml(lines.slice(1, closing).join('\n'));
  } catch (cause: unknown) {
    return err(
      `${name}: frontmatter is not YAML (${cause instanceof Error ? cause.message : String(cause)})`,
    );
  }
  const declaration = parseSubagentDeclaration(name, value);
  return declaration.ok ? ok({ kind: 'declared', declaration: declaration.value }) : declaration;
}

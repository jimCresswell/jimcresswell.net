/**
 * The derived declaration read back through the strict schema before anything is written.
 * The adapter readers refuse what they can see (a flow collection, an empty value, an empty
 * heading), but the shape the schema binds is the declaration's, not the adapter's: a quoted
 * scalar with an escaped newline is one scalar to the reader and a broken `line` to the
 * schema. So every derived declaration is rendered and read as the next sweep would read it,
 * and one that does not read back refuses the sweep with the schema's own field path (the
 * #77 round-three findings, 2026-09-14).
 *
 * @packageDocumentation
 */

import { readSubagentDeclaration } from './read-subagent-declaration.js';
import { renderSubagentFrontmatter } from './render-subagent-frontmatter.js';
import type { SubagentDeclaration } from './subagent-declaration.js';

/**
 * The refusal when a declaration's render does not read back through the schema; `undefined`
 * when it does.
 *
 * @param name - The template's basename without `.md`.
 * @param declaration - The derived declaration.
 */
export function readBackIssue(name: string, declaration: SubagentDeclaration): string | undefined {
  const head = readSubagentDeclaration(name, renderSubagentFrontmatter(declaration));
  if (head.ok) {
    return undefined;
  }
  // Every refusal the reader returns names the template first (`read-subagent-declaration.ts`,
  // `parseSubagentDeclaration`), so the prefix is dropped and restated once with the cause.
  const inner = head.error.slice(`${name}: `.length);
  return `${name}: the derived declaration does not read back (${inner})`;
}

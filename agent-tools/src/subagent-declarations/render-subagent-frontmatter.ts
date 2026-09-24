/**
 * Render a declaration as the frontmatter block a template carries.
 *
 * @packageDocumentation
 */

import { stringify } from 'yaml';

import { FRONTMATTER_FENCE_LINE } from '../rule-declarations/frontmatter-lines.js';

import type {
  FanOutDeclaration,
  RoleDeclaration,
  SubagentDeclaration,
} from './subagent-declaration.js';

const FENCE = `${FRONTMATTER_FENCE_LINE}\n`;

/**
 * The block's fields: a role's, or a fan-out's variants; never the kind, the name, or the
 * System prompt block the reader takes from the template's body.
 */
type FrontmatterFields =
  Omit<RoleDeclaration, 'kind' | 'name' | 'systemPrompt'> | Pick<FanOutDeclaration, 'variants'>;

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

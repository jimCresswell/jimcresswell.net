/**
 * The adapters the declarations say exist: every template's declaration reduced to its
 * adapter names with the platforms each names. The health probe's adapter parity reads
 * this, so the declarations are the one platform truth.
 *
 * The reduction is pure (`declaredAdaptersFrom`, over the templates' names and texts) and
 * the read is a thin synchronous wrapper over it, as the probe reads its other surfaces; a
 * template that cannot be read or whose declaration refuses is the whole read's refusal,
 * so the probe never compares the surfaces against a partial truth.
 *
 * @packageDocumentation
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { err, ok, type Result } from '@engraph/result';

import { TEMPLATES_DIR, specsOf } from './adapter-spec.js';
import type { SubagentPlatform } from './declaration-scalars.js';
import { readSubagentDeclaration } from './read-subagent-declaration.js';

/** One adapter name and the platforms its declaration renders it on. */
export interface DeclaredAdapter {
  readonly name: string;
  readonly platforms: readonly SubagentPlatform[];
}

/** One template as read: its basename without `.md` and its full text. */
export interface TemplateText {
  readonly name: string;
  readonly text: string;
}

/**
 * The declared adapters of the given templates, in the order given.
 *
 * @param templates - Each template's name and text.
 * @returns The declared adapters, or the first template's refusal (a declaration that does
 *   not read, or a template with none).
 */
export function declaredAdaptersFrom(
  templates: readonly TemplateText[],
): Result<readonly DeclaredAdapter[], string> {
  const declared: DeclaredAdapter[] = [];
  for (const template of templates) {
    const head = readSubagentDeclaration(template.name, template.text);
    if (!head.ok) {
      return err(`${TEMPLATES_DIR}/${template.name}.md: ${head.error}`);
    }
    if (head.value.kind === 'undeclared') {
      return err(`${TEMPLATES_DIR}/${template.name}.md: no declaration in its frontmatter`);
    }
    for (const spec of specsOf(head.value.declaration)) {
      declared.push({ name: spec.name, platforms: spec.platforms });
    }
  }
  return ok(declared);
}

/**
 * Every declared adapter under the repository's templates directory, in template order.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @returns The declared adapters, or the first refusal (the directory unlistable, a template
 *   unreadable, or a refusal of `declaredAdaptersFrom`).
 */
export function readDeclaredAdapters(repoRoot: string): Result<readonly DeclaredAdapter[], string> {
  const dir = join(repoRoot, TEMPLATES_DIR);
  let names: string[];
  try {
    names = readdirSync(dir)
      .filter((entry) => entry.endsWith('.md'))
      .map((entry) => entry.slice(0, -'.md'.length))
      .sort((a, b) => a.localeCompare(b));
  } catch (cause) {
    return err(`${TEMPLATES_DIR}: cannot list the templates (${describe(cause)})`);
  }
  const templates: TemplateText[] = [];
  for (const name of names) {
    try {
      templates.push({ name, text: readFileSync(join(dir, `${name}.md`), 'utf8') });
    } catch (cause) {
      return err(`${TEMPLATES_DIR}/${name}.md: cannot read the template (${describe(cause)})`);
    }
  }
  return declaredAdaptersFrom(templates);
}

/** The error's code or kind, never its message (which carries the working copy's absolute path). */
function describe(cause: unknown): string {
  if (cause instanceof Error) {
    const code = 'code' in cause ? cause.code : undefined;
    return typeof code === 'string' && code.length > 0 ? code : cause.name;
  }
  return 'unknown';
}

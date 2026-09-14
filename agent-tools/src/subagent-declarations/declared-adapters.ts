/**
 * The adapters the declarations say exist: every template's declaration read from the
 * templates directory and reduced to its adapter names with the platforms each names. The
 * health probe's adapter parity reads this, so the declarations are the one platform truth
 * (the transitional platform map `core/reviewer-adapter-platform-contract.ts`, which
 * hardcoded one variant's platforms beside them, retired with the frontmatter sweep).
 *
 * Read synchronously, as the probe reads its surfaces; a template that cannot be read or
 * whose declaration refuses is the whole read's refusal, so the probe never compares the
 * surfaces against a partial truth.
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

/**
 * Every declared adapter under the repository's templates directory, in template order.
 *
 * @param repoRoot - Absolute path to the repository root.
 * @returns The declared adapters, or the first template's refusal.
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
  const declared: DeclaredAdapter[] = [];
  for (const name of names) {
    let text: string;
    try {
      text = readFileSync(join(dir, `${name}.md`), 'utf8');
    } catch (cause) {
      return err(`${TEMPLATES_DIR}/${name}.md: cannot read the template (${describe(cause)})`);
    }
    const head = readSubagentDeclaration(name, text);
    if (!head.ok) {
      return err(`${TEMPLATES_DIR}/${name}.md: ${head.error}`);
    }
    if (head.value.kind === 'undeclared') {
      return err(`${TEMPLATES_DIR}/${name}.md: no declaration in its frontmatter`);
    }
    for (const spec of specsOf(head.value.declaration)) {
      declared.push({ name: spec.name, platforms: spec.platforms });
    }
  }
  return ok(declared);
}

function describe(cause: unknown): string {
  if (cause instanceof Error) {
    const code = 'code' in cause ? cause.code : undefined;
    return typeof code === 'string' && code.length > 0 ? code : cause.name;
  }
  return 'unknown';
}

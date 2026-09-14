import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { TEMPLATES_DIR } from './adapter-spec.js';
import { readDeclaredAdapters } from './declared-adapters.js';

/**
 * The declared-adapters read at its file-system boundary, on mkdtemp repositories: the
 * health probe's platform truth is read from here, so every refusal arm is proved against
 * real entries (an absent directory, an empty set, a symlinked template, an undeclared
 * template) and the happy path reads the declarations in name order.
 */

const tempRoots: string[] = [];

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function makeRepoRoot(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), 'declared-adapters-'));
  tempRoots.push(root);
  return root;
}

async function writeTemplate(root: string, name: string, platforms?: string): Promise<void> {
  const dir = path.join(root, TEMPLATES_DIR);
  await mkdir(dir, { recursive: true });
  const block = platforms === undefined ? '' : `platforms:\n${platforms}`;
  await writeFile(
    path.join(dir, `${name}.md`),
    `---\ndescription: ${name} reviews.\n${block}---\n\n## Delegation Triggers\n`,
  );
}

describe('readDeclaredAdapters', () => {
  it('reads every template in name order to its declared adapters', async () => {
    const root = await makeRepoRoot();
    await writeTemplate(root, 'beta', '  - gemini\n');
    await writeTemplate(root, 'alpha');
    expect(readDeclaredAdapters(root)).toStrictEqual({
      ok: true,
      value: [
        { name: 'alpha', platforms: ['cursor', 'claude', 'codex', 'gemini'] },
        { name: 'beta', platforms: ['gemini'] },
      ],
    });
  });

  it('refuses an absent templates directory and an empty one, naming the directory', async () => {
    const root = await makeRepoRoot();
    expect(readDeclaredAdapters(root)).toStrictEqual({
      ok: false,
      error: `${TEMPLATES_DIR}: cannot list the templates (ENOENT)`,
    });
    await mkdir(path.join(root, TEMPLATES_DIR), { recursive: true });
    expect(readDeclaredAdapters(root)).toStrictEqual({
      ok: false,
      error: `${TEMPLATES_DIR}: no templates, so no adapter is declared`,
    });
  });

  it('refuses a symlinked template without following it', async () => {
    const root = await makeRepoRoot();
    await writeTemplate(root, 'alpha');
    const outside = path.join(root, 'outside.md');
    await writeFile(outside, '---\ndescription: Outside reviews.\n---\n');
    await symlink(outside, path.join(root, TEMPLATES_DIR, 'linked.md'));
    expect(readDeclaredAdapters(root)).toStrictEqual({
      ok: false,
      error: `${TEMPLATES_DIR}/linked.md: not a regular file`,
    });
  });

  it('refuses a template with no declaration, naming it repo-relative', async () => {
    const root = await makeRepoRoot();
    await writeTemplate(root, 'alpha');
    await writeFile(path.join(root, TEMPLATES_DIR, 'gamma.md'), '## Delegation Triggers\n');
    expect(readDeclaredAdapters(root)).toStrictEqual({
      ok: false,
      error: `${TEMPLATES_DIR}/gamma.md: no declaration in its frontmatter`,
    });
  });
});

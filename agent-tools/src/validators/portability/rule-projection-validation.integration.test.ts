import { describe, expect, it } from 'vitest';

import { validateRuleProjections, type RuleProjectionFs } from './rule-projection-validation.js';

const CORE_RULE = '---\nclassification: core\ndescription: Alpha does a.\n---\n\n# Alpha\n';
const SCOPED_RULE = [
  '---',
  'classification: situational',
  'description: Beta does b.',
  'trigger: surface:test-authoring',
  'globs:',
  '  - "**/*.test.*"',
  '---',
  '',
  '# Beta',
  '',
].join('\n');

/** An in-memory repository keyed by repo-relative path; every write and removal is applied. */
function fakeRepo(initial: ReadonlyMap<string, string>): RuleProjectionFs & {
  files: Map<string, string>;
} {
  const files = new Map(initial);
  return {
    files,
    listFiles: async (relDir, extension) =>
      [...files.keys()]
        .filter((file) => file.startsWith(`${relDir}/`) && file.endsWith(extension))
        .filter((file) => !file.slice(relDir.length + 1).includes('/'))
        .sort((left, right) => left.localeCompare(right)),
    readText: async (relPath) => {
      const text = files.get(relPath);
      if (text === undefined) {
        throw new Error(`missing: ${relPath}`);
      }
      return text;
    },
    readOptionalText: async (relPath) => files.get(relPath),
    writeText: async (relPath, text) => {
      files.set(relPath, text);
    },
    removeFile: async (relPath) => {
      files.delete(relPath);
    },
  };
}

function bareRepo(): ReturnType<typeof fakeRepo> {
  return fakeRepo(
    new Map([
      ['.agent/rules/alpha.md', CORE_RULE],
      ['.agent/rules/beta.md', SCOPED_RULE],
    ]),
  );
}

describe('validateRuleProjections', () => {
  it('reports every projection missing on a bare repository, and writes them all in fix mode', async () => {
    const repo = bareRepo();
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toHaveLength(7);
    expect(check.issues.every((issue) => issue.includes('missing rule projection'))).toBe(true);

    const fix = await validateRuleProjections(true, repo);
    expect(fix.issues).toEqual([]);
    expect(fix.written).toHaveLength(7);
    expect(repo.files.get('.claude/rules/beta.md')).toBe(
      '---\npaths:\n  - "**/*.test.*"\n---\n\nRead and follow @.agent/rules/beta.md\n',
    );
    expect(repo.files.get('RULES_INDEX.md')).toContain('| `.agent/rules/alpha.md` | core | — |');

    const again = await validateRuleProjections(false, repo);
    expect(again.issues).toEqual([]);
  });

  it('reports a hand-edited projection as drifted and restores it in fix mode', async () => {
    const repo = bareRepo();
    await validateRuleProjections(true, repo);
    repo.files.set('.cursor/rules/alpha.mdc', 'edited by hand\n');
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toEqual([
      ".cursor/rules/alpha.mdc: drifted from the rule's declaration; projections are never hand-edited (run `pnpm portability:fix`)",
    ]);
    const fix = await validateRuleProjections(true, repo);
    expect(fix.written).toEqual(['.cursor/rules/alpha.mdc']);
    expect(repo.files.get('.cursor/rules/alpha.mdc')).toContain('description: Alpha does a.');
  });

  it('reports a projection with no rule behind it as stale and removes it in fix mode', async () => {
    const repo = bareRepo();
    await validateRuleProjections(true, repo);
    repo.files.set('.claude/rules/gone.md', 'Read and follow `.agent/rules/gone.md`.\n');
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toEqual([
      '.claude/rules/gone.md: no canonical rule renders it (run `pnpm portability:fix` to remove it)',
    ]);
    const fix = await validateRuleProjections(true, repo);
    expect(fix.removed).toEqual(['.claude/rules/gone.md']);
    expect(repo.files.has('.claude/rules/gone.md')).toBe(false);
  });

  it('refuses to render anything while one rule has no declaration, naming the rule', async () => {
    const repo = bareRepo();
    repo.files.set('.agent/rules/gamma.md', '# Gamma\n');
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toEqual([
      ".agent/rules/gamma.md: no frontmatter block (declare it in the rule's frontmatter)",
    ]);
    const fix = await validateRuleProjections(true, repo);
    expect(fix.written).toEqual([]);
    expect(repo.files.has('RULES_INDEX.md')).toBe(false);
  });
});

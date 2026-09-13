import { describe, expect, it } from 'vitest';

import { parseClaudeRuleAdapterPaths } from './parse-claude-rule-adapter.js';

describe('parseClaudeRuleAdapterPaths', () => {
  it('reads no paths from a plain pointer adapter', () => {
    expect(parseClaudeRuleAdapterPaths('Read and follow `.agent/rules/x.md`.\n')).toEqual({
      ok: true,
      value: [],
    });
  });

  it('reads a quoted comma-joined paths value into a list', () => {
    const text = [
      '---',
      'description: Avoid type assertions',
      'paths: "**/*.ts,**/*.tsx"',
      '---',
      '',
      'Read and follow @.agent/rules/x.md',
      '',
    ].join('\n');
    expect(parseClaudeRuleAdapterPaths(text)).toEqual({
      ok: true,
      value: ['**/*.ts', '**/*.tsx'],
    });
  });

  it('reads an adapter whose frontmatter carries a description but no paths as unscoped', () => {
    const text = [
      '---',
      'description: d',
      '---',
      '',
      'Read and follow @.agent/rules/x.md',
      '',
    ].join('\n');
    expect(parseClaudeRuleAdapterPaths(text)).toEqual({ ok: true, value: [] });
  });

  it.each([
    ['**/*.{ts,tsx', 'a "{" is never closed'],
    ['**/*.ts}', 'a "}" has no "{"'],
  ])('refuses the paths value %s whose braces do not balance', (value, reason) => {
    const text = [
      '---',
      `paths: "${value}"`,
      '---',
      '',
      'Read and follow @.agent/rules/x.md',
      '',
    ].join('\n');
    expect(parseClaudeRuleAdapterPaths(text)).toEqual({
      ok: false,
      error: `unbalanced braces in "${value}": ${reason}`,
    });
  });

  it('keeps a balanced brace group whole as one path', () => {
    const text = [
      '---',
      'paths: "**/*.{ts,tsx},docs/**"',
      '---',
      '',
      'Read and follow @.agent/rules/x.md',
      '',
    ].join('\n');
    expect(parseClaudeRuleAdapterPaths(text)).toEqual({
      ok: true,
      value: ['**/*.{ts,tsx}', 'docs/**'],
    });
  });

  it('refuses a key outside description and paths', () => {
    const text = ['---', 'globs: "a/**"', '---', '', 'Read and follow @.agent/rules/x.md', ''].join(
      '\n',
    );
    expect(parseClaudeRuleAdapterPaths(text)).toEqual({
      ok: false,
      error: 'unknown frontmatter key "globs"',
    });
  });
});

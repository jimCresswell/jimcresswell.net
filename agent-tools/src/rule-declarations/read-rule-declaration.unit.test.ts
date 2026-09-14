import { describe, expect, it } from 'vitest';

import { readRuleDeclaration } from './read-rule-declaration.js';

function rule(block: readonly string[]): string {
  return ['---', ...block, '---', '', '# Title', '', 'Body.', ''].join('\n');
}

describe('readRuleDeclaration', () => {
  it('reads a core declaration', () => {
    expect(readRuleDeclaration('r', rule(['classification: core', 'description: d']))).toEqual({
      ok: true,
      value: { name: 'r', classification: 'core', description: 'd' },
    });
  });

  it('reads a situational declaration with trigger and globs', () => {
    expect(
      readRuleDeclaration(
        'r',
        rule([
          'classification: situational',
          'description: d',
          'trigger: surface:test-authoring',
          'globs:',
          '  - "**/*.test.*"',
          '  - e2e/**/*',
        ]),
      ),
    ).toEqual({
      ok: true,
      value: {
        name: 'r',
        classification: 'situational',
        description: 'd',
        trigger: 'surface:test-authoring',
        globs: ['**/*.test.*', 'e2e/**/*'],
      },
    });
  });

  it('reads a situational declaration without globs as an empty list', () => {
    const result = readRuleDeclaration(
      'r',
      rule(['classification: situational', 'description: d', 'trigger: session:team']),
    );
    expect(
      result.ok && result.value.classification === 'situational' && result.value.globs,
    ).toEqual([]);
  });

  it('refuses a rule with no frontmatter block', () => {
    expect(readRuleDeclaration('r', '# Title\n')).toEqual({
      ok: false,
      error: '.agent/rules/r.md: no frontmatter block',
    });
  });

  it('refuses a block that is not valid YAML', () => {
    const result = readRuleDeclaration('r', rule(['classification: core', 'description: a: b: c']));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.startsWith('.agent/rules/r.md: frontmatter is not valid YAML')).toBe(
        true,
      );
    }
  });

  it('refuses a key outside the declaration shape', () => {
    expect(
      readRuleDeclaration(
        'r',
        rule(['classification: core', 'description: d', 'alwaysApply: true']),
      ),
    ).toEqual({ ok: false, error: '.agent/rules/r.md: unknown frontmatter key "alwaysApply"' });
  });

  it('refuses a core rule that carries a trigger or globs', () => {
    expect(
      readRuleDeclaration('r', rule(['classification: core', 'description: d', 'trigger: x'])),
    ).toEqual({ ok: false, error: '.agent/rules/r.md: a core rule carries no trigger or globs' });
  });

  it('refuses a situational rule without a trigger', () => {
    expect(
      readRuleDeclaration('r', rule(['classification: situational', 'description: d'])),
    ).toEqual({ ok: false, error: '.agent/rules/r.md: a situational rule needs a trigger' });
  });

  it('refuses a classification outside the closed set and a missing description', () => {
    expect(readRuleDeclaration('r', rule(['classification: optional', 'description: d']))).toEqual({
      ok: false,
      error: '.agent/rules/r.md: classification must be core or situational, got "optional"',
    });
    expect(readRuleDeclaration('r', rule(['classification: core']))).toEqual({
      ok: false,
      error: '.agent/rules/r.md: description must be a non-empty string',
    });
  });
});

import { describe, expect, it } from 'vitest';

import type { RuleDeclaration } from '../../rule-declarations/rule-declaration.js';
import { ruleGlobResolutionIssues } from './rule-glob-resolution.js';

function situational(name: string, globs: readonly string[]): RuleDeclaration {
  return {
    name,
    classification: 'situational',
    description: `${name} description`,
    trigger: 'surface:example',
    globs,
  };
}

function dead(rule: string, glob: string): string {
  return `.agent/rules/${rule}.md: glob "${glob}" matches no tracked file; re-root it to where the governed files live, or drop it`;
}

const core: RuleDeclaration = {
  name: 'always-on',
  classification: 'core',
  description: 'always-on description',
};

const tracked = ['site/app/page.tsx', 'site/content/cv.json', 'tools/src/check.ts'];

describe('ruleGlobResolutionIssues', () => {
  it('names each pattern that matches no tracked file, with the rule and the cure', () => {
    const issues = ruleGlobResolutionIssues(
      [situational('editor', ['content/**/*', 'site/content/**/*'])],
      tracked,
    );

    expect(issues).toStrictEqual([
      '.agent/rules/editor.md: glob "content/**/*" matches no tracked file; re-root it to where the governed files live, or drop it',
    ]);
  });

  it('counts a pattern live when one brace alternative matches', () => {
    expect(
      ruleGlobResolutionIssues([situational('design', ['site/app/**/*.{css,tsx}'])], tracked),
    ).toStrictEqual([]);
  });

  it('lets a double star span any number of segments, including none', () => {
    expect(
      ruleGlobResolutionIssues(
        [situational('spans', ['site/**/page.tsx', 'tools/**/check.ts', '**/*.json'])],
        ['site/page.tsx', 'tools/src/check.ts', 'site/content/cv.json'],
      ),
    ).toStrictEqual([]);
  });

  it('reports dead patterns in declaration order, skipping core rules and rules without globs', () => {
    const issues = ruleGlobResolutionIssues(
      [
        situational('second', ['tools/**', 'demos/**', 'apps/**']),
        core,
        situational('ceremony', []),
        situational('first', ['zeta/**']),
      ],
      tracked,
    );

    expect(issues).toStrictEqual([
      dead('second', 'demos/**'),
      dead('second', 'apps/**'),
      dead('first', 'zeta/**'),
    ]);
  });

  it('reports nothing for an empty declaration set', () => {
    expect(ruleGlobResolutionIssues([], tracked)).toStrictEqual([]);
  });

  it('reports a pattern whose only matches lie under a dot-directory', () => {
    const issues = ruleGlobResolutionIssues(
      [situational('styles', ['**/*.css', '**/*.tsx', '.cursor/**/*.css'])],
      ['.cursor/theme.css', 'site/app/page.tsx'],
    );

    expect(issues).toStrictEqual([dead('styles', '**/*.css')]);
  });
});

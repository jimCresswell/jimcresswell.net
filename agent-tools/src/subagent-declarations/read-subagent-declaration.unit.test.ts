import { describe, expect, it } from 'vitest';

import { readSubagentDeclaration } from './read-subagent-declaration.js';

describe('readSubagentDeclaration', () => {
  it('reads a template with no block as undeclared', () => {
    expect(readSubagentDeclaration('alpha', '## Delegation Triggers\n\nBody.\n')).toStrictEqual({
      ok: true,
      value: { kind: 'undeclared' },
    });
  });

  it('reads the block at the head of a template as its declaration', () => {
    expect(
      readSubagentDeclaration(
        'alpha',
        '---\ndescription: Alpha reviews a.\nclaude:\n  color: pink\n---\n\n# Alpha\n',
      ),
    ).toStrictEqual({
      ok: true,
      value: {
        kind: 'declared',
        declaration: {
          kind: 'role',
          name: 'alpha',
          description: 'Alpha reviews a.',
          claude: { color: 'pink' },
        },
      },
    });
  });

  it('refuses a block that never closes, is not YAML, or fails the schema, naming the template', () => {
    expect(readSubagentDeclaration('alpha', '---\ndescription: a\n\n# Alpha\n')).toStrictEqual({
      ok: false,
      error: 'alpha: frontmatter block never closes',
    });
    const notYaml = readSubagentDeclaration('alpha', '---\ndescription: a: b: c\n---\n');
    expect(notYaml.ok ? '' : notYaml.error.startsWith('alpha: frontmatter is not YAML')).toBe(true);
    expect(
      readSubagentDeclaration('alpha', '---\ndescription: a\nsummary: b\n---\n'),
    ).toStrictEqual({ ok: false, error: 'alpha: Unrecognized key: "summary"' });
  });
});

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

  it("carries the template's System prompt block, unquoted, when the Claude body names it: the one blockquote under that heading, its blank quote lines kept as paragraph breaks", () => {
    const template = [
      '---',
      'description: Voter judges.',
      'claude:',
      '  tools: none',
      '  body: system-prompt',
      '---',
      '',
      '# Voter',
      '',
      '> A quote outside the section.',
      '',
      '## System prompt',
      '',
      'The Claude adapter carries this block verbatim.',
      '',
      '> You are a voter.',
      '>',
      '> Judge only from the supplied evidence.',
      '',
      '## Delegation triggers',
      '',
      '> A quote after the section.',
      '',
    ].join('\n');
    expect(readSubagentDeclaration('voter', template)).toStrictEqual({
      ok: true,
      value: {
        kind: 'declared',
        declaration: {
          kind: 'role',
          name: 'voter',
          description: 'Voter judges.',
          claude: { tools: 'none', body: 'system-prompt' },
          systemPrompt: 'You are a voter.\n\nJudge only from the supplied evidence.',
        },
      },
    });
  });

  it('refuses a Claude body naming the System prompt block when the template carries none', () => {
    const head = '---\ndescription: Voter.\nclaude:\n  tools: none\n  body: system-prompt\n---\n';
    const refusal = {
      ok: false,
      error:
        'voter: claude.body names the System prompt block, and the template carries none (a blockquote under "## System prompt")',
    };
    expect(readSubagentDeclaration('voter', `${head}\n# Voter\n\n> A quote.\n`)).toStrictEqual(
      refusal,
    );
    expect(
      readSubagentDeclaration(
        'voter',
        `${head}\n## System prompt\n\nProse only.\n\n## Next\n\n> Late.\n`,
      ),
    ).toStrictEqual(refusal);
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

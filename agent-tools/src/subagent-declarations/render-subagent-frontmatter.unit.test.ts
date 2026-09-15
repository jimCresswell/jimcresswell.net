import { describe, expect, it } from 'vitest';

import { renderSubagentFrontmatter } from './render-subagent-frontmatter.js';

describe('renderSubagentFrontmatter', () => {
  it('renders a role as YAML between fences, keys in declaration order, without its kind or name', () => {
    expect(
      renderSubagentFrontmatter({
        kind: 'role',
        name: 'alpha',
        description: 'Alpha reviews a.',
        platforms: ['cursor', 'claude'],
        claude: { color: 'pink', note: 'Review only.\n\nMode: report.' },
      }),
    ).toBe(
      [
        '---',
        'description: Alpha reviews a.',
        'platforms:',
        '  - cursor',
        '  - claude',
        'claude:',
        '  color: pink',
        '  note: |-',
        '    Review only.',
        '',
        '    Mode: report.',
        '---',
        '',
      ].join('\n'),
    );
  });

  it('renders a fan-out as its variants list, a long description on one line', () => {
    const description =
      'A description well past eighty columns so that a wrapping renderer would fold it onto a second line.';
    expect(
      renderSubagentFrontmatter({
        kind: 'fan-out',
        name: 'cricket',
        variants: [{ name: 'cricket-high', platforms: ['claude'], description }],
      }),
    ).toBe(
      [
        '---',
        'variants:',
        '  - name: cricket-high',
        '    platforms:',
        '      - claude',
        `    description: ${description}`,
        '---',
        '',
      ].join('\n'),
    );
  });
});

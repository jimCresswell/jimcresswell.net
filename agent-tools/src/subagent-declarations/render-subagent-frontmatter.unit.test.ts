import { describe, expect, it } from 'vitest';

import {
  prependSubagentFrontmatter,
  renderSubagentFrontmatter,
  renderSubagentReconciliationReport,
} from './render-subagent-frontmatter.js';

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

describe('prependSubagentFrontmatter', () => {
  it('puts the block and one blank line above the unchanged template text', () => {
    expect(
      prependSubagentFrontmatter('## Triggers\n\nBody.\n', '---\ndescription: a\n---\n'),
    ).toStrictEqual({
      ok: true,
      value: '---\ndescription: a\n---\n\n## Triggers\n\nBody.\n',
    });
  });

  it('refuses a template that already carries a block', () => {
    expect(
      prependSubagentFrontmatter('---\ndescription: a\n---\n', '---\ndescription: b\n---\n'),
    ).toStrictEqual({
      ok: false,
      error: 'already carries a frontmatter block',
    });
  });
});

describe('renderSubagentReconciliationReport', () => {
  it('renders one row per reconciliation with the dropped values per platform, pipes escaped', () => {
    expect(
      renderSubagentReconciliationReport([
        {
          adapter: 'alpha',
          field: 'description',
          kept: 'Alpha | reviews a.',
          dropped: [
            { platform: 'cursor', value: 'Alpha, for Cursor.' },
            { platform: 'codex', value: 'Alpha, for\nCodex.' },
          ],
        },
      ]),
    ).toBe(
      [
        '| Adapter | Field | Kept (the ruling form) | Dropped (platform: value) |',
        '| ------- | ----- | ---------------------- | ------------------------- |',
        String.raw`| alpha | description | Alpha \| reviews a. | cursor: Alpha, for Cursor.; codex: Alpha, for Codex. |`,
        '',
      ].join('\n'),
    );
  });

  it('says so in one line when there is nothing to reconcile', () => {
    expect(renderSubagentReconciliationReport([])).toBe(
      'No reconciliations: every declaration was read from agreeing adapters.\n',
    );
  });
});

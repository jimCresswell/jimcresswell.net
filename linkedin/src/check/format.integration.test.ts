import { describe, expect, it } from 'vitest';

import { reportFile } from '../model/report.js';
import type { StructureTable } from '../model/structure-table.js';

import { formatOutcome, formatSummary, type PathOutcome } from './format.js';

const table: StructureTable = {
  sections: [
    { heading: 'About', body: 'paragraphs', entries: true, limit: 2600, entryLimit: null },
    { heading: 'Skills', body: 'list', entries: false, limit: null, entryLimit: null },
  ],
  folds: [200],
};

const outcome = (path: string, text: string): PathOutcome => ({
  path,
  outcome: reportFile(text, table),
});

describe('formatOutcome', () => {
  it('marks a clean file OK and lists its notes with their lines and headings', () => {
    const text =
      '# Profile\n\n## About\n\nStatus: open\n\nCopy here.\n\n## Skills\n\nStatus: open\n\n- Tooling\n';

    expect(formatOutcome(outcome('profile.md', text))).toBe(
      [
        'OK profile.md',
        'note   L3    About: 10 characters of a believed 2,600',
        'note   L9    Skills: 7 characters, no believed limit',
        '',
      ].join('\n'),
    );
  });

  it('marks a file with errors FAIL and prints each error with its line and heading', () => {
    const text = '# Profile\n\n## About\n\nCopy here.\n\n## Skills\n\nStatus: open\n\nLoose line\n';

    const lines = formatOutcome(outcome('profile.md', text)).split('\n');

    expect(lines[0]).toBe('FAIL profile.md');
    expect(lines).toContain('error  L3    About: missing status');
    expect(lines).toContain('error  L11   Skills: a line that is not a list item');
  });

  it('prints a parse error with its line for an unparsable file', () => {
    expect(formatOutcome(outcome('profile.md', 'Stray.\n# Profile\n'))).toBe(
      'FAIL profile.md\nerror  L1    no-title\n',
    );
  });

  it('prints the read failure for an unreadable file', () => {
    const unreadable: PathOutcome = {
      path: 'missing.md',
      outcome: { kind: 'unreadable', message: 'ENOENT' },
    };

    expect(formatOutcome(unreadable)).toBe('FAIL missing.md\nerror  -     ENOENT\n');
  });

  it('names an entry under its section in a finding', () => {
    const text =
      '# Profile\n\n## About\n\nStatus: open\n\n### Role · Place\n\nCopy.\n\n## Skills\n\nStatus: open\n';

    const lines = formatOutcome(outcome('profile.md', text)).split('\n');

    expect(lines).toContain('error  L7    About › Role · Place: missing status');
  });
});

describe('formatSummary', () => {
  it('counts the files and the failing ones', () => {
    const clean = outcome(
      'a.md',
      '# Profile\n\n## About\n\nStatus: open\n\n## Skills\n\nStatus: open\n',
    );
    const failing = outcome('b.md', '# Profile\n\n## About\n\n## Skills\n\nStatus: open\n');

    expect(formatSummary([clean])).toBe('1 file checked, all OK\n');
    expect(formatSummary([clean, failing])).toBe('2 files checked, 1 failing\n');
  });
});

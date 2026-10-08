import { describe, expect, it } from 'vitest';

import { reportFile } from './report.js';
import type { StructureTable } from './structure-table.js';

const table: StructureTable = {
  sections: [
    { heading: 'Alpha', body: 'paragraphs', entries: true, limit: 100, entryLimit: null },
    { heading: 'Beta', body: 'list', entries: false, limit: null, entryLimit: null },
  ],
  folds: [200],
};

describe('reportFile', () => {
  it('reports a well-formed text with no errors and a count note per body', () => {
    const report = reportFile(
      '# Profile\n\n## Alpha\n\nStatus: open\n\nCopy here.\n\n## Beta\n\nStatus: open\n\n- Skill\n',
      table,
    );

    expect(report).toMatchObject({
      kind: 'parsed',
      validation: {
        errors: [],
        notes: [
          { kind: 'count', where: { kind: 'section', section: 0 }, count: 10, limit: 100 },
          { kind: 'count', where: { kind: 'section', section: 1 }, count: 5, limit: null },
        ],
      },
    });
  });

  it('reports a missing status with its line and still carries the notes', () => {
    const report = reportFile(
      '# Profile\n\n## Alpha\n\nCopy here.\n\n## Beta\n\nStatus: open\n',
      table,
    );

    expect(report).toMatchObject({
      kind: 'parsed',
      validation: {
        errors: [{ kind: 'missing-status', where: { kind: 'section', section: 0 }, line: 3 }],
        notes: [
          { kind: 'count', where: { kind: 'section', section: 0 }, count: 10, limit: 100 },
          { kind: 'count' },
        ],
      },
    });
  });

  it('reports a text without a title as unparsable with the parse error', () => {
    const text = '## Alpha\n\nStatus: open\n';

    expect(reportFile(text, table)).toEqual({
      kind: 'unparsable',
      text,
      error: { kind: 'no-title', line: 1 },
    });
  });
});

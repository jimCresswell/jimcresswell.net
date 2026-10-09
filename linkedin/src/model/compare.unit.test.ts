import { unwrap } from '@engraph/result';
import { describe, expect, it } from 'vitest';

import { compareToSource } from './compare.js';
import { parse } from './parse.js';
import type { StructureTable } from './structure-table.js';
import type { ProfileDocument } from './types.js';

const table: StructureTable = {
  sections: [
    { heading: 'Alpha', body: 'paragraphs', entries: true, limit: null, entryLimit: null },
  ],
  folds: [],
};

const document = (body: string): ProfileDocument =>
  unwrap(parse(`# Profile\n\n## Alpha\n\nStatus: open\n\n${body}`, table));

describe('compareToSource', () => {
  it('leaves a section unchanged when its body text and status equal the source', () => {
    const source = document('One two.\n');

    expect(compareToSource(source, document('One two.\n'))).toEqual([
      { heading: 'Alpha', changed: false, entries: [] },
    ]);
  });

  it('leaves a section unchanged when only its soft line breaks moved', () => {
    const source = document('One two\nthree.\n');

    expect(compareToSource(source, document('One\ntwo three.\n'))[0]?.changed).toBe(false);
  });

  it('marks a section changed when one word differs', () => {
    expect(compareToSource(document('One two.\n'), document('One three.\n'))[0]?.changed).toBe(
      true,
    );
  });

  it('marks a section changed when its status differs', () => {
    const review = unwrap(parse('# Profile\n\n## Alpha\n\nStatus: drafted\n\nOne two.\n', table));

    expect(compareToSource(document('One two.\n'), review)[0]?.changed).toBe(true);
  });

  it('marks a section absent from the source as changed', () => {
    const review = unwrap(
      parse('# Profile\n\n## Alpha\n\nStatus: open\n\n## Omega\n\nStatus: open\n', table),
    );

    expect(compareToSource(document(''), review).map((change) => change.changed)).toEqual([
      false,
      true,
    ]);
  });

  it('marks an entry whose body differs and leaves the section own flag alone', () => {
    const source = document('Intro.\n\n### Role\n\nStatus: open\n\nWas.\n');
    const review = document('Intro.\n\n### Role\n\nStatus: open\n\nIs.\n');

    expect(compareToSource(source, review)).toEqual([
      { heading: 'Alpha', changed: false, entries: [{ heading: 'Role', changed: true }] },
    ]);
  });
});

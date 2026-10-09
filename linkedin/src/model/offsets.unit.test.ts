import { unwrap } from '@engraph/result';
import { describe, expect, it } from 'vitest';

import { paragraphAt, paragraphRangesForSourceSpan, sourceOffsetAt } from './offsets.js';
import { parse } from './parse.js';
import type { StructureTable } from './structure-table.js';
import type { Paragraph, ProfileDocument } from './types.js';

const table: StructureTable = {
  sections: [
    { heading: 'Alpha', body: 'paragraphs', entries: true, limit: null, entryLimit: null },
  ],
  folds: [],
};

const text =
  '# Profile\n\n## Alpha\n\nStatus: open\n\nfirst line\nsecond line\n\nThird para.\n\n### Role\n\nStatus: open\n\nEntry copy.\n';
const document = unwrap(parse(text, table));
const at = (needle: string): number => text.indexOf(needle);

const first = { section: 0, entry: null, paragraph: 0 };
const third = { section: 0, entry: null, paragraph: 1 };
const inEntry = { section: 0, entry: 0, paragraph: 0 };

/** Two source lines `ab` and `cd` at offsets 10 and 13, joined as `ab cd`. */
const twoLines: Paragraph = {
  text: 'ab cd',
  span: { start: 10, end: 15 },
  lines: [
    { line: 1, span: { start: 10, end: 12 }, textOffset: 0 },
    { line: 2, span: { start: 13, end: 15 }, textOffset: 3 },
  ],
};

const documentOf = (paragraph: Paragraph): ProfileDocument => ({
  title: { text: 'Profile', line: 1, span: { start: 0, end: 9 } },
  sections: [
    {
      heading: { text: 'Alpha', line: 3, span: { start: 0, end: 0 } },
      status: { kind: 'absent' },
      body: { kind: 'paragraphs', paragraphs: [paragraph] },
      entries: [],
    },
  ],
});

describe('paragraphRangesForSourceSpan', () => {
  it('maps a span inside one line to a range of that paragraph text', () => {
    const span = { start: at('line'), end: at('line') + 'line'.length };

    expect(paragraphRangesForSourceSpan(document, span)).toEqual([
      { ref: first, start: 'first '.length, end: 'first line'.length },
    ]);
  });

  it('maps a span across a soft break to one range of the same length', () => {
    const span = { start: at('line'), end: at('second') + 'second'.length };

    expect(paragraphRangesForSourceSpan(document, span)).toEqual([
      { ref: first, start: 'first '.length, end: 'first line second'.length },
    ]);
  });

  it('splits a span over two paragraphs into one range per paragraph', () => {
    const span = { start: at('second'), end: at('Third') + 'Third'.length };

    expect(paragraphRangesForSourceSpan(document, span)).toEqual([
      { ref: first, start: 'first line '.length, end: 'first line second line'.length },
      { ref: third, start: 0, end: 'Third'.length },
    ]);
  });

  it('yields no range over a heading or a status line and clips a span that reaches into copy', () => {
    const headings = { start: at('## Alpha'), end: at('Status') + 'Status'.length };
    const intoEntry = { start: at('### Role'), end: at('Entry copy.') + 'Entry'.length };

    expect(paragraphRangesForSourceSpan(document, headings)).toEqual([]);
    expect(paragraphRangesForSourceSpan(document, intoEntry)).toEqual([
      { ref: inEntry, start: 0, end: 'Entry'.length },
    ]);
  });

  it('yields nothing for a collapsed span', () => {
    expect(
      paragraphRangesForSourceSpan(document, { start: at('first'), end: at('first') }),
    ).toEqual([]);
  });
});

describe('sourceOffsetAt', () => {
  it('maps a text offset on a later line to its source position', () => {
    expect(sourceOffsetAt(twoLines, 'ab c'.length)).toBe(14);
  });

  it('maps the join space to the end of the line before it', () => {
    expect(sourceOffsetAt(twoLines, 'ab'.length)).toBe(12);
  });

  it('clamps an offset beyond the text to the paragraph end and a negative one to its start', () => {
    expect(sourceOffsetAt(twoLines, 'ab cd'.length + 3)).toBe(15);
    expect(sourceOffsetAt(twoLines, -2)).toBe(10);
  });

  it('round-trips every text offset through the source and back within one paragraph', () => {
    const offsets = [0, 1, 2, 3, 4];
    const ref = { section: 0, entry: null, paragraph: 0 };

    const back = offsets.map((offset) =>
      paragraphRangesForSourceSpan(documentOf(twoLines), {
        start: sourceOffsetAt(twoLines, offset),
        end: sourceOffsetAt(twoLines, offset + 1),
      }),
    );

    expect(back).toEqual(offsets.map((offset) => [{ ref, start: offset, end: offset + 1 }]));
  });
});

describe('paragraphAt', () => {
  it('finds a section paragraph and an entry paragraph by reference', () => {
    expect(paragraphAt(document, third)).toMatchObject({ text: 'Third para.' });
    expect(paragraphAt(document, inEntry)).toMatchObject({ text: 'Entry copy.' });
  });

  it('answers null for a paragraph, an entry or a section the document lacks', () => {
    expect(paragraphAt(document, { section: 0, entry: null, paragraph: 2 })).toBeNull();
    expect(paragraphAt(document, { section: 0, entry: 1, paragraph: 0 })).toBeNull();
    expect(paragraphAt(document, { section: 1, entry: null, paragraph: 0 })).toBeNull();
  });
});

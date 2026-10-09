import { describe, expect, it } from 'vitest';

import type { StructureTable } from './structure-table.js';
import type { Body, Entry, Paragraph, ProfileDocument, Section, StatusLine } from './types.js';
import { validate } from './validate.js';

/** Three sections: Alpha holds paragraphs and entries with limits, Beta a list, Gamma paragraphs. */
const table: StructureTable = {
  sections: [
    { heading: 'Alpha', body: 'paragraphs', entries: true, limit: 50, entryLimit: 30 },
    { heading: 'Beta', body: 'list', entries: false, limit: null, entryLimit: null },
    { heading: 'Gamma', body: 'paragraphs', entries: false, limit: null, entryLimit: null },
  ],
  folds: [10, 20],
};

const open: StatusLine = {
  kind: 'present',
  status: 'open',
  note: '',
  line: 0,
  span: { start: 0, end: 0 },
};
const noSpan = { start: 0, end: 0 };
const paragraph = (text: string, line: number): Paragraph => ({
  text,
  lines: [{ line, span: { start: 0, end: text.length }, textOffset: 0 }],
  span: { start: 0, end: text.length },
});
const paragraphs = (...texts: readonly string[]): Body => ({
  kind: 'paragraphs',
  paragraphs: texts.map((text, index) => paragraph(text, index + 1)),
});
const list = (): Body => ({ kind: 'list', items: [], strays: [] });
const section = (
  heading: string,
  line: number,
  status: StatusLine = open,
  body: Body = paragraphs(),
  entries: readonly Entry[] = [],
): Section => ({ heading: { text: heading, line, span: noSpan }, status, body, entries });
const entry = (
  heading: string,
  line: number,
  status: StatusLine = open,
  body: Body = paragraphs(),
): Entry => ({
  heading: { text: heading, line, span: noSpan },
  status,
  body,
});
const document = (...sections: readonly Section[]): ProfileDocument => ({
  title: { text: 'Profile', line: 1, span: noSpan },
  sections,
});
const conforming = (alpha: Section = section('Alpha', 3)): ProfileDocument =>
  document(alpha, section('Beta', 5, open, list()), section('Gamma', 7));

describe('validate', () => {
  it('finds no errors in a document with every table section in order and well-formed statuses', () => {
    expect(validate(conforming(), table).errors).toEqual([]);
  });

  it('reports a section outside the table as unknown, with its line', () => {
    const errors = validate(document(...conforming().sections, section('Delta', 9)), table).errors;

    expect(errors).toEqual([{ kind: 'unknown-section', section: 3, line: 9 }]);
  });

  it('reports a table section the document lacks as missing', () => {
    const errors = validate(
      document(section('Alpha', 3), section('Beta', 5, open, list())),
      table,
    ).errors;

    expect(errors).toEqual([{ kind: 'missing-section', heading: 'Gamma' }]);
  });

  it('reports a known section that comes before one that should precede it as misordered', () => {
    const errors = validate(
      document(section('Beta', 3, open, list()), section('Alpha', 5), section('Gamma', 7)),
      table,
    ).errors;

    expect(errors).toEqual([{ kind: 'misordered-section', section: 1, line: 5 }]);
  });

  it('reports a repeated section as a duplicate, with the second one line', () => {
    const errors = validate(document(...conforming().sections, section('Alpha', 9)), table).errors;

    expect(errors).toEqual([{ kind: 'duplicate-section', section: 3, line: 9 }]);
  });

  it('reports an absent status as missing at the heading line', () => {
    const errors = validate(conforming(section('Alpha', 3, { kind: 'absent' })), table).errors;

    expect(errors).toEqual([
      { kind: 'missing-status', where: { kind: 'section', section: 0 }, line: 3 },
    ]);
  });

  it('reports a malformed status as invalid, carrying its text and line', () => {
    const malformed: StatusLine = {
      kind: 'malformed',
      text: 'Status: soon',
      line: 4,
      reason: 'unknown-status',
    };

    const errors = validate(conforming(section('Alpha', 3, malformed)), table).errors;

    expect(errors).toEqual([
      {
        kind: 'invalid-status',
        where: { kind: 'section', section: 0 },
        line: 4,
        text: 'Status: soon',
      },
    ]);
  });

  it('reports an entry with an absent status at the entry', () => {
    const alpha = section('Alpha', 3, open, paragraphs(), [entry('Role', 7, { kind: 'absent' })]);

    const errors = validate(conforming(alpha), table).errors;

    expect(errors).toEqual([
      { kind: 'missing-status', where: { kind: 'entry', section: 0, entry: 0 }, line: 7 },
    ]);
  });

  it('reports an entry under a section the table gives no entries', () => {
    const beta = section('Beta', 5, open, list(), [entry('Item', 7)]);

    const errors = validate(document(section('Alpha', 3), beta, section('Gamma', 9)), table).errors;

    expect(errors).toEqual([
      {
        kind: 'entry-in-non-entry-section',
        where: { kind: 'entry', section: 1, entry: 0 },
        line: 7,
      },
    ]);
  });

  it('reports a line in a list body that is not an item as a stray', () => {
    const strays: Body = {
      kind: 'list',
      items: [],
      strays: [{ text: 'Loose', line: 8, span: noSpan }],
    };

    const errors = validate(
      document(section('Alpha', 3), section('Beta', 5, open, strays), section('Gamma', 9)),
      table,
    ).errors;

    expect(errors).toEqual([
      { kind: 'stray-line', where: { kind: 'section', section: 1 }, line: 8 },
    ]);
  });

  it('notes a count for every body carrying the table limit, or null where none is believed', () => {
    const alpha = section('Alpha', 3, open, paragraphs('abcd'), [
      entry('Role', 7, open, paragraphs('xy')),
    ]);

    const notes = validate(conforming(alpha), table).notes.filter((note) => note.kind === 'count');

    expect(notes).toEqual([
      { kind: 'count', where: { kind: 'section', section: 0 }, count: 4, limit: 50 },
      { kind: 'count', where: { kind: 'entry', section: 0, entry: 0 }, count: 2, limit: 30 },
      { kind: 'count', where: { kind: 'section', section: 1 }, count: 0, limit: null },
      { kind: 'count', where: { kind: 'section', section: 2 }, count: 0, limit: null },
    ]);
  });

  it('counts two characters for every break between paragraphs', () => {
    const notes = validate(
      conforming(section('Alpha', 3, open, paragraphs('abc', 'de'))),
      table,
    ).notes;

    expect(notes).toContainEqual({
      kind: 'count',
      where: { kind: 'section', section: 0 },
      count: 7,
      limit: 50,
    });
  });

  it('places a fold inside the paragraph it falls in, at the offset from that paragraph start', () => {
    const body = paragraphs('a'.repeat(15), 'b'.repeat(10));

    const folds = validate(conforming(section('Alpha', 3, open, body)), table).notes.filter(
      (note) => note.kind === 'fold',
    );

    expect(folds).toEqual([
      { kind: 'fold', where: { kind: 'section', section: 0 }, at: 10, paragraph: 0, offset: 10 },
      { kind: 'fold', where: { kind: 'section', section: 0 }, at: 20, paragraph: 1, offset: 3 },
    ]);
  });

  it('places a fold on the blank line between paragraphs at the end of the paragraph before it', () => {
    const body = paragraphs('a'.repeat(9), 'b'.repeat(10));

    const folds = validate(conforming(section('Alpha', 3, open, body)), table).notes.filter(
      (note) => note.kind === 'fold',
    );

    expect(folds).toContainEqual({
      kind: 'fold',
      where: { kind: 'section', section: 0 },
      at: 10,
      paragraph: 0,
      offset: 9,
    });
  });

  it('notes no fold past the end of the body', () => {
    const folds = validate(
      conforming(section('Alpha', 3, open, paragraphs('abc'))),
      table,
    ).notes.filter((note) => note.kind === 'fold');

    expect(folds).toEqual([]);
  });

  it('notes emphasis, a link, a deeper heading and a list marker inside a body, each with its line', () => {
    const body = paragraphs(
      'plain *stressed* word',
      'see [the page](https://example.test)',
      '#### Deep',
      '- marker',
    );

    const markup = validate(conforming(section('Alpha', 3, open, body)), table).notes.filter(
      (note) => note.kind === 'markup',
    );

    expect(markup).toEqual([
      { kind: 'markup', where: { kind: 'section', section: 0 }, line: 1, markup: 'emphasis' },
      { kind: 'markup', where: { kind: 'section', section: 0 }, line: 2, markup: 'link' },
      { kind: 'markup', where: { kind: 'section', section: 0 }, line: 3, markup: 'heading' },
      { kind: 'markup', where: { kind: 'section', section: 0 }, line: 4, markup: 'list-marker' },
    ]);
  });

  it('notes no markup in plain prose with a dash and an underscore in ordinary use', () => {
    const body = paragraphs('A well-made thing, 2020 – 2021, snake_case_name and 3 * 4.');

    const markup = validate(conforming(section('Alpha', 3, open, body)), table).notes.filter(
      (note) => note.kind === 'markup',
    );

    expect(markup).toEqual([]);
  });

  it('keeps errors and notes independent: a misordered document still carries its counts', () => {
    const verdict = validate(
      document(section('Beta', 3, open, list()), section('Alpha', 5), section('Gamma', 7)),
      table,
    );

    expect(verdict.errors).toHaveLength(1);
    expect(verdict.notes.filter((note) => note.kind === 'count')).toHaveLength(3);
  });
});

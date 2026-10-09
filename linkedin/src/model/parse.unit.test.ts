import { unwrap, unwrapErr } from '@engraph/result';
import { describe, expect, it } from 'vitest';

import { parse } from './parse.js';
import type { StructureTable } from './structure-table.js';

/** A table of two sections: Alpha holds paragraphs and entries, Beta holds a list. */
const table: StructureTable = {
  sections: [
    { heading: 'Alpha', body: 'paragraphs', entries: true, limit: null, entryLimit: null },
    { heading: 'Beta', body: 'list', entries: false, limit: null, entryLimit: null },
  ],
  folds: [],
};

const alpha = (body: string): string => `# Profile\n\n## Alpha\n\nStatus: open\n\n${body}`;

describe('parse', () => {
  it('parses a title and one section with its status and paragraph', () => {
    const document = unwrap(parse(alpha('Hello world.\n'), table));

    expect(document.title.text).toBe('Profile');
    expect(document.sections).toHaveLength(1);
    expect(document.sections[0]?.heading.text).toBe('Alpha');
    expect(document.sections[0]?.status).toMatchObject({
      kind: 'present',
      status: 'open',
      note: '',
    });
    expect(document.sections[0]?.body).toMatchObject({
      kind: 'paragraphs',
      paragraphs: [{ text: 'Hello world.' }],
    });
  });

  it('joins soft line breaks with single spaces and keeps each line span and text offset', () => {
    const text = alpha('first line\nsecond line\n');

    const document = unwrap(parse(text, table));

    expect(document.sections[0]?.body).toMatchObject({
      kind: 'paragraphs',
      paragraphs: [
        {
          text: 'first line second line',
          lines: [
            {
              span: {
                start: text.indexOf('first'),
                end: text.indexOf('first') + 'first line'.length,
              },
              textOffset: 0,
            },
            {
              span: {
                start: text.indexOf('second'),
                end: text.indexOf('second') + 'second line'.length,
              },
              textOffset: 'first line '.length,
            },
          ],
        },
      ],
    });
  });

  it('separates paragraphs at blank lines and spans each from its first line to its last', () => {
    const text = alpha('one\ntwo\n\nthree\n');

    const document = unwrap(parse(text, table));

    expect(document.sections[0]?.body).toMatchObject({
      kind: 'paragraphs',
      paragraphs: [
        { text: 'one two', span: { start: text.indexOf('one'), end: text.indexOf('two') + 3 } },
        { text: 'three', span: { start: text.indexOf('three'), end: text.indexOf('three') + 5 } },
      ],
    });
  });

  it('carries the parenthesised note on the status line separately from the status word', () => {
    const text = '# Profile\n\n## Alpha\n\nStatus: approved (Jim, 7 October 2026)\n\nCopy.\n';

    const document = unwrap(parse(text, table));

    expect(document.sections[0]?.status).toMatchObject({
      kind: 'present',
      status: 'approved',
      note: 'Jim, 7 October 2026',
      line: 5,
    });
  });

  it('reports an absent status when the first line under a heading is not a status line, and that line opens the body', () => {
    const document = unwrap(parse('# Profile\n\n## Alpha\n\nHello.\n', table));

    expect(document.sections[0]?.status).toEqual({ kind: 'absent' });
    expect(document.sections[0]?.body).toMatchObject({ paragraphs: [{ text: 'Hello.' }] });
  });

  it('reports a status word outside the three as malformed with its line', () => {
    const document = unwrap(parse('# Profile\n\n## Alpha\n\nStatus: pending\n\nHello.\n', table));

    expect(document.sections[0]?.status).toEqual({
      kind: 'malformed',
      text: 'Status: pending',
      line: 5,
      reason: 'unknown-status',
    });
  });

  it('reports a status line followed directly by text as not isolated, and keeps the text as body', () => {
    const document = unwrap(parse('# Profile\n\n## Alpha\n\nStatus: open\nHello.\n', table));

    expect(document.sections[0]?.status).toMatchObject({
      kind: 'malformed',
      reason: 'not-isolated',
      line: 5,
    });
    expect(document.sections[0]?.body).toMatchObject({ paragraphs: [{ text: 'Hello.' }] });
  });

  it('reads a list body as items without their markers and reports a non-item line as a stray', () => {
    const text = '# Profile\n\n## Beta\n\nStatus: open\n\n- One\n- Two\nThree\n';

    const document = unwrap(parse(text, table));

    const at = (needle: string): number => text.indexOf(needle);
    expect(document.sections[0]?.body).toEqual({
      kind: 'list',
      items: [
        { text: 'One', line: 7, span: { start: at('- One'), end: at('- One') + 5 } },
        { text: 'Two', line: 8, span: { start: at('- Two'), end: at('- Two') + 5 } },
      ],
      strays: [{ text: 'Three', line: 9, span: { start: at('Three'), end: at('Three') + 5 } }],
    });
  });

  it('makes an H3 under a section an entry with its own status and body', () => {
    const text = alpha(
      'Intro.\n\n### Role · Place · 2020 – 2021\n\nStatus: drafted (awaiting Jim)\n\nEntry copy.\n',
    );

    const document = unwrap(parse(text, table));

    expect(document.sections[0]?.body).toMatchObject({ paragraphs: [{ text: 'Intro.' }] });
    expect(document.sections[0]?.entries).toHaveLength(1);
    expect(document.sections[0]?.entries[0]).toMatchObject({
      heading: { text: 'Role · Place · 2020 – 2021', line: 9 },
      status: { kind: 'present', status: 'drafted', note: 'awaiting Jim' },
      body: { kind: 'paragraphs', paragraphs: [{ text: 'Entry copy.' }] },
    });
  });

  it('parses a section the table does not know as paragraphs', () => {
    const document = unwrap(
      parse('# Profile\n\n## Gamma\n\nStatus: open\n\n- Not a list here.\n', table),
    );

    expect(document.sections[0]?.body).toMatchObject({
      kind: 'paragraphs',
      paragraphs: [{ text: '- Not a list here.' }],
    });
  });

  it('keeps a heading deeper than three hashes as body text', () => {
    const document = unwrap(parse(alpha('#### Deep\n'), table));

    expect(document.sections[0]?.body).toMatchObject({ paragraphs: [{ text: '#### Deep' }] });
  });

  it('spans a heading over exactly its own line', () => {
    const text = alpha('Copy.\n');

    const document = unwrap(parse(text, table));

    const span = document.sections[0]?.heading.span;
    expect(span).toBeDefined();
    expect(text.slice(span?.start, span?.end)).toBe('## Alpha');
    expect(document.sections[0]?.heading.line).toBe(3);
  });

  it('parses a file without a trailing newline to the same model as one with', () => {
    const withNewline = alpha('Copy.\n');

    expect(parse(withNewline.slice(0, -1), table)).toEqual(parse(withNewline, table));
  });

  it('refuses text before the title, naming its line', () => {
    expect(unwrapErr(parse('hello\n# Profile\n', table))).toEqual({ kind: 'no-title', line: 1 });
  });

  it('refuses a document with no title', () => {
    expect(unwrapErr(parse('## Alpha\n\nStatus: open\n', table))).toEqual({
      kind: 'no-title',
      line: 1,
    });
    expect(unwrapErr(parse('', table))).toEqual({ kind: 'no-title', line: 1 });
  });

  it('refuses a second title, naming its line', () => {
    expect(unwrapErr(parse('# Profile\n\n# Again\n', table))).toEqual({
      kind: 'second-title',
      line: 3,
    });
  });

  it('refuses an entry before any section, naming its line', () => {
    expect(unwrapErr(parse('# Profile\n\n### Role\n', table))).toEqual({
      kind: 'entry-before-section',
      line: 3,
    });
  });

  it('refuses text between the title and the first section, naming its line', () => {
    expect(unwrapErr(parse('# Profile\n\nStray.\n\n## Alpha\n', table))).toEqual({
      kind: 'text-before-first-section',
      line: 3,
    });
  });
});

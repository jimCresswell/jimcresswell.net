/**
 * The line level of the parser: splitting the source into lines with offsets, and reading the
 * two body grammars (paragraphs, a dash list) from runs of lines.
 *
 * @packageDocumentation
 */

import type { Body, ListItem, Paragraph, SourceLine, Span, StrayLine } from './types.js';

/** A source line: its text without the newline, its one-based number and its span. */
export interface RawLine {
  readonly text: string;
  readonly line: number;
  readonly span: Span;
}

const BLANK = /^\s*$/;
const LIST_ITEM = /^- (.*)$/;

/** Whether the line holds nothing but whitespace. */
export function isBlank(line: RawLine): boolean {
  return BLANK.test(line.text);
}

/**
 * Split the source into lines with their spans. A trailing newline ends the last line and opens
 * no empty line after it, so a file with and without one splits the same.
 */
export function splitLines(text: string): readonly RawLine[] {
  const segments = text.split('\n');
  if (text.endsWith('\n')) {
    segments.pop();
  }
  const lines: RawLine[] = [];
  let start = 0;
  for (const [index, segment] of segments.entries()) {
    lines.push({ text: segment, line: index + 1, span: { start, end: start + segment.length } });
    start += segment.length + 1;
  }
  return lines;
}

/** Group consecutive non-blank lines into runs. */
function runs(lines: readonly RawLine[]): readonly (readonly RawLine[])[] {
  const groups: RawLine[][] = [];
  let current: RawLine[] = [];
  for (const line of lines) {
    if (isBlank(line)) {
      if (current.length > 0) {
        groups.push(current);
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) {
    groups.push(current);
  }
  return groups;
}

/** Join one run of lines into a paragraph: one space per soft break, each line's offset recorded. */
function paragraphOf(run: readonly RawLine[]): Paragraph {
  const lines: SourceLine[] = [];
  let textOffset = 0;
  for (const line of run) {
    lines.push({ span: line.span, textOffset });
    textOffset += line.text.length + 1;
  }
  const first = run.at(0);
  const last = run.at(-1);
  return {
    text: run.map((line) => line.text).join(' '),
    lines,
    span: { start: first?.span.start ?? 0, end: last?.span.end ?? 0 },
  };
}

/** Read a paragraphs body: blank lines separate paragraphs, soft breaks join inside them. */
export function parseParagraphs(lines: readonly RawLine[]): Body {
  return { kind: 'paragraphs', paragraphs: runs(lines).map(paragraphOf) };
}

/** Read a list body: `- item` lines are items without their marker; any other non-blank line is a stray. */
export function parseList(lines: readonly RawLine[]): Body {
  const items: ListItem[] = [];
  const strays: StrayLine[] = [];
  for (const line of lines) {
    if (isBlank(line)) {
      continue;
    }
    const item = LIST_ITEM.exec(line.text);
    if (item?.[1] === undefined) {
      strays.push({ text: line.text, line: line.line, span: line.span });
    } else {
      items.push({ text: item[1], line: line.line, span: line.span });
    }
  }
  return { kind: 'list', items, strays };
}

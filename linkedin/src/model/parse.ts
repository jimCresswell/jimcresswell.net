/**
 * The reader of the profile file: source text in, the document model out. It is total except for
 * the four shapes the model cannot hold ({@link ParseError}); a missing status, a stray line or an
 * entry under the wrong section is represented and left for the validator to judge.
 *
 * @packageDocumentation
 */

import { err, map, ok, type Result } from '@engraph/result';

import { isBlank, parseList, parseParagraphs, splitLines, type RawLine } from './parse-body.js';
import { PROFILE_STRUCTURE, type StructureTable } from './structure-table.js';
import {
  isStatus,
  type Entry,
  type Heading,
  type ParseError,
  type ProfileDocument,
  type Section,
  type StatusLine,
} from './types.js';

const HEADING = /^(#{1,3}) (.*)$/;
const STATUS = /^Status: (\S+)(?: \((.*)\))?$/;

type Level = 1 | 2 | 3;

type Classified =
  | { readonly kind: 'heading'; readonly level: Level; readonly heading: Heading }
  | { readonly kind: 'blank' }
  | { readonly kind: 'text' };

function levelOf(hashes: string): Level {
  if (hashes.length === 1) {
    return 1;
  }
  return hashes.length === 2 ? 2 : 3;
}

/** An ATX heading of one to three hashes, a blank line, or text (a deeper heading included). */
function classify(line: RawLine): Classified {
  const match = HEADING.exec(line.text);
  const hashes = match?.[1];
  const text = match?.[2];
  if (hashes !== undefined && text !== undefined) {
    return {
      kind: 'heading',
      level: levelOf(hashes),
      heading: { text, line: line.line, span: line.span },
    };
  }
  return isBlank(line) ? { kind: 'blank' } : { kind: 'text' };
}

interface EntryBuilder {
  readonly heading: Heading;
  readonly lines: RawLine[];
}

interface SectionBuilder {
  readonly heading: Heading;
  readonly lines: RawLine[];
  readonly entries: EntryBuilder[];
}

interface Walk {
  title: Heading | null;
  readonly sections: SectionBuilder[];
}

interface Walked {
  readonly title: Heading;
  readonly sections: readonly SectionBuilder[];
}

function placeHeading(walk: Walk, level: Level, heading: Heading): ParseError | null {
  if (level === 1) {
    if (walk.title !== null) {
      return { kind: 'second-title', line: heading.line };
    }
    walk.title = heading;
    return null;
  }
  if (walk.title === null) {
    return { kind: 'no-title', line: heading.line };
  }
  if (level === 2) {
    walk.sections.push({ heading, lines: [], entries: [] });
    return null;
  }
  const section = walk.sections.at(-1);
  if (section === undefined) {
    return { kind: 'entry-before-section', line: heading.line };
  }
  section.entries.push({ heading, lines: [] });
  return null;
}

function placeText(walk: Walk, line: RawLine, blank: boolean): ParseError | null {
  const section = walk.sections.at(-1);
  if (section === undefined) {
    if (blank) {
      return null;
    }
    return walk.title === null
      ? { kind: 'no-title', line: line.line }
      : { kind: 'text-before-first-section', line: line.line };
  }
  const container = section.entries.at(-1) ?? section;
  container.lines.push(line);
  return null;
}

/** Walk the lines once, attaching each to the title, the current section or the current entry. */
function walkLines(lines: readonly RawLine[]): Result<Walked, ParseError> {
  const walk: Walk = { title: null, sections: [] };
  for (const line of lines) {
    const classified = classify(line);
    const error =
      classified.kind === 'heading'
        ? placeHeading(walk, classified.level, classified.heading)
        : placeText(walk, line, classified.kind === 'blank');
    if (error !== null) {
      return err(error);
    }
  }
  if (walk.title === null) {
    return err({ kind: 'no-title', line: 1 });
  }
  return ok({ title: walk.title, sections: walk.sections });
}

interface StatusRead {
  readonly status: StatusLine;
  readonly body: readonly RawLine[];
}

/**
 * Read the status line from the lines under a heading: the first non-blank line, when it starts
 * with `Status:`. A line that does not is the body's first line and the status is absent.
 */
function readStatus(lines: readonly RawLine[]): StatusRead {
  const first = lines.findIndex((line) => !isBlank(line));
  const line = lines.at(first);
  if (first === -1 || line === undefined || !line.text.startsWith('Status:')) {
    return { status: { kind: 'absent' }, body: lines };
  }
  return { status: statusOf(line, lines.at(first + 1)), body: lines.slice(first + 1) };
}

/** Judge a line that starts with `Status:`: well formed and isolated, or malformed and why. */
function statusOf(line: RawLine, next: RawLine | undefined): StatusLine {
  const match = STATUS.exec(line.text);
  const word = match?.[1];
  if (word === undefined || !isStatus(word)) {
    return { kind: 'malformed', text: line.text, line: line.line, reason: 'unknown-status' };
  }
  if (next !== undefined && !isBlank(next)) {
    return { kind: 'malformed', text: line.text, line: line.line, reason: 'not-isolated' };
  }
  return {
    kind: 'present',
    status: word,
    note: match?.[2] ?? '',
    line: line.line,
    span: line.span,
  };
}

function buildEntry(builder: EntryBuilder): Entry {
  const { status, body } = readStatus(builder.lines);
  return { heading: builder.heading, status, body: parseParagraphs(body) };
}

function buildSection(builder: SectionBuilder, structure: StructureTable): Section {
  const spec = structure.sections.find((candidate) => candidate.heading === builder.heading.text);
  const { status, body } = readStatus(builder.lines);
  return {
    heading: builder.heading,
    status,
    body: spec?.body === 'list' ? parseList(body) : parseParagraphs(body),
    entries: builder.entries.map(buildEntry),
  };
}

/**
 * Parse the profile source into its document model. The structure table supplies each
 * section's body kind; a heading the table does not know parses as paragraphs and is the
 * validator's to refuse.
 */
export function parse(
  text: string,
  structure: StructureTable = PROFILE_STRUCTURE,
): Result<ProfileDocument, ParseError> {
  return map(walkLines(splitLines(text)), (walked) => ({
    title: walked.title,
    sections: walked.sections.map((section) => buildSection(section, structure)),
  }));
}

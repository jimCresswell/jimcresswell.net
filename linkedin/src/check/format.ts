/**
 * The check's text: one line per finding, a line per file, a summary. Pure; the command reads
 * the files and writes what this returns.
 *
 * @packageDocumentation
 */

import type { FileReport } from '../model/report.js';
import type { ProfileDocument } from '../model/types.js';
import type { ValidationError, ValidationNote, Where } from '../model/validate.js';

/** One file's outcome under its path: the validator's report, or the read that failed. */
export interface PathOutcome {
  readonly path: string;
  readonly outcome: FileReport | { readonly kind: 'unreadable'; readonly message: string };
}

const thousands = new Intl.NumberFormat('en-GB');

function headingAt(document: ProfileDocument, where: Where): string {
  const section = document.sections.at(where.section);
  const sectionHeading = section?.heading.text ?? `section ${String(where.section + 1)}`;
  if (where.kind === 'section') {
    return sectionHeading;
  }
  const entry = section?.entries.at(where.entry);
  return `${sectionHeading} › ${entry?.heading.text ?? `entry ${String(where.entry + 1)}`}`;
}

/** What each error kind says after the heading it is about. */
const ERROR_TEXT: Readonly<Record<ValidationError['kind'], string>> = {
  'unknown-section': 'not a profile section',
  'missing-section': 'section missing',
  'misordered-section': "out of LinkedIn's order",
  'duplicate-section': 'section repeated',
  'missing-status': 'missing status',
  'invalid-status': 'invalid status line',
  'entry-in-non-entry-section': 'entries do not belong under this section',
  'stray-line': 'a line that is not a list item',
};

/** What an error says: the heading it is about, then the fault. */
export function describeError(error: ValidationError, document: ProfileDocument): string {
  if (error.kind === 'missing-section') {
    return `${error.heading}: ${ERROR_TEXT[error.kind]}`;
  }
  const where: Where = 'where' in error ? error.where : { kind: 'section', section: error.section };
  const detail = error.kind === 'invalid-status' ? ` "${error.text}"` : '';
  return `${headingAt(document, where)}: ${ERROR_TEXT[error.kind]}${detail}`;
}

function describeNote(note: ValidationNote, document: ProfileDocument): string {
  const heading = headingAt(document, note.where);
  if (note.kind === 'count') {
    return note.limit === null
      ? `${heading}: ${thousands.format(note.count)} characters, no believed limit`
      : `${heading}: ${thousands.format(note.count)} characters of a believed ${thousands.format(note.limit)}`;
  }
  if (note.kind === 'fold') {
    return `${heading}: fold ${String(note.at)} falls in paragraph ${String(note.paragraph + 1)} at ${String(note.offset)}`;
  }
  return `${heading}: ${note.markup} markup, which LinkedIn shows as typed`;
}

/** The line an error points at, as `L12`, or `-` for a section the file lacks. */
export function lineOf(error: ValidationError): string {
  return error.kind === 'missing-section' ? '-' : `L${String(error.line)}`;
}

function noteLine(note: ValidationNote, document: ProfileDocument): string {
  if (note.kind === 'markup') {
    return `L${String(note.line)}`;
  }
  const section = document.sections.at(note.where.section);
  const holder = note.where.kind === 'entry' ? section?.entries.at(note.where.entry) : section;
  return holder === undefined ? '-' : `L${String(holder.heading.line)}`;
}

function parsedLines(report: Extract<FileReport, { kind: 'parsed' }>): readonly string[] {
  return [
    ...report.validation.errors.map(
      (error) => `error  ${lineOf(error).padEnd(5)} ${describeError(error, report.document)}`,
    ),
    ...report.validation.notes.map(
      (note) =>
        `note   ${noteLine(note, report.document).padEnd(5)} ${describeNote(note, report.document)}`,
    ),
  ];
}

/** Whether the outcome fails the check. */
export function failed(outcome: PathOutcome['outcome']): boolean {
  return outcome.kind !== 'parsed' || outcome.validation.errors.length > 0;
}

/** One file's lines: its verdict line, then one line per finding. */
export function formatOutcome({ path, outcome }: PathOutcome): string {
  if (outcome.kind === 'unreadable') {
    return `FAIL ${path}\nerror  -     ${outcome.message}\n`;
  }
  if (outcome.kind === 'unparsable') {
    const { error } = outcome;
    const line = 'line' in error ? `L${String(error.line)}` : '-';
    return `FAIL ${path}\nerror  ${line.padEnd(5)} ${error.kind}\n`;
  }
  const verdict = failed(outcome) ? 'FAIL' : 'OK';
  return [`${verdict} ${path}`, ...parsedLines(outcome)].join('\n') + '\n';
}

/** The closing line across every file. */
export function formatSummary(outcomes: readonly PathOutcome[]): string {
  const failing = outcomes.filter(({ outcome }) => failed(outcome)).length;
  const files = `${String(outcomes.length)} file${outcomes.length === 1 ? '' : 's'}`;
  return failing === 0
    ? `${files} checked, all OK\n`
    : `${files} checked, ${String(failing)} failing\n`;
}

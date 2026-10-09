/**
 * The rendering pane as a string of HTML, from the review's report, the changes against the
 * source and the fold offsets. Pure: the page sets it as the pane's content; the tests read it.
 *
 * Every paragraph carries its place in the model (`data-section`, `data-entry`,
 * `data-paragraph`), which the highlighting maps selections through.
 *
 * @packageDocumentation
 */

import { describeError, lineOf } from '../check/format.js';
import type { SectionChange } from '../model/compare.js';
import type { FileReport } from '../model/report.js';
import type { Body, Entry, Paragraph, Section, StatusLine } from '../model/types.js';
import type { Validation, ValidationNote, Where } from '../model/validate.js';

/** What the pane renders from. */
export interface RenderInput {
  readonly review: FileReport;
  readonly changes: readonly SectionChange[];
  readonly folds: readonly number[];
}

const thousands = new Intl.NumberFormat('en-GB');

/** Escape text for an HTML text node or attribute value. */
export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function badge(status: StatusLine): string {
  if (status.kind === 'present') {
    const note = status.note === '' ? '' : ` · ${escapeHtml(status.note)}`;
    return `<span class="badge status-${status.status}">${status.status}${note}</span>`;
  }
  return `<span class="badge status-invalid">${status.kind === 'absent' ? 'no status' : 'invalid status'}</span>`;
}

function sameWhere(a: Where, b: Where): boolean {
  return (
    a.kind === b.kind &&
    a.section === b.section &&
    (a.kind === 'section' || b.kind === 'section' || a.entry === b.entry)
  );
}

function countLine(notes: readonly ValidationNote[], where: Where): string {
  const count = notes.find((note) => note.kind === 'count' && sameWhere(note.where, where));
  if (count === undefined || count.kind !== 'count') {
    return '';
  }
  const limit =
    count.limit === null ? 'no believed limit' : `believed limit ${thousands.format(count.limit)}`;
  return `<span class="meta">${thousands.format(count.count)} characters · ${limit}</span>`;
}

function changedBadge(changed: boolean): string {
  return changed ? '<span class="badge changed">changed from source</span>' : '';
}

/** Split a paragraph at the fold offsets, given where it starts in its body's text. */
function paragraphHtml(
  paragraph: Paragraph,
  start: number,
  folds: readonly number[],
  where: string,
): string {
  const [first, second] = folds;
  const clip = (fold: number | undefined): number =>
    fold === undefined ? 0 : Math.min(Math.max(fold - start, 0), paragraph.text.length);
  const a = clip(first);
  const b = Math.max(clip(second), a);
  const text = paragraph.text;
  const inner =
    (a > 0 ? `<span class="fold-a">${escapeHtml(text.slice(0, a))}</span>` : '') +
    (b > a ? `<span class="fold-b">${escapeHtml(text.slice(a, b))}</span>` : '') +
    escapeHtml(text.slice(b));
  return `<p ${where}>${inner}</p>`;
}

function bodyHtml(body: Body, folds: readonly number[], where: string): string {
  if (body.kind === 'list') {
    const items = body.items.map((item) => `<li>${escapeHtml(item.text)}</li>`).join('');
    return items === '' ? '' : `<ul>${items}</ul>`;
  }
  let start = 0;
  return body.paragraphs
    .map((paragraph, index) => {
      const html = paragraphHtml(
        paragraph,
        start,
        folds,
        `${where} data-paragraph="${String(index)}"`,
      );
      start += paragraph.text.length + 2;
      return html;
    })
    .join('');
}

function entryHtml(
  entry: Entry,
  sectionIndex: number,
  entryIndex: number,
  input: RenderInput,
  validation: Validation,
): string {
  const [title, ...rest] = entry.heading.text.split(' · ');
  const meta =
    rest.length === 0 ? '' : `<div class="entry-meta">${escapeHtml(rest.join(' · '))}</div>`;
  const where: Where = { kind: 'entry', section: sectionIndex, entry: entryIndex };
  const change = input.changes.at(sectionIndex)?.entries.at(entryIndex)?.changed ?? false;
  const place = `data-section="${String(sectionIndex)}" data-entry="${String(entryIndex)}"`;
  return (
    `<article class="entry" ${place}>` +
    `<h3>${escapeHtml(title ?? '')} ${badge(entry.status)} ${changedBadge(change)}</h3>${meta}` +
    `<div class="counts">${countLine(validation.notes, where)}</div>` +
    bodyHtml(entry.body, input.folds, place) +
    '</article>'
  );
}

function isOpenAndEmpty(section: Section): boolean {
  const empty =
    section.body.kind === 'paragraphs'
      ? section.body.paragraphs.length === 0
      : section.body.items.length === 0;
  return (
    section.status.kind === 'present' &&
    section.status.status === 'open' &&
    empty &&
    section.entries.length === 0
  );
}

function sectionHtml(
  section: Section,
  index: number,
  input: RenderInput,
  validation: Validation,
): string {
  const where: Where = { kind: 'section', section: index };
  const change = input.changes.at(index)?.changed ?? false;
  const place = `data-section="${String(index)}" data-entry="-"`;
  const entries = section.entries.map((entry, entryIndex) =>
    entryHtml(entry, index, entryIndex, input, validation),
  );
  return (
    `<section ${place}>` +
    `<h2>${escapeHtml(section.heading.text)} ${badge(section.status)} ${countLine(validation.notes, where)} ${changedBadge(change)}</h2>` +
    bodyHtml(section.body, input.folds, place) +
    entries.join('') +
    '</section>'
  );
}

function openListHtml(sections: readonly Section[]): string {
  const open = sections.filter(isOpenAndEmpty);
  if (open.length === 0) {
    return '';
  }
  const items = open.map((section) => `<li>${escapeHtml(section.heading.text)}</li>`).join('');
  return `<section class="open-list"><h2>Still open</h2><ul>${items}</ul></section>`;
}

function stripHtml(report: FileReport): string {
  if (report.kind === 'unparsable') {
    const line = 'line' in report.error ? `L${String(report.error.line)}` : '-';
    return `<div class="strip strip-error"><strong>Cannot parse:</strong> ${line} ${report.error.kind}</div>`;
  }
  const { errors } = report.validation;
  if (errors.length === 0) {
    return '<div class="strip strip-ok">Structure valid</div>';
  }
  const items = errors
    .map(
      (error) => `<li>${lineOf(error)} ${escapeHtml(describeError(error, report.document))}</li>`,
    )
    .join('');
  return `<div class="strip strip-error"><strong>${String(errors.length)} structure error${errors.length === 1 ? '' : 's'}</strong><ul>${items}</ul></div>`;
}

/** Render the whole pane. */
export function renderDocument(input: RenderInput): string {
  const strip = stripHtml(input.review);
  if (input.review.kind === 'unparsable') {
    return strip;
  }
  const { document, validation } = input.review;
  const sections = document.sections
    .filter((section) => !isOpenAndEmpty(section))
    .map((section) => sectionHtml(section, document.sections.indexOf(section), input, validation));
  return strip + sections.join('') + openListHtml(document.sections);
}

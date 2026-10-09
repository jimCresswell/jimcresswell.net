/**
 * The judge of a parsed profile: structural errors against the structure table, and notes that
 * are information for the writer (counts against believed limits, where the scan folds fall,
 * markdown markup that LinkedIn would show literally). Errors fail a check; notes never do.
 *
 * @packageDocumentation
 */

import { characterCount, foldMarks, markupSightings, type Markup } from './measure.js';
import { PROFILE_STRUCTURE, type SectionSpec, type StructureTable } from './structure-table.js';
import type { Body, Entry, ProfileDocument, Section, StatusLine } from './types.js';

/** The place a finding is about: a section by index, or an entry by section and entry index. */
export type Where =
  | { readonly kind: 'section'; readonly section: number }
  | { readonly kind: 'entry'; readonly section: number; readonly entry: number };

/** A structural fault the check refuses. */
export type ValidationError =
  | { readonly kind: 'unknown-section'; readonly section: number; readonly line: number }
  | { readonly kind: 'missing-section'; readonly heading: string }
  | { readonly kind: 'misordered-section'; readonly section: number; readonly line: number }
  | { readonly kind: 'duplicate-section'; readonly section: number; readonly line: number }
  | { readonly kind: 'missing-status'; readonly where: Where; readonly line: number }
  | {
      readonly kind: 'invalid-status';
      readonly where: Where;
      readonly line: number;
      readonly text: string;
    }
  | { readonly kind: 'entry-in-non-entry-section'; readonly where: Where; readonly line: number }
  | { readonly kind: 'stray-line'; readonly where: Where; readonly line: number };

/** Information about a body: never a fault. */
export type ValidationNote =
  | {
      readonly kind: 'count';
      readonly where: Where;
      readonly count: number;
      readonly limit: number | null;
    }
  | {
      readonly kind: 'fold';
      readonly where: Where;
      readonly at: number;
      readonly paragraph: number;
      readonly offset: number;
    }
  | {
      readonly kind: 'markup';
      readonly where: Where;
      readonly line: number;
      readonly markup: Markup;
    };

/** The validator's verdict. */
export interface Validation {
  readonly errors: readonly ValidationError[];
  readonly notes: readonly ValidationNote[];
}

interface Seen {
  readonly indices: Set<number>;
  highest: number;
}

function sectionOrderError(
  section: Section,
  index: number,
  specIndex: number,
  seen: Seen,
): ValidationError | null {
  const line = section.heading.line;
  if (specIndex === -1) {
    return { kind: 'unknown-section', section: index, line };
  }
  if (seen.indices.has(specIndex)) {
    return { kind: 'duplicate-section', section: index, line };
  }
  const misordered = specIndex < seen.highest;
  seen.indices.add(specIndex);
  seen.highest = Math.max(seen.highest, specIndex);
  return misordered ? { kind: 'misordered-section', section: index, line } : null;
}

/** Unknown, duplicate and misordered sections in file order, then the table's sections the file lacks. */
function sectionErrors(
  document: ProfileDocument,
  structure: StructureTable,
): readonly ValidationError[] {
  const seen: Seen = { indices: new Set(), highest: -1 };
  const errors: ValidationError[] = [];
  for (const [index, section] of document.sections.entries()) {
    const specIndex = structure.sections.findIndex((spec) => spec.heading === section.heading.text);
    const error = sectionOrderError(section, index, specIndex, seen);
    if (error !== null) {
      errors.push(error);
    }
  }
  for (const [specIndex, spec] of structure.sections.entries()) {
    if (!seen.indices.has(specIndex)) {
      errors.push({ kind: 'missing-section', heading: spec.heading });
    }
  }
  return errors;
}

function statusErrors(
  where: Where,
  status: StatusLine,
  headingLine: number,
): readonly ValidationError[] {
  if (status.kind === 'absent') {
    return [{ kind: 'missing-status', where, line: headingLine }];
  }
  if (status.kind === 'malformed') {
    return [{ kind: 'invalid-status', where, line: status.line, text: status.text }];
  }
  return [];
}

function bodyErrors(where: Where, body: Body): readonly ValidationError[] {
  return body.kind === 'list'
    ? body.strays.map((stray) => ({ kind: 'stray-line', where, line: stray.line }))
    : [];
}

function bodyNotes(
  where: Where,
  body: Body,
  limit: number | null,
  folds: readonly number[],
): readonly ValidationNote[] {
  return [
    { kind: 'count', where, count: characterCount(body), limit },
    ...foldMarks(body, folds).map((mark) => ({ kind: 'fold' as const, where, ...mark })),
    ...markupSightings(body).map((sighting) => ({ kind: 'markup' as const, where, ...sighting })),
  ];
}

function entryFindings(
  entry: Entry,
  where: Where,
  spec: SectionSpec | undefined,
  folds: readonly number[],
): Validation {
  const allowed = spec?.entries ?? false;
  const placement: readonly ValidationError[] = allowed
    ? []
    : [{ kind: 'entry-in-non-entry-section', where, line: entry.heading.line }];
  return {
    errors: [
      ...placement,
      ...statusErrors(where, entry.status, entry.heading.line),
      ...bodyErrors(where, entry.body),
    ],
    notes: bodyNotes(where, entry.body, spec?.entryLimit ?? null, folds),
  };
}

function sectionFindings(section: Section, index: number, structure: StructureTable): Validation {
  const where: Where = { kind: 'section', section: index };
  const spec = structure.sections.find((candidate) => candidate.heading === section.heading.text);
  const entries = section.entries.map((entry, entryIndex) =>
    entryFindings(
      entry,
      { kind: 'entry', section: index, entry: entryIndex },
      spec,
      structure.folds,
    ),
  );
  return {
    errors: [
      ...statusErrors(where, section.status, section.heading.line),
      ...bodyErrors(where, section.body),
      ...entries.flatMap((finding) => finding.errors),
    ],
    notes: [
      ...bodyNotes(where, section.body, spec?.limit ?? null, structure.folds),
      ...entries.flatMap((finding) => finding.notes),
    ],
  };
}

/** Judge the document against the structure table. */
export function validate(
  document: ProfileDocument,
  structure: StructureTable = PROFILE_STRUCTURE,
): Validation {
  const perSection = document.sections.map((section, index) =>
    sectionFindings(section, index, structure),
  );
  return {
    errors: [
      ...sectionErrors(document, structure),
      ...perSection.flatMap((finding) => finding.errors),
    ],
    notes: perSection.flatMap((finding) => finding.notes),
  };
}

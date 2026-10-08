/**
 * What the owner changed: the review document against the source, section by section and entry
 * by entry, matched by heading text. A section is changed when its joined body text or its
 * status differs, so rewrapped lines never count; a section absent from the source is changed.
 *
 * @packageDocumentation
 */

import { bodyText } from './measure.js';
import type { Entry, ProfileDocument, Section, StatusLine } from './types.js';

/** Whether one entry's copy differs from the source's entry of the same heading. */
export interface EntryChange {
  readonly heading: string;
  readonly changed: boolean;
}

/** Whether one section's own copy differs, and the same for each of its entries. */
export interface SectionChange {
  readonly heading: string;
  readonly changed: boolean;
  readonly entries: readonly EntryChange[];
}

function statusKey(status: StatusLine): string {
  if (status.kind === 'present') {
    return `${status.status} (${status.note})`;
  }
  return status.kind === 'malformed' ? `malformed ${status.text}` : 'absent';
}

function holderKey(holder: Entry | Section): string {
  return `${statusKey(holder.status)}\n${bodyText(holder.body)}`;
}

function entryChange(entry: Entry, source: Section | undefined): EntryChange {
  const match = source?.entries.find((candidate) => candidate.heading.text === entry.heading.text);
  return {
    heading: entry.heading.text,
    changed: match === undefined || holderKey(match) !== holderKey(entry),
  };
}

/** Compare every section and entry of the review with its namesake in the source. */
export function compareToSource(
  source: ProfileDocument,
  review: ProfileDocument,
): readonly SectionChange[] {
  return review.sections.map((section) => {
    const match = source.sections.find(
      (candidate) => candidate.heading.text === section.heading.text,
    );
    return {
      heading: section.heading.text,
      changed: match === undefined || holderKey(match) !== holderKey(section),
      entries: section.entries.map((entry) => entryChange(entry, match)),
    };
  });
}

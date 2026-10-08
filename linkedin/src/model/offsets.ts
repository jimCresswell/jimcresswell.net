/**
 * Selection mapping between the source text and the rendered paragraphs, both ways.
 *
 * A paragraph's joined text keeps its source length, one space standing for each newline, so an
 * offset in one is the same offset in the other shifted by where the paragraph starts in the
 * source. A join space therefore maps to the newline at the end of the line before it.
 *
 * @packageDocumentation
 */

import type { Body, Paragraph, ProfileDocument, Span } from './types.js';

/** A paragraph's place in the document: its section, its entry (null at section level) and its index. */
export interface ParagraphRef {
  readonly section: number;
  readonly entry: number | null;
  readonly paragraph: number;
}

/** A half-open range of one paragraph's joined text, located in the document. */
export interface ParagraphRange {
  readonly ref: ParagraphRef;
  readonly start: number;
  readonly end: number;
}

interface Located {
  readonly ref: ParagraphRef;
  readonly paragraph: Paragraph;
}

function paragraphsOf(body: Body): readonly Paragraph[] {
  return body.kind === 'paragraphs' ? body.paragraphs : [];
}

function locate(body: Body, section: number, entry: number | null): readonly Located[] {
  return paragraphsOf(body).map((paragraph, index) => ({
    ref: { section, entry, paragraph: index },
    paragraph,
  }));
}

/** Every paragraph of the document with its reference, in file order. */
function allParagraphs(document: ProfileDocument): readonly Located[] {
  return document.sections.flatMap((section, sectionIndex) => [
    ...locate(section.body, sectionIndex, null),
    ...section.entries.flatMap((entry, entryIndex) => locate(entry.body, sectionIndex, entryIndex)),
  ]);
}

/** The paragraph a reference names, or null when the document holds none there. */
export function paragraphAt(document: ProfileDocument, ref: ParagraphRef): Paragraph | null {
  const section = document.sections.at(ref.section);
  const holder = ref.entry === null ? section : section?.entries.at(ref.entry);
  return holder === undefined ? null : (paragraphsOf(holder.body).at(ref.paragraph) ?? null);
}

/**
 * The ranges of paragraph text a source span covers: one per paragraph it overlaps, in file
 * order, each clipped to its paragraph. A collapsed span, or one over headings only, covers none.
 */
export function paragraphRangesForSourceSpan(
  document: ProfileDocument,
  span: Span,
): readonly ParagraphRange[] {
  return allParagraphs(document).flatMap(({ ref, paragraph }) => {
    const start = Math.max(span.start, paragraph.span.start);
    const end = Math.min(span.end, paragraph.span.end);
    return end > start
      ? [{ ref, start: start - paragraph.span.start, end: end - paragraph.span.start }]
      : [];
  });
}

/** The source offset of a text offset in the paragraph, clamped to the paragraph's text. */
export function sourceOffsetAt(paragraph: Paragraph, textOffset: number): number {
  return paragraph.span.start + Math.min(Math.max(textOffset, 0), paragraph.text.length);
}

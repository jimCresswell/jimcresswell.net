/**
 * What a body measures as: the text a LinkedIn field would receive, its length, where the scan
 * folds fall in it, and the markdown markup it carries that LinkedIn would show literally.
 *
 * Lengths and offsets are UTF-16 code units throughout, the unit the editor's text area and the
 * document's spans share; LinkedIn's own counting is a belief until its live editor confirms it.
 *
 * @packageDocumentation
 */

import type { Body, Paragraph } from './types.js';

/** The characters between two paragraphs in the field LinkedIn receives. */
const PARAGRAPH_BREAK = 2;

/** The text a LinkedIn field receives: paragraphs separated by a blank line, or one list item per line. */
export function bodyText(body: Body): string {
  return body.kind === 'paragraphs'
    ? body.paragraphs.map((paragraph) => paragraph.text).join('\n\n')
    : body.items.map((item) => item.text).join('\n');
}

/** The length of {@link bodyText}. */
export function characterCount(body: Body): number {
  return bodyText(body).length;
}

/** Where a fold offset lands: in which paragraph, and at which offset of its text. */
export interface FoldMark {
  readonly at: number;
  readonly paragraph: number;
  readonly offset: number;
}

function foldMark(paragraphs: readonly Paragraph[], fold: number): FoldMark | null {
  let start = 0;
  for (const [index, paragraph] of paragraphs.entries()) {
    const end = start + paragraph.text.length;
    if (fold < end) {
      return { at: fold, paragraph: index, offset: fold - start };
    }
    const last = index === paragraphs.length - 1;
    if (!last && fold < end + PARAGRAPH_BREAK) {
      return { at: fold, paragraph: index, offset: paragraph.text.length };
    }
    start = end + PARAGRAPH_BREAK;
  }
  return null;
}

/**
 * The folds that fall inside the body, each placed in its paragraph. A fold on the blank line
 * between paragraphs marks the end of the paragraph before it; a fold past the body's end marks
 * nothing. A list body has no folds.
 */
export function foldMarks(body: Body, folds: readonly number[]): readonly FoldMark[] {
  if (body.kind !== 'paragraphs') {
    return [];
  }
  return folds.flatMap((fold) => {
    const mark = foldMark(body.paragraphs, fold);
    return mark === null ? [] : [mark];
  });
}

/** Markdown that LinkedIn would show as typed, or that prettier would reshape at commit. */
export type Markup = 'emphasis' | 'link' | 'heading' | 'list-marker';

/** A markup sighting and the source line it is on. */
export interface MarkupSighting {
  readonly markup: Markup;
  readonly line: number;
}

const MARKUP_PATTERNS: readonly (readonly [Markup, RegExp])[] = [
  ['list-marker', /^(?:- |\d+\. )/],
  ['heading', /^#{1,6} /],
  ['link', /\[[^\]]+\]\([^)]+\)/],
  ['emphasis', /(?:\*\*|__)[^*_]+(?:\*\*|__)|(?:^|\s)[*_][^*_\s][^*_]*[*_](?=\s|[.,;:!?]|$)/],
];

function lineTexts(
  paragraph: Paragraph,
): readonly { readonly text: string; readonly line: number }[] {
  return paragraph.lines.map((source) => ({
    text: paragraph.text.slice(
      source.textOffset,
      source.textOffset + (source.span.end - source.span.start),
    ),
    line: source.line,
  }));
}

/** Every markup sighting in a paragraphs body, one per pattern per line, in line order. */
export function markupSightings(body: Body): readonly MarkupSighting[] {
  if (body.kind !== 'paragraphs') {
    return [];
  }
  return body.paragraphs.flatMap(lineTexts).flatMap(({ text, line }) =>
    MARKUP_PATTERNS.filter(([, pattern]) => pattern.test(text)).map(([markup]) => ({
      markup,
      line,
    })),
  );
}

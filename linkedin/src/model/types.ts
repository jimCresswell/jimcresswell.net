/**
 * The closed document model of the LinkedIn profile copy as markdown: what `parse` produces and
 * what `validate` judges. Every case is named by a discriminant; nothing is optional.
 *
 * Offsets are UTF-16 code-unit indices into the source text, which is what a text area reports
 * for a selection, so the editor maps selections through them without conversion.
 *
 * @packageDocumentation
 */

/** A half-open range of the source text: `start` inclusive, `end` exclusive. */
export interface Span {
  readonly start: number;
  readonly end: number;
}

/** A heading line: its text without the hashes, its one-based line number and its span. */
export interface Heading {
  readonly text: string;
  readonly line: number;
  readonly span: Span;
}

/** The words a status line may carry, in the order a field moves through them. */
export const STATUSES = ['approved', 'drafted', 'open'] as const;

/** One of {@link STATUSES}. */
export type Status = (typeof STATUSES)[number];

/** Whether `word` is one of {@link STATUSES}. */
export function isStatus(word: string): word is Status {
  return STATUSES.some((status) => status === word);
}

/**
 * The status line under a heading: present and well formed, present but malformed (an unknown
 * word, or text following without a blank line), or absent altogether.
 */
export type StatusLine =
  | {
      readonly kind: 'present';
      readonly status: Status;
      /** The parenthesised note after the status word, empty when there is none. */
      readonly note: string;
      readonly line: number;
      readonly span: Span;
    }
  | {
      readonly kind: 'malformed';
      readonly text: string;
      readonly line: number;
      readonly reason: 'unknown-status' | 'not-isolated';
    }
  | { readonly kind: 'absent' };

/** One source line of a paragraph: its span, and where its first character sits in the joined text. */
export interface SourceLine {
  readonly span: Span;
  readonly textOffset: number;
}

/**
 * A paragraph: its lines joined with one space per soft line break (the text a LinkedIn field
 * receives), the lines it came from, and the span from its first line's start to its last line's end.
 */
export interface Paragraph {
  readonly text: string;
  readonly lines: readonly SourceLine[];
  readonly span: Span;
}

/** A dash list item without its marker. */
export interface ListItem {
  readonly text: string;
  readonly line: number;
  readonly span: Span;
}

/** A non-blank line that fits neither of a list body's shapes. */
export interface StrayLine {
  readonly text: string;
  readonly line: number;
  readonly span: Span;
}

/** The copy under a heading: paragraphs, or a dash list (the Skills section). */
export type Body =
  | { readonly kind: 'paragraphs'; readonly paragraphs: readonly Paragraph[] }
  | {
      readonly kind: 'list';
      readonly items: readonly ListItem[];
      readonly strays: readonly StrayLine[];
    };

/** An H3 under a section: one position, item or record. */
export interface Entry {
  readonly heading: Heading;
  readonly status: StatusLine;
  readonly body: Body;
}

/** An H2 of the profile, with the entries the parser attached to it; the validator judges whether it may have any. */
export interface Section {
  readonly heading: Heading;
  readonly status: StatusLine;
  readonly body: Body;
  readonly entries: readonly Entry[];
}

/** The whole file: one title and the sections in file order. */
export interface ProfileDocument {
  readonly title: Heading;
  readonly sections: readonly Section[];
}

/**
 * The four shapes the model cannot hold. Everything else, a missing status included, is
 * represented and left for the validator.
 */
export type ParseError =
  | { readonly kind: 'no-title'; readonly line: number }
  | { readonly kind: 'second-title'; readonly line: number }
  | { readonly kind: 'text-before-first-section'; readonly line: number }
  | { readonly kind: 'entry-before-section'; readonly line: number };

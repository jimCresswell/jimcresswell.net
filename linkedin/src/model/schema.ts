/**
 * Zod schemas for every shape that crosses a boundary: the editor's request body, and the
 * server's responses as the page reads them. Each schema is held to its interface with
 * `satisfies`, so a field added to the model without its schema fails to compile.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@engraph/result';
import { z } from 'zod';

import type { FileReport } from './report.js';
import type {
  Body,
  Entry,
  Heading,
  ParseError,
  ProfileDocument,
  Section,
  Span,
  StatusLine,
} from './types.js';
import { STATUSES } from './types.js';
import type { Validation, ValidationError, ValidationNote, Where } from './validate.js';

const span = z.strictObject({
  start: z.number().int(),
  end: z.number().int(),
}) satisfies z.ZodType<Span>;

const heading = z.strictObject({
  text: z.string(),
  line: z.number().int(),
  span,
}) satisfies z.ZodType<Heading>;

const statusLine = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('present'),
    status: z.enum(STATUSES),
    note: z.string(),
    line: z.number().int(),
    span,
  }),
  z.strictObject({
    kind: z.literal('malformed'),
    text: z.string(),
    line: z.number().int(),
    reason: z.enum(['unknown-status', 'not-isolated']),
  }),
  z.strictObject({ kind: z.literal('absent') }),
]) satisfies z.ZodType<StatusLine>;

const sourceLine = z.strictObject({ line: z.number().int(), span, textOffset: z.number().int() });

const paragraph = z.strictObject({ text: z.string(), lines: z.array(sourceLine), span });

const lineItem = z.strictObject({ text: z.string(), line: z.number().int(), span });

const body = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('paragraphs'), paragraphs: z.array(paragraph) }),
  z.strictObject({ kind: z.literal('list'), items: z.array(lineItem), strays: z.array(lineItem) }),
]) satisfies z.ZodType<Body>;

const entry = z.strictObject({ heading, status: statusLine, body }) satisfies z.ZodType<Entry>;

const section = z.strictObject({
  heading,
  status: statusLine,
  body,
  entries: z.array(entry),
}) satisfies z.ZodType<Section>;

/** The document model as the server sends it. */
export const profileDocumentSchema = z.strictObject({
  title: heading,
  sections: z.array(section),
}) satisfies z.ZodType<ProfileDocument>;

const parseError = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('no-title'), line: z.number().int() }),
  z.strictObject({ kind: z.literal('second-title'), line: z.number().int() }),
  z.strictObject({ kind: z.literal('text-before-first-section'), line: z.number().int() }),
  z.strictObject({ kind: z.literal('entry-before-section'), line: z.number().int() }),
]) satisfies z.ZodType<ParseError>;

const where = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('section'), section: z.number().int() }),
  z.strictObject({ kind: z.literal('entry'), section: z.number().int(), entry: z.number().int() }),
]) satisfies z.ZodType<Where>;

const indexed = { section: z.number().int(), line: z.number().int() };
const placed = { where, line: z.number().int() };

const validationError = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('unknown-section'), ...indexed }),
  z.strictObject({ kind: z.literal('missing-section'), heading: z.string() }),
  z.strictObject({ kind: z.literal('misordered-section'), ...indexed }),
  z.strictObject({ kind: z.literal('duplicate-section'), ...indexed }),
  z.strictObject({ kind: z.literal('missing-status'), ...placed }),
  z.strictObject({ kind: z.literal('invalid-status'), ...placed, text: z.string() }),
  z.strictObject({ kind: z.literal('entry-in-non-entry-section'), ...placed }),
  z.strictObject({ kind: z.literal('stray-line'), ...placed }),
]) satisfies z.ZodType<ValidationError>;

const validationNote = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('count'),
    where,
    count: z.number().int(),
    limit: z.number().int().nullable(),
  }),
  z.strictObject({
    kind: z.literal('fold'),
    where,
    at: z.number().int(),
    paragraph: z.number().int(),
    offset: z.number().int(),
  }),
  z.strictObject({
    kind: z.literal('markup'),
    where,
    line: z.number().int(),
    markup: z.enum(['emphasis', 'link', 'heading', 'list-marker']),
  }),
]) satisfies z.ZodType<ValidationNote>;

const validation = z.strictObject({
  errors: z.array(validationError),
  notes: z.array(validationNote),
}) satisfies z.ZodType<Validation>;

/** The validator's report of one file, as the server sends it. */
export const fileReportSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('parsed'),
    text: z.string(),
    document: profileDocumentSchema,
    validation,
  }),
  z.strictObject({ kind: z.literal('unparsable'), text: z.string(), error: parseError }),
]) satisfies z.ZodType<FileReport>;

/** What `GET /api/document` answers: both files' reports and the fold offsets to shade. */
export const documentPayloadSchema = z.strictObject({
  source: fileReportSchema,
  review: fileReportSchema,
  folds: z.array(z.number().int()),
});

/** What `PUT /api/review` accepts: the review file's whole text. */
export const reviewPutBodySchema = z.strictObject({ text: z.string() });

/** Validate a value from a boundary against a schema, as a Result with the issues joined. */
export function parseWith<T>(schema: z.ZodType<T>, value: unknown): Result<T, string> {
  const outcome = schema.safeParse(value);
  if (outcome.success) {
    return ok(outcome.data);
  }
  return err(
    outcome.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; '),
  );
}

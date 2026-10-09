/**
 * The one describing surface of the validator: a file's text in, its parsed model and verdict
 * out, or the parse error when the model cannot hold it. The check prints it; the editor's
 * handler serves it.
 *
 * @packageDocumentation
 */

import { parse } from './parse.js';
import { PROFILE_STRUCTURE, type StructureTable } from './structure-table.js';
import type { ParseError, ProfileDocument } from './types.js';
import { validate, type Validation } from './validate.js';

/** What the validator says about one file's text. */
export type FileReport =
  | {
      readonly kind: 'parsed';
      readonly text: string;
      readonly document: ProfileDocument;
      readonly validation: Validation;
    }
  | { readonly kind: 'unparsable'; readonly text: string; readonly error: ParseError };

/** Parse and judge one file's text. */
export function reportFile(
  text: string,
  structure: StructureTable = PROFILE_STRUCTURE,
): FileReport {
  const parsed = parse(text, structure);
  if (!parsed.ok) {
    return { kind: 'unparsable', text, error: parsed.error };
  }
  return {
    kind: 'parsed',
    text,
    document: parsed.value,
    validation: validate(parsed.value, structure),
  };
}

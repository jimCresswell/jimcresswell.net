/**
 * Small helpers over a platform's declared fields: one-line string values keyed by the
 * field names a platform's adapter carries, plus the prose a declaration keeps verbatim
 * (the `note` after the pointer paragraph and the `pointerTail` inside it).
 *
 * @packageDocumentation
 */

import type { AdapterSource } from './adapter-sources.js';

/** A platform block: string fields, each present only when declared. */
export type DeclaredFields = Readonly<Record<string, string | undefined>>;

/** The field when the adapter carries it and it is not the default. */
export function unlessDefault(value: string | undefined, fallback: string): string | undefined {
  return value === undefined || value === fallback ? undefined : value;
}

function isEmpty(fields: DeclaredFields): boolean {
  return Object.getOwnPropertyNames(fields).length === 0;
}

/** A declared platform block, or nothing when it would be empty. */
export function block<T extends DeclaredFields>(fields: T | undefined): T | undefined {
  return fields === undefined || isEmpty(fields) ? undefined : fields;
}

/**
 * The fields with the adapter's prose attached where there is any: the pointer tail, then
 * the note unless it is the platform's standard closing (a role declares deviations only;
 * a variant passes no standard and keeps every note).
 */
export function withProse<T extends DeclaredFields>(
  fields: T,
  source: Pick<AdapterSource, 'pointerTail' | 'note'>,
  standardNote = '',
): T {
  return {
    ...fields,
    ...(source.pointerTail === '' ? {} : { pointerTail: source.pointerTail }),
    ...(source.note === '' || source.note === standardNote ? {} : { note: source.note }),
  };
}

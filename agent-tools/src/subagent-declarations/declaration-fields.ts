/**
 * Small helpers over a platform's declared fields: one-line string values keyed by the
 * field names a platform's adapter carries, plus the `note` prose a variant declares.
 *
 * @packageDocumentation
 */

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

/** The fields with the variant's prose attached when there is any. */
export function withNote<T extends DeclaredFields>(fields: T, note: string): T {
  return note === '' ? fields : { ...fields, note };
}

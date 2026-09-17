/**
 * The Result discriminated union and its two arms — in their own module so
 * the barrel and the unwrapping helpers can both import them without a
 * dependency cycle.
 */

/**
 * Result type representing either success (Ok) or failure (Err).
 * A discriminated union on `ok`: TypeScript rejects a read of `value` or
 * `error` until the union is narrowed to one arm.
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Successful result containing a value.
 */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

/**
 * Error result containing an error value.
 */
export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

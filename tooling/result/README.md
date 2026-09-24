# @engraph/result

Result<T, E> type for explicit error handling without exceptions.

## Purpose

Provides a type-safe way to handle errors without throwing exceptions. `Result<T, E>` is a discriminated union of `Ok<T>` and `Err<E>` on the `ok` field, so failure is part of a function's return type. TypeScript rejects a read of `value` or `error` from a `Result<T, E>` until the union is narrowed to one arm; checking `ok`, directly or with `isOk` or `isErr`, narrows it. The type does not make a caller handle the failure: a caller can ignore a returned `Result`, substitute a default with `unwrapOr` or `unwrapOrElse`, or call `unwrap`, which throws on an `Err`.

## Installation

The package is private to this monorepo. A consuming workspace declares it with the `workspace:` protocol in its `package.json`:

```json
{
  "dependencies": {
    "@engraph/result": "workspace:*"
  }
}
```

Then run `pnpm install` from the repository root.

## Usage

### Basic Example

```typescript
import { ok, err, type Result } from '@engraph/result';

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err('Division by zero');
  }
  return ok(a / b);
}

const result = divide(10, 2);
if (result.ok) {
  console.log('Result:', result.value); // 5
} else {
  console.error('Error:', result.error);
}
```

### Pattern Matching

Continuing the Basic Example, `isOk` and `isErr` narrow `result` as a check on `ok` does:

```typescript
import { isOk, isErr } from '@engraph/result';

if (isOk(result)) {
  // TypeScript knows result.value is available
  console.log(result.value);
}

if (isErr(result)) {
  // TypeScript knows result.error is available
  console.error(result.error);
}
```

### Chaining Operations

```typescript
import { ok, err, map, flatMap } from '@engraph/result';

const result = ok(5);

// Transform Ok values
const doubled = map(result, (x) => x * 2); // Ok(10)

// Chain Results
const chained = flatMap(result, (x) => (x > 0 ? ok(x * 2) : err('negative')));
```

### Error Transformation

```typescript
import { err, mapErr, unwrapOr } from '@engraph/result';

// Transform error type
const result = err('404');
const withCode = mapErr(result, (code) => parseInt(code, 10));

// Provide default value
const value = unwrapOr(result, 0);
```

## API

### Types

- `Result<T, E>` - `Ok<T> | Err<E>`, discriminated on `ok`
- `Ok<T>` - `{ readonly ok: true; readonly value: T }`
- `Err<E>` - `{ readonly ok: false; readonly error: E }`

### Creating Results

- `ok<T>(value: T): Ok<T>` - Create a successful result
- `err<E>(error: E): Err<E>` - Create an error result

### Type Guards

- `isOk<T, E>(result: Result<T, E>): result is Ok<T>` - Check if result is Ok
- `isErr<T, E>(result: Result<T, E>): result is Err<E>` - Check if result is Err

### Transformations

- `map<T, U, E>(result, fn)` - Transform Ok value
- `flatMap<T, U, E>(result, fn)` - Chain Results
- `mapErr<T, E, F>(result, fn)` - Transform Err value
- `collect<T, E>(results: Iterable<Result<T, E>>): Result<readonly T[], E>` - Collect every Ok value in order, or return the first Err unchanged without reading past it

### Unwrapping

- `unwrap<T, E>(result)` - Get value or throw a new `Error` whose message carries the stringified error (use sparingly)
- `unwrapOrThrow<T>(result: Result<T, Error>)` - Get value or throw the Err's own `Error`, so its message, stack and `cause` survive (use sparingly)
- `unwrapErr<T, E>(result)` - Get error or throw (unwrap's inverse, for expected failures)
- `unwrapOr<T, E>(result, defaultValue)` - Get value or default
- `unwrapOrElse<T, E>(result, fn)` - Get value or compute default

### Exhaustiveness

- `assertNeverResult<E>(value: never, makeError: (unexpected: string) => E): Err<E>` - Call in the `default` branch of an exhaustive `switch` over a discriminated union; the compiler rejects the call while a variant is unhandled, and a value that reaches it at runtime is stringified and passed to `makeError`, whose error the call returns as an `Err`

## Philosophy

Result<T, E> applies the Fail FAST and Handle All Cases Explicitly principles ([principles.md](../../.agent/directives/principles.md#code-design-and-architectural-principles)) while providing explicit error information. It makes error handling:

1. **Explicit** - Failure is part of the return type
2. **Type-safe** - `E` names the failure, and TypeScript type-checks every read of `error`
3. **Composable** - Chain operations safely
4. **Predictable** - No hidden control flow

## Integration with Boundary Validation

Result<T, E> complements validation at the boundary ([validation-strategy.md §Runtime validation at the boundary](../../.agent/directives/validation-strategy.md#runtime-validation-at-the-boundary)) by:

- Letting a validator return a failure as an `Err` instead of throwing it
- Making error states part of the type signature
- Enabling exhaustive case analysis at compile time

## Testing

Run tests with:

```bash
pnpm test
```

## License

MIT

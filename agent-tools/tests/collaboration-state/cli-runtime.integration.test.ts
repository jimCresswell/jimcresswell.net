import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createFsDirectoryWatchFactory,
  waitForAnyDirectoryChange,
} from '../../src/collaboration-state/cli-runtime';

describe('filesystem watch error and poll fallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('closes an errored fs watch and waits for the poll timer rather than waking immediately', async () => {
    let failWatch = (): void => undefined;
    let lateChange = (): void => undefined;
    let resolved = false;
    const factory = createFsDirectoryWatchFactory((_directory, _options, onChange) => {
      let open = true;
      lateChange = () => {
        if (open) {
          onChange();
        }
      };
      return {
        close: () => {
          open = false;
        },
        on: (_event, listener) => {
          failWatch = listener;
        },
      };
    });
    const wait = waitForAnyDirectoryChange({
      directories: ['/watched'],
      pollMs: 500,
      watchFactory: factory,
    }).then(() => {
      resolved = true;
    });

    failWatch(); // the observed EMFILE path emits an error after subscription
    lateChange(); // a released handle delivers nothing, so only the poll timer can wake the wait
    await vi.advanceTimersByTimeAsync(499);
    expect(resolved).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await wait;
    expect(resolved).toBe(true);
  });
});

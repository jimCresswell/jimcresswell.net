import { describe, expect, it } from 'vitest';

import { resolveWindowTokens } from './window-registry.js';

describe('resolveWindowTokens', () => {
  it('returns undefined for an unknown model', () => {
    expect(resolveWindowTokens('some-future-model')).toBeUndefined();
  });
});

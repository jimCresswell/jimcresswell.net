import { describe, expect, it } from 'vitest';

import { resolveWindowTokens } from './window-registry.js';

describe('resolveWindowTokens', () => {
  it('resolves the 1M variant from the full model id with the [1m] marker', () => {
    expect(resolveWindowTokens('claude-opus-4-8[1m]')).toBe(1_000_000);
  });

  it('resolves the 200k default for the bare model id', () => {
    expect(resolveWindowTokens('claude-opus-4-8')).toBe(200_000);
  });

  it('returns undefined for an unknown model', () => {
    expect(resolveWindowTokens('some-future-model')).toBeUndefined();
  });

  it('resolves the 1M variant of the model the arc ran on', () => {
    expect(resolveWindowTokens('claude-opus-5[1m]')).toBe(1_000_000);
  });

  it('resolves the bare default of the model the arc ran on', () => {
    expect(resolveWindowTokens('claude-opus-5')).toBe(200_000);
  });

  it('resolves the implementer seats’ model', () => {
    expect(resolveWindowTokens('claude-fable-5-1')).toBe(200_000);
  });

  it('returns undefined for a variant whose id was never observed', () => {
    expect(resolveWindowTokens('claude-fable-5-1[1m]')).toBeUndefined();
  });
});

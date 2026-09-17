import { describe, expect, it } from 'vitest';

import { buildFailOpenResponse, buildProbeResponse } from './pre-compact-response.js';

describe('buildProbeResponse', () => {
  it('answers on top-level fields only, because the harness has no PreCompact hookSpecificOutput', () => {
    const parsed: unknown = JSON.parse(buildProbeResponse('probe-1'));

    expect(parsed).toEqual({
      continue: true,
      systemMessage: '[pre-compact-observe] probe-1',
    });
  });
});

describe('buildFailOpenResponse', () => {
  it('still answers continue: true when the observation fails, and says why', () => {
    const parsed: unknown = JSON.parse(buildFailOpenResponse('disk full'));

    expect(parsed).toEqual({
      continue: true,
      systemMessage: '[pre-compact-observe] observation failed: disk full',
    });
  });
});

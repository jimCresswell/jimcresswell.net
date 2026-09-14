import { describe, expect, it } from 'vitest';

import type { MetaOutput } from '../recall-schemas.js';
import { recallNamedKills } from './recall-named-kills.js';

const meta = (recallMatches: MetaOutput['recallMatches']): MetaOutput => ({
  recallMatches,
  corroborationClaims: [],
  discountNote: 'none',
  synthesisNotes: [],
});

describe('recallNamedKills', () => {
  it('records a re-found baseline whose matched candidate was killed as recall-matched', () => {
    const kills = recallNamedKills(
      meta([
        { baselineId: 'B1', verdict: 'equal', matchedCandidateId: 'C01', note: 'equal to C01' },
      ]),
      new Set(['C01']),
      new Set(['C01']),
    );
    expect(kills.get('C01')).toEqual({ source: 'recall-matched', baselineIds: new Set(['B1']) });
  });

  it('scans notes for named kills on missed baselines only: a subsumes note naming a killed candidate does not promote it', () => {
    const kills = recallNamedKills(
      meta([
        { baselineId: 'B1', verdict: 'subsumes', matchedCandidateId: 'C01', note: 'C02 overlaps' },
        { baselineId: 'B2', verdict: 'missed', note: 'the substance lives in C02' },
      ]),
      new Set(['C01', 'C02']),
      new Set(['C02']),
    );
    expect(kills.get('C02')).toEqual({ source: 'note-named', baselineIds: new Set(['B2']) });
  });

  it("derives the mention matcher from the run's candidate ids: an id outside the C-digits shape is found, and C18 never bleeds into C185", () => {
    const kills = recallNamedKills(
      meta([
        { baselineId: 'B1', verdict: 'missed', note: 'see candidate-1 and C185' },
        { baselineId: 'B2', verdict: 'missed', note: 'C18 alone' },
      ]),
      new Set(['candidate-1', 'C18', 'C185']),
      new Set(['candidate-1', 'C18', 'C185']),
    );
    expect(kills.get('candidate-1')).toEqual({
      source: 'note-named',
      baselineIds: new Set(['B1']),
    });
    expect(kills.get('C185')).toEqual({ source: 'note-named', baselineIds: new Set(['B1']) });
    expect(kills.get('C18')).toEqual({ source: 'note-named', baselineIds: new Set(['B2']) });
  });
});

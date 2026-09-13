import { describe, expect, it } from 'vitest';

import { tallyReviewBody } from './body-tally.js';

/**
 * The body tally reads what a vendor's summary review says about itself: its
 * headline verdict and the count of findings it suppressed. Shapes verified
 * live on 2026-09-13 and 2026-09-14 (Copilot on PRs #60, #63 and #64: a
 * `### <emoji> <verdict>` first heading, a `### Suppressed comments (N)`
 * heading inside the review details).
 */

const CLOSER_LOOK = [
  '### 🔵 Needs a closer look',
  '',
  'Unresolved moderate findings remain in credential documentation.',
  '',
  '<details>',
  '<summary>Review details</summary>',
  '',
  '### Suppressed comments (6)',
  '',
  '**agent-tools/src/pr-watch/settlement.ts:162**',
  '</details>',
].join('\n');

describe('tallyReviewBody', () => {
  it('reads the headline verdict and the suppressed count from a closer-look body', () => {
    expect(tallyReviewBody(CLOSER_LOOK)).toEqual({ verdict: 'Needs a closer look', suppressed: 6 });
  });

  it('reads a changes-recommended body the same way', () => {
    const body =
      '### 🟡 Changes recommended\nUnresolved issues remain.\n### Suppressed comments (5)\n';
    expect(tallyReviewBody(body)).toEqual({ verdict: 'Changes recommended', suppressed: 5 });
  });

  it('a body with no suppressed heading tallies zero and keeps its verdict', () => {
    expect(tallyReviewBody('### ✅ Looks good\n\nNo issues found.')).toEqual({
      verdict: 'Looks good',
      suppressed: 0,
    });
  });

  it('a body with no verdict heading tallies no verdict and zero', () => {
    expect(tallyReviewBody('Reviewed 2 of 2 files.')).toEqual({ verdict: null, suppressed: 0 });
  });

  it('a suppressed heading with no count or a non-numeric count tallies zero, never NaN', () => {
    expect(tallyReviewBody('### Suppressed comments (many)').suppressed).toBe(0);
  });
});

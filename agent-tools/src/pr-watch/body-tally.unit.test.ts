import { describe, expect, it } from 'vitest';

import { suppressedFindingsPhrase, tallyReviewBody } from './body-tally.js';

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

  it('a heading led by a word keeps every word: only a leading emoji is dropped', () => {
    // A non-vendor body (a human's, another reviewer's) is quoted whole; a
    // first-token drop would have read "a closer look" and "request overview".
    expect(tallyReviewBody('### Needs a closer look').verdict).toBe('Needs a closer look');
    expect(tallyReviewBody('### Pull request overview').verdict).toBe('Pull request overview');
    expect(tallyReviewBody('### 🔵 Needs a closer look').verdict).toBe('Needs a closer look');
  });

  it('a suppressed heading whose count is not a number is not a count (zero)', () => {
    expect(tallyReviewBody('### Suppressed comments (many)').suppressed).toBe(0);
  });

  it('a count past the safe-integer range is declared but unbounded (null), never a number the gate can compare (#79 round four)', () => {
    expect(tallyReviewBody(`### Suppressed comments (${'9'.repeat(400)})`).suppressed).toBeNull();
    expect(tallyReviewBody(`### Suppressed comments (${'9'.repeat(20)})`).suppressed).toBeNull();
    expect(tallyReviewBody('### Suppressed comments (9007199254740991)').suppressed).toBe(
      9007199254740991,
    );
  });

  it('prints the count as one phrase, the unbounded case named', () => {
    expect(suppressedFindingsPhrase(null)).toBe('an unbounded count of suppressed finding(s)');
    expect(suppressedFindingsPhrase(6)).toBe('6 suppressed finding(s)');
  });

  it('a body holding only the suppressed marker tallies no verdict, never the marker as one', () => {
    expect(tallyReviewBody('<details>\n### Suppressed comments (6)\n</details>')).toEqual({
      verdict: null,
      suppressed: 6,
    });
  });

  it('the tally reads the body as shown: control and format characters are dropped before it classifies', () => {
    // An SGR escape (Cc), a zero-width space (Cf) and a bell (Cc), every one
    // written as an escape so the fixture is legible and the encoding gate
    // sees no raw control byte in the source.
    const body = '### \u{1B}[31mNeeds\u{1B}[0m a closer\u{200B} look\u{07}';
    expect(tallyReviewBody(body).verdict).toBe('[31mNeeds[0m a closer look');
  });

  it('a marker split by a zero-width mark is still the marker, never the verdict, and still counts', () => {
    const body = '### Suppressed\u{200B} comments (6)';
    expect(tallyReviewBody(body)).toEqual({ verdict: null, suppressed: 6 });
  });

  it('a heading that is only control characters is no verdict', () => {
    // A bell, an escape and a zero-width space: nothing a terminal would show.
    expect(tallyReviewBody('### \u{07}\u{1B}\u{200B}\n### Looks good').verdict).toBe('Looks good');
  });

  it('a heading that is only whitespace, or only an emoji, is no verdict (the #72 body finding)', () => {
    // Spaces and a tab after the marker, with and without a leading emoji: the
    // capture must begin and end on a non-whitespace character, and the emoji
    // alone is not a verdict.
    expect(tallyReviewBody('###    \t\n### Looks good').verdict).toBe('Looks good');
    expect(tallyReviewBody('### 🟡 \t \n### Looks good').verdict).toBe('Looks good');
    expect(tallyReviewBody('### 🟡\n### Looks good').verdict).toBe('Looks good');
  });

  it('a composed emoji heading (a joiner sequence) is no verdict; led by one it keeps its words', () => {
    // The printable pass drops the zero-width joiner, leaving the pictographs adjacent.
    expect(tallyReviewBody('### 👩\u{200D}💻\n### Looks good').verdict).toBe('Looks good');
    expect(tallyReviewBody('### 👩\u{200D}💻 Changes recommended').verdict).toBe(
      'Changes recommended',
    );
  });
});

/**
 * The body tally of `pr state` (pr-lifecycle SKILL item 2: findings count from
 * review bodies as well as threads). The instrument cannot classify prose as
 * findings, but a vendor's summary review says two things about itself in a
 * fixed shape: its headline verdict, the first `### <emoji> <verdict>` heading
 * ("Needs a closer look", "Changes recommended", "Looks good"), and the count
 * of findings it suppressed, a `### Suppressed comments (N)` heading inside the
 * review details (Copilot's shape, verified live on PRs #60, #63 and #64,
 * 2026-09-13 and 2026-09-14). The tally names both in the verdict's evidence
 * so a round whose only findings are suppressed in a closer-look body is
 * never read as zero-finding by omission, and since the owner's ruling of
 * 2026-09-14 ("block on any finding", item 78) the count holds the round
 * until each finding is dispositioned (`suppressed-hold.ts`).
 */

import { printableBlock } from './printable.js';

export interface BodyTally {
  /** The headline verdict phrase, or null when the body carries no heading. */
  readonly verdict: string | null;
  /**
   * The count the body declares as suppressed; zero when it declares none; `null` when it
   * declares one the instrument cannot bound (a digit run past the safe-integer range, which
   * `Number` would read as an unsafe integer or Infinity), so no gate compares it (#79 round
   * four, 2026-09-14).
   */
  readonly suppressed: number | null;
}

// Every `###` heading, with a leading pictographic token (an emoji, with or
// without its variation selector) removed; a heading led by a word keeps every
// word, so a non-vendor body's verdict is quoted whole. The suppressed-count
// marker is a `###` heading too and is never the verdict: a body holding only
// the marker tallies no verdict (the #67 body finding, 2026-09-14).
// Horizontal whitespace only: under the `m` flag `\s` matches a line feed, so a
// heading emptied by the strip would hand the NEXT line over as its verdict.
const HEADINGS = /^###[ \t]+(?:\p{Extended_Pictographic}\u{FE0F}?[ \t]+)?(.+?)[ \t]*$/gmu;
const SUPPRESSED = /^###[ \t]+Suppressed comments \((\d+)\)[ \t]*$/mu;
const SUPPRESSED_MARKER = /^Suppressed comments \(/u;

function headlineVerdict(body: string): string | null {
  for (const heading of body.matchAll(HEADINGS)) {
    const text = heading[1] ?? '';
    // A heading that was only control or format characters is no verdict.
    if (text !== '' && !SUPPRESSED_MARKER.test(text)) {
      return text;
    }
  }
  return null;
}

/**
 * The tally classifies and counts on the body with its control and format
 * characters dropped (printable.ts), so a marker or a verdict a zero-width
 * mark would have split is read as what it shows, and the verdict handed on
 * is already what the writers will print.
 */
export function tallyReviewBody(body: string): BodyTally {
  const shown = printableBlock(body);
  return { verdict: headlineVerdict(shown), suppressed: suppressedCount(shown) };
}

/** The count as the evidence prints it: the number, or the unbounded case named. */
export function suppressedCountLabel(count: number | null): string {
  return count === null ? 'an unbounded count of' : String(count);
}

/** The declared count as a safe integer, zero when none is declared, `null` when it cannot be bound. */
function suppressedCount(shown: string): number | null {
  const marker = SUPPRESSED.exec(shown);
  if (marker === null) {
    return 0;
  }
  const count = Number(marker[1]);
  return Number.isSafeInteger(count) ? count : null;
}

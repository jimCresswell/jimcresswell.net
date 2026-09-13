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
 * never read as zero-finding by omission; whether such findings block
 * merge-eligibility is the owner's ruling, not the instrument's.
 */

export interface BodyTally {
  /** The headline verdict phrase, or null when the body carries no heading. */
  readonly verdict: string | null;
  /** The count the body declares as suppressed; zero when it declares none. */
  readonly suppressed: number;
}

const HEADLINE = /^###\s+(?:\S+\s+)?(.+?)\s*$/mu;
const SUPPRESSED = /^###\s+Suppressed comments \((\d+)\)\s*$/mu;

/** The first `###` heading's text with any leading emoji token removed. */
function headline(body: string): string | null {
  const match = HEADLINE.exec(body);
  if (match === null) {
    return null;
  }
  const text = match[1] ?? '';
  return text === '' ? null : text;
}

export function tallyReviewBody(body: string): BodyTally {
  const suppressed = SUPPRESSED.exec(body);
  const count = suppressed === null ? 0 : Number(suppressed[1]);
  return { verdict: headline(body), suppressed: Number.isFinite(count) ? count : 0 };
}

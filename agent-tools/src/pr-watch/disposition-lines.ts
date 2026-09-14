import { isSignedSelfReply } from './reviewer-legs.js';

/**
 * The ratified disposition format, read by machine (pr-lifecycle SKILL
 * §Disposition format, the `pr-tally` node's todo 3): a comment signed as
 * `isSignedSelfReply` defines carries one line per body-only finding, and each
 * line opens with the bar marker (a bold span reading `Over-bar` or
 * `Below-bar`, with an optional scope prefix and prong suffix), then the
 * reference `head SHA:<sha> · review <id> · <anchor> · <item>` (the SHA seven
 * to forty lowercase hex, a prefix of the head), then the separator (space,
 * em dash, space) and the disposition sentence. The raised tally reads the
 * marker alone; the
 * suppressed-findings hold (`suppressed-hold.ts`) reads the sentence's verb
 * too, through {@link dispositionLifts}, the one place the sentence is read:
 * under the owner's card (item 78, 2026-09-14, "block on any finding") a cure
 * with its SHA or a reasoned rejection lifts a finding and a routing to a
 * follow-on home does not, so a routed finding still holds the merge. That
 * joining of the ratified format and the card is the Director's reading and
 * carries a REVIEW mark for the owner; the function is one place to change.
 *
 * @packageDocumentation
 */

/** One disposition line's recorded fields; the sentence is empty when the line carries no verb. */
export interface DispositionLine {
  /** Seven to forty hex characters, a prefix of the head it binds. */
  readonly headSha: string;
  readonly reviewId: string;
  readonly anchor: string;
  readonly item: string;
  readonly sentence: string;
}

// The marker: the bold span's ENTIRE text, case-insensitively, an optional
// scope prefix, exactly over-bar or below-bar, an optional prong, an optional
// stop. `**Not over-bar**` and any span with other words is no marker.
const MARKER =
  /^\*\*(?:(?:in scope|out of scope),\s+)?(?:over|below)-bar(?:\s+on prong (?:one|two))?\.?\*\*\s+/iu;
const REFERENCE = /^head SHA:([0-9a-f]{7,40}) · review (\S+) · (.+?) · (.+)$/u;
// The item ends at the first separator (space, em dash, space) and the sentence is
// everything after it: a split, never a search for the verb, so item text that happens to
// begin with a verb ("Rejected promise not awaited") is never read as the sentence, and
// no pattern runs over comment text an outsider can shape (the code-expert's measured
// super-linear pattern, 2026-09-14; the estate's S8786 posture in reviewer-legs.ts).
const SEPARATOR = ' — ';
// The verbs, anchored; the SHA bare or inside a code span, never one backtick alone, and
// closed by a non-alphanumeric so `SHA:abc1234xyz` is no cure.
const CURE = /^Cured in\s+(?:SHA:[0-9a-f]{7,40}(?!`)|`SHA:[0-9a-f]{7,40}`)(?![0-9A-Za-z])/u;
const REJECTION = /^Rejected\b/u;

/**
 * Whether a disposition sentence lifts a suppressed finding from the hold: a
 * cure naming its SHA, or a rejection, does (the rejection's rationale is the
 * convention a reader checks; the machine reads the verb); a routing, a cure
 * without its SHA, or a sentence without the verb does not.
 */
export function dispositionLifts(sentence: string): boolean {
  return CURE.test(sentence) || REJECTION.test(sentence);
}

/** The item before the first separator and the sentence after it; no separator, no sentence. */
function splitItemAndSentence(text: string): Pick<DispositionLine, 'item' | 'sentence'> {
  const at = text.indexOf(SEPARATOR);
  if (at === -1) {
    return { item: text.trim(), sentence: '' };
  }
  return { item: text.slice(0, at).trim(), sentence: text.slice(at + SEPARATOR.length).trim() };
}

/** The reference after the marker, as a line; nothing when it is malformed or names no finding. */
function parseReference(text: string): DispositionLine | undefined {
  const reference = REFERENCE.exec(text);
  if (reference === null) {
    return undefined;
  }
  const [, headSha = '', reviewId = '', anchor = '', itemAndSentence = ''] = reference;
  const rest = splitItemAndSentence(itemAndSentence);
  // A reference with an empty anchor or item names no finding; reading it as one
  // would let an empty item count as a distinct lifted finding.
  if (anchor.trim() === '' || rest.item === '') {
    return undefined;
  }
  return { headSha, reviewId, anchor: anchor.trim(), ...rest };
}

function parseLine(line: string): DispositionLine | undefined {
  const marker = MARKER.exec(line);
  return marker === null ? undefined : parseReference(line.slice(marker[0].length).trim());
}

/**
 * The disposition lines a comment carries: none unless the comment is signed,
 * then every line that opens with the bar marker and carries the reference.
 */
export function parseDispositionLines(body: string): DispositionLine[] {
  if (!isSignedSelfReply(body)) {
    return [];
  }
  // The marker is anchored at the line start: an indented line (a Markdown
  // code block quoting an example) is never a disposition line, so only the
  // line end is trimmed, for the carriage return of a CRLF body and trailing
  // spaces (#79 round five).
  return body
    .split('\n')
    .map((line) => parseLine(line.trimEnd()))
    .filter((line): line is DispositionLine => line !== undefined);
}

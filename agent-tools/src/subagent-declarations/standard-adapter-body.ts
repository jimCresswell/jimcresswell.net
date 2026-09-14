/**
 * The body every standard role adapter carries on each hand-kept surface, measured across
 * the estate's adapters on 2026-09-14 (twenty-five Cursor, twenty-one Claude and
 * twenty-five Codex adapters carry exactly these closings): the canonical title is the
 * template name in title case, the pointer sentence names the template on one line and
 * ends with a stop, and the closing prose is one fixed paragraph pair per platform. The
 * sweep declares only what deviates from this body, and the generator (closure item 6,
 * 2b-ii) renders it, so the two agree on one definition.
 *
 * @packageDocumentation
 */

import type { SourcePlatform } from './adapter-sources.js';

/** The closing prose a standard role adapter carries after its pointer, per platform. */
export const STANDARD_CLOSINGS: Readonly<Record<SourcePlatform, string>> = {
  cursor: [
    'This file is a thin Cursor adapter. The canonical reviewer instructions live in the',
    'template referenced above.',
    '',
    'Mode: Observe, analyse and report. Do not modify code.',
  ].join('\n'),
  claude: [
    'This file is a thin Claude Code adapter. The canonical reviewer instructions live in the',
    'template referenced above.',
    '',
    'Mode: Observe, analyse and report. Do not modify code.',
  ].join('\n'),
  codex: [
    'This file is a thin Codex adapter. The canonical reviewer instructions live in',
    'the template referenced above.',
    '',
    'Mode: Observe, analyse and report. Do not modify code.',
  ].join('\n'),
};

/** The title a standard adapter carries: the adapter name in title case. */
export function canonicalAdapterTitle(name: string): string {
  return name
    .split('-')
    .map((word) => `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

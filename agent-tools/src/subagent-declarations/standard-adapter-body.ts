/**
 * The two parts of the standard role-adapter body a declaration deviates from, measured
 * across the estate's adapters on 2026-09-14: the canonical title (the template name in
 * title case) and the closing prose (one fixed paragraph pair per platform; twenty-five
 * Cursor, twenty-one Claude and twenty-five Codex adapters carry exactly these). The rest
 * of the skeleton (the frontmatter key order and the `name` field, the platform's own
 * pre-pointer line, the one-line pointer sentence ending in a stop, Cursor `readonly`,
 * Codex `sandbox_mode`, `approval_policy` and the instructions block form, the registry
 * entry shape) is constant across every adapter, is not declared, and is the generator's
 * to hold (closure item 6, 2b-ii). The sweep declares only deviations from what is here.
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

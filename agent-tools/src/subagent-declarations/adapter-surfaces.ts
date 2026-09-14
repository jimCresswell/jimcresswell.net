/**
 * The three hand-kept adapter surfaces the sweep reads: where each platform keeps its
 * adapters, the extension its files carry, and the reader bound to that platform (the two
 * Markdown platforms share a reader and differ by the skeleton line before the pointer).
 *
 * @packageDocumentation
 */

import type { Result } from '@engraph/result';

import { readCodexAdapter, readMarkdownAdapter, type AdapterSource } from './adapter-sources.js';
import type { SourcePlatform } from './subagent-declaration.js';

/** One hand-kept platform surface: where its adapters live and how each is read. */
export interface AdapterSurface {
  readonly platform: SourcePlatform;
  readonly dir: string;
  readonly extension: string;
  readonly read: (relativePath: string, text: string) => Result<AdapterSource, string>;
}

/** Where each hand-kept platform keeps its adapters and how each is read. */
export const ADAPTER_SURFACES: readonly AdapterSurface[] = [
  {
    platform: 'cursor',
    dir: '.cursor/agents',
    extension: '.md',
    read: (relativePath, text) => readMarkdownAdapter('cursor', relativePath, text),
  },
  {
    platform: 'claude',
    dir: '.claude/agents',
    extension: '.md',
    read: (relativePath, text) => readMarkdownAdapter('claude', relativePath, text),
  },
  { platform: 'codex', dir: '.codex/agents', extension: '.toml', read: readCodexAdapter },
];

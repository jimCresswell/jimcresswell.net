/**
 * Extract `pnpm <script>` citations from authored text.
 *
 * Fenced blocks are scanned line by line; outside fences only inline code
 * spans are read, so a noun phrase such as "pnpm workspaces" in prose never
 * counts as a command. Each `pnpm` token starts a small tokenizer that skips
 * pass-through flags, consumes `--filter` and `run`, and stops at a shell
 * terminator; invocations that cannot be resolved to one scope (a `-C`
 * directory, a recursive run, a path or glob filter, a placeholder name, a
 * pnpm built-in) are omitted rather than guessed at.
 *
 * @packageDocumentation
 */

import { PNPM_BUILTINS } from './pnpm-builtins.js';

/** One `pnpm` command found in a code span or fenced block. */
export interface ScriptCitation {
  /** 1-based line number of the citation. */
  readonly line: number;
  /** The `pnpm …` text as written, trimmed to the parsed tokens. */
  readonly match: string;
  /** The script name the command runs. */
  readonly scriptName: string;
  /** The `--filter` target when the command names a workspace. */
  readonly workspaceFilter?: string;
}

/** Flags that consume the next token. */
const FLAGS_WITH_VALUE: ReadonlySet<string> = new Set([
  '--filter',
  '-F',
  '-C',
  '--dir',
  '--prefix',
]);

/** Flags after which the invocation cannot be resolved to one scope. */
const UNRESOLVABLE_FLAGS: ReadonlySet<string> = new Set([
  '-C',
  '--dir',
  '--prefix',
  '-r',
  '--recursive',
]);

/** Tokens that end a shell command. */
const COMMAND_TERMINATORS: ReadonlySet<string> = new Set(['&&', '||', '|', ';']);

/** A script name: word characters and dots, with colon-separated segments that never end bare. */
const SCRIPT_NAME_PATTERN = /^[A-Za-z][\w.-]*(?::[\w.-]+)*$/;
/** A shell comment token inside a fenced block ends the command text. */
const COMMENT_PREFIX = '#';
const FENCE_PATTERN = /^\s*(```|~~~)/;
const INLINE_CODE_PATTERN = /`([^`\n]+)`/g;

/**
 * Extract every `pnpm` script citation from one file's content.
 *
 * @param content - The file's UTF-8 text.
 * @returns Citations in line order.
 */
export function extractScriptCitations(content: string): readonly ScriptCitation[] {
  const citations: ScriptCitation[] = [];
  let inFence = false;
  const lines = content.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const lineText = lines[index] ?? '';
    if (FENCE_PATTERN.test(lineText)) {
      inFence = !inFence;
      continue;
    }
    const candidates = inFence ? [lineText] : inlineCodeSpans(lineText);
    for (const candidate of candidates) {
      citations.push(...citationsInCommandText(candidate, index + 1));
    }
  }
  return citations;
}

function inlineCodeSpans(lineText: string): readonly string[] {
  return [...lineText.matchAll(INLINE_CODE_PATTERN)].map((match) => match[1] ?? '');
}

/** Whitespace-split tokens up to the first shell comment. */
function commandTokens(text: string): readonly string[] {
  const tokens: string[] = [];
  for (const token of text.split(/\s+/)) {
    if (token.startsWith(COMMENT_PREFIX)) {
      break;
    }
    if (token.length > 0) {
      tokens.push(token);
    }
  }
  return tokens;
}

function citationsInCommandText(text: string, line: number): readonly ScriptCitation[] {
  const tokens = commandTokens(text);
  const citations: ScriptCitation[] = [];
  for (let index = 0; index < tokens.length; index += 1) {
    if (tokens[index] !== 'pnpm') {
      continue;
    }
    const citation = parseInvocation(tokens, index + 1, line);
    if (citation !== undefined) {
      citations.push(citation);
    }
  }
  return citations;
}

interface ParseState {
  readonly workspaceFilter?: string;
  readonly unresolvable: boolean;
}

function parseInvocation(
  tokens: readonly string[],
  start: number,
  line: number,
): ScriptCitation | undefined {
  let state: ParseState = { unresolvable: false };
  for (let index = start; index < tokens.length; index += 1) {
    const token = tokens[index] ?? '';
    if (COMMAND_TERMINATORS.has(token)) {
      return undefined;
    }
    if (token.startsWith('-')) {
      state = applyFlag(state, token, tokens[index + 1]);
      if (FLAGS_WITH_VALUE.has(token)) {
        index += 1;
      }
      continue;
    }
    if (token === 'run') {
      continue;
    }
    return citationFor(tokens.slice(start - 1, index + 1).join(' '), token, state, line);
  }
  return undefined;
}

function applyFlag(state: ParseState, flag: string, value: string | undefined): ParseState {
  const [name, inlineValue] = flag.split('=', 2);
  const flagName = name ?? flag;
  if (UNRESOLVABLE_FLAGS.has(flagName)) {
    return { ...state, unresolvable: true };
  }
  if (flagName === '--filter' || flagName === '-F') {
    const filter = inlineValue ?? value;
    return filter === undefined
      ? { ...state, unresolvable: true }
      : { ...state, workspaceFilter: filter };
  }
  return state;
}

function citationFor(
  match: string,
  token: string,
  state: ParseState,
  line: number,
): ScriptCitation | undefined {
  if (state.unresolvable || PNPM_BUILTINS.has(token) || !SCRIPT_NAME_PATTERN.test(token)) {
    return undefined;
  }
  if (state.workspaceFilter !== undefined && !isPackageName(state.workspaceFilter)) {
    return undefined;
  }
  return state.workspaceFilter === undefined
    ? { line, match, scriptName: token }
    : { line, match, scriptName: token, workspaceFilter: state.workspaceFilter };
}

/** A `--filter` value that names a package rather than a path, a glob or a placeholder. */
function isPackageName(filter: string): boolean {
  return !/[*.]{2,}|^\.{1,2}\/|\/$|[<>{}*]/.test(filter);
}

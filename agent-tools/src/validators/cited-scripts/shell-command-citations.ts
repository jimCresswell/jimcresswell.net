import { citationsInWords, type ScriptCitation } from './extract-script-citations.js';

/**
 * The `pnpm` citations in one shell command line, read as the shell reads
 * it. Prose citations keep the permissive reader in
 * `extract-script-citations.ts`; a command surface is run by a shell, so its
 * quotes are removed, and an operator or a comment counts only where it is
 * unquoted. Each simple command is read on its own: one that `echo` or
 * `printf` runs prints its words rather than running them, and the argument
 * of `sh -c`, `bash -c` or `zsh -c` is itself a command line.
 *
 * @packageDocumentation
 */

/** A word, its quotes removed, or an unquoted control operator. */
interface ShellToken {
  readonly kind: 'word' | 'operator';
  readonly text: string;
}

/** Control operators, longest first so `&&` is never read as two `&`. */
const OPERATORS = ['&&', '||', ';;', '|', ';', '&', '(', ')'] as const;
/** Commands whose arguments are printed text, so a `pnpm` among them is not run. */
const HINT_COMMANDS: ReadonlySet<string> = new Set(['echo', 'printf']);
/** Shells whose `-c` argument is a command line of its own. */
const SHELLS: ReadonlySet<string> = new Set(['sh', 'bash', 'zsh']);
/** A variable assignment ahead of a command's name (`CI=1 pnpm …`). */
const ASSIGNMENT = /^[A-Za-z_]\w*=/;

interface Lexer {
  readonly tokens: ShellToken[];
  word: string | undefined;
}

function endWord(lexer: Lexer): void {
  if (lexer.word !== undefined) {
    lexer.tokens.push({ kind: 'word', text: lexer.word });
    lexer.word = undefined;
  }
}

/** The characters a backslash escapes inside double quotes. */
const DOUBLE_QUOTE_ESCAPES: ReadonlySet<string> = new Set(['$', '`', '"', '\\']);

function appendToWord(lexer: Lexer, text: string): void {
  lexer.word = (lexer.word ?? '') + text;
}

/** Read a quoted run starting after its opening quote; returns the index after the closing one. */
function readQuoted(text: string, start: number, quote: string, lexer: Lexer): number {
  let index = start;
  let run = '';
  while (index < text.length && text.charAt(index) !== quote) {
    const escaped =
      quote === '"' &&
      text.charAt(index) === '\\' &&
      DOUBLE_QUOTE_ESCAPES.has(text.charAt(index + 1));
    run += text.charAt(escaped ? index + 1 : index);
    index += escaped ? 2 : 1;
  }
  appendToWord(lexer, run);
  return index + 1;
}

/** Read one unquoted character, or the character a backslash escapes. */
function readBare(text: string, index: number, lexer: Lexer): number {
  const escaped = text.charAt(index) === '\\';
  appendToWord(lexer, text.charAt(escaped ? index + 1 : index));
  return index + (escaped ? 2 : 1);
}

/** The unquoted operator at `index`, if one starts there. */
function operatorAt(text: string, index: number): string | undefined {
  return OPERATORS.find((operator) => text.startsWith(operator, index));
}

/** Lex what starts at `index`; returns where the next step starts. */
function lexStep(text: string, index: number, lexer: Lexer): number {
  const character = text.charAt(index);
  if (/\s/.test(character)) {
    endWord(lexer);
    return index + 1;
  }
  if (character === '#' && lexer.word === undefined) {
    return text.length;
  }
  const operator = operatorAt(text, index);
  if (operator !== undefined) {
    endWord(lexer);
    lexer.tokens.push({ kind: 'operator', text: operator });
    return index + operator.length;
  }
  return character === "'" || character === '"'
    ? readQuoted(text, index + 1, character, lexer)
    : readBare(text, index, lexer);
}

/**
 * Split a command line into words and operators as a POSIX shell does: single
 * quotes are literal, double quotes honour `\` before `$`, a backtick, `"` and
 * `\`, a backslash outside quotes escapes the next character, and a `#` that
 * starts an unquoted word begins a comment. Expansions stay as written.
 */
function shellTokens(text: string): readonly ShellToken[] {
  const lexer: Lexer = { tokens: [], word: undefined };
  let index = 0;
  while (index < text.length) {
    index = lexStep(text, index, lexer);
  }
  endWord(lexer);
  return lexer.tokens;
}

/** The simple commands of a token list: the words between operators. */
function simpleCommands(tokens: readonly ShellToken[]): readonly (readonly string[])[] {
  const commands: string[][] = [[]];
  for (const token of tokens) {
    if (token.kind === 'operator') {
      commands.push([]);
    } else {
      commands.at(-1)?.push(token.text);
    }
  }
  return commands.filter((words) => words.length > 0);
}

function citationsInSimpleCommand(
  words: readonly string[],
  line: number,
): readonly ScriptCitation[] {
  const name = words.find((word) => !ASSIGNMENT.test(word));
  if (name === undefined || HINT_COMMANDS.has(name)) {
    return [];
  }
  const commandFlag = words.indexOf('-c');
  if (SHELLS.has(name) && commandFlag !== -1) {
    const script = words[commandFlag + 1];
    return script === undefined ? [] : citationsInShellCommand(script, line);
  }
  return citationsInWords(words, line);
}

/**
 * The `pnpm` script citations in one line of shell command text, numbered
 * `line`.
 *
 * @param text - One command line, continuations already joined.
 * @param line - The line it starts on.
 * @returns Citations in the order the shell would run them.
 */
export function citationsInShellCommand(text: string, line: number): readonly ScriptCitation[] {
  return simpleCommands(shellTokens(text)).flatMap((words) =>
    citationsInSimpleCommand(words, line),
  );
}

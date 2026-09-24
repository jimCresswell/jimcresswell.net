/**
 * A template's System prompt block: the one blockquote under its `## System prompt` heading,
 * before the next heading of the same or a higher level, unquoted line by line (a bare `>`
 * line is a paragraph break). A heading inside a code fence is example text, never the
 * section's start or end. The block is carried whole or not at all: a quote that a
 * non-blank line runs on from (a lazy continuation, which Markdown reads as part of the
 * quote), or a second quote in the section, reads as none, which the reader refuses. A
 * Claude adapter whose declaration names the block carries it verbatim as its body
 * (`claude-fields.ts`), so the template is its one home.
 *
 * @packageDocumentation
 */

const HEADING = '## System prompt';
const SECTION_END = /^#{1,2}\s/u;
const ANY_HEADING = /^#{1,6}\s/u;
const FENCE = /^ {0,3}(`{3,}|~{3,})/u;

function isQuoted(line: string): boolean {
  return line.startsWith('>');
}

/** Whether each line sits outside every code fence; a fence's own lines sit inside it. */
function unfenced(lines: readonly string[]): readonly boolean[] {
  let open: string | undefined;
  return lines.map((line) => {
    const fence = FENCE.exec(line)?.[1];
    if (fence === undefined) {
      return open === undefined;
    }
    if (open === undefined) {
      open = fence;
    } else if (fence.startsWith(open)) {
      open = undefined;
    }
    return false;
  });
}

/** The lines of the System prompt section, after its heading; undefined when there is none. */
function promptSection(lines: readonly string[]): readonly string[] | undefined {
  const outside = unfenced(lines);
  const start = lines.findIndex((line, index) => outside[index] === true && line === HEADING);
  if (start === -1) {
    return undefined;
  }
  const end = lines.findIndex(
    (line, index) => index > start && outside[index] === true && SECTION_END.test(line),
  );
  return lines.slice(start + 1, end === -1 ? undefined : end);
}

/** Whether a line ends the quote before it rather than running on into it: blank, or a heading. */
function closesQuote(line: string): boolean {
  return line.trim() === '' || ANY_HEADING.test(line);
}

/**
 * The quoted run that starts the section's first quote, when it is the section's one quote
 * and nothing runs on from it; undefined otherwise.
 */
function wholeQuote(section: readonly string[], first: number): readonly string[] | undefined {
  const stop = section.findIndex((line, index) => index > first && !isQuoted(line));
  if (stop === -1) {
    return section.slice(first);
  }
  const rest = section.slice(stop);
  return closesQuote(rest[0] ?? '') && !rest.some(isQuoted)
    ? section.slice(first, stop)
    : undefined;
}

/**
 * The System prompt block of a template's Markdown body.
 *
 * @param markdown - The template's text after its frontmatter block.
 * @returns The block's text, unquoted, or undefined when the template carries none it can
 * carry whole.
 */
export function systemPromptBlock(markdown: string): string | undefined {
  const section = promptSection(markdown.split('\n')) ?? [];
  const first = section.findIndex(isQuoted);
  const quote = first === -1 ? undefined : wholeQuote(section, first);
  return quote?.map((line) => line.replace(/^> ?/u, '')).join('\n');
}

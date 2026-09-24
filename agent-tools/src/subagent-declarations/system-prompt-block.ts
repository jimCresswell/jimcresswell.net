/**
 * A template's System prompt block: the first blockquote under its `## System prompt`
 * heading, before the next heading of the same or a higher level, unquoted line by line (a
 * bare `>` line is a paragraph break). A Claude adapter whose declaration names it carries it
 * verbatim as its body (`claude-fields.ts`), so the template is its one home.
 *
 * @packageDocumentation
 */

const HEADING = '## System prompt';
const SECTION_END = /^#{1,2}\s/u;

function isQuoted(line: string): boolean {
  return line.startsWith('>');
}

/**
 * The System prompt block of a template's Markdown body.
 *
 * @param markdown - The template's text after its frontmatter block.
 * @returns The block's text, unquoted, or undefined when the template carries none.
 */
export function systemPromptBlock(markdown: string): string | undefined {
  const lines = markdown.split('\n');
  const start = lines.indexOf(HEADING);
  if (start === -1) {
    return undefined;
  }
  const after = lines.slice(start + 1);
  const end = after.findIndex((line) => SECTION_END.test(line));
  const section = end === -1 ? after : after.slice(0, end);
  const first = section.findIndex(isQuoted);
  if (first === -1) {
    return undefined;
  }
  const run = section.slice(first);
  const stop = run.findIndex((line) => !isQuoted(line));
  return (stop === -1 ? run : run.slice(0, stop))
    .map((line) => line.replace(/^> ?/u, ''))
    .join('\n');
}

/**
 * Printable text for the terminal. Evidence lines quote externally sourced
 * text (a review body's headline, a check name from a fork PR's workflow, an
 * agent-task session title, a reviewer login), and a terminal obeys control
 * sequences inside them: an escape sequence recolours or hyperlinks the line,
 * a bell rings, a format character hides text or reverses its direction. The
 * guarantee that what is written is what is read belongs to the writers, so
 * every evidence line passes through {@link printable} at the boundary where
 * it becomes terminal output (the `pr state` renderer and the merge-bot
 * reporter), and the body tally normalises a body the same way before it
 * classifies it (the 5a-iv code-expert finding, 2026-09-14).
 *
 * Dropped: every control character (`\p{Cc}`: C0 and C1, so ESC, BEL and the
 * single-byte CSI) and every format character (`\p{Cf}`: the bidi overrides
 * and isolates, zero-width marks, tag characters, the soft hyphen, which a
 * terminal never shows). Combining marks and private-use characters stay: they
 * render as noise, never as commands.
 */

const NON_PRINTABLE = /[\p{Cc}\p{Cf}]/gu;
const NON_PRINTABLE_KEEPING_LINE_FEEDS = /(?!\n)[\p{Cc}\p{Cf}]/gu;

/** One terminal line with every control and format character dropped. */
export function printable(line: string): string {
  return line.replaceAll(NON_PRINTABLE, '');
}

/** A multi-line body with every control and format character dropped, its line feeds kept. */
export function printableBlock(text: string): string {
  return text.replaceAll(NON_PRINTABLE_KEEPING_LINE_FEEDS, '');
}

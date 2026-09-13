/**
 * The JC mark for the Claude Code statusline, as multi-row glyph art.
 *
 * @remarks
 * The rows are generated from the CV logo letters — the same path the site's
 * `Logo` component draws, held in `jcdotnet/lib/logo-path.ts` — by the site
 * script `jcdotnet/scripts/statusline-logo-glyphs.ts` (run it with the site
 * workspace's `logo:statusline` package script): rasterise with sharp, measure
 * ink coverage per dot, pack into glyphs. Each style is a mark of uniform per-row display width — the
 * letters "JC" set in Roboto Condensed ExtraBold — sized to sit as a left
 * logo-column with the statusline segments flowing to its right. Terminal cells
 * are about half as wide as they are tall, so the generator derives each
 * style's column count from the letters' aspect ratio and the row count.
 *
 * The default `braille-sharp` is a five-row, fourteen-column mark; the
 * remaining styles are four-row marks. The renderer drives off the selected
 * style's own row count, so the taller default trails a bare mark row beneath
 * the four segments.
 *
 * `braille-sharp` is a four-frame cycle ({@link BRAILLE_SHARP_FRAMES}): the
 * statusline advances one frame per render, per session, via
 * {@link resolveLogoRows} — frame 0 is the canonical mark and frames 1–3 are
 * sub-dot sampling-offset variants of the same rasterisation. The frames are
 * fixed constants; only the selection changes per render. Other styles are
 * single marks.
 *
 * The marks are held here as verified constants rather than regenerated at
 * build time. Regenerate them with the generator only if the logo itself
 * changes, and paste the output over these constants.
 *
 * @packageDocumentation
 */

import { frameIndex } from './statusline-logo-cycle.js';

/** Glyph style used to draw the JC mark, or `none` to suppress it. */
export type LogoStyle =
  'braille-sharp' | 'braille-sharp-compact' | 'braille' | 'quad' | 'sextant' | 'none';

/**
 * The `braille-sharp` cycle: four five-row × fourteen-column JC marks (frame
 * ids 0–3) the statusline steps through one per render (see
 * `statusline-logo-cycle`). Frame 0 is the canonical mark; frames 1–3 sample
 * the same rasterisation at sub-dot offsets, so the letters shimmer by a few
 * marginal dots. Regenerate with the generator only if the logo changes.
 */
export const BRAILLE_SHARP_FRAMES = [
  ['⠀⠀⠀⢸⣿⣷⠀⢀⣴⣿⡿⣿⣶⡄', '⠀⠀⠀⢸⣿⣿⠀⣾⣿⠇⠀⠈⠿⠿', '⠀⠀⠀⢸⣿⣿⠀⣿⣿⠀⠀⠀⠀⠀', '⣤⣤⠀⢸⣿⡟⠀⢿⣿⡆⠀⢀⣶⣶', '⠙⢿⣷⣿⠿⠁⠀⠈⠻⣿⣷⣿⠿⠃'],
  ['⠀⠀⠀⢸⣿⡇⠀⢠⣶⣿⢿⣿⣦⡀', '⠀⠀⠀⢸⣿⡇⠀⣿⣿⠁⠀⠸⠿⠧', '⠀⠀⠀⢸⣿⡇⠀⣿⣿⠀⠀⠀⠀⠀', '⣤⣤⠀⢸⣿⡇⠀⣿⣿⡀⠀⢰⣶⡆', '⠻⢿⣷⣿⠟⠁⠀⠘⠿⣿⣾⣿⠟⠁'],
  ['⠀⠀⠀⢸⣿⣿⠀⢀⣶⣿⠿⢿⣷⡄', '⠀⠀⠀⢸⣿⣿⠀⣾⣿⠃⠀⠈⠿⠿', '⠀⠀⠀⢸⣿⣿⠀⣿⣿⠀⠀⠀⠀⠀', '⣤⣤⡀⢸⣿⡟⠀⢻⣿⡆⠀⢀⣶⣶', '⠘⠿⣿⡿⠟⠁⠀⠈⠻⠿⣿⡿⠟⠁'],
  ['⠀⠀⠀⢸⣿⡇⠀⢠⣾⡿⠿⣿⣶⡄', '⠀⠀⠀⢸⣿⡇⠀⣿⣿⠁⠀⠘⠿⠗', '⠀⠀⠀⢸⣿⡇⠀⣿⣿⠀⠀⠀⠀⠀', '⣤⣤⠀⣸⣿⡇⠀⣿⣿⡀⠀⢰⣶⡖', '⠙⠿⣿⡿⠟⠀⠀⠈⠻⢿⣿⠿⠟⠁'],
] as const satisfies readonly (readonly string[])[];

/**
 * JC marks keyed by style. Every row within a style has a uniform display
 * width — the default `braille-sharp` is five rows × fourteen columns; the
 * four-row styles are eleven columns — and each style assumes its glyphs
 * render at single-column (narrow) width so the adjacent segment column stays
 * aligned. A terminal that renders the Legacy Computing block double-width
 * would misalign the sextant column — use a braille style or `quad` there.
 *
 * - `braille-sharp` — the default: the five-row braille rasterisation at the
 *   0.5 coverage threshold. Braille Patterns (U+2800) have very wide font
 *   support. Cycles four frames; see {@link BRAILLE_SHARP_FRAMES}.
 * - `braille-sharp-compact` — four rows at a slightly lower threshold (more
 *   ink), the compact option.
 * - `braille` — four rows at a slightly higher threshold (finer strokes).
 * - `quad` — Unicode block-element quadrants (U+2580). Universal font
 *   support, chunkier.
 * - `sextant` — Unicode Symbols for Legacy Computing (U+1FB00). Sharpest, but
 *   needs a font with that block; it renders as tofu boxes otherwise.
 */
export const LOGO_ROWS: Readonly<Record<Exclude<LogoStyle, 'none'>, readonly string[]>> = {
  'braille-sharp': BRAILLE_SHARP_FRAMES[0],
  'braille-sharp-compact': ['⠀⠀⠀⣿⡇⠀⣴⡿⠿⣷⣆', '⠀⠀⠀⣿⡇⢸⣿⡇⠀⠘⠛', '⣀⡀⠀⣿⡇⢸⣿⡇⠀⢀⣀', '⠻⣿⣾⡿⠃⠀⠻⣷⣶⡿⠏'],
  braille: ['⠀⠀⠀⣿⡇⠀⣴⡿⠿⣷⣄', '⠀⠀⠀⣿⡇⢸⣿⠁⠀⠈⠉', '⣀⡀⠀⣿⡇⢸⣿⡀⠀⢀⣀', '⠻⣿⣾⡿⠁⠀⠻⣷⣶⡿⠏'],
  quad: ['   █▌ ▟█▀█▖', '   █▌▐█▘ ▝▀', '   █▌▐█▖ ▗▄', '▀█▟▛▘ ▜█▄█▘'],
  sextant: ['   █▌ 🬹🬝🬎🬺🬱', '   █▌▐█🬄 🬁🬂', '🬭🬏 █▌▐█🬏 🬞🬭', '🬊█🬻🬝🬀 🬎🬺🬹🬝🬆'],
};

/**
 * Resolve an {@link LogoStyle} from a raw configuration string, such as the
 * `PRACTICE_STATUSLINE_LOGO` environment variable. Unrecognised or absent values
 * fall back to the default `braille-sharp`; `braille-sharp-compact`, `braille`,
 * `quad`, and `sextant` are opt-in alternatives, and `none` restores the
 * single-line statusline.
 *
 * @param raw - The raw configuration value, or `undefined` when unset.
 * @returns The resolved logo style.
 */
export function resolveLogoStyle(raw: string | undefined): LogoStyle {
  if (
    raw === 'braille-sharp' ||
    raw === 'braille-sharp-compact' ||
    raw === 'braille' ||
    raw === 'quad' ||
    raw === 'sextant' ||
    raw === 'none'
  ) {
    return raw;
  }
  return 'braille-sharp';
}

/**
 * Resolve the rows to render for a logo style and cycle frame.
 *
 * Only `braille-sharp` cycles: it has four frames ({@link BRAILLE_SHARP_FRAMES})
 * and `frame` selects one, wrapping modulo the frame count (and tolerating
 * negative or fractional counters). Every other style is a single fixed mark and
 * ignores `frame`. The caller passes the raw per-session render counter; the
 * modulo reduction happens here.
 *
 * @param style - The resolved logo style (never `none`; that path renders no logo).
 * @param frame - The per-session render counter; reduced modulo the frame count.
 * @returns The mark rows to render.
 */
export function resolveLogoRows(
  style: Exclude<LogoStyle, 'none'>,
  frame: number,
): readonly string[] {
  if (style !== 'braille-sharp') {
    return LOGO_ROWS[style];
  }
  return (
    BRAILLE_SHARP_FRAMES[frameIndex(BRAILLE_SHARP_FRAMES.length, frame)] ?? BRAILLE_SHARP_FRAMES[0]
  );
}

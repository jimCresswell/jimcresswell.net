/**
 * Statusline glyph-art generator for the JC mark.
 *
 * Rasterises the CV logo letters (`lib/logo-path.ts`, the same path the site
 * logo draws) with sharp, measures the ink coverage of every dot cell, and
 * packs the dots into Braille, quadrant and sextant glyph rows for
 * `agent-tools/src/claude/logo.ts`. Terminal cells are about half as wide as
 * they are tall, so each style's column count is derived from the letters'
 * aspect ratio and the row count the statusline expects.
 *
 * Run once and commit the output into `logo.ts`:
 *
 *   pnpm --filter @jimcresswell/www logo:statusline
 */

import sharp from "sharp";
import { LOGO_LETTERS_BOUNDS, LOGO_LETTERS_PATH } from "../lib/logo-path";

/** Supersampling factor: pixels rendered per dot along each axis. */
const SUPERSAMPLE = 8;
/** Display width of one terminal cell as a fraction of its height. */
const CELL_ASPECT = 0.5;
/** Braille blank: U+2800, so rows keep a uniform display width. */
const BRAILLE_BLANK = "⠀";

interface StyleSpec {
  readonly name: string;
  readonly rows: number;
  readonly dotsX: number;
  readonly dotsY: number;
  readonly threshold: number;
  readonly pack: (bits: readonly boolean[]) => string;
}

interface Raster {
  readonly width: number;
  readonly height: number;
  readonly alpha: Uint8Array;
}

/** Braille dot bit order: left column dots 1–3 then 7, right column 4–6 then 8. */
const BRAILLE_BITS = [0x01, 0x02, 0x04, 0x40, 0x08, 0x10, 0x20, 0x80] as const;
const QUADRANTS = " ▘▝▀▖▌▞▛▗▚▐▜▄▙▟█";

function packBraille(bits: readonly boolean[]): string {
  const value = bits.reduce((acc, on, index) => (on ? acc | (BRAILLE_BITS[index] ?? 0) : acc), 0);
  return value === 0 ? BRAILLE_BLANK : String.fromCodePoint(0x2800 + value);
}

function packQuadrant(bits: readonly boolean[]): string {
  // bits arrive column-major (left column top→bottom, then right column).
  const [tl, bl, tr, br] = bits;
  const value = (tl ? 1 : 0) | (tr ? 2 : 0) | (bl ? 4 : 0) | (br ? 8 : 0);
  return QUADRANTS[value] ?? " ";
}

function packSextant(bits: readonly boolean[]): string {
  const [tl, ml, bl, tr, mr, br] = bits;
  const value =
    (tl ? 1 : 0) | (tr ? 2 : 0) | (ml ? 4 : 0) | (mr ? 8 : 0) | (bl ? 16 : 0) | (br ? 32 : 0);
  if (value === 0) return " ";
  if (value === 21) return "▌";
  if (value === 42) return "▐";
  if (value === 63) return "█";
  const gaps = (value > 21 ? 1 : 0) + (value > 42 ? 1 : 0);
  return String.fromCodePoint(0x1fb00 + value - 1 - gaps);
}

const STYLES: readonly StyleSpec[] = [
  { name: "braille-sharp", rows: 5, dotsX: 2, dotsY: 4, threshold: 0.5, pack: packBraille },
  {
    name: "braille-sharp-compact",
    rows: 4,
    dotsX: 2,
    dotsY: 4,
    threshold: 0.45,
    pack: packBraille,
  },
  { name: "braille", rows: 4, dotsX: 2, dotsY: 4, threshold: 0.55, pack: packBraille },
  { name: "quad", rows: 4, dotsX: 2, dotsY: 2, threshold: 0.5, pack: packQuadrant },
  { name: "sextant", rows: 4, dotsX: 2, dotsY: 3, threshold: 0.5, pack: packSextant },
];

/** Sub-dot sampling offsets, in dot units, for the cycling frames. */
const FRAME_OFFSETS: readonly (readonly [number, number])[] = [
  [0, 0],
  [0.35, 0],
  [0, 0.35],
  [0.35, 0.35],
];

function columnsFor(style: StyleSpec): number {
  const aspect = LOGO_LETTERS_BOUNDS.width / LOGO_LETTERS_BOUNDS.height;
  return Math.round((style.rows * aspect) / CELL_ASPECT);
}

async function rasterise(style: StyleSpec): Promise<Raster> {
  const width = style.dotsX * columnsFor(style) * SUPERSAMPLE;
  const height = style.dotsY * style.rows * SUPERSAMPLE;
  const { x, y, width: w, height: h } = LOGO_LETTERS_BOUNDS;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" ` +
    `width="${width}" height="${height}" preserveAspectRatio="none">` +
    `<path d="${LOGO_LETTERS_PATH}" fill="#000"/></svg>`;
  const { data, info } = await sharp(Buffer.from(svg))
    .resize(width, height, { fit: "fill" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = new Uint8Array(info.width * info.height);
  for (let index = 0; index < alpha.length; index += 1) {
    alpha[index] = data[index * info.channels + 3] ?? 0;
  }
  return { width: info.width, height: info.height, alpha };
}

function coverage(raster: Raster, dotX: number, dotY: number, offset: readonly [number, number]) {
  const startX = dotX * SUPERSAMPLE + Math.round(offset[0] * SUPERSAMPLE);
  const startY = dotY * SUPERSAMPLE + Math.round(offset[1] * SUPERSAMPLE);
  let total = 0;
  for (let py = startY; py < startY + SUPERSAMPLE; py += 1) {
    for (let px = startX; px < startX + SUPERSAMPLE; px += 1) {
      const inside = px >= 0 && py >= 0 && px < raster.width && py < raster.height;
      total += inside ? (raster.alpha[py * raster.width + px] ?? 0) / 255 : 0;
    }
  }
  return total / (SUPERSAMPLE * SUPERSAMPLE);
}

function packRows(style: StyleSpec, raster: Raster, offset: readonly [number, number]): string[] {
  const columns = columnsFor(style);
  const rows: string[] = [];
  for (let row = 0; row < style.rows; row += 1) {
    let line = "";
    for (let column = 0; column < columns; column += 1) {
      const bits: boolean[] = [];
      for (let dx = 0; dx < style.dotsX; dx += 1) {
        for (let dy = 0; dy < style.dotsY; dy += 1) {
          const dotX = column * style.dotsX + dx;
          const dotY = row * style.dotsY + dy;
          bits.push(coverage(raster, dotX, dotY, offset) >= style.threshold);
        }
      }
      line += style.pack(bits);
    }
    rows.push(line);
  }
  return rows;
}

function literal(rows: readonly string[]): string {
  return `[${rows.map((row) => `'${row}'`).join(", ")}]`;
}

async function main(): Promise<void> {
  const out: string[] = [];
  const [sharpStyle, ...singles] = STYLES;
  if (sharpStyle === undefined) return;
  const sharpRaster = await rasterise(sharpStyle);
  const frames = FRAME_OFFSETS.map((offset) => packRows(sharpStyle, sharpRaster, offset));
  const distinct = new Set(frames.map((frame) => frame.join("\n"))).size;
  if (distinct !== frames.length) {
    throw new Error(`braille-sharp frames are not all distinct (${distinct}/${frames.length})`);
  }
  out.push("BRAILLE_SHARP_FRAMES = [");
  for (const frame of frames) out.push(`  ${literal(frame)},`);
  out.push("]", "LOGO_ROWS = {");
  for (const style of singles) {
    const rows = packRows(style, await rasterise(style), [0, 0]);
    out.push(`  '${style.name}': ${literal(rows)},`);
  }
  out.push("}");
  process.stdout.write(`${out.join("\n")}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});

/**
 * Static icon/favicon generator
 *
 * Generates static SVG and PNG files for favicons, apple touch icons,
 * and logos. Run once during development, commit the output.
 *
 * Usage:
 *   pnpm generate:icons
 *
 * Output:
 *   public/favicon-light.svg
 *   public/favicon-dark.svg
 *   public/apple-icon-light.png
 *   public/apple-icon-dark.png
 *   public/og-image.png
 */

import * as fs from "fs";
import * as path from "path";
import fontkit from "fontkit";
import sharp from "sharp";

// Import shared theme colors
const themeConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../spec/theme.json"), "utf-8")
);

// Configuration - colors from spec/theme.json
const CONFIG = {
  text: "JC",
  fontPath: "logo/RobotoCondensed-ExtraBold.ttf",
  outputDir: "public",
  themes: {
    // For favicon: dark icon on light mode, light icon on dark mode
    light: {
      background: themeConfig.colors.light.foreground, // charcoal circle
      foreground: themeConfig.colors.light.background, // off-white text
    },
    dark: {
      background: themeConfig.colors.dark.foreground, // cream circle
      foreground: themeConfig.colors.dark.background, // dark text
    },
  },
  sizes: {
    favicon: 512, // SVG scales, but we set a viewBox size
    appleTouch: 180,
    ogImage: { width: 1200, height: 630 },
  },
};

/**
 * Generate SVG path from text using fontkit
 * Returns a single pre-transformed path string (no nested transforms)
 */
function getIconPath(
  font: fontkit.Font,
  text: string,
  dimension: number
): string {
  const fontSize = dimension * 0.8;
  const scale = fontSize / font.unitsPerEm;

  // Get glyph run for layout
  const run = font.layout(text);
  const glyphs = run.glyphs;
  const positions = run.positions;

  // Calculate bounding box of all glyphs for accurate centering
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  let currentX = 0;

  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    const pos = positions[i];
    const bbox = glyph.bbox;

    if (bbox) {
      minX = Math.min(minX, currentX + bbox.minX);
      maxX = Math.max(maxX, currentX + bbox.maxX);
      minY = Math.min(minY, bbox.minY);
      maxY = Math.max(maxY, bbox.maxY);
    }

    currentX += pos.xAdvance;
  }

  // Calculate centering offsets
  const textWidth = (maxX - minX) * scale;
  const textHeight = (maxY - minY) * scale;
  const offsetX = (dimension - textWidth) / 2 - minX * scale;
  const offsetY = (dimension + textHeight) / 2 - maxY * scale;

  // Build single combined path with pre-transformed coordinates
  const pathData: string[] = [];
  currentX = 0;

  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    const pos = positions[i];
    const glyphX = currentX + pos.xOffset;

    // Transform each command in the glyph path
    for (const cmd of (glyph.path as any).commands) {
      switch (cmd.command) {
        case "moveTo": {
          const x = (glyphX + cmd.args[0]) * scale + offsetX;
          const y = dimension - (cmd.args[1] * scale + offsetY);
          pathData.push(`M${x.toFixed(2)} ${y.toFixed(2)}`);
          break;
        }
        case "lineTo": {
          const x = (glyphX + cmd.args[0]) * scale + offsetX;
          const y = dimension - (cmd.args[1] * scale + offsetY);
          pathData.push(`L${x.toFixed(2)} ${y.toFixed(2)}`);
          break;
        }
        case "quadraticCurveTo": {
          const x1 = (glyphX + cmd.args[0]) * scale + offsetX;
          const y1 = dimension - (cmd.args[1] * scale + offsetY);
          const x2 = (glyphX + cmd.args[2]) * scale + offsetX;
          const y2 = dimension - (cmd.args[3] * scale + offsetY);
          pathData.push(`Q${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)}`);
          break;
        }
        case "bezierCurveTo": {
          const x1 = (glyphX + cmd.args[0]) * scale + offsetX;
          const y1 = dimension - (cmd.args[1] * scale + offsetY);
          const x2 = (glyphX + cmd.args[2]) * scale + offsetX;
          const y2 = dimension - (cmd.args[3] * scale + offsetY);
          const x3 = (glyphX + cmd.args[4]) * scale + offsetX;
          const y3 = dimension - (cmd.args[5] * scale + offsetY);
          pathData.push(
            `C${x1.toFixed(2)} ${y1.toFixed(2)} ${x2.toFixed(2)} ${y2.toFixed(2)} ${x3.toFixed(2)} ${y3.toFixed(2)}`
          );
          break;
        }
        case "closePath":
          pathData.push("Z");
          break;
      }
    }

    currentX += pos.xAdvance;
  }

  return pathData.join("");
}

/**
 * Generate circular icon SVG
 */
function generateIconSvg(
  iconPath: string,
  dimension: number,
  background: string,
  foreground: string
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}">
  <circle cx="${dimension / 2}" cy="${dimension / 2}" r="${dimension / 2}" fill="${background}"/>
  <path d="${iconPath}" fill="${foreground}"/>
</svg>`;
}

/**
 * Generate OG image SVG (rectangular with centered logo)
 */
function generateOgImageSvg(
  iconPath: string,
  width: number,
  height: number,
  background: string,
  foreground: string,
  iconSize: number
): string {
  const offsetX = (width - iconSize) / 2;
  const offsetY = (height - iconSize) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  <g transform="translate(${offsetX}, ${offsetY})">
    <circle cx="${iconSize / 2}" cy="${iconSize / 2}" r="${iconSize / 2}" fill="${foreground}" opacity="0.1"/>
    <path d="${iconPath}" fill="${foreground}"/>
  </g>
</svg>`;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function main() {
  console.log("🎨 Generating static icons...\n");

  // Load font
  const fontPath = path.resolve(CONFIG.fontPath);
  if (!fs.existsSync(fontPath)) {
    console.error(`❌ Font not found: ${fontPath}`);
    console.error(
      "   Please ensure the font file exists at the configured path."
    );
    process.exit(1);
  }

  const font = fontkit.openSync(fontPath);
  ensureDir(CONFIG.outputDir);

  // Generate favicon SVGs for each theme
  const faviconPath = getIconPath(font, CONFIG.text, CONFIG.sizes.favicon);

  for (const [themeName, colors] of Object.entries(CONFIG.themes)) {
    const svg = generateIconSvg(
      faviconPath,
      CONFIG.sizes.favicon,
      colors.background,
      colors.foreground
    );

    const filename = `favicon-${themeName}.svg`;
    const outputPath = path.join(CONFIG.outputDir, filename);
    fs.writeFileSync(outputPath, svg);
    console.log(`✅ ${filename}`);
  }

  // Generate apple touch icon SVGs and PNGs for each theme
  const applePath = getIconPath(font, CONFIG.text, CONFIG.sizes.appleTouch);

  for (const [themeName, colors] of Object.entries(CONFIG.themes)) {
    const svg = generateIconSvg(
      applePath,
      CONFIG.sizes.appleTouch,
      colors.background,
      colors.foreground
    );

    const svgFilename = `apple-icon-${themeName}.svg`;
    const svgOutputPath = path.join(CONFIG.outputDir, svgFilename);
    fs.writeFileSync(svgOutputPath, svg);
    console.log(`✅ ${svgFilename}`);

    // Convert to PNG
    const pngFilename = `apple-icon-${themeName}.png`;
    const pngOutputPath = path.join(CONFIG.outputDir, pngFilename);
    await sharp(Buffer.from(svg))
      .png()
      .resize(CONFIG.sizes.appleTouch, CONFIG.sizes.appleTouch)
      .toFile(pngOutputPath);
    console.log(`✅ ${pngFilename}`);
  }

  // Generate OG image SVG and PNG (dark background, light text - works on most social platforms)
  const ogIconSize = 300;
  const ogPath = getIconPath(font, CONFIG.text, ogIconSize);
  const ogSvg = generateOgImageSvg(
    ogPath,
    CONFIG.sizes.ogImage.width,
    CONFIG.sizes.ogImage.height,
    themeConfig.colors.dark.background, // dark background (#1c1917)
    themeConfig.colors.dark.foreground, // light text/icon (#f5f5f4)
    ogIconSize
  );

  const ogSvgFilename = "og-image.svg";
  fs.writeFileSync(path.join(CONFIG.outputDir, ogSvgFilename), ogSvg);
  console.log(`✅ ${ogSvgFilename}`);

  // Convert OG image to PNG
  const ogPngFilename = "og-image.png";
  await sharp(Buffer.from(ogSvg))
    .png()
    .resize(CONFIG.sizes.ogImage.width, CONFIG.sizes.ogImage.height)
    .toFile(path.join(CONFIG.outputDir, ogPngFilename));
  console.log(`✅ ${ogPngFilename}`);

  console.log("\n📁 Output directory:", path.resolve(CONFIG.outputDir));
  console.log("\n✨ Done!");
}

main().catch(console.error);

/**
 * Static icon/favicon generator
 *
 * Generates all required icons for web standards compliance:
 * - Favicons (SVG with dark mode support)
 * - Apple Touch Icon (PNG, 180x180 - iOS requirement)
 * - PWA manifest icons (PNG, 192x192 and 512x512)
 * - Open Graph image (PNG, 1200x630)
 *
 * Run once during development, commit the output.
 *
 * Usage:
 *   pnpm generate:icons
 *
 * Output (in public/icons/):
 *   favicon.svg          - Multi-theme favicon with CSS media query
 *   apple-touch-icon.png - iOS home screen icon (180x180)
 *   icon-192.png         - PWA manifest icon
 *   icon-512.png         - PWA manifest icon / splash screen
 *   og-image.png         - Social sharing image (1200x630)
 */

import * as fs from "fs";
import * as path from "path";
import fontkit from "fontkit";
import sharp from "sharp";

// Import shared theme colors
const themeConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../spec/theme.json"), "utf-8")
);

// Configuration
const CONFIG = {
  text: "JC",
  fontPath: "logo/RobotoCondensed-ExtraBold.ttf",
  outputDir: "public/icons",
  colors: {
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
    favicon: 512, // SVG viewBox (scales to any size)
    appleTouch: 180, // iOS standard
    pwa192: 192, // PWA manifest
    pwa512: 512, // PWA manifest / splash
    ogImage: { width: 1200, height: 630 },
  },
};

/**
 * Generate SVG path from text using fontkit
 * Returns a single pre-transformed path string
 */
function getIconPath(font: fontkit.Font, text: string, dimension: number): string {
  const fontSize = dimension * 0.8;
  const scale = fontSize / font.unitsPerEm;

  const run = font.layout(text);
  const glyphs = run.glyphs;
  const positions = run.positions;

  // Calculate bounding box for centering
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

  // Build path with pre-transformed coordinates
  const pathData: string[] = [];
  currentX = 0;

  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];
    const pos = positions[i];
    const glyphX = currentX + pos.xOffset;

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
 * Generate favicon SVG with CSS media query for dark mode support
 * Single file that adapts to user's color scheme preference
 */
function generateFaviconSvg(
  iconPathLight: string,
  iconPathDark: string,
  dimension: number
): string {
  const { light, dark } = CONFIG.colors;
  const r = dimension / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}">
  <style>
    .bg { fill: ${light.background}; }
    .fg { fill: ${light.foreground}; }
    @media (prefers-color-scheme: dark) {
      .bg { fill: ${dark.background}; }
      .fg { fill: ${dark.foreground}; }
    }
  </style>
  <circle class="bg" cx="${r}" cy="${r}" r="${r}"/>
  <path class="fg" d="${iconPathLight}"/>
</svg>`;
}

/**
 * Generate simple icon SVG (single theme)
 */
function generateIconSvg(
  iconPath: string,
  dimension: number,
  background: string,
  foreground: string
): string {
  const r = dimension / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}">
  <circle cx="${r}" cy="${r}" r="${r}" fill="${background}"/>
  <path d="${iconPath}" fill="${foreground}"/>
</svg>`;
}

/**
 * Generate OG image SVG
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
  const r = iconSize / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${background}"/>
  <g transform="translate(${offsetX}, ${offsetY})">
    <circle cx="${r}" cy="${r}" r="${r}" fill="${foreground}" opacity="0.1"/>
    <path d="${iconPath}" fill="${foreground}"/>
  </g>
</svg>`;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generatePng(
  svgContent: string,
  outputPath: string,
  width: number,
  height: number
): Promise<void> {
  await sharp(Buffer.from(svgContent)).png().resize(width, height).toFile(outputPath);
}

async function main() {
  console.log("🎨 Generating static icons...\n");

  // Load font
  const fontPath = path.resolve(CONFIG.fontPath);
  if (!fs.existsSync(fontPath)) {
    console.error(`❌ Font not found: ${fontPath}`);
    process.exit(1);
  }

  const font = fontkit.openSync(fontPath);
  ensureDir(CONFIG.outputDir);

  const { light, dark } = CONFIG.colors;

  // 1. Favicon with dark mode support (single SVG)
  const faviconPath = getIconPath(font, CONFIG.text, CONFIG.sizes.favicon);
  const faviconSvg = generateFaviconSvg(faviconPath, faviconPath, CONFIG.sizes.favicon);
  fs.writeFileSync(path.join(CONFIG.outputDir, "favicon.svg"), faviconSvg);
  console.log("✅ favicon.svg (with dark mode support)");

  // 2. Apple Touch Icon (PNG required for iOS, use dark theme for contrast)
  const applePath = getIconPath(font, CONFIG.text, CONFIG.sizes.appleTouch);
  const appleSvg = generateIconSvg(
    applePath,
    CONFIG.sizes.appleTouch,
    light.background,
    light.foreground
  );
  await generatePng(
    appleSvg,
    path.join(CONFIG.outputDir, "apple-touch-icon.png"),
    CONFIG.sizes.appleTouch,
    CONFIG.sizes.appleTouch
  );
  console.log("✅ apple-touch-icon.png (180x180)");

  // 3. PWA manifest icons (use dark theme for better visibility)
  const pwa192Path = getIconPath(font, CONFIG.text, CONFIG.sizes.pwa192);
  const pwa192Svg = generateIconSvg(
    pwa192Path,
    CONFIG.sizes.pwa192,
    light.background,
    light.foreground
  );
  await generatePng(
    pwa192Svg,
    path.join(CONFIG.outputDir, "icon-192.png"),
    CONFIG.sizes.pwa192,
    CONFIG.sizes.pwa192
  );
  console.log("✅ icon-192.png (PWA manifest)");

  const pwa512Path = getIconPath(font, CONFIG.text, CONFIG.sizes.pwa512);
  const pwa512Svg = generateIconSvg(
    pwa512Path,
    CONFIG.sizes.pwa512,
    light.background,
    light.foreground
  );
  await generatePng(
    pwa512Svg,
    path.join(CONFIG.outputDir, "icon-512.png"),
    CONFIG.sizes.pwa512,
    CONFIG.sizes.pwa512
  );
  console.log("✅ icon-512.png (PWA manifest / splash)");

  // 4. Open Graph image (dark background for social platforms)
  const ogIconSize = 300;
  const ogPath = getIconPath(font, CONFIG.text, ogIconSize);
  const ogSvg = generateOgImageSvg(
    ogPath,
    CONFIG.sizes.ogImage.width,
    CONFIG.sizes.ogImage.height,
    dark.foreground, // Use dark theme: light bg (#f5f5f4)
    dark.background, // dark text (#1c1917)
    ogIconSize
  );
  await generatePng(
    ogSvg,
    path.join(CONFIG.outputDir, "og-image.png"),
    CONFIG.sizes.ogImage.width,
    CONFIG.sizes.ogImage.height
  );
  console.log("✅ og-image.png (1200x630)");

  console.log("\n📁 Output:", path.resolve(CONFIG.outputDir));
  console.log("\n✨ Done!");
}

main().catch(console.error);

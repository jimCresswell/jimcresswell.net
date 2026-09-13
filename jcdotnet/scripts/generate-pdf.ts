import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import pino from "pino";
import puppeteer from "puppeteer";
import { getBlobPath, getDeployKey, PDF_FILENAME } from "../lib/pdf-config";
import { attachBuiltSite, bindFreePort } from "./built-site-server";
import { put } from "@vercel/blob";

// ---------------------------------------------------------------------------
// Logger — level controlled by LOG_LEVEL env var (default: "info")
// ---------------------------------------------------------------------------

const log = pino({
  name: "generate-pdf",
  level: process.env.LOG_LEVEL ?? "info",
  transport: process.stdout.isTTY
    ? { target: "pino/file", options: { destination: 1 } }
    : undefined,
});

// ---------------------------------------------------------------------------
// Storage: Blob (Vercel) or local disk
// ---------------------------------------------------------------------------

// @vercel/blob is imported dynamically so the module is never loaded when
// running locally without a token. All blob operations are gated on this flag.
const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * Store the PDF in Blob (when token is available) or write to disk.
 * @returns The Blob URL or local file path where the PDF was written.
 */
async function storePdf(pdf: Buffer, blobPath: string): Promise<string> {
  if (hasBlobToken) {
    log.debug({ blobPath }, "Uploading PDF to Vercel Blob");
    const blob = await put(blobPath, pdf, {
      access: "public",
      contentType: "application/pdf",
      allowOverwrite: true,
    });
    log.info({ url: blob.url, blobPath }, "PDF uploaded to Vercel Blob");
    return blob.url;
  }

  // Local fallback — write into .next/ (which is .gitignored).
  const localPath = path.resolve(process.cwd(), ".next", PDF_FILENAME);
  log.debug({ localPath }, "Writing PDF to local disk");
  await fs.writeFile(localPath, pdf);
  log.info({ localPath }, "PDF written to local disk");
  return localPath;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Probe the system for Chrome dependency info (best-effort). */
async function logSystemInfo(): Promise<void> {
  log.debug(
    {
      platform: os.platform(),
      arch: os.arch(),
      release: os.release(),
      nodeVersion: process.version,
    },
    "System info"
  );

  // Try to list shared-library dependencies of the Chrome binary.
  try {
    const chromePath = await puppeteer.executablePath();
    log.debug({ chromePath }, "Puppeteer executable path");

    // Check the binary exists without relying on platform shell utilities.
    try {
      const stat = await fs.stat(chromePath);
      log.debug(
        {
          chromePath,
          size: stat.size,
          mode: stat.mode,
          modifiedAt: stat.mtime.toISOString(),
          isFile: stat.isFile(),
        },
        "Chrome binary stat"
      );
    } catch (e) {
      log.warn({ chromePath, error: String(e) }, "Could not stat Chrome binary");
    }

    // On Linux, probe ldd for missing shared libraries.
    if (os.platform() === "linux") {
      try {
        const ldd = execSync(`ldd "${chromePath}" 2>&1`, {
          encoding: "utf-8",
        });
        const missing = ldd.split("\n").filter((line) => line.includes("not found"));
        if (missing.length > 0) {
          log.warn({ missing }, "Missing shared libraries for Chrome");
        } else {
          log.debug("All shared libraries for Chrome are present");
        }
      } catch (e) {
        log.debug({ error: String(e) }, "ldd probe failed (may not be available)");
      }
    }
  } catch (e) {
    log.debug({ error: String(e) }, "Could not determine Puppeteer executable");
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const deployKey = getDeployKey(
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.VERCEL_DEPLOYMENT_ID
  );
  const blobPath = getBlobPath(deployKey);

  log.info({ deployKey, blobPath, hasBlobToken }, "Starting PDF generation");
  log.debug(
    {
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
      VERCEL_DEPLOYMENT_ID: process.env.VERCEL_DEPLOYMENT_ID,
    },
    "Vercel environment variables"
  );

  await logSystemInfo();

  // Bind a free port and keep the socket until the PDF is stored: the build is served from
  // this process through Next's custom-server API, so no other process can be handed the
  // port and the page rendered is this build's (built-site-server.ts).
  const bound = await bindFreePort();
  const origin = `http://localhost:${bound.port}`;

  log.info({ port: bound.port, origin }, "Serving the build from the bound port");
  const close = await attachBuiltSite(bound);

  try {
    log.info("Server ready. Launching Puppeteer...");

    const launchArgs = ["--no-sandbox", "--disable-setuid-sandbox"];
    log.debug({ headless: true, args: launchArgs }, "Puppeteer launch options");

    const browser = await puppeteer.launch({
      // Full Chrome in new headless mode — required for accessible, tagged
      // PDFs with correct font rendering. See ADR-001 for rationale and
      // rejected alternatives (@sparticuz/chromium, headless shell).
      headless: true,
      args: launchArgs,
    });

    log.debug("Browser launched successfully");

    try {
      const page = await browser.newPage();
      const cvUrl = `${origin}/cv`;
      log.debug({ url: cvUrl }, "Navigating to CV page");

      await page.goto(cvUrl, { waitUntil: "networkidle0" });
      log.debug("Page loaded (networkidle0)");

      // Ensure web fonts (Inter, Literata) have finished loading.
      await page.evaluate(() => document.fonts.ready);
      log.debug("Fonts loaded");

      const pdf = await page.pdf({
        printBackground: true,
        preferCSSPageSize: true, // respects @page { size: A4; margin: 18mm 20mm; }
      });

      const sizeKB = (pdf.length / 1024).toFixed(1);
      log.info({ sizeKB }, "PDF generated");

      const destination = await storePdf(Buffer.from(pdf), blobPath);
      log.info({ destination }, "PDF stored");
    } finally {
      await browser.close();
      log.debug("Browser closed");
    }
  } finally {
    await close();
    log.debug("Closed the site's socket");
  }
}

main().catch((err: unknown) => {
  log.fatal({ err }, "Fatal error");
  process.exit(1);
});

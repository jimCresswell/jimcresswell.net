import { execSync, spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs/promises";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import pino from "pino";
import puppeteer from "puppeteer";
import { getBlobPath, getDeployKey, PDF_FILENAME } from "../lib/pdf-config";

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
    const { put } = await import("@vercel/blob");
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

/** Find a free TCP port. */
function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const addr = srv.address();
      if (!addr || typeof addr === "string") {
        reject(new Error("Could not determine port"));
        return;
      }
      const port = addr.port;
      srv.close(() => resolve(port));
    });
    srv.on("error", reject);
  });
}

/** Poll until the server responds with 200. */
async function waitForServer(
  url: string,
  { timeout = 30_000, interval = 500 } = {}
): Promise<void> {
  const start = Date.now();
  let attempts = 0;
  while (Date.now() - start < timeout) {
    attempts++;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) {
        log.debug({ url, attempts, elapsedMs: Date.now() - start }, "Server ready");
        return;
      }
      log.debug({ url, status: res.status, attempts }, "Server not ready yet");
    } catch {
      // Server not ready yet — expected during startup.
      if (attempts % 10 === 0) {
        log.debug({ url, attempts }, "Server not responding yet");
      }
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}

/** Probe the system for Chrome dependency info (best-effort). */
function logSystemInfo(): void {
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
    const chromePath = puppeteer.executablePath();
    log.debug({ chromePath }, "Puppeteer executable path");

    // Check the binary exists.
    try {
      const stat = execSync(`ls -la "${chromePath}"`, { encoding: "utf-8" });
      log.debug({ stat: stat.trim() }, "Chrome binary stat");
    } catch (e) {
      log.warn({ chromePath, error: String(e) }, "Chrome binary not found");
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

  logSystemInfo();

  const port = await getFreePort();
  const origin = `http://localhost:${port}`;

  log.info({ port, origin }, "Starting Next.js server");

  // Resolve the next binary from node_modules (pnpm requirement — never npx).
  const nextBin = path.resolve(process.cwd(), "node_modules", ".bin", "next");
  log.debug({ nextBin }, "Next.js binary path");

  const server: ChildProcess = spawn(nextBin, ["start", "-p", String(port)], {
    stdio: "pipe",
    env: { ...process.env, PORT: String(port) },
  });

  // Forward server output for build log visibility.
  server.stdout?.on("data", (d: Buffer) => process.stdout.write(d));
  server.stderr?.on("data", (d: Buffer) => process.stderr.write(d));

  try {
    await waitForServer(`${origin}/cv`);
    log.info("Server ready. Launching Puppeteer...");

    const launchArgs = ["--no-sandbox", "--disable-setuid-sandbox"];
    log.debug({ headless: true, args: launchArgs }, "Puppeteer launch options");

    const browser = await puppeteer.launch({
      // Full Chrome in new headless mode — required for accessible, tagged
      // PDFs with correct font rendering (see ADR-001).
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
    server.kill("SIGTERM");
    log.debug("Sent SIGTERM to Next.js server");
    // Give the server a moment to shut down gracefully.
    await new Promise((r) => setTimeout(r, 1_000));
  }
}

main().catch((err: unknown) => {
  log.fatal({ err }, "Fatal error");
  process.exit(1);
});

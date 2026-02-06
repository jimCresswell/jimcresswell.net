import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import puppeteer from "puppeteer";
import { getDeployKey, getBlobPath, PDF_FILENAME } from "../lib/pdf-config";

// ---------------------------------------------------------------------------
// Storage: Blob (Vercel) or local disk
// ---------------------------------------------------------------------------

// @vercel/blob is imported dynamically so the module is never loaded when
// running locally without a token. All blob operations are gated on this flag.
const hasBlobToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * Check whether this deploy's PDF already exists in Blob.
 * Returns false when running locally (no token).
 * Fails fast on unexpected errors (auth, network).
 */
async function pdfExistsInBlob(blobPath: string): Promise<boolean> {
  if (!hasBlobToken) return false;
  const { head, BlobNotFoundError } = await import("@vercel/blob");
  try {
    await head(blobPath);
    return true;
  } catch (error: unknown) {
    if (error instanceof BlobNotFoundError) return false;
    throw error;
  }
}

/**
 * Store the PDF in Blob (when token is available) or write to disk.
 * @returns The Blob URL or local file path where the PDF was written.
 */
async function storePdf(pdf: Buffer, blobPath: string): Promise<string> {
  if (hasBlobToken) {
    const { put } = await import("@vercel/blob");
    const blob = await put(blobPath, pdf, {
      access: "public",
      contentType: "application/pdf",
    });
    return blob.url;
  }

  // Local fallback — write into .next/ (which is .gitignored).
  const localPath = path.resolve(process.cwd(), ".next", PDF_FILENAME);
  await fs.writeFile(localPath, pdf);
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
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return;
    } catch {
      // Server not ready yet — expected during startup.
    }
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
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

  // Skip if this deploy's PDF already exists in Blob (idempotent).
  if (await pdfExistsInBlob(blobPath)) {
    console.log(`[generate-pdf] PDF already exists at ${blobPath}, skipping.`);
    return;
  }

  const port = await getFreePort();
  const origin = `http://localhost:${port}`;

  console.log(`[generate-pdf] Starting Next.js on port ${port}...`);

  // Resolve the next binary from node_modules (pnpm requirement — never npx).
  const nextBin = path.resolve(process.cwd(), "node_modules", ".bin", "next");

  const server: ChildProcess = spawn(nextBin, ["start", "-p", String(port)], {
    stdio: "pipe",
    env: { ...process.env, PORT: String(port) },
  });

  // Forward server output for build log visibility.
  server.stdout?.on("data", (d: Buffer) => process.stdout.write(d));
  server.stderr?.on("data", (d: Buffer) => process.stderr.write(d));

  try {
    await waitForServer(`${origin}/cv`);
    console.log("[generate-pdf] Server ready. Launching Puppeteer...");

    const browser = await puppeteer.launch({
      // Use "shell" mode for compatibility with serverless build environments
      // (e.g. Vercel) where system libraries for full Chrome may be absent.
      // The headless shell uses the same Blink rendering engine — PDF output
      // is identical.
      headless: "shell",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.goto(`${origin}/cv`, { waitUntil: "networkidle0" });

      // Ensure web fonts (Inter, Literata) have finished loading.
      await page.evaluate(() => document.fonts.ready);

      const pdf = await page.pdf({
        printBackground: true,
        preferCSSPageSize: true, // respects @page { size: A4; margin: 18mm 20mm; }
      });

      console.log(`[generate-pdf] PDF generated (${(pdf.length / 1024).toFixed(1)} KB).`);

      const destination = await storePdf(Buffer.from(pdf), blobPath);
      console.log(`[generate-pdf] Stored: ${destination}`);
    } finally {
      await browser.close();
    }
  } finally {
    server.kill("SIGTERM");
    // Give the server a moment to shut down gracefully.
    await new Promise((r) => setTimeout(r, 1_000));
  }
}

main().catch((err: unknown) => {
  console.error("[generate-pdf] Fatal error:", err);
  process.exit(1);
});

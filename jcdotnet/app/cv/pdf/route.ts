import { type NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import { head, BlobNotFoundError } from "@vercel/blob";
import { getDeployKey, getBlobPath, getLocalPdfPath, PDF_FILENAME } from "@/lib/pdf-config";

export const runtime = "nodejs";

const PDF_UNAVAILABLE_PATH = "/cv/pdf/unavailable";

/**
 * Attempt to load the PDF from Vercel Blob.
 * Returns the PDF as a Buffer, or null if unavailable.
 * Fails fast on unexpected errors (auth, network).
 */
async function loadFromBlob(blobPath: string): Promise<Buffer | null> {
  try {
    const meta = await head(blobPath);
    const response = await fetch(meta.url);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch (error: unknown) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

/**
 * Attempt to load the PDF from the local filesystem.
 * Returns the PDF as a Buffer, or null if the file does not exist.
 */
async function loadFromFilesystem(localPath: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(localPath);
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

/** Serve the pre-generated CV PDF from Vercel Blob or the local filesystem. */
export async function GET(request: NextRequest): Promise<Response> {
  const origin = request.nextUrl.origin;

  const deployKey = getDeployKey(
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.VERCEL_DEPLOYMENT_ID
  );
  const blobPath = getBlobPath(deployKey);

  // Try Blob first (production), then local filesystem (local builds).
  let pdf: Buffer | null = null;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    pdf = await loadFromBlob(blobPath);
  }

  if (!pdf) {
    const localPath = getLocalPdfPath(process.cwd());
    pdf = await loadFromFilesystem(localPath);
  }

  if (!pdf) {
    return NextResponse.redirect(new URL(PDF_UNAVAILABLE_PATH, origin), 302);
  }

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${PDF_FILENAME}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

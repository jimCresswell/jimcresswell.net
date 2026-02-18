/**
 * Derive the canonical deploy key for PDF versioning.
 *
 * Prefers the git commit SHA (most stable), falls back to the
 * Vercel deployment ID, then to "local" for local builds.
 *
 * @param commitSha - Value of VERCEL_GIT_COMMIT_SHA, if set
 * @param deploymentId - Value of VERCEL_DEPLOYMENT_ID, if set
 * @returns A non-empty string identifying this deployment
 */
export function getDeployKey(commitSha?: string, deploymentId?: string): string {
  return commitSha || deploymentId || "local";
}

/**
 * Build the versioned Blob storage path for a deployment's PDF.
 *
 * @param deployKey - The deploy key from {@link getDeployKey}
 * @returns A path like `pdf/cv-abc123.pdf`
 */
export function getBlobPath(deployKey: string): string {
  return `pdf/cv-${deployKey}.pdf`;
}

import cvContent from "../content/cv.content.json";

/** Human-readable filename derived from the person's name in cv.content.json. */
export const PDF_FILENAME = `${cvContent.meta.name.replace(/\s+/g, "-")}-CV.pdf`;

/**
 * Build the absolute path to the locally generated PDF.
 *
 * After a local build (without Blob), the PDF is written to
 * `.next/Jim-Cresswell-CV.pdf` in the project root.
 *
 * @param cwd - The current working directory (project root)
 * @returns Absolute path to the local PDF file
 */
export function getLocalPdfPath(cwd: string): string {
  return `${cwd}/.next/${PDF_FILENAME}`;
}

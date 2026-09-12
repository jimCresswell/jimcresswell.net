import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { ensureDirectory } from "./shared";

export const WORKTREE_REF = "WORKTREE";

export interface ResolvedSnapshotSource {
  kind: "git-ref" | "working-tree";
  requestedRef: string;
  resolvedRef: string;
  extractionMethod: "git archive" | "git archive + worktree overlay";
}

/**
 * Resolve a ref-like string to a commit hash without mutating the repository.
 *
 * @param repositoryRoot Repository to read from.
 * @param refLike Git ref-like to resolve.
 */
export async function resolveRef(repositoryRoot: string, refLike: string): Promise<string> {
  return runAndCapture("git", ["rev-parse", "--verify", `${refLike}^{commit}`], repositoryRoot);
}

/**
 * Resolve a comparison source, including the special WORKTREE snapshot mode.
 *
 * WORKTREE is anchored to the current checked-out `HEAD` commit for provenance,
 * then overlaid with tracked and untracked working-tree changes during export.
 *
 * @param repositoryRoot Repository to read from.
 * @param refLike Git ref-like or `WORKTREE`.
 */
export async function resolveSnapshotSource(
  repositoryRoot: string,
  refLike: string
): Promise<ResolvedSnapshotSource> {
  if (refLike === WORKTREE_REF) {
    return {
      kind: "working-tree",
      requestedRef: refLike,
      resolvedRef: await resolveRef(repositoryRoot, "HEAD"),
      extractionMethod: "git archive + worktree overlay",
    };
  }

  return {
    kind: "git-ref",
    requestedRef: refLike,
    resolvedRef: await resolveRef(repositoryRoot, refLike),
    extractionMethod: "git archive",
  };
}

/**
 * Export one comparison source into a standalone directory.
 *
 * Git refs are exported via `git archive`. The special `WORKTREE` source starts
 * from an archive of `HEAD` and overlays the current tracked, staged,
 * unstaged, and untracked working-tree changes.
 *
 * @param repositoryRoot Source repository root.
 * @param refLike Git ref-like to export, or `WORKTREE`.
 * @param outputDirectory Destination directory for the exported tree.
 */
export async function exportRefToDirectory(
  repositoryRoot: string,
  refLike: string,
  outputDirectory: string
): Promise<string> {
  if (refLike === WORKTREE_REF) {
    return exportWorkingTreeToDirectory(repositoryRoot, outputDirectory);
  }

  const resolvedRef = await resolveRef(repositoryRoot, refLike);
  await exportGitRefToDirectory(repositoryRoot, resolvedRef, outputDirectory);
  return resolvedRef;
}

async function exportGitRefToDirectory(
  repositoryRoot: string,
  resolvedRef: string,
  outputDirectory: string
): Promise<void> {
  await fs.rm(outputDirectory, { recursive: true, force: true });
  await ensureDirectory(outputDirectory);

  await new Promise<void>((resolve, reject) => {
    const archive = spawn("git", ["archive", "--format=tar", resolvedRef], {
      cwd: repositoryRoot,
      stdio: ["ignore", "pipe", "inherit"],
    });
    const extract = spawn("tar", ["-xf", "-", "-C", outputDirectory], {
      cwd: repositoryRoot,
      stdio: ["pipe", "inherit", "inherit"],
    });

    archive.stdout.pipe(extract.stdin);

    let archiveExited = false;
    let extractExited = false;

    const finish = () => {
      if (archiveExited && extractExited) {
        resolve();
      }
    };

    archive.on("error", reject);
    extract.on("error", reject);

    archive.on("exit", (code, signal) => {
      if (code !== 0) {
        reject(
          new Error(
            `git archive failed for ${resolvedRef} with code ${code ?? "null"} and signal ${signal ?? "null"}`
          )
        );
        return;
      }

      archiveExited = true;
      finish();
    });

    extract.on("exit", (code, signal) => {
      if (code !== 0) {
        reject(
          new Error(
            `tar extraction failed for ${resolvedRef} with code ${code ?? "null"} and signal ${signal ?? "null"}`
          )
        );
        return;
      }

      extractExited = true;
      finish();
    });
  });
}

async function exportWorkingTreeToDirectory(
  repositoryRoot: string,
  outputDirectory: string
): Promise<string> {
  const resolvedHead = await resolveRef(repositoryRoot, "HEAD");
  await exportGitRefToDirectory(repositoryRoot, resolvedHead, outputDirectory);

  const changedPaths = await listRepositoryPaths(repositoryRoot, [
    "diff",
    "--name-only",
    "--no-renames",
    "-z",
    "HEAD",
    "--",
  ]);
  const untrackedPaths = await listRepositoryPaths(repositoryRoot, [
    "ls-files",
    "--others",
    "--exclude-standard",
    "-z",
  ]);
  const overlayPaths = new Set([...changedPaths, ...untrackedPaths]);

  for (const relativePath of overlayPaths) {
    const sourcePath = path.join(repositoryRoot, relativePath);
    const outputPath = path.join(outputDirectory, relativePath);

    if (await pathExists(sourcePath)) {
      await ensureDirectory(path.dirname(outputPath));
      await fs.cp(sourcePath, outputPath, { force: true, recursive: true });
      continue;
    }

    await fs.rm(outputPath, { recursive: true, force: true });
  }

  return resolvedHead;
}

async function listRepositoryPaths(repositoryRoot: string, args: string[]): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    const child = spawn("git", args, {
      cwd: repositoryRoot,
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code !== 0) {
        reject(
          new Error(
            `git ${args.join(" ")} failed in ${path.resolve(repositoryRoot)} with code ${code ?? "null"} and signal ${signal ?? "null"}\n${stderr}`.trim()
          )
        );
        return;
      }

      resolve(stdout.split("\0").filter(Boolean));
    });
  });
}

async function runAndCapture(
  command: string,
  args: string[],
  workingDirectory: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let stdout = "";
    let stderr = "";

    const child = spawn(command, args, {
      cwd: workingDirectory,
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve(stdout.trim());
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} failed in ${path.resolve(workingDirectory)} with code ${code ?? "null"} and signal ${signal ?? "null"}\n${stderr}`.trim()
        )
      );
    });
  });
}

async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

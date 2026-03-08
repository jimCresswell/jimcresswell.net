import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { ensureDirectory } from "./shared";

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
 * Export one git ref into a standalone directory using `git archive`.
 *
 * This is deliberately non-destructive. It reads from git objects only and
 * never touches the caller's worktree, index, branches, or history.
 *
 * @param repositoryRoot Source repository root.
 * @param refLike Git ref-like to export.
 * @param outputDirectory Destination directory for the exported tree.
 */
export async function exportRefToDirectory(
  repositoryRoot: string,
  refLike: string,
  outputDirectory: string
): Promise<string> {
  const resolvedRef = await resolveRef(repositoryRoot, refLike);

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
            `git archive failed for ${refLike} with code ${code ?? "null"} and signal ${signal ?? "null"}`
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
            `tar extraction failed for ${refLike} with code ${code ?? "null"} and signal ${signal ?? "null"}`
          )
        );
        return;
      }

      extractExited = true;
      finish();
    });
  });

  return resolvedRef;
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

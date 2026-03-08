import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";
import { exportRefToDirectory, resolveRef, WORKTREE_REF } from "./export-ref";

const temporaryDirectories: string[] = [];

describe("exportRefToDirectory", () => {
  afterEach(async () => {
    await Promise.all(
      temporaryDirectories
        .splice(0)
        .map((directoryPath) => fs.rm(directoryPath, { recursive: true, force: true }))
    );
  });

  it("exports WORKTREE as the current repo state including unstaged and untracked files", async () => {
    const repositoryRoot = await createRepository({
      "staged.txt": "before\n",
      "tracked.txt": "base\n",
      "removed.txt": "remove me\n",
    });
    const outputRoot = await fs.mkdtemp(path.join(os.tmpdir(), "visual-regression-export-output-"));
    temporaryDirectories.push(outputRoot);
    const outputDirectory = path.join(outputRoot, "exported-worktree");

    await fs.writeFile(path.join(repositoryRoot, "staged.txt"), "staged change\n");
    await runCommand("git", ["add", "staged.txt"], repositoryRoot);
    await fs.writeFile(path.join(repositoryRoot, "tracked.txt"), "changed\n");
    await fs.rm(path.join(repositoryRoot, "removed.txt"));
    await fs.writeFile(path.join(repositoryRoot, "untracked.txt"), "draft\n");

    const resolvedWorktreeHead = await exportRefToDirectory(
      repositoryRoot,
      WORKTREE_REF,
      outputDirectory
    );

    expect(resolvedWorktreeHead).toBe(await resolveRef(repositoryRoot, "HEAD"));
    expect(await fs.readFile(path.join(outputDirectory, "staged.txt"), "utf8")).toBe(
      "staged change\n"
    );
    expect(await fs.readFile(path.join(outputDirectory, "tracked.txt"), "utf8")).toBe("changed\n");
    expect(await fileExists(path.join(outputDirectory, "removed.txt"))).toBe(false);
    expect(await fs.readFile(path.join(outputDirectory, "untracked.txt"), "utf8")).toBe("draft\n");
  });
});

async function createRepository(files: Record<string, string>): Promise<string> {
  const repositoryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "visual-regression-export-test-"));
  temporaryDirectories.push(repositoryRoot);

  for (const [relativePath, contents] of Object.entries(files)) {
    const absolutePath = path.join(repositoryRoot, relativePath);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, contents, "utf8");
  }

  await runCommand("git", ["init", "-q"], repositoryRoot);
  await runCommand("git", ["config", "user.name", "Codex"], repositoryRoot);
  await runCommand("git", ["config", "user.email", "codex@example.invalid"], repositoryRoot);
  await runCommand("git", ["add", "."], repositoryRoot);
  await runCommand(
    "git",
    ["-c", "commit.gpgsign=false", "commit", "-q", "-m", "initial"],
    repositoryRoot
  );

  return repositoryRoot;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function runCommand(
  command: string,
  args: string[],
  workingDirectory: string
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: workingDirectory,
      stdio: "ignore",
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} failed in ${workingDirectory} with code ${code ?? "null"} and signal ${signal ?? "null"}`
        )
      );
    });
  });
}

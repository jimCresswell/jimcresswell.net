import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import { captureSiteArtifacts } from "./capture";
import { compareArtifactSets } from "./compare";
import { exportRefToDirectory, resolveRef } from "./export-ref";
import {
  ensureDirectory,
  REGRESSION_ARTIFACTS_DIR,
  sanitiseLabel,
  VISUAL_REGRESSION_HARNESS_DIR,
} from "./shared";

/**
 * Compare two git refs using exported snapshots rather than worktrees.
 *
 * The harness is intentionally non-destructive:
 * - it resolves refs via `git rev-parse`
 * - it exports snapshots via `git archive`
 * - it never modifies the caller's worktree, index, refs, or history
 *
 * @param options Comparison configuration.
 */
export async function compareRefs(options: {
  repositoryRoot: string;
  baseRef: string;
  targetRef: string;
  outputDirectory?: string;
  basePort?: number;
  targetPort?: number;
}): Promise<string> {
  const repositoryRoot = path.resolve(options.repositoryRoot);
  const resolvedBaseRef = await resolveRef(repositoryRoot, options.baseRef);
  const resolvedTargetRef = await resolveRef(repositoryRoot, options.targetRef);

  const outputDirectory =
    options.outputDirectory ??
    path.resolve(
      repositoryRoot,
      REGRESSION_ARTIFACTS_DIR,
      VISUAL_REGRESSION_HARNESS_DIR,
      `${sanitiseLabel(options.baseRef)}-vs-${sanitiseLabel(options.targetRef)}`
    );

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "visual-regression-harness-"));
  const exportedBaseDirectory = path.join(tempRoot, "base");
  const exportedTargetDirectory = path.join(tempRoot, "target");
  const basePort = options.basePort ?? 3200;
  const targetPort = options.targetPort ?? 3201;

  await ensureDirectory(outputDirectory);

  await fs.writeFile(
    path.join(outputDirectory, "comparison.json"),
    `${JSON.stringify(
      {
        baseRef: options.baseRef,
        targetRef: options.targetRef,
        resolvedBaseRef,
        resolvedTargetRef,
        safety: {
          gitHistoryChanged: false,
          callerWorktreeTouched: false,
          extractionMethod: "git archive",
        },
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  if (resolvedBaseRef === resolvedTargetRef) {
    await fs.writeFile(
      path.join(outputDirectory, "summary.txt"),
      "Base and target resolve to the same commit. No comparison run was needed.\n",
      "utf8"
    );
    return outputDirectory;
  }

  let baseServer: ChildProcess | undefined;
  let targetServer: ChildProcess | undefined;

  try {
    await exportRefToDirectory(repositoryRoot, options.baseRef, exportedBaseDirectory);
    await exportRefToDirectory(repositoryRoot, options.targetRef, exportedTargetDirectory);

    await ensureDependencies(exportedBaseDirectory);
    await ensureDependencies(exportedTargetDirectory);

    await runCommand("pnpm", ["build"], exportedBaseDirectory);
    await runCommand("pnpm", ["build"], exportedTargetDirectory);

    baseServer = await startServer(exportedBaseDirectory, basePort);
    targetServer = await startServer(exportedTargetDirectory, targetPort);

    const baselineArtifactsDirectory = path.join(outputDirectory, "baseline");
    const targetArtifactsDirectory = path.join(outputDirectory, "target");
    const diffArtifactsDirectory = path.join(outputDirectory, "diff");

    await captureSiteArtifacts({
      baseUrl: `http://127.0.0.1:${basePort}`,
      outputDirectory: baselineArtifactsDirectory,
    });
    await captureSiteArtifacts({
      baseUrl: `http://127.0.0.1:${targetPort}`,
      outputDirectory: targetArtifactsDirectory,
    });

    await compareArtifactSets({
      baselineDirectory: baselineArtifactsDirectory,
      targetDirectory: targetArtifactsDirectory,
      outputDirectory: diffArtifactsDirectory,
    });

    return outputDirectory;
  } finally {
    await stopServer(baseServer);
    await stopServer(targetServer);
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function ensureDependencies(workingDirectory: string): Promise<void> {
  const nodeModulesDirectory = path.join(workingDirectory, "node_modules");
  const hasNodeModules = await directoryExists(nodeModulesDirectory);

  if (hasNodeModules) {
    return;
  }

  await runCommand("pnpm", ["install", "--frozen-lockfile"], workingDirectory, {
    HUSKY: "0",
  });
}

async function directoryExists(directoryPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(directoryPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function runCommand(
  command: string,
  args: string[],
  workingDirectory: string,
  extraEnv: Record<string, string | undefined> = {}
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: workingDirectory,
      env: {
        ...process.env,
        ...extraEnv,
      },
      stdio: "inherit",
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

async function startServer(workingDirectory: string, port: number): Promise<ChildProcess> {
  const child = spawn("pnpm", ["exec", "next", "start", "-p", String(port)], {
    cwd: workingDirectory,
    stdio: "inherit",
  });

  await waitForServer(`http://127.0.0.1:${port}`);
  return child;
}

async function waitForServer(serverUrl: string): Promise<void> {
  const timeoutMs = 30_000;
  const intervalMs = 500;
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(serverUrl, { method: "HEAD" });
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet.
    }

    await sleep(intervalMs);
  }

  throw new Error(`Server at ${serverUrl} did not become ready within ${timeoutMs}ms`);
}

async function stopServer(child: ChildProcess | undefined): Promise<void> {
  if (!child || child.exitCode !== null) {
    return;
  }

  child.kill("SIGTERM");

  const deadline = Date.now() + 5_000;
  while (child.exitCode === null && Date.now() < deadline) {
    await sleep(100);
  }

  if (child.exitCode === null) {
    child.kill("SIGKILL");
  }
}

async function sleep(durationMs: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, durationMs));
}

import path from "node:path";
import { Command } from "commander";
import { compareRefs } from "./compare-refs";
import { parseVisualRegressionConfiguration } from "./configuration";

interface CliOptions {
  repoRoot: string;
  outputDir?: string;
  basePort?: number;
  targetPort?: number;
}

/**
 * Run the visual-regression command with repository policy supplied by an
 * external adapter.
 *
 * @param options Command arguments and unknown repository configuration.
 * @returns The directory containing the comparison artefacts.
 */
export async function runVisualRegressionCli(options: {
  configuration: unknown;
  argv?: readonly string[];
}): Promise<string> {
  const configuration = parseVisualRegressionConfiguration(options.configuration);
  const program = new Command();
  let comparisonOutputDirectory: string | undefined;

  program
    .name("visual-regression-harness")
    .description(
      "Non-destructive visual and HTML/DOM regression harness for comparing two git refs, or any git ref against the special WORKTREE source."
    )
    .argument("<baseRef>", "base git ref-like to compare against, or WORKTREE")
    .argument("<targetRef>", "target git ref-like to compare to the base, or WORKTREE")
    .option("--repo-root <path>", "repository root to read from", process.cwd())
    .option("--output-dir <path>", "directory for generated artifacts")
    .option("--base-port <port>", "port for the base snapshot server", parseInteger)
    .option("--target-port <port>", "port for the target snapshot server", parseInteger)
    .action(async (baseRef: string, targetRef: string, cliOptions: CliOptions) => {
      comparisonOutputDirectory = await compareRefs({
        repositoryRoot: path.resolve(cliOptions.repoRoot),
        baseRef,
        targetRef,
        configuration,
        outputDirectory: cliOptions.outputDir ? path.resolve(cliOptions.outputDir) : undefined,
        basePort: cliOptions.basePort,
        targetPort: cliOptions.targetPort,
      });
    });

  if (options.argv) {
    await program.parseAsync([...options.argv], { from: "user" });
  } else {
    await program.parseAsync(process.argv);
  }

  if (!comparisonOutputDirectory) {
    throw new Error("Visual regression comparison did not produce an output directory.");
  }

  return comparisonOutputDirectory;
}

function parseInteger(value: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid integer value: ${value}`);
  }

  return parsed;
}

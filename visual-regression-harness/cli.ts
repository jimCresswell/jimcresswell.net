import path from "node:path";
import { Command } from "commander";
import { compareRefs } from "./compare-refs";

interface CliOptions {
  repoRoot: string;
  outputDir?: string;
  basePort?: number;
  targetPort?: number;
}

const program = new Command();

program
  .name("visual-regression-harness")
  .description("Non-destructive visual and HTML/DOM regression harness for comparing two git refs.")
  .argument("<baseRef>", "base git ref-like to compare against")
  .argument("<targetRef>", "target git ref-like to compare to the base")
  .option("--repo-root <path>", "repository root to read from", process.cwd())
  .option("--output-dir <path>", "directory for generated artifacts")
  .option("--base-port <port>", "port for the base snapshot server", parseInteger)
  .option("--target-port <port>", "port for the target snapshot server", parseInteger)
  .action(async (baseRef: string, targetRef: string, options: CliOptions) => {
    const outputDirectory = await compareRefs({
      repositoryRoot: path.resolve(options.repoRoot),
      baseRef,
      targetRef,
      outputDirectory: options.outputDir ? path.resolve(options.outputDir) : undefined,
      basePort: options.basePort,
      targetPort: options.targetPort,
    });

    process.stdout.write(`${outputDirectory}\n`);
  });

void program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});

function parseInteger(value: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid integer value: ${value}`);
  }

  return parsed;
}

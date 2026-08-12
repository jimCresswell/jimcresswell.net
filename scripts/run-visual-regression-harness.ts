import { visualRegressionConfiguration } from "../visual-regression.config";
import { runVisualRegressionCli } from "../visual-regression-harness/cli";

void runVisualRegressionCli({ configuration: visualRegressionConfiguration })
  .then((outputDirectory) => {
    process.stdout.write(`${outputDirectory}\n`);
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });

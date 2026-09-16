import type {
  IAvailableTranspiler,
  ICruiseOptions,
  ICruiseResult,
  IEnvironmentIssue,
  IViolation,
} from 'dependency-cruiser';
import { describe, expect, it } from 'vitest';

import { runDepcruiseGate, type DepcruiseGateRuntime } from './repo-check-depcruise.js';
import { depcruiseSummaryFailures } from './repo-check-depcruise-verdict.js';

/**
 * The dependency-cruiser gate's composition root, driven through its injected
 * runtime. The configuration reader, the tsconfig extractor, the cruise, the
 * formatter and the two output streams are simple fakes, so these tests prove
 * the wiring between them: what reaches the cruise, what is printed, and the
 * status returned. No file is read and nothing is cruised. What a summary maps
 * to is the pure verdict's (`repo-check-depcruise-verdict.unit.test.ts`); the
 * configuration file, the cruised roots and the real API are proved by the
 * gate running (`pnpm depcruise`).
 */

const GATE_PREFIX = 'repo-check depcruise-gate: ';

/** Options as the configuration reader returns them, naming a tsconfig. */
const CONFIGURED_OPTIONS: ICruiseOptions = {
  doNotFollow: { path: 'node_modules' },
  tsConfig: { fileName: 'tsconfig.depcruise.json' },
};

/** A parsed tsconfig, as the extractor returns it. */
const PARSED_TSCONFIG = {
  options: { baseUrl: '.' },
  fileNames: ['jcdotnet/app/page.tsx'],
  errors: [],
};

/** The text the fake formatter returns; the gate must print it verbatim. */
const REPORT = 'the formatted report of the cruised result\n';

const JAVASCRIPT_FOUND: IAvailableTranspiler = {
  name: 'javascript',
  version: '*',
  currentVersion: '-',
  available: true,
};

const TYPESCRIPT_FOUND: IAvailableTranspiler = {
  name: 'typescript',
  version: '>=2.0.0 <7.0.0',
  currentVersion: 'typescript@6.0.3',
  available: true,
};

/** The compiler outside dependency-cruiser's supported range, as a TypeScript 7 bump leaves it. */
const TYPESCRIPT_UNAVAILABLE: IAvailableTranspiler = {
  ...TYPESCRIPT_FOUND,
  currentVersion: '-',
  available: false,
};

const MISSING_TYPESCRIPT_ISSUE: IEnvironmentIssue = {
  severity: 'warn',
  name: 'missing-typescript-transpiler',
  description: 'typescript files found, but no supported typescript compiler',
};

const VIOLATION: IViolation = {
  from: 'agent-tools/src/a.ts',
  to: 'jcdotnet/app/b.ts',
  rule: { name: 'no-cross-workspace-imports', severity: 'error' },
};

/** A cruise result whose summary carries the given compiler record, issues and violations. */
function cruiseResult(input: {
  readonly typescript: IAvailableTranspiler;
  readonly issues?: readonly IEnvironmentIssue[];
  readonly error?: number;
  readonly violations?: readonly IViolation[];
}): ICruiseResult {
  return {
    modules: [],
    summary: {
      error: input.error ?? 0,
      warn: 0,
      info: 0,
      ignore: 0,
      totalCruised: 1,
      violations: [...(input.violations ?? [])],
      optionsUsed: {},
      environment: {
        version: '18.1.1',
        nodeVersionSupported: '^20.12||^22||>=24',
        nodeVersionFound: 'v24.15.0',
        osVersionFound: 'darwin',
        transpilersFound: [JAVASCRIPT_FOUND, input.typescript],
        extensionsFound: [],
        ...(input.issues === undefined ? {} : { issues: [...input.issues] }),
      },
    },
  };
}

/** The failure lines the gate owes for a result: the verdict's, each under the gate's name. */
function gateFailureLines(result: ICruiseResult): readonly string[] {
  return depcruiseSummaryFailures(result.summary).map((failure) => `${GATE_PREFIX}${failure}`);
}

/**
 * A fake runtime: the reader returns `options`, the cruise returns `output`
 * (a result, or reporter text), and every call the gate makes is recorded.
 */
function gateRuntime(output: ICruiseResult | string, options: ICruiseOptions = CONFIGURED_OPTIONS) {
  const tsConfigReads: string[] = [];
  const cruises: unknown[] = [];
  const formatted: ICruiseResult[] = [];
  const reportWrites: string[] = [];
  const failureLines: string[] = [];
  const runtime: DepcruiseGateRuntime = {
    extractDepcruiseOptions() {
      return Promise.resolve(options);
    },
    extractTSConfig(tsConfigFileName) {
      tsConfigReads.push(tsConfigFileName);
      return PARSED_TSCONFIG;
    },
    cruise(_roots, cruiseOptions, _resolveOptions, transpileOptions) {
      cruises.push({ options: cruiseOptions, transpileOptions });
      // The API's identity reporter returns exit code 0 whatever the cruise
      // found; the gate's verdict must come from the summary, never an exit code.
      return Promise.resolve({ output, exitCode: 0 });
    },
    format(cruised) {
      formatted.push(cruised);
      return Promise.resolve({ output: REPORT, exitCode: 0 });
    },
    writeReport(text) {
      reportWrites.push(text);
    },
    writeFailure(line) {
      failureLines.push(line);
    },
  };
  return { tsConfigReads, cruises, formatted, reportWrites, failureLines, runtime };
}

describe('runDepcruiseGate', () => {
  it('passes a clean cruise and prints the report formatted from that cruise', async () => {
    const result = cruiseResult({ typescript: TYPESCRIPT_FOUND });
    const { formatted, reportWrites, failureLines, runtime } = gateRuntime(result);

    await expect(runDepcruiseGate(runtime)).resolves.toBe(0);

    expect(formatted).toStrictEqual([result]);
    expect(reportWrites).toStrictEqual([REPORT]);
    expect(failureLines).toStrictEqual([]);
  });

  it("fails a cruise that ran without the TypeScript compiler though it exited 0, writing the verdict's failures under the gate's name", async () => {
    const result = cruiseResult({
      typescript: TYPESCRIPT_UNAVAILABLE,
      issues: [MISSING_TYPESCRIPT_ISSUE],
    });
    const { reportWrites, failureLines, runtime } = gateRuntime(result);

    await expect(runDepcruiseGate(runtime)).resolves.toBe(1);

    expect(reportWrites).toStrictEqual([REPORT]);
    expect(failureLines).toStrictEqual(gateFailureLines(result));
  });

  it("fails a cruise with a single violation, writing its one failure line under the gate's name", async () => {
    const result = cruiseResult({
      typescript: TYPESCRIPT_FOUND,
      error: 1,
      violations: [VIOLATION],
    });
    const { reportWrites, failureLines, runtime } = gateRuntime(result);

    await expect(runDepcruiseGate(runtime)).resolves.toBe(1);

    expect(reportWrites).toStrictEqual([REPORT]);
    expect(failureLines).toStrictEqual(gateFailureLines(result));
    expect(failureLines).toHaveLength(1);
  });

  it('cruises with the options the configuration reader returned and the tsconfig those options name', async () => {
    const { tsConfigReads, cruises, runtime } = gateRuntime(
      cruiseResult({ typescript: TYPESCRIPT_FOUND }),
    );

    await expect(runDepcruiseGate(runtime)).resolves.toBe(0);

    expect(tsConfigReads).toStrictEqual([CONFIGURED_OPTIONS.tsConfig?.fileName]);
    expect(cruises).toStrictEqual([
      { options: CONFIGURED_OPTIONS, transpileOptions: { tsConfig: PARSED_TSCONFIG } },
    ]);
  });

  it('refuses a configuration that names a webpack configuration, before cruising and printing no report', async () => {
    const { cruises, reportWrites, failureLines, runtime } = gateRuntime(
      cruiseResult({ typescript: TYPESCRIPT_FOUND }),
      { ...CONFIGURED_OPTIONS, webpackConfig: { fileName: 'webpack.config.js' } },
    );

    await expect(runDepcruiseGate(runtime)).resolves.toBe(1);

    expect(cruises).toStrictEqual([]);
    expect(reportWrites).toStrictEqual([]);
    expect(failureLines).toStrictEqual([
      expect.stringMatching(/^repo-check depcruise-gate: .*webpackConfig/u),
    ]);
  });

  it('refuses a cruise that returned reporter text instead of a result, printing no report', async () => {
    const { formatted, reportWrites, failureLines, runtime } = gateRuntime('reporter text');

    await expect(runDepcruiseGate(runtime)).resolves.toBe(1);

    expect(formatted).toStrictEqual([]);
    expect(reportWrites).toStrictEqual([]);
    expect(failureLines).toStrictEqual([expect.stringMatching(/^repo-check depcruise-gate: /u)]);
  });
});

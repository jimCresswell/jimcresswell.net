import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  ignoreBinaries: [
    // External tools not installed via npm
    'gitleaks',
    // System binary probed by the site's PDF generator on Linux hosts
    'ldd',
  ],
  eslint: true,
  vitest: true,
  typescript: true,
  compilers: {
    // Surface CSS @import statements as import declarations so knip sees
    // CSS-first dependency consumption (Tailwind v4's `@import 'tailwindcss'`
    // in globals.css); everything else in the file is dropped.
    css: (text: string) =>
      [...text.matchAll(/@import\s+['"]([^'"]+)['"]/g)]
        .map(([, specifier]) => `import '${String(specifier)}';`)
        .join('\n'),
  },

  workspaces: {
    '.': {
      // The repo root has no source; logic belongs in workspaces. Keep the
      // root narrow so knip does not treat platform shims as default source.
      entry: ['package.json'],
      project: [],
      ignoreDependencies: [
        // Spawned as `pnpm exec markdownlint-cli2` from the repo root by
        // agent-tools' repo-check (the markdown gates over the staged set and
        // the tracked tree), never referenced from a root script knip can
        // parse. It stays a root devDependency because its config
        // (`.markdownlint-cli2.jsonc`) and its exec cwd are the root; scoped
        // to this workspace so a stray copy elsewhere is still reported.
        'markdownlint-cli2',
      ],
    },
    'agent-tools': {
      // Platform adapters (src/claude/, src/codex/, src/cursor/) are entry
      // points: the built JS is invoked via spawn from the platform's own thin
      // shim (e.g. `.claude/hooks/practice-session-identity.mjs`), which knip
      // cannot trace as a TS import. The remaining entries are the tsx-invoked
      // executables wired into `package.json` scripts, each listed explicitly
      // so knip traces the graph from the real entry.
      entry: [
        'src/bin/**/*.ts',
        'src/claude/**/*.ts',
        'src/codex/**/*.ts',
        'src/cursor/**/*.ts',
        'src/hook-policy/pre-tool-use-dispatch.ts',
        'src/repo-check/repo-check.ts',
        'src/commit-advisories/check-commit-message.ts',
        'src/commit-advisories/check-commit-skill-advisories.ts',
        'src/secret-scan/run-push-secret-scan.ts',
        'src/version-guard/prevent-accidental-major-version.ts',
        'src/validators/**/validate-*.ts',
        'src/validators/plan-schema/check-plan-gate-drift.ts',
        'src/practice-fitness/validate-practice-fitness.ts',
        'src/ci/ci-turbo-report.ts',
        'src/pr-throughput/cli.ts',
        'src/plan-state/plan-state.ts',
        'smoke-tests/**/*.ts',
      ],
      project: ['src/**/*.{ts,tsx,css}', 'tests/**/*.ts', 'smoke-tests/**/*.ts'],
      // The refounding leaf modules survive only because plan-state imports
      // them; their wider export surface is unused here. Retire this ignore
      // with the plan-node migration that removes plan-state's dependency.
      ignore: ['src/refounding/**'],
    },
    'tooling/*': {
      entry: ['src/index.ts', 'src/**/*.test.ts'],
    },
    'tooling/workspace-config': {
      // Subpath exports consumed via package.json "exports".
      entry: ['src/*.ts'],
    },
    jcdotnet: {
      // Next.js is auto-detected; the build-time scripts are package-script entries.
      entry: ['scripts/**/*.ts', 'accept-md.config.js'],
    },
  },
};

export default config;

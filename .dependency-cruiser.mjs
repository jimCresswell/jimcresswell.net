/** @type {import('dependency-cruiser').IConfiguration} */
export default {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment:
        'Circular dependencies make the codebase harder to reason about and can cause runtime issues.',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-orphans',
      severity: 'error',
      comment: 'Orphan modules are not reachable from any entry point. They may be dead code.',
      from: {
        orphan: true,
        pathNot: [
          // Config files are standalone by design
          '\\.(config|setup)\\.(ts|js|mjs)$',
          'eslint\\.config\\.ts$',
          'vitest\\.config',
          'tsup\\.config',
          // Test helpers may only be imported by tests
          'test-helpers/',
          'test-fakes/',
          'fakes\\.',
          // Type declaration files
          '\\.d\\.ts$',
          '\\.d\\.mts$',
          // Test files are standalone entry points (Vitest + Playwright)
          '\\.(test|spec)\\.(ts|tsx|js)$',
          // Standalone scripts invoked directly via tsx
          'scripts/',
          'smoke-tests/',
          'agent-tools/src/bin/',
          // Next.js file-system routes and metadata routes are framework entries
          '^jcdotnet/app/',
          // workspace-config subpath-export modules consumed via package.json "exports"
          'workspace-config/src/',
        ],
      },
      to: {},
    },
    {
      name: 'no-deprecated-node',
      severity: 'error',
      comment: 'Do not use deprecated Node.js core modules.',
      from: {},
      to: {
        dependencyTypes: ['deprecated'],
      },
    },
    {
      name: 'no-hook-policy-core-to-hosts',
      severity: 'error',
      comment:
        'Hook-policy canonical core (evaluate, policy-snapshot) is platform-free: host adapters, renderers, and the dispatcher depend on it, never the reverse.',
      from: {
        path: '^agent-tools/src/hook-policy/(evaluate|policy-snapshot)\\.ts$',
      },
      to: {
        path: '^agent-tools/src/hook-policy/(dispatcher|claude-adapter|claude-renderer|content-deny-response|pre-tool-use-dispatch)\\.ts$',
      },
    },
    {
      name: 'no-hook-policy-dispatcher-to-hosts',
      severity: 'error',
      comment:
        'The generic dispatcher owns arbitration only: routes and renderers are injected at the composition root (pre-tool-use-dispatch), never imported.',
      from: {
        path: '^agent-tools/src/hook-policy/dispatcher\\.ts$',
      },
      to: {
        path: '^agent-tools/src/hook-policy/(claude-adapter|claude-renderer|content-deny-response)\\.ts$',
      },
    },
    {
      name: 'no-import-from-agent-substrate',
      severity: 'error',
      comment:
        'No code may import from the `.agent/` knowledge substrate. `.agent/` is the agent operating substrate (plans, memory, rules, sub-agents, state, docs) — shared, mutable, relocatable knowledge, NOT a code module surface, and outside every workspace dependency boundary. agent-tools may READ it as data via fs (the sanctioned operator), but no code anywhere takes a module dependency on it. The companion runtime-read boundary is the ESLint rule @engraph/no-agent-substrate-access.',
      from: {},
      to: {
        path: '(^|/)\\.agent/',
      },
    },
    {
      name: 'workspace-config-containment',
      severity: 'error',
      comment:
        'Workspaces must never import from outside of themselves except via explicit ' +
        'package.json dependencies. A workspace tooling config file reaching another workspace ' +
        'or a repo-root file by relative path is the violation class; shared config lives in ' +
        "@engraph/workspace-config. The $1 backreference scopes the rule to each file's own " +
        'workspace. npm/core targets are exempt here — they are the sanctioned declared-dependency ' +
        "path, and undeclared ones are the next rule's finding.",
      from: {
        path: '^(tooling/[^/]+|agent-tools|jcdotnet)/(?:vitest|tsup|eslint|stryker)[.\\w-]*\\.config\\.(?:ts|mts|cts|js|mjs|cjs)$',
      },
      to: {
        pathNot: ['^$1/'],
        dependencyTypesNot: [
          'core',
          'npm',
          'npm-dev',
          'npm-peer',
          'npm-optional',
          'npm-bundled',
          'undetermined',
          'unknown',
          'npm-no-pkg',
          'npm-unknown',
        ],
      },
    },
    {
      name: 'workspace-config-no-phantom-deps',
      severity: 'error',
      comment:
        'A config file may only import packages its own workspace declares: an unresolvable or ' +
        'undeclared specifier means a copied config without its workspace:* line, which dies on ' +
        'clean installs and inside per-workspace tool sandboxes.',
      from: {
        path: '^(?:tooling/[^/]+|agent-tools|jcdotnet)/(?:vitest|tsup|eslint|stryker)[.\\w-]*\\.config\\.(?:ts|mts|cts|js|mjs|cjs)$',
      },
      to: {
        dependencyTypes: ['unknown', 'npm-no-pkg', 'npm-unknown'],
      },
    },
    {
      name: 'no-commonjs-require',
      severity: 'error',
      comment:
        'Zero require statements in this strictly-ESM repo — presence is the finding. Covers ' +
        'require() calls, AMD require, and TS import-equals.',
      from: {},
      to: {
        dependencyTypes: ['require', 'amd-require', 'import-equals'],
      },
    },
    {
      name: 'no-dynamic-import',
      severity: 'error',
      comment:
        'Dynamic imports are strongly discouraged — error severity, with a narrow named per-site ' +
        'exemption set (each site added to from.pathNot with its warrant). The syntactic bar for ' +
        'linted files is the @engraph/no-dynamic-import ESLint rule; this rule adds ' +
        'resolution-level coverage, notably for config files.',
      from: {},
      to: {
        dependencyTypes: ['dynamic-import'],
      },
    },
  ],
  options: {
    doNotFollow: {
      // `.agent/` is kept visible (not excluded) so the
      // `no-import-from-agent-substrate` forbidden rule can see an import edge
      // into the substrate, but its internals are never followed/analysed.
      path: ['node_modules', 'dist', '.turbo', '\\.agent/'],
    },
    exclude: {
      path: ['\\.next/', '\\.turbo', '\\.cursor/', '\\.claude/'],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      // Resolution config only — adds the site's `@/*` alias so aliased
      // imports resolve and no-orphans judges real reachability.
      fileName: 'tsconfig.depcruise.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    reporterOptions: {
      dot: {
        collapsePattern: 'node_modules/(@[^/]+/[^/]+|[^/]+)',
      },
    },
    progress: {
      type: 'cli-feedback',
    },
  },
};

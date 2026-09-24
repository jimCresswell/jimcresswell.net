import { defineConfig } from 'vitest/config';

/**
 * Base Vitest configuration for E2E tests.
 *
 * E2E tests verify running system behaviour. They may trigger file system
 * and STDIO IO. Fetch-based network calls are blocked
 * (`@engraph/workspace-config/no-network-setup`), which keeps the real
 * fetch as `__ORIGINAL_FETCH__` so a later-running setup can restore it, the
 * contract the sentinel's check-then-patch guard protects. The setup arrives
 * as a bare package specifier so it resolves identically from any consumer,
 * and it must stay FIRST in any `mergeConfig` composition so a later setup
 * can restore the original fetch. A local HTTP harness must bind `127.0.0.1`
 * explicitly: a host-less listen binds `::` and can silently share a port
 * with a foreign IPv4 listener in the ephemeral range.
 * Configuration reaches the code under test by dependency injection, never
 * through `process.env` (`.agent/rules/no-global-state-in-tests.md`).
 */
export const baseE2EConfig = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Fetch is blocked; use DI and local fakes instead of real services.
    setupFiles: ['@engraph/workspace-config/no-network-setup'],
    include: ['e2e-tests/**/*.e2e.test.ts', 'e2e/**/*.e2e.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage'],
    testTimeout: 60000, // E2E tests may take longer; 60s provides headroom under resource pressure
    hookTimeout: 30000,
    retry: 0, // No retries by default for E2E
  },
});

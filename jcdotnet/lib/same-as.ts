/**
 * Resolve one identity-profile URL by exact hostname.
 *
 * Schema.org represents `sameAs` as an unordered URL array. Consumers that
 * label a provider must therefore state the exact provider hostname and fail
 * loudly if the graph is missing that profile or contains an ambiguous pair.
 *
 * @param sameAsUrls Identity-profile URLs from the Person entity.
 * @param hostname Exact hostname to resolve, including any meaningful `www` prefix.
 * @returns The sole URL whose parsed hostname matches.
 * @throws If zero or multiple URLs match the hostname.
 */
export function resolveSameAsUrlByHostname(
  sameAsUrls: readonly string[],
  hostname: string
): string {
  const matches = sameAsUrls.filter((url) => new URL(url).hostname === hostname);
  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one sameAs URL for hostname ${hostname} (found ${matches.length})`
    );
  }
  return matches[0];
}

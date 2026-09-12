const NEGOTIABLE_PAGE_PATHS = ["/", "/cv"] as const;

/**
 * Resolve a request path to a supported editorial document.
 *
 * The proxy and the public accept-md handler share this boundary so callers
 * cannot bypass route eligibility through rewrite headers or query values.
 */
export function resolveNegotiablePagePath(pathname: string): "/" | "/cv" | null {
  if (pathname === "/cv/") {
    return "/cv";
  }

  return NEGOTIABLE_PAGE_PATHS.find((path) => path === pathname) ?? null;
}

import { NextResponse, type NextRequest } from "next/server";

/**
 * Content negotiation proxy.
 *
 * Handles alternative representations of page content:
 *
 * - **Markdown** — `Accept: text/markdown` header, or `.md` URL suffix
 *   (e.g. `/cv.md`). Rewrites to the accept-md handler which fetches the
 *   page as HTML and converts it to clean markdown with YAML frontmatter.
 *
 * - **JSON-LD** — `Accept: application/ld+json` on any page URL.
 *   Returns the Schema.org knowledge graph from `/api/graph`.
 *
 * API routes and internal Next.js paths are excluded via the matcher.
 */
export function proxy(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname;
  const accept = request.headers.get("accept") ?? "";

  // .md suffix — browser-friendly markdown alias
  // Supports both /cv.md and /cv/index.md (directory-style)
  if (pathname.endsWith(".md")) {
    let pagePath = pathname.slice(0, -3);

    // /cv/index → /cv, /index → /
    if (pagePath.endsWith("/index")) {
      pagePath = pagePath.slice(0, -6) || "/";
    }

    // bare /index (no leading directory)
    if (pagePath === "/index") {
      pagePath = "/";
    }

    return rewriteToAcceptMd(request, pagePath);
  }

  // Accept: text/markdown — content negotiation
  if (accept.includes("text/markdown")) {
    return rewriteToAcceptMd(request, pathname);
  }

  // Accept: application/ld+json — serve the knowledge graph
  if (accept.includes("application/ld+json")) {
    const url = request.nextUrl.clone();
    url.pathname = "/api/graph";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

/**
 * Rewrite to the accept-md handler, setting the explicit path header so
 * the handler uses it instead of any Next.js internal headers like
 * `x-matched-path` (which would contain the `.md` URL and loop).
 */
function rewriteToAcceptMd(request: NextRequest, pagePath: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/api/accept-md";
  url.searchParams.set("path", pagePath);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-accept-md-path", pagePath);

  return NextResponse.rewrite(url, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes (/api/*)
     * - static assets (_next/static, _next/image)
     * - metadata files (favicon.ico, sitemap.xml, robots.txt)
     * - icons and manifest
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|icons/|manifest).*)",
  ],
};

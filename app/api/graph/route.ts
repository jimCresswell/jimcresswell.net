import { NextResponse } from "next/server";
import { getRequestedGraphMediaType } from "@/lib/graph-media-type";
import { jsonLd } from "@/lib/jsonld";

/**
 * Serve the complete JSON-LD knowledge graph.
 *
 * Returns the same Schema.org `@graph` that appears as structured data on
 * the CV page, but as a standalone JSON response. This makes the graph
 * directly consumable by tools, AI systems, and other programmatic clients.
 */
export function GET(request: Request): NextResponse {
  const contentType =
    getRequestedGraphMediaType(request.headers.get("accept")) ?? "application/json";

  // TODO: Re-enable caching once the graph stabilises.
  return new NextResponse(JSON.stringify(jsonLd), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": `${contentType}; charset=utf-8`,
    },
  });
}

import { NextResponse } from "next/server";
import { jsonLd } from "@/lib/jsonld";

/**
 * Serve the complete JSON-LD knowledge graph.
 *
 * Returns the same Schema.org `@graph` that appears as structured data on
 * the CV page, but as a standalone JSON response. This makes the graph
 * directly consumable by tools, AI systems, and other programmatic clients.
 */
export function GET(): NextResponse {
  // TODO: Re-enable caching once the graph stabilises.
  return NextResponse.json(jsonLd, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

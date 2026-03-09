const graphResponseMediaTypes = ["application/ld+json", "application/json"] as const;

type GraphResponseMediaType = (typeof graphResponseMediaTypes)[number];

/**
 * Pick the graph response media type from an HTTP Accept header.
 *
 * The graph payload is the same JSON-LD document for both supported media
 * types. This matcher exists so callers can return that shared payload with a
 * response `Content-Type` that matches the client's explicit request.
 *
 * `application/ld+json` wins when both graph media types are present.
 *
 * @param acceptHeader - Raw Accept header value from the request
 * @returns The requested graph media type, or `null` when no graph media type
 * is requested
 */
export function getRequestedGraphMediaType(
  acceptHeader: string | null | undefined
): GraphResponseMediaType | null {
  const acceptedMediaTypes = normaliseAcceptedMediaTypes(acceptHeader);

  for (const mediaType of graphResponseMediaTypes) {
    if (acceptedMediaTypes.includes(mediaType)) {
      return mediaType;
    }
  }

  return null;
}

function normaliseAcceptedMediaTypes(acceptHeader: string | null | undefined): string[] {
  if (!acceptHeader) {
    return [];
  }

  return acceptHeader
    .split(",")
    .map((value) => value.split(";")[0]?.trim().toLowerCase())
    .filter((value): value is string => value !== undefined && value.length > 0);
}

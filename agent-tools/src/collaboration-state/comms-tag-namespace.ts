/**
 * Canonical comms-event tag namespace (the source lineage's tag-namespace decision,
 * carried here as this module).
 *
 * Tags compose with the structural channel discriminator at render time
 * (`[BROADCAST]` / `[GROUP]` / `[DIRECTED]` / `[LIFECYCLE]`) — they do NOT
 * replace it. The namespace stays small by design: new tags require an
 * ADR amendment with second-instance evidence (PDR-049 + PDR-050
 * additive-extension discipline).
 *
 * This module is the single source of truth for the CLI's namespace
 * whitelist. The JSON schema description in
 * `.agent/state/collaboration/comms-event.schema.json` enumerates the
 * same namespace in prose; both must move together if the namespace
 * grows. The `heartbeat` tag was added operationally by the SKILL §0.5
 * heartbeat contract; the formal the comms-tag namespace amendment to add it to the
 * recorded namespace is a structural-cure lane pending separate from
 * this module.
 */
export const COMMS_EVENT_TAG_NAMESPACE = Object.freeze([
  'failure-mode',
  'behaviour-note',
  'heartbeat',
] as const);

export type CommsEventTag = (typeof COMMS_EVENT_TAG_NAMESPACE)[number];

/**
 * Validate that every tag in `tags` is a canonical the comms-tag namespace tag and that
 * no tag is repeated. Returns the tags at the precise namespace type on
 * success — the boundary narrowing; nothing widens past it
 * (validation-strategy §Runtime validation at the boundary). Throws with a precise message on
 * failure. The shape mirrors the schema's `uniqueItems: true` constraint
 * at the CLI boundary so the rejection happens before any event reaches
 * disk.
 */
export function validateCommsEventTags(tags: readonly string[]): readonly CommsEventTag[] {
  const seen = new Set<string>();
  const canonical: CommsEventTag[] = [];
  for (const tag of tags) {
    if (!isCanonicalTag(tag)) {
      throw new Error(
        `unknown comms event tag: '${tag}'. Canonical namespace (the comms-tag namespace): ${COMMS_EVENT_TAG_NAMESPACE.join(', ')}`,
      );
    }
    if (seen.has(tag)) {
      throw new Error(`duplicate comms event tag: '${tag}'`);
    }
    seen.add(tag);
    canonical.push(tag);
  }

  return canonical;
}

/** Type guard onto the closed the comms-tag namespace (the zero-widening membership check). */
export function isCanonicalTag(tag: string): tag is CommsEventTag {
  for (const known of COMMS_EVENT_TAG_NAMESPACE) {
    if (known === tag) {
      return true;
    }
  }
  return false;
}

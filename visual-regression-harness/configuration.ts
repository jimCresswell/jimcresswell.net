import { z } from "zod";

const safeArtifactKeySchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be a lowercase, hyphen-separated filesystem-safe key");

const routePathSchema = z
  .string()
  .regex(
    /^\/(?:[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*)?\/?$/,
    "Must be a same-origin absolute path without a query or fragment"
  )
  .refine(
    (routePath) => !routePath.split("/").some((segment) => segment === "." || segment === ".."),
    "Must not contain dot path segments"
  );

const reservedRegionKeys = new Set(["document", "full-page", "main", "metadata"]);

const regressionRegionSchema = z
  .object({
    key: safeArtifactKeySchema.refine(
      (key) => !reservedRegionKeys.has(key),
      "Must not collide with a core route artefact"
    ),
    selector: z.string().trim().min(1),
  })
  .strict();

const regressionRouteSchema = z
  .object({
    key: safeArtifactKeySchema,
    path: routePathSchema,
    regions: z.array(regressionRegionSchema),
    expectedSectionIds: z.array(z.string().trim().min(1)),
    allowances: z
      .object({
        targetOnlyExpectedSectionIds: z.boolean(),
      })
      .strict(),
  })
  .strict()
  .superRefine((route, context) => {
    addDuplicateValueIssues(
      route.regions.map((region) => region.key),
      ["regions"],
      "region key",
      context
    );
    addDuplicateValueIssues(
      route.expectedSectionIds,
      ["expectedSectionIds"],
      "expected section id",
      context
    );
  });

const visualRegressionConfigurationSchema = z
  .object({
    routes: z.array(regressionRouteSchema).min(1),
  })
  .strict()
  .superRefine((configuration, context) => {
    addDuplicateValueIssues(
      configuration.routes.map((route) => route.key),
      ["routes"],
      "route key",
      context
    );
    addDuplicateValueIssues(
      configuration.routes.map((route) => route.path),
      ["routes"],
      "route path",
      context
    );
  });

/** One named DOM region captured alongside its full route. */
export type RegressionRegion = z.infer<typeof regressionRegionSchema>;

/** One route and its bounded comparison policy. */
export type RegressionRoute = z.infer<typeof regressionRouteSchema>;

/** Serializable repository policy accepted by the visual-regression engine. */
export type VisualRegressionConfiguration = z.infer<typeof visualRegressionConfigurationSchema>;

/**
 * Validate an external repository comparison policy.
 *
 * @param value Unknown configuration supplied by a repository adapter.
 * @returns A complete, duplicate-free visual-regression configuration.
 * @throws When routes, regions, expected ids, or allowances are missing or invalid.
 *
 * @example
 * ```ts
 * const configuration = parseVisualRegressionConfiguration({
 *   routes: [
 *     {
 *       key: "home",
 *       path: "/",
 *       regions: [{ key: "content", selector: "main" }],
 *       expectedSectionIds: [],
 *       allowances: { targetOnlyExpectedSectionIds: false },
 *     },
 *   ],
 * });
 * ```
 */
export function parseVisualRegressionConfiguration(value: unknown): VisualRegressionConfiguration {
  const result = visualRegressionConfigurationSchema.safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid visual regression configuration: ${z.prettifyError(result.error)}`, {
      cause: result.error,
    });
  }

  return result.data;
}

/**
 * Report every repeated value at its array position during schema refinement.
 *
 * @param values Values whose identity must be unique.
 * @param path Schema path containing the values.
 * @param label Human-readable value kind for validation messages.
 * @param context Zod refinement context receiving any issues.
 */
function addDuplicateValueIssues(
  values: readonly string[],
  path: readonly PropertyKey[],
  label: string,
  context: z.core.$RefinementCtx
): void {
  const seenValues = new Set<string>();

  values.forEach((value, index) => {
    if (seenValues.has(value)) {
      context.addIssue({
        code: "custom",
        message: `Duplicate ${label}: ${value}`,
        path: [...path, index],
        input: value,
      });
      return;
    }

    seenValues.add(value);
  });
}

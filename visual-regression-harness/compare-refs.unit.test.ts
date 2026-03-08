import { describe, expect, it } from "vitest";
import { shouldSkipComparison } from "./compare-refs";
import type { ResolvedSnapshotSource } from "./export-ref";

describe("shouldSkipComparison", () => {
  it("skips when both sources are git refs resolved to the same commit", () => {
    const baseSource: ResolvedSnapshotSource = {
      kind: "git-ref",
      requestedRef: "HEAD",
      resolvedRef: "abc123",
      extractionMethod: "git archive",
    };
    const targetSource: ResolvedSnapshotSource = {
      kind: "git-ref",
      requestedRef: "main",
      resolvedRef: "abc123",
      extractionMethod: "git archive",
    };

    expect(shouldSkipComparison(baseSource, targetSource)).toBe(true);
  });

  it("does not skip when the git refs resolve to different commits", () => {
    const baseSource: ResolvedSnapshotSource = {
      kind: "git-ref",
      requestedRef: "HEAD~1",
      resolvedRef: "abc123",
      extractionMethod: "git archive",
    };
    const targetSource: ResolvedSnapshotSource = {
      kind: "git-ref",
      requestedRef: "HEAD",
      resolvedRef: "def456",
      extractionMethod: "git archive",
    };

    expect(shouldSkipComparison(baseSource, targetSource)).toBe(false);
  });

  it("does not skip when WORKTREE is anchored to the same HEAD commit", () => {
    const baseSource: ResolvedSnapshotSource = {
      kind: "git-ref",
      requestedRef: "HEAD",
      resolvedRef: "abc123",
      extractionMethod: "git archive",
    };
    const targetSource: ResolvedSnapshotSource = {
      kind: "working-tree",
      requestedRef: "WORKTREE",
      resolvedRef: "abc123",
      extractionMethod: "git archive + worktree overlay",
    };

    expect(shouldSkipComparison(baseSource, targetSource)).toBe(false);
  });
});

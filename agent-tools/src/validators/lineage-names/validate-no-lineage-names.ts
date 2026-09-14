#!/usr/bin/env node

/**
 * Lineage-name leak validator.
 *
 * Enforces the transplant's closure invariant over every tracked live surface:
 * the names of the lineage the Practice was transplanted from (declared once
 * in the `lineage-name` scoped block of `.agent/hooks/policy.json`) appear only
 * in the records that tell the transplant's story and in the CV content, never
 * in a fixture, a manifest, a reference link or a comment. The block's names
 * and scope are the same ones the PreToolUse write-hook applies, so the gate
 * and the guard match the same names and exempt the same files; the
 * tracked-file listing and the binary/generated skip policy come from
 * `core/tracked-file-scan`, shared with the sibling gates.
 *
 * Wired into root `docs-validators:check`, which runs in `pnpm check` and CI.
 * Exit 0 = clean; exit 1 = at least one lineage name on a live surface; exit
 * 2 = refusal — the policy block is missing or declares no name, or a tracked
 * file cannot be read (the scan never silently skips one).
 *
 * @packageDocumentation
 */

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { listTrackedFiles, readScanFiles } from '../../core/tracked-file-scan.js';
import { loadScopedContentBlocks } from '../../hook-policy/policy-loader.js';

import {
  lineageNeedles,
  scanForLineageNames,
  selectLineageNameBlock,
} from './validate-no-lineage-names-helpers.js';

const repoRoot = resolveRepoRoot(import.meta.url);
const block = selectLineageNameBlock(await loadScopedContentBlocks());

if (block === undefined) {
  writeErrorLine('validate-no-lineage-names: no `lineage-name` block in .agent/hooks/policy.json');
  process.exit(2);
}

const needles = lineageNeedles(block);
if (needles.length === 0) {
  writeErrorLine('validate-no-lineage-names: the `lineage-name` block declares no name');
  process.exit(2);
}

const scan = readScanFiles(repoRoot, listTrackedFiles(repoRoot));
if (!scan.ok) {
  writeErrorLine(
    `validate-no-lineage-names: cannot read tracked file '${scan.error.relativePath}' — ` +
      `fix the file or its permissions; the scan must not skip a tracked file ` +
      `(${String(scan.error.cause)})`,
  );
  process.exit(2);
}

const files = scan.value;
const hits = scanForLineageNames(files, block, needles);

if (hits.length === 0) {
  writeLine(
    `✓ no lineage names (${needles.join(', ')}) on ${files.length} tracked files outside the records`,
  );
  process.exit(0);
}

writeErrorLine(`✖ ${hits.length} lineage name(s) on live surfaces:`);
for (const hit of hits) {
  writeErrorLine(`  ${hit.file}:${hit.line}:${hit.column}  ${hit.text}`);
}
writeErrorLine('');
writeErrorLine(
  'The lineage the Practice was transplanted from is named only in the records that tell that ' +
    'story (provenance, changelog, memory, reports, plans, the transplant exploration) and in ' +
    'the CV content. On a live surface, name this estate instead. See the lineage-name block ' +
    'in .agent/hooks/policy.json for the names and the scope, and the plan of record, closure item 5.',
);
process.exit(1);

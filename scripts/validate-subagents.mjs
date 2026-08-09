#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { parseCodexRegistrations, summaryLine } from "./validate-portability-helpers.mjs";
import { buildSubagentWrapperDescriptors } from "./validate-subagents-helpers.mjs";

const repoRoot = process.cwd();
const issues = [];
const codexConfigPath = ".codex/config.toml";

async function exists(relPath) {
  try {
    await fs.access(path.join(repoRoot, relPath));
    return true;
  } catch {
    return false;
  }
}

async function readText(relPath) {
  return fs.readFile(path.join(repoRoot, relPath), "utf8");
}

async function listFiles(relDir, extension) {
  try {
    const entries = await fs.readdir(path.join(repoRoot, relDir), {
      withFileTypes: true,
    });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
      .map((entry) => `${relDir}/${entry.name}`)
      .sort();
  } catch {
    return [];
  }
}

function addIssue(message) {
  issues.push(message);
}

async function verifyWrapper(relPath, pointer, frontmatterName, label) {
  if (!(await exists(relPath))) {
    addIssue(`${label}: missing ${relPath}`);
    return;
  }

  const content = await readText(relPath);

  if (pointer && !content.includes(pointer)) {
    addIssue(`${relPath}: ${label} must point at ${pointer}`);
  }

  if (frontmatterName) {
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[1] : null;
    const regex = new RegExp(`^name:\s*(.+)$`, "m");
    const match = frontmatter?.match(regex);
    const actualName = match?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
    if (actualName !== frontmatterName) {
      addIssue(`${relPath}: frontmatter name must be "${frontmatterName}"`);
    }
  }
}

async function main() {
  const canonicalTemplates = await listFiles(".agent/sub-agents/templates", ".md");
  const configContent = (await exists(codexConfigPath)) ? await readText(codexConfigPath) : "";
  const codexConfig = configContent ? parseCodexRegistrations(configContent) : new Map();

  if (!configContent) {
    addIssue(`Missing Codex reviewer registry: ${codexConfigPath}`);
  }

  for (const templateFile of canonicalTemplates) {
    const templateName = path.basename(templateFile, ".md");
    const canonicalPath = `.agent/sub-agents/templates/${templateName}.md`;
    const wrappers = buildSubagentWrapperDescriptors(templateName);

    for (const wrapper of wrappers) {
      await verifyWrapper(wrapper.relPath, wrapper.pointer, wrapper.frontmatterName, wrapper.label);
    }

    const codexAdapter = `.codex/agents/${templateName}.toml`;
    if (!(await exists(codexAdapter))) {
      addIssue(`${canonicalPath}: missing Codex adapter ${codexAdapter}`);
    } else {
      const adapterContent = await readText(codexAdapter);
      if (!adapterContent.includes(canonicalPath)) {
        addIssue(`${codexAdapter}: must point at ${canonicalPath}`);
      }
    }

    const registeredConfig = codexConfig.get(templateName);
    if (registeredConfig == null) {
      addIssue(`${codexConfigPath}: missing [agents.${JSON.stringify(templateName)}] registration`);
    } else if (registeredConfig !== codexAdapter) {
      addIssue(`${codexConfigPath}: ${templateName} must register config_file = "${codexAdapter}"`);
    }
  }

  if (issues.length > 0) {
    console.error(
      `Sub-agent validation failed (${issues.length} issue${issues.length === 1 ? "" : "s"}):`
    );
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(
    `Sub-agent validation passed (${summaryLine("templates", canonicalTemplates.length)}).`
  );
}

await main();

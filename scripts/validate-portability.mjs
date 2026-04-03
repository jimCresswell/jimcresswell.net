#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const issues = [];

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

async function listSubdirs(relDir) {
  try {
    const entries = await fs.readdir(path.join(repoRoot, relDir), {
      withFileTypes: true,
    });
    return entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch {
    return [];
  }
}

function addIssue(message) {
  issues.push(message);
}

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

function getFrontmatterValue(frontmatter, key) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`^${escapedKey}:\\s*(.+)$`, "m");
  const match = frontmatter?.match(regex);
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, "") ?? "";
}

function parseCodexRegistrations(content) {
  const registrations = new Map();
  let currentAgent = null;

  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    const quotedMatch = line.match(/^\[agents\."([^"]+)"\]$/);
    const bareMatch = line.match(/^\[agents\.([^\]]+)\]$/);

    if (quotedMatch || bareMatch) {
      currentAgent = quotedMatch?.[1] ?? bareMatch?.[1] ?? null;
      continue;
    }

    if (currentAgent == null) {
      continue;
    }

    const configMatch = line.match(/^config_file\s*=\s*"([^"]+)"$/);
    if (configMatch) {
      registrations.set(currentAgent, configMatch[1]);
      currentAgent = null;
    }
  }

  return registrations;
}

function summaryLine(label, count) {
  return `${label}: ${count}`;
}

const matrixPath = ".agent/reference/cross-platform-agent-surface-matrix.md";
if (!(await exists(matrixPath))) {
  addIssue(`Missing required local surface contract: ${matrixPath}`);
}

const copilotEntryPath = ".github/copilot-instructions.md";
if (!(await exists(copilotEntryPath))) {
  addIssue(`Missing GitHub Copilot entry point: ${copilotEntryPath}`);
} else {
  const copilotContent = await readText(copilotEntryPath);
  if (!copilotContent.includes(".agent/directives/AGENT.md")) {
    addIssue(
      `${copilotEntryPath}: must reference .agent/directives/AGENT.md as the canonical entry point`
    );
  }
}

const canonicalCommandFiles = await listFiles(".agent/commands", ".md");
for (const commandFile of canonicalCommandFiles) {
  const commandName = path.basename(commandFile, ".md");
  const cursorWrapper = `.cursor/commands/${commandName}.md`;
  const codexWrapper = `.agents/skills/${commandName}/SKILL.md`;
  const canonicalReference = `@.agent/commands/${commandName}.md`;

  if (!(await exists(cursorWrapper))) {
    addIssue(`${commandFile}: missing Cursor command wrapper ${cursorWrapper}`);
  } else {
    const content = await readText(cursorWrapper);
    if (!content.includes(canonicalReference)) {
      addIssue(`${cursorWrapper}: must point at ${canonicalReference} and stay a thin wrapper`);
    }
  }

  if (!(await exists(codexWrapper))) {
    addIssue(`${commandFile}: missing Codex command wrapper ${codexWrapper}`);
  } else {
    const content = await readText(codexWrapper);
    if (!content.includes(`.agent/commands/${commandName}.md`)) {
      addIssue(
        `${codexWrapper}: must point at .agent/commands/${commandName}.md and stay a thin wrapper`
      );
    }
  }
}

const canonicalSkillDirs = await listSubdirs(".agent/skills");
for (const skillDir of canonicalSkillDirs) {
  const cursorWrapper = `.cursor/skills/${skillDir}/SKILL.md`;
  const codexWrapper = `.agents/skills/${skillDir}/SKILL.md`;

  if (!(await exists(cursorWrapper))) {
    addIssue(`.agent/skills/${skillDir}/SKILL.md: missing Cursor skill wrapper ${cursorWrapper}`);
  } else {
    const content = await readText(cursorWrapper);
    const frontmatter = extractFrontmatter(content);
    if (getFrontmatterValue(frontmatter, "name") !== skillDir) {
      addIssue(`${cursorWrapper}: frontmatter name must be "${skillDir}"`);
    }
    if (!content.includes(`@.agent/skills/${skillDir}/SKILL.md`)) {
      addIssue(
        `${cursorWrapper}: must point at @.agent/skills/${skillDir}/SKILL.md and stay a thin wrapper`
      );
    }
  }

  if (!(await exists(codexWrapper))) {
    addIssue(`.agent/skills/${skillDir}/SKILL.md: missing Codex skill wrapper ${codexWrapper}`);
  } else {
    const content = await readText(codexWrapper);
    const frontmatter = extractFrontmatter(content);
    if (getFrontmatterValue(frontmatter, "name") !== skillDir) {
      addIssue(`${codexWrapper}: frontmatter name must be "${skillDir}"`);
    }
    if (!content.includes(`.agent/skills/${skillDir}/SKILL.md`)) {
      addIssue(
        `${codexWrapper}: must point at .agent/skills/${skillDir}/SKILL.md and stay a thin wrapper`
      );
    }
  }
}

const canonicalRuleFiles = await listFiles(".agent/rules", ".md");
for (const ruleFile of canonicalRuleFiles) {
  const ruleName = path.basename(ruleFile, ".md");
  const cursorRule = `.cursor/rules/${ruleName}.mdc`;

  if (!(await exists(cursorRule))) {
    addIssue(`${ruleFile}: missing Cursor rule trigger ${cursorRule}`);
    continue;
  }

  const content = await readText(cursorRule);
  if (!content.includes(`@.agent/rules/${ruleName}.md`)) {
    addIssue(`${cursorRule}: must point at @.agent/rules/${ruleName}.md and stay a thin wrapper`);
  }
}

const templateFiles = await listFiles(".agent/sub-agents/templates", ".md");
const codexConfigPath = ".codex/config.toml";
const codexConfig = (await exists(codexConfigPath))
  ? parseCodexRegistrations(await readText(codexConfigPath))
  : new Map();

if (!(await exists(codexConfigPath))) {
  addIssue(`Missing Codex reviewer registry: ${codexConfigPath}`);
}

for (const templateFile of templateFiles) {
  const templateName = path.basename(templateFile, ".md");
  const cursorWrapper = `.cursor/agents/${templateName}.md`;
  const codexAdapter = `.codex/agents/${templateName}.toml`;

  if (!(await exists(cursorWrapper))) {
    addIssue(`${templateFile}: missing Cursor reviewer wrapper ${cursorWrapper}`);
  } else {
    const content = await readText(cursorWrapper);
    const frontmatter = extractFrontmatter(content);
    if (getFrontmatterValue(frontmatter, "name") !== templateName) {
      addIssue(`${cursorWrapper}: frontmatter name must be "${templateName}"`);
    }
    if (!content.includes(`@.agent/sub-agents/templates/${templateName}.md`)) {
      addIssue(`${cursorWrapper}: must point at @.agent/sub-agents/templates/${templateName}.md`);
    }
  }

  if (!(await exists(codexAdapter))) {
    addIssue(`${templateFile}: missing Codex reviewer adapter ${codexAdapter}`);
  } else {
    const content = await readText(codexAdapter);
    if (!content.includes(`.agent/sub-agents/templates/${templateName}.md`)) {
      addIssue(`${codexAdapter}: must point at .agent/sub-agents/templates/${templateName}.md`);
    }
  }

  const registeredConfig = codexConfig.get(templateName);
  if (registeredConfig == null) {
    addIssue(`${codexConfigPath}: missing [agents.${JSON.stringify(templateName)}] registration`);
  } else if (registeredConfig !== codexAdapter) {
    addIssue(`${codexConfigPath}: ${templateName} must register config_file = "${codexAdapter}"`);
  }
}

const codexAdapterFiles = await listFiles(".codex/agents", ".toml");
for (const codexAdapterFile of codexAdapterFiles) {
  const adapterName = path.basename(codexAdapterFile, ".toml");
  const expectedTemplate = `.agent/sub-agents/templates/${adapterName}.md`;

  if (!codexConfig.has(adapterName)) {
    addIssue(`${codexAdapterFile}: adapter exists but is not registered in ${codexConfigPath}`);
  }

  if (!(await exists(expectedTemplate))) {
    addIssue(`${codexAdapterFile}: expected canonical template ${expectedTemplate} does not exist`);
  }
}

if (issues.length > 0) {
  console.error(
    `Portability validation failed (${issues.length} issue${issues.length === 1 ? "" : "s"}):`
  );
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

const summaryLines = [
  summaryLine("commands", canonicalCommandFiles.length),
  summaryLine("skills", canonicalSkillDirs.length),
  summaryLine("rules", canonicalRuleFiles.length),
  summaryLine("reviewers", templateFiles.length),
];

console.log(`Portability validation passed (${summaryLines.join(", ")}).`);

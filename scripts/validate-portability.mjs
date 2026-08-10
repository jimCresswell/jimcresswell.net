#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import {
  extractFrontmatter,
  getFrontmatterValue,
  parseCodexRegistrations,
  summaryLine,
} from "./validate-portability-helpers.mjs";

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

async function readJson(relPath) {
  return JSON.parse(await readText(relPath));
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

/**
 * Verifies a wrapper file exists, points at the canonical surface, and (optionally) declares the expected name.
 *
 * @param {string} relPath - Relative path to the wrapper file.
 * @param {string|null} pointer - The string the wrapper must include to reference its canonical source.
 * @param {string|null} frontmatterName - Expected value for the frontmatter `name` key (when present).
 * @param {string} label - A user-friendly label used in error messages.
 */
async function verifyWrapper(relPath, pointer, frontmatterName, label) {
  if (!(await exists(relPath))) {
    addIssue(`${label}: missing ${relPath}`);
    return null;
  }

  const content = await readText(relPath);

  if (pointer && !content.includes(pointer)) {
    addIssue(`${relPath}: ${label} must point at ${pointer}`);
  }

  if (frontmatterName) {
    const frontmatter = extractFrontmatter(content);
    const actualName = getFrontmatterValue(frontmatter, "name");
    if (actualName !== frontmatterName) {
      addIssue(`${relPath}: frontmatter name must be "${frontmatterName}"`);
    }
  }

  return content;
}

function buildPointer(canonicalPath, wrapWithAt = true) {
  return wrapWithAt ? `@${canonicalPath}` : canonicalPath;
}

async function validateMatrixPath(matrixPath) {
  if (!(await exists(matrixPath))) {
    addIssue(`Missing required local surface contract: ${matrixPath}`);
  }
}

async function validateCopilotEntry() {
  const copilotEntryPath = ".github/copilot-instructions.md";

  if (!(await exists(copilotEntryPath))) {
    addIssue(`Missing GitHub Copilot entry point: ${copilotEntryPath}`);
    return;
  }

  const copilotContent = await readText(copilotEntryPath);
  if (!copilotContent.includes(".agent/directives/AGENT.md")) {
    addIssue(
      `${copilotEntryPath}: must reference .agent/directives/AGENT.md as the canonical entry point`
    );
  }
}

async function validateCanonicalScripts() {
  const packageJsonPath = "package.json";

  if (!(await exists(packageJsonPath))) {
    addIssue(`Missing package manifest: ${packageJsonPath}`);
    return;
  }

  const packageJson = await readJson(packageJsonPath);
  const scripts = packageJson.scripts ?? {};
  const requiredScripts = [
    "clean",
    "build",
    "dev",
    "format",
    "format:fix",
    "lint",
    "lint:fix",
    "typecheck",
    "test",
    "check",
    "check:fix",
    "check:ci",
    "fix",
  ];

  for (const scriptName of requiredScripts) {
    if (typeof scripts[scriptName] !== "string" || scripts[scriptName].trim() === "") {
      addIssue(`package.json: missing canonical script "${scriptName}"`);
    }
  }
}

async function validateCommands() {
  const canonicalCommandFiles = await listFiles(".agent/commands", ".md");

  for (const commandFile of canonicalCommandFiles) {
    const commandName = path.basename(commandFile, ".md");
    const canonicalPath = `.agent/commands/${commandName}.md`;
    const adapterName = `jc-${commandName}`;

    const wrappers = [
      {
        relPath: `.cursor/commands/${adapterName}.md`,
        pointer: buildPointer(canonicalPath),
        frontmatterName: null,
        label: `Cursor command wrapper for ${commandName}`,
      },
      {
        relPath: `.claude/commands/${adapterName}.md`,
        pointer: buildPointer(canonicalPath),
        frontmatterName: null,
        label: `Claude command wrapper for ${commandName}`,
      },
      {
        relPath: `.agents/skills/${adapterName}/SKILL.md`,
        pointer: buildPointer(canonicalPath, false),
        frontmatterName: adapterName,
        label: `Cross-platform command skill for ${commandName}`,
      },
    ];

    for (const wrapper of wrappers) {
      await verifyWrapper(wrapper.relPath, wrapper.pointer, wrapper.frontmatterName, wrapper.label);
    }
  }

  return canonicalCommandFiles;
}

async function validateSkills() {
  const canonicalSkillDirs = await listSubdirs(".agent/skills");

  for (const skillDir of canonicalSkillDirs) {
    const canonicalPath = `.agent/skills/${skillDir}/SKILL.md`;
    const wrappers = [
      {
        relPath: `.cursor/skills/${skillDir}/SKILL.md`,
        pointer: buildPointer(canonicalPath),
        frontmatterName: skillDir,
        label: `Cursor skill wrapper for ${skillDir}`,
      },
      {
        relPath: `.claude/skills/${skillDir}/SKILL.md`,
        pointer: buildPointer(canonicalPath),
        frontmatterName: skillDir,
        label: `Claude skill wrapper for ${skillDir}`,
      },
      {
        relPath: `.agents/skills/${skillDir}/SKILL.md`,
        pointer: buildPointer(canonicalPath, false),
        frontmatterName: skillDir,
        label: `Cross-platform skill ${skillDir}`,
      },
    ];

    for (const wrapper of wrappers) {
      await verifyWrapper(wrapper.relPath, wrapper.pointer, wrapper.frontmatterName, wrapper.label);
    }
  }

  return canonicalSkillDirs;
}

async function validateRules() {
  const canonicalRuleFiles = await listFiles(".agent/rules", ".md");

  for (const ruleFile of canonicalRuleFiles) {
    const ruleName = path.basename(ruleFile, ".md");
    const canonicalPath = `.agent/rules/${ruleName}.md`;
    const wrappers = [
      {
        relPath: `.cursor/rules/${ruleName}.mdc`,
        pointer: buildPointer(canonicalPath),
        frontmatterName: null,
        label: `Cursor rule trigger ${ruleName}`,
      },
      {
        relPath: `.claude/rules/${ruleName}.md`,
        pointer: buildPointer(canonicalPath),
        frontmatterName: null,
        label: `Claude rule trigger ${ruleName}`,
      },
    ];

    for (const wrapper of wrappers) {
      await verifyWrapper(wrapper.relPath, wrapper.pointer, wrapper.frontmatterName, wrapper.label);
    }
  }

  return canonicalRuleFiles;
}

async function validateSubagents() {
  const canonicalTemplates = await listFiles(".agent/sub-agents/templates", ".md");
  const codexConfig = (await exists(codexConfigPath))
    ? parseCodexRegistrations(await readText(codexConfigPath), (issue) => {
        addIssue(`${codexConfigPath}: ${issue}`);
      })
    : new Map();

  if (!(await exists(codexConfigPath))) {
    addIssue(`Missing Codex reviewer registry: ${codexConfigPath}`);
  }

  for (const templateFile of canonicalTemplates) {
    const templateName = path.basename(templateFile, ".md");
    const canonicalPath = `.agent/sub-agents/templates/${templateName}.md`;
    const wrappers = [
      {
        relPath: `.cursor/agents/${templateName}.md`,
        pointer: buildPointer(canonicalPath),
        frontmatterName: templateName,
        label: `Cursor reviewer wrapper ${templateName}`,
      },
      {
        relPath: `.claude/agents/${templateName}.md`,
        pointer: buildPointer(canonicalPath),
        frontmatterName: templateName,
        label: `Claude reviewer wrapper ${templateName}`,
      },
      {
        relPath: `.github/agents/${templateName}.agent.md`,
        pointer: buildPointer(canonicalPath),
        frontmatterName: templateName,
        label: `GitHub reviewer wrapper ${templateName}`,
      },
    ];

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

  return canonicalTemplates;
}

const matrixPath = ".agent/reference/cross-platform-agent-surface-matrix.md";
const codexConfigPath = ".codex/config.toml";

await validateMatrixPath(matrixPath);
await validateCopilotEntry();
await validateCanonicalScripts();

const canonicalCommandFiles = await validateCommands();
const canonicalSkillDirs = await validateSkills();
const canonicalRuleFiles = await validateRules();
const templateFiles = await validateSubagents();

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

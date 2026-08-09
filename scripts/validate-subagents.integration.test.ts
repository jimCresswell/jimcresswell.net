import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const validatorPath = fileURLToPath(new URL("./validate-subagents.mjs", import.meta.url));
const canonicalPath = ".agent/sub-agents/templates/code-reviewer.md";
const validRegistration = `[agents.code-reviewer]\nconfig_file = ".codex/agents/code-reviewer.toml"\n`;

async function createFixture(configContent: string) {
  const fixtureRoot = await mkdtemp(path.join(tmpdir(), "validate-subagents-"));
  const wrapperContent = `---\nname: code-reviewer\n---\n\nRead and follow @${canonicalPath}\n`;

  await Promise.all([
    mkdir(path.join(fixtureRoot, ".agent/sub-agents/templates"), { recursive: true }),
    mkdir(path.join(fixtureRoot, ".claude/agents"), { recursive: true }),
    mkdir(path.join(fixtureRoot, ".codex/agents"), { recursive: true }),
    mkdir(path.join(fixtureRoot, ".cursor/agents"), { recursive: true }),
    mkdir(path.join(fixtureRoot, ".github/agents"), { recursive: true }),
  ]);
  await Promise.all([
    writeFile(path.join(fixtureRoot, canonicalPath), "# Code reviewer\n"),
    writeFile(path.join(fixtureRoot, ".claude/agents/code-reviewer.md"), wrapperContent),
    writeFile(path.join(fixtureRoot, ".cursor/agents/code-reviewer.md"), wrapperContent),
    writeFile(path.join(fixtureRoot, ".github/agents/code-reviewer.agent.md"), wrapperContent),
    writeFile(
      path.join(fixtureRoot, ".codex/agents/code-reviewer.toml"),
      `developer_instructions = "Read ${canonicalPath}"\n`
    ),
    writeFile(path.join(fixtureRoot, ".codex/config.toml"), configContent),
  ]);

  return fixtureRoot;
}

function runValidator(fixtureRoot: string) {
  return spawnSync(process.execPath, [validatorPath], {
    cwd: fixtureRoot,
    encoding: "utf8",
  });
}

async function withFixture(
  configContent: string,
  assertion: (fixtureRoot: string) => Promise<void> | void
) {
  const fixtureRoot = await createFixture(configContent);
  try {
    await assertion(fixtureRoot);
  } finally {
    await rm(fixtureRoot, { recursive: true, force: true });
  }
}

describe("validate-subagents", () => {
  it("accepts a complete cross-platform reviewer fixture", async () => {
    await withFixture(validRegistration, (fixtureRoot) => {
      const result = runValidator(fixtureRoot);

      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Sub-agent validation passed (templates: 1).");
      expect(result.stderr).toBe("");
    });
  });

  it("rejects a Codex adapter without a canonical template", async () => {
    await withFixture(validRegistration, async (fixtureRoot) => {
      await writeFile(path.join(fixtureRoot, ".codex/agents/orphaned-reviewer.toml"), "");

      const result = runValidator(fixtureRoot);

      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        ".codex/agents/orphaned-reviewer.toml: no canonical sub-agent template"
      );
    });
  });

  it.each([
    ["missing", ""],
    ["malformed", "config_file = 42\n"],
  ])("rejects an orphaned Codex registration with %s config_file", async (_case, configLine) => {
    await withFixture(
      `${validRegistration}\n[agents.orphaned-reviewer]\n${configLine}`,
      (fixtureRoot) => {
        const result = runValidator(fixtureRoot);

        expect(result.status).toBe(1);
        expect(result.stderr).toContain(
          '.codex/config.toml: [agents."orphaned-reviewer"] has no canonical sub-agent template'
        );
      }
    );
  });
});

import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const manifestPath = path.join(projectRoot, "landing-lock.json");

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

async function main() {
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  const failures = [];
  const seenPaths = new Set();

  for (const entry of manifest.files ?? []) {
    if (
      typeof entry.path !== "string" ||
      !/^[a-f0-9]{64}$/.test(entry.sha256 ?? "") ||
      seenPaths.has(entry.path)
    ) {
      failures.push(`${entry.path ?? "<invalid>"}: invalid manifest entry`);
      continue;
    }

    seenPaths.add(entry.path);

    try {
      const content = await readFile(path.join(projectRoot, entry.path));
      const actualHash = sha256(content);

      if (actualHash !== entry.sha256) {
        failures.push(`${entry.path}: content differs from the approved release`);
      }
    } catch (error) {
      failures.push(`${entry.path}: ${error.code === "ENOENT" ? "protected file is missing" : error.message}`);
    }
  }

  if (seenPaths.size === 0) {
    failures.push("landing-lock.json contains no protected files");
  }

  if (failures.length > 0) {
    console.error("\nLANDING PAGE SEAL VIOLATION\n");
    for (const failure of failures) console.error(`- ${failure}`);
    console.error(
      "\nRestore the protected files. Do not update the hashes unless the owner explicitly authorized a landing-page change.\n",
    );
    process.exitCode = 1;
    return;
  }

  console.log(`Landing page seal verified (${seenPaths.size} protected files).`);
}

await main();

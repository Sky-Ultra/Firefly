import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("cloud formatting checks use the same pinned Biome version as the project", () => {
	const manifest = JSON.parse(
		readFileSync(new URL("../package.json", import.meta.url), "utf8"),
	) as { devDependencies: Record<string, string> };
	const version = manifest.devDependencies["@biomejs/biome"];
	assert.match(version, /^\d+\.\d+\.\d+$/);
	const workflow = readFileSync(
		new URL("../.github/workflows/biome.yml", import.meta.url),
		"utf8",
	);
	const ciVersion = workflow.match(
		/^\s+version:\s*["']?([^\s"']+)["']?\s*$/m,
	)?.[1];
	assert.equal(ciVersion, version);
});

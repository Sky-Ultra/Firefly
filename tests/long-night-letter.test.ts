import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const source = readFileSync(
	new URL("../src/content/posts/long-night-love-letter.md", import.meta.url),
	"utf8",
);
const translation = readFileSync(
	new URL(
		"../src/content/translations/long-night-love-letter.en.md",
		import.meta.url,
	),
	"utf8",
);
test("long-night-love-letter preserves public metadata and actual statistics without publishing its private body", () => {
	assert.ok(source.includes("title: ⌈长夜⌋的情书"));
	assert.ok(source.includes("published: 2026-10-28"));
	assert.ok(source.includes("author: Sky"));
	assert.match(source, /^password: server$/m);
	assert.match(source, /^serverProtected: true$/m);
	assert.match(source, / {2}words: 3805/);
	assert.doesNotMatch(source, /^sealedContent:|^ {2}payload:/m);
	assert.equal(
		source.replace(/^---\n[\s\S]*?\n---\n/, "").trim(),
		"正文由服务器验证后提供。",
	);
	assert.equal(
		translation.replace(/^---\n[\s\S]*?\n---\n/, "").trim(),
		"The article is provided by the server after verification.",
	);
	assert.ok(translation.includes(computeSourceHash(source)));
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const source = readFileSync(
	new URL("../src/content/posts/liking.md", import.meta.url),
	"utf8",
);
const translation = readFileSync(
	new URL("../src/content/translations/liking.en.md", import.meta.url),
	"utf8",
);
test("liking preserves public metadata and actual statistics without publishing its private body", () => {
	assert.ok(source.includes("title: ⌈喜欢⌋"));
	assert.ok(source.includes("published: 2026-10-10"));
	assert.ok(source.includes("author: Sky"));
	assert.match(source, /^password: server$/m);
	assert.match(source, /^serverProtected: true$/m);
	assert.match(source, / {2}words: 616/);
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

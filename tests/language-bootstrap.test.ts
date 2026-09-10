import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const manager = readFileSync(
	new URL("../src/components/features/LanguageManager.astro", import.meta.url),
	"utf8",
);

test("language detection runs inline before the page body is rendered", () => {
	assert.match(manager, /<script is:inline>/);
	assert.match(manager, /navigator\.languages\?\.\[0\]/);
	assert.match(manager, /localStorage\.setItem\(storageKey, language\)/);
	assert.match(manager, /data-language-pending/);
	assert.match(
		manager,
		/delete document\.documentElement\.dataset\.languagePending/,
	);
});

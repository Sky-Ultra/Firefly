import assert from "node:assert/strict";
import test from "node:test";
import {
	buildTranslationModuleIndex,
	normalizeTranslationModuleId,
} from "../src/utils/post-translation-path";

test("normalizes Markdown, MDX, and nested index translation IDs", () => {
	assert.equal(
		normalizeTranslationModuleId(
			"/src/content/translations/code-examples.en.md",
		),
		"code-examples",
	);
	assert.equal(
		normalizeTranslationModuleId(
			"/src/content/translations/mdx-example.en.mdx",
		),
		"mdx-example",
	);
	assert.equal(
		normalizeTranslationModuleId("/src/content/translations/guide/index.en.md"),
		"guide",
	);
	assert.equal(
		normalizeTranslationModuleId(
			"/src/content/translations/personal-website-introduction/index.en.md",
		),
		"personal-website-introduction",
	);
});

test("rejects paths outside the translations directory and non-paired names", () => {
	for (const invalidPath of [
		"/src/content/posts/code-examples.en.md",
		"/src/content/translations/code-examples.md",
		"/src/content/translations/cover.png",
		"/src/content/translations/personal-website-introduction-en.md",
	]) {
		assert.throws(
			() => normalizeTranslationModuleId(invalidPath),
			/paired English Markdown or MDX/i,
		);
	}
});

test("builds a stable module index", () => {
	const modules = {
		"/src/content/translations/post.en.md": { name: "post" },
		"/src/content/translations/guide/index.en.md": { name: "guide" },
	};
	const index = buildTranslationModuleIndex(modules);
	assert.deepEqual([...index.keys()], ["guide", "post"]);
	assert.equal(index.get("guide")?.name, "guide");
});

test("rejects duplicate normalized article IDs", () => {
	assert.throws(
		() =>
			buildTranslationModuleIndex({
				"/src/content/translations/guide.en.md": { name: "flat" },
				"/src/content/translations/guide/index.en.md": { name: "nested" },
			}),
		/duplicate English translation.*guide/i,
	);
});

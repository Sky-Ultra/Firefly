import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const readContent = (relativePath: string): string => {
	const location = new URL(`../src/content/${relativePath}`, import.meta.url);
	assert.ok(existsSync(location), `Published content exists: ${relativePath}`);
	return readFileSync(location, "utf8").replaceAll("\r\n", "\n");
};
const bodyOf = (content: string): string =>
	content.replace(/^---\n[\s\S]*?\n---\n/, "");
const paragraphsOf = (body: string): string[] =>
	body
		.trim()
		.split("\n\n")
		.map((paragraph) =>
			paragraph.startsWith('<div class="word-paragraph-gap"')
				? ""
				: paragraph.trim(),
		);

test("publishes liking as an essay with today's date and the exact two-line description", () => {
	const article = readContent("posts/liking.md");
	assert.match(article, /^title: ⌈喜欢⌋$/m);
	assert.match(
		article,
		/description: \|-\n {2}今晚月色真美\.\.\.\.\.\.\n {2}但我真的累了\.\.\.\.\.\.\n/,
	);
	for (const field of [
		"published: 2026-10-10",
		"author: Sky",
		"category: 随笔",
		"categoryEn: Essay",
		"image: random",
		"comment: true",
		"draft: false",
	]) {
		assert.ok(article.split("\n").includes(field), field);
	}
});

test("preserves every Word paragraph and the author's wording without additions", () => {
	const paragraphs = paragraphsOf(bodyOf(readContent("posts/liking.md")));
	assert.equal(paragraphs.length, 75);
	assert.equal(paragraphs.filter(Boolean).length, 74);
	assert.equal(paragraphs[72], "");
	assert.equal(
		createHash("sha256").update(paragraphs.join("\n"), "utf8").digest("hex"),
		"ed3e01b1ce54f2977fbe5a9e5b5be88a8ea4ba4b15e87f08be664d3d06a8fa8c",
	);
});

test("keeps the English essay paired with the current Chinese body and paragraph structure", () => {
	const article = readContent("posts/liking.md");
	const translation = readContent("translations/liking.en.md");
	assert.match(translation, /^translationOf: liking\.md$/m);
	assert.match(
		translation,
		new RegExp(`^sourceHash: ${computeSourceHash(article)}$`, "m"),
	);
	const paragraphs = paragraphsOf(bodyOf(translation));
	assert.equal(paragraphs.length, 75);
	assert.equal(paragraphs[72], "");
	assert.equal(paragraphs[0], "Sometimes I feel");
	assert.equal(paragraphs[74], "Wishing you well…");
});

test("article cards preserve literal description line breaks instead of collapsing them", () => {
	const card = readFileSync(
		new URL("../src/components/layout/PostCard.astro", import.meta.url),
		"utf8",
	);
	const descriptionSection = card
		.split("<!-- description -->")[1]
		?.split("<!-- bottom tags")[0];
	assert.ok(descriptionSection);
	assert.match(descriptionSection, /\bwhitespace-pre-line\b/);
});

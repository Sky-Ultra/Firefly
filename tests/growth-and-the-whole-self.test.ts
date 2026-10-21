import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const sourcePath = "posts/growth-and-the-whole-self.md";
const translationPath = "translations/growth-and-the-whole-self.en.md";
const gapIndices = [5, 17, 27, 40, 47, 54, 64, 70, 78, 88];
const highlightedIndices = [
	3, 4, 9, 10, 11, 12, 13, 18, 19, 20, 21, 22, 23, 34, 35, 39, 41, 42, 56, 57,
	58, 59, 60, 63, 89, 90,
];
const readContent = (relativePath: string): string => {
	const location = new URL(`../src/content/${relativePath}`, import.meta.url);
	assert.ok(existsSync(location), `Published content exists: ${relativePath}`);
	return readFileSync(location, "utf8").replaceAll("\r\n", "\n");
};
const bodyOf = (content: string): string =>
	content.replace(/^---\n[\s\S]*?\n---\n/, "");
const paragraphsOf = (content: string): string[] =>
	bodyOf(content)
		.trim()
		.split("\n\n")
		.map((paragraph) =>
			paragraph.startsWith('<div class="word-paragraph-gap"')
				? ""
				: paragraph.trim(),
		);

test("publishes the growth essay with the source title, today's date and the exact three-line introduction", () => {
	const source = readContent(sourcePath);
	for (const field of [
		"title: “成长不是成为更好的自己，而是拼凑完整的自己”",
		"published: 2026-10-21",
		"author: Sky",
		"category: 随笔",
		"categoryEn: Essay",
		"tags: [随笔]",
		"tagsEn: [Essay]",
		"image: random",
		"comment: true",
		"draft: false",
	]) {
		assert.ok(source.split("\n").includes(field), field);
	}
	assert.match(
		source,
		/description: \|-\n {2}算是对自己的一些反思吧\.\.\.\n {2}唉，过去似乎有点蠢了\.\.\.\n {2}灵感来源银狼\n/,
	);
});

test("preserves all 91 Word paragraphs, the 10 intentional gaps and the author's exact wording", () => {
	const paragraphs = paragraphsOf(readContent(sourcePath)).map((paragraph) =>
		paragraph.replaceAll(
			/<mark class="theme-highlight">([\s\S]*?)<\/mark>/g,
			"$1",
		),
	);
	assert.equal(paragraphs.length, 91);
	assert.equal(paragraphs.filter(Boolean).length, 81);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		gapIndices,
	);
	assert.equal(
		createHash("sha256").update(paragraphs.join("\n"), "utf8").digest("hex"),
		"e114ae5d4ef638c425705ea2a80f50196e7f74e9bcd4aa0fb2583275b49fd4b5",
	);
});

test("converts precisely the 26 Word highlights to the existing theme highlighter without inserting images", () => {
	const source = readContent(sourcePath);
	const paragraphs = paragraphsOf(source);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) =>
			paragraph.startsWith('<mark class="theme-highlight">') ? [index] : [],
		),
		highlightedIndices,
	);
	assert.equal((bodyOf(source).match(/<mark\b/g) ?? []).length, 26);
	for (const index of highlightedIndices) {
		assert.match(
			paragraphs[index],
			/^<mark class="theme-highlight">[^<>]+<\/mark>$/,
		);
	}
	assert.doesNotMatch(
		bodyOf(source),
		/!\[[^\]]*\]\(|<img\b|<style\b|color-mix/,
	);
});

test("pairs the full English essay with the Chinese source and preserves every gap and highlight position", () => {
	const source = readContent(sourcePath);
	const translation = readContent(translationPath);
	assert.match(translation, /^translationOf: growth-and-the-whole-self\.md$/m);
	assert.ok(
		translation
			.split("\n")
			.includes(`sourceHash: ${computeSourceHash(source)}`),
	);
	const paragraphs = paragraphsOf(translation);
	assert.equal(paragraphs.length, 91);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		gapIndices,
	);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) =>
			paragraph.startsWith('<mark class="theme-highlight">') ? [index] : [],
		),
		highlightedIndices,
	);
	assert.equal(paragraphs[0], "I am finally beginning to understand,");
	assert.equal(
		paragraphs[90],
		'<mark class="theme-highlight">can only be myself.</mark>',
	);
});

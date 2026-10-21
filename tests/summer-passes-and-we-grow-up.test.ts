import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const sourcePath = "posts/summer-passes-and-we-grow-up.md";
const translationPath = "translations/summer-passes-and-we-grow-up.en.md";
const gapIndices = [5, 14, 20, 28, 36, 45, 56, 64, 74, 80, 96, 108, 111, 118];
const highlightedIndices = [
	15, 16, 17, 29, 30, 31, 37, 38, 39, 40, 53, 54, 55, 62, 63, 78, 79, 104, 105,
	106, 107, 119,
];
const continuationNote =
	/<!-- summer-continuation:start -->[\s\S]*?<!-- summer-continuation:end -->\s*/;
const readContent = (relativePath: string): string => {
	const location = new URL(`../src/content/${relativePath}`, import.meta.url);
	assert.ok(existsSync(location), `Published content exists: ${relativePath}`);
	return readFileSync(location, "utf8").replaceAll("\r\n", "\n");
};
const bodyOf = (content: string): string =>
	content.replace(/^---\n[\s\S]*?\n---\n/, "");
const paragraphsOf = (content: string): string[] =>
	bodyOf(content)
		.replace(continuationNote, "")
		.trim()
		.split("\n\n")
		.map((paragraph) =>
			paragraph.startsWith('<div class="word-paragraph-gap"')
				? ""
				: paragraph.trim(),
		);

test("publishes the summer follow-up with the source title, today's date and the exact two-line introduction", () => {
	const source = readContent(sourcePath);
	for (const field of [
		"title: 夏天总会过去，而人总要长大",
		"published: 2026-10-22",
		"author: Sky",
		"category: 随笔",
		"categoryEn: Essay",
		"tags: [随笔, 夏天]",
		"tagsEn: [Essay, Summer]",
		"image: random",
		"comment: true",
		"draft: false",
	]) {
		assert.ok(source.split("\n").includes(field), field);
	}
	assert.match(
		source,
		/description: \|-\n {2}”但明年，盛夏依旧会如期而至\.\.\.“\n {2}就作为“夏天还在那里”的续文吧\.\.\.\n/,
	);
});

test("preserves all 120 Word paragraphs, 14 intentional gaps and every original character", () => {
	const paragraphs = paragraphsOf(readContent(sourcePath)).map((paragraph) =>
		paragraph.replaceAll(
			/<mark class="theme-highlight">([\s\S]*?)<\/mark>/g,
			"$1",
		),
	);
	assert.equal(paragraphs.length, 120);
	assert.equal(paragraphs.filter(Boolean).length, 106);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		gapIndices,
	);
	assert.equal(
		createHash("sha256").update(paragraphs.join("\n"), "utf8").digest("hex"),
		"42f788f8b049f0bbd919528fb0a8c46403a1ec1acbb604675fbeccc86b773a89",
	);
});

test("keeps all 22 text highlights in place without highlighting the empty paragraph or adding images", () => {
	const source = readContent(sourcePath);
	const paragraphs = paragraphsOf(source);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) =>
			paragraph.startsWith('<mark class="theme-highlight">') ? [index] : [],
		),
		highlightedIndices,
	);
	assert.equal((bodyOf(source).match(/<mark\b/g) ?? []).length, 22);
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

test("links the predecessor before the untouched essay and keeps the full English version paired", () => {
	const source = readContent(sourcePath);
	const translation = readContent(translationPath);
	for (const content of [source, translation]) {
		const note = bodyOf(content).match(continuationNote);
		assert.ok(note);
		assert.ok(note[0].includes("(/posts/summer-is-still-there/)"));
		assert.ok(bodyOf(content).trimStart().startsWith(note[0].trim()));
	}
	assert.match(
		translation,
		/^translationOf: summer-passes-and-we-grow-up\.md$/m,
	);
	assert.ok(
		translation
			.split("\n")
			.includes(`sourceHash: ${computeSourceHash(source)}`),
	);
	const paragraphs = paragraphsOf(translation);
	assert.equal(paragraphs.length, 120);
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
	assert.equal(paragraphs[0], "Summer has come again.");
	assert.equal(
		paragraphs[119],
		'<mark class="theme-highlight">And we all have to grow up, little by little.</mark>',
	);
});

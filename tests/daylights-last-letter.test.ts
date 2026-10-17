import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const readContent = (relativePath: string): string =>
	readFileSync(
		new URL(`../src/content/${relativePath}`, import.meta.url),
		"utf8",
	).replaceAll("\r\n", "\n");
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
const source = readContent("posts/daylights-last-letter.md");
const translation = readContent("translations/daylights-last-letter.en.md");

test("publishes Daylight's Last Letter with the exact introduction and requested date", () => {
	for (const field of [
		"title: 白昼的遗书",
		"published: 2026-10-17",
		"description: 愿我们在清醒的现实中再会...",
		"author: Sky",
		"tags: [随笔]",
		"category: 随笔",
		"categoryEn: Essay",
		"image: random",
		"comment: true",
		"draft: false",
	]) {
		assert.ok(source.split("\n").includes(field), field);
	}
});

test("preserves all Word paragraphs, four intentional gaps, and the author's original wording", () => {
	const paragraphs = paragraphsOf(bodyOf(source));
	assert.equal(paragraphs.length, 67);
	assert.equal(paragraphs.filter(Boolean).length, 63);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		[10, 20, 22, 63],
	);
	assert.equal(
		createHash("sha256").update(paragraphs.join("\n"), "utf8").digest("hex"),
		"a9416097779dcbdf4ea36cc5ea34697f722db10f17f5902b9665cbcc773876f4",
	);
	assert.equal(paragraphs[0], "爱，难道不是一件很奇怪的东西吗？");
	assert.equal(paragraphs[66], "我们曾经那么认真地爱过一个人……");
});

test("pairs the complete English essay with the Chinese body and matching paragraph structure", () => {
	assert.match(translation, /^translationOf: daylights-last-letter\.md$/m);
	assert.match(
		translation,
		new RegExp(`^sourceHash: ${computeSourceHash(source)}$`, "m"),
	);
	const paragraphs = paragraphsOf(bodyOf(translation));
	assert.equal(paragraphs.length, 67);
	assert.equal(paragraphs.filter(Boolean).length, 63);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		[10, 20, 22, 63],
	);
	assert.equal(paragraphs[0], "Isn't love a strange thing?");
	assert.equal(paragraphs[66], "we once loved someone so earnestly…");
});

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
const source = readContent("posts/the-risk-of-forming-bonds.md");
const translation = readContent("translations/the-risk-of-forming-bonds.en.md");

test("publishes the bonds essay with Sky as author and the requested date and three-line introduction", () => {
	for (const field of [
		"title: 制造羁绊，就要承受落泪的风险",
		"published: 2026-10-16",
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
	assert.match(
		source,
		/description: \|-\n {2}如果我是一棵树，\n {2}那我希望我拥有永远生长不完的年轮。\n {2}欲语泪先流\.\.\.\n/,
	);
});

test("preserves every Word paragraph, the two intentional gaps, and the author's original wording", () => {
	const paragraphs = paragraphsOf(bodyOf(source));
	assert.equal(paragraphs.length, 59);
	assert.equal(paragraphs.filter(Boolean).length, 57);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		[12, 14],
	);
	assert.equal(
		createHash("sha256").update(paragraphs.join("\n"), "utf8").digest("hex"),
		"d08badba15e2bfde3fa5758c8d34b336469597f5a9ebb198420ef0195a6618ef",
	);
	assert.equal(paragraphs[13], "“物是人非事事休，欲语泪先流。”");
	assert.equal(paragraphs[58], "那我希望我拥有永远生长不完的年轮。");
});

test("pairs the full English translation with the current Chinese body and paragraph structure", () => {
	assert.match(translation, /^translationOf: the-risk-of-forming-bonds\.md$/m);
	assert.match(
		translation,
		new RegExp(`^sourceHash: ${computeSourceHash(source)}$`, "m"),
	);
	const paragraphs = paragraphsOf(bodyOf(translation));
	assert.equal(paragraphs.length, 59);
	assert.equal(paragraphs.filter(Boolean).length, 57);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		[12, 14],
	);
	assert.equal(paragraphs[0], "If I were a tree,");
	assert.equal(
		paragraphs[58],
		"I would wish for rings that could keep growing forever.",
	);
});

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const sourcePath = "posts/human-transformer.md";
const translationPath = "translations/human-transformer.en.md";
const gaps = [10, 15, 24, 32, 39, 49, 56, 62, 72, 75];
const highlights = [
	0, 4, 7, 11, 12, 13, 16, 17, 23, 34, 43, 45, 47, 50, 51, 59, 60, 61, 71, 73,
	74, 76,
];

function readContent(path: string): string {
	const file = new URL(`../src/content/${path}`, import.meta.url);
	assert.ok(existsSync(file), `Published content exists: ${path}`);
	return readFileSync(file, "utf8").replaceAll("\r\n", "\n");
}
const bodyOf = (content: string) =>
	content.replace(/^---\n[\s\S]*?\n---\n/, "");
const paragraphsOf = (content: string) =>
	bodyOf(content)
		.trim()
		.split("\n\n")
		.map((p) => (p.startsWith('<div class="word-paragraph-gap"') ? "" : p));

test("publishes the Transformer essay with the source title, author, today and exact introduction", () => {
	const content = readContent(sourcePath);
	for (const field of [
		"title: 人类就是一个Transformer：在注意力机制的尽头...",
		"published: 2026-10-23",
		"author: Sky",
		"category: 随笔",
		"categoryEn: Essay",
		"image: random",
		"comment: true",
		"draft: false",
	]) {
		assert.ok(content.split("\n").includes(field), field);
	}
	assert.match(
		content,
		/description: \|-\n {2}意识，是 Transformer 的一场幻觉吗？\n {2}亿万次梯度下降后，我似乎仍未学会如何成为⌈人⌋\.\.\.\n/,
	);
});

test("preserves all 67 nonempty Word paragraphs, 10 intentional gaps and original characters", () => {
	const paragraphs = paragraphsOf(readContent(sourcePath)).map((p) =>
		p.replace(/<mark class="theme-highlight">([\s\S]*?)<\/mark>/g, "$1"),
	);
	assert.equal(paragraphs.length, 77);
	assert.equal(paragraphs.filter(Boolean).length, 67);
	assert.deepEqual(
		paragraphs.flatMap((p, i) => (p ? [] : [i])),
		gaps,
	);
	assert.equal(
		createHash("sha256").update(paragraphs.join("\n"), "utf8").digest("hex"),
		"810ef5a6d0e4b5eca0e750c4acbda059ab2d1a396af114a27930b97127c454b3",
	);
});

test("maps only the 22 nonempty Word highlights to the site highlighter and adds no body images", () => {
	const content = readContent(sourcePath);
	const paragraphs = paragraphsOf(content);
	assert.deepEqual(
		paragraphs.flatMap((p, i) =>
			p.includes('<mark class="theme-highlight">') ? [i] : [],
		),
		highlights,
	);
	assert.equal((bodyOf(content).match(/<mark\b/g) ?? []).length, 22);
	assert.ok(
		paragraphs[0].startsWith(
			'<mark class="theme-highlight">做了个噩梦，突然感觉人类就是一个巨大的 Transformer。</mark>根据权重',
		),
	);
	assert.ok(
		paragraphs[12].endsWith(
			'<mark class="theme-highlight">那些曾经拥有极高注意力权重的人和事，最终也可能成为无法被重新检索的历史信息。</mark>',
		),
	);
	assert.doesNotMatch(bodyOf(content), /!\[|<img\b|<style\b/);
});

test("pairs a complete English translation with the same paragraph and highlight structure", () => {
	const content = readContent(sourcePath);
	const translation = readContent(translationPath);
	assert.match(translation, /^translationOf: human-transformer\.md$/m);
	assert.ok(
		translation
			.split("\n")
			.includes(`sourceHash: ${computeSourceHash(content)}`),
	);
	const paragraphs = paragraphsOf(translation);
	assert.equal(paragraphs.length, 77);
	assert.deepEqual(
		paragraphs.flatMap((p, i) => (p ? [] : [i])),
		gaps,
	);
	assert.deepEqual(
		paragraphs.flatMap((p, i) =>
			p.includes('<mark class="theme-highlight">') ? [i] : [],
		),
		highlights,
	);
	assert.match(paragraphs[76], /you.*❤\./);
});

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const readArticle = (path: string): string =>
	readFileSync(
		new URL(`../src/content/${path}`, import.meta.url),
		"utf8",
	).replaceAll("\r\n", "\n");
const bodyOf = (content: string): string =>
	content.replace(/^---\n[\s\S]*?\n---\n/, "");
const source = readArticle("posts/rhine-lab-archives-guide.md");
const translation = readArticle("translations/rhine-lab-archives-guide.en.md");

test("publishes the Rhine Lab archives article with today's date and the exact introduction", () => {
	for (const field of [
		"title: 莱茵生命档案的代码实现和细节",
		"published: 2026-10-14",
		"tags: [展示]",
		"category: 展示",
		"categoryEn: Showcase",
		"author: Sky",
		"image: random",
		"comment: true",
		"draft: false",
	]) {
		assert.ok(source.split("\n").includes(field), field);
	}
	assert.match(
		source,
		/description: \|-\n {2}由无数切片组成和海洋\n {2}现已开放源代码解析\.\.\.\n/,
	);
});

test("preserves the supplied Markdown body, tables, and all fifteen sections", () => {
	const body = bodyOf(source).trim();
	assert.equal(
		createHash("sha256").update(body, "utf8").digest("hex"),
		"4b2d40e849b3235a0f648d3f6835d6b4278841df38f0dc79153d5bfa0e0c4364",
	);
	assert.equal(
		body.split("\n").filter((line) => line.startsWith("## ")).length,
		15,
	);
	assert.doesNotMatch(body, /^# /m);
	assert.match(body, /当前 `archives\.json` 有 169 份档案/);
});

test("pairs the complete English article with the source and preserves all code examples", () => {
	assert.match(translation, /^translationOf: rhine-lab-archives-guide\.md$/m);
	assert.match(
		translation,
		new RegExp(`^sourceHash: ${computeSourceHash(source)}$`, "m"),
	);
	const blocksOf = (body: string): string[] =>
		[...body.matchAll(/^```[^\n]*\n[\s\S]*?^```/gm)].map((match) => match[0]);
	const sourceBlocks = blocksOf(bodyOf(source));
	assert.equal(sourceBlocks.length, 21);
	assert.deepEqual(blocksOf(bodyOf(translation)), sourceBlocks);
	assert.equal(
		bodyOf(translation)
			.split("\n")
			.filter((line) => line.startsWith("## ")).length,
		15,
	);
});

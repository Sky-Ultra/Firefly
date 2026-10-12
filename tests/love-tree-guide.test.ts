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
const source = readArticle("posts/love-tree-guide.md");
const translation = readArticle("translations/love-tree-guide.en.md");

test("publishes the love tree article as a showcase with the exact two-line introduction", () => {
	for (const field of [
		"title: 告白树/恋爱树的实现方式和原理",
		"published: 2026-10-12",
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
		/description: \|-\n {2}七百朵爱的花瓣组合成的爱心树\.\.\.\n {2}实际页面目前仅定向开放，但项目本身我现已经开源。欢迎取用\n/,
	);
});

test("preserves the supplied Markdown body and keeps the selected-access page without a public entry", () => {
	const body = bodyOf(source).trim();
	assert.equal(
		createHash("sha256").update(body, "utf8").digest("hex"),
		"a026f04fde0929e2a148796cf6914f55f26b2b6c95ad445a9c95c14b0cad9321",
	);
	assert.equal(
		body.split("\n").filter((line) => line.startsWith("## ")).length,
		11,
	);
	assert.doesNotMatch(body, /^# /m);
	assert.match(
		body,
		/\[恋爱计时组件\]\(https:\/\/xiaoxiaoboluo\.cn\/posts\/relationship-timer-guide\/\)/,
	);
	assert.doesNotMatch(body, /\[[^\]]*\]\(\/?love\//);
});

test("pairs the complete English article with the source and preserves all code examples", () => {
	assert.match(translation, /^translationOf: love-tree-guide\.md$/m);
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
		11,
	);
});

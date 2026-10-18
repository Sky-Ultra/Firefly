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
const source = readArticle("posts/between-bases-dna-website-guide.md");
const translation = readArticle(
	"translations/between-bases-dna-website-guide.en.md",
);

test("publishes the DNA website article as a showcase with the exact three-line introduction", () => {
	for (const field of [
		"title: 碱基之间：脱氧核糖核酸展示网站的技术实现与知识库展示",
		"published: 2026-10-18",
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
		/description: \|-\n {2}脱氧核糖核酸及碱基展示项目技术现已开源\n {2}现已开放源码技术解析\.\.\.\.\.\.\n {2}“生命的重量\.\.\.”\n/,
	);
});

test("preserves the supplied Markdown body, tables, and all thirteen sections", () => {
	const body = bodyOf(source).trim();
	assert.equal(
		createHash("sha256").update(body, "utf8").digest("hex"),
		"e0eb82b147c72066518f835ff87545f2d01e5eaa786a6678814643d69185a257",
	);
	assert.equal(
		body.split("\n").filter((line) => line.startsWith("## ")).length,
		13,
	);
	assert.doesNotMatch(body, /^# /m);
	assert.ok(body.endsWith("至此\nSky."));
});

test("pairs the full English article and preserves all code examples and source URLs", () => {
	assert.match(
		translation,
		/^translationOf: between-bases-dna-website-guide\.md$/m,
	);
	assert.match(
		translation,
		new RegExp(`^sourceHash: ${computeSourceHash(source)}$`, "m"),
	);
	const blocksOf = (body: string): string[] =>
		[...body.matchAll(/^```[^\n]*\n[\s\S]*?^```/gm)].map((match) => match[0]);
	const sourceBlocks = blocksOf(bodyOf(source));
	assert.equal(sourceBlocks.length, 16);
	assert.deepEqual(blocksOf(bodyOf(translation)), sourceBlocks);
	const urlsOf = (body: string): string[] =>
		[...body.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((match) => match[1]);
	const sourceUrls = urlsOf(bodyOf(source));
	assert.equal(sourceUrls.length, 14);
	assert.deepEqual(urlsOf(bodyOf(translation)), sourceUrls);
	assert.equal(
		bodyOf(translation)
			.split("\n")
			.filter((line) => line.startsWith("## ")).length,
		13,
	);
});

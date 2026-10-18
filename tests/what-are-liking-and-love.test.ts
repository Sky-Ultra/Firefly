import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const readContent = (relativePath: string): string => {
	const file = new URL(`../src/content/${relativePath}`, import.meta.url);
	assert.ok(existsSync(file), `Published article exists: ${relativePath}`);
	return readFileSync(file, "utf8").replaceAll("\r\n", "\n");
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
				: paragraph.replace(/<mark\b[^>]*>|<\/mark>/g, "").trim(),
		);
const sourcePath = "posts/what-are-liking-and-love.md";
const translationPath = "translations/what-are-liking-and-love.en.md";
const highlighted = [
	{
		index: 22,
		text: "我一直以为喜欢很简单。",
	},
	{
		index: 23,
		text: "喜欢一个人，就是想见她，",
	},
	{
		index: 24,
		text: "想把看到的有趣的东西赶紧告诉她，",
	},
	{
		index: 25,
		text: "想知道她今天过得好不好。",
	},
	{
		index: 26,
		text: "她难过的时候，陪着她就好了。",
	},
	{
		index: 27,
		text: "听起来真的很简单。",
	},
	{
		index: 30,
		text: "喜欢一个人以后，",
	},
	{
		index: 31,
		text: "我会突然变得很小心。",
	},
	{
		index: 40,
		text: "我到底是喜欢她，",
	},
	{
		index: 41,
		text: "还是喜欢那个我自己脑补出来的她？",
	},
	{
		index: 42,
		text: "爱到底是什么呢？",
	},
	{
		index: 88,
		text: "可现在喜欢一个人，",
	},
	{
		index: 89,
		text: "我却学会了克制，",
	},
	{
		index: 90,
		text: "学会了隐藏，",
	},
	{
		index: 91,
		text: "学会了想很多很多。",
	},
	{
		index: 92,
		text: "这到底算成熟，",
	},
	{
		index: 93,
		text: "还是只是胆小呢？",
	},
	{
		index: 99,
		text: "我突然有点羡慕它们。",
	},
	{
		index: 100,
		text: "喜欢就是喜欢，想念就是想念。",
	},
	{
		index: 101,
		text: "不用分析，不用证明，",
	},
	{
		index: 102,
		text: "也不用担心以后。",
	},
	{
		index: 117,
		text: "我真的遇见那个想珍惜的人了…",
	},
	{
		index: 118,
		text: "我该怎么办呢？",
	},
	{
		index: 119,
		text: "要勇敢一点吗？",
	},
	{
		index: 120,
		text: "还是继续保持距离？",
	},
	{
		index: 121,
		text: "要告诉她我的喜欢吗？",
	},
	{
		index: 122,
		text: "还是等自己变得足够好再说？",
	},
	{
		index: 123,
		text: "可人哪里有真正准备好的时候啊。",
	},
];
const gapIndices = [10, 13, 19, 21, 28, 38, 49, 59, 69, 81, 94, 116, 130, 133];
const markStyle =
	"background-color: color-mix(in oklab, var(--selection-bg) 75%, transparent)";
const marksOf = (body: string) =>
	[...body.matchAll(/<mark\b([^>]*)>([\s\S]*?)<\/mark>/g)].map((match) => ({
		attributes: match[1],
		text: match[2],
	}));

test("publishes the essay with the exact two-line introduction, author and date", () => {
	const source = readContent(sourcePath);
	for (const field of [
		"title: 所以，究竟何为⌈喜欢⌋，何为⌈爱⌋...？",
		"published: 2026-10-19",
		"author: Sky",
		"tags: [随笔]",
		"category: 随笔",
		"categoryEn: Essay",
		"image: random",
		"comment: true",
		"draft: false",
	])
		assert.ok(source.split("\n").includes(field), field);
	assert.match(
		source,
		/description: \|-\n {2}只是我今晚半夜睡不着随便的发泄罢了。\n {2}唉,或许\.\.\.我永远也无法准备好呀\.\.\.\n/,
	);
});

test("preserves all Word paragraphs, intentional gaps and original wording", () => {
	const paragraphs = paragraphsOf(bodyOf(readContent(sourcePath)));
	assert.equal(paragraphs.length, 136);
	assert.equal(paragraphs.filter(Boolean).length, 122);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		gapIndices,
	);
	assert.equal(
		createHash("sha256").update(paragraphs.join("\n"), "utf8").digest("hex"),
		"e4670e2d18141397ad46350b3586563372429380cd63200a4a76d246be1e19b8",
	);
});

test("converts exactly the Word highlights to a softer local theme highlighter without changing the shared style", () => {
	const body = bodyOf(readContent(sourcePath));
	const marks = marksOf(body);
	assert.deepEqual(
		marks.map((mark) => mark.text),
		highlighted.map((entry) => entry.text),
	);
	assert.equal(marks.length, 28);
	for (const mark of marks) {
		assert.ok(mark.attributes.includes('class="theme-highlight"'));
		assert.ok(mark.attributes.includes(`style="${markStyle}"`));
	}
	assert.doesNotMatch(body, /<style\b|!important/);
	const styles = readFileSync(
		new URL("../src/styles/markdown.css", import.meta.url),
		"utf8",
	);
	assert.match(
		styles,
		/mark\.theme-highlight\s*\{\s*background-color:\s*var\(--selection-bg\);/,
	);
});

test("pairs the full English essay and keeps the same highlight and blank-paragraph positions", () => {
	const source = readContent(sourcePath);
	const translation = readContent(translationPath);
	assert.match(translation, /^translationOf: what-are-liking-and-love\.md$/m);
	assert.match(
		translation,
		new RegExp(`^sourceHash: ${computeSourceHash(source)}$`, "m"),
	);
	const paragraphs = paragraphsOf(bodyOf(translation));
	assert.equal(paragraphs.length, 136);
	assert.equal(paragraphs.filter(Boolean).length, 122);
	assert.deepEqual(
		paragraphs.flatMap((paragraph, index) => (paragraph ? [] : [index])),
		gapIndices,
	);
	const rawParagraphs = bodyOf(translation).trim().split("\n\n");
	assert.deepEqual(
		rawParagraphs.flatMap((paragraph, index) =>
			paragraph.includes("<mark ") ? [index] : [],
		),
		highlighted.map((entry) => entry.index),
	);
	const marks = marksOf(bodyOf(translation));
	assert.equal(marks.length, 28);
	assert.ok(
		marks.every((mark) => mark.attributes.includes(`style="${markStyle}"`)),
	);
	assert.equal(
		paragraphs[0],
		"Daylight saving time. It's past four in the morning, and the cicadas are still calling outside.",
	);
	assert.equal(
		paragraphs[135],
		"how can I avoid letting down someone willing to come closer to me?",
	);
});

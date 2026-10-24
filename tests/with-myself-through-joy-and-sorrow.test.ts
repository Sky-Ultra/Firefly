import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";

const read = (path: string) =>
	readFileSync(
		new URL(`../src/content/${path}`, import.meta.url),
		"utf8",
	).replaceAll("\r\n", "\n");
const source = read("posts/with-myself-through-joy-and-sorrow.md");
const translation = read(
	"translations/with-myself-through-joy-and-sorrow.en.md",
);
const body = (text: string) => text.replace(/^---\n[\s\S]*?\n---\n/, "");

test("publishes the supplied essay with today's date, Sky and the exact description", () => {
	for (const field of [
		"title: “我与自己 悲喜同舟”",
		"published: 2026-10-23",
		"author: Sky",
		"category: 随笔",
		"image: random",
		"draft: false",
	])
		assert.ok(source.includes(field));
	assert.match(
		source,
		/description: \|-\n {2}纵有千般眷恋，终随暮雪入旧年\.\.\.\n {2}欲追云兮云已散，空余月兮照旧宫\.\.\./,
	);
});

test("corrects the narrative to first person while preserving the original wording and highlights", () => {
	const plain = body(source)
		.replace(/<[^>]+>/g, "")
		.replace(/\s/g, "");
	assert.equal(plain.length, 547);
	assert.equal(
		createHash("sha256").update(plain).digest("hex"),
		"77f22a47896723a697fba3d68cd4d07388ade9b0e842be0d36f00fc4ed94692b",
	);
	assert.equal(
		(body(source).match(/<mark class="theme-highlight">/g) ?? []).length,
		9,
	);
	assert.doesNotMatch(body(source), /!\[|<img/);
	assert.doesNotMatch(body(source), /你/);
	assert.match(body(source), /我总是这样。/);
	assert.match(body(source), /从此，我与自己，悲喜同舟。/);
});

test("restores the same independent paragraphs and intentional gaps as the other essays", () => {
	const paragraphs = body(source).trim().split("\n\n");
	assert.equal(paragraphs.length, 55);
	assert.equal(
		paragraphs.filter((p) => p.startsWith('<div class="word-paragraph-gap"'))
			.length,
		7,
	);
	assert.doesNotMatch(body(source), / {2}\n|<br\s*\/?\s*>/);
});

test("pairs the complete English poem and the same highlighter positions", () => {
	assert.ok(translation.includes(`sourceHash: ${computeSourceHash(source)}`));
	assert.equal(
		(body(translation).match(/<mark class="theme-highlight">/g) ?? []).length,
		9,
	);
	assert.equal(
		body(source).trim().split("\n\n").length,
		body(translation).trim().split("\n\n").length,
	);
	assert.match(
		translation,
		/From now on, I sail with myself, through joy and sorrow/,
	);
	assert.doesNotMatch(body(translation), /\byou(?:r|rself)?\b/i);
});

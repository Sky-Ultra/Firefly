import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";
import { backgroundWallpaper } from "../src/config/backgroundWallpaper";

const additions = [
	"鸿雁长飞光不度，鱼龙潜跃水成文",
	"星斗千年循旧轨，流萤一夜动星河",
	"潮有尽兮终归岸，月无心兮照楼台",
	"欲追云兮云已散，空余月兮照旧宫",
	"只求与君共朝暮，不羡瑶台万载春",
	"花开未敢传心事，花落方知春已深",
	"纵有干般眷恋，终随暮雪入旧年",
	"淡雪融时阳彩暖，一瞬芳华抵万年",
];

test("the homepage welcome pool includes all eight additions without duplicates", () => {
	const messages = backgroundWallpaper.common?.homeText?.subtitle;
	assert.ok(Array.isArray(messages));
	assert.equal(messages.length, 32);
	assert.equal(new Set(messages).size, messages.length);
	assert.ok(messages.includes("若有人兮云之际，舞袂翩兮扬玉霓"));
	assert.ok(messages.includes("既见君兮予所欢，愿随风兮鸣银鸾"));
	assert.ok(messages.includes("物物而不物于物，念念而不念于念"));
	assert.deepEqual(messages.slice(-8), additions);
});

test("the welcome-message showcase includes the added line and the requested attribution", () => {
	const article = readFileSync(
		new URL(
			"../src/content/posts/homepage-welcome-messages.md",
			import.meta.url,
		),
		"utf8",
	);
	assert.match(
		article,
		/^> 物物而不物于物，念念而不念于念 {2}\n> ——《庄子·山木》$/m,
	);
	assert.match(article, /^published: 2026-09-30$/m);
	assert.match(article, /^updated: 2026-10-25$/m);
	assert.match(article, /截至2026\.10\.25/);
	assert.doesNotMatch(article, /截至2026\.10\.1之前/);
});

test("the eight new showcase entries preserve the user's words and use only the requested sources", () => {
	const article = readFileSync(
		new URL(
			"../src/content/posts/homepage-welcome-messages.md",
			import.meta.url,
		),
		"utf8",
	).replaceAll("\r\n", "\n");
	for (const [index, line] of additions.entries()) {
		const attribution = index === 0 ? "《春江花月夜》" : "Sky";
		assert.ok(article.includes(`> ${line}  \n> ——${attribution}`), line);
	}
	assert.equal((article.match(/^> ——Sky$/gm) ?? []).length, 7);
});

test("the welcome-message showcase's English revision is synchronized", () => {
	const article = readFileSync(
		new URL(
			"../src/content/posts/homepage-welcome-messages.md",
			import.meta.url,
		),
		"utf8",
	);
	const translation = readFileSync(
		new URL(
			"../src/content/translations/homepage-welcome-messages.en.md",
			import.meta.url,
		),
		"utf8",
	);
	assert.match(
		translation,
		new RegExp(`^sourceHash: ${computeSourceHash(article)}$`, "m"),
	);
	assert.match(
		translation,
		/Engage with things without being ruled by them; be aware of thoughts without being ruled by them\./,
	);
	assert.match(translation, /The Tree on the Mountain/);
	assert.doesNotMatch(translation, /second half is an elaboration/);
	assert.match(translation, /October 25, 2026/);
	assert.equal((translation.match(/^> —Sky$/gm) ?? []).length, 7);
	assert.equal((translation.match(/^> —/gm) ?? []).length, 32);
});

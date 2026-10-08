import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { computeSourceHash } from "../scripts/lib/post-translation-validator";
import { backgroundWallpaper } from "../src/config/backgroundWallpaper";

test("the homepage welcome pool includes both new lines without duplicates", () => {
	const messages = backgroundWallpaper.common?.homeText?.subtitle;
	assert.ok(Array.isArray(messages));
	assert.equal(messages.length, 24);
	assert.equal(new Set(messages).size, messages.length);
	assert.ok(messages.includes("若有人兮云之际，舞袂翩兮扬玉霓"));
	assert.ok(messages.includes("既见君兮予所欢，愿随风兮鸣银鸾"));
	assert.ok(messages.includes("物物而不物于物，念念而不念于念"));
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
	assert.match(article, /^updated: 2026-10-09$/m);
	assert.doesNotMatch(article, /截至2026\.10\.1之前/);
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
});

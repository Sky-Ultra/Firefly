import assert from "node:assert/strict";
import test from "node:test";
import { backgroundWallpaper } from "../src/config/backgroundWallpaper";

test("the homepage welcome pool includes both new lines without duplicates", () => {
	const messages = backgroundWallpaper.common?.homeText?.subtitle;
	assert.ok(Array.isArray(messages));
	assert.equal(messages.length, 23);
	assert.equal(new Set(messages).size, messages.length);
	assert.ok(messages.includes("若有人兮云之际，舞袂翩兮扬玉霓"));
	assert.ok(messages.includes("既见君兮予所欢，愿随风兮鸣银鸾"));
});

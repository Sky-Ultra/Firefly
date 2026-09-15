import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const animation = readFileSync(new URL("../public/love/js/animation.js", import.meta.url), "utf8");
const config = readFileSync(new URL("../public/love/config.js", import.meta.url), "utf8");

test("the love-page carousel owns an isolated phrase pool", () => {
	assert.match(config, /treeCaptions:\s*\[/);
	assert.doesNotMatch(config, /backgroundWallpaper|homeText|subtitle/);
});

test("each caption cycle targets ten seconds and deletes before switching", () => {
	assert.match(animation, /function startTreeCaptionCarousel\(el, texts, cycleDuration = 10000\)/);
	assert.match(animation, /cycleDuration - typingDuration - deletingDuration/);
	const deleting = animation.indexOf("for (let index = segments.length - 1; index >= 0; index--)");
	const switching = animation.indexOf("currentTextIndex = getNextTextIndex()");
	assert.ok(deleting >= 0 && switching > deleting);
});

test("the first caption stays fixed and later captions use a non-repeating random queue", () => {
	assert.match(animation, /let currentTextIndex = 0/);
	assert.match(animation, /randomQueue = shuffleIndexes/);
	assert.match(animation, /if \(randomQueue\[0\] === currentTextIndex\)/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const postPage = readFileSync(
	new URL("../src/pages/posts/[...slug].astro", import.meta.url),
	"utf8",
);
const sharePoster = readFileSync(
	new URL("../src/components/misc/SharePoster.svelte", import.meta.url),
	"utf8",
);

test("random-cover articles pass the complete image pool to share posters", () => {
	assert.match(
		postPage,
		/const posterCoverImages = usesRandomCover[\s\S]*randomCoverImages\.map\(\(image\) => image\.originalUrl\)/,
	);
	assert.equal(
		(postPage.match(/coverImages=\{posterCoverImages\}/g) ?? []).length,
		2,
	);
});

test("share posters select a random image while preserving a fixed-cover fallback", () => {
	assert.match(sharePoster, /export let coverImages: string\[\] = \[\]/);
	assert.match(sharePoster, /function selectPosterCoverImage\(\)/);
	assert.match(
		sharePoster,
		/Math\.floor\(Math\.random\(\) \* candidates\.length\)/,
	);
	assert.match(sharePoster, /return coverImage/);
	assert.match(
		sharePoster,
		/const selectedCoverImage = selectPosterCoverImage\(\)/,
	);
});

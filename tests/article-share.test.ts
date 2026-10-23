import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const file = (path: string) => new URL(`../${path}`, import.meta.url);
const source = (path: string) =>
	existsSync(file(path)) ? readFileSync(file(path), "utf8") : "";

test("article image has readable defaults and offers three widths and four font sizes", async () => {
	assert.ok(existsSync(file("src/utils/article-share-layout.ts")));
	const { ARTICLE_WIDTHS, ARTICLE_FONT_SIZES, DEFAULT_ARTICLE_SHARE } =
		await import("../src/utils/article-share-layout");
	assert.deepEqual(ARTICLE_WIDTHS, [480, 600, 760]);
	assert.deepEqual(ARTICLE_FONT_SIZES, [16, 18, 20, 22]);
	assert.deepEqual(DEFAULT_ARTICLE_SHARE, { width: 600, fontSize: 18 });
});

test("long images split without missing or overlapping pixels and never silently shrink text", async () => {
	assert.ok(existsSync(file("src/utils/article-share-layout.ts")));
	const { planArticleSlices } = await import(
		"../src/utils/article-share-layout"
	);
	assert.deepEqual(planArticleSlices(600, 3000, false), [
		{ top: 0, height: 3000 },
	]);
	for (const mobile of [true, false]) {
		const slices = planArticleSlices(760, 23871, mobile);
		assert.ok(slices.length > 1);
		assert.equal(slices[0].top, 0);
		assert.equal(
			slices.reduce((sum, slice) => sum + slice.height, 0),
			23871,
		);
		for (let index = 1; index < slices.length; index++)
			assert.equal(
				slices[index].top,
				slices[index - 1].top + slices[index - 1].height,
			);
		assert.ok(
			slices.every((slice) => slice.height * 2 <= (mobile ? 4096 : 16000)),
		);
	}
});

test("full article export clones only the visible unlocked reading body and cleans up", () => {
	const renderer = source("src/utils/article-share-renderer.ts");
	assert.match(renderer, /data-reading-body/);
	assert.match(renderer, /getClientRects/);
	assert.match(renderer, /cloneNode\(true\)/);
	assert.match(renderer, /document\.fonts\.ready/);
	assert.match(renderer, /finally/);
	assert.match(renderer, /\.remove\(\)/);
	assert.match(renderer, /domToBlob/);
	assert.doesNotMatch(renderer, /QRCode|weserv|toDataURL/);
});

test("offscreen positioning is on an uncaptured parent, never baked into the exported bitmap", () => {
	const css = source("src/styles/article-share.css");
	assert.doesNotMatch(css, /\.article-export-viewport\s*\{[^}]*left:\s*-/s);
	assert.match(
		source("src/utils/article-share-renderer.ts"),
		/stage\.append\(viewport\)/,
	);
});

test("export tables override the reader's max-content width and let long paths wrap", () => {
	const css = source("src/styles/article-share.css");
	assert.match(css, /width:\s*100%\s*!important/);
	assert.match(css, /min-width:\s*0\s*!important/);
	assert.match(css, /td code[^}]*white-space:\s*normal\s*!important/s);
});

test("ordinary poster remains the default and article mode has controls and a return action", () => {
	const poster = source("src/components/misc/SharePoster.svelte");
	const article = source("src/components/misc/FullArticleShare.svelte");
	assert.match(poster, /let shareMode.*"poster"/);
	assert.match(poster, /FullArticleShare/);
	assert.match(poster, /全文长图/);
	assert.match(article, /DEFAULT_ARTICLE_SHARE/);
	assert.match(article, /getNextPosterCover/);
	assert.match(article, /URL\.revokeObjectURL/);
	assert.match(article, /AbortController/);
	assert.match(article, /JellyHover/);
	assert.match(poster, /registerJellyHover/);
});

test("elastic links use a slower entry and exit without changing reduced-motion behavior", () => {
	const css = source("src/styles/elastic-links.css");
	assert.match(css, /transform 650ms/);
	assert.match(css, /transform 400ms/);
	assert.match(css, /prefers-reduced-motion/);
});

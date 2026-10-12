import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const pickerLocation = new URL(
	"../src/utils/poster-cover-utils.ts",
	import.meta.url,
);
const component = readFileSync(
	new URL("../src/components/misc/SharePoster.svelte", import.meta.url),
	"utf8",
);
const postPage = readFileSync(
	new URL("../src/pages/posts/[...slug].astro", import.meta.url),
	"utf8",
);

async function coverPicker() {
	assert.ok(existsSync(pickerLocation), "A tested poster cover picker exists");
	return (await import("../src/utils/poster-cover-utils")).getNextPosterCover;
}

test("regenerating selects a different cover whenever the pool has alternatives", async () => {
	const pick = await coverPicker();
	assert.equal(
		pick(["a", "b", "c"], null, "a", () => 0),
		"b",
	);
	assert.equal(
		pick(["a", "b", "c"], null, "b", () => 0),
		"a",
	);
	assert.equal(
		pick(["a", "b", "c"], null, "c", () => 0.9999),
		"b",
	);
});

test("all remaining covers remain eligible with equal-sized random ranges", async () => {
	const pick = await coverPicker();
	assert.deepEqual(
		[0, 0.4999, 0.5, 0.9999].map((value) =>
			pick(["a", "b", "c"], null, "a", () => value),
		),
		["b", "b", "c", "c"],
	);
});

test("duplicate and blank pool entries cannot cause an immediate repeated cover", async () => {
	const pick = await coverPicker();
	assert.equal(
		pick(["", "a", "a", " b ", " "], null, "a", () => 0),
		"b",
	);
});

test("fixed covers and empty pools preserve the existing fallback behavior", async () => {
	const pick = await coverPicker();
	assert.equal(
		pick(["a", "a"], null, "a", () => 0),
		"a",
	);
	assert.equal(
		pick([], "fixed", "fixed", () => 0),
		"fixed",
	);
	assert.equal(
		pick([], null, null, () => 0),
		null,
	);
	assert.equal(
		pick(["a", "b"], "fixed", null, () => 0.9999),
		"b",
	);
});

test("the modal exposes a regenerate action and disables saving during generation", () => {
	assert.match(component, /on:click=\{\(\) => generatePoster\(true\)\}/);
	assert.match(component, /i18n\(I18nKey\.regeneratePoster\)/);
	assert.match(component, /disabled=\{generating \|\| !posterImage\}/);
	assert.match(component, /aria-busy=\{generating\}/);
});

test("fixed-cover articles also offer the shared image pool when regenerating", () => {
	assert.equal(
		(postPage.match(/regenerateCoverImages=\{posterRegenerateImages\}/g) ?? [])
			.length,
		2,
	);
	assert.match(
		postPage,
		/const posterRegenerateImages = \(await getRandomCoverImages\(\)\)/,
	);
	assert.match(component, /regenerate && regenerateCoverImages\.length > 0/);
	assert.match(component, /selectPosterCoverImage\(regenerate\)/);
});

test("a failed regeneration keeps the previous poster and presents a retry message", () => {
	assert.match(component, /let posterError = false/);
	assert.match(component, /if \(generating\) return/);
	assert.match(component, /if \(posterImage && !regenerate\) return/);
	assert.match(component, /if \(selectedCoverImage && !coverImg\)\s+throw/);
	assert.match(component, /currentCoverImage = selectedCoverImage/);
	assert.match(component, /finally \{\s*generating = false/);
	assert.match(component, /i18n\(I18nKey\.posterGenerationFailed\)/);
});

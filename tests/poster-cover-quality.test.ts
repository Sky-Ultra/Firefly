import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pool = readFileSync(
	new URL("../src/utils/random-cover-utils.ts", import.meta.url),
	"utf8",
);
const poster = readFileSync(
	new URL("../src/components/misc/SharePoster.svelte", import.meta.url),
	"utf8",
);

test("new supported image files automatically join the dedicated poster pool on rebuild", () => {
	assert.match(
		pool,
		/export function getPosterCoverImages\(\): Promise<string\[\]>/,
	);
	assert.match(pool, /Object\.values\(randomCoverModules\)/);
	assert.match(pool, /Useing Picture\/\*\*\/\*\.\{png,jpg,jpeg,webp,avif\}/);
});

test("poster covers are emitted at high quality without upscaling small sources", () => {
	const posterPool = pool.split("export function getPosterCoverImages")[1];
	assert.ok(posterPool, "A dedicated poster image build pipeline exists");
	assert.match(posterPool, /width: Math\.min\(image\.width, 1800\)/);
	assert.match(posterPool, /quality: 95/);
	assert.match(posterPool, /format: "webp"/);
	assert.match(posterPool, /return result\.src/);
});

test("the saved poster keeps sharp text and QR codes in a three-times-size PNG", () => {
	assert.match(poster, /const scale = 3/);
	assert.match(poster, /canvas\.toDataURL\("image\/png"\)/);
});

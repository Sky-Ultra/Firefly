import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const aboutPage = readFileSync(
	new URL("../src/pages/about.astro", import.meta.url),
	"utf8",
);

test("hovering or keyboard-focusing one secret reveals the complete group", () => {
	assert.match(
		aboutPage,
		/\.about-secret-list:hover \.about-secret::after/,
	);
	assert.match(
		aboutPage,
		/\.about-secret-list:has\(\.about-secret:focus-visible\) \.about-secret-content/,
	);
});

test("tapping one secret toggles every item together", () => {
	assert.match(aboutPage, /const secrets = Array\.from/);
	assert.match(aboutPage, /list\.dataset\.revealed = String\(isRevealed\)/);
	assert.match(
		aboutPage,
		/secrets\.forEach\(secret => secret\.setAttribute\("aria-expanded", String\(isRevealed\)\)\)/,
	);
});

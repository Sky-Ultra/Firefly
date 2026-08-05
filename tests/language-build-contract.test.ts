import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const navbarSource = readFileSync(
	new URL("../src/components/layout/Navbar.astro", import.meta.url),
	"utf8",
);

test("desktop language switch is placed before display settings", () => {
	const languageIndex = navbarSource.indexOf('id="language-switch"');
	const paletteIndex = navbarSource.indexOf('id="display-settings-switch"');
	assert.notEqual(languageIndex, -1);
	assert.notEqual(paletteIndex, -1);
	assert.ok(languageIndex < paletteIndex);
});

test("mobile language switch lives in the existing tools panel", () => {
	const panelIndex = navbarSource.indexOf('id="mobile-tools-panel"');
	const languageIndex = navbarSource.indexOf('id="mobile-language-switch"');
	assert.notEqual(panelIndex, -1);
	assert.notEqual(languageIndex, -1);
	assert.ok(languageIndex > panelIndex);
	assert.match(navbarSource, /data-mobile-navbar-item/);
});

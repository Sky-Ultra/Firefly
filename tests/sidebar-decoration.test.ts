import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { getSidebarDecoration } from "../src/utils/sidebar-decoration";

const decorationSource = readFileSync(
	new URL("../src/components/common/SidebarDecoration.astro", import.meta.url),
	"utf8",
);
const decorationStyles = readFileSync(
	new URL("../src/styles/sidebar-card-decoration.css", import.meta.url),
	"utf8",
);

test("sidebar decorations match the widget's purpose", () => {
	for (const [id, expected] of [
		["announcement", "chat"],
		["quote-of-the-day", "quote"],
		["categories", "parcel"],
		["tags", "paper-plane"],
		["calendar-widget", "clock"],
		["site-stats", "constellation"],
		["site-info", "window"],
		["music-widget-a1b2c3-layout", "orbit"],
		["music-widget-other-layout", "orbit"],
		["umami-stats-a1b2c3", "constellation"],
		["relationship-a1b2c3", "chat"],
	]) {
		assert.equal(getSidebarDecoration(id), expected, id);
	}
});

test("unknown widgets get a quiet default rather than accidental prefix matches", () => {
	for (const id of [
		"sidebar-toc",
		"unknown-layout",
		"",
		"categories-extra",
		"__proto__",
		"toString",
	]) {
		assert.equal(getSidebarDecoration(id), "blossom", id);
	}
});

test("decorations stay out of controls, translation and accessibility content", () => {
	assert.match(decorationSource, /aria-hidden="true"/);
	assert.match(decorationSource, /data-i18n-skip/);
	assert.match(decorationSource, /data-pagefind-ignore/);
	assert.doesNotMatch(decorationSource, /<a\b|<button\b|tabindex|<script\b/);
	assert.match(
		decorationStyles,
		/\.sidebar-card-decoration\s*\{[^}]*pointer-events:\s*none/s,
	);
	assert.match(
		decorationStyles,
		/\.sidebar-card-decoration\s*\{[^}]*z-index:\s*-1/s,
	);
	assert.match(
		decorationStyles,
		/\.sidebar-decorated-card\s*\{[^}]*isolation:\s*isolate/s,
	);
});

test("opaque sidebar surfaces survive wallpaper mode and reduced motion disables movement", () => {
	assert.match(
		decorationStyles,
		/@layer components\s*\{[^}]*\.wallpaper-transparent \.sidebar-decorated-card\.card-base\s*\{[^}]*background-color:\s*var\(--card-bg\) !important/s,
	);
	assert.match(decorationStyles, /backdrop-filter:\s*none !important/);
	assert.match(
		decorationStyles,
		/@media \(hover: hover\) and \(pointer: fine\)/,
	);
	const reducedMotion = decorationStyles.slice(
		decorationStyles.indexOf("@media (prefers-reduced-motion: reduce)"),
	);
	assert.match(reducedMotion, /transition:\s*none/);
	assert.match(reducedMotion, /:hover[^}]*transform:\s*none/s);
	assert.match(decorationStyles, /@media \(max-width: 767px\)/);
	assert.match(decorationStyles, /html\.dark \.sidebar-decorated-card/);
});

test("every referenced sidebar mask is a local SVG with the retained license notice", () => {
	const assets = Array.from(
		decorationStyles.matchAll(
			/url\("\.\.\/assets\/sidebar-decorations\/([^"/]+\.svg)"\)/g,
		),
	);
	assert.equal(assets.length, 10);
	for (const [, name] of assets) {
		const assetUrl = new URL(
			`../src/assets/sidebar-decorations/${name}`,
			import.meta.url,
		);
		assert.ok(existsSync(assetUrl), `${name} is available`);
		const asset = readFileSync(assetUrl, "utf8");
		assert.match(asset, /<svg\b[^>]*viewBox=['"]0 0 190 150['"]/);
		assert.match(asset, /<svg\b[^>]*aria-hidden=['"]true['"]/);
		assert.match(asset, /<svg\b[^>]*focusable=['"]false['"]/);
		assert.match(asset, /LICENSES\/Aemeath\.txt/);
		assert.doesNotMatch(asset, /<script\b|<foreignObject\b|<image\b|href=/);
	}
});

test("sidebar tag and category counts use the existing post totals with subtle pill surfaces", () => {
	const tags = readFileSync(
		new URL("../src/components/widget/Tags.astro", import.meta.url),
		"utf8",
	);
	const tagButton = readFileSync(
		new URL("../src/components/common/ButtonTag.astro", import.meta.url),
		"utf8",
	);
	const categoryButton = readFileSync(
		new URL("../src/components/common/ButtonLink.astro", import.meta.url),
		"utf8",
	);
	assert.match(tags, /count=\{t\.count\}/);
	assert.match(tagButton, /sidebar-count-pill[^>]*data-i18n-skip/);
	assert.match(categoryButton, /sidebar-count-pill/);
	assert.match(
		decorationStyles,
		/\.sidebar-decorated-card \.sidebar-count-pill\s*\{[^}]*background-color:\s*color-mix\([^;]+transparent\)/s,
	);
});

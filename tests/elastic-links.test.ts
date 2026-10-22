import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const source = (path: string): string => {
	const file = new URL(`../src/${path}`, import.meta.url);
	assert.ok(existsSync(file), `${path} exists`);
	return readFileSync(file, "utf8");
};

test("archive rows, category cards and sidebar category links share the elastic text treatment", () => {
	for (const file of [
		"components/controls/ArchivePanel.svelte",
		"pages/categories/index.astro",
		"components/common/ButtonLink.astro",
		"pages/activity.astro",
	]) {
		const content = source(file);
		assert.match(content, /elastic-link/);
		assert.match(content, /elastic-label/);
		assert.match(content, /styles\/elastic-links\.css/);
	}
});

test("activity article titles and moment destinations use the shared underline rather than a permanent border", () => {
	const page = source("pages/activity.astro");
	for (const className of ["activity-post-link", "activity-moment-link"]) {
		assert.match(
			page,
			new RegExp(
				`<a[^>]*class="${className} elastic-link"[^>]*><LocalizedText class="elastic-label"`,
			),
		);
	}
	const css = source("styles/activity-timeline.css");
	assert.match(css, /\.activity-post\s*\{[^}]*align-items:\s*flex-start/s);
	assert.doesNotMatch(
		css.match(/\.activity-post-link\s*\{([^}]+)\}/)?.[1] ?? "",
		/border-bottom/,
	);
});

test("underlines use the theme color, transform-only expansion and an equivalent keyboard focus state", () => {
	const css = source("styles/elastic-links.css");
	assert.match(css, /var\(--primary\)/);
	assert.match(css, /scaleX\(0\)/);
	assert.match(css, /scaleX\(1\)/);
	assert.match(css, /focus-visible/);
	assert.match(css, /prefers-reduced-motion: reduce/);
	assert.match(css, /pointer-events:\s*none/);
	assert.doesNotMatch(css, /transition:\s*all|text-shadow/);
});

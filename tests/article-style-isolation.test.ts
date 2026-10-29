import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";

const source = (path: string) =>
	readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("embedded comment document cannot override article font, palette or document backgrounds", () => {
	const page = source("src/pages/moment-comments/[id].astro");
	assert.match(page, /<html[^>]*class="moment-comments-page"/);
	assert.doesNotMatch(page, /<style is:global>/);
	const css = page.match(/<style is:inline>([\s\S]*?)<\/style>/)?.[1];
	assert.ok(css);
	for (const rule of css.matchAll(/([^{}]+)\{/g)) {
		const selectors = rule[1].trim();
		if (selectors.startsWith("@")) continue;
		for (const selector of selectors.split(","))
			assert.match(
				selector.trim(),
				/^(?:html)?\.moment-comments-page(?:\b|\s)/,
				`${selector} must not affect ordinary articles`,
			);
	}
	assert.match(
		page,
		/<script is:inline>[\s\S]*classList\.contains\("moment-comments-page"\)/,
	);
});

test("banner and fullscreen behavior stay intact, while overlay autoplay only runs on the homepage", () => {
	const layout = source("src/layouts/MainGridLayout.astro");
	const body = layout.match(
		/function isBannerWallpaperMode\(\)\s*\{([\s\S]*?)\n\s*\}/,
	)?.[1];
	assert.ok(body);
	for (const mode of ["banner", "fullscreen", "overlay", "none"]) {
		for (const home of [true, false]) {
			const active = runInNewContext(`(function(){${body}})()`, {
				WALLPAPER_BANNER: "banner",
				document: {
					documentElement: { getAttribute: () => mode },
					body: { classList: { contains: () => home } },
				},
			});
			assert.equal(
				active,
				mode === "banner" ||
					mode === "fullscreen" ||
					(mode === "overlay" && home),
				`${mode}, home=${home}`,
			);
		}
	}
	assert.match(layout, /if \(homeActive === overlayHomeWasActive\) return/);
	assert.match(
		layout,
		/getAttribute\('data-wallpaper-mode'\) !== 'overlay'\) return/,
	);
});

test("original opaque sidebar is the default and transparency is restricted to home overlay mode", () => {
	const css = source("src/styles/sidebar-card-decoration.css");
	assert.match(
		css,
		/@layer components\s*\{\s*\.sidebar-decorated-card\.card-base\s*\{[^}]*background-color:\s*var\(--card-bg\) !important/s,
	);
	assert.match(
		css,
		/body\.is-home\.wallpaper-transparent \.sidebar-decorated-card\.card-base\s*\{[^}]*background-color:\s*var\(--card-bg-transparent\)/,
	);
});

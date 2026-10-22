import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const source = (path: string): string => {
	const file = new URL(`../src/${path}`, import.meta.url);
	assert.ok(existsSync(file), `${path} exists`);
	return readFileSync(file, "utf8");
};

test("jelly profiles keep controls restrained and the avatar at article-card strength", async () => {
	source("utils/jelly-hover-motion.ts");
	const { getJellyHoverTarget } = await import(
		"../src/utils/jelly-hover-motion"
	);
	const bounds = { left: 20, top: 40, width: 120, height: 120 };
	assert.deepEqual(getJellyHoverTarget(80, 100, bounds, "avatar"), {
		x: 0,
		y: 0,
	});
	assert.deepEqual(getJellyHoverTarget(140, 160, bounds, "avatar"), {
		x: 6,
		y: 5,
	});
	assert.ok(
		Math.abs(getJellyHoverTarget(140, 160, bounds, "card").x - 3.6) < 1e-10,
	);
	assert.ok(
		Math.abs(getJellyHoverTarget(140, 160, bounds, "control").x - 1.8) < 1e-10,
	);
	assert.deepEqual(getJellyHoverTarget(99999, -99999, bounds, "avatar"), {
		x: 6,
		y: -5,
	});
	assert.deepEqual(getJellyHoverTarget(Number.NaN, 0, bounds, "avatar"), {
		x: 0,
		y: 0,
	});
	assert.deepEqual(
		getJellyHoverTarget(0, 0, { ...bounds, width: 0 }, "avatar"),
		{ x: 0, y: 0 },
	);
});

test("only the three requested page interiors and the About avatar load the new motion entry", () => {
	for (const page of ["bangumi", "games", "anime", "about"]) {
		assert.match(source(`pages/${page}.astro`), /JellyMotion/);
	}
	assert.doesNotMatch(source("layouts/Layout.astro"), /JellyMotion/);
	for (const path of [
		"components/pages/bangumi/Card.svelte",
		"components/pages/anime/AnimeCard.svelte",
		"components/pages/games/GameCard.astro",
	]) {
		const card = source(path);
		assert.match(card, /(?:profile|data-jelly-profile)="card"/);
		assert.match(card, /data-jelly-surface/);
		assert.doesNotMatch(card, /hover:-translate-y-1|hover:scale-\[1\.02\]/);
	}
	for (const path of [
		"components/pages/bangumi/TabNav.svelte",
		"components/pages/bangumi/FilterControls.svelte",
		"components/pages/anime/AnimeDetailModal.svelte",
	]) {
		assert.match(source(path), /profile="control"/);
	}
	const pagination = source("components/common/ClientPagination.svelte");
	assert.match(pagination, /jelly\s*=\s*false/);
	assert.match(pagination, /enabled=\{jelly\}/);
	for (const path of [
		"components/pages/bangumi/BangumiSection.svelte",
		"components/pages/anime/AnimeGrid.svelte",
	]) {
		assert.match(source(path), /<ClientPagination[\s\S]*?\bjelly\b/);
	}
});

test("the avatar has a padded stationary hit area and moves its existing frame without scaling or rotation", () => {
	const about = source("pages/about.astro");
	assert.match(
		about,
		/<jelly-hover data-jelly-profile="avatar">\s*<div data-jelly-surface/,
	);
	assert.match(about, /alt="Sky 的头像"/);
	const css = source("styles/jelly-hover.css");
	assert.match(css, /translate:\s*var\(--jelly-x/);
	assert.match(css, /padding:\s*0\.75rem/);
	assert.match(css, /margin:\s*-0\.75rem/);
	assert.match(css, /prefers-reduced-motion: reduce/);
	assert.doesNotMatch(css, /(?:scale|rotate|filter):/);
	const runtime = source("utils/jelly-hover.ts");
	assert.match(runtime, /getBoundingClientRect/);
	assert.match(runtime, /disconnectedCallback/);
	assert.match(runtime, /cancelAnimationFrame/);
	assert.match(runtime, /AbortController/);
	assert.doesNotMatch(
		runtime,
		/preventDefault|stopPropagation|\.style\.transform|setInterval/,
	);
});

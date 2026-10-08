import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const source = (file: string) => {
	const location = new URL(`../${file}`, import.meta.url);
	assert.ok(existsSync(location), `${file} implements the requested feature`);
	return readFileSync(location, "utf8");
};

test("the nine-character banner row and its exclusive artwork are removed", () => {
	assert.equal(existsSync(new URL("../src/components/features/BannerCharacters.astro", import.meta.url)), false);
	assert.doesNotMatch(source("src/layouts/MainGridLayout.astro"), /BannerCharacters|banner-characters/);
	for (const name of ["loading-girl", "blue-witch", "white-haired-reader", "pink-uniform", "bamboo-girl", "aqua-singer", "pink-bows", "brown-lightning", "pink-cat"]) {
		assert.equal(existsSync(new URL(`../public/images/characters/${name}.webp`, import.meta.url)), false, name);
	}
});

test("the homepage title has no sticker and its exclusive code and artwork are removed", () => {
	const layout = source("src/layouts/MainGridLayout.astro");
	assert.doesNotMatch(layout, /HomeTitleSticker|home-title-sticker|youre-absolutely-right/);
	assert.doesNotMatch(layout, /id="banner-overlay-container"[^>]*data-drag-boundary/);
	assert.match(layout, /\{backgroundWallpaper\.common\.homeText\.title\}/);
	for (const file of [
		"src/components/features/HomeTitleSticker.astro",
		"public/images/stickers/youre-absolutely-right.png",
		"public/images/stickers/youre-absolutely-right.jpg",
	]) {
		assert.equal(existsSync(new URL(`../${file}`, import.meta.url)), false, file);
	}
});

test("sticker dragging supports pointer capture, keyboard movement and cleanup", () => {
	const sticker = source("src/components/common/DraggableSticker.astro");
	for (const marker of ["setPointerCapture", "pointercancel", "lostpointercapture", "disconnectedCallback", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "Escape", "touch-action: none", 'draggable="false"']) {
		assert.ok(sticker.includes(marker), marker);
	}
	assert.match(sticker, /role="button"/);
	assert.match(sticker, /tabindex="0"/);
	assert.match(sticker, /prefers-reduced-motion/);
});

test("touch dragging does not trigger the wallpaper carousel swipe handlers", () => {
	const sticker = source("src/components/common/DraggableSticker.astro");
	assert.match(sticker, /\["touchstart", "touchend"\]/);
	assert.match(sticker, /event\.stopPropagation\(\), \{ \.\.\.options, passive: true \}/);
});

test("two small companions frame Sky's profile name", () => {
	const profile = source("src/components/widget/Profile.astro");
	assert.match(profile, /NameCompanions/);
	assert.doesNotMatch(source("src/layouts/MainGridLayout.astro"), /NameCompanions/);
	const companions = source("src/components/features/NameCompanions.astro");
	assert.equal((companions.match(/<DraggableSticker\b/g) || []).length, 2);
	assert.match(companions, /blonde-idol\.webp/);
	assert.match(companions, /dark-haired-girl\.webp/);
	assert.doesNotMatch(companions, /claudecode\.webp/);
	assert.match(companions, /<slot/);
});

test("post cards reuse the non-interactive decoration below content", () => {
	const post = source("src/components/layout/PostCard.astro");
	assert.match(post, /<SidebarDecoration motif=\{cardDecor\}/);
	assert.match(post, /post-decorated-card/);
	assert.match(post, /getPostDecoration/);
	const style = source("src/styles/post-card-decoration.css");
	assert.match(style, /\.post-decorated-card:hover/);
	assert.match(style, /prefers-reduced-motion/);
	assert.match(style, /isolation: isolate/);
});

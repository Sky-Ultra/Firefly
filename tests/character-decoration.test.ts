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

test("one uploaded sticker anchors to the homepage title and reuses dragging", () => {
	const sticker = source("src/components/features/HomeTitleSticker.astro");
	assert.equal((sticker.match(/<DraggableSticker\b/g) || []).length, 1);
	assert.match(sticker, /\/images\/stickers\/youre-absolutely-right\.jpg/);
	assert.match(sticker, /<slot/);
	assert.match(sticker, /position: relative/);
	assert.match(sticker, /position: absolute/);
	const layout = source("src/layouts/MainGridLayout.astro");
	assert.match(layout, /<HomeTitleSticker>/);
	assert.match(layout, /id="banner-overlay-container" data-drag-boundary/);
	assert.ok(existsSync(new URL("../public/images/stickers/youre-absolutely-right.jpg", import.meta.url)));
});

test("the initial sticker sits above the title companions without covering them", () => {
	const sticker = source("src/components/features/HomeTitleSticker.astro");
	const offsets = Array.from(sticker.matchAll(/top: (-?[\d.]+)rem/g), (match) => Number(match[1]));
	const sizes = Array.from(sticker.matchAll(/--sticker-size: ([\d.]+)rem/g), (match) => Number(match[1]));
	assert.equal(offsets.length, 2);
	assert.equal(sizes.length, 2);
	for (let i = 0; i < offsets.length; i++) assert.ok(offsets[i] + sizes[i] < 0, "sticker leaves room above the title on desktop and mobile");
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
	assert.match(source("src/layouts/MainGridLayout.astro"), /<NameCompanions>/);
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

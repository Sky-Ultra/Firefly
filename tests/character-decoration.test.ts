import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const source = (file: string) => {
	const location = new URL(`../${file}`, import.meta.url);
	assert.ok(existsSync(location), `${file} implements the requested feature`);
	return readFileSync(location, "utf8");
};

test("banner stickers use the shared draggable element without mobile exclusions", () => {
	const banner = source("src/components/features/BannerCharacters.astro");
	assert.match(banner, /DraggableSticker/);
	assert.match(banner, /data-drag-boundary/);
	assert.doesNotMatch(banner, /hidden lg:|mobileStickerKeys|display: none/);
	assert.match(source("src/layouts/MainGridLayout.astro"), /<BannerCharacters/);
});

test("banner characters remain available after navigating home through Swup", () => {
	assert.ok(source("src/layouts/MainGridLayout.astro").includes("    <BannerCharacters />"));
	assert.match(source("src/components/features/BannerCharacters.astro"), /body:not\(\.is-home\)/);
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

import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const source = (path: string): string => {
	const file = new URL(`../src/${path}`, import.meta.url);
	assert.ok(existsSync(file), `${path} exists`);
	return readFileSync(file, "utf8");
};
const motion = async () => {
	source("utils/card-hover-motion.ts");
	return import("../src/utils/card-hover-motion");
};

test("magnetic offsets stay small and independent of card dimensions", async () => {
	const { getCardHoverTarget } = await motion();
	const rect = { left: 20, top: 40, width: 300, height: 500 };
	assert.deepEqual(getCardHoverTarget(170, 290, rect), { x: 0, y: 0 });
	assert.deepEqual(getCardHoverTarget(320, 540, rect), { x: 6, y: 5 });
	assert.deepEqual(getCardHoverTarget(-999, -999, rect), { x: -6, y: -5 });
	assert.deepEqual(getCardHoverTarget(20, 40, { ...rect, width: 0 }), {
		x: 0,
		y: 0,
	});
});

test("the hover spring gently overshoots then settles without a running idle loop", async () => {
	const { advanceHoverSpring, isHoverSpringSettled } = await motion();
	let axis = { position: 0, velocity: 0 };
	let maximum = 0;
	for (let i = 0; i < 480; i++) {
		axis = advanceHoverSpring(axis, 6, 1 / 120);
		maximum = Math.max(maximum, axis.position);
	}
	assert.ok(maximum > 6 && maximum < 6.5, `Restrained spring: ${maximum}`);
	assert.ok(isHoverSpringSettled(axis, 6));
	assert.ok(Math.abs(axis.position - 6) < 0.001);
	for (let i = 0; i < 480; i++) axis = advanceHoverSpring(axis, 0, 1 / 120);
	assert.ok(isHoverSpringSettled(axis, 0));
});

test("retargeting preserves the current position and velocity rather than snapping", async () => {
	const { advanceHoverSpring } = await motion();
	const current = { position: 3, velocity: 12 };
	const next = advanceHoverSpring(current, -6, 1 / 120);
	assert.ok(Math.abs(next.position - current.position) < 0.25);
	assert.notEqual(next.position, -6);
	assert.deepEqual(current, { position: 3, velocity: 12 });
	const resumed = advanceHoverSpring(current, 0, 100);
	assert.ok(Number.isFinite(resumed.position));
	assert.ok(Math.abs(resumed.position) < 6);
});

test("cards keep native links and layout transforms while custom-element cleanup supports Swup", () => {
	const card = source("components/layout/PostCard.astro");
	const runtime = source("utils/magnetic-post-card.ts");
	const css = source("styles/post-card-motion.css");
	assert.match(card, /<magnetic-post-card\b/);
	assert.match(card, /href=\{url\}/);
	assert.match(runtime, /pointerType/);
	assert.match(runtime, /prefers-reduced-motion: no-preference/);
	assert.match(runtime, /disconnectedCallback/);
	assert.match(runtime, /cancelAnimationFrame/);
	assert.match(runtime, /removeEventListener/);
	assert.doesNotMatch(runtime, /\.style\.transform\s*=/);
	assert.match(css, /translate:\s*var\(--card-hover-x/);
	assert.match(css, /prefers-reduced-motion: reduce/);
	assert.doesNotMatch(runtime, /preventDefault|stopPropagation/);
});

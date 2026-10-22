import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const effects = async () => {
	assert.ok(
		existsSync(new URL("../src/utils/site-like-effects.ts", import.meta.url)),
	);
	return import("../src/utils/site-like-effects");
};

test("hearts begin on the fifth consecutive click, continue afterward and reset after a pause", async () => {
	const { advanceLikeCombo } = await effects();
	let state = { count: 0, lastAt: Number.NEGATIVE_INFINITY };
	for (let i = 0; i < 6; i++) {
		const result = advanceLikeCombo(state, i * 200);
		assert.equal(result.burst, i >= 4);
		state = result;
	}
	assert.equal(advanceLikeCombo(state, 5000).burst, false);
	assert.equal(advanceLikeCombo(state, 5000).count, 1);
	assert.equal(advanceLikeCombo(state, 0).count, 1);
});

test("rapid clicks have bounded toast and particle budgets", async () => {
	const {
		MAX_LIKE_NOTICES,
		MAX_HEART_PARTICLES,
		HEART_BURST_COUNT,
		advanceLikeCombo,
	} = await effects();
	assert.equal(MAX_LIKE_NOTICES, 4);
	assert.ok(MAX_HEART_PARTICLES <= 28);
	assert.ok(HEART_BURST_COUNT > 1 && HEART_BURST_COUNT <= MAX_HEART_PARTICLES);
	let state = { count: 0, lastAt: Number.NEGATIVE_INFINITY };
	for (let i = 0; i < 1000; i++) state = advanceLikeCombo(state, i * 10);
	assert.equal(state.count, 5);
});

test("keyboard clicks use the button center and pointer bursts remain within the viewport", async () => {
	const { getHeartOrigin } = await effects();
	const bounds = { left: 100, top: 200, width: 120, height: 40 };
	assert.deepEqual(getHeartOrigin(0, 0, bounds, 390, 844), { x: 160, y: 220 });
	assert.deepEqual(getHeartOrigin(999, -5, bounds, 390, 844), {
		x: 374,
		y: 16,
	});
});

test("the thank-you runtime adds independent notices and cleans up bounded animations", () => {
	const path = new URL("../src/utils/site-like-toast.ts", import.meta.url);
	assert.ok(existsSync(path));
	const runtime = readFileSync(path, "utf8");
	assert.match(runtime, /MAX_LIKE_NOTICES/);
	assert.match(runtime, /MAX_HEART_PARTICLES/);
	assert.match(runtime, /cloneNode\(true\)/);
	assert.match(runtime, /focusin/);
	assert.match(runtime, /focusout/);
	assert.match(runtime, /disconnectedCallback/);
	assert.match(runtime, /\.cancel\(\)/);
	assert.doesNotMatch(runtime, /fetch\(|localStorage|XMLHttpRequest/);
});

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../public/love/js/animation.js", import.meta.url), "utf8");

function fixture(width, reduced = false) {
	const state = { frames: null, duration: null, waits: [], lookups: 0 };
	const classes = () => {
		const values = new Set();
		return {
			add: (...names) => names.forEach(name => values.add(name)),
			remove: name => values.delete(name),
			contains: name => values.has(name),
		};
	};
	const style = () => ({ values: {}, setProperty(key, value) { this.values[key] = value; } });
	const body = { classList: classes() };
	const letter = { hidden: true, classList: classes(), style: style(), getBoundingClientRect: () => ({ height: 570 }) };
	const viewport = { clientWidth: 375, style: style() };
	const scene = {
		classList: classes(),
		getBoundingClientRect: () => body.classList.contains("letter-open")
			? { left: 0, top: 628, width: 375 }
			: { left: 0, top: 310, width: 390 },
		animate(frames, options) {
			assert(letter.classList.contains("mobile-letter-staging"));
			state.frames = frames;
			state.duration = options.duration;
			return { finished: Promise.resolve(), finish() {} };
		},
	};
	const motion = { matches: reduced, addEventListener() {}, removeEventListener() {} };
	const context = vm.createContext({
		window: { matchMedia: query => query.includes("max-width") ? { matches: width <= 700 } : motion },
		document: {
			body,
			getElementById(id) {
				state.lookups++;
				return { viewport, scene, letter }[id];
			},
		},
		StageConfig: { width: 1100 },
		setTimeout(callback, delay) { state.waits.push(delay); callback(); },
	});
	vm.runInContext(source, context);
	return { context, state, body, letter, scene, canvas: { classList: classes() } };
}

test("mobile: move the whole tree downward and reserve the letter before typing", async () => {
	const f = fixture(390);
	await f.context.animateTreeMove(f.canvas);
	assert.equal(f.state.duration, 1600);
	assert.match(f.state.frames[0].transform, /translate\(0px, -318px\) scale\(1\.04\)/);
	assert.equal(f.state.frames[1].transform, "translate(0, 0) scale(1)");
	assert.equal(f.letter.style.values["--mobile-letter-height"], "570px");
	assert.equal(f.letter.hidden, false);
	assert(f.body.classList.contains("letter-open"));
	assert(!f.letter.classList.contains("mobile-letter-staging"));
	assert(!f.scene.classList.contains("mobile-repositioning"));
});

test("mobile: reduced motion lays out the letter above the tree without animation", async () => {
	const f = fixture(390, true);
	await f.context.animateTreeMove(f.canvas);
	assert.equal(f.state.frames, null);
	assert.equal(f.letter.hidden, false);
	assert(!f.letter.classList.contains("mobile-letter-staging"));
});

for (const width of [701, 1280]) {
	test(`desktop ${width}px: preserve the original horizontal shift and timing`, async () => {
		const f = fixture(width);
		await f.context.animateTreeMove(f.canvas);
		assert(f.canvas.classList.contains("shifted"));
		assert.equal(f.state.lookups, 0);
		assert.deepEqual(f.state.waits, [1600]);
	});
}

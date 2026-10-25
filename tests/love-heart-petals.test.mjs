import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");
const animation = readFileSync(new URL("../public/love/js/animation.js", import.meta.url), "utf8");
const main = readFileSync(new URL("../public/love/js/main.js", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/love/styles.css", import.meta.url), "utf8");

test("the full-screen petal field starts only after the opening interaction", () => {
	assert.match(html, /id="heart-petal-field" aria-hidden="true"/);
	const opening = main.indexOf("await animateOpening(button, seed, staticCanvas)");
	const petals = main.indexOf("startAmbientHeartPetals()");
	assert.ok(opening >= 0 && petals > opening);
});

test("heart petals vary their path, size, color, rotation, and density", () => {
	assert.match(animation, /const maxPetals = 16/);
	assert.doesNotMatch(animation, /isMobile/);
	assert.match(animation, /--petal-size/);
	assert.match(animation, /--petal-color/);
	assert.match(animation, /--mid-x/);
	assert.match(animation, /--end-rotate/);
	assert.match(styles, /@keyframes heart-petal-drift/);
});

test("ambient petals stop for reduced motion and while the page is hidden", () => {
	assert.match(animation, /document\.hidden \|\| prefersReducedMotion\(\)/);
	assert.match(animation, /field\.replaceChildren\(\)/);
	assert.match(styles, /prefers-reduced-motion: reduce[\s\S]*#heart-petal-field \{ display: none/);
});

test("petals cover both entry edges, then ease their speed and excess density back over three seconds", () => {
	const children = [];
	const timers = new Map();
	const frames = new Map();
	let nextTimer = 1;
	let nextFrame = 1;
	let seed = 12345;
	const field = {
		get childElementCount() { return children.length; },
		appendChild(petal) { children.push(petal); },
		querySelectorAll(selector) { return selector === ".heart-petal" ? [...children] : children.filter(petal => petal.dataset.petalBoost === "true"); },
		replaceChildren() { children.length = 0; },
	};
	const motion = { matches: false, addEventListener() {} };
	const context = vm.createContext({
		Math: Object.assign(Object.create(Math), { random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; } }),
		requestAnimationFrame(callback) { const id = nextFrame++; frames.set(id, callback); return id; },
		cancelAnimationFrame(id) { frames.delete(id); },
		window: {
			matchMedia: () => motion,
			setTimeout(callback, delay) { const id = nextTimer++; timers.set(id, { callback, delay }); return id; },
			clearTimeout(id) { timers.delete(id); },
		},
		document: {
			hidden: false,
			getElementById: () => field,
			addEventListener() {},
			createElement() {
				const motion = { playbackRate: 1, updatePlaybackRate(rate) { this.playbackRate = rate; } };
				return { dataset: {}, style: { values: {}, setProperty(name, value) { this.values[name] = value; } }, getAnimations: () => [motion], addEventListener() {}, remove() { const index = children.indexOf(this); if (index >= 0) children.splice(index, 1); } };
			},
		},
	});
	vm.runInContext(animation, context);
	const controller = context.startAmbientHeartPetals();
	const baseline = children.length;
	const baseDelay = [...timers.values()][0].delay;
	controller.boostFor(10000);
	assert.equal(children.length, Math.ceil(baseline * 2.5));
	assert(children.every(petal => petal.getAnimations()[0].playbackRate === 2.5));
	const boostedSpawn = [...timers.values()].find(timer => timer.delay !== 10000);
	assert(boostedSpawn.delay >= 168 && boostedSpawn.delay <= 280);
	assert(baseDelay >= 1050 && baseDelay <= 1750);
	const paths = children.map(petal => Object.fromEntries(["--start-x", "--start-y", "--end-x", "--end-y"].map(key => [key, parseFloat(petal.style.values[key])])));
	assert(paths.some(path => path["--start-y"] < 0 && path["--start-x"] < 30));
	assert(paths.some(path => path["--start-x"] > 100 && path["--start-y"] > 70));
	assert(paths.every(path => path["--end-x"] < path["--start-x"] && path["--end-y"] > path["--start-y"]));
	const quadrants = new Set();
	for (const path of paths) for (const progress of [0.2, 0.5, 0.8]) {
		const x = path["--start-x"] + (path["--end-x"] - path["--start-x"]) * progress;
		const y = path["--start-y"] + (path["--end-y"] - path["--start-y"]) * progress;
		if (x >= 0 && x <= 100 && y >= 0 && y <= 100) quadrants.add(`${x < 50 ? "left" : "right"}-${y < 50 ? "top" : "bottom"}`);
	}
	assert.equal(quadrants.size, 4, "the diagonal paths must reach all four areas of the screen");
	const restore = [...timers.values()].find(timer => timer.delay === 10000);
	assert(restore);
	restore.callback();
	const boostedCount = children.length;
	function frame(now) { const [id, callback] = frames.entries().next().value; frames.delete(id); callback(now); }
	frame(0);
	assert.equal(children.length, boostedCount, "no petals disappear when the ten-second boost ends");
	assert(children.every(petal => petal.getAnimations()[0].playbackRate === 2.5));
	frame(1500);
	assert.equal(children.length, boostedCount);
	assert(children.every(petal => petal.getAnimations()[0].playbackRate === 1.75));
	assert(children.some(petal => petal.style.values["--petal-fade"] === "0.5"));
	frame(3000);
	assert.equal(children.length, baseline);
	assert.equal(children.filter(petal => petal.dataset.petalBoost === "true").length, 0);
	assert(children.every(petal => petal.getAnimations()[0].playbackRate === 1));
	assert.match(styles, /calc\(var\(--petal-opacity\) \* var\(--petal-fade, 1\)\)/);
});

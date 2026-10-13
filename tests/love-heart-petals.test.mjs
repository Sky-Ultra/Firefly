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

test("the entry boost immediately doubles petals and restores normal density after ten seconds", () => {
	const children = [];
	const timers = new Map();
	let nextTimer = 1;
	const field = {
		get childElementCount() { return children.length; },
		appendChild(petal) { children.push(petal); },
		querySelectorAll() { return children.filter(petal => petal.dataset.petalBoost === "true"); },
		replaceChildren() { children.length = 0; },
	};
	const motion = { matches: false, addEventListener() {} };
	const context = vm.createContext({
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
				return { dataset: {}, style: { setProperty() {} }, addEventListener() {}, remove() { const index = children.indexOf(this); if (index >= 0) children.splice(index, 1); } };
			},
		},
	});
	vm.runInContext(animation, context);
	const controller = context.startAmbientHeartPetals();
	const baseline = children.length;
	const baseDelay = [...timers.values()][0].delay;
	controller.boostFor(10000);
	assert.equal(children.length, baseline * 2);
	const boostedSpawn = [...timers.values()].find(timer => timer.delay !== 10000);
	assert(boostedSpawn.delay >= 525 && boostedSpawn.delay <= 875);
	assert(baseDelay >= 1050 && baseDelay <= 1750);
	const restore = [...timers.values()].find(timer => timer.delay === 10000);
	assert(restore);
	restore.callback();
	assert.equal(children.length, baseline);
	assert.equal(children.filter(petal => petal.dataset.petalBoost === "true").length, 0);
});

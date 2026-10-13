import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../public/love/js/third-page.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/love/styles.css", import.meta.url), "utf8");

function fixture(reduced = false) {
	const state = { now: 1000, bottom: 1800, top: -400, viewport: 800, active: true, boosts: [], scrolls: [], reveals: [], focused: false };
	const windowListeners = {};
	const buttonListeners = {};
	const observers = [];
	const values = new Set();
	const button = { hidden: true, addEventListener(type, listener) { buttonListeners[type] = listener; } };
	const afterword = { getBoundingClientRect: () => ({ bottom: state.bottom, top: state.top }) };
	const third = {
		hidden: true,
		classList: { add: (...names) => names.forEach(name => values.add(name)), remove: (...names) => names.forEach(name => values.delete(name)), contains: name => values.has(name) },
		scrollIntoView(options) { state.scrolls.push(options); },
		focus() { state.focused = true; },
		addEventListener() {},
	};
	const window = { innerHeight: state.viewport, addEventListener(type, listener) { windowListeners[type] = listener; } };
	const context = vm.createContext({
		window,
		document: { getElementById: id => ({ afterword, "love-third-page": third, "third-page-scroll-indicator": button })[id] },
		performance: { now: () => state.now },
		prefersReducedMotion: () => reduced,
		IntersectionObserver: class {
			constructor(callback) { this.callback = callback; observers.push(this); }
			observe() {}
			disconnect() {}
		},
	});
	window.IntersectionObserver = context.IntersectionObserver;
	vm.runInContext(source, context);
	const controller = context.initThirdPage({ canEnter: () => state.active, revealParagraphs: section => state.reveals.push(section) });
	controller.setPetalController({ boostFor: duration => state.boosts.push(duration) });
	return { state, third, button, controller, observers, windowListeners, buttonListeners };
}

test("the third page stays hidden until requested, and the original update date remains unchanged", () => {
	assert.match(html, /id="love-third-page"[^>]*hidden/);
	assert.match(html, /最后更新时间<time datetime="2026-10-02">2026\.10\.2<\/time>/);
	assert.match(html, /id="third-page-scroll-indicator"[^>]*aria-controls="love-third-page"[^>]*hidden/);
	assert.match(styles, /\.third-page-scroll-icon[\s\S]*?width: 3\.9rem/);
	assert.match(styles, /third-page-fade-in 1\.5s/);
});

test("the small arrow only appears near the bottom of the activated second page", () => {
	const f = fixture();
	f.controller.updateVisibility();
	assert.equal(f.button.hidden, true);
	f.state.bottom = 900;
	f.controller.updateVisibility();
	assert.equal(f.button.hidden, false);
	f.state.active = false;
	f.controller.updateVisibility();
	assert.equal(f.button.hidden, true);
});

test("clicking the arrow unlocks the third page once, then entry starts the fade, token reveal and ten-second boost", () => {
	const f = fixture();
	f.buttonListeners.click();
	assert.equal(f.third.hidden, false);
	assert.equal(f.button.hidden, true);
	assert.equal(f.state.scrolls[0].behavior, "smooth");
	assert(f.third.classList.contains("third-page-awaiting-entry"));
	assert.equal(f.state.boosts.length, 0);
	f.observers[0].callback([{ isIntersecting: true }]);
	assert(f.third.classList.contains("third-page-entering"));
	assert.equal(f.state.focused, true);
	assert.deepEqual(f.state.boosts, [10000]);
	assert.equal(f.state.reveals.length, 1);
	f.buttonListeners.click();
	assert.equal(f.state.scrolls.length, 1);
});

test("a swipe that merely reaches the bottom does not enter; a deliberate new upward swipe does", () => {
	const f = fixture();
	const finger = (clientY, clientX = 100) => ({ identifier: 1, clientX, clientY });
	f.windowListeners.touchstart({ touches: [finger(400)] });
	f.state.bottom = 800;
	f.windowListeners.touchend({ changedTouches: [finger(200)] });
	assert.equal(f.third.hidden, true);
	f.windowListeners.touchstart({ touches: [finger(400)] });
	f.windowListeners.touchend({ changedTouches: [finger(375)] });
	assert.equal(f.third.hidden, true);
	f.windowListeners.touchstart({ touches: [finger(400)] });
	f.windowListeners.touchend({ changedTouches: [finger(280)] });
	assert.equal(f.third.hidden, false);
});

test("wheel momentum from reading cannot enter the third page, but a new firm scroll at the bottom can", () => {
	const f = fixture();
	const wheel = { deltaX: 0, deltaY: 200, deltaMode: 0 };
	f.windowListeners.wheel(wheel);
	f.state.bottom = 800;
	f.state.now += 40;
	f.windowListeners.wheel(wheel);
	assert.equal(f.third.hidden, true);
	f.state.now += 350;
	f.windowListeners.wheel({ ...wheel, deltaY: 30 });
	assert.equal(f.third.hidden, true);
	f.state.now += 40;
	f.windowListeners.wheel(wheel);
	assert.equal(f.third.hidden, false);
});

test("reduced-motion users keep immediate navigation and readable text", () => {
	const f = fixture(true);
	f.buttonListeners.click();
	assert.equal(f.state.scrolls[0].behavior, "auto");
	assert.equal(f.state.reveals.length, 1);
	assert.equal(f.third.classList.contains("third-page-awaiting-entry"), false);
});

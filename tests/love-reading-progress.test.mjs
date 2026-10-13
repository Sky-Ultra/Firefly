import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../public/love/js/reading-progress.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");

function fixture() {
	const state = { offset: 0, viewport: 800, thirdHidden: true, fill: {}, percentage: "", attributes: {}, frames: [], resizeCallback: null };
	const listeners = {};
	const sections = [
		{ id: "love-first-page", hidden: false, getBoundingClientRect: () => ({ top: -state.offset, height: 1000 }) },
		{ id: "afterword", hidden: false, getBoundingClientRect: () => ({ top: 1000 - state.offset, height: 3000 }) },
		{ id: "love-third-page", get hidden() { return state.thirdHidden; }, getBoundingClientRect: () => ({ top: 4000 - state.offset, height: 2000 }) },
	];
	const bar = { hidden: true, style: { setProperty(name, value) { state.fill[name] = value; } }, setAttribute(name, value) { state.attributes[name] = value; } };
	const badge = { hidden: true, set textContent(text) { state.percentage = text; } };
	const context = vm.createContext({
		document: { getElementById: id => ({ "love-reading-progress": bar, "love-reading-percentage": badge })[id], querySelectorAll: () => sections },
		window: { get innerHeight() { return state.viewport; }, addEventListener(type, listener) { listeners[type] = listener; } },
		requestAnimationFrame(callback) { state.frames.push(callback); return state.frames.length; },
		ResizeObserver: class { constructor(callback) { state.resizeCallback = callback; } observe() {} },
	});
	vm.runInContext(source, context);
	return { state, context, bar, badge, listeners, controller: context.initReadingProgress() };
}

test("progress is hidden before the opening and the date follows the requested October eleventh", () => {
	assert.match(html, /id="love-reading-progress"[^>]*role="progressbar"[^>]*hidden/);
	assert.match(html, /id="love-reading-percentage"[^>]*hidden/);
	assert.match(html, /datetime="2026-10-11">2026\.10\.11<\/time>/);
	const f = fixture();
	assert.equal(f.bar.hidden, true);
	f.controller.start();
	assert.equal(f.bar.hidden, false);
	assert.equal(f.badge.hidden, false);
	assert.equal(f.state.percentage, "0%");
});

test("the percentage and top fill follow the current section rather than the whole document", () => {
	const f = fixture();
	f.state.offset = 2100;
	f.controller.start();
	assert.equal(f.state.percentage, "50%");
	assert.equal(f.state.fill["--reading-progress"], "0.5");
	assert.equal(f.state.attributes["aria-valuenow"], "50");
});

test("unlocking the third page does not move the second page percentage backward", () => {
	const f = fixture();
	f.state.offset = 3200;
	f.controller.start();
	assert.equal(f.state.percentage, "100%");
	f.state.thirdHidden = false;
	f.state.resizeCallback();
	f.state.frames.shift()();
	assert.equal(f.state.percentage, "100%");
	f.state.offset = 4000;
	f.listeners.scroll();
	f.state.frames.shift()();
	assert.equal(f.state.percentage, "0%");
	f.state.offset = 4600;
	f.listeners.scroll();
	f.state.frames.shift()();
	assert.equal(f.state.percentage, "50%");
});

test("scroll updates share one animation frame and mobile resizing recalculates progress", () => {
	const f = fixture();
	f.controller.start();
	f.state.offset = 2100;
	f.listeners.scroll();
	f.listeners.scroll();
	assert.equal(f.state.frames.length, 1);
	f.state.frames.shift()();
	f.state.viewport = 1000;
	f.listeners.resize();
	f.state.frames.shift()();
	assert.equal(f.state.percentage, "55%");
});

test("progress is bounded even with overscroll or a page shorter than the viewport", () => {
	const f = fixture();
	assert.equal(f.context.getPageReadingProgress({ top: 100, height: 2000 }, 800), 0);
	assert.equal(f.context.getPageReadingProgress({ top: -3000, height: 2000 }, 800), 1);
	assert.equal(f.context.getPageReadingProgress({ top: 0, height: 800 }, 800), 0);
	assert.equal(f.context.getPageReadingProgress({ top: -10, height: 600 }, 800), 1);
});

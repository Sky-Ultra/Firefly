import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../public/love/js/reading-progress.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");

function fixture() {
	const state = { offset: 0, viewport: 800, thirdHidden: true, fourthHidden: true, fill: {}, percentage: "", attributes: {}, badgeAttributes: {}, resets: [], frames: [], resizeCallback: null };
	const listeners = {};
	const sections = [
		{ id: "love-first-page", hidden: false, getBoundingClientRect: () => ({ top: -state.offset, height: 1000 }) },
		{ id: "afterword", hidden: false, getBoundingClientRect: () => ({ top: 1000 - state.offset, height: 3000 }) },
		{ id: "love-third-page", get hidden() { return state.thirdHidden; }, getBoundingClientRect: () => ({ top: 4000 - state.offset, height: 2000 }) },
		{ id: "love-fourth-page", get hidden() { return state.fourthHidden; }, getBoundingClientRect: () => ({ top: 6000 - state.offset, height: 2400 }) },
	];
	const bar = { hidden: true, style: { setProperty(name, value) { state.fill[name] = value; } }, setAttribute(name, value) { state.attributes[name] = value; } };
	const badge = { hidden: true, setAttribute(name, value) { state.badgeAttributes[name] = value; }, addEventListener(type, listener) { listeners[`badge:${type}`] = listener; } };
	const value = { set textContent(text) { state.percentage = text; } };
	const context = vm.createContext({
		document: { getElementById: id => ({ "love-reading-progress": bar, "love-reading-percentage": badge, "love-reading-percentage-value": value })[id], querySelectorAll: () => sections },
		window: { get innerHeight() { return state.viewport; }, addEventListener(type, listener) { listeners[type] = listener; } },
		requestAnimationFrame(callback) { state.frames.push(callback); return state.frames.length; },
		ResizeObserver: class { constructor(callback) { state.resizeCallback = callback; } observe() {} },
	});
	vm.runInContext(source, context);
	return { state, context, bar, badge, listeners, controller: context.initReadingProgress({ onReset(page) { state.resets.push(page.id); state.offset = [0, 1000, 4000, 6000][sections.indexOf(page)]; } }) };
}

test("progress is hidden before the opening and the date follows the requested October twenty-third", () => {
	assert.match(html, /id="love-reading-progress"[^>]*role="progressbar"[^>]*hidden/);
	assert.match(html, /id="love-reading-percentage"[^>]*hidden/);
	assert.match(html, /datetime="2026-10-23">2026\.10\.23<\/time>/);
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

test("the fourth page owns its own reading percentage", () => {
	const f = fixture();
	f.state.thirdHidden = false;
	f.state.fourthHidden = false;
	f.state.offset = 6800;
	f.controller.start();
	assert.equal(f.state.percentage, "50%");
	assert.equal(f.state.attributes["aria-label"], "第 4 页阅读进度");
});

test("next-page arrows follow the exact same progress fraction on desktop and mobile", () => {
	const f = fixture();
	for (const viewport of [390, 800, 1200]) {
		const height = viewport + 2000;
		const boundsAt = progress => ({ top: -2000 * progress, bottom: height - 2000 * progress, height });
		assert.equal(f.context.isNextPageArrowVisible(boundsAt(0.799), viewport), false);
		assert.equal(f.context.isNextPageArrowVisible(boundsAt(0.8), viewport), true);
		assert.equal(f.context.isNextPageArrowVisible(boundsAt(1), viewport), true);
		assert.equal(f.context.isNextPageArrowVisible({ top: -height, bottom: 0, height }, viewport), false);
		assert.equal(f.context.isNextPageArrowVisible({ top: 100, bottom: height + 100, height }, viewport), false);
	}
});

test("the percentage button resets the current page rather than the whole website", () => {
	const f = fixture();
	f.state.offset = 2100;
	f.controller.start();
	assert.equal(f.state.percentage, "50%");
	assert.equal(f.badge.disabled, false);
	f.listeners["badge:click"]();
	assert.deepEqual(f.state.resets, ["afterword"]);
	assert.equal(f.state.offset, 1000);
	assert.equal(f.state.percentage, "0%");
	f.state.thirdHidden = false;
	f.state.fourthHidden = false;
	f.state.offset = 6800;
	f.listeners["badge:click"]();
	assert.deepEqual(f.state.resets, ["afterword", "love-fourth-page"]);
	assert.equal(f.state.percentage, "0%");
});

test("page three keeps a read-only percentage and uses its existing pixel replay button", () => {
	const f = fixture();
	f.state.thirdHidden = false;
	f.state.offset = 4600;
	f.controller.start();
	assert.equal(f.badge.disabled, true);
	assert.equal(f.state.percentage, "50%");
	f.listeners["badge:click"]();
	assert.deepEqual(f.state.resets, []);
	assert(!f.state.badgeAttributes["aria-label"].includes("重新播放"));
});

test("the percentage is a keyboard-accessible button with a separate replay icon", () => {
	assert.match(html, /<button id="love-reading-percentage"[^>]*type="button"/);
	assert.match(html, /id="love-reading-percentage-value"/);
	assert.match(html, /class="reading-reset-icon"/);
	assert.match(html, /本页面最近更新于9月26号/);
});

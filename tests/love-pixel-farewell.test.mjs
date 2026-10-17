import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../public/love/js/pixel-farewell.js", import.meta.url), "utf8");
const html = readFileSync(new URL("../public/love/index.html", import.meta.url), "utf8");
const styles = readFileSync(new URL("../public/love/pixel-farewell.css", import.meta.url), "utf8");

test("the public love page ships the pixel effect without the private password gate", () => {
	assert.doesNotMatch(html, /password-gate|protected-site|访问密码/);
	assert.doesNotMatch(readFileSync(new URL("../public/love/js/main.js", import.meta.url), "utf8"), /waitForPassword/);
	assert.equal(existsSync(new URL("../public/love/js/password-gate.js", import.meta.url)), false);
	assert.equal(existsSync(new URL("../public/love/password-gate.css", import.meta.url)), false);
	assert(html.indexOf("pixel-farewell.js") < html.indexOf("third-page.js"));
});

function fixture() {
	const state = { visible: true, hidden: false, reduced: false, frames: new Map(), nextFrame: 1, listeners: {}, renderer: [], classes: new Set() };
	const chip = { hidden: true };
	const number = { textContent: "" };
	const canvas = { hidden: true };
	const result = { hidden: true };
	const replay = { addEventListener(name, callback) { state.replay = callback; } };
	const article = { setAttribute() {}, removeAttribute() {} };
	const section = {
		hidden: false, dataset: {},
		classList: { add: name => state.classes.add(name), remove: name => state.classes.delete(name) },
		getBoundingClientRect: () => state.visible ? { top: 0, bottom: 2200 } : { top: 900, bottom: 3100 },
		querySelector: () => article,
	};
	const renderer = {
		capture() { state.renderer.push("capture"); return true; },
		scatter(progress) { state.renderer.push(["scatter", progress]); },
		assemble(progress) { state.renderer.push(["assemble", progress]); },
		finish(time) { state.renderer.push(["finish", time]); },
		resize() {}, clear() {},
	};
	const context = vm.createContext({
		window: { innerHeight: 800, addEventListener(name, callback) { state.listeners[name] = callback; } },
		document: { get hidden() { return state.hidden; }, addEventListener(name, callback) { state.listeners[name] = callback; }, getElementById: id => ({ "third-page-countdown": chip, "third-page-countdown-number": number, "third-page-pixel-canvas": canvas, "third-page-pixel-result": result, "third-page-pixel-replay": replay })[id] },
		prefersReducedMotion: () => state.reduced,
		requestAnimationFrame(callback) { const id = state.nextFrame++; state.frames.set(id, callback); return id; },
		cancelAnimationFrame(id) { state.frames.delete(id); },
	});
	vm.runInContext(source, context);
	const controller = context.initPixelFarewell(section, renderer);
	function frame(now) {
		const [id, callback] = state.frames.entries().next().value ?? [];
		assert(callback, `No frame scheduled at ${now}`);
		state.frames.delete(id);
		callback(now);
	}
	return { state, section, chip, number, canvas, result, controller, frame, context };
}

test("the love-page effect has the exact emoticon and starts with no countdown before third-page entry", () => {
	const f = fixture();
	assert.equal(f.chip.hidden, true);
	assert.equal(f.state.frames.size, 0);
	assert.match(html, /╥﹏╥\.\.\./);
	f.controller.start();
	f.frame(0);
	assert.equal(f.number.textContent, "12");
	assert.equal(f.section.dataset.pixelPhase, "countdown");
});

test("twelve visible seconds precede scattering, assembly and the large finished face", () => {
	const f = fixture();
	f.controller.start(); f.frame(0); f.frame(11000);
	assert.equal(f.number.textContent, "1");
	assert.equal(f.state.classes.has("third-page-text-disintegrated"), false);
	f.frame(12000);
	assert.equal(f.section.dataset.pixelPhase, "dispersing");
	assert(f.state.classes.has("third-page-text-disintegrated"));
	f.frame(14800);
	assert.equal(f.section.dataset.pixelPhase, "assembling");
	f.frame(17200);
	assert.equal(f.section.dataset.pixelPhase, "complete");
	assert.equal(f.result.hidden, false);
	assert.equal(f.state.frames.size, 1);
});

test("leaving the third page pauses the countdown instead of destroying text offscreen", () => {
	const f = fixture();
	f.controller.start(); f.frame(0); f.frame(4000);
	f.state.visible = false; f.state.listeners.scroll();
	assert.equal(f.chip.hidden, true);
	assert.equal(f.state.frames.size, 0);
	f.state.visible = true; f.state.listeners.scroll(); f.frame(30000); f.frame(31000);
	assert.equal(f.number.textContent, "7");
	assert.equal(f.section.dataset.pixelPhase, "countdown");
});

test("replay restores the original text and begins a fresh twelve-second countdown", () => {
	const f = fixture();
	f.controller.start(); f.frame(0); f.frame(12000); f.frame(14800); f.frame(17200);
	f.state.replay(); f.frame(20000);
	assert.equal(f.state.classes.has("third-page-text-disintegrated"), false);
	assert.equal(f.result.hidden, true);
	assert.equal(f.number.textContent, "12");
});

test("pixel paths finish beyond the upper-left edge and assemble exactly at the face target", () => {
	const f = fixture();
	const point = { x: 400, y: 500, color: "#456a59", alpha: 1 };
	const particle = f.context.makeFarewellParticle(point, { x: 350, y: 280 }, 800, 700, () => 0.5);
	const departed = f.context.getFarewellScatterState(particle, 1);
	assert(departed.x < 0 && departed.y < 0);
	assert.equal(departed.alpha, 0);
	const gathered = f.context.getFarewellAssemblyState(particle, 1);
	assert.equal(gathered.x, 350);
	assert.equal(gathered.y, 280);
	assert.equal(gathered.alpha, 1);
});

test("reduced motion keeps the countdown but replaces the particle travel with a still face", () => {
	const f = fixture();
	f.state.reduced = true;
	f.controller.start(); f.frame(0); f.frame(12000);
	assert.equal(f.section.dataset.pixelPhase, "complete");
	assert.equal(f.result.hidden, false);
	assert.equal(f.state.frames.size, 0);
});

test("the countdown contains only a number and the 44px replay matches the other corner controls", () => {
	const countdown = html.match(/<div id="third-page-countdown"[\s\S]*?<\/div>/)[0];
	assert(!countdown.includes('class="pixel-countdown-caption"'));
	assert(!countdown.includes("<small>"));
	assert.match(html, /id="third-page-pixel-replay"[^>]*aria-label="重播像素动画"[\s\S]*?<svg/);
	assert.doesNotMatch(html, />再看一次<\/button>/);
	assert.match(styles, /#third-page-pixel-replay[\s\S]*?width: 44px/);
	assert.match(styles, /#third-page-pixel-replay[\s\S]*?height: 44px/);
	assert.match(styles, /bottom: calc\(max\(1rem, env\(safe-area-inset-bottom\)\) \+ 108px\)/);
});

test("the mouth and both eyes move gently from their original pixel positions", () => {
	const f = fixture();
	for (const part of ["mouth", "left-eye", "right-eye"]) {
		const point = { x: 300, y: 300, part, pivotX: 290, pivotY: 290, localX: 0.3 };
		const neutral = f.context.getFarewellFacePoint(point, 0, 200);
		assert.equal(neutral.x, point.x);
		assert.equal(neutral.y, point.y);
		const moving = f.context.getFarewellFacePoint(point, 1700, 200);
		assert(Math.hypot(moving.x - point.x, moving.y - point.y) > 0.1, part);
		assert(Math.hypot(moving.x - point.x, moving.y - point.y) < 20, part);
	}
});

test("the finished expression animates while visible, stops offscreen and resumes smoothly", () => {
	const f = fixture();
	f.controller.start(); f.frame(0); f.frame(12000); f.frame(14800); f.frame(17200); f.frame(18200);
	assert.deepEqual(f.state.renderer.at(-1), ["finish", 1000]);
	f.state.visible = false; f.state.listeners.scroll();
	assert.equal(f.state.frames.size, 0);
	f.state.visible = true; f.state.listeners.scroll(); f.frame(40000); f.frame(41000);
	assert.deepEqual(f.state.renderer.at(-1), ["finish", 2000]);
});

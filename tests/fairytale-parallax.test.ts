import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";
import {
	normalizeParallaxStrength,
	PARALLAX_DEFAULT_STRENGTH,
	parallaxOffset,
	parallaxScale,
	readFairytaleParallax,
	readParallaxStrength,
} from "../src/utils/fairytale-parallax";

test("parallax defaults on, respects disabled/blocked storage and keeps offsets bounded", () => {
	assert.equal(readFairytaleParallax({ getItem: () => null }), true);
	assert.equal(readFairytaleParallax({ getItem: () => "false" }), false);
	assert.equal(
		readFairytaleParallax({
			getItem: () => {
				throw Error("blocked");
			},
		}),
		true,
	);
	assert.deepEqual(parallaxOffset(500, 400, 1000, 800), { x: -0, y: -0 });
	assert.deepEqual(parallaxOffset(1000, 800, 1000, 800, 100), {
		x: -14,
		y: -10,
	});
	assert.deepEqual(parallaxOffset(-100, -100, 1000, 800, 100), {
		x: 14,
		y: 10,
	});
});

test("desktop fairytale motion settles, suspends for reading/mobile/immersive and cleans up", async () => {
	const view = new Window({ url: "https://example.test/" });
	view.document.body.innerHTML =
		'<div id="wallpaper-wrapper"></div><div id="motion"></div>';
	view.document.body.className = "is-home";
	view.document.documentElement.dataset.wallpaperMode = "fullscreen";
	view.document.documentElement.dataset.fullscreenLayout = "classic";
	const hero = view.document.getElementById("wallpaper-wrapper");
	assert.ok(hero);
	hero.getBoundingClientRect = () =>
		({
			left: 0,
			top: 0,
			right: 1000,
			bottom: 800,
			width: 1000,
			height: 800,
		}) as DOMRect;
	const fine = new view.EventTarget() as InstanceType<
		typeof view.EventTarget
	> & { matches: boolean };
	fine.matches = true;
	const reduced = new view.EventTarget() as typeof fine;
	reduced.matches = false;
	view.matchMedia = ((query: string) =>
		query.includes("reduced-motion")
			? reduced
			: fine) as typeof view.matchMedia;
	const frames = new Map<number, FrameRequestCallback>();
	let next = 0;
	const runtime = transpileModule(
		readFileSync(
			new URL("../src/utils/fairytale-parallax.ts", import.meta.url),
			"utf8",
		).replace(/^export /gm, ""),
		{
			compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.None },
		},
	).outputText;
	const layer = view.document.getElementById("motion");
	assert.ok(layer);
	const dispose = runInNewContext(
		`${runtime}\nmountFairytaleParallax(document.getElementById('motion'))`,
		{
			window: view,
			document: view.document,
			localStorage: view.localStorage,
			MutationObserver: view.MutationObserver,
			AbortController: view.AbortController,
			CustomEvent: view.CustomEvent,
			requestAnimationFrame: (cb: FrameRequestCallback) => {
				frames.set(++next, cb);
				return next;
			},
			cancelAnimationFrame: (id: number) => frames.delete(id),
		},
	) as () => void;
	const flush = () => new Promise<void>((resolve) => setImmediate(resolve));
	const move = () =>
		view.dispatchEvent(
			new view.PointerEvent("pointermove", {
				pointerType: "mouse",
				clientX: 1000,
				clientY: 800,
			}),
		);
	try {
		move();
		assert.equal(frames.size, 0);
		view.document.documentElement.dataset.fullscreenLayout = "fairytale";
		await flush();
		assert.equal(layer.hasAttribute("data-parallax-active"), true);
		move();
		assert.equal(frames.size, 1);
		for (let i = 1; i < 150 && frames.size; i++) {
			const callbacks = [...frames.values()];
			frames.clear();
			callbacks.forEach((cb) => {
				cb(i * 16.67);
			});
		}
		assert.equal(frames.size, 0);
		assert.equal(
			layer.style.getPropertyValue("--fairytale-parallax-x"),
			"-16.10px",
		);
		view.dispatchEvent(
			new view.CustomEvent("firefly:fairytale-parallax-strength-change", {
				detail: { strength: 200 },
			}),
		);
		for (let i = 1; i < 150 && frames.size; i++) {
			const callbacks = [...frames.values()];
			frames.clear();
			callbacks.forEach((cb) => {
				cb(i * 16.67);
			});
		}
		assert.equal(
			layer.style.getPropertyValue("--fairytale-parallax-x"),
			"-28.00px",
		);
		view.dispatchEvent(
			new view.CustomEvent("firefly:fairytale-parallax-strength-change", {
				detail: { strength: 0 },
			}),
		);
		assert.equal(layer.hasAttribute("data-parallax-active"), false);
		assert.equal(frames.size, 0);
		view.dispatchEvent(
			new view.CustomEvent("firefly:fairytale-parallax-strength-change", {
				detail: { strength: 115 },
			}),
		);
		assert.equal(layer.hasAttribute("data-parallax-active"), true);
		Object.defineProperty(view, "scrollY", { value: 200, writable: true });
		view.dispatchEvent(new view.Event("scroll"));
		assert.equal(layer.hasAttribute("data-parallax-active"), false);
		assert.equal(layer.hasAttribute("data-parallax-enabled"), true);
		for (let i = 1; i < 150 && frames.size; i++) {
			const callbacks = [...frames.values()];
			frames.clear();
			callbacks.forEach((cb) => {
				cb(i * 16.67);
			});
		}
		assert.equal(
			layer.style.getPropertyValue("--fairytale-parallax-x"),
			"0.00px",
		);
		Object.defineProperty(view, "scrollY", { value: 0, writable: true });
		view.dispatchEvent(new view.Event("scroll"));
		fine.matches = false;
		fine.dispatchEvent(new view.Event("change"));
		move();
		assert.equal(frames.size, 0);
		fine.matches = true;
		fine.dispatchEvent(new view.Event("change"));
		view.dispatchEvent(
			new view.CustomEvent("firefly:immersive-change", {
				detail: { active: true },
			}),
		);
		move();
		assert.equal(frames.size, 0);
		view.dispatchEvent(
			new view.CustomEvent("firefly:immersive-change", {
				detail: { active: false },
			}),
		);
		reduced.matches = true;
		reduced.dispatchEvent(new view.Event("change"));
		move();
		assert.equal(frames.size, 0);
		reduced.matches = false;
		reduced.dispatchEvent(new view.Event("change"));
		view.dispatchEvent(
			new view.CustomEvent("firefly:fairytale-parallax-change", {
				detail: { enabled: false },
			}),
		);
		move();
		assert.equal(frames.size, 0);
	} finally {
		dispose();
		assert.equal(frames.size, 0);
		assert.equal(layer.style.getPropertyValue("--fairytale-parallax-x"), "");
		await view.happyDOM.close();
	}
});

test("strength preferences are bounded, default slightly higher, and overscan covers maximum travel", () => {
	assert.equal(PARALLAX_DEFAULT_STRENGTH, 115);
	for (const input of [undefined, Number.NaN, Number.POSITIVE_INFINITY, "120"])
		assert.equal(normalizeParallaxStrength(input), 115);
	assert.equal(normalizeParallaxStrength(-100), 0);
	assert.equal(normalizeParallaxStrength(900), 200);
	assert.equal(normalizeParallaxStrength(122), 120);
	assert.equal(readParallaxStrength({ getItem: () => null }), 115);
	assert.equal(readParallaxStrength({ getItem: () => "0" }), 0);
	assert.equal(readParallaxStrength({ getItem: () => "broken" }), 115);
	assert.equal(readParallaxStrength({ getItem: () => "175" }), 175);
	assert.equal(
		readParallaxStrength({
			getItem: () => {
				throw Error("blocked");
			},
		}),
		115,
	);
	assert.deepEqual(parallaxOffset(1000, 800, 1000, 800, 200), {
		x: -28,
		y: -20,
	});
	for (const [width, height] of [
		[1024, 600],
		[1920, 1080],
		[1024, 240],
	]) {
		const scale = parallaxScale(width, height, 200);
		assert.ok(((scale - 1) * width) / 2 >= 28 - 1e-6);
		assert.ok(((scale - 1) * height) / 2 >= 20 - 1e-6);
	}
});

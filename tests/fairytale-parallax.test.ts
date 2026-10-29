import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";
import {
	parallaxOffset,
	readFairytaleParallax,
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
	assert.deepEqual(parallaxOffset(1000, 800, 1000, 800), { x: -14, y: -10 });
	assert.deepEqual(parallaxOffset(-100, -100, 1000, 800), { x: 14, y: 10 });
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
			"-14.00px",
		);
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

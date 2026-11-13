import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { Window } from "happy-dom";
import { ModuleKind, ScriptTarget, transpileModule } from "typescript";
import { fairytaleMotion } from "../src/utils/fairytale-layout";
import {
	applyFairytaleSettings,
	FAIRYTALE_DEFAULTS,
	FAIRYTALE_SETTINGS_KEY,
	FULLSCREEN_LAYOUT_KEY,
	normalizeFairytaleSettings,
	readFullscreenPreferences,
} from "../src/utils/fullscreen-layout";

const source = (path: string) =>
	readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
test("classic is the default and corrupt or blocked storage cannot affect the existing theme", () => {
	const values = new Map([
		["wallpaperMode", "overlay"],
		["overlayBlur", "19"],
		["overlayCardOpacity", "0.3"],
	]);
	const storage = {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			values.set(key, value);
		},
	};
	assert.deepEqual(readFullscreenPreferences(storage), {
		layout: "classic",
		settings: FAIRYTALE_DEFAULTS,
	});
	values.set(FULLSCREEN_LAYOUT_KEY, "fairytale");
	values.set(
		FAIRYTALE_SETTINGS_KEY,
		'{"blur":7,"wallpaperOpacity":0.8,"cardOpacity":0.7}',
	);
	assert.equal(readFullscreenPreferences(storage).settings.blur, 7);
	assert.equal(values.get("overlayBlur"), "19");
	values.set(FAIRYTALE_SETTINGS_KEY, "broken json");
	assert.deepEqual(
		readFullscreenPreferences(storage).settings,
		FAIRYTALE_DEFAULTS,
	);
	assert.equal(
		readFullscreenPreferences({
			getItem: () => {
				throw Error("blocked");
			},
			setItem: () => {},
		}).layout,
		"classic",
	);
});
test("new settings are bounded and write only namespaced presentation variables", async () => {
	assert.deepEqual(
		normalizeFairytaleSettings({
			blur: 100,
			wallpaperOpacity: -1,
			cardOpacity: Number.NaN,
		}),
		{
			blur: 20,
			wallpaperOpacity: 0.2,
			cardOpacity: FAIRYTALE_DEFAULTS.cardOpacity,
		},
	);
	const view = new Window();
	try {
		view.document.documentElement.style.setProperty("--primary", "pink");
		view.document.documentElement.style.fontSize = "16px";
		applyFairytaleSettings(
			{ blur: 6, wallpaperOpacity: 0.9, cardOpacity: 0.8 },
			view.document.documentElement as unknown as HTMLElement,
		);
		assert.equal(view.document.documentElement.style.fontSize, "16px");
		assert.equal(
			view.document.documentElement.style.getPropertyValue("--primary"),
			"pink",
		);
		assert.equal(
			view.document.documentElement.style.getPropertyValue("--fairytale-blur"),
			"6px",
		);
	} finally {
		await view.happyDOM.close();
	}
});
test("every presentation selector requires both fullscreen and fairytale, with no navbar or root font reset", () => {
	const css = source("src/styles/fairytale-layout.css");
	for (const rule of css
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.matchAll(/([^{}]+)\{/g)) {
		if (rule[1].trim().startsWith("@")) continue;
		for (const selector of rule[1].split(/,\s*(?=html)/))
			assert.match(
				selector.trim(),
				/^html(?:\.dark)?\[data-wallpaper-mode="fullscreen"\]\[data-fullscreen-layout="fairytale"\]/,
			);
	}
	assert.doesNotMatch(css, /:root|font-size|font-family|#navbar|--primary\s*:/);
	assert.match(css, /#header-waves/);
	assert.match(css, /prefers-reduced-motion/);
	assert.match(
		source("src/components/features/FullscreenPreferences.astro"),
		/script is:inline data-swup-ignore-script/,
	);
});

async function fixture(layout = "classic", width = 1440) {
	const view = new Window({
		url: "https://example.test/",
		settings: { enableImageFileLoading: false },
	});
	view.document.documentElement.dataset.wallpaperMode = "fullscreen";
	view.document.documentElement.dataset.fullscreenLayout = layout;
	view.document.body.classList.add("is-home");
	view.document.body.innerHTML =
		'<div id="wallpaper-wrapper"><div id="banner-images-container"><div class="slide-item hidden lg:block active" data-wallpaper-src="/desktop-a.webp"><img></div><div class="slide-item hidden lg:block" data-wallpaper-src="/desktop-b.webp"><img></div><div class="slide-item block lg:hidden active" data-wallpaper-src="/mobile.webp"><img></div></div></div><main id="main-grid"></main><fairytale-layout data-fairytale-cached-blur hidden><img data-fairytale-image><img data-fairytale-image><div class="fairytale-soft-layer"><img data-fairytale-soft-image><img data-fairytale-soft-image></div></fairytale-layout>';
	Object.defineProperty(view, "innerWidth", { value: width, writable: true });
	Object.defineProperty(view, "innerHeight", { value: 1000, writable: true });
	Object.defineProperty(view, "scrollY", { value: 0, writable: true });
	const timers = new Map<number, () => void>();
	const frames = new Map<number, FrameRequestCallback>();
	let next = 0;
	view.setTimeout = ((cb: () => void) => {
		timers.set(++next, cb);
		return next;
	}) as typeof view.setTimeout;
	view.clearTimeout = ((id: number) => {
		timers.delete(id);
	}) as typeof view.clearTimeout;
	const request = (cb: FrameRequestCallback) => {
		frames.set(++next, cb);
		return next;
	};
	const cancel = (id: number) => {
		frames.delete(id);
	};
	const runtime = transpileModule(
		source("src/utils/fairytale-layout.ts").replace(/^export /gm, ""),
		{
			compilerOptions: { target: ScriptTarget.ES2022, module: ModuleKind.None },
		},
	).outputText;
	const backdrop = view.document.querySelector<HTMLElement>("fairytale-layout");
	assert.ok(backdrop);
	const original = view.document.getElementById(
		"banner-images-container",
	)?.innerHTML;
	const dispose = runInNewContext(
		`${runtime}\nmountFairytaleLayout(document.querySelector('fairytale-layout'));`,
		{
			window: view,
			document: view.document,
			MutationObserver: view.MutationObserver,
			getComputedStyle: view.getComputedStyle.bind(view),
			AbortController: view.AbortController,
			requestAnimationFrame: request,
			cancelAnimationFrame: cancel,
			queueMicrotask,
			Event: view.Event,
		},
	) as () => void;
	const flush = async () => {
		await new Promise<void>((resolve) => setImmediate(resolve));
		for (const [id, cb] of [...frames]) {
			frames.delete(id);
			cb(0);
		}
		await Promise.resolve();
		await Promise.resolve();
	};
	return {
		view,
		backdrop,
		timers,
		frames,
		original,
		flush,
		dispose,
		close: async () => {
			dispose();
			assert.equal(timers.size, 0);
			assert.equal(frames.size, 0);
			await view.happyDOM.close();
		},
	};
}
test("classic creates no image requests or scroll work; enabling copies only the current device image", async () => {
	const f = await fixture();
	try {
		await f.flush();
		assert.equal(f.backdrop.querySelectorAll("img[src]").length, 0);
		assert.equal(f.timers.size, 0);
		f.view.document.documentElement.dataset.fullscreenLayout = "fairytale";
		await f.flush();
		const image = f.backdrop.querySelector<HTMLImageElement>(
			'img[src="/desktop-a.webp"]',
		);
		assert.ok(image);
		image.dispatchEvent(new f.view.Event("load"));
		await f.flush();
		assert.equal(
			f.view.document.documentElement.dataset.fairytaleReady,
			"true",
		);
		assert.equal(image.classList.contains("is-initial"), true);
		const soft = f.backdrop.querySelector<HTMLElement>(
			"[data-fairytale-soft-image].is-visible",
		);
		assert.ok(soft);
		assert.match(soft.getAttribute("src") || "", /desktop-a\.webp/);
		assert.match(
			f.view.document.documentElement.style.getPropertyValue(
				"--fairytale-canvas-image",
			),
			/desktop-a\.webp/,
		);
		assert.equal(
			f.view.document.getElementById("banner-images-container")?.innerHTML,
			f.original,
		);
		Object.defineProperty(f.view, "scrollY", { value: 650, writable: true });
		f.view.dispatchEvent(new f.view.Event("scroll"));
		await f.flush();
		assert.equal(
			f.backdrop.querySelector<HTMLElement>(".fairytale-soft-layer")?.style
				.opacity,
			"0.813",
		);
		f.view.document.documentElement.dataset.fullscreenLayout = "classic";
		await f.flush();
		assert.equal(f.backdrop.hidden, true);
		assert.equal(f.backdrop.querySelectorAll("img[src]").length, 0);
		assert.ok(
			[
				...f.backdrop.querySelectorAll<HTMLElement>(
					"[data-fairytale-soft-image]",
				),
			].every((layer) => layer.style.backgroundImage === ""),
		);
		assert.equal(
			f.view.document.documentElement.style.getPropertyValue(
				"--fairytale-canvas-image",
			),
			"",
		);
		assert.equal(
			f.view.document.documentElement.style.getPropertyValue(
				"--fairytale-progress",
			),
			"",
		);
	} finally {
		await f.close();
	}
});
test("rapid carousel changes, device resizing and deactivation cannot display an obsolete image", async () => {
	const f = await fixture("fairytale");
	try {
		await f.flush();
		const image = f.backdrop.querySelector<HTMLImageElement>("img[src]");
		assert.ok(image);
		const stale = image.onload;
		assert.ok(stale);
		const slides = f.view.document.querySelectorAll(".slide-item");
		slides[0].classList.remove("active");
		slides[1].classList.add("active");
		await f.flush();
		stale.call(image, new f.view.Event("load"));
		await f.flush();
		assert.equal(
			f.view.document.documentElement.dataset.fairytaleReady,
			undefined,
		);
		Object.defineProperty(f.view, "innerWidth", { value: 390, writable: true });
		f.view.dispatchEvent(new f.view.Event("resize"));
		await f.flush();
		assert.ok(f.backdrop.querySelector('img[src="/mobile.webp"]'));
		f.view.document.documentElement.dataset.wallpaperMode = "overlay";
		await f.flush();
		assert.equal(f.backdrop.hidden, true);
		assert.equal(f.backdrop.querySelectorAll("img[src]").length, 0);
	} finally {
		await f.close();
	}
});

test("reference Hero timing keeps the top sharp even at maximum blur and separates title fading", () => {
	assert.deepEqual(fairytaleMotion(0, 1000), {
		blurProgress: 0,
		titleOpacity: 1,
	});
	assert.equal(fairytaleMotion(400, 1000).blurProgress, 0.5);
	assert.equal(fairytaleMotion(500, 1000).titleOpacity, 0);
	assert.equal(fairytaleMotion(800, 1000).blurProgress, 1);
	assert.equal(fairytaleMotion(-50, 1000).blurProgress, 0);
	assert.ok(Number.isFinite(fairytaleMotion(0, 0).blurProgress));
	const css = source("src/styles/fairytale-layout.css");
	assert.match(
		css,
		/#header-waves,[\s\S]*#wallpaper-gradient,[\s\S]*display: none !important/,
	);
	assert.doesNotMatch(css, /opacity: var\(--fairytale-wallpaper-opacity/);
	assert.match(css, /1\.2s cubic-bezier\(\.2,0,0,1\)/);
	const panel = source("src/components/controls/FairytaleDisplayPanel.svelte");
	assert.match(panel, /role="tablist"/);
	assert.match(panel, /max=\{20\} step=\{0.5\}/);
	assert.doesNotMatch(panel, /童话壁纸透明度/);
});

test("mobile scroll progress stays stable through browser chrome resizing and recalibrates after rotation", async () => {
	const f = await fixture("fairytale", 390);
	const progress = () =>
		Number(
			f.backdrop.querySelector<HTMLElement>(".fairytale-soft-layer")?.style
				.opacity,
		);
	try {
		await f.flush();
		f.view.scrollY = 320;
		f.view.dispatchEvent(new f.view.Event("scroll"));
		await f.flush();
		assert.equal(progress(), 0.4);
		Object.defineProperty(f.view, "innerHeight", {
			value: 1120,
			writable: true,
		});
		f.view.dispatchEvent(new f.view.Event("resize"));
		await f.flush();
		assert.equal(progress(), 0.4);
		Object.defineProperty(f.view, "innerWidth", { value: 844, writable: true });
		Object.defineProperty(f.view, "innerHeight", {
			value: 390,
			writable: true,
		});
		f.view.dispatchEvent(new f.view.Event("resize"));
		await f.flush();
		assert.equal(progress(), 1);
		f.view.scrollY = -80;
		f.view.dispatchEvent(new f.view.Event("scroll"));
		await f.flush();
		assert.equal(progress(), 0);
		f.view.document.documentElement.dataset.fullscreenLayout = "classic";
		await f.flush();
		assert.equal(f.frames.size, 0);
		assert.equal(f.timers.size, 0);
	} finally {
		await f.close();
	}
});

test("scrolling reuses the selected wallpaper and keeps per-frame styles out of the document root", async () => {
	const f = await fixture("fairytale");
	try {
		await f.flush();
		const image = f.backdrop.querySelector<HTMLImageElement>("img[src]");
		assert.ok(image);
		image.dispatchEvent(new f.view.Event("load"));
		await f.flush();
		const container = f.view.document.getElementById("banner-images-container");
		assert.ok(container);
		let sourceScans = 0;
		let rootWrites = 0;
		const query = container.querySelectorAll.bind(container);
		container.querySelectorAll = ((selector: string) => {
			if (selector === ".slide-item.active") sourceScans++;
			return query(selector);
		}) as typeof container.querySelectorAll;
		const style = f.view.document.documentElement.style;
		const write = style.setProperty.bind(style);
		style.setProperty = (name, value, priority) => {
			rootWrites++;
			return write(name, value, priority);
		};
		for (let step = 1; step <= 30; step++) {
			f.view.scrollY = step * 12;
			f.view.dispatchEvent(new f.view.Event("scroll"));
			await f.flush();
		}
		assert.deepEqual(
			{ sourceScans, rootWrites },
			{ sourceScans: 0, rootWrites: 0 },
		);
		assert.equal(
			f.backdrop.querySelector("img.is-visible")?.getAttribute("src"),
			"/desktop-a.webp",
		);
	} finally {
		await f.close();
	}
});

test("a stationary image-source change and a failed load still schedule source reconciliation", async () => {
	const f = await fixture("fairytale");
	try {
		await f.flush();
		const first = f.backdrop.querySelector<HTMLImageElement>("img[src]");
		assert.ok(first);
		first.dispatchEvent(new f.view.Event("error"));
		await f.flush();
		const retry = [...f.timers.values()];
		assert.equal(retry.length, 1);
		f.timers.clear();
		retry.forEach((callback) => {
			callback();
		});
		await f.flush();
		assert.equal(
			typeof first.onload,
			"function",
			"the retry must actually start another image request",
		);
		first.dispatchEvent(new f.view.Event("load"));
		await f.flush();
		const active =
			f.view.document.querySelector<HTMLElement>(".slide-item.active");
		assert.ok(active);
		delete active.dataset.wallpaperSrc;
		await f.flush();
		const original = active.querySelector("img");
		assert.ok(original);
		original.setAttribute("src", "/stationary-change.webp");
		await f.flush();
		assert.ok(
			[...f.backdrop.querySelectorAll("img[src]")].some((image) =>
				image.getAttribute("src")?.endsWith("/stationary-change.webp"),
			),
		);
	} finally {
		await f.close();
	}
});

test("mobile blur waits for decoding and retains an opaque outgoing pair until a serialized fade finishes", async () => {
	const f = await fixture("fairytale", 390);
	try {
		await f.flush();
		const sharp = [
			...f.backdrop.querySelectorAll<HTMLImageElement>(
				"[data-fairytale-image]",
			),
		];
		const soft = [
			...f.backdrop.querySelectorAll<HTMLImageElement>(
				"[data-fairytale-soft-image]",
			),
		];
		assert.equal(sharp.length, 2);
		let resolveSoft: () => void = () => {};
		Object.defineProperty(soft[0], "decode", {
			configurable: true,
			value: () =>
				new Promise<void>((r) => {
					resolveSoft = r;
				}),
		});
		sharp[0].dispatchEvent(new f.view.Event("load"));
		await f.flush();
		assert.equal(
			f.view.document.documentElement.dataset.fairytaleReady,
			undefined,
		);
		resolveSoft();
		await f.flush();
		assert.equal(
			f.view.document.documentElement.dataset.fairytaleReady,
			"true",
		);
		f.view.scrollY = 900;
		f.view.dispatchEvent(new f.view.Event("scroll"));
		await f.flush();
		const active = f.view.document.querySelector<HTMLElement>(
			".slide-item.lg\\:hidden.active",
		);
		assert.ok(active);
		active.dataset.wallpaperSrc = "/mobile-next.webp";
		await f.flush();
		Object.defineProperty(soft[1], "decode", {
			configurable: true,
			value: () =>
				new Promise<void>((r) => {
					resolveSoft = r;
				}),
		});
		sharp[1].dispatchEvent(new f.view.Event("load"));
		await f.flush();
		assert.equal(sharp[0].classList.contains("is-visible"), true);
		assert.equal(sharp[1].classList.contains("is-visible"), false);
		resolveSoft();
		await f.flush();
		await f.flush();
		for (const pair of [sharp, soft]) {
			assert.equal(
				pair[0].classList.contains("is-visible"),
				true,
				"outgoing stays opaque",
			);
			assert.equal(
				pair[1].classList.contains("is-visible"),
				true,
				"incoming fades above it",
			);
			assert.ok(Number(pair[1].style.zIndex) > Number(pair[0].style.zIndex));
		}
		assert.match(
			f.view.document.documentElement.style.getPropertyValue(
				"--fairytale-canvas-image",
			),
			/mobile\.webp/,
		);
		active.dataset.wallpaperSrc = "/mobile-third.webp";
		await f.flush();
		assert.ok(
			sharp[0].src.endsWith("/mobile.webp"),
			"visible outgoing slot cannot be recycled mid-fade",
		);
		assert.equal(f.timers.size, 1);
		const complete = [...f.timers.values()][0];
		f.timers.clear();
		sharp[1].style.opacity = soft[1].style.opacity = "0";
		complete();
		await f.flush();
		assert.equal(
			sharp[0].classList.contains("is-visible"),
			true,
			"delayed compositor cannot expose the canvas after the timeout",
		);
		assert.ok(sharp[0].src.endsWith("/mobile.webp"));
		sharp[1].style.opacity = soft[1].style.opacity = "1";
		await f.flush();
		await f.flush();
		assert.equal(sharp[0].classList.contains("is-visible"), false);
		assert.ok(sharp[0].src.endsWith("/mobile-third.webp"));
		assert.match(
			f.view.document.documentElement.style.getPropertyValue(
				"--fairytale-canvas-image",
			),
			/mobile-next\.webp/,
		);
		sharp[0].dispatchEvent(new f.view.Event("error"));
		await f.flush();
		assert.equal(sharp[1].classList.contains("is-visible"), true);
	} finally {
		await f.close();
	}
});
